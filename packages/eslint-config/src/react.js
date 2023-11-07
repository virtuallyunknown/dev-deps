module.exports = {
    "plugins": [
        "react",
        "react-hooks"
    ],
    "parserOptions": {
        "ecmaFeatures": {
            "jsx": true
        }
    },
    "rules": {
        "react/jsx-key": [
            1,
            {
                "warnOnDuplicates": true
            }
        ],
        "react/jsx-no-leaked-render": 1,
        "react/no-deprecated": 1,
        "react/self-closing-comp": [
            1,
            {
                "component": true,
                "html": false
            }
        ],
        "react/void-dom-elements-no-children": 1,
        "react-hooks/exhaustive-deps": 1,
        "react-hooks/rules-of-hooks": 2
    }
}