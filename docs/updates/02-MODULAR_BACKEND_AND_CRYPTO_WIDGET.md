# Feature Updates

## [2026-02-03] Modular Backend Routing & Composable Crypto Payments

### **Overview**
This update marks a major architectural shift towards **Total Composability**. We have decoupled the backend logic from the web framework and introduced a standalone, drop-in crypto payment system.

---

### **1. Modular Backend (Route-Provider Ability)**
Previously, backend routes were hard-coded into the application (e.g., Express). We have now implemented a generic **Routing Engine** within the CMS core.

*   **Generic Route Definitions:** Modules now register `RouteDefinition` objects (method, path, handler) instead of binding directly to a framework.
*   **The Route-Provider:** A new capability that allows any module to contribute API endpoints to the system.
*   **Framework Adapters:** We introduced `@micro-cms/express-adapter`, which automatically discovers all registered routes and binds them to an Express app.
*   **Portable Logic:** The new `@micro-cms/resource-module` contains all CRUD and Schema logic. It can now run on **Express, Hono (Edge Workers), or Fastify** without changing a single line of business logic.

**UX benefit for Devs:** Zero boilerplate for adding new API endpoints. Just register a handler, and the adapter handles the rest.

---

### **2. Composable Crypto Payment Widget**
We have released `@micro-cms/crypto-payments`, a specialized package designed to bridge Web2 applications with Web3 payments.

*   **The `<PaymentWidget />`:** A drop-in React component that handles the entire payment lifecycle (Wallet connection, Transaction signing, and On-chain verification).
*   **Headless `usePayment` Hook:** For developers who want full UI control while reusing our robust blockchain interaction logic.
*   **The "Handshake" Protocol:** The widget is designed to work with any backend implementing two standard endpoints:
    *   `POST /initiate`: Calculates amounts and provides a destination address.
    *   `POST /verify-payment`: Validates the transaction on-chain.
*   **Visual Integration:** Fully compatible with the new `OffCanvas` system, allowing for a seamless "Drawer-based" checkout experience.

**UX benefit:** Users can pay for resources (Orders, Subscriptions) directly within the CMS or any external app using their preferred wallet (MetaMask, Phantom, etc.) with real-time status updates.

---

### **3. Core Runtime Upgrades**
*   **RouteRegistry:** Added to `@micro-cms/core` to manage the lifecycle of module-provided endpoints.
*   **Type Safety:** Expanded `@micro-cms/types` to include comprehensive interfaces for `PaymentIntent`, `PaymentVerification`, and `RouteProvider`.

---

### **New Packages Summary**
| Package | Purpose |
|---------|---------|
| `@micro-cms/resource-module` | Framework-agnostic CRUD & Schema API. |
| `@micro-cms/express-adapter` | Binds CMS modules to Express.js. |
| `@micro-cms/crypto-payments` | Frontend React widget for blockchain payments. |
