# @micro-cms/crypto-auth-node

A backend Micro-CMS module for verifying crypto wallet signatures (Solana and EVM) and issuing JWT tokens.

## Features
- **Multi-Chain Verification**: Supports Solana (ed25519) and EVM (personal_sign) signature verification.
- **Nonce Management**: Generates and manages short-lived nonces to prevent replay attacks.
- **JWT Issuance**: Issues signed JWT tokens upon successful verification.
- **Composable**: Integrates seamlessly with `@micro-cms/core` and `@micro-cms/express-adapter`.

## Installation
```bash
pnpm add @micro-cms/crypto-auth-node
```

## Usage

### Integrating with Micro-CMS App
```typescript
import { createApp } from '@micro-cms/core';
import { bindExpressRoutes } from '@micro-cms/express-adapter';
import CryptoAuthModule from '@micro-cms/crypto-auth-node';
import express from 'express';

const app = express();
const cms = createApp();

cms.use(CryptoAuthModule, {
  jwtSecret: process.env.JWT_SECRET,
  jwtExpiresIn: '24h',
  // Optional hook to provision or find users in your DB
  onVerified: async ({ address, network, token, req }) => {
    // Return user object to be included in the response
    return { id: 1, address, network };
  }
});

cms.start().then(() => {
  bindExpressRoutes({ app, cms });
});
```

## Provided Endpoints
When bound to an Express app, this module provides:

- `POST /api/auth/crypto/nonce`: Generates a nonce for a wallet address.
  - Body: `{ "address": "..." }`
- `POST /api/auth/crypto/verify`: Verifies a signature and returns a token.
  - Body: `{ "address": "...", "signature": "...", "network": "solana" | "evm" }`

## Configuration Options

| Option | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `jwtSecret` | `string` | 'fallback-secret' | Secret used to sign JWT tokens |
| `jwtExpiresIn` | `string` | '24h' | JWT expiration time (e.g., '1h', '7d') |
| `onVerified` | `Function` | - | Async hook called after successful verification |
