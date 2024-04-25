export const eslintBaseConfig = [
    {
        rules: {
            'eqeqeq': [2, 'always'],
            'for-direction': 2,
            'func-style': [1, 'declaration', { allowArrowFunctions: true }],
            'no-async-promise-executor': 2,
            'no-bitwise': 1,
            'no-cond-assign': [2, 'always'],
            'no-constant-binary-expression': 2,
            'no-debugger': 1,
            'no-fallthrough': [
                1,
                {
                    commentPattern: 'fallthrough',
                    reportUnusedFallthroughComment: true,
                },
            ],
            'no-invalid-regexp': 2,
            'no-param-reassign': [1, { props: false }],
            'no-promise-executor-return': [2, { allowVoid: true }],
            'no-prototype-builtins': 1,
            'no-return-assign': 2,
            'no-unsafe-finally': 1,
            'no-unsafe-optional-chaining': [
                2,
                { disallowArithmeticOperators: true },
            ],
            'no-useless-catch': 1,
            'prefer-const': [1, { destructuring: 'all' }],
            'use-isnan': [
                2,
                { enforceForSwitchCase: true, enforceForIndexOf: true },
            ],
        },
    },
];
