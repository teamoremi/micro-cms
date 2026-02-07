# @micro-cms/core

The backbone of the Micro-CMS ecosystem. This package provides the runtime for loading and composing decoupled modules.

## Features

- **Module Loader:** Discovers and initializes modules with a standardized lifecycle.
- **Staged Event Bus:** Decoupled communication with support for validation, processing, and notification stages.
- **Shared State Manager:** Reactive, cross-module state management.
- **Capability Registry:** Allows modules to provide and consume specialized functionalities (e.g., `database-adapter`, `route-provider`).
- **Route Registry:** Framework-agnostic API endpoint registration.

## Installation

```bash
pnpm add @micro-cms/core
```

## Basic Usage

```javascript
import { createApp } from '@micro-cms/core';
import postgresModule from '@micro-cms/postgres';
import restApiModule from '@micro-cms/rest-api';

const app = createApp();

// Compose your stack
app.use(postgresModule, { connectionString: '...' });
app.use(restApiModule);

// Start the runtime
await app.start();
```

## Core Concepts

### 1. Staged Events
The Event Bus supports deterministic execution order through stages:
1. `validation`: Ensure data integrity.
2. `processing`: Execute business logic (sequential or parallel).
3. `notification`: Trigger post-processing effects.

### 2. Capabilities
Modules can register "capabilities" that other modules can consume via `runtime.getCapability(name)`. This enables a "plug-and-play" architecture where you can swap a database or UI without changing other modules.

### 3. Shared Context
A global, reactive key-value store that allows modules to publish state (like `currentUser` or `currentSchema`) that others can subscribe to.
