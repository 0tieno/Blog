---
type: post
title: "System Design Interview Questions and Answers"
date: 2026-04-26 10:00:00 +0300
categories:
  - backend
  - system design
  - interviews
---

These questions reflect real system design rounds at companies like Google, Meta, Amazon, Microsoft, Stripe, and Uber. Each answer follows the structure interviewers expect: clarify requirements, outline the high-level design, then drill into components with tradeoff analysis.

## How to Structure Every Answer

Before jumping into specific questions, internalize this framework. Use it for every system design question regardless of topic.

**Step 1: Clarify Requirements (2 to 3 minutes)**
Ask about scale (how many users, how many requests per second), core features vs nice-to-haves, consistency vs availability preferences, and read-heavy vs write-heavy patterns.

**Step 2: High-Level Design (5 to 8 minutes)**
Draw the major components: clients, load balancer, application servers, database, cache, message queue. Show how data flows through the system.

**Step 3: Deep Dive (15 to 20 minutes)**
Pick 2 to 3 components and go deep. This is where you discuss database schema, API design, caching strategy, scaling approach, and tradeoffs.

**Step 4: Address Bottlenecks (5 minutes)**
Identify single points of failure, discuss monitoring, and explain how the system handles failure gracefully.


## Question 1: Design a URL Shortener (Stripe, Google, Amazon)

**Interviewer:** Design a system like bit.ly that takes long URLs and produces short URLs.

### Requirements Clarification

"Before I start, let me confirm a few things. Are we designing the full system or just the API? What is the expected scale, say 100 million URLs created per month? Should short URLs be custom or auto-generated? Do we need analytics like click counts? What is the expected read-to-write ratio?"

Typical assumptions: 100M new URLs per month, 10:1 read-to-write ratio (1 billion redirects per month), URLs expire after a configurable period, analytics are a nice-to-have.

### High-Level Design

```
Client
  |
  v
Load Balancer
  |
  v
API Servers (stateless)
  |
  +---> Write Path: Generate short code, store mapping in DB
  |
  +---> Read Path: Look up short code, return 301 redirect
  |
  v
Database (short_code → original_url)
  |
Cache (Redis: hot short codes)
```

### API Design

```
POST /api/v1/urls
  Request:  { "originalUrl": "https://example.com/very/long/path", "expiresIn": "30d" }
  Response: { "shortCode": "a1B2c3", "shortUrl": "https://short.ly/a1B2c3" }
  Status:   201 Created

GET /{shortCode}
  Response: 301 Redirect to original URL
  (Not a JSON API, it is a browser redirect)

GET /api/v1/urls/{shortCode}/stats
  Response: { "clicks": 14200, "createdAt": "...", "expiresAt": "..." }
  Status:   200 OK
```

### Short Code Generation

This is the core algorithmic decision. Three approaches:

**Approach A: Base62 encoding of an auto-increment ID.**
Database assigns ID 1000000. Convert to base62: `1000000 → 4C92`. Simple, no collisions, but sequential IDs are predictable (someone could enumerate all URLs).

**Approach B: MD5/SHA256 hash of the original URL, take the first 7 characters.**
Deterministic (same URL always produces the same short code). Risk of hash collisions, which you handle by checking the database and appending characters if needed.

**Approach C: Pre-generate random codes and store them in a pool.**
A background service generates millions of random 7-character codes and stores them. When a new URL is created, pop one from the pool. No collision risk, no computation at write time. The tradeoff is managing the pool.

"I would go with Approach C for production because it decouples code generation from the write path, eliminates collision handling at request time, and scales cleanly. For a simpler system, Approach A with base62 encoding works well."

### Database Choice

"I would use PostgreSQL for the URL mapping table. The schema is simple, the data is structured, and we need strong consistency (a short code must always resolve to the correct URL). For 100M URLs per month, a single PostgreSQL instance with proper indexing handles this comfortably. At larger scale, I would shard by the first character of the short code."

### Caching Strategy

"The read-to-write ratio is 10:1, so caching makes a big difference. I would put Redis in front of the database. On every redirect, check Redis first. Cache miss goes to the database, then populates the cache. Most popular URLs (think viral tweets) will be served entirely from cache."

### Tradeoffs Discussed

- Base62 vs hashing vs pre-generated pool for code generation
- 301 (permanent redirect, browser caches it) vs 302 (temporary redirect, browser always hits your server) — 301 is faster for users but you lose analytics visibility. 302 lets you track every click.
- SQL vs NoSQL: SQL wins here because the data model is simple and predictable, and we need strong consistency


## Question 2: Design a Rate Limiter (Stripe, Cloudflare, Amazon)

**Interviewer:** Design a rate limiting system that can handle millions of API requests.

### Requirements Clarification

"Should the rate limiter work per user, per IP, or per API key? What are the limits, for example 100 requests per minute? Should it be a standalone service or middleware? Do we need different limits for different endpoints? How should we handle distributed deployments with multiple API servers?"

### High-Level Design

```
Client Request
     |
     v
API Gateway / Load Balancer
     |
     v
Rate Limiter Middleware
     |
     +---> Redis (counter storage)
     |
     v
Rate limit check passed?
     |
  Yes → Forward to API Server
  No  → Return 429 Too Many Requests
```

### Algorithm Deep Dive: Token Bucket

"I would use the token bucket algorithm. Each user gets a bucket with a maximum capacity of N tokens. Tokens refill at a fixed rate. Each request consumes one token. If the bucket is empty, the request is rejected."

```
Example: 100 requests per minute

Bucket capacity: 100 tokens
Refill rate: 100 tokens per 60 seconds (roughly 1.67 tokens per second)

Request arrives:
  - Bucket has tokens? → Consume 1 token, allow request
  - Bucket empty? → Reject with 429, include Retry-After header

This allows bursts (a user can send 100 requests instantly if the bucket is full)
while enforcing the average rate over time.
```

**Why token bucket over other algorithms:**

| Algorithm | Pros | Cons |
| --- | --- | --- |
| Token Bucket | Allows bursts, smooth rate limiting, memory efficient | Slightly complex implementation |
| Fixed Window | Simplest to implement | Boundary problem: user sends 100 at :59, another 100 at :01, getting 200 in 2 seconds |
| Sliding Window Log | Most accurate | High memory usage (stores every request timestamp) |
| Sliding Window Counter | Good accuracy, low memory | Approximate, not exact |

### Redis Implementation

```
Key: rate_limit:{user_id}
Value: { tokens: 85, last_refill: 1713450000 }

On each request:
  1. Get the key from Redis
  2. Calculate tokens to add based on time elapsed since last_refill
  3. If tokens > 0: decrement, allow request
  4. If tokens = 0: reject with 429
  5. Update the key with new token count and timestamp

Use Redis MULTI/EXEC for atomic operations to prevent race conditions.
```

### Distributed Rate Limiting

"With multiple API servers, each server cannot track limits independently (a user could send 100 requests to each of 5 servers, getting 500 total). That is why the counter lives in Redis, which all servers share. Redis is fast enough (sub-millisecond operations) that the added latency is negligible."

### Response Headers

```
HTTP/1.1 429 Too Many Requests
Retry-After: 30
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1713450060
```

"Always include these headers so clients can self-throttle instead of hitting the limit blindly."


## Question 3: Design a Chat System (Meta, WhatsApp, Slack)

**Interviewer:** Design a real-time chat system like WhatsApp or Slack.

### Requirements Clarification

"Is this one-on-one chat, group chat, or both? What is the expected number of concurrent users? Do we need message persistence (history)? Do we need read receipts and online status? What about media (images, files)? Is end-to-end encryption in scope?"

Assumptions: Both 1:1 and group chat, 10M concurrent users, message persistence, read receipts, text messages only for now.

### Why WebSockets Over HTTP Polling

"HTTP polling (checking for new messages every few seconds) wastes bandwidth and adds latency. A message sent at :01 might not be seen until :05 if you poll every 5 seconds. WebSockets provide a persistent bidirectional connection. The server pushes new messages to the client instantly, and the client sends messages to the server over the same connection. This gives us real-time delivery with minimal overhead."

### High-Level Design

```
Client A (WebSocket connection)
     |
     v
WebSocket Gateway (maintains persistent connections)
     |
     v
Chat Service
     |
     +---> Message Queue (Kafka)
     |       |
     |       +---> Message Storage Service → Cassandra
     |       |
     |       +---> Notification Service → Push notifications
     |
     +---> Presence Service → Redis (online/offline status)
     |
     +---> User Service → PostgreSQL (user profiles)
```

### Message Flow

```
1. User A sends "Hello" to User B
2. Message hits WebSocket Gateway
3. Gateway forwards to Chat Service
4. Chat Service:
   a. Publishes message to Kafka (for durability and fan-out)
   b. Stores message in Cassandra (persistent history)
   c. Checks if User B is online (Presence Service / Redis)
5. If User B is online:
   - Route message through WebSocket Gateway to User B's connection
6. If User B is offline:
   - Queue a push notification
7. When User B comes online:
   - Fetch undelivered messages from Cassandra
```

### Database Choice

"I would use Cassandra for message storage. Chat messages are write-heavy (every message is a write), append-only (messages are not updated), and queried by conversation and time range. Cassandra excels at high write throughput and time-series-like queries. The partition key would be `conversation_id`, and the clustering key would be `message_timestamp` for ordered retrieval."

```
Table: messages
  conversation_id (partition key)
  message_timestamp (clustering key, descending)
  sender_id
  content
  status (sent, delivered, read)
```

"For user profiles and conversations metadata, I would use PostgreSQL since that data is relational, lower volume, and needs strong consistency."

### Scaling WebSocket Connections

"A single server can handle roughly 50,000 to 100,000 concurrent WebSocket connections. For 10M concurrent users, we need around 100 to 200 WebSocket gateway servers. The load balancer uses IP hash or consistent hashing to route each user to a consistent gateway server."

"The challenge: User A is connected to Gateway 1, User B is connected to Gateway 5. When A sends a message to B, Gateway 1 needs to find Gateway 5. This is solved with a connection registry in Redis that maps `user_id → gateway_server_id`. The Chat Service looks up B's gateway and routes the message there."

### Tradeoffs

- Cassandra vs PostgreSQL for messages: Cassandra wins on write throughput and horizontal scaling, but loses on complex queries (no joins, limited secondary indexes)
- Fan-out on write vs fan-out on read for group messages: For small groups (under 100 members), fan-out on write (push to each member's inbox) is fine. For large groups (thousands of members), fan-out on read (members pull from the group's message stream) is more efficient.


## Question 4: Design an API Gateway (Amazon, Netflix, Uber)

**Interviewer:** Design an API Gateway that sits in front of multiple microservices.

### What It Does

"An API Gateway is a single entry point for all client requests. Instead of clients calling 10 different microservices directly, they call one gateway that routes requests to the right service. It also handles cross-cutting concerns: authentication, rate limiting, request transformation, and monitoring."

### High-Level Design

```
Mobile/Web Clients
       |
       v
  API Gateway
       |
  +----+----+----+----+
  |    |    |    |    |
  v    v    v    v    v
Users Orders Products Search Payments
Service Service Service Service Service
```

### Core Responsibilities

**Request routing:** Client sends `GET /users/42`. The gateway knows that `/users/*` routes to the Users Service at `internal-users:8080`.

**Authentication:** The gateway validates the JWT token before forwarding the request. Individual services do not need to implement authentication logic. This centralizes auth and reduces duplication.

**Rate limiting:** Applied at the gateway level, before requests reach any service. One Redis-backed rate limiter protects all downstream services.

**Request/Response transformation:** The gateway can aggregate responses from multiple services into a single response. A mobile app requesting a user profile might need data from the Users Service, Orders Service, and Recommendations Service. The gateway calls all three, merges the results, and returns one payload.

**Load balancing:** The gateway distributes requests across multiple instances of each service.

**Circuit breaking:** If the Orders Service is down, the gateway can return a cached or degraded response instead of hanging or cascading the failure to the client.

### Database and State

"The gateway itself should be stateless. Configuration (routing rules, rate limit policies) is loaded from a config store or database at startup and refreshed periodically. Session state and rate limiting counters live in Redis."

### Tradeoffs

- Single gateway (simple but single point of failure) vs multiple gateways per client type (BFF pattern: one gateway for web, one for mobile, one for internal services)
- Thin gateway (just routing) vs fat gateway (aggregation, transformation, business logic). Fat gateways become bottlenecks and maintenance nightmares. Keep business logic in the services.


## Question 5: Design a Notification System (Google, Apple, Uber)

**Interviewer:** Design a system that sends push notifications, emails, and SMS to millions of users.

### High-Level Design

```
Event Source (order confirmed, friend request, etc.)
       |
       v
  Notification Service
       |
       v
  Message Queue (Kafka)
       |
  +----+----+----+
  |    |    |    |
  v    v    v    v
Push  Email SMS  In-App
Worker Worker Worker Worker
  |    |    |    |
  v    v    v    v
APNs  SES  Twilio WebSocket
```

### Why Message Queues Are Essential Here

"Notifications are fire-and-forget from the caller's perspective. When the Orders Service confirms an order, it should not block waiting for the email to send. It publishes a notification event to Kafka and moves on. A separate worker consumes the event and handles delivery. This decoupling means the Orders Service stays fast, and notification delivery can be retried independently if it fails."

### Handling Failures and Retries

"If a push notification fails (Apple's APNs is temporarily unreachable), the worker retries with exponential backoff: wait 1 second, then 2, then 4, then 8, up to a maximum. After N retries, the notification is moved to a dead letter queue for manual inspection. We never lose a notification."

### User Preferences

"Users should control what they receive. Store preferences in a database: user 42 wants push notifications for order updates but email only for promotions. The Notification Service checks preferences before queueing any message."


## Question 6: "How would you scale this to 10x traffic?" (Every Company)

This is not a standalone question. It gets asked as a follow-up to any design. Here is the framework.

### Step 1: Identify the Bottleneck

"First, I need to figure out what breaks at 10x. Is it the API servers (CPU-bound), the database (I/O-bound), the cache (memory-bound), or the network (bandwidth)? Monitoring data from the current system tells us where the pressure is."

### Step 2: Scale the Stateless Tier Horizontally

"API servers are stateless, so scaling them is straightforward. Add more instances behind the load balancer. If we currently have 5 servers, we go to 50. Auto-scaling groups handle this dynamically based on CPU or request count metrics."

### Step 3: Scale the Data Tier

"The database is harder because it is stateful. Options depend on the bottleneck:"

- **Read bottleneck:** Add read replicas. Writes go to the primary, reads are distributed across replicas. Works up to maybe 5 to 10 replicas before replication lag becomes an issue.
- **Write bottleneck:** Shard the database. Partition data across multiple database servers by a shard key (user_id, region). Each shard handles a subset of the data. This is complex (cross-shard queries, rebalancing) but necessary at extreme scale.
- **Hot key problem:** A single record gets disproportionate traffic (a viral post, a celebrity profile). Caching (Redis) absorbs the read load. For writes, consider a write-behind cache or dedicated handling for hot keys.

### Step 4: Add Caching Aggressively

"At 10x traffic, hitting the database for every request is unsustainable. Cache at every layer:"

- **Application-level cache (Redis):** Frequently accessed data (user profiles, product details)
- **CDN:** Static assets and cacheable API responses at the edge
- **Database query cache:** For expensive queries that do not change frequently

### Step 5: Introduce Async Processing

"Move anything that does not need to happen synchronously off the critical path. Sending emails, generating reports, updating analytics: these go into a message queue and are processed by background workers. The API responds immediately, and the work happens asynchronously."


## Quick-Fire Conceptual Questions

These come up in the first 5 to 10 minutes of system design rounds or in dedicated knowledge interviews.

**Q: What is the difference between horizontal and vertical scaling?**
Vertical scaling adds more resources (CPU, RAM) to a single server. Horizontal scaling adds more servers. Vertical is simpler but has a ceiling and no redundancy. Horizontal is more complex but provides fault tolerance and near-linear scalability.

**Q: When would you choose a NoSQL database over SQL?**
When the data is unstructured or semi-structured, when you need extreme write throughput, when horizontal scaling is a priority, or when you can tolerate eventual consistency. Examples: session storage, activity feeds, IoT sensor data, real-time analytics.

**Q: What is the CAP theorem?**
In a distributed system, you can guarantee at most two of three properties: Consistency (all nodes see the same data), Availability (every request gets a response), and Partition Tolerance (the system works despite network failures). Since partitions are inevitable, the real choice is between CP (consistent but may reject requests) and AP (available but may return stale data).

**Q: Explain the difference between authentication and authorization.**
Authentication verifies identity (who are you?). Authorization determines permissions (what can you do?). Authentication happens first. A user must be identified before the system can decide what they are allowed to access.

**Q: What is a JWT and why is it stateless?**
A JWT is a signed JSON object containing user identity and claims (user_id, role, expiration). It is stateless because the server does not need to store session data. The token itself carries all necessary information, and the server verifies it by checking the cryptographic signature.

**Q: What is consistent hashing and why does it matter?**
Consistent hashing maps both servers and keys to a virtual ring. When a server is added or removed, only the keys near that server on the ring need to be reassigned. Without consistent hashing, adding or removing a server reshuffles all key assignments, causing massive cache misses and data migration.

**Q: What is a single point of failure? Give three examples.**
A SPOF is any component whose failure brings down the entire system. Examples: a single database server (all APIs depend on it), a single load balancer (no traffic reaches any server), and a single DNS provider (users cannot resolve your domain).

**Q: What is the difference between PUT and PATCH?**
PUT replaces the entire resource. If you omit a field, it is removed. PATCH updates only the fields you include. Use PATCH for partial updates (changing just a price), PUT for full replacements (uploading a complete updated record).

**Q: Why would you use a message queue?**
To decouple producers from consumers. The producer publishes a message and moves on immediately. The consumer processes it when ready. This absorbs traffic spikes, enables retry logic, and prevents cascading failures when downstream services are slow or unavailable.

**Q: What is the difference between 401 and 403 status codes?**
401 means the client is not authenticated (unknown identity, missing or invalid token). 403 means the client is authenticated but not authorized (known identity, insufficient permissions). Resending the same request with the same credentials will not fix a 403.


## Practice Routine

- Study the concepts. Understand each component and its tradeoffs.
- Practice 1 to 2 full system design questions per day. Set a 45-minute timer. Draw on Excalidraw. Talk out loud as if explaining to an interviewer.
- Do mock interviews with a partner (Pramp, or a friend). Get feedback on structure, communication, and depth.

**Common systems to practice:**

- URL shortener (entry level)
- Rate limiter
- Chat/messaging system
- News feed / timeline
- Notification system
- Web crawler
- Ride-sharing service (Uber)
- Video streaming (Netflix/YouTube)
- Search autocomplete
- Payment system
- Distributed cache
- File storage (Google Drive/Dropbox)

For each system, practice identifying the core requirements, drawing the architecture, choosing the right database, designing the API, and discussing tradeoffs. The goal is not memorizing solutions but building the muscle to decompose any problem into components and reason about their interactions.

## Related Post

- [System Foundations: From One Server to Millions of Users](/Blog/system-foundations/) — The foundational scaling concepts behind every system design interview answer.

Happy hacking!