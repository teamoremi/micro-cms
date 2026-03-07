import { CmsContext, CmsModule, RouteProvider, RouteDefinition } from '@micro-cms/types';
import { CryptoAuthService } from './auth.service';

export default {
  manifest: {
    name: '@micro-cms/crypto-auth-node',
    version: '1.0.0',
    provides: ['authentication', 'route-provider'],
    requires: []
  },

  async load(context: CmsContext) {
    const { jwtSecret, jwtExpiresIn, onVerified } = context.config;
    
    if (!jwtSecret) {
      console.warn('[@micro-cms/crypto-auth-node] jwtSecret not provided in config.');
    }

    const authService = new CryptoAuthService({ 
      jwtSecret: jwtSecret || 'fallback-secret',
      jwtExpiresIn 
    });

    context.runtime.register('authentication', {
      verifySolana: (address: string, signature: string) => authService.verifySolana(address, signature),
      verifyEVM: (address: string, signature: string) => authService.verifyEVM(address, signature),
      generateNonce: (address: string) => authService.generateNonce(address)
    });

    const routes: RouteDefinition[] = [
      {
        method: 'POST',
        path: '/api/auth/crypto/nonce',
        handler: async (req: any, res: any) => {
          const { address } = req.body;
          if (!address) return res.status(400).json({ error: 'Address required' });
          const nonce = authService.generateNonce(address);
          res.json({ nonce });
        }
      },
      {
        method: 'POST',
        path: '/api/auth/crypto/verify',
        handler: async (req: any, res: any) => {
          const { address, signature, network } = req.body;
          if (!address || !signature || !network) {
            return res.status(400).json({ error: 'Address, signature and network required' });
          }

          let token: string | null = null;
          if (network === 'solana') {
            token = await authService.verifySolana(address, signature);
          } else {
            token = await authService.verifyEVM(address, signature);
          }

          if (token) {
            let hookResult: any = {};
            if (onVerified) {
              try {
                hookResult = await onVerified({ address, network, token, req });
              } catch (e: any) {
                console.error('[@micro-cms/crypto-auth-node] onVerified hook failed:', e.message);
              }
            }

            // Standardize: If hookResult is an object, merge it. Use 'jwt' instead of 'token'.
            // If hookResult contains a jwt, it overrides the default module token.
            if (hookResult && typeof hookResult === 'object') {
              res.json({
                jwt: hookResult.jwt || token,
                ...hookResult
              });
            } else {
              res.json({ jwt: token, user: hookResult });
            }
          }

 else {
            res.status(401).json({ error: 'Verification failed' });
          }
        }
      }
    ];

    context.runtime.register('route-provider', {
      getRoutes: () => routes
    } as RouteProvider);
  }
} as CmsModule;
