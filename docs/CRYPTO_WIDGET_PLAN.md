# Implementation Plan: @micro-cms/crypto-payments Widget

## 1. Vision: "The Stripe for Crypto" Composable Widget
Instead of a monolithic app, the `@micro-cms/crypto-payments` module provides a headless or styled React component (Widget) that can be dropped into any application. It communicates with standardized backend modules for transaction lifecycle management.

## 2. Widget Architecture

### **The `<PaymentWidget />` Component**
A highly configurable React component designed for easy integration.

**Key Features:**
- **Provider-Based:** Wrapped in a `PaymentProvider` to manage global wallet state (wagmi/viem for EVM, @solana/web3.js for Solana).
- **Headless Options:** Provides a `usePayment` hook for developers who want to build their own UI.
- **Micro-CMS Integration:** Uses the `runtime.getCapability('database-adapter')` or `http-client` to talk to micro-cms backend modules.

### **Usage Example (Conceptual):**
```tsx
import { PaymentWidget } from '@micro-cms/crypto-payments';

function CheckoutPage() {
  return (
    <PaymentWidget 
      orderId="ord_123"
      amount={0.5}
      currency="ETH"
      onSuccess={(tx) => console.log('Paid!', tx)}
      // Optional: Explicitly override endpoints if not using default micro-cms structure
      endpoints={{
        initiate: '/api/orders/initiate',
        verify: '/api/orders/verify-payment'
      }}
    />
  );
}
```

## 3. Backend Composability (The "Handshake")
The widget expects the backend to adhere to a specific "Payment Ability" contract.

### **Standardized Endpoints:**
1.  **`POST /api/orders/initiate`**: 
    - **Input:** `orderId`, `tokenType`, `network`.
    - **Output:** `paymentAddress`, `nonce` (to prevent replay attacks), and `expectedAmount`.
2.  **`POST /api/orders/verify-payment`**:
    - **Input:** `transactionHash`, `orderId`.
    - **Output:** `status: 'confirmed' | 'pending' | 'failed'`.

### **Module Synergy:**
- **`@micro-cms/resource-module`**: Handles the underlying `Orders` table.
- **`@micro-cms/crypto-backend`**: Provides the logic to watch the blockchain (via RPC or subgraphs) and triggers the `verify-payment` logic.

## 4. Implementation Strategy

### **Phase 1: The Core Library**
- Build the `usePayment` hook and a "Standard" UI widget using Tailwind CSS and the project's design system (matching `OffCanvas`).
- Implement wallet connection logic (connectors for MetaMask, WalletConnect, Phantom).

### **Phase 2: The Backend "Payment Ability"**
- Create a reusable backend handler that can be registered to any resource (e.g., "Add payment capability to the Orders resource").
- Implement signature verification to ensure the transaction data sent from the frontend hasn't been tampered with.

### **Phase 3: Documentation & Storybook**
- Provide a Storybook for the widget to showcase various states (Loading, Success, Wrong Network, Insufficient Funds).
- Document how to "Micro-CMS-ify" an existing Express route to support the widget.

## 5. Visual Integration
The widget will support two modes:
1.  **Inline:** Replaces the "Pay" button with the payment interface.
2.  **Off-canvas (Drawer):** Opens the previously implemented `OffCanvas` component to guide the user through the multi-step payment process without leaving the current page.

---
**Updated: February 2026**
This plan aligns the Crypto Payment module with the "Composables" philosophy, ensuring it's not just a feature, but a reusable utility for the entire ecosystem.
