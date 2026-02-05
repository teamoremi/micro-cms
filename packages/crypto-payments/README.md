# @micro-cms/crypto-payments

A composable, drop-in React widget for accepting cryptocurrency payments in your application.

## Features

*   **Multi-Chain Support:** Built-in adapters for Solana (Phantom) and EVM (MetaMask).
*   **Headless Hooks:** `usePayment` hook for custom UI implementation.
*   **Secure Handshake:** Standardized backend protocol (`initiate` -> `verify`) to ensure transaction integrity.
*   **Tailwind Styled:** Comes with a clean, pre-styled widget that respects your theme.

## Installation

```bash
pnpm add @micro-cms/crypto-payments
```

## Usage

### 1. Basic Widget

```tsx
import { PaymentWidget } from '@micro-cms/crypto-payments';
import '@micro-cms/crypto-payments/dist/index.css';

function Checkout() {
  return (
    <PaymentWidget
      orderId="ord_123"
      amount={10.50}
      endpoints={{
        initiate: '/api/orders/initiate',
        verify: '/api/orders/verify-payment'
      }}
      onSuccess={(receipt) => {
        console.log('Payment confirmed:', receipt);
      }}
    />
  );
}
```

### 2. Custom UI with `usePayment`

```tsx
import { usePayment } from '@micro-cms/crypto-payments';

function CustomCheckout() {
  const { 
    initiate, 
    status, 
    handleSolanaPay, 
    handleEVMPay 
  } = usePayment({ orderId: '123' });

  return (
    <div>
      <button onClick={initiate}>Start</button>
      
      {status === 'pending_signature' && (
        <>
          <button onClick={handleSolanaPay}>Pay with Solana</button>
          <button onClick={handleEVMPay}>Pay with Ethereum</button>
        </>
      )}
    </div>
  );
}
```

## Backend Requirements

Your backend must implement two endpoints:

1.  **POST /initiate**
    *   Input: `{ productId, amount, currency, paymentProvider: 'crypto' }`
    *   Output: `{ paymentAddress, network, nonce, amount }`

2.  **POST /verify**
    *   Input: `{ orderId, transactionHash }`
    *   Output: `{ status: 'confirmed' | 'failed', order }`

## Configuration

The widget supports custom headers for authentication:

```tsx
<PaymentWidget
  headers={{
    'Authorization': 'Bearer ...',
    'X-Tenant-ID': 'my-tenant'
  }}
  // ...
/>
```
