import { execSync } from 'node:child_process';
import type { BaseRule, RawLibData, Rule } from './types.js';
import { baseRuleSchema, libraries, packageJSONSchema, ruleSchema } from './types.js';

import eslintStyle from '@stylistic/eslint-plugin';
import eslintTypeScript from '@typescript-eslint/eslint-plugin';
import eslintBase from "eslint";
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintUnicorn from 'eslint-plugin-unicorn';

const rules: RawLibData = {
    'eslint': {
        prefix: null,
        rules: Object.fromEntries(new eslintBase.Linter().getRules())
    },
    '@typescript-eslint/eslint-plugin': {
        prefix: '@typescript-eslint',
        rules: eslintTypeScript.rules
    },
    'eslint-plugin-unicorn': {
        prefix: 'unicorn',
        rules: eslintUnicorn.rules
    },
    'eslint-plugin-react': {
        prefix: 'react',
        rules: eslintReact.rules
    },
    'eslint-plugin-react-hooks': {
        prefix: 'react-hooks',
        rules: eslintReactHooks.rules
    },
    '@stylistic/eslint-plugin': {
        prefix: '@stylistic',
        rules: eslintStyle.rules
    },
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
                recommended: ruleData.meta.docs.recommended,
                fixable: ruleData.meta.fixable,
                hasSuggestions: ruleData.meta.hasSuggestions,
                extendsBaseRule: ruleData.meta.docs.extendsBaseRule,
                requiresTypeChecking: ruleData.meta.docs.requiresTypeChecking,
                replacedBy: ruleData.meta.replacedBy,
                schema: ruleData.meta.schema,
            })
        })
    });

    return ruleList.reduce<BaseRule[]>((acc, curr) => {
        const parsed = baseRuleSchema.safeParse(curr);

        if (!parsed.success) {
            console.error(parsed.error);
            console.error(curr);
            process.exit(1)
        }

        return [...acc, parsed.data]
    }, [])
}

export function getDefaultRules() {
    const ruleList = getBaseRules();

    return ruleList.reduce<Rule[]>((acc, curr) => {
        const parsed = ruleSchema.safeParse(curr);

        if (!parsed.success) {
            console.error(parsed.error);
            console.error(curr);
            process.exit(1)
        }

        return [...acc, parsed.data]
    }, [])
}

export function getPackageJSON() {
    const packageJSON = JSON.parse(execSync('npm ls --json', { encoding: 'utf-8' }));
    const dependencies = packageJSON.dependencies;

    const res = Object.entries(dependencies).reduce<any[]>((acc, [key, value]) => {
        if (libraries.includes(key as any)) {
            acc.push({ [key]: (value as any).version })
        }
        return acc;
    }, []);

    return packageJSONSchema.parse({
        name: packageJSON.name,
        dependencies: res
    });
}