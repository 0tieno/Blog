---
type: post
title: "HTTP for Backend Engineers (Part 8): Content Negotiation and Compression"
date: 2026-01-24 09:00:00 +0300
categories:
  - backend
  - http
---

Content negotiation lets client and server agree on the best representation for data exchange.

### Common negotiation dimensions

- Media type (JSON, XML, HTML)
- Language (English, Spanish, etc.)
- Encoding/compression (gzip, br, deflate)

### Request-side preference headers

- Accept
- Accept-Language
- Accept-Encoding

Example:

```http
GET /api/content HTTP/1.1
Accept: application/json
Accept-Language: es
Accept-Encoding: gzip, br
```

Server may respond in Spanish JSON and compressed form, depending on capabilities.

### Why this matters

Same endpoint can adapt representation to client capabilities without changing core business logic.

### Compression focus

For large payloads, compression dramatically reduces transfer size.

Example response:

```http
HTTP/1.1 200 OK
Content-Type: application/json
Content-Encoding: gzip
```

The browser/client decompresses automatically and receives original content.

This reduces:

- network transfer time
- bandwidth usage
- user-perceived latency

### Design considerations

- Enable compression for large text-based responses (JSON, HTML, CSS, JS)
- Avoid compressing already compressed binaries unless necessary
- Validate compression behavior in production with realistic payload sizes

### TLDR

Negotiation and compression are protocol-native optimizations. They are simple in concept but high impact in performance and user experience.

In [Part 9]({{ '/http-for-backend-engineers-part-9-connections-keep-alive/' | relative_url }}), we cover connection persistence and keep-alive behavior.

Happy hacking!
