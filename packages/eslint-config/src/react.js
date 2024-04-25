import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export const eslintPluginReactConfig = [
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true,
                },
            },
        },
        plugins: {
            'react': eslintPluginReact,
            'react-hooks': eslintPluginReactHooks,
        },
        rules: {
            'react/checked-requires-onchange-or-readonly': 1,
            'react/jsx-key': [1, { warnOnDuplicates: true }],
            'react/jsx-no-leaked-render': 1,
            'react/no-deprecated': 1,
            'react/self-closing-comp': [1, { component: true, html: false }],
            'react/void-dom-elements-no-children': 1,
            'react-hooks/exhaustive-deps': 1,
            'react-hooks/rules-of-hooks': 2,
        },
    },
];
