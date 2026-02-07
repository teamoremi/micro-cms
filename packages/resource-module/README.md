# @micro-cms/resource-module

A core module that provides framework-agnostic CRUD (Create, Read, Update, Delete) business logic and API route definitions. It acts as the bridge between your database adapter and your web server adapter.

## Features

- **Standardized API Routes:** Provides pre-defined `RouteDefinition`s for resource listing, retrieval, creation, updates, and deletion.
- **Automatic Introspection:** Exposes a `/schema` endpoint that queries the `database-adapter` to describe the data structure.
- **Framework Agnostic:** Generates generic route handlers that can be mounted on Express, Hono, Fastify, or any other supported web framework.
- **Middleware Integration:** Uses abstract middleware keys (like `admin-auth`) that are resolved by the server adapter.

## Installation

```bash
pnpm add @micro-cms/resource-module
```

## Basic Usage

```javascript
import { createApp } from '@micro-cms/core';
import { createResourceModule } from '@micro-cms/resource-module';
import postgresModule from '@micro-cms/postgres';

const app = createApp();

// Resource module REQUIRES a database-adapter
app.use(postgresModule);
app.use(createResourceModule());

await app.start();
```

## Routes Provided

| Method | Path | Description |
| :--- | :--- | :--- |
| `GET` | `/schema` | Returns the data schema for all entities. |
| `GET` | `/resources/:name` | Lists records for a specific resource (supports paging/sorting). |
| `GET` | `/resources/:name/:id` | Returns a single record by ID. |
| `POST` | `/resources/:name` | Creates a new record. |
| `PATCH` | `/resources/:name/:id` | Updates an existing record. |
| `DELETE` | `/resources/:name/:id` | Deletes a record. |
