import typescriptEslint from 'typescript-eslint';

export const eslintPluginTypescriptConfig = [
    {
        languageOptions: {
            parser: typescriptEslint.parser,
            parserOptions: {
                project: true
            }
        },
        plugins: {
            '@typescript-eslint': typescriptEslint.plugin,
        },
        rules: {}
    }
]