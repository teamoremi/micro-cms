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
      <div className={cn("p-6 text-center bg-green-50 rounded-xl border border-green-200", className)}>
        <CheckCircle className="mx-auto w-12 h-12 text-green-500 mb-4" />
        <h3 className="text-lg font-semibold text-green-900">Payment Successful</h3>
        <p className="text-green-700 mt-1">Your order has been confirmed.</p>
      </div>
    );
  }

  return (
    <div className={cn("bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden", className)}>
      <div className="p-6">
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 bg-indigo-50 rounded-lg">
            <Wallet className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-slate-900">Crypto Payment</h3>
            <p className="text-sm text-slate-500">Pay securely using your wallet</p>
          </div>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-50 border border-red-100 rounded-lg flex gap-3 text-red-700 text-sm">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <p>{error}</p>
          </div>
        )}

        {status === 'idle' && (
          <button
            onClick={initiate}
            className="w-full py-3 px-4 bg-indigo-600 hover:bg-indigo-700 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
          >
            Start Payment
          </button>
        )}

        {(status === 'connecting' || status === 'initiating' || status === 'verifying') && (
          <div className="py-8 text-center">
            <Loader2 className="w-8 h-8 text-indigo-600 animate-spin mx-auto mb-3" />
            <p className="text-slate-600 font-medium">
              {status === 'connecting' ? 'Connecting wallet...' : status === 'initiating' ? 'Preparing transaction...' : 'Verifying on-chain...'}
            </p>
          </div>
        )}

        {status === 'pending_signature' && intent && (
          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl space-y-2">
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Amount to pay</span>
                <span className="font-mono font-medium text-slate-900">{intent.amount} {intent.currency}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-slate-500">Network</span>
                <span className="text-slate-900 font-medium">{intent.network}</span>
              </div>
            </div>

            <div className="space-y-2">
              <p className="text-xs text-slate-500 uppercase font-bold tracking-wider">Destination Address</p>
              <div className="p-3 bg-slate-100 rounded-lg font-mono text-xs break-all text-slate-600 border border-slate-200">
                {intent.paymentAddress}
              </div>
            </div>

            <div className="flex flex-col gap-2">
              {intent.network.toLowerCase().includes('solana') && isSolanaAvailable ? (
                <button
                  onClick={handleSolanaPay}
                  className="w-full py-3 px-4 bg-[#512da8] hover:bg-[#4527a0] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <Cpu className="w-4 h-4" />
                  Pay with Phantom
                </button>
              ) : (intent.network.toLowerCase().includes('ethereum') || intent.network.toLowerCase().includes('evm') || intent.network.toLowerCase().includes('polygon')) && isEVMAvailable ? (
                <button
                  onClick={handleEVMPay}
                  className="w-full py-3 px-4 bg-[#f6851b] hover:bg-[#e2761b] text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  <img src="https://upload.wikimedia.org/wikipedia/commons/3/36/MetaMask_Mirror_Logo.svg" className="w-4 h-4" alt="MetaMask" />
                  Pay with MetaMask
                </button>
              ) : (
                <button
                  onClick={() => {
                    // For other networks or if dedicated provider is not available, we assume a generic confirmation step
                    setStatus('verifying');
                    setTimeout(() => verify('0x_mock_transaction_hash_generic'), 2000);
                  }}
                  className="w-full py-3 px-4 bg-slate-900 hover:bg-black text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
                >
                  Confirm in Wallet
                </button>
              )}
            </div>
          </div>
        )}
      </div>
      
      <div className="bg-slate-50 px-6 py-3 border-t border-slate-100 flex justify-between items-center">
        <span className="text-xs text-slate-400">Powered by Micro-CMS Crypto</span>
        <a href="#" className="text-xs text-indigo-600 hover:text-indigo-700 font-medium flex items-center gap-1">
          Help <ExternalLink className="w-3 h-3" />
        </a>
      </div>
    </div>
  );
};
