# @micro-cms/types

Standardized TypeScript interfaces and type definitions for the Micro-CMS ecosystem. This package ensures strict contracts between modules, the runtime, and front-end components.

## Installation

```bash
pnpm add @micro-cms/types
```

## Key Definitions

### 1. Schema System
Defines the `Entity`, `Field`, and `Schema` structures used to drive the Admin UI and validation logic.

### 2. Module System
- **`CmsModule`**: The interface every module must implement.
- **`ModuleManifest`**: Metadata about a module, including its capabilities (`provides`) and requirements (`requires`).
- **`CmsContext`**: The object passed to a module during load, containing access to the runtime, events, and shared state.

### 3. Capabilities
Contracts for common system functionalities:
- **`DataProvider`**: For database adapters.
- **`RouteProvider`**: For contributing API endpoints.
- **`PaymentProvider`**: For blockchain payment integrations.

### 4. Event System
Types for the staged event bus, including `EventStage` (`validation`, `processing`, `notification`) and `SubscriptionOptions`.

## Usage

This package is typically used as a `devDependency` in other modules to ensure type safety:

```typescript
import { CmsModule, CmsContext } from '@micro-cms/types';

export default {
  manifest: {
    name: 'my-module',
    provides: ['custom-capability']
  },
  async load(context: CmsContext) {
    // ...
  }
} as CmsModule;
```
