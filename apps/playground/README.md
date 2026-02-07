# Micro-CMS Playground

A demonstration and testing application for the Micro-CMS ecosystem. This app assembles various modules (Database, API, Admin UI) to showcase the composability of the platform.

## Features

- **Full Stack Example:** Uses `@micro-cms/mock-db`, `@micro-cms/resource-module`, and `@micro-cms/admin-ui` in a single application.
- **Hot Reloading:** Fast development experience with Vite.
- **Design System:** Showcases the pre-styled components in a real-world scenario.

## Getting Started

```bash
pnpm install
pnpm dev
```

## How it's built

The playground demonstrates the "Assembly" pattern:

```typescript
import { createApp } from '@micro-cms/core';
import mockDb from '@micro-cms/mock-db';
import adminUi from '@micro-cms/admin-ui';

const app = createApp();
app.use(mockDb);
app.use(adminUi);
app.start();
```
