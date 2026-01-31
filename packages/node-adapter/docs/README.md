# @micro-cms/node-adapter

A remote database adapter that connects to a Node.js API.

## Capabilities
- `database-adapter`: Connects to a remote REST API for CRUD operations.
- `introspection`: Fetches the schema from the `/admin/schema` endpoint.

## Manifest
- **Provides**: `['database-adapter', 'introspection']`
- **Publishes**: `database.schema`

## Configuration
Requires `apiUrl` and optionally a `token`.

```typescript
{
  apiUrl: 'http://localhost:3351/api',
  token: 'optional-token'
}
```

## Implementation
Uses `fetch` to communicate with the backend. It automatically includes the `Authorization` header if a token is provided in config or found in `localStorage.getItem('adminToken')`.
