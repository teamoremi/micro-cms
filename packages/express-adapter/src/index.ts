import { Express } from 'express';
import { App } from '@micro-cms/core';
import { RouteDefinition } from '@micro-cms/types';

export interface ExpressAdapterOptions {
  app: Express;
  cms: App;
  middlewareMap?: Record<string, any>; // Map middleware keys to actual Express middleware functions
}

export function bindExpressRoutes(options: ExpressAdapterOptions) {
  const { app, cms, middlewareMap = {} } = options;
  
  // Cast to any to access the runtime.getRoutes() we added to App
  const routes: RouteDefinition[] = (cms.runtime as any).getRoutes();

  console.log(`Binding ${routes.length} CMS routes to Express...`);

  routes.forEach(route => {
    const method = route.method.toLowerCase();
    const path = route.path;
    
    // Resolve middleware
    const middlewares = (route.middleware || []).map(mKey => {
      const mw = middlewareMap[mKey];
      if (!mw) {
        console.warn(`Warning: Middleware '${mKey}' not found in middlewareMap for route ${path}`);
        return (req: any, res: any, next: any) => next();
      }
      return mw;
    });

    // Register with Express
    (app as any)[method](path, ...middlewares, async (req: any, res: any) => {
      try {
        await route.handler(req, res);
      } catch (error: any) {
        console.error(`Error in CMS route ${method.toUpperCase()} ${path}:`, error);
        res.status(500).json({ error: error.message || 'Internal Server Error' });
      }
    });

    console.log(`  - [${route.method}] ${path}`);
  });
}
