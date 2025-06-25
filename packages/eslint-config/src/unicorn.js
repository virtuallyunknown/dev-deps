import eslintPluginUnicorn from 'eslint-plugin-unicorn';

export const eslintPluginUnicornConfig = [
    {
        plugins: {
            unicorn: eslintPluginUnicorn,
        },
        rules: {
            'unicorn/new-for-builtins': 2,
            'unicorn/no-await-in-promise-methods': 1,
            'unicorn/no-invalid-remove-event-listener': 2,
            'unicorn/no-unnecessary-await': 1,
            'unicorn/no-useless-fallback-in-spread': 2,
            'unicorn/prefer-import-meta-properties': 1,
            'unicorn/prefer-json-parse-buffer': 1,
            'unicorn/prefer-node-protocol': 1,
        },
    },
];
