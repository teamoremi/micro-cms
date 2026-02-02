# @micro-cms/admin-ui

A "Schema-Driven" UI engine that auto-generates interfaces from database metadata.

## 🚀 Key Components

### 1. `AutoTable`
Generates a data grid with built-in support for simple arrays or server-side pagination.

#### **Props**
| Prop | Type | Description |
| :--- | :--- | :--- |
| `entity` | `Entity` | The schema definition for the rows. |
| `data` | `any[] \| PaginatedResponse` | The row data. If `PaginatedResponse`, controls appear. |
| `onEdit` | `(item: any) => void` | Optional callback when the Edit button is clicked. |
| `onDelete` | `(item: any) => void` | Optional callback when the Delete button is clicked. |
| `onPageChange` | `(page: number) => void` | Required for pagination controls. |

#### **Example**
```tsx
<AutoTable 
  entity={userEntitySchema} 
  data={paginatedData} 
  onPageChange={(p) => setPage(p)}
  onEdit={(item) => navigate(`/edit/${item.id}`)}
/>
```

---

### 2. `AutoForm`
Generates a complete form with validation hints based on your `Entity` fields.

#### **Props**
| Prop | Type | Description |
| :--- | :--- | :--- |
| `entity` | `Entity` | The schema definition for the form fields. |
| `initialData` | `any` | Optional. Data to pre-populate (for Edit mode). |
| `onSubmit` | `(data: any) => void` | Callback triggered on form submission. |

#### **Example**
```tsx
<AutoForm 
  entity={productSchema} 
  initialData={currentProduct}
  onSubmit={handleSave} 
/>
```

---

## 🛠 Extensibility

### Component Registry
The engine uses a singleton registry to map `FieldType` to React components. You can register custom widgets (e.g., a Rich Text Editor or a Map picker).

```typescript
import { ComponentRegistry } from '@micro-cms/admin-ui';

ComponentRegistry.register('rich-text', MyRichTextEditor);
```

Any field in your schema with `type: 'rich-text'` will now automatically render using your custom component.

## 🧩 Design Philosophy
- **Zero Configuration**: It assumes sensible defaults (e.g., `boolean` renders as a checkbox).
- **Metadata-First**: The UI is a pure reflection of the `database.schema`.
- **Stateless**: Components don't manage their own data fetching; they consume props, making them easy to integrate into any routing or state management library (React Query, TanStack Router, etc.).