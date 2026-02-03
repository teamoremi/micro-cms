import { CmsModule, CmsContext, RouteProvider, RouteDefinition, DataProvider } from '@micro-cms/types';

export const createResourceModule = (): CmsModule => {
  return {
    manifest: {
      name: '@micro-cms/resource-module',
      version: '1.0.0',
      provides: ['route-provider'],
      requires: ['database-adapter']
    },
    async load(context: CmsContext) {
      const db = context.runtime.getCapability<DataProvider>('database-adapter');
      
      if (!db) {
        console.error('Resource Module failed to load: database-adapter not found');
        return;
      }

      const routes: RouteDefinition[] = [
        // Introspection
        {
          method: 'GET',
          path: '/schema',
          handler: async (req, res) => {
            const schema = await db.introspect();
            res.json(schema);
          },
          middleware: ['admin-auth']
        },
        // Generic List
        {
          method: 'GET',
          path: '/resources/:resource',
          handler: async (req, res) => {
            const { resource } = req.params;
            const { page, limit, sort, ...filter } = req.query;
            const result = await db.find(resource, {
              page: Number(page) || 1,
              limit: Number(limit) || 10,
              sort: sort as string,
              filter
            });
            res.json(result);
          },
          middleware: ['admin-auth']
        },
        // Generic Get One
        {
          method: 'GET',
          path: '/resources/:resource/:id',
          handler: async (req, res) => {
            const { resource, id } = req.params;
            const item = await db.findById(resource, id);
            if (!item) return res.status(404).json({ error: 'Not found' });
            res.json(item);
          },
          middleware: ['admin-auth']
        },
        // Generic Create
        {
          method: 'POST',
          path: '/resources/:resource',
          handler: async (req, res) => {
            const { resource } = req.params;
            const item = await db.create(resource, req.body);
            res.status(201).json(item);
          },
          middleware: ['admin-auth']
        }
      ];

      // Register the routes as a capability
      context.runtime.register('route-provider', {
        getRoutes: () => routes
      } as RouteProvider);

      console.log('Resource Module loaded and registered routes.');
    }
  };
};
