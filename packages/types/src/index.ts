export type FieldType = 'text' | 'number' | 'boolean' | 'date' | 'relation' | 'select';

export interface FieldConstraints {
  required?: boolean;
  min?: number;
  max?: number;
  minLength?: number;
  maxLength?: number;
  options?: string[]; // For select types
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

// Module Contract
export interface CmsModule {
  name: string;
  setup: (context: CmsContext) => void | Promise<void>;
}

export interface CmsContext {
  registerHook: (hook: string, callback: Function) => void;
  emit: (event: string, payload: any) => void;
  state: Record<string, any>;
}

// Data Provider Contract (for Introspection)
export interface DataProvider {
  introspect: () => Promise<Schema>;
  find: (entity: string, query?: any) => Promise<any[]>;
  create: (entity: string, data: any) => Promise<any>;
  update: (entity: string, id: any, data: any) => Promise<any>;
  delete: (entity: string, id: any) => Promise<any>;
}
