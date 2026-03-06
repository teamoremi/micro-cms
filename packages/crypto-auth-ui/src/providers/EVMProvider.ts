import { createWalletClient, custom } from 'viem';
import { mainnet, base } from 'viem/chains';

export const useEVMWallet = () => {
  const getProvider = () => {
    if (typeof window !== 'undefined' && 'ethereum' in window) {
      return (window as any).ethereum;
    }
    return undefined;
  };

  const connect = async () => {
    const provider = getProvider();
    if (provider) {
      try {
        const accounts = await provider.request({ method: 'eth_requestAccounts' });
        return accounts[0] as string;
      } catch (err) {
        throw new Error('User rejected the connection');
      }
    } else {
      throw new Error('MetaMask or other EVM wallet not found');
    }
  };

  const signMessage = async (address: string, message: string) => {
    const provider = getProvider();
    if (!provider) throw new Error('Wallet not connected');

    try {
      const client = createWalletClient({
        account: address as `0x${string}`,
        chain: base, // Default to Base or Mainnet
        transport: custom(provider)
      });

      const signature = await client.signMessage({
        account: address as `0x${string}`,
        message
      });
      return signature;
    } catch (err: any) {
      console.error('EVM Signing Error:', err);
      throw new Error(err.message || 'Failed to sign message');
    }
  };

  return { isAvailable: !!getProvider(), connect, signMessage };
};
