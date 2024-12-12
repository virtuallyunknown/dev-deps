import typescriptEslint from 'typescript-eslint';

export const eslintPluginTypescriptConfig = [
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: true,
            },
        },
        plugins: {
            '@typescript-eslint': typescriptEslint.plugin,
        },
        rules: {
            '@typescript-eslint/await-thenable': 1,
            '@typescript-eslint/ban-ts-comment': [
                1,
                {
                    'ts-ignore': 'allow-with-description',
                    'ts-nocheck': 'allow-with-description',
                },
            ],
            '@typescript-eslint/consistent-type-exports': 1,
            '@typescript-eslint/consistent-type-imports': 1,
            '@typescript-eslint/explicit-member-accessibility': [
                1,
                {
                    accessibility: 'explicit',
                    overrides: { constructors: 'off' },
                },
            ],
            '@typescript-eslint/method-signature-style': [1, 'property'],
            '@typescript-eslint/no-explicit-any': [1, { ignoreRestArgs: true }],
            '@typescript-eslint/no-floating-promises': [
                2,
                { ignoreVoid: true, ignoreIIFE: true },
            ],
            '@typescript-eslint/no-loss-of-precision': 2,
            '@typescript-eslint/no-misused-promises': [
                2,
                { checksVoidReturn: { arguments: false, attributes: false } },
            ],
            '@typescript-eslint/no-non-null-assertion': 1,
            '@typescript-eslint/no-redundant-type-constituents': 1,
            '@typescript-eslint/no-unnecessary-condition': [
                1,
                { allowConstantLoopConditions: true },
            ],
            '@typescript-eslint/no-unsafe-assignment': 1,
            '@typescript-eslint/no-unsafe-member-access': 1,
            '@typescript-eslint/only-throw-error': 1,
            '@typescript-eslint/prefer-as-const': 1,
            '@typescript-eslint/prefer-nullish-coalescing': [
                1,
                {
                    ignoreTernaryTests: true,
                    ignoreConditionalTests: true,
                    ignoreMixedLogicalExpressions: true,
                },
            ],
            '@typescript-eslint/prefer-optional-chain': 1,
            '@typescript-eslint/require-await': 1,
            '@typescript-eslint/switch-exhaustiveness-check': [
                1,
                { requireDefaultForNonUnion: true },
            ],
        },
    },
];
