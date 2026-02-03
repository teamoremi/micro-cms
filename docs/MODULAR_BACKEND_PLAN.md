# Implementation Plan: Backend Modularization & Crypto Payment Module

## 1. Standardizing Backend Modules (Route Registry)

Currently, backend routes in `node_api` are hard-coded. To make them composable, we need a standard interface for route registration.

### **The "Route-Provider" Ability**
We will define a new ability `route-provider` that backend modules can register.

**Concept:**
Instead of modules knowing about Express or Hono, they will provide a generic route definition.

```typescript
// Interface Idea (No code implementation yet)
interface RouteDefinition {
  method: 'GET' | 'POST' | 'PATCH' | 'DELETE';
  path: string;
  handler: (req: any, res: any) => Promise<void>;
  middleware?: string[]; // References to registered middleware keys
}

interface BackendModule {
  getRoutes(): RouteDefinition[];
}
```

### **Architecture Plan:**
1.  **Generic Router Capability:** A core capability `http-router` will be provided by framework adapters (e.g., `@micro-cms/express-adapter` or `@micro-cms/hono-adapter`).
2.  **Route Registration:**
    *   Modules (like `@micro-cms/admin-api`) will use `runtime.getCapability('http-router')` to register their endpoints.
    *   Standard CRUD routes will be moved into a standalone module `@micro-cms/resource-module`.
3.  **Cross-Module Handlers:**
    *   One module can provide the route (path/method), while another module can provide the handler logic by subscribing to an event or registering a callback.

### **Specific Update for `node_api`:**
*   Move `node_api/src/routes/admin/resources.ts` logic into a reusable `admin-api-module`.
*   Create a "Runtime Wrapper" for Express that iterates through loaded modules and binds their `RouteDefinitions` to the Express instance.

---

## 2. Crypto Payment Frontend Module

A new module `@micro-cms/crypto-payments` will be created to handle on-chain transactions directly within the Admin UI.

### **Core Features:**
*   **Wallet Integration:** Support for MetaMask (EVM) and Phantom (Solana).
*   **Payment Flow:**
    1.  User triggers a "Pay" action on a resource (e.g., an Order).
    2.  Module opens the Off-canvas side panel with payment details.
    3.  User connects wallet and signs transaction.
    4.  Module monitors on-chain confirmation.
*   **Backend Sync:** Once confirmed on-chain, the module calls the backend API to update the record status (e.g., `status: 'paid'`).

### **Implementation Strategy:**
1.  **Frontend Module:** Registers as a UI extension. It can contribute "Action Buttons" to the `AutoTable`.
2.  **Off-canvas Integration:** Uses the newly implemented `OffCanvas` component to show the payment status and QR codes.
3.  **On-chain Validation:** Use libraries like `ethers.js` or `@solana/web3.js` (loaded only when needed).
4.  **Security:** Implement client-side verification of transaction signatures before notifying the backend.

---

## 3. Documentation Update

I will add these plans to `micro-cms/docs/DESIGN_PATTERN.md` to ensure they align with the project's long-term vision.
