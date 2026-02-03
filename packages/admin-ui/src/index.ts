import { CmsModule } from '@micro-cms/types';
import { ComponentRegistry, DefaultTextInput, DefaultNumberInput, DefaultBooleanInput } from './registry';

export * from './registry';
export * from './AutoForm';
export * from './AutoTable';
export * from './OffCanvas';

const adminUiModule: CmsModule = {
  manifest: {
    name: '@micro-cms/admin-ui',
    version: '0.0.1',
    provides: ['admin-interface'],
    requires: ['introspection'],
    pairsWith: {
      '@micro-cms/mock-db': { reason: 'Admin needs data to display', strength: 'recommended' }
    }
  },
  async load({ context }) {
    // Register default components
    ComponentRegistry.register('text', DefaultTextInput);
    ComponentRegistry.register('number', DefaultNumberInput);
    ComponentRegistry.register('boolean', DefaultBooleanInput);

    // Listen to schema changes to potentially re-render or update internal UI state
    context.subscribe('database.schema', (schema) => {
      console.log('Admin UI detected schema update', schema);
    });
  }
};

export default adminUiModule;