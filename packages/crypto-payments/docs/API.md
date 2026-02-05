# API Reference

## Components

### `<PaymentWidget />`

The main UI component for rendering the payment flow.

| Prop | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `orderId` | `string` | **Required** | The ID of the order or product being purchased. |
| `amount` | `number` | `undefined` | The amount to charge (can be overridden by backend). |
| `currency` | `string` | `undefined` | Currency code (e.g., 'USDC', 'ETH'). |
| `endpoints` | `object` | `{}` | Custom API endpoints. |
| `endpoints.initiate` | `string` | `/api/orders/initiate` | URL to start payment. |
| `endpoints.verify` | `string` | `/api/orders/verify-payment` | URL to verify transaction. |
| `headers` | `Record<string, string>` | `{}` | Custom HTTP headers for API calls. |
| `onSuccess` | `(data) => void` | `undefined` | Callback when payment is confirmed. |
| `onError` | `(err) => void` | `undefined` | Callback when an error occurs. |

---

## Hooks

### `usePayment(props)`

The hook powering the widget. Use this to build custom UIs.

**Returns:**

*   `status`: `'idle' | 'connecting' | 'initiating' | 'pending_signature' | 'verifying' | 'success' | 'error'`
*   `intent`: The payment intent object returned from the backend.
*   `error`: Error message string or null.
*   `initiate()`: Function to call the initiate endpoint.
*   `verify(txHash)`: Function to call the verify endpoint manually.
*   `handleSolanaPay()`: Triggers the Solana wallet flow.
*   `handleEVMPay()`: Triggers the EVM wallet flow.
*   `isSolanaAvailable`: Boolean, true if Phantom is detected.
*   `isEVMAvailable`: Boolean, true if MetaMask/Window.ethereum is detected.

---

## Types

### `PaymentIntent`

```typescript
interface PaymentIntent {
  orderId: string;
  paymentAddress: string;
  amount: string;
  currency: string;
  network: string; // 'Solana' | 'Ethereum' | ...
  nonce: string;
}
```

### `PaymentVerification`

```typescript
interface PaymentVerification {
  status: 'confirmed' | 'pending' | 'failed';
  orderId: string;
  transactionHash: string;
}
```
