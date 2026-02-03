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

    console.log(`Simulating EVM payment to ${intent.paymentAddress} for ${intent.amount} ${intent.currency}`);

    // Real implementation would use ethers.js or viem:
    // const txHash = await provider.request({
    //   method: 'eth_sendTransaction',
    //   params: [{
    //     from: (await provider.request({ method: 'eth_accounts' }))[0],
    //     to: intent.paymentAddress,
    //     value: '0x' + (Number(intent.amount) * 1e18).toString(16), // Convert to Wei hex
    //   }],
    // });

    return 'simulated_evm_tx_hash_' + Math.random().toString(36).slice(2);
  };

  return { isAvailable: !!getProvider(), connect, sendPayment };
};
