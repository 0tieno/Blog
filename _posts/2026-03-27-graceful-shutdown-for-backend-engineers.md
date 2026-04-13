---
type: post
title: "Graceful Shutdown for Backend Engineers"
date: 2026-03-27 10:00:00 +0300
categories:
  - backend
---

Picture this: a user is halfway through a payment. Your server needs to restart for a deployment. What happens to the transaction? Does it vanish? Does the customer get charged twice?

This is not an edge case. It is a routine operational reality. Deployments happen, processes restart, and at any given moment your server is probably handling dozens or hundreds of [in-flight requests]({{ '/concurrency-and-parallelism-for-backend-engineers-io-bound-vs-cpu-bound/' | relative_url }}). The mechanism that handles this correctly is called **graceful shutdown** — and it is exactly what it sounds like: teaching your server to stop politely instead of slamming the door.

## Process Lifecycle Management

Your backend runs as a **process** inside an operating system. Like all things, processes have a lifecycle: they start, they run, they stop. How they stop is what we care about here.

When an OS needs to tell a process to stop — for a deployment, a restart, a scale-down — it does not simply pull the plug. It follows an established communication protocol. That protocol is built on **signals**, a Unix/Linux concept for inter-process communication.

There are three signals you need to know.

## SIGTERM

`SIGTERM` is a polite request to stop. Think of it as a tap on the shoulder: *"Hey, could you wrap up and leave?"*

When your process receives SIGTERM, it is given an opportunity to:
1. Finish processing whatever it is currently doing
2. Clean up its resources
3. Exit on its own terms

This signal is sent by deployment systems, process managers, and orchestration platforms — Kubernetes, systemd, PM2. Any automated system that manages your process lifecycle will use SIGTERM as its first ask.

## SIGINT

`SIGINT` is an interrupt signal — the one triggered when a developer presses **Ctrl+C** in a terminal. It is user-initiated rather than system-initiated, but the intent is the same: stop the process.

In practice, you should handle SIGINT exactly the same way you handle SIGTERM. Whether a human is pressing Ctrl+C in a development environment or a production orchestrator is sending SIGTERM, the desired outcome is identical — a clean, graceful exit.

## SIGKILL

`SIGKILL` is the nuclear option. It cannot be caught, and it cannot be ignored. There is no handler you can register, no cleanup you can run. The moment SIGKILL is sent, the process is terminated immediately by the OS. No questions asked.

This is equivalent to pulling the power plug on a running machine.

SIGKILL is what happens when a process ignores or fails to respond to SIGTERM within an acceptable time window. The deployment system waits, gives up, and kills the process forcefully.

This is why graceful shutdown matters: if you do not respect the polite signals, you will eventually receive the impolite one — and then you have no opportunity to clean up anything.

## What Graceful Shutdown Actually Does

When a server receives SIGTERM or SIGINT, two things must happen: **connection draining** and **resource cleanup**.

### 1. Connection Draining

Your server is concurrently processing multiple requests at the moment a shutdown signal arrives. Connection draining is the process of handling those in-flight requests correctly.

The restaurant analogy is apt: when a restaurant closes for the night, staff do not throw out customers mid-meal. First, they stop seating new customers. Then they let everyone currently eating finish, pay, and leave. Only then do they close up.

Your backend follows the same three steps:

1. **Stop accepting new connections.** The server closes its listener — no new HTTP requests, no new clients. This prevents the in-flight count from growing while you are trying to drain it.
2. **Allow in-flight requests to complete.** Requests already being processed are given time to finish normally and return their responses.
3. **Close the connection.**

The same principle applies beyond HTTP:
- **Database applications** — finish all active queries and transactions before closing
- **WebSocket servers** — notify connected clients before closing sockets
- **Message queue consumers** — finish processing the current message before unsubscribing

### The Timeout Problem

Connection draining introduces a design question: how long do you wait?

If you wait too long, your shutdown and deployment process becomes sluggish. If you wait too short, you risk interrupting legitimate operations mid-execution.

Most production systems use a **30-second timeout** as a sensible default. The logic: if you have stopped accepting new connections, 30 seconds should be more than sufficient for in-flight requests to complete. If something is still running after 30 seconds, it is either a bug, a runaway transaction, or an operation that should have had its own timeout mechanism. At that point, a forceful stop is acceptable.

Choose your timeout based on your application's actual request profile. A standard REST API handling sub-second requests can use a shorter window. A system processing long-running WebSocket connections or batch jobs needs a longer one.

### 2. Resource Cleanup

During its lifetime, your backend acquires resources from the OS: file handles, network connections, database connections, temporary files, in-memory caches. On shutdown, these must be released explicitly — the OS does not always reclaim them immediately, and leaving them open can cause memory leaks, connection pool exhaustion, or inconsistent state.

The most important resources to clean up:

**Database connections:** Open transactions that are not explicitly committed or rolled back can result in locks that block other processes, data corruption, or deadlocks. Before shutting down, your backend must ensure all active transactions are either committed or rolled back, and then close its [connection pool]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }}).

**Network connections:** Each open connection consumes OS resources. Connections left open after a process exits can exhaust the OS's file descriptor limit for the next process.

**File handles:** Any files opened for reading or writing must be closed. Unclosed file handles consume memory and can prevent other processes from accessing the same file.

**One ordering rule:** Clean up resources in the **reverse order** of acquisition. If your backend started a Redis connection, then a database connection, then opened a file handle — release the file handle first, then the database connection, then Redis. This prevents situations where you release a dependency before the things that depend on it have finished with it.

## Putting It Together

The graceful shutdown sequence for a typical HTTP backend:

1. Register signal handlers for SIGTERM and SIGINT at startup
2. On signal receipt:
   - Stop the HTTP server's listener (no new connections)
   - Wait for in-flight requests to complete (up to the configured timeout)
   - Close the database connection pool (committing or rolling back pending transactions)
   - Close any other external connections ([Redis]({{ '/caching-the-secret-behind-it-all/' | relative_url }}), message queues, etc.) in reverse acquisition order
   - Exit cleanly

The HTTP framework you use almost certainly provides a `shutdown` or `close` method that handles step 2 internally — stopping new connections and waiting for existing ones to drain. The resource cleanup steps after it are your responsibility to sequence correctly.

Graceful shutdown is one of those topics that seems optional until it causes a corrupted transaction or a double charge in production. Getting it right is straightforward once you understand the underlying mechanism — and the cost of not doing it is real.

Happy hacking!
