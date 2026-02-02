# Development Pitfalls & Gotchas

This document tracks the "hard-learned" lessons encountered during the development of Micro-CMS.

## 1. ESM vs CommonJS (The Vite Trap)
**Pitfall:** Modern frontend tools (Vite, Browser) expect **ES Modules** (`export/import`), but default TypeScript configurations often output **CommonJS** (`module.exports/require`).
**Symptoms:** `Uncaught SyntaxError: The requested module does not provide an export named 'createApp'`.
**Solution:** Ensure `tsconfig.json` has `"module": "ESNext"` and `"moduleResolution": "node"`, and all `package.json` files contain `"type": "module"`.

## 2. Monorepo Internal Dependencies (`workspace:*`)
**Pitfall:** Using `"@micro-cms/types": "workspace:*"` is perfect for local development but **catastrophic for npm publishing**.
**Symptoms:** `ERR_PNPM_WORKSPACE_PKG_NOT_FOUND` when a user installs your package from npm. The package manager tries to find the workspace locally on the user's machine.
**Solution:** Before publishing, all `workspace:*` references must be converted to actual semver versions (e.g., `^0.0.5`).

## 3. The "Regex-on-JSON" Danger Zone
**Pitfall:** Using `sed` or regular expressions to update `package.json` files.
**Symptoms:** Corrupted JSON files where `devDependencies` are nested inside `scripts`, or invalid package names like `@@[your-name]types`.
**Solution:** **Always use `jq`** for programmatic JSON manipulation. It ensures the structure remains valid and handles object nesting correctly.

## 4. React State & Null Initial Data
**Pitfall:** Initializing `useState(initialData)` where `initialData` might be `null` (e.g., during a fetch or before a selection).
**Symptoms:** `Uncaught TypeError: Cannot read properties of null (reading 'id')` inside the `render` cycle.
**Solution:** Defensive initialization: `const [formData, setFormData] = useState(initialData || {})`. Also, use `useEffect` to synchronize the state if `initialData` changes after the first mount.

## 5. npm Scopes & Organizations
**Pitfall:** Trying to publish `@scope/package` without owning the scope on npm.
**Symptoms:** `404 Not Found - Scope not found` or `403 Forbidden`.
**Solution:** You must create an **npm Organization** with the exact name of the scope (`micro-cms`) and be logged in with a user that has publishing permissions for that org.

## 6. Dependency Synchronization Lag
**Pitfall:** Updating the version of `@micro-cms/types` to `0.0.5` but forgetting to update the `dependencies` entry in `@micro-cms/core`.
**Symptoms:** Build errors or runtime crashes because the older version of the dependency is being pulled from the registry instead of the new local one.
**Solution:** A programmatic sync step in the release script (see `publish.sh`).
