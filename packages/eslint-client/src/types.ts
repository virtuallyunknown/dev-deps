import type { BaseRule, Dependencies, ExtendedRule, Rule, RuleFilters, RuleUpgrade } from '@virtuallyunknown/eslint-server/types';

// export type RuleUpdate = Partial<Record<keyof ExtendedRule, string | number | boolean | object>>;

export type RuleUpdate = {
    [K in keyof ExtendedRule]+?: ExtendedRule[K];
};

export type Toast = {
    id: string;
    type: 'success' | 'error';
    message: string;
};

export type StoreProps = {
    name: string;
    dependencies: Dependencies;
    rules: Rule[];
    ruleAdditions: BaseRule[];
    ruleRemovals: BaseRule[];
    ruleUpgrades: RuleUpgrade[];
    selectedRule: Rule | null;
    prevRule: Rule | null;
    nextRule: Rule | null;
    filters: RuleFilters;
    page: 'rules' | 'upgrades' | 'additions' | 'removals' | 'project' | 'editor';
    toasts: Toast[];
};

export type StoreActions = {
    hydrate: () => Promise<void>;
    updateFilter: <K extends keyof RuleFilters, V extends RuleFilters>(key: K, value: V[K]) => Promise<void>;
    addRule: (ruleAddition: BaseRule) => Promise<void>;
    updateRule: (ruleName: string, ruleUpdate: RuleUpdate) => Promise<void>;
    removeRule: (ruleName: string) => Promise<void>;
    upgradeRule: (ruleUpgrade: BaseRule) => Promise<void>;
    validateAllRules: () => Promise<void>;
    writeConfiguration: () => Promise<void>;
    setPage: (page: StoreProps['page'], rule?: Rule) => Promise<void>;
    createToast: (toast: Omit<Toast, 'id'>) => void;
    removeToast: (id: Toast['id']) => void;
};