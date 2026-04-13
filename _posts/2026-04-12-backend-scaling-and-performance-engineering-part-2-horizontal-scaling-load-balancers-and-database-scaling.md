---
type: post
title: "Backend Scaling and Performance Engineering Part 2: Horizontal Scaling, Load Balancers, and Database Scaling"
date: 2026-04-12 10:00:00 +0300
categories:
  - backend
  - performance
---

[Part 1]({{ '/backend-scaling-and-performance-engineering-part-1-mental-models/' | relative_url }}) established the mental models: latency, throughput, utilization, percentiles, and why you must measure before you optimize. This post gets into the mechanics of actually scaling a backend — horizontal scaling, the infrastructure that makes it work, and the more complex challenge of scaling your database.

## Horizontal Scaling Requires Statelessness

Horizontal scaling means running multiple instances of your server — different machines each running the same code — and distributing traffic across them. This is in contrast to vertical scaling, which means upgrading a single machine to have more CPU, memory, and I/O capacity.

The key difference: vertical scaling is an infrastructure change. You go to your cloud dashboard and provision a bigger machine. Horizontal scaling requires changes at the code and architecture level, because of one critical property: **statelessness**.

A server is stateless when it holds no data exclusive to itself. Any request can go to any instance and produce the same result. A server is stateful when it stores information in its own memory — session data, uploaded files, cached results — that other instances cannot access.

Statelessness is the property that makes horizontal scaling possible. Without it, you get failures like:

**Sessions:** A user authenticates and the session is stored in instance A's memory. The next request gets routed to instance B. Instance B has no record of the session, returns a `401`, and the user is told to log in again — despite just having done so.

**File uploads:** A user uploads a file; instance A stores it on its own disk. A subsequent request to retrieve that file hits instance C, which has no copy of it, and returns an error.

The fix in both cases follows the same rule: **externalize all state.** Nothing belongs on a specific instance.

- Session data → [Redis]({{ '/caching-the-secret-behind-it-all/' | relative_url }}) (shared, accessible by all instances)
- File uploads → object storage like S3 or Cloudflare R2 (centralized, accessible by all instances)
- Databases → a centralized database server, not SQLite stored on a local instance disk

Once state is externalized, you can add or remove server instances freely. The capacity of your application tier scales linearly with the number of instances. The behavior is identical regardless of which instance handles a request.

## Load Balancers

With multiple server instances running, something needs to decide which instance receives each incoming request. That is the job of the **load balancer**.

A load balancer sits between the internet and your server instances. All client requests go to the load balancer first. The load balancer applies an algorithm to select a server instance, forwards the request, receives the response, and returns it to the client — all within the same HTTP connection.

### Round Robin

The simplest algorithm. Requests are distributed in a rotating order: first request to instance A, second to B, third to C, fourth to A again, and so on.

Round robin works well when requests are roughly uniform in cost and all server instances have the same capacity. When those conditions hold, the distribution is even and predictable.

But consider two types of requests: a lightweight profile fetch that resolves in 200ms, and a heavy operation involving an external API call and a write to a large indexed table that takes 2 seconds. A round-robin load balancer has no awareness of request cost. It can end up routing a burst of expensive requests disproportionately to one instance, potentially overwhelming it, while other instances sit mostly idle.

### Weighted Round Robin

A variation on round robin for heterogeneous instance capacity. If instance A has 8GB RAM and 4 CPU cores, while instances B and C have 4GB RAM and 2 cores each, you configure A to receive twice the request share — sending two requests to A for every one sent to B or C. The rotation is proportional to capacity.

### Least Connections

A smarter algorithm that routes each incoming request to the instance currently holding the fewest active connections.

HTTP connections remain open while the server is processing — the client is waiting. A lightweight request might resolve in 200ms and close the connection quickly. An expensive request holds the connection open for 2 seconds. The least connections algorithm sees this: the instance serving the expensive request has one long-lived active connection, while others have zero. New requests go to the less-loaded instances rather than blindly following a rotation.

This naturally adapts to mixed workloads. Instances doing heavy work receive fewer new requests; idle instances absorb the incoming traffic.

A weighted variant applies the same logic with proportional capacity weights for heterogeneous instances.

### Other Algorithms

- **Least response time** — routes to the instance currently returning responses fastest, biasing traffic toward healthier, less-loaded servers
- **Resource-based** — routes based on current CPU and memory usage across instances, sending fewer requests to instances already under resource pressure

The algorithm choice depends on your workload characteristics. Round robin is a reasonable default for uniform traffic. Least connections is better for mixed or unpredictable request costs.

## Health Checks

What happens when an instance crashes?

Without any detection mechanism, a load balancer using round robin will keep routing requests to the dead instance. Those requests fail with `502` or `503` errors. Users get errors intermittently — every third or fourth request depending on instance count — with no obvious pattern.

Load balancers solve this with **health checks**. Alongside routing real user traffic, the load balancer continuously sends lightweight test requests (typically a simple GET to a `/health` endpoint) to every instance — for example, once per second. Each instance returns a `200` if it is alive and able to serve requests. You can read more about designing health check endpoints in the [error handling post]({{ '/error-handling-and-building-fault-tolerant-systems/' | relative_url }}). The health check endpoint does no heavy processing; it exists only to confirm the instance is responsive.

When an instance stops responding with a `200` — because it crashed, ran out of memory, or became unresponsive — the load balancer marks it as unhealthy and stops sending user traffic to it. Remaining healthy instances absorb the load.

The health check requests continue to the unhealthy instance. When it recovers and starts returning `200` again, the load balancer removes it from the unhealthy list and resumes routing traffic to it.

This is how load balancers provide fault tolerance without requiring manual intervention.

## Database Scaling

Scaling the application tier becomes straightforward once state is externalized — add more instances behind the load balancer and capacity increases linearly. But the database is the one component that remains stateful by nature. You cannot duplicate it the way you duplicate stateless server instances.

Databases hold persistent data. If you add a second database instance, that data must be consistent across both. A read from instance A and a read from instance B for the same record must return the same result. Coordinating that consistency is what makes database scaling genuinely hard.

### Read Replicas

The most widely applicable solution for scaling database load is **read replicas**.

The architecture works like this: you have one **primary** (also called master or parent) database instance that handles all write operations — inserts, updates, deletes. You then create one or more **replica** (secondary or slave) instances that receive a continuous stream of changes from the primary and maintain an identical copy of the data. Replicas handle only read operations — SELECT queries.

The rules are simple:
- All writes go to the primary
- All reads can go to any replica (or the primary, if needed)

Two immediate benefits:

**Reduced primary load:** In most SaaS applications, 70–90% of database operations are reads. Offloading reads to replicas means the primary only handles writes and a fraction of the total query volume, dramatically reducing its resource consumption.

**Lower latency through geographic distribution:** Replicas can be deployed in different regions close to your users. If your primary database is in the US but you have significant user traffic in India and Japan, deploying replicas in those regions means local backend instances query a nearby replica instead of making a cross-continental database call. The round-trip time drops from hundreds of milliseconds to single digits.

Read replicas are the first tool to reach for when your [database]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }}) becomes a bottleneck and your traffic is predominantly read-heavy — which describes the majority of web applications.

**The scaling picture so far:**

1. Externalize all state (sessions to Redis, files to S3, databases centralized)
2. Run multiple stateless application instances behind a load balancer
3. Choose a load balancing algorithm appropriate for your traffic profile
4. Use health checks for automatic fault tolerance
5. Offload read traffic from the primary database to read replicas

Each layer addresses a distinct limit. Statelessness unlocks horizontal scaling of the application tier. Load balancers distribute traffic and absorb instance failures. Read replicas address the most common database bottleneck.

Happy hacking!
