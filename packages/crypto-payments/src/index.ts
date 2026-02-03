import { useState, useCallback } from 'react';
import { PaymentIntent, PaymentVerification } from '@micro-cms/types';
import { useSolanaWallet } from './providers/SolanaProvider';

export * from './providers/SolanaProvider'; // Export Solana hook for direct use
export * from './PaymentWidget'; // Export the PaymentWidget component

export interface PaymentWidgetProps {
  orderId: string;
  amount?: number; // Optional, will be determined by backend
  currency?: string; // Optional, will be determined by backend
  onSuccess?: (verification: PaymentVerification) => void;
  onError?: (error: Error) => void;
  endpoints?: {
    initiate?: string; // Default to /api/orders/initiate
    verify?: string; // Default to /api/orders/verify-payment
  };
  className?: string; // Classname for the wrapper div
}

export type PaymentStatus = 'idle' | 'connecting' | 'initiating' | 'pending_signature' | 'verifying' | 'success' | 'error';

export const usePayment = (props: PaymentWidgetProps) => {
  const [status, setStatus] = useState<PaymentStatus>('idle');
  const [error, setError] = useState<string | null>(null);
  const [intent, setIntent] = useState<PaymentIntent | null>(null);

  const initiate = useCallback(async () => {
    try {
      setStatus('initiating');
      setError(null);

      const response = await fetch(props.endpoints?.initiate || '/api/orders/initiate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: props.orderId,
          amount: props.amount,
          currency: props.currency
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
  }, [props.endpoints?.initiate, props.orderId, props.amount, props.currency, props.onError]);

  const verify = useCallback(async (txHash: string) => {
    try {
      setStatus('verifying');
      const response = await fetch(props.endpoints?.verify || '/api/orders/verify-payment', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          orderId: props.orderId,
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
  }, [props.endpoints?.verify, props.orderId, props.onSuccess, props.onError]);

  // Integration with Solana
  const { isAvailable: isSolanaAvailable, connect: connectSolana, sendPayment: sendSolanaPayment } = useSolanaWallet();

  const handleSolanaPay = async () => {
    try {
      if (!intent) {
        setError('Payment intent not established.');
        setStatus('error');
        return;
      }
      setStatus('connecting');
      const publicKey = await connectSolana();
      console.log('Connected to Solana with public key:', publicKey);
      
      setStatus('pending_signature');
      const signature = await sendSolanaPayment(intent); 
      
      setStatus('verifying');
      await verify(signature);
    } catch (err: any) {
      setError(err.message || 'Failed to connect to Phantom or sign transaction.');
      setStatus('error');
      props.onError?.(err instanceof Error ? err : new Error(String(err)));
    }
  };

  return { status, intent, error, initiate, verify, setStatus, isSolanaAvailable, handleSolanaPay };
};