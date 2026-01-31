import { CmsModule, CmsContext, DataProvider, Schema } from '@micro-cms/types';

export interface NodeAdapterConfig {
  apiUrl: string;
  token?: string;
}

export class NodeDataProvider implements DataProvider {
  constructor(private config: NodeAdapterConfig) {}

  private async fetchApi(path: string, options: RequestInit = {}) {
    const token = localStorage.getItem('adminToken') || this.config.token;
    
    const response = await fetch(`${this.config.apiUrl}${path}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
        ...options.headers,
      },
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.statusText}`);
    }

    return response.json();
  }

  async introspect(): Promise<Schema> {
    const response = await this.fetchApi('/admin/schema');
    return {
      entities: Object.entries(response.resources).map(([name, def]: [string, any]) => ({
        name,
        fields: def.fields,
        displayField: def.displayField,
        primaryKey: def.primaryKey,
        label: def.label,
      })),
    };
  }

  async find(entity: string, query?: any) {
    const queryString = query ? '?' + new URLSearchParams(query).toString() : '';
    const response = await this.fetchApi(`/admin/resources/${entity}${queryString}`);
    return response.data;
  }

  async create(entity: string, data: any) {
    return this.fetchApi(`/admin/resources/${entity}`, {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }

  async update(entity: string, id: any, data: any) {
    return this.fetchApi(`/admin/resources/${entity}/${id}`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    });
  }

  async delete(entity: string, id: any) {
    return this.fetchApi(`/admin/resources/${entity}/${id}`, {
      method: 'DELETE',
    });
  }
}

const nodeAdapterModule: CmsModule = {
  manifest: {
    name: '@micro-cms/node-adapter',
    version: '0.0.1',
    provides: ['database-adapter', 'introspection'],
    publishes: {
      'database.schema': 'The remote database schema'
    }
  },
  async load(context: CmsContext) {
    const config = context.config as NodeAdapterConfig;
    const provider = new NodeDataProvider(config);
    
    context.runtime.register('database-adapter', provider);
    
    try {
      const schema = await provider.introspect();
      context.context.publish('database.schema', schema);
    } catch (error) {
      console.error('NodeAdapter failed to introspect schema:', error);
    }
  }
};

export default nodeAdapterModule;