# @micro-cms/core

The runtime orchestrator for Micro-CMS modules.

## Features

### Module Orchestration
Loads modules based on their manifests and provides them with a `CmsContext`.

### Staged Event Bus
Implements the hybrid event execution pattern:
1.  **Sequential Validation**: Priority-based handlers for pre-flight checks.
2.  **Parallel Processing**: High-performance main logic.
3.  **Sequential Notification**: Predictable side effects.

### Published State Management
Implements a reactive, published-only state system. Modules can `publish` state, while other modules can `subscribe` to it. This ensures clear ownership and prevents race conditions.

## Usage

```typescript
import { createApp } from '@micro-cms/core';
import mockDb from '@micro-cms/mock-db';

const app = createApp();
app.use(mockDb);
await app.start();
```
