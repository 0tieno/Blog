---
type: post
title: "HTTP for Backend Engineers (Part 9): Persistent Connections and Keep-Alive"
date: 2026-01-25 09:00:00 +0300
categories:
  - backend
  - http
---

In early HTTP/1.0 behavior, each request typically opened and closed a connection. That was expensive.

HTTP/1.1 improved this with persistent connections.

## Persistent connection idea

Reuse one TCP connection for multiple request/response exchanges.

Benefits:

- lower latency
- less connection setup/teardown overhead
- better throughput

## Keep-Alive behavior

In HTTP/1.1, persistence is the default behavior.

Still, you will see `Connection: keep-alive` and related tuning fields in some environments.

Possible control intent:

- timeout: how long connection stays open
- max: max requests before close

If `Connection: close` is used, the connection is terminated after response.

## Why backend engineers should care

You may not manually control this often, but it impacts:

- load balancer behavior
- gateway/proxy configuration
- streaming APIs
- latency and resource usage under load

## Practical advice

- Understand defaults of your server, framework, and reverse proxy
- Tune only after measuring real traffic behavior
- Treat keep-alive settings as performance and capacity levers

## Final takeaway

Connection management is mostly invisible when things work and very visible when they do not. Knowing these fundamentals helps debug odd latency and resource issues.

In Part 10, we close with large request/response handling and TLS/HTTPS overview.
