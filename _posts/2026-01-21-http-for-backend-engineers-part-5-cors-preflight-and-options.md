---
type: post
title: "HTTP for Backend Engineers (Part 5): CORS Preflight and OPTIONS"
date: 2026-01-21 09:00:00 +0300
categories:
  - backend
  - http
  - cors
---

When a cross-origin request is not simple, the browser sends a preflight request first.

That preflight uses the OPTIONS method.

## When preflight happens

Cross-origin request + any of these:

- method is not GET/POST/HEAD
- non-simple headers are used (for example Authorization)
- content-type is non-simple (for example application/json in many practical cases)

## Preflight request

The browser asks server capability before sending actual request.

```http
OPTIONS /api/resource HTTP/1.1
Origin: http://localhost:5173
Access-Control-Request-Method: PUT
Access-Control-Request-Headers: Authorization, Content-Type
```

No request body is sent. It is capability negotiation.

## Expected server preflight response

```http
HTTP/1.1 204 No Content
Access-Control-Allow-Origin: http://localhost:5173
Access-Control-Allow-Methods: GET, POST, PUT, DELETE
Access-Control-Allow-Headers: Authorization, Content-Type
Access-Control-Max-Age: 86400
```

Meaning:

- origin is allowed
- method is allowed
- headers are allowed
- decision can be cached for max-age duration

## What browser does next

- If preflight passes: browser sends original request
- If preflight fails: browser blocks original request

## Why Access-Control-Max-Age helps

Without it, browser sends preflight too often.

With max-age, browser can cache the CORS permission decision and reduce overhead.

## Typical backend mistake patterns

- forgetting `Access-Control-Allow-Headers` for Authorization
- allowing origin but not method
- handling API route but not OPTIONS route

## Final takeaway

OPTIONS preflight is a negotiation step. If your API supports cross-origin mutation or custom headers, design and test this flow intentionally.

In Part 6, we move to HTTP status codes and practical error signaling.
