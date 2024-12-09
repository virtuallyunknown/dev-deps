### Note on pnpm

If not using workspace protocol ("workspace:^1.5.0") and having fixed version numbers
for internal packages, other packages that import them have to import the EXACT version,
otherwise when you run pnpm install it will try to resolve that first, and if it does
NOT match it will try to install it from the npm registry and throw a very confusing
error.

### Debug eslint config

pnx eslint --print-config ./eslintrc.cjs

### ESLint plugin related versioning

Prefer fixed versions in package.json. If we use semver range such as ^, updates could
quietly install newer version, even though in package.json it will output 9.4 for example,
but the installed version could be 9.8, leading to some confusion.

Running pnpm update will still work and offer updates.
