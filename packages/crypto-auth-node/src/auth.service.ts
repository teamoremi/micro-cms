import { PublicKey } from '@solana/web3.js';
import bs58 from 'bs58';
import { verifyMessage } from 'viem';
import jwt from 'jsonwebtoken';

export interface CryptoAuthOptions {
  jwtSecret: string;
  jwtExpiresIn?: string;
}

export class CryptoAuthService {
  private nonces = new Map<string, string>();

  constructor(private options: CryptoAuthOptions) {}

  generateNonce(address: string): string {
    const nonce = Math.floor(Math.random() * 1000000).toString();
    // Use raw address for map key to handle case-sensitive Solana addresses
    this.nonces.set(address, nonce);
    return nonce;
  }

  async verifySolana(address: string, signature: string): Promise<string | null> {
    const nonce = this.nonces.get(address);
    if (!nonce) {
      console.warn('[@micro-cms/crypto-auth-node] No nonce found for address:', address);
      return null;
    }

    try {
      const message = new TextEncoder().encode(`Sign this message to authenticate: ${nonce}`);
      const signatureUint8 = bs58.decode(signature);
      const publicKeyUint8 = bs58.decode(address);
      
      const verified = await this.verifySolanaSignature(message, signatureUint8, publicKeyUint8);
      
      if (verified) {
        this.nonces.delete(address);
        return this.issueToken(address, 'solana');
      }
    } catch (e) {
      console.error('Solana verification error:', e);
    }
    return null;
  }

  private async verifySolanaSignature(message: Uint8Array, signature: Uint8Array, publicKey: Uint8Array): Promise<boolean> {
    try {
      const nacl = await import('tweetnacl');
      // Handle both ES module and CommonJS styles
      const sign = nacl.sign || (nacl as any).default?.sign;
      
      if (!sign || !sign.detached) {
        throw new Error('tweetnacl sign.detached not found');
      }
      
      return sign.detached.verify(message, signature, publicKey);
    } catch (e: any) {
      console.error('[@micro-cms/crypto-auth-node] Internal verification error:', e.message);
      return false;
    }
  }

  async verifyEVM(address: string, signature: string): Promise<string | null> {
    const addrKey = address.toLowerCase();
    const nonce = this.nonces.get(addrKey);
    if (!nonce) {
      console.warn('[@micro-cms/crypto-auth-node] No nonce found for EVM address:', addrKey);
      return null;
    }

    try {
      const message = `Sign this message to authenticate: ${nonce}`;
      const verified = await verifyMessage({
        address: address as `0x${string}`,
        message,
        signature: signature as `0x${string}`,
      });

      if (verified) {
        this.nonces.delete(addrKey);
        return this.issueToken(address, 'evm');
      }
    } catch (e) {
      console.error('EVM verification error:', e);
    }
    return null;
  }

  private issueToken(address: string, network: string): string {
    const options: any = { 
      expiresIn: this.options.jwtExpiresIn || '24h' 
    };
    return jwt.sign(
      { address, network },
      this.options.jwtSecret,
      options
    );
  }
}
