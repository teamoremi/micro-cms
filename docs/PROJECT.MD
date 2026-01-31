# Project Plan: Micro-CMS

## Vision: Composable-CMS
Micro-CMS is a runtime for loading and composing modules. There is no monolithic core. Users assemble their stack (Database, API, Admin UI, Auth) from loose modules that communicate via a standard Event Bus and Shared State.

## Core Architecture (The Runtime)
*   **Module Loader:** Discovers and initializes modules.
*   **Dependency Resolver:** Ensures module compatibility.
*   **Event Bus:** Decoupled communication (e.g., `record.created`).
*   **State Manager:** Shared reactive state (e.g., `schema`, `currentUser`).

---

## Phase 1: Schema-Driven UI (The First Module)
**Goal:** Implement the "Admin Scaffolding" capabilities where the UI constructs itself based on data introspection.

### Philosophy
**Database Schema → Introspection → Metadata → UI Components**

We strictly follow **Convention-over-Configuration**. If a field is `varchar(255)`, we render a Text Input. If it's a foreign key, we render a Searchable Select.

### Composability Pattern
To ensure this is not a monolith, the "Schema-Driven UI" is not one giant function. It is a pipeline of composable parts:

1.  **Introspection Provider (Adapter Pattern):**
    *   Modules (like `@cms/postgres`) provide a standard `introspect()` method.
    *   This decouples the UI from the specific database technology.
2.  **Metadata Normalization (The Contract):**
    *   Raw DB types are mapped to a simplified internal Schema Definition Language (SDL) or JSON Schema.
    *   UI generators only care about this Normalized Metadata, not raw SQL types.
3.  **Component Registry (Dependency Injection):**
    *   A map of `DataType -> Component`.
    *   Modules can register new components (e.g., a "Map" module registers a component for `geo_point` types).
4.  **Layout Engine (Strategy Pattern):**
    *   Decides how to arrange fields (Grid, Stack, Tabs).
    *   Can be swapped or configured via metadata overrides.

### Implementation Plan (Schema-Driven UI)

#### Step 1: The Runtime Scaffold
*   Setup a minimal `ModuleLoader` and `EventBus`.
*   Create a basic `State` store.

#### Step 2: The Schema Standard
*   Define the TypeScript interfaces for the **Normalized Schema**:
    ```typescript
    interface Entity {
      name: string;
      fields: Field[];
    }
    interface Field {
      name: string;
      type: 'text' | 'number' | 'boolean' | 'date' | 'relation';
      constraints: { required: boolean; min?: number; max?: number };
      ui?: { widget?: string; label?: string }; // Overrides
    }
    ```

#### Step 3: Mock Introspection Module
*   Create `@cms/mock-db` that returns a hardcoded schema (e.g., Products, Users) to simulate a database.
*   This allows us to build the UI without a running Postgres instance yet.

#### Step 4: The Component Registry
*   Create a registry that holds mappings:
    *   `text` -> `<TextInput />`
    *   `boolean` -> `<Switch />`
    *   `relation` -> `<RelationPicker />`

#### Step 5: Dynamic Form Generator
*   Implement `<AutoForm schema={entity} />`.
*   It iterates through `entity.fields`, looks up the component in the Registry, and renders it.
*   Handles validation based on `constraints`.

#### Step 6: Dynamic Data View
*   Implement `<AutoTable schema={entity} />`.
*   Generates columns based on fields.

---

## Folder Structure (Monorepo)
```
micro-cms/
├── packages/
│   ├── core/           # The Runtime (Loader, EventBus)
│   ├── types/          # Shared interfaces (Schema, Module)
│   ├── admin-ui/       # The Schema-Driven UI Engine
│   ├── mock-db/        # Testing module
│   └── react-ui/       # Base component library (shadcn/ui etc)
├── apps/
│   └── playground/     # A test app assembling the modules
├── docs/
└── package.json
```
