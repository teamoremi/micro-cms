import { CmsModule, DataProvider, Schema } from '@micro-cms/types';

const MOCK_SCHEMA: Schema = {
  entities: [
    {
      name: 'users',
      fields: [
        { name: 'id', type: 'number', constraints: { required: true } },
        { name: 'name', type: 'text', label: 'Full Name', constraints: { required: true, minLength: 2 } },
        { name: 'email', type: 'text', label: 'Email Address', constraints: { required: true } },
        { name: 'isActive', type: 'boolean', label: 'Active User' },
        { name: 'role', type: 'select', constraints: { options: ['admin', 'editor', 'viewer'] } }
      ]
    },
    {
      name: 'posts',
      fields: [
        { name: 'id', type: 'number', constraints: { required: true } },
        { name: 'title', type: 'text', constraints: { required: true } },
        { name: 'content', type: 'text' },
        { name: 'publishedAt', type: 'date' },
        { name: 'authorId', type: 'relation', relation: { targetEntity: 'users', displayField: 'name' } }
      ]
    }
  ]
};

const MOCK_DATA: Record<string, any[]> = {
  users: [
    { id: 1, name: 'Alice Admin', email: 'alice@example.com', isActive: true, role: 'admin' },
    { id: 2, name: 'Bob Builder', email: 'bob@example.com', isActive: false, role: 'editor' }
  ],
  posts: [
    { id: 1, title: 'Hello World', content: 'First post', publishedAt: '2023-01-01', authorId: 1 }
  ]
};

export class MockDataProvider implements DataProvider {
  async introspect(): Promise<Schema> {
    return Promise.resolve(MOCK_SCHEMA);
  }

  async find(entity: string): Promise<any[]> {
    return Promise.resolve(MOCK_DATA[entity] || []);
  }

  async create(entity: string, data: any): Promise<any> {
    const table = MOCK_DATA[entity] || [];
    const newItem = { ...data, id: table.length + 1 };
    MOCK_DATA[entity] = [...table, newItem];
    return Promise.resolve(newItem);
  }

  async update(entity: string, id: any, data: any): Promise<any> {
    return Promise.resolve(data);
  }

  async delete(entity: string, id: any): Promise<any> {
    return Promise.resolve({ success: true });
  }
}

const mockDbModule: CmsModule = {
  manifest: {
    name: '@micro-cms/mock-db',
    version: '0.0.1',
    provides: ['database-adapter', 'introspection'],
    publishes: {
      'database.schema': 'The current database schema'
    }
  },
  async load({ runtime, context }) {
    const provider = new MockDataProvider();
    runtime.register('database-adapter', provider);
    
    const schema = await provider.introspect();
    context.publish('database.schema', schema);
  }
};

export default mockDbModule;