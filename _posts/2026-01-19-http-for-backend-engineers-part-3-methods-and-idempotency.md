---
type: post
title: "HTTP for Backend Engineers (Part 3): Methods and Idempotency"
date: 2026-01-19 09:00:00 +0300
categories:
  - backend
  - http
---

HTTP methods define intent.

They tell the server what action the client wants, not just where the resource is.

### Core methods

#### GET

- Fetch data
- Should not mutate server state

#### POST

- Create new resource / trigger non-idempotent action
- Usually includes request body

#### PATCH

- Partial update of existing resource
- Preferred for selective updates

#### PUT

- Full replacement of resource representation
- Use when full overwrite semantics are intended

#### DELETE

- Remove resource

#### OPTIONS

- Ask server capabilities for a resource
- Important for CORS preflight flow

### PATCH vs PUT

A practical rule:

- Use PATCH for partial updates
- Use PUT only when replacing the full resource representation

Many APIs use PUT loosely, but clear semantics help maintainability and client behavior.

### Idempotency

A method is idempotent if repeating the same request produces the same server state outcome.

#### Typically idempotent

- GET
- PUT
- DELETE

Why:

- GET reads, no mutation intended
- PUT repeatedly replacing with same payload leads to same final state
- DELETE after first success keeps resource absent

#### Typically non-idempotent

- POST

Why:

Repeating the same POST often creates multiple resources or triggers repeated side effects.

### Why idempotency matters

- Safe retries on network failures
- Clearer distributed-system behavior
- Better API contracts for clients and gateways

### TLDR

Methods are not just syntax. They are semantic contracts.

When APIs respect method intent and idempotency, systems are easier to debug, scale, and reason about.

In [Part 4]({{ '/http-for-backend-engineers-part-4-cors-simple-flow/' | relative_url }}), we begin CORS with simple request flow.

Happy hacking!
