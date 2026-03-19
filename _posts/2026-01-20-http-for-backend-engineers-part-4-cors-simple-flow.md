---
type: post
title: "HTTP for Backend Engineers (Part 4): CORS and Simple Flow"
date: 2026-01-20 09:00:00 +0300
categories:
  - backend
  - http
  - cors
---

CORS (Cross-Origin Resource Sharing) is a browser-enforced security mechanism.

It exists because browsers apply the Same-Origin Policy by default.

## Same-Origin Policy in one line

A page from one origin cannot freely read responses from a different origin unless the server explicitly allows it.

Origin is based on:

- scheme
- host
- port

If any part differs, it is cross-origin.

## Simple CORS request flow

Assume:

- frontend: http://localhost:5173
- API: http://localhost:3000

This is cross-origin because ports differ.

### Step 1: browser sends request

The browser adds an `Origin` header automatically.

Example:

```http
GET /api/resource HTTP/1.1
Host: localhost:3000
Origin: http://localhost:5173
```

### Step 2: server responds with CORS permission

If server allows this origin, it returns:

```http
Access-Control-Allow-Origin: http://localhost:5173
```

(or `*` depending on policy)

### Step 3: browser decides

- If CORS header is valid: browser exposes response to frontend code
- If missing/invalid: browser blocks access and reports CORS error

Important: server may still produce a response, but browser enforces whether frontend JavaScript can read it.

## Why this matters in backend APIs

Backend CORS config determines whether web clients can consume your API from other origins.

Misconfiguration causes:

- blocked browser requests
- hard-to-debug frontend errors
- accidental overexposure if using wildcards carelessly

## Practical checklist

- Set explicit allowed origins for production
- Allow only required methods and headers
- Test in browser devtools (network + console)

## Final takeaway

CORS is not an HTTP server feature alone and not a frontend feature alone. It is a browser policy that relies on server headers.

In Part 5, we cover preflight flow and the OPTIONS method in depth.
