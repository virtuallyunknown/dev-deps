import {
    eslintBaseConfig,
    eslintPluginStylisticConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    globals
} from "@virtuallyunknown/eslint-config";

export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
    ...eslintPluginStylisticConfig,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            globals: {
                ...globals.nodeBuiltin,
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