import stylistic from '@stylistic/eslint-plugin';

export const eslintPluginStylisticConfig = [
    {
        plugins: {
            '@stylistic': stylistic,
        },
        rules: {
            '@stylistic/array-element-newline': [
                1,
                { consistent: true, multiline: true },
            ],
            '@stylistic/brace-style': [
                1,
                'stroustrup',
                { allowSingleLine: true },
            ],
            '@stylistic/function-call-argument-newline': [1, 'consistent'],
            '@stylistic/function-paren-newline': [1, 'consistent'],
            '@stylistic/jsx-curly-brace-presence': [
                1,
                {
                    props: 'never',
                    children: 'never',
                    propElementValues: 'always',
                },
            ],
            '@stylistic/jsx-curly-newline': [1, 'consistent'],
            '@stylistic/jsx-quotes': [1, 'prefer-single'],
            '@stylistic/jsx-self-closing-comp': [
                1,
                { component: true, html: false },
            ],
            '@stylistic/jsx-sort-props': [
                1,
                {
                    callbacksLast: true,
                    shorthandLast: true,
                    reservedFirst: true,
                },
            ],
            '@stylistic/jsx-tag-spacing': [
                1,
                {
                    closingSlash: 'never',
                    beforeSelfClosing: 'always',
                    afterOpening: 'never',
                    beforeClosing: 'never',
                },
            ],
            '@stylistic/jsx-wrap-multilines': [
                1,
                {
                    declaration: 'ignore',
                    assignment: 'ignore',
                    return: 'parens-new-line',
                    arrow: 'parens-new-line',
                    condition: 'ignore',
                    logical: 'ignore',
                    prop: 'ignore',
                },
            ],
            '@stylistic/member-delimiter-style': [
                1,
                {
                    multiline: { delimiter: 'semi', requireLast: true },
                    singleline: { delimiter: 'comma', requireLast: false },
                    multilineDetection: 'brackets',
                },
            ],
            '@stylistic/multiline-ternary': [1, 'always-multiline'],
            '@stylistic/object-curly-newline': [1, { consistent: true }],
            '@stylistic/quote-props': [1, 'consistent-as-needed'],
            '@stylistic/quotes': [
                1,
                'single',
                { allowTemplateLiterals: 'always' },
            ],
            '@stylistic/semi': [
                1,
                'always',
                {
                    omitLastInOneLineBlock: false,
                    omitLastInOneLineClassBody: false,
                },
            ],
        },
    },
];
