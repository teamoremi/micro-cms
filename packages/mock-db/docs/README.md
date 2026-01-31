# @micro-cms/mock-db

A database adapter module for development and testing.

## Capabilities
- `database-adapter`: Provides standard CRUD operations.
- `introspection`: Exposes the `database.schema` via the shared context.

## Manifest
- **Provides**: `['database-adapter', 'introspection']`
- **Publishes**: `database.schema`

## Implementation
This module provides a `MockDataProvider` which stores data in-memory. It publishes the schema during the `load` phase, enabling the Admin UI to generate its interface instantly.
