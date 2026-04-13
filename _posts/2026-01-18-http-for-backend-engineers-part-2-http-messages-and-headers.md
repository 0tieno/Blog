---
type: post
title: "HTTP for Backend Engineers (Part 2): Messages and Headers"
date: 2026-01-18 09:00:00 +0300
categories:
  - backend
  - http
---

In this part, we unpack HTTP request/response messages and understand why headers are so important.

### HTTP message anatomy

#### Request message

A request usually contains:

- method (GET, POST, etc.)
- resource URL
- HTTP version
- headers
- blank line
- optional request body

Example:

```http
POST /users HTTP/1.1
Host: api.example.com
Content-Type: application/json
Authorization: Bearer <token>

{"name":"Alice"}
```

#### Response message

A response usually contains:

- HTTP version
- status code + status text
- headers
- blank line
- optional response body

Example:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Cache-Control: no-cache

{"id":1,"name":"Alice"}
```

### Why headers exist

Headers are metadata as key-value pairs.

Real-world analogy: shipping labels on a parcel. You do not hide delivery metadata inside the package; you expose it so transport systems can quickly route/process it.

Same idea in HTTP:

- metadata belongs in headers
- payload belongs in body

### Header categories you should know

#### 1) Request headers

Sent by client to describe request context.

Examples:

- User-Agent
- Authorization
- Accept

#### 2) General headers

Used in requests/responses for message-level metadata.

Examples:

- Date
- Cache-Control
- Connection

#### 3) Representation headers

Describe body representation.

Examples:

- Content-Type
- Content-Length
- Content-Encoding
- ETag

#### 4) Security headers

Control browser security behavior.

Examples:

- Strict-Transport-Security
- Content-Security-Policy
- X-Frame-Options
- X-Content-Type-Options
- Set-Cookie with HttpOnly/Secure

### Two powerful ideas behind headers

#### Extensibility

HTTP can evolve by adding headers without changing core protocol semantics.

Examples:

- new security controls
- custom app headers
- richer content negotiation

#### Remote control behavior

Headers let client/server influence each other safely.

Examples:

- `Accept` asks for specific representation
- `Authorization` drives access decisions
- `Cache-Control` guides caching behavior

### TLDR

Headers are not optional decoration. They are protocol-level control channels that make HTTP practical, extensible, and production-ready.

In [Part 3]({{ '/http-for-backend-engineers-part-3-methods-and-idempotency/' | relative_url }}), we cover HTTP methods, semantics, and idempotency.

Happy hacking!

