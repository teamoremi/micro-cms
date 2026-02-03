export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'relation' | 'select';

export interface FieldConstraints {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  options?: string[];
}

export interface Field {
  name: string;
  type: FieldType;
  label?: string;
  constraints?: FieldConstraints;
  relation?: {
    targetEntity: string;
    displayField: string;
  };
}

export interface Entity {
  name: string;
  fields: Field[];
}

export interface Schema {
  entities: Entity[];
}

// Staged Event Bus Types
export type EventStage = 'validation' | 'processing' | 'notification' | 'default';

export interface SubscriptionOptions {
  priority?: number;
  stage?: EventStage;
  parallel?: boolean;
}

// Module Manifest
export interface ModuleManifest {
  name: string;
  version: string;
  provides: string[];
  requires?: string[];
  optionalDependencies?: string[];
  pairsWith?: Record<string, {
    reason: string;
    strength: 'required' | 'recommended' | 'compatible' | 'optional';
    category?: string;
  }>;
  publishes?: Record<string, string>; // key -> description
}

// The core Module interface
export interface CmsModule {
  manifest: ModuleManifest;
  load: (context: CmsContext) => void | Promise<void>;
}

export interface CmsContext {
  runtime: {
    register: (capability: string, implementation: any) => void;
    getCapability: <T = any>(capability: string) => T | undefined;
  };
  events: {
    emit: (event: string, payload: any, stage?: EventStage) => Promise<void>;
    subscribe: (event: string, handler: (payload: any) => void | Promise<void>, options?: SubscriptionOptions) => void;
  };
  context: {
    publish: (key: string, value: any) => void;
    get: (key: string) => any;
    subscribe: (key: string, handler: (value: any) => void) => void;
  };
  config: Record<string, any>;
}

// Data Provider Capability (Standardized)
export interface PaginatedResponse<T = any> {
  data: T[];
  total: number;
  page: number;
  limit: number;
}

export interface DataProvider {
  introspect: () => Promise<Schema>;
  find: (entity: string, query?: { 
    page?: number; 
    limit?: number; 
    filter?: any; 
    sort?: string;
    q?: string;
  }) => Promise<PaginatedResponse | any[]>;
  findById: (entity: string, id: any) => Promise<any>;
  create: (entity: string, data: any) => Promise<any>;
  update: (entity: string, id: any, data: any) => Promise<any>;
    delete: (entity: string, id: any) => Promise<any>;
  }
  
  // Backend Routing Capability
  export interface RouteDefinition {
    method: 'GET' | 'POST' | 'PATCH' | 'DELETE' | 'PUT';
    path: string;
    handler: (req: any, res: any) => Promise<void>;
    middleware?: string[];
    meta?: Record<string, any>;
  }
  
  export interface RouteProvider {
    getRoutes: () => RouteDefinition[];
  }
  
  // Crypto Payment Ability
  export interface PaymentIntent {
    orderId: string;
    paymentAddress: string;
    amount: string;
    currency: string;
    network: string;
    nonce: string;
  }
  
  export interface PaymentVerification {
    transactionHash: string;
    orderId: string;
    status: 'pending' | 'confirmed' | 'failed';
  }
  
  export interface PaymentProvider {
    initiatePayment: (orderId: string, options: any) => Promise<PaymentIntent>;
    verifyPayment: (txHash: string, orderId: string) => Promise<PaymentVerification>;
  }
  