import {
    eslintBaseConfig,
    eslintPluginReactConfig,
    eslintPluginStylisticConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    globals,
} from "@virtuallyunknown/eslint-config";

import eslintPluginTailwindCss from 'eslint-plugin-tailwindcss';

const eslintPluginTailwindCssConfig = [
    {
        plugins: {
            tailwindcss: eslintPluginTailwindCss,
        },
        rules: eslintPluginTailwindCss.configs.recommended.rules
    }
]

export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
    ...eslintPluginReactConfig,
    ...eslintPluginStylisticConfig,
    ...eslintPluginTailwindCssConfig,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.browser,
            },
        },
        linterOptions: {
            noInlineConfig: false,
            reportUnusedDisableDirectives: true,
        },

    },
    {
        ignores: ["**/*.{js,cjs,mjs}"],
    },
];