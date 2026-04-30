---
type: post
title: "Load Balancing, Health Checks, and Eliminating Single Points of Failure"
date: 2026-04-22 10:00:00 +0300
categories:
  - backend
  - system design
  - interviews
---

Once you move to horizontal scaling, you need something to sit between your users and your servers to distribute traffic intelligently. That something is a load balancer. But choosing the right distribution algorithm, handling server failures, and avoiding single points of failure are where the real engineering decisions live.

## How Load Balancers Work

A load balancer is a reverse proxy that accepts incoming client requests and forwards them to one of several backend servers. The client never knows which server handled their request.

```
Clients (web, mobile)
        |
        v
   Load Balancer
     /    |    \
    v     v     v
  Srv1  Srv2  Srv3
```

Without a load balancer, you would need to give clients the IP addresses of individual servers. If one server dies, clients connecting to that IP get errors. The load balancer abstracts this away.

## Seven Load Balancing Algorithms

Each algorithm makes different tradeoffs between simplicity, fairness, and intelligence.

### 1. Round Robin

Requests go to servers in sequential order: Server 1, then Server 2, then Server 3, then back to Server 1.

```
Request 1 → Server 1
Request 2 → Server 2
Request 3 → Server 3
Request 4 → Server 1  (cycle restarts)
Request 5 → Server 2
```

**When to use it:** All servers have identical specs, and request processing times are roughly uniform.

**When it fails:** If Server 3 is handling a long-running request while Servers 1 and 2 are idle, Round Robin still sends the next request to Server 1 instead of recognizing that Server 3 is overloaded. It is blind to actual server load.

### 2. Least Connections

Routes each new request to the server with the fewest active connections.

```
Server 1: 10 active connections
Server 2: 9 active connections   ← next request goes here
Server 3: 30 active connections
```

**When to use it:** Requests have variable processing times. Some requests take milliseconds (fetching a cached product), others take seconds (generating a report). Least connections naturally balances uneven workloads.

**The tradeoff:** Requires the load balancer to track connection counts in real time, which adds slight overhead compared to Round Robin.

### 3. Least Response Time

Combines connection count with actual response latency. Sends traffic to the server that is both least busy and fastest.

**When to use it:** Servers have different hardware specs or network conditions. A server on faster hardware or closer to the database will naturally respond faster.

**Interview angle:** If an interviewer asks "your servers have different specs, how do you distribute traffic?" this is the algorithm to mention. It adapts to heterogeneous infrastructure.

### 4. IP Hash

Hashes the client's IP address to determine which server handles the request. The same client always goes to the same server.

```
Client IP: 192.168.1.50  → hash → Server 2
Client IP: 192.168.1.51  → hash → Server 1

Future requests from 192.168.1.50 → always Server 2
```

**When to use it:** Session affinity matters. If each server maintains local state (in-memory session data, local caches), you want the same client to hit the same server consistently.

**The problem:** If a server goes down, all clients hashed to that server need to be rehashed, which disrupts their sessions. This is where consistent hashing (algorithm 7) improves things.

### 5. Weighted Variants

Any of the above algorithms can be weighted. Servers with more capacity get proportionally more traffic.

```
Server 1: 16 GB RAM, weight = 1  → gets ~16% of traffic
Server 2: 32 GB RAM, weight = 2  → gets ~33% of traffic
Server 3: 64 GB RAM, weight = 4  → gets ~51% of traffic
```

**When to use it:** Mixed fleet of servers, which is common during hardware upgrades or when running different instance types in the cloud.

### 6. Geographic (Location-Based)

Routes requests to the server geographically closest to the client, based on the client's IP address.

```
User in Berlin  → Server in EU-West
User in New York → Server in US-East
User in LA      → Server in US-West
```

**When to use it:** Global services where latency matters. A user in Tokyo should not be routed to a server in Virginia if there is a server in Tokyo. Every millisecond of network round-trip time hurts user experience.

**Real-world example:** CDNs like Cloudflare and AWS CloudFront use geographic routing to serve cached content from the nearest edge location.

### 7. Consistent Hashing

Maps both servers and clients onto a virtual ring using a hash function. Each client is assigned to the nearest server clockwise on the ring.

```
      Server A
       /
Ring: ....X.........
      \          /
    Server C  Server B

Client X maps to a point on the ring.
Nearest server clockwise = Server B → route there.
```

**Why it matters:** When a server is added or removed, only the clients mapped near that server on the ring need to be reassigned. In standard IP hashing, removing one server reshuffles all assignments. Consistent hashing minimizes disruption.

**Where you see it in practice:** DynamoDB's partitioning, Cassandra's data distribution, and many distributed caches use consistent hashing internally.

## Health Checks: How the Load Balancer Knows a Server Is Down

Load balancers continuously send small probe requests (health checks) to each backend server. A typical health check hits a `/health` endpoint every 10 to 30 seconds.

```
Load Balancer sends:  GET /health → Server 1  ✅ 200 OK
Load Balancer sends:  GET /health → Server 2  ✅ 200 OK
Load Balancer sends:  GET /health → Server 3  ❌ Timeout
Load Balancer sends:  GET /health → Server 4  ❌ 503
```

If a server fails the health check (timeout, error response, or connection refused), the load balancer removes it from the rotation. No new traffic goes to that server. Once the server starts passing health checks again, it is gradually reintroduced.

**Design consideration:** Your `/health` endpoint should not just return 200 blindly. A good health check verifies that the server can actually do its job: it can reach the database, it can read from cache, its disk is not full. A server that returns 200 but cannot connect to the database is functionally dead.

```python
# Bad health check
@app.get("/health")
def health():
    return {"status": "ok"}  # Always returns ok, even if DB is down

# Good health check
@app.get("/health")
def health():
    try:
        db.execute("SELECT 1")
        cache.ping()
        return {"status": "ok"}
    except Exception:
        return {"status": "degraded"}, 503
```

## Single Points of Failure (SPOF)

A single point of failure is any component whose failure brings down the entire system. Identifying and eliminating SPOFs is one of the most important skills in system design.

**Common SPOFs:**

| Component | Why It's a SPOF | How to Fix It |
| --- | --- | --- |
| Single database server | All API servers depend on it. If it crashes, every API returns errors. | Primary-replica setup. Promote replica if primary fails. |
| Single load balancer | If the load balancer dies, no traffic reaches any server. | Active-passive or active-active load balancer pair. |
| Single DNS provider | If DNS goes down, users cannot resolve your domain. | Use multiple DNS providers (Route 53 + Cloudflare). |
| Single region deployment | If that cloud region has an outage, your service is fully offline. | Multi-region deployment with geographic routing. |

### Fixing the Load Balancer SPOF

Having one load balancer defeats the purpose of horizontal scaling. Three strategies to eliminate this:

**Redundancy:** Run two or more load balancers. If one fails, traffic reroutes to the other. This can use a floating IP (Virtual IP) that moves to the healthy instance, or DNS-level failover.

**Health monitoring for load balancers themselves:** The same concept applies upward. Something needs to monitor the load balancer and trigger failover. Tools like Keepalived or cloud-native solutions (AWS NLB) handle this automatically.

**Self-healing:** If a load balancer instance fails, automatically provision a replacement. Cloud environments make this straightforward with auto-scaling groups that maintain a minimum instance count.

## Real-World Load Balancer Options

**Software load balancers:** NGINX (most common, also serves as a web server and reverse proxy), HAProxy (purpose-built for load balancing, extremely performant, used by GitHub and Stack Overflow).

**Cloud-managed load balancers:** AWS Elastic Load Balancer (ALB for HTTP, NLB for TCP), Google Cloud Load Balancing, Azure Load Balancer. These come with built-in health checks, auto-scaling integration, SSL termination, and geographic routing out of the box.

**Hardware load balancers:** F5, Citrix. Expensive, high-performance. Common in enterprise and financial environments where every microsecond matters.

## Interview Framework: Talking About Load Balancing

When an interviewer asks about load balancing, structure your answer around three decisions:

**1. Algorithm choice:** "For this system, I would use [algorithm] because [reason tied to the system's requirements]."

**2. Health check strategy:** "The load balancer will run health checks every N seconds. The health endpoint will verify database connectivity and cache availability."

**3. SPOF elimination:** "I will run at least two load balancer instances in an active-passive configuration to avoid the load balancer itself becoming a single point of failure."

**Example answer for a chat application:**

"I would use Least Connections because chat sessions have variable durations. Some users stay connected for hours, others for minutes. Round Robin would not account for that. I would configure health checks to verify both the WebSocket server and Redis pub/sub connectivity. And I would run two load balancer instances behind a floating IP for redundancy."

This demonstrates understanding of the algorithm tradeoffs, health check depth, and SPOF awareness.

## Related Post

- [System Foundations: From One Server to Millions of Users](/Blog/system-foundations/) — Understand why horizontal scaling requires a load balancer in the first place.

Happy hacking!