# 🧩 Micro-CMS

**The Composable, Zero-Core, Schema-Driven CMS Runtime.**

Micro-CMS is not a monolithic application; it is a **runtime** that loads and orchestrates independent modules. It follows a "pay-for-what-you-use" philosophy where the CMS is assembled from loose parts (Database, API, Auth, UI) that communicate via a staged event bus and a published state system.

## ✨ Key Features

- **Zero Core:** The runtime ships with nothing but a module loader and an event bus.
- **Composable Architecture:** Swap Postgres for MySQL, or a REST API for GraphQL by simply changing a module.
- **Schema-Driven UI:** The Admin interface (`@micro-cms/admin-ui`) introspects your database schema to auto-generate forms and tables.
- **AI-First Design:** Every module exposes a declarative manifest that allows AI assistants to understand, configure, and pair modules automatically.
- **Staged Event Bus:** Deterministic execution flow with `validation`, `processing`, and `notification` stages.

## 🏗 Architecture

The project is structured as a pnpm monorepo:

| Package | Description |
| :--- | :--- |
| [`@micro-cms/core`](./packages/core) | The Runtime orchestrator and Event Bus. |
| [`@micro-cms/types`](./packages/types) | Shared contracts and manifest definitions. |
| [`@micro-cms/admin-ui`](./packages/admin-ui) | React engine for dynamic, metadata-driven UI. |
| [`@micro-cms/resource-module`](./packages/resource-module) | Framework-agnostic CRUD & Schema logic. |
| [`@micro-cms/express-adapter`](./packages/express-adapter) | Binds CMS modules to Express.js endpoints. |
| [`@micro-cms/crypto-payments`](./packages/crypto-payments) | Drop-in React widget for blockchain payments. |
| [`@micro-cms/node-adapter`](./packages/node-adapter) | Remote API adapter for Node.js backends. |
| [`@micro-cms/mock-db`](./packages/mock-db) | In-memory database for rapid prototyping. |

## 🚀 Quick Start

### 1. Installation

```bash
pnpm install
pnpm -r build
```

### 2. Basic Setup (Playground)

Create a CMS instance by composing modules:

```typescript
import { createApp } from '@micro-cms/core';
import mockDb from '@micro-cms/mock-db';
import adminUi from '@micro-cms/admin-ui';

const app = createApp();

// Assemble the stack
app.use(mockDb);
app.use(adminUi);

// Start the runtime
await app.start();
```

### 3. Run the Playground

```bash
cd apps/playground
pnpm dev
```

## 🛠 Module Design Pattern

All modules must follow the pattern defined in [`docs/DESIGN_PATTERN.md`](./docs/DESIGN_PATTERN.md):

```javascript
export default {
  manifest: {
    name: '@micro-cms/my-module',
    version: '1.0.0',
    provides: ['capability-name'],
    publishes: {
      'state.key': 'Description of published state'
    }
  },
  async load({ runtime, context, events }) {
    // 1. Register capabilities
    runtime.register('capability-name', implementation);
    
    // 2. Publish state
    context.publish('state.key', initialData);
    
    // 3. Listen to events
    events.subscribe('record.created', async (data) => { ... });
  }
}
```

## 📖 Documentation

- [Project Vision & Plan](./docs/PROJECT.MD)
- [Design Patterns & Philosophy](./docs/DESIGN_PATTERN.md)
- [Core Runtime Docs](./packages/core/docs/README.md)
- [Admin UI Docs](./packages/admin-ui/docs/README.md)

## ⚖️ License

ISC
