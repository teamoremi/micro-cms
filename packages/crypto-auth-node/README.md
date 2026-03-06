# @micro-cms/crypto-auth-node

A Micro-CMS backend module for verifying crypto signatures and managing nonces for wallet-based authentication.

## Features
- **Capabilities**: Provides `authentication` and `route-provider` abilities.
- **Multichain**: Verifies Solana and EVM (Ethereum/Base) signatures.
- **Provisioning**: Supports `onVerified` hooks for user database provisioning.

## Integration

### Initialization
```typescript
import { createApp } from '@micro-cms/core';
import CryptoAuthModule from '@micro-cms/crypto-auth-node';

const cms = createApp();

cms.use(CryptoAuthModule, {
  jwtSecret: 'your-secret',
  onVerified: async ({ address, network, req }) => {
    // Look up or create user in DB
    return { id: 1, email: `${address}@${network}.com` };
  }
});

await cms.start();
```

### Endpoints (Automatic)
The module provides the following endpoints via the `route-provider` capability:
- `POST /api/auth/crypto/nonce`: Generates a unique nonce for signing.
- `POST /api/auth/crypto/verify`: Verifies the signature and returns a JWT.
