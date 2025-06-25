import superjson from 'superjson';
import { shallow } from 'zustand/shallow';
import { createWithEqualityFn } from 'zustand/traditional';
import type { StoreActions, StoreProps } from '../types.js';

import { createTRPCProxyClient, httpBatchLink } from '@trpc/client';
import type { AppRouter } from '@virtuallyunknown/eslint-server/trpc';

const trpc = createTRPCProxyClient<AppRouter>({
    links: [
        httpBatchLink({
            url: 'http://localhost:3000/trpc',
            transformer: superjson,
        }),
    ],
});

export const useStore = createWithEqualityFn<StoreProps & StoreActions>()((set, get) => ({
    name: '',
    dependencies: [],
    rules: [],
    ruleAdditions: [],
    ruleRemovals: [],
    ruleUpgrades: [],
    selectedRule: null,
    prevRule: null,
    nextRule: null,
    page: 'rules',
    filters: {
        enabled: null,
        deprecated: null,
        removed: null,
        recommended: null,
        extendsBaseRule: null,
        handledByTypescript: null,
        hasConfiguration: null,
    },
    toasts: [],
    async addRule(ruleAddition) {
        const result = await trpc.addRule.mutate(ruleAddition);

        if (!result.success) {
            get().createToast({ type: 'error', message: 'Rule insert error. Check console for details.' });
            console.error(result.errors);
        }
        else {
            get().createToast({ type: 'success', message: 'Rule added.' });
            await get().hydrate();
        }
    },
    async updateRule(ruleName, ruleUpdate) {
        const result = await trpc.updateRule.mutate({
            ruleName: ruleName,
            ruleUpdate: ruleUpdate
        });

        if (!result.success) {
            get().createToast({ type: 'error', message: 'Rule update error. Check console for details.' });
            for (const error of result.errors) {
                console.error(error);
            }
        }

        else {
            get().createToast({ type: 'success', message: 'Rule updated.' });
            await get().hydrate();
            // set(() => ({ selectedRule: null, page: 'rules' }))
        }
    },
    async removeRule(ruleName) {
        const result = await trpc.updateRule.mutate({
            ruleName: ruleName,
            ruleUpdate: {
                errorLevel: 0,
                removed: true
            }
        });

        if (!result.success) {
            get().createToast({ type: 'error', message: 'Rule removal error. Check console for details.' });
            for (const error of result.errors) {
                console.error(error);
            }
        }

        else {
            get().createToast({ type: 'success', message: 'Rule removed, it will be disabled from configurations.' });
            await get().hydrate();
        }
    },
    async upgradeRule(ruleUpgrade) {
        console.log(ruleUpgrade);
        const result = await trpc.upgradeRule.mutate(ruleUpgrade);

        if (!result.success) {
            get().createToast({ type: 'error', message: 'Rule upgrade error. Check console for details.' });
            console.error(result.errors);
        }

        else {
            get().createToast({ type: 'success', message: 'Rule upgraded.' });
            await get().hydrate();
        }
    },
    async updateFilter(key, value) {
        const filters = ({
            ...get().filters,
            [key]: value
        });

        set(() => ({ filters: filters }));
        await get().hydrate();
    },

    async validateAllRules() {
        const result = await trpc.validateAllRules.query();

        if (result.length > 0) {
            get().createToast({ type: 'error', message: `${result.length} rules failed validation. Check console for details.` });
            for (const err of result) {
                console.error(err);
            }
        }

        else {
            get().createToast({ type: 'success', message: 'All rules validated successfully.' });
        }
    },

    async writeConfiguration() {
        const result = await trpc.writeConfig.query();

        if (!result.success) {
            console.error(result.errors);
        }

        else {
            get().createToast({ type: 'success', message: 'Rules successfully written to configuration file.' });
        }

    },
    async setPage(page, rule) {
        if (!rule) {
            return set(() => ({ page }));
        }

        const rules = get().rules;
        const dbRule = await trpc.getRuleByName.query(rule.name);
        const ruleIndex = get().rules.findIndex(rule => rule.name === dbRule?.name);

        set(() => ({
            page,
            selectedRule: dbRule,
            prevRule: ruleIndex > 0 ? rules[ruleIndex - 1] : null,
            nextRule: ruleIndex < rules.length ? rules[ruleIndex + 1] : null,
        }));
    },
    createToast(toast) {
        const id = Date.now().toString() + (Math.floor(Math.random() * (99999 - 10000 + 1) + 10000)).toString();

        set(state => ({
            toasts: [...state.toasts, { id: id, type: toast.type, message: toast.message, }]
        }));
    },
    removeToast(id) {
        set(state => ({
            toasts: state.toasts.filter(t => t.id !== id)
        }));
    },
    async hydrate() {
        const { name, rules, dependencies } = await trpc.getDb.query(get().filters);

        /**
         * @see https://github.com/trpc/trpc/issues/5215
         */
        const { ruleAdditions, ruleRemovals, ruleUpgrades } = await trpc.getRuleChanges.query();

        set((state) => ({
            ...state,
            rules,
            name,
            dependencies,
            ruleAdditions,
            ruleRemovals,
            ruleUpgrades: ruleUpgrades
        }));

        // search for active and deprecated or removed rules, then warn the user via toast

        const activeDeprecatedOrRemovedRules = rules.filter(rule => rule.errorLevel > 0 && (rule.deprecated || rule.removed));

        if (activeDeprecatedOrRemovedRules.length > 0) {
            console.log(activeDeprecatedOrRemovedRules);
            get().createToast({ type: 'error', message: `There are ${activeDeprecatedOrRemovedRules.length} active but deprecated/removed rules. Action is required, check log for details.` });
        }
    },
}),
    shallow);

// export function createToast(toast: Omit<Toast, 'id'>) {
//     useStore.getState().createToast(toast);
// }
