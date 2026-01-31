# @micro-cms/types

This package contains the shared TypeScript interfaces and type definitions that form the "Common Tongue" of the Micro-CMS ecosystem.

## Core Concepts

### 1. Schema Definition
The system uses a normalized schema format to describe entities and fields:
- `Entity`: A collection of fields (e.g., `users`).
- `Field`: A single data point with a `FieldType` (text, number, boolean, etc.) and optional `FieldConstraints`.

### 2. Module Manifest
Following the **Declarative Module Manifest** pattern, every module must expose a manifest describing its capabilities and dependencies:
- `provides`: Capabilities this module offers.
- `requires`: Capabilities this module needs.
- `pairsWith`: Recommended complementary modules.
- `publishes`: State keys this module manages.

### 3. Staged Event Bus
Supports a three-tier event execution flow:
- `validation`: For checks and constraints.
- `processing`: For main logic (can be parallel).
- `notification`: For post-processing effects.

## Usage
Import these types to ensure your module is compatible with the `micro-cms` runtime.

```typescript
import { CmsModule, CmsContext } from '@micro-cms/types';
```
