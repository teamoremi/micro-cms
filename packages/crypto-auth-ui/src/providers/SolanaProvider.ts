import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';

export interface SolanaWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
    signMessage: (message: Uint8Array, encoding: string) => Promise<{ signature: Uint8Array }>;
  };
}

export const useSolanaWallet = () => {
  const getProvider = (): (SolanaWindow['solana']) => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      const anyWindow = window as any;
      if (anyWindow.solana?.isPhantom) {
        return anyWindow.solana;
      }
    }
    return undefined;
  };

  const connect = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        const resp = await provider.connect();
        return resp.publicKey.toString();
      } catch (err) {
        throw new Error('User rejected the connection');
      }
    } else {
      throw new Error('Phantom wallet not found');
    }
  };

  const signMessage = async (message: string) => {
    const provider = getProvider();
    if (!provider) throw new Error('Wallet not connected');

    try {
      const encodedMessage = new TextEncoder().encode(message);
      const { signature } = await provider.signMessage(encodedMessage, 'utf8');
      return bs58.encode(signature);
    } catch (err: any) {
      console.error('Solana Signing Error:', err);
      throw new Error(err.message || 'Failed to sign message');
    }
  };

  return { isAvailable: !!getProvider(), connect, signMessage };
};
