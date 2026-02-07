# @micro-cms/node-adapter

A "translator" module that allows the Micro-CMS runtime to communicate with an existing REST API. This is the primary module used when you have a backend with CRUD endpoints and want to instantly generate a full-featured admin panel for it.

## Features

- **API Mapping:** Translates `DataProvider` calls into standard RESTful requests (`GET`, `POST`, `PATCH`, `DELETE`).
- **Schema Introspection:** Fetches data models from a remote `/admin/schema` endpoint to drive the Admin UI.
- **Authentication:** Supports Bearer Token authentication via configuration or local storage.
- **Pagination & Sorting:** Passes through UI state to the API for efficient server-side data handling.

## Installation

```bash
pnpm add @micro-cms/node-adapter
```

## Basic Usage

```javascript
import { createApp } from '@micro-cms/core';
import nodeAdapter from '@micro-cms/node-adapter';
import adminUi from '@micro-cms/admin-ui';

const app = createApp();

// Configure the adapter to point to your API
app.use(nodeAdapter, { 
  apiUrl: 'https://my-api.com',
  token: 'your-secret-token'
});

app.use(adminUi);

await app.start();
```

## API Contract

For this adapter to work, your existing API **must** expose the following endpoints:

1.  **GET /admin/schema:** Must return a JSON object defining your resources and their fields.
2.  **GET /admin/resources/:name:** Must return a paginated list of records.
3.  **POST /admin/resources/:name:** Must handle record creation.
4.  **PATCH /admin/resources/:name/:id:** Must handle updates.
5.  **DELETE /admin/resources/:name/:id:** Must handle deletion.
