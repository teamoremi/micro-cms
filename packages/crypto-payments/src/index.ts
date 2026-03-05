import { Buffer } from 'buffer/';

// 1. Immediate Polyfill Injection
if (typeof window !== 'undefined') {
  if (!(window as any).Buffer) (window as any).Buffer = Buffer;
  if (!(window as any).global) (window as any).global = window;
  if (!(window as any).process) (window as any).process = { env: {} };
}

import { useState, useCallback } from 'react';
import { PaymentIntent, PaymentVerification, PaymentProvider } from '@micro-cms/types';

// Export everything else
export * from './PaymentWidget';
export * from './injectStyles';

export interface PaymentWidgetProps {
  orderId: string;
  amount?: number;
  currency?: string;
  onSuccess?: (verification: PaymentVerification) => void;
  onError?: (error: Error) => void;
  provider?: PaymentProvider;
  endpoints?: {
    initiate?: string;
    verify?: string;
  };
  headers?: Record<string, string>;
  className?: string;
}

export type PaymentStatus = 'idle' | 'connecting' | 'initiating' | 'pending_signature' | 'verifying' | 'success' | 'error';

export const usePayment = (props: PaymentWidgetProps) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<PaymentIntent | null>(null);

  // Verification Logic
  const verify = useCallback(async (txHash: string) => {
    try {
      setStatus('verifying');

      if (props.provider) {
        const data = await props.provider.verifyPayment(txHash, props.orderId);
        if (data.status === 'confirmed') {
          setStatus('success');
          props.onSuccess?.(data);
        } else {
          throw new Error('Payment not confirmed yet, status: ' + data.status);
        }
        return;
      }

      const response = await fetch(props.endpoints?.verify || '/api/orders/verify-payment', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(props.headers || {})
        },
        body: JSON.stringify({
          orderId: intent?.orderId || props.orderId,
          transactionHash: txHash
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Payment verification failed');
      }
      
      const data: PaymentVerification = await response.json();
      if (data.status === 'confirmed') {
        setStatus('success');
        props.onSuccess?.(data);
      } else {
        throw new Error('Payment not confirmed yet, status: ' + data.status);
      }
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
      props.onError?.(err);
    }
  }, [props.provider, props.endpoints?.verify, props.orderId, props.onSuccess, props.onError, props.headers, intent?.orderId]);

  // Dynamic Solana Pay Handler
  const handleSolanaPay = async () => {
    try {
      if (!intent) {
        setError('Payment intent not established.');
        setStatus('error');
        return;
      }
      setStatus('connecting');
      
      // Dynamic import to ensure polyfills are applied first
      const { useSolanaWallet } = await import('./providers/SolanaProvider');
      const solana = useSolanaWallet();
      
      const publicKey = await solana.connect();
      setStatus('pending_signature');
      
      const signature = await solana.sendPayment(intent); 
      setStatus('verifying');
      await verify(signature);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Phantom or sign transaction.');
      setStatus('error');
      props.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  };

  // Dynamic EVM Pay Handler
  const handleEVMPay = async () => {
    try {
      if (!intent) {
        setError('Payment intent not established.');
        setStatus('error');
        return;
      }
      setStatus('connecting');
      
      const { useEVMWallet } = await import('./providers/EVMProvider');
      const evm = useEVMWallet();
      
      const account = await evm.connect();
      setStatus('pending_signature');
      
      const txHash = await evm.sendPayment(intent); 
      setStatus('verifying');
      await verify(txHash);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to MetaMask or sign transaction.');
      setStatus('error');
      props.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  };

  const initiate = useCallback(async () => {
    try {
      setStatus('initiating');
      setError(null);

      if (props.provider) {
        const data = await props.provider.initiatePayment(props.orderId, {
          amount: props.amount,
          currency: props.currency
        });
        setIntent(data);
        setStatus('pending_signature');
        return;
      }

      const response = await fetch(props.endpoints?.initiate || '/api/orders/initiate', {
        method: 'POST',
        headers: { 
          'Content-Type': 'application/json',
          ...(props.headers || {})
        },
        body: JSON.stringify({
          productId: props.orderId,
          amount: props.amount,
          currency: props.currency,
          paymentProvider: 'crypto'
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to initiate payment intent');
      }
      
      const data: PaymentIntent = await response.json();
      setIntent(data);
      setStatus('pending_signature');
    } catch (err: any) {
      setError(err.message);
      setStatus('error');
      props.onError?.(err);
    }
  }, [props.provider, props.endpoints?.initiate, props.orderId, props.amount, props.currency, props.onError, props.headers]);

  return { 
    status, 
    intent, 
    error, 
    initiate, 
    verify, 
    setStatus, 
    isSolanaAvailable: true, // Simplified for now
    handleSolanaPay,
    isEVMAvailable: true,    // Simplified for now
    handleEVMPay
  };
};
