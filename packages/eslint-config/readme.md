### Installation:

1. Install the package **and** eslint:

```zsh
pnpm add eslint @virtuallyunknown/eslint-config -D
```

1. Create `eslint.config.js` file and add the following:

```js
import {
    eslintBaseConfig,
    eslintPluginTypescriptConfig,
    eslintPluginUnicornConfig,
    eslintPluginReactConfig,
    eslintPluginStylisticConfig,
    globals,
} from "@virtuallyunknown/eslint-config";

/** @type {import('@typescript-eslint/utils').TSESLint.FlatConfig.ConfigFile} */
export default [
    ...eslintBaseConfig,
    ...eslintPluginTypescriptConfig,
    ...eslintPluginUnicornConfig,
    ...eslintPluginReactConfig,
    ...eslintPluginStylisticConfig,
    {
        files: ["src/**/*.{ts,tsx}"],
        languageOptions: {
            /**
             * parserOptions.project is optional since it's
             * included in the typescript plugin configuration.
             */
            parserOptions: {
                project: true,
            },
            globals: {
                /**
                 * or other environments
                 */
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
```

### Additional configurations (not bundled with this package)

#### [eslint-plugin-tailwindcss](https://github.com/francoismassart/eslint-plugin-tailwindcss)

```zsh
npm i eslint-plugin-tailwindcss -D
pnpm add eslint-plugin-tailwindcss -D
```

```js
import eslintPluginTailwindCss from "eslint-plugin-tailwindcss";

const eslintPluginTailwindCssConfig = [
    {
        plugins: {
            tailwindcss: eslintPluginTailwindCss,
        },
        rules: eslintPluginTailwindCss.configs.recommended.rules,
    },
];
```

### List of dependencies:

- [eslint](https://eslint.org)
- [typescript-eslint](https://typescript-eslint.io)
- [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
- [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
- [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
- [@stylistic/eslint-plugin](https://eslint.style)
- [globals](https://github.com/sindresorhus/globals)
