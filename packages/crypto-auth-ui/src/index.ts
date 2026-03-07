import { Buffer } from 'buffer/';

// 1. Immediate Polyfill Injection
if (typeof window !== 'undefined') {
  if (!(window as any).Buffer) (window as any).Buffer = Buffer;
  if (!(window as any).global) (window as any).global = window;
  if (!(window as any).process) (window as any).process = { env: {} };
}

import { useState, useCallback } from 'react';
import { CmsModule, CmsContext } from '@micro-cms/types';

export * from './AuthWidget';

export interface CryptoAuthOptions {
  endpoints?: {
    nonce?: string;
    verify?: string;
  };
  headers?: Record<string, string>;
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
}

export type AuthStatus = 'idle' | 'connecting' | 'requesting_nonce' | 'pending_signature' | 'verifying' | 'success' | 'error';

export const useCryptoAuth = (options: CryptoAuthOptions = {}) => {
  const [status, setStatus] = useState<AuthStatus>('idle');
  const [error, setError] = useState<string | null>(null);

  const authenticate = async (network: 'solana' | 'evm') => {
    try {
      setStatus('connecting');
      setError(null);

      let address: string;
      let signature: string;

      if (network === 'solana') {
        const { useSolanaWallet } = await import('./providers/SolanaProvider');
        const solana = useSolanaWallet();
        address = await solana.connect();

        setStatus('requesting_nonce');
        const nonceResp = await fetch(options.endpoints?.nonce || '/api/auth/crypto/nonce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
          body: JSON.stringify({ address })
        });
        const { nonce } = await nonceResp.json();

        setStatus('pending_signature');
        signature = await solana.signMessage(`Sign this message to authenticate: ${nonce}`);
      } else {
        const { useEVMWallet } = await import('./providers/EVMProvider');
        const evm = useEVMWallet();
        address = await evm.connect();

        setStatus('requesting_nonce');
        const nonceResp = await fetch(options.endpoints?.nonce || '/api/auth/crypto/nonce', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
          body: JSON.stringify({ address })
        });
        const { nonce } = await nonceResp.json();

        setStatus('pending_signature');
        signature = await evm.signMessage(address, `Sign this message to authenticate: ${nonce}`);
      }

      setStatus('verifying');
      const verifyResp = await fetch(options.endpoints?.verify || '/api/auth/crypto/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
        body: JSON.stringify({ address, signature, network })
      });

      if (!verifyResp.ok) {
        const errorData = await verifyResp.json().catch(() => ({}));
        throw new Error(errorData.error || 'Verification failed');
      }

      const data = await verifyResp.json();
      setStatus('success');
      
      // Pass the full response object to onSuccess for consistency with other auth methods
      options.onSuccess?.(data);
      
      // Return the token (prefer jwt, fallback to token)
      return data.jwt || data.token;
    } catch (err: any) {
      setError(err.message || 'Authentication failed');
      setStatus('error');
      options.onError?.(err);
      throw err;
    }
  };

  return { status, error, authenticate };
};

export default {
  manifest: {
    name: '@micro-cms/crypto-auth-ui',
    version: '1.0.0',
    provides: ['crypto-auth-ui'],
    requires: []
  },
  async load(context: CmsContext) {
    context.runtime.register('crypto-auth-ui', {
      useCryptoAuth
    });
  }
} as CmsModule;
