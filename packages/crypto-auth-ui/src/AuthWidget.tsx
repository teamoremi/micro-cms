import React, { useEffect } from 'react';
import { useCryptoAuth, AuthStatus } from './index';
import { Wallet, Shield, Loader2, AlertCircle } from 'lucide-react';
import { injectStyles } from './injectStyles';

export interface AuthWidgetProps {
  onSuccess?: (token: string) => void;
  onError?: (error: Error) => void;
  className?: string;
  endpoints?: {
    nonce?: string;
    verify?: string;
  };
}

export const AuthWidget: React.FC<AuthWidgetProps> = ({ onSuccess, onError, className, endpoints }) => {
  const { status, error, authenticate } = useCryptoAuth({ onSuccess, onError, endpoints });

  useEffect(() => {
    injectStyles();
  }, []);

  const renderStatus = () => {
    switch (status) {
      case 'connecting': return 'Connecting Wallet...';
      case 'requesting_nonce': return 'Getting Nonce...';
      case 'pending_signature': return 'Please Sign Message...';
      case 'verifying': return 'Verifying Signature...';
      default: return null;
    }
  };

  return (
    <div className={`mcms-p-6 mcms-bg-white mcms-rounded-xl mcms-shadow-lg mcms-border mcms-border-gray-100 ${className}`}>
      <div className="mcms-flex mcms-items-center mcms-gap-3 mcms-mb-6">
        <div className="mcms-p-2 mcms-bg-blue-50 mcms-rounded-lg">
          <Shield className="mcms-w-6 mcms-h-6 mcms-text-blue-600" />
        </div>
        <div>
          <h3 className="mcms-text-lg mcms-font-bold mcms-text-gray-900">Crypto Login</h3>
          <p className="mcms-text-sm mcms-text-gray-500">Sign in with your wallet</p>
        </div>
      </div>

      {error && (
        <div className="mcms-mb-4 mcms-p-3 mcms-bg-red-50 mcms-text-red-700 mcms-rounded-lg mcms-flex mcms-items-center mcms-gap-2 mcms-text-sm mcms-border mcms-border-red-100">
          <AlertCircle className="mcms-w-4 mcms-h-4 mcms-flex-shrink-0" />
          <p>{error}</p>
        </div>
      )}

      {status !== 'idle' && status !== 'error' && status !== 'success' ? (
        <div className="mcms-flex mcms-flex-col mcms-items-center mcms-justify-center mcms-py-8 mcms-gap-4">
          <Loader2 className="mcms-w-10 mcms-h-10 mcms-text-blue-600 mcms-animate-spin" />
          <p className="mcms-text-sm mcms-font-medium mcms-text-gray-600">{renderStatus()}</p>
        </div>
      ) : (
        <div className="mcms-grid mcms-grid-cols-1 mcms-gap-3">
          <button
            onClick={() => authenticate('solana')}
            className="mcms-flex mcms-items-center mcms-justify-between mcms-p-4 mcms-rounded-xl mcms-border mcms-border-gray-200 hover:mcms-border-blue-500 hover:mcms-bg-blue-50 mcms-transition-all mcms-group"
          >
            <div className="mcms-flex mcms-items-center mcms-gap-3">
              <div className="mcms-w-10 mcms-h-10 mcms-bg-black mcms-rounded-full mcms-flex mcms-items-center mcms-justify-center mcms-text-white mcms-font-bold">S</div>
              <div className="mcms-text-left">
                <span className="mcms-block mcms-font-bold mcms-text-gray-900">Solana</span>
                <span className="mcms-block mcms-text-xs mcms-text-gray-500">Phantom, Solflare, etc.</span>
              </div>
            </div>
            <Wallet className="mcms-w-5 mcms-h-5 mcms-text-gray-400 group-hover:mcms-text-blue-500" />
          </button>

          <button
            onClick={() => authenticate('evm')}
            className="mcms-flex mcms-items-center mcms-justify-between mcms-p-4 mcms-rounded-xl mcms-border mcms-border-gray-200 hover:mcms-border-blue-500 hover:mcms-bg-blue-50 mcms-transition-all mcms-group"
          >
            <div className="mcms-flex mcms-items-center mcms-gap-3">
              <div className="mcms-w-10 mcms-h-10 mcms-bg-orange-500 mcms-rounded-full mcms-flex mcms-items-center mcms-justify-center mcms-text-white mcms-font-bold mcms-font-serif">M</div>
              <div className="mcms-text-left">
                <span className="mcms-block mcms-font-bold mcms-text-gray-900">Base / Ethereum</span>
                <span className="mcms-block mcms-text-xs mcms-text-gray-500">MetaMask, Coinbase Wallet</span>
              </div>
            </div>
            <Wallet className="mcms-w-5 mcms-h-5 mcms-text-gray-400 group-hover:mcms-text-blue-500" />
          </button>
        </div>
      )}

      {status === 'success' && (
        <div className="mcms-mt-4 mcms-p-3 mcms-bg-green-50 mcms-text-green-700 mcms-rounded-lg mcms-text-center mcms-text-sm mcms-border mcms-border-green-100">
          Login Successful!
        </div>
      )}
    </div>
  );
};
