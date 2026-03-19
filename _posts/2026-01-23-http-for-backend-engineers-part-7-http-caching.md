---
type: post
title: "HTTP for Backend Engineers (Part 7): HTTP Caching from First Principles"
date: 2026-01-23 09:00:00 +0300
categories:
  - backend
  - http
  - caching
---

HTTP caching stores response copies so clients can reuse them instead of downloading the same payload repeatedly.

Benefits:

- lower latency
- reduced bandwidth
- less server load

## Key headers in conditional caching

- Cache-Control: freshness policy
- ETag: version identifier for representation
- Last-Modified: timestamp hint

## Initial response pattern

```http
HTTP/1.1 200 OK
Cache-Control: max-age=10
ETag: "abc123"
Last-Modified: Wed, 19 Mar 2026 10:00:00 GMT
Content-Type: application/json
```

Client stores this response and metadata.

## Next request: conditional GET

Client can ask server if its cached version is still valid:

```http
GET /api/resource HTTP/1.1
If-None-Match: "abc123"
If-Modified-Since: Wed, 19 Mar 2026 10:00:00 GMT
```

## Server outcomes

### Resource unchanged

```http
HTTP/1.1 304 Not Modified
```

No body needed. Client reuses cached payload.

### Resource changed

```http
HTTP/1.1 200 OK
ETag: "def456"
Last-Modified: Wed, 19 Mar 2026 10:05:00 GMT
```

Client receives fresh body and updates cache metadata.

## ETag and Last-Modified together

- ETag can be precise representation versioning
- Last-Modified is useful but time-based and coarser
- Together they support robust conditional requests

## Real-world caveat

Manual cache validation logic can become complex in large systems.

Modern client libraries often provide richer app-level caching controls, but HTTP caching remains a foundational mechanism that every backend engineer should understand.

## Final takeaway

`304 Not Modified` is one of the highest-impact performance responses in HTTP when used correctly.

In Part 8, we move to content negotiation and response compression.
