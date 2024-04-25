import {
    eslintBaseConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    globals
} from "@virtuallyunknown/eslint-config";

export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
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