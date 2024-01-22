module.exports = {
    root: true,
    extends: [
        '@virtuallyunknown/eslint-config',
        '@virtuallyunknown/eslint-config/react',
        '@virtuallyunknown/eslint-config/stylistic',
    ],
    // parser: '@typescript-eslint/parser',
    // plugins: [
    //     '@typescript-eslint',
    //     'react',
    //     'unicorn',
    //     '@stylistic' 
    // ],
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
        // ecmaVersion: "latest",
        // sourceType: "module"
    },
    ignorePatterns: ['*.*', '!src/**/*'],
};

