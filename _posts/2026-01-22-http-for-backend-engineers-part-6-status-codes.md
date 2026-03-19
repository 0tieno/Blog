---
type: post
title: "HTTP for Backend Engineers (Part 6): Status Codes That Matter"
date: 2026-01-22 09:00:00 +0300
categories:
  - backend
  - http
---

HTTP status codes are a universal contract for request outcomes.

They let clients understand result state without reverse-engineering response body shape.

## Status code families

- 1xx: informational
- 2xx: success
- 3xx: redirection
- 4xx: client errors
- 5xx: server errors

## Most useful codes in real backend work

### 2xx success

- 200 OK: successful request
- 201 Created: new resource created
- 204 No Content: success, no body (common for delete/preflight)

### 3xx redirection

- 301 Moved Permanently
- 302 Found (temporary redirect)
- 304 Not Modified (important in caching)

### 4xx client errors

- 400 Bad Request: malformed or invalid request data
- 401 Unauthorized: missing/invalid authentication
- 403 Forbidden: authenticated but not allowed
- 404 Not Found: resource/route does not exist
- 405 Method Not Allowed: method unsupported on route
- 409 Conflict: request conflicts with current state
- 429 Too Many Requests: rate limit exceeded

### 5xx server errors

- 500 Internal Server Error: unexpected backend failure
- 501 Not Implemented: capability not implemented
- 502 Bad Gateway: invalid upstream response via gateway/proxy
- 503 Service Unavailable: overloaded/maintenance
- 504 Gateway Timeout: upstream did not respond in time

## Practical API behavior examples

- Duplicate unique name creation -> 409
- Expired token -> 401
- Authenticated user accessing another user's protected resource -> 403
- Wrong HTTP method on endpoint -> 405

## Design guideline

Keep status code semantics consistent across endpoints.

Clients become simpler when response meaning is predictable.

## Final takeaway

The best APIs are explicit. Correct status codes reduce ambiguity, speed debugging, and improve client resilience.

In Part 7, we tackle HTTP caching with ETag, Last-Modified, and 304 responses.
