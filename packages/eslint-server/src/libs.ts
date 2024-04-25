import type { BaseRule, ESLintRule, RawLibData, Rule } from './types.js';
import { baseRuleSchema, libraries, packageJSONSchema, ruleSchema } from './types.js';

import eslintStyle from '@stylistic/eslint-plugin';
import eslintTypeScript from '@typescript-eslint/eslint-plugin';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintUnicorn from 'eslint-plugin-unicorn';
import eslintBase from 'eslint/use-at-your-own-risk';
import { execSync } from 'node:child_process';

const rules: RawLibData = {
    'eslint': {
        prefix: null,
        rules: Object.fromEntries(eslintBase.builtinRules) as Record<string, ESLintRule>
    },
    '@typescript-eslint/eslint-plugin': {
        prefix: '@typescript-eslint',
        rules: eslintTypeScript.rules as Record<string, ESLintRule>
    },
    'eslint-plugin-unicorn': {
        prefix: 'unicorn',
        rules: eslintUnicorn.rules as Record<string, ESLintRule>
    },
    'eslint-plugin-react': {
        prefix: 'react',
        rules: eslintReact.rules as Record<string, ESLintRule>
    },
    'eslint-plugin-react-hooks': {
        prefix: 'react-hooks',
        rules: eslintReactHooks.rules as Record<string, ESLintRule>
    },
    '@stylistic/eslint-plugin': {
        prefix: '@stylistic',
        rules: eslintStyle.rules as Record<string, ESLintRule>
    },
};

function isRecommended(item?: boolean | string | { recommended: boolean }) {
    if (typeof item === 'string' && item.length > 0) {
        return true;
    }
    if (typeof item === 'boolean') {
        return item;
    }
    if (typeof item === 'object') {
        return item.recommended;
    }
    return false;
}

/**
 * Create a flat array of all available rules,
 * and add extra keys for rule and library names.
 */
export function getBaseRules() {
    const ruleList = Object.entries(rules).flatMap(([libName, libData]) => {
        return Object.entries(libData.rules).map(([ruleName, ruleData]) => {
            return ({
                name: libData.prefix ? `${libData.prefix}/${ruleName}` : ruleName,
                description: ruleData.meta.docs.description,
                url: ruleData.meta.docs.url,
                library: libName,
                type: ruleData.meta.type,
                deprecated: ruleData.meta.deprecated,
                recommended: isRecommended(ruleData.meta.docs.recommended),
                fixable: ruleData.meta.fixable,
                hasSuggestions: ruleData.meta.hasSuggestions,
                extendsBaseRule: ruleData.meta.docs.extendsBaseRule,
                requiresTypeChecking: ruleData.meta.docs.requiresTypeChecking,
                replacedBy: ruleData.meta.replacedBy,
                schema: ruleData.meta.schema,
            });
        });
    });

    return ruleList.reduce<BaseRule[]>((acc, curr) => {
        const parsed = baseRuleSchema.safeParse(curr);

        if (!parsed.success) {
            console.error(parsed.error);
            console.error(curr);
            process.exit(1);
        }

        return [...acc, parsed.data];
    }, []);
}

export function getDefaultRules() {
    const ruleList = getBaseRules();

    return ruleList.reduce<Rule[]>((acc, curr) => {
        const parsed = ruleSchema.safeParse(curr);

        if (!parsed.success) {
            console.error(parsed.error);
            console.error(curr);
            process.exit(1);
        }

        return [...acc, parsed.data];
    }, []);
}

export function getPackageJSON() {
    const packageJSON = JSON.parse(execSync('npm ls --json', { encoding: 'utf-8' })) as unknown;
    const parsedJSON = packageJSONSchema.parse(packageJSON);

    const dependencies = Object.entries(parsedJSON.dependencies).reduce<Record<string, string>[]>((acc, [key, value]) => {
        if (libraries.includes(key as typeof libraries[number])) {
            acc.push({ [key]: value.version });
        }
        return acc;
    }, []);

    return ({
        name: parsedJSON.name,
        dependencies
    });
}