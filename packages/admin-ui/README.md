# @micro-cms/admin-ui

A collection of schema-driven React components for building dynamic admin interfaces. This package uses the "Zero-Config" style injection strategy to ensure it works in any host application.

## Features

- **AutoForm:** Generates complete forms based on a data schema.
- **AutoTable:** Renders paginated data tables with sorting and actions.
- **OffCanvas:** A slide-in drawer for editing and creating records without leaving the context.
- **Component Registry:** Extensible system to map data types to custom UI components.
- **Zero-Config Styles:** Pre-compiled CSS is automatically injected into the DOM at runtime with `mcms-` prefixing to avoid conflicts.

## Installation

```bash
pnpm add @micro-cms/admin-ui
```

## Basic Usage

```tsx
import { AutoTable, AutoForm } from '@micro-cms/admin-ui';

const schema = {
  name: 'posts',
  fields: [
    { name: 'title', type: 'text', label: 'Post Title' },
    { name: 'is_published', type: 'boolean', label: 'Published' }
  ]
};

function MyAdmin() {
  return (
    <div>
      <AutoTable 
        schema={schema} 
        data={[]} 
        onEdit={(id) => console.log('Edit', id)} 
      />
      
      <AutoForm 
        schema={schema} 
        onSubmit={(data) => console.log('Saving', data)} 
      />
    </div>
  );
}
```

## Customizing Components

You can register custom input components for specific data types via the `ComponentRegistry`:

```tsx
import { ComponentRegistry } from '@micro-cms/admin-ui';

ComponentRegistry.register('geo_point', MyMapPicker);
```

## Design System

All components are styled with Tailwind CSS using an `mcms-` prefix. This package is fully isolated and will not leak styles into your application or be affected by your app's global CSS resets.
