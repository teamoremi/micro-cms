import { PaymentIntent } from '@micro-cms/types';

import { Connection, PublicKey, Transaction, SystemProgram, LAMPORTS_PER_SOL } from '@solana/web3.js';

export interface SolanaWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
    request: (request: { method: string; params?: any }) => Promise<any>;
  };
}

export const useSolanaWallet = () => {
  const getProvider = (): (SolanaWindow['solana']) => {
    if (typeof window !== 'undefined' && 'solana' in window) {
      const anyWindow = window as SolanaWindow;
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

  const sendPayment = async (intent: PaymentIntent) => {
    const provider = getProvider();
    if (!provider) throw new Error('Wallet not connected');

    try {
      // 1. Establish connection
      const connection = new Connection('https://api.devnet.solana.com', 'confirmed');
      
      const accounts = await provider.connect({ onlyIfTrusted: true });
      const fromPubkey = new PublicKey(accounts.publicKey.toString());
      const toPubkey = new PublicKey(intent.paymentAddress);

      // 2. Create Transaction
      const transaction = new Transaction().add(
        SystemProgram.transfer({
          fromPubkey,
          toPubkey,
          lamports: Number(intent.amount) * LAMPORTS_PER_SOL,
        })
      );

      // 3. Set latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // 4. Sign and Send
      const { signature } = await provider.signAndSendTransaction(transaction);
      
      // 5. Optional: Wait for confirmation (or let the backend verify it)
      // await connection.confirmTransaction(signature);

      return signature;
    } catch (err: any) {
      if (err.message?.includes('User rejected')) {
        throw new Error('Transaction rejected by user');
      }
      throw new Error(err.message || 'Failed to send Solana transaction');
    }
  };

  return { isAvailable: !!getProvider(), connect, sendPayment };
};
