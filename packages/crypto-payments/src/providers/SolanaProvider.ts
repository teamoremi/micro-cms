import { PaymentIntent } from '@micro-cms/types';
import { 
  Connection, 
  PublicKey, 
  Transaction, 
  SystemProgram, 
  LAMPORTS_PER_SOL 
} from '@solana/web3.js';
import { 
  TOKEN_PROGRAM_ID, 
  getOrCreateAssociatedTokenAccount, 
  createTransferInstruction, 
  getMint 
} from '@solana/spl-token';

export interface SolanaWindow extends Window {
  solana?: {
    isPhantom?: boolean;
    connect: (options?: { onlyIfTrusted?: boolean }) => Promise<{ publicKey: { toString: () => string } }>;
    signTransaction: (transaction: Transaction) => Promise<Transaction>;
    signAndSendTransaction: (transaction: Transaction) => Promise<{ signature: string }>;
    request: (request: { method: string; params?: any }) => Promise<any>;
  };
}

// USDC Mint Addresses
const USDC_MINT_DEVNET = new PublicKey('4zMMC9srt5Ri5X14GAgXhaHii3GnPAEERYPJgZJDncDU');
const USDC_MINT_MAINNET = new PublicKey('EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v');

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
      // Determine if this is a Devnet or Mainnet transaction
      const isMainnet = !window.location.host.includes('localhost') && !window.location.host.includes('dev.');
      const rpcUrl = isMainnet ? 'https://api.mainnet-beta.solana.com' : 'https://api.devnet.solana.com';
      const connection = new Connection(rpcUrl, 'confirmed');
      
      const accounts = await provider.connect({ onlyIfTrusted: true });
      const fromPubkey = new PublicKey(accounts.publicKey.toString());
      const toPubkey = new PublicKey(intent.paymentAddress);

      const transaction = new Transaction();

      // Handle USDC vs SOL
      if (intent.currency?.toUpperCase() === 'USDC') {
        const mintAddress = isMainnet ? USDC_MINT_MAINNET : USDC_MINT_DEVNET;
        
        // 1. Get decimals from mint (USDC is usually 6)
        const mintInfo = await getMint(connection, mintAddress);
        const amount = Math.round(Number(intent.amount) * Math.pow(10, mintInfo.decimals));

        // Note: For production use with real Phantom, we'd need to handle ATA creation carefully.
        // For simplicity in the widget, we assume the destination has an ATA.
        // We'll use the browser wallet's signAndSendTransaction.

        // In a real-world scenario, you'd use getAssociatedTokenAddress for sender and receiver.
        // We need to fetch/create the receiver's ATA if it doesn't exist.
        // Since we can't easily sign for the fee of creating receiver ATA in the widget without knowing the fee payer's full context,
        // we'll use a simplified version for now.

        // Get Associated Token Addresses
        const { getAssociatedTokenAddress } = await import('@solana/spl-token');
        const fromAta = await getAssociatedTokenAddress(mintAddress, fromPubkey);
        const toAta = await getAssociatedTokenAddress(mintAddress, toPubkey);

        transaction.add(
          createTransferInstruction(
            fromAta,
            toAta,
            fromPubkey,
            amount,
            [],
            TOKEN_PROGRAM_ID
          )
        );
      } else {
        // Fallback to Native SOL
        transaction.add(
          SystemProgram.transfer({
            fromPubkey,
            toPubkey,
            lamports: Math.round(Number(intent.amount) * LAMPORTS_PER_SOL),
          })
        );
      }

      // 3. Set latest blockhash
      const { blockhash } = await connection.getLatestBlockhash();
      transaction.recentBlockhash = blockhash;
      transaction.feePayer = fromPubkey;

      // 4. Sign and Send
      const { signature } = await provider.signAndSendTransaction(transaction);
      
      return signature;
    } catch (err: any) {
      console.error('Solana Transaction Error:', err);
      if (err.message?.includes('User rejected')) {
        throw new Error('Transaction rejected by user');
      }
      throw new Error(err.message || 'Failed to send Solana transaction');
    }
  };

  return { isAvailable: !!getProvider(), connect, sendPayment };
};
