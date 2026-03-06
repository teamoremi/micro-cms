# @micro-cms/crypto-auth-ui

A composable React widget and hook for authenticating users with crypto wallets (Solana and Base/EVM).

## Features
- **Multi-Chain**: Supports Solana (Phantom) and EVM (MetaMask, Coinbase Wallet, etc.).
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
      endpoints={{
        nonce: '/api/auth/crypto/nonce',
        verify: '/api/auth/crypto/verify'
      }}
    />
  );
}
```

### Using the Hook
```tsx
import { useCryptoAuth } from '@micro-cms/crypto-auth-ui';

const { authenticate, status, error } = useCryptoAuth({
  onSuccess: (token) => console.log(token)
});

// Trigger login
authenticate('solana'); // or 'evm'
```
