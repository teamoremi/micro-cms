import { CmsModule, CmsContext, DataProvider, Schema, Entity } from '@micro-cms/types';

export interface NodeAdapterConfig {
  apiUrl: string;
  token: string;
}

export const NodeAdapter = (config: NodeAdapterConfig): CmsModule & { provider: DataProvider } => {
  const fetchApi = async (path: string, options: RequestInit = {}) => {
    const response = await fetch(`${config.apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${config.token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  };

  const provider: DataProvider = {
    introspect: async (): Promise<Schema> => {
      // This endpoint will be implemented in node_api
      const response = await fetchApi('/admin/schema');
      return {
        entities: Object.entries(response.resources).map(([name, def]: [string, any]) => ({
          name,
          fields: def.fields,
        })),
      };
    },

    find: async (entity: string, query?: any) => {
      const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
      return fetchApi(`/admin/resources/${entity}${queryString}`);
    },

    create: async (entity: string, data: any) => {
      return fetchApi(`/admin/resources/${entity}`, {
        method: 'POST',
        body: JSON.stringify(data),
      });
    },

    update: async (entity: string, id: any, data: any) => {
      return fetchApi(`/admin/resources/${entity}/${id}`, {
        method: 'PATCH',
        body: JSON.stringify(data),
      });
    },

    delete: async (entity: string, id: any) => {
      return fetchApi(`/admin/resources/${entity}/${id}`, {
        method: 'DELETE',
      });
    },
  };

  return {
    name: '@micro-cms/node-adapter',
    setup: (context: CmsContext) => {
      context.state.dataProvider = provider;
      console.log('NodeAdapter initialized');
    },
    provider, // Expose provider directly for easier usage in some contexts
  };
};
