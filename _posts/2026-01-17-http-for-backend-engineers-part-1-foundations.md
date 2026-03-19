---
type: post
title: "HTTP for Backend Engineers (Part 1): Foundations"
date: 2026-01-17 09:00:00 +0300
categories:
  - backend
  - http
---

Backend is huge, so this series focuses on the HTTP ideas used in most real-world codebases.

HTTP is a protocol that allows clients (browsers/apps) and servers to communicate. Two core ideas are at the center of HTTP:

1. Statelessness
2. Client-server model

## 1) Statelessness

HTTP is stateless, which means the server does not remember past requests.

Each request must contain everything needed to process it:

- URL
- method
- headers
- authentication data (cookies/tokens) when needed

After sending a response, the server forgets that interaction.

### Why this is useful

- Simplicity: no session memory required on every server by default
- Scalability: requests can be routed to any server
- Resilience: a server crash does not lose in-memory interaction state

Because HTTP is stateless, applications add state mechanisms when needed:

- cookies
- sessions
- tokens

These are necessary for things like login continuity and shopping carts.

## 2) Client-server model

HTTP communication is initiated by the client.

- Client: browser/mobile app/another service that sends request
- Server: hosts resources (web pages, APIs, files), processes requests, returns responses

The response could be HTML, JSON, text, images, or an error.

## HTTP vs HTTPS

For backend application design, treat HTTPS as HTTP with transport security added.

- HTTP: protocol semantics (methods, headers, status codes, etc.)
- HTTPS: HTTP + TLS encryption and certificate-based trust

The request/response model remains the same.

## Transport and network layers (quick context)

HTTP needs a reliable transport underneath.

Historically and commonly, HTTP runs over TCP. TCP reliability is why it became the standard choice for HTTP traffic.

You may hear about OSI layers and handshake/encryption details. Useful to know, but as backend engineers we mostly work at the application layer where HTTP semantics live.

## HTTP versions in one view

### HTTP/1.0

- New connection per request
- High overhead and slower performance

### HTTP/1.1

- Persistent connections
- Better performance
- Improved caching and transfer options

### HTTP/2

- Multiplexing (multiple streams over one connection)
- Binary framing
- Header compression
- Server push support

### HTTP/3

- Runs over QUIC/UDP
- Faster connection setup
- Better packet loss handling
- Improved multiplexing behavior

## Final takeaway

For practical backend work, keep this mental model:

- Client opens communication
- Request/response over network transport
- HTTP defines the application-level rules
- Stateless by default, state added intentionally when needed

In Part 2, we will break down HTTP message structure and headers deeply.
