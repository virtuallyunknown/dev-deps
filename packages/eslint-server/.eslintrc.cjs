// module.exports = {
//     root: true,
//     extends: ["plugin:tailwindcss/recommended"],
//     overrides: [
//         {
//             files: ['*.ts', '*.tsx', '*.js'],
//             parser: '@typescript-eslint/parser',
//         },
//     ],
// };  

module.exports = {
    root: true,
    extends: [
        '@virtuallyunknown/eslint-config',
        '@virtuallyunknown/eslint-config/stylistic',
    ],
    parserOptions: {
        project: './tsconfig.json',
        tsconfigRootDir: __dirname,
    },
    ignorePatterns: ['*.*', '!src/**/*'],
};

