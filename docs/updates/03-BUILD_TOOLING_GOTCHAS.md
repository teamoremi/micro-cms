# Dev Update: Build Tooling Gotchas & Monorepo Stability

## [2026-02-03] Build Process Standardization

### **Overview**
Following a series of difficult-to-diagnose build failures, we have identified and resolved a critical pitfall related to our monorepo tooling. This update standardizes the build process for all packages to prevent future occurrences.

---

### **1. The Problem: DTS Generation Failures**
Newly created packages (`@micro-cms/resource-module`, `@micro-cms/express-adapter`) were failing during the build process with a `Cannot find module` error. The error only occurred when `tsup` was generating TypeScript Declaration Files (`.d.ts`).

*   **Symptoms:** The build logs misleadingly suggested a typo (a leading space) in an import path that did not actually exist, making debugging extremely difficult.
*   **Root Cause:** The declaration generation step within `tsup` did not have sufficient context to resolve pnpm workspace dependencies when no local `tsconfig.json` was present. It was unable to "see" the symlinked packages from the monorepo root.

---

### **2. The Solution: Enforced Local `tsconfig.json`**
The issue was resolved by enforcing a new convention across all packages.

*   **New Convention:** Every package built with `tsup` must now contain its own `tsconfig.json` file.
*   **Configuration:** This file extends the base `tsconfig.base.json` and provides a local `rootDir`, which gives the `tsup` DTS generator the necessary context to resolve workspace paths correctly.

```json
// Example tsconfig.json for a package
{
  "extends": "../../tsconfig.base.json",
  "compilerOptions": {
    "baseUrl": ".",
    "rootDir": "./src"
  },
  "include": ["src/**/*.ts"],
  "exclude": ["node_modules", "dist"]
}
```

### **Impact**
This change hardens our CI/CD pipeline and improves developer experience by eliminating a major source of build instability. It ensures that the behavior of our build tools is explicit and consistent across the entire monorepo, rather than relying on implicit, and sometimes faulty, resolution logic.
