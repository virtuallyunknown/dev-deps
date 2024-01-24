module.exports = {
    "env": {
        "es2024": true
    },
    "plugins": [
        "@typescript-eslint",
        "unicorn"
    ],
    "parser": "@typescript-eslint/parser",
    "parserOptions": {
        "ecmaVersion": "latest",
        "sourceType": "module"
    },
    "rules": {
        "eqeqeq": [
            2,
            "always"
        ],
        "for-direction": 2,
        "func-style": [
            1,
            "declaration",
            {
                "allowArrowFunctions": true
            }
        ],
        "no-async-promise-executor": 2,
        "no-bitwise": 1,
        "no-cond-assign": [
            2,
            "always"
        ],
        "no-constant-binary-expression": 2,
        "no-debugger": 1,
        "no-fallthrough": [
            1,
            {
                "commentPattern": "fallthrough"
            }
        ],
        "no-invalid-regexp": 2,
        "no-param-reassign": [
            1,
            {
                "props": false
            }
        ],
        "no-promise-executor-return": [
            2,
            {
                "allowVoid": true
            }
        ],
        "no-prototype-builtins": 1,
        "no-return-assign": 2,
        "no-unsafe-finally": 1,
        "no-unsafe-optional-chaining": [
            2,
            {
                "disallowArithmeticOperators": true
            }
        ],
        "no-useless-catch": 1,
        "prefer-const": [
            1,
            {
                "destructuring": "all"
            }
        ],
        "use-isnan": [
            2,
            {
                "enforceForSwitchCase": true,
                "enforceForIndexOf": true
            }
        ],
        "@typescript-eslint/await-thenable": 1,
        "@typescript-eslint/ban-types": 1,
        "@typescript-eslint/consistent-type-exports": 1,
        "@typescript-eslint/consistent-type-imports": 1,
        "@typescript-eslint/explicit-member-accessibility": [
            1,
            {
                "accessibility": "explicit",
                "overrides": {
                    "constructors": "off"
                }
            }
        ],
        "@typescript-eslint/no-explicit-any": [
            1,
            {
                "ignoreRestArgs": true
            }
        ],
        "@typescript-eslint/no-floating-promises": [
            2,
            {
                "ignoreVoid": true,
                "ignoreIIFE": true
            }
        ],
        "@typescript-eslint/no-loss-of-precision": 2,
        "@typescript-eslint/no-misused-promises": [
            2,
            {
                "checksVoidReturn": {
                    "attributes": false
                }
            }
        ],
        "@typescript-eslint/no-non-null-assertion": 1,
        "@typescript-eslint/no-redundant-type-constituents": 1,
        "@typescript-eslint/no-shadow": [
            1,
            {
                "hoist": "all"
            }
        ],
        "@typescript-eslint/no-throw-literal": 1,
        "@typescript-eslint/no-unnecessary-condition": [
            1,
            {
                "allowConstantLoopConditions": true
            }
        ],
        "@typescript-eslint/no-unsafe-assignment": 1,
        "@typescript-eslint/no-unsafe-member-access": 1,
        "@typescript-eslint/prefer-as-const": 1,
        "@typescript-eslint/prefer-nullish-coalescing": [
            1,
            {
                "ignoreTernaryTests": true,
                "ignoreConditionalTests": true,
                "ignoreMixedLogicalExpressions": true
            }
        ],
        "@typescript-eslint/prefer-optional-chain": 1,
        "@typescript-eslint/prefer-ts-expect-error": 1,
        "@typescript-eslint/require-await": 1,
        "@typescript-eslint/switch-exhaustiveness-check": [
            1,
            {
                "requireDefaultForNonUnion": true
            }
        ],
        "unicorn/new-for-builtins": 2,
        "unicorn/no-invalid-remove-event-listener": 2,
        "unicorn/no-unnecessary-await": 1,
        "unicorn/no-useless-fallback-in-spread": 2,
        "unicorn/prefer-json-parse-buffer": 1,
        "unicorn/prefer-node-protocol": 1
    }
}