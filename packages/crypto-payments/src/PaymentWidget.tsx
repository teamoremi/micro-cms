import React from 'react';
import { Wallet, CheckCircle, Loader2, AlertCircle, ExternalLink, Cpu } from 'lucide-react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import { PaymentWidgetProps, usePayment } from './index'; // Import usePayment from index.ts

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export const PaymentWidget: React.FC<PaymentWidgetProps> = ({ 
  className,
  ...props 
}) => {
  const { 
    status, 
    intent, 
    error, 
    initiate, 
    verify, 
    setStatus, 
    isSolanaAvailable, 
    handleSolanaPay,
    isEVMAvailable,
    handleEVMPay
  } = usePayment(props);

  if (status === 'success') {
    return (
      <div className={cn("mcms-p-6 mcms-text-center mcms-bg-green-50 mcms-rounded-xl mcms-border mcms-border-green-200", className)}>
        <CheckCircle className="mcms-mx-auto mcms-w-12 mcms-h-12 mcms-text-green-500 mcms-mb-4" />
        <h3 className="mcms-text-lg mcms-font-semibold mcms-green-900">Payment Successful</h3>
        <p className="mcms-text-green-700 mcms-mt-1">Your order has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className={cn("mcms-bg-white mcms-rounded-2xl mcms-border mcms-border-slate-200 mcms-shadow-sm mcms-overflow-hidden", className)}>
      <div className="mcms-p-6">
        <div className="mcms-flex mcms-items-center mcms-gap-3 mcms-mb-6">
          <div className="mcms-p-2 mcms-bg-indigo-50 mcms-rounded-lg">
            <Wallet className="mcms-w-5 mcms-h-5 mcms-text-indigo-600" />
          </div>
          <div>
            <h3 className="mcms-font-semibold mcms-text-slate-900">Crypto Payment</h3>
            <p className="mcms-text-sm mcms-text-slate-500">Pay securely using your wallet</p>
          </div>
        </div>

        {error && (
          <div className="mcms-mb-4 mcms-p-3 mcms-bg-red-50 mcms-border mcms-border-red-100 mcms-rounded-lg mcms-flex mcms-gap-3 mcms-text-red-700 mcms-text-sm">
            <AlertCircle className="mcms-w-4 mcms-h-4 mcms-shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {status === 'idle' && (
          <button
            onClick={initiate}
            className="mcms-w-full mcms-py-3 mcms-px-4 mcms-bg-indigo-600 hover:mcms-bg-indigo-700 mcms-text-white mcms-font-medium mcms-rounded-xl mcms-transition-colors mcms-flex mcms-items-center mcms-justify-center mcms-gap-2"
          >
            Start Payment
          </button>
        )}

        {(status === 'connecting' || status === 'initiating' || status === 'verifying') && (
          <div className="mcms-py-8 mcms-text-center">
            <Loader2 className="mcms-w-8 mcms-h-8 mcms-text-indigo-600 mcms-animate-spin mcms-mx-auto mcms-mb-3" />
            <p className="mcms-text-slate-600 mcms-font-medium">
              {status === 'connecting' ? 'Connecting wallet...' : status === 'initiating' ? 'Preparing transaction...' : 'Verifying on-chain...'}
            </p>
          </div>
        )}

        {status === 'pending_signature' && intent && (
          <div className="mcms-space-y-4">
            <div className="mcms-p-4 mcms-bg-slate-50 mcms-rounded-xl mcms-space-y-2">
              <div className="mcms-flex mcms-justify-between mcms-text-sm">
                <span className="mcms-text-slate-500">Amount to pay</span>
                <span className="mcms-font-mono mcms-font-medium mcms-text-slate-900">{intent.amount} {intent.currency}</span>
              </div>
              <div className="mcms-flex mcms-justify-between mcms-text-sm">
                <span className="mcms-text-slate-500">Order ID</span>
                <span className="mcms-font-mono mcms-text-slate-900">{intent.orderId}</span>
              </div>
              <div className="mcms-flex mcms-justify-between mcms-text-sm">
                <span className="mcms-text-slate-500">Network</span>
                <span className="mcms-text-slate-900 mcms-font-medium">{intent.network}</span>
              </div>
            </div>

            <div className="mcms-space-y-2">
              <p className="mcms-text-xs mcms-text-slate-500 mcms-uppercase mcms-font-bold mcms-tracking-wider">Destination Address</p>
              <div className="mcms-p-3 mcms-bg-slate-100 mcms-rounded-lg mcms-font-mono mcms-text-xs mcms-break-all mcms-text-slate-600 mcms-border mcms-border-slate-200">
                {intent.paymentAddress}
              </div>
            </div>

            <div className="mcms-flex mcms-flex-col mcms-gap-2">
              {intent.network?.toLowerCase().includes('solana') && isSolanaAvailable ? (
                <button
                  onClick={handleSolanaPay}
                  className="mcms-w-full mcms-py-3 mcms-px-4 mcms-bg-[#512da8] hover:mcms-bg-[#4527a0] mcms-text-white mcms-font-medium mcms-rounded-xl mcms-transition-colors mcms-flex mcms-items-center mcms-justify-center mcms-gap-2"
                >
                  <Cpu className="mcms-w-4 mcms-h-4" />
                  Pay with Phantom
                </button>
              ) : (intent.network?.toLowerCase().includes('ethereum') || intent.network?.toLowerCase().includes('evm') || intent.network?.toLowerCase().includes('polygon')) && isEVMAvailable ? (
                <button
                  onClick={handleEVMPay}
                  className="mcms-w-full mcms-py-3 mcms-px-4 mcms-bg-[#f6851b] hover:mcms-bg-[#e2761b] mcms-text-white mcms-font-medium mcms-rounded-xl mcms-transition-colors mcms-flex mcms-items-center mcms-justify-center mcms-gap-2"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Mirror_Logo.svg" className="mcms-w-4 mcms-h-4" alt="MetaMask" />
                  Pay with MetaMask
                </button>
              ) : (
                <button
                  onClick={() => {
                    // For other networks or if dedicated provider is not available, we assume a generic confirmation step
                    setStatus('verifying');
                    setTimeout(() => verify('0x_mock_transaction_hash_generic'), 2000);
                  }}
                  className="mcms-w-full mcms-py-3 mcms-px-4 mcms-bg-slate-900 hover:mcms-bg-black mcms-text-white mcms-font-medium mcms-rounded-xl mcms-transition-colors mcms-flex mcms-items-center mcms-justify-center mcms-gap-2"
                >
                  Confirm in Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="mcms-bg-slate-50 mcms-px-6 mcms-py-3 mcms-border-t mcms-border-slate-100 mcms-flex mcms-justify-between mcms-items-center">
        <span className="mcms-text-xs mcms-text-slate-400">Powered by Micro-CMS Crypto</span>
        <a href="#" className="mcms-text-xs mcms-text-indigo-600 hover:mcms-text-indigo-700 mcms-font-medium mcms-flex mcms-items-center mcms-gap-1">
          Help <ExternalLink className="mcms-w-3 mcms-h-3" />
        </a>
      </div>
    </div>
  );
};
