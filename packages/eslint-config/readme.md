### This package includes the following eslint configurations:

-   @virtuallyunknown/eslint-config (**default**)
-   @virtuallyunknown/eslint-config/stylistic
-   @virtuallyunknown/eslint-config/react

### Installation:

1. Install the package:

```zsh
npm i @virtuallyunknown/eslint-config
pnpm add @virtuallyunknown/eslint-config
```

1. Create `.eslintrc.cjs` file and add the following:

```js
module.exports = {
    extends: [
        "@virtuallyunknown/eslint-config",
        "@virtuallyunknown/eslint-config/stylistic",
        "@virtuallyunknown/eslint-config/react",
    ],

    /* stops looking in parent folders once it finds a configuration with "root": true */
    root: true,

    /* node or browser */
    env: {
        node: true,
        browser: true,
    },

    /* other common options */
    parserOptions: {
        project: "./tsconfig.json",
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ["*.*", "!src/**/*"],
};
```

### List of dependencies:

-   [eslint](https://eslint.org)
-   [@typescript-eslint/eslint-plugin](https://typescript-eslint.io)
-   [@typescript-eslint/parser](https://typescript-eslint.io)
-   [eslint-plugin-unicorn](https://github.com/sindresorhus/eslint-plugin-unicorn)
-   [@stylistic/eslint-plugin](https://eslint.style)
-   [eslint-plugin-react](https://github.com/jsx-eslint/eslint-plugin-react)
-   [eslint-plugin-react-hooks](https://github.com/facebook/react/tree/main/packages/eslint-plugin-react-hooks)
