# @micro-cms/express-adapter

The glue between the Micro-CMS runtime and the Express.js framework. This module automatically discovers API routes defined by other CMS modules and binds them to your Express application.

## Features

- **Automatic Route Discovery:** Polls the CMS runtime for all registered `route-provider` capabilities.
- **Middleware Mapping:** Translates abstract middleware keys used in modules to real Express middleware functions.
- **Error Handling:** Provides a standardized wrapper for catching and reporting errors in CMS routes.
- **Prefix Support:** Allows mounting all CMS routes under a specific base path (e.g., `/api/admin`).

## Installation

```bash
pnpm add @micro-cms/express-adapter
```

## Basic Usage

```javascript
import express from 'express';
import { createApp } from '@micro-cms/core';
import { bindExpressRoutes } from '@micro-cms/express-adapter';
import resourceModule from '@micro-cms/resource-module';

const app = express();
const cms = createApp();

// Load modules
cms.use(resourceModule);
await cms.start();

// Bind CMS routes to Express
bindExpressRoutes({
  app,
  cms,
  routePrefix: '/api/v1',
  middlewareMap: {
    'admin-auth': (req, res, next) => {
      // Your auth logic here
      next();
    }
  }
});

app.listen(3000);
```

## How It Works

Modules like `@micro-cms/resource-module` provide generic `RouteDefinition` objects (containing method, path, and handler) to the CMS runtime. The Express Adapter iterates through these definitions and calls `app.get()`, `app.post()`, etc., on your Express instance, effectively "mounting" the CMS functionality into your existing server.
