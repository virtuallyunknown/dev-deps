import eslintStyle from '@stylistic/eslint-plugin';
import eslintReact from 'eslint-plugin-react';
import eslintReactHooks from 'eslint-plugin-react-hooks';
import eslintUnicorn from 'eslint-plugin-unicorn';
import eslintBase from 'eslint/use-at-your-own-risk';
import eslintTypeScript from 'typescript-eslint';
import type { ESLintRule, RawLibData } from './types.js';

const rules: RawLibData = {
    'eslint': {
        prefix: null,
        rules: Object.fromEntries(eslintBase.builtinRules) as Record<string, ESLintRule>
    },
    'typescript-eslint': {
        prefix: '@typescript-eslint',
        rules: eslintTypeScript.plugin.rules as Record<string, ESLintRule>
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

const ruleData = {
    'eslint': {
        baseProps: new Set(),
        fixableTypes: new Set(),
        typeTypes: new Set(),
    },
    'typescript-eslint': {
        baseProps: new Set(),
        fixableTypes: new Set(),
        typeTypes: new Set(),
    },
    'eslint-plugin-unicorn': {
        baseProps: new Set(),
        fixableTypes: new Set(),
        typeTypes: new Set(),
    },
    'eslint-plugin-react': {
        baseProps: new Set(),
        fixableTypes: new Set(),
        typeTypes: new Set(),
    },
    'eslint-plugin-react-hooks': {
        baseProps: new Set(),
        fixableTypes: new Set(),
        typeTypes: new Set(),
    },
    '@stylistic/eslint-plugin': {
        baseProps: new Set(),
        fixableTypes: new Set(),
        typeTypes: new Set(),
    },
};

function isKeyOfObject<T extends object>(key: string, object: T): key is keyof T & string {
    return key in object;
}

const flatRules = Object.entries(rules).flatMap(([libName, libData]) => {
    return Object.entries(libData.rules).map(([ruleName, ruleData]) => {
        return ({
            name: libData.prefix ? `${libData.prefix}/${ruleName}` : ruleName,
            library: libName,
            ...ruleData
        });
    });
});

for (const rule of flatRules) {
    // eslint-disable-next-line @typescript-eslint/no-unnecessary-condition
    if (!rule.meta) {
        throw new Error('Rule is missing meta data');
    }

    if (!isKeyOfObject(rule.library, ruleData)) {
        throw new Error(`Library ${rule.library} is not in ruleData`);
    }

    for (const key of Object.keys(rule.meta)) {
        ruleData[rule.library].baseProps.add(key);
    }

    ruleData[rule.library].typeTypes.add(rule.meta.type);
    ruleData[rule.library].fixableTypes.add(rule.meta.fixable);

    // if (!rule.meta.schema || !rule.meta.schema.length) {
    //     console.log(`@${rule.library}/${rule.name}`);
    //     console.log(rule.meta.docs.url);
    // }

    // if (Array.isArray(rule.meta.schema)) {
    //     console.log('ARRAY');
    //     console.log(rule.meta.schema.length);
    //     if (rule.meta.schema.length === 0) {
    //         console.log(rule.name);
    //         console.log(rule.library);
    //     }
    // }
    // else if (typeof rule.meta.schema === 'object') {
    //     console.log('OBJECT');
    // }
    // else if (!rule.meta.schema) {
    //     console.log('NONE');
    // }
    // else {
    //     console.log('OTHER');
    // }

    console.log(
        rule.meta.docs.recommended
    );
}