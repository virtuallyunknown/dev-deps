import eslintPluginReact from 'eslint-plugin-react';
import eslintPluginReactHooks from 'eslint-plugin-react-hooks';

export const eslintPluginReactConfig = [
    {
        languageOptions: {
            parserOptions: {
                ecmaFeatures: {
                    jsx: true
                }
            }
        },
        plugins: {
            'react': eslintPluginReact,
            'react-hooks': eslintPluginReactHooks
        },
        rules: {}
    }
]