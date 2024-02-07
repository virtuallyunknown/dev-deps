### This package includes the following typescript configurations:

-   @virtuallyunknown/tsconfig.node.json
-   @virtuallyunknown/tsconfig.react.json
-   @virtuallyunknown/tsconfig.web.json

### Installation:

1. Install the package:

```zsh
npm i @virtuallyunknown/tsconfig
pnpm add @virtuallyunknown/tsconfig
```

1. Create `tsconfig.json` file and add the following:

```json
{
    "extends": ["@virtuallyunknown/tsconfig/tsconfig.node.json"],
    "include": ["./src/"],
    "exclude": ["**/node_modules", "**/.*/"]
}
```
