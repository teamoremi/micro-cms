# @micro-cms/admin-ui

A "Schema-Driven" UI engine that auto-generates interfaces from database metadata.

## Features

### Component Registry
A central map of `DataType -> ReactComponent`. Modules can extend the UI by registering new widgets for specific data types.

### Auto-Generation
- `AutoForm`: Generates a full create/edit form from an `Entity` definition.
- `AutoTable`: Generates a data list with actions from an `Entity` definition.

## Design Pattern Compliance
- **Convention-over-Configuration**: Assumes sensible defaults for field types (e.g., `boolean` -> Switch/Checkbox).
- **Metadata-Driven**: Uses the `database.schema` published by database modules.

## Usage

```tsx
import { AutoForm } from '@micro-cms/admin-ui';

<AutoForm entity={userEntity} onSubmit={saveUser} />
```
