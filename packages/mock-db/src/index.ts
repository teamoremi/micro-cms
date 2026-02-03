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

  async find(entity: string, query?: { page?: number; limit?: number }): Promise<any> {
    const table = MOCK_DATA[entity] || [];
    const page = query?.page || 1;
    const limit = query?.limit || 10;
    const start = (page - 1) * limit;
    const end = start + limit;
    
    return Promise.resolve({
      data: table.slice(start, end),
      total: table.length,
      page,
      limit
    });
  }

  async findById(entity: string, id: any): Promise<any> {
    const table = MOCK_DATA[entity] || [];
    return Promise.resolve(table.find(item => String(item.id) === String(id)));
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

export class MockPaymentProvider {
  async initiatePayment(orderId: string, options: any) {
    console.log(`[MockPayment] Initiating for order ${orderId}`, options);
    return {
      orderId,
      paymentAddress: '0x1234...5678_MOCK_ADDRESS',
      amount: options.amount || '0.1',
      currency: options.currency || 'ETH',
      network: 'MockNetwork',
      nonce: Math.random().toString(36).substring(7)
    };
  }

  async verifyPayment(txHash: string, orderId: string) {
    console.log(`[MockPayment] Verifying tx ${txHash} for order ${orderId}`);
    return {
      transactionHash: txHash,
      orderId,
      status: 'confirmed'
    };
  }
}

const mockDbModule: CmsModule = {
  manifest: {
    name: '@micro-cms/mock-db',
    version: '0.0.1',
    provides: ['database-adapter', 'introspection', 'payment-provider'],
    publishes: {
      'database.schema': 'The current database schema'
    }
  },
  async load({ runtime, context }) {
    const provider = new MockDataProvider();
    runtime.register('database-adapter', provider);

    const paymentProvider = new MockPaymentProvider();
    runtime.register('payment-provider', paymentProvider);
    
    const schema = await provider.introspect();
    context.publish('database.schema', schema);
  }
};

export default mockDbModule;