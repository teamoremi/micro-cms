import { PaymentIntent } from '@micro-cms/types';

export interface EthereumWindow extends Window {
  ethereum?: {
    isMetaMask?: boolean;
    request: (request: { method: string; params?: any[] }) => Promise<any>;
    on: (event: string, callback: (...args: any[]) => void) => void;
    removeListener: (event: string, callback: (...args: any[]) => void) => void;
  };
}

export const useEVMWallet = () => {
  const getProvider = (): (EthereumWindow['ethereum']) => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      return (window as EthereumWindow).ethereum;
    }
    return undefined;
  };

  const connect = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        return accounts[0];
      } catch (err) {
        throw new Error('User rejected the connection');
      }
    } else {
      throw new Error('MetaMask or EVM wallet not found');
    }
  };

  const sendPayment = async (intent: PaymentIntent) => {
    const provider = getProvider();
    if (!provider) throw new Error('Wallet not connected');

    const accounts = await provider.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      throw new Error('No accounts found. Please connect your wallet first.');
    }

    // Convert amount to Wei (assuming 18 decimals for ETH/Standard tokens)
    // For USDC on EVM, it's usually 6 decimals. 
    // This logic should ideally be more robust based on the token.
    const decimals = intent.currency.toUpperCase() === 'USDC' ? 6 : 18;
    const value = '0x' + (BigInt(Math.floor(Number(intent.amount) * Math.pow(10, decimals)))).toString(16);

    try {
      const txHash = await provider.request({
        method: 'eth_sendTransaction',
        params: [{
          from: accounts[0],
          to: intent.paymentAddress,
          value: intent.currency.toUpperCase() === 'ETH' ? value : '0x0', // Only value for native currency
          // If it was a token transfer, we would need the data field with transfer(address,uint256)
        }],
      });

      return txHash;
    } catch (err: any) {
      if (err.code === 4001) {
        throw new Error('Transaction rejected by user');
      }
      throw new Error(err.message || 'Failed to send transaction');
    }
  };

  return { isAvailable: !!getProvider(), connect, sendPayment };
};
