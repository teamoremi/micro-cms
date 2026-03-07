# @micro-cms/crypto-auth-ui

A composable React widget and hook for authenticating users with crypto wallets (Solana and Base/EVM).

## Features
- **Multi-Chain**: Supports Solana (Phantom) and EVM (MetaMask, Coinbase Wallet, etc.).
- **Highly Configurable**: Control which networks to display and customize the header.
- **Style Isolation**: Uses scoped Tailwind CSS (prefixed with `mcms-`) and automatic style injection.
- **Zero Configuration**: Works out of the box with Micro-CMS backend modules.

## Installation
```bash
pnpm add @micro-cms/crypto-auth-ui
```

## Usage

### Using the Widget
```tsx
import { AuthWidget } from '@micro-cms/crypto-auth-ui';

function LoginPage() {
  const handleSuccess = (token: string) => {
    console.log('Authenticated!', token);
  };

  return (
    <AuthWidget 
      onSuccess={handleSuccess}
      // Configure allowed networks (default: ['solana', 'evm'])
      allowedNetworks={['solana']}
      // Optional: Hide default header or provide custom component
      hideHeader={false}
      // headerComponent={<MyCustomHeader />}
      endpoints={{
        nonce: '/api/auth/crypto/nonce',
        verify: '/api/auth/crypto/verify'
      }}
      headers={{
        'X-Tenant-ID': 'my-tenant'
      }}
    />
  );
}
```

### Properties

| Property | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `onSuccess` | `(token: string) => void` | - | Callback on successful authentication |
| `onError` | `(error: Error) => void` | - | Callback on authentication error |
| `allowedNetworks` | `('solana' \| 'evm')[]` | `['solana', 'evm']` | Which networks to show in the UI |
| `hideHeader` | `boolean` | `false` | Whether to hide the widget header |
| `headerComponent` | `React.ReactNode` | - | Custom component to replace the default header |
| `endpoints` | `{ nonce?: string, verify?: string }` | - | Custom backend API paths |
| `headers` | `Record<string, string>` | - | Custom headers for fetch requests |
| `className` | `string` | - | Custom container class |

### Using the Hook
```tsx
import { useCryptoAuth } from '@micro-cms/crypto-auth-ui';

const { authenticate, status, error } = useCryptoAuth({
  onSuccess: (token) => console.log(token),
  headers: { 'X-Tenant-ID': 'my-tenant' }
});

// Trigger login
authenticate('solana'); // or 'evm'
```
