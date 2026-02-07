# @micro-cms/mock-db

A development utility that provides an in-memory database and simulated blockchain payment provider. This allows you to build and test your CMS logic without needing a running PostgreSQL instance or a real blockchain wallet.

## Features

- **Standardized Data Provider:** Implements the `DataProvider` interface with support for CRUD, pagination, sorting, and searching.
- **Mock Introspection:** Returns a rich, predefined schema (`users`, `posts`, `orders`) to drive the Admin UI.
- **Mock Payment Provider:** Simulates the crypto payment handshake (`initiate` and `verify`) for testing checkout flows.
- **Auto-Sync:** Automatically publishes its schema to the global CMS context on load.

## Installation

```bash
pnpm add @micro-cms/mock-db
```

## Basic Usage

```javascript
import { createApp } from '@micro-cms/core';
import mockDbModule from '@micro-cms/mock-db';
import adminUiModule from '@micro-cms/admin-ui';

const app = createApp();

// Use the mock database
app.use(mockDbModule);

// The Admin UI will automatically discover the schema from the mock DB
app.use(adminUiModule);

await app.start();
```

## How It Works

The module registers implementation for three core CMS capabilities:
1. `database-adapter`: Handles data persistence (in-memory).
2. `introspection`: Provides the schema metadata.
3. `payment-provider`: Simulates blockchain interactions.

This makes it the perfect "companion" module for front-end development before the real back-end is ready.
