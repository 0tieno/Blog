---
type: post
title: "API Design: REST, GraphQL, gRPC, and Choosing the Right Protocol"
date: 2026-04-21 10:00:00 +0300
categories:
  - backend
  - system design
  - interviews
---

APIs are the glue that holds modern software together. They allow different systems, services, and clients to communicate and work together. As a backend engineer, you will design APIs that power web applications, mobile apps, microservices, and third-party integrations.

An API is a contract between systems. It defines what requests can be made, what responses to expect, and what rules both sides agree to follow. The design of that contract affects performance, developer experience, and how well your system scales.

## What an API Actually Is

Strip away the buzzwords, and an API is two things:

**An abstraction mechanism.** The client does not need to know how you store users internally, what database you use, or what language your server is written in. The API hides all of that and exposes a clean interface: "send me this, I will give you that."

**A service boundary.** APIs define where one system ends, and another begins. Your user service has its own API. Your payment service has its own API. They communicate through these defined interfaces, regardless of their internal implementations.

## The Three Dominant API Styles

### REST (Representational State Transfer)

REST is the most widely used API style. It treats everything as a resource and uses HTTP methods to operate on those resources.

**Core characteristics:**

- Resources are identified by URLs: `/users`, `/products/42`, `/orders/7/items`
- Standard HTTP methods map to operations: GET (read), POST (create), PUT/PATCH (update), DELETE (remove)
- Stateless: every request contains all the information needed to process it. The server does not remember previous requests.
- Responses have a fixed structure for each endpoint

**Example: Building an e-commerce API**

```
GET    /api/v1/products          → List all products
GET    /api/v1/products/42       → Get product with ID 42
POST   /api/v1/products          → Create a new product
PATCH  /api/v1/products/42       → Update product 42 partially
DELETE /api/v1/products/42       → Delete product 42
GET    /api/v1/products/42/reviews → Get reviews for product 42
```

Notice the pattern: nouns (products, reviews), not verbs (getProduct, deleteProduct). The HTTP method is the verb. The URL is the noun.

### GraphQL

GraphQL is a query language that lets clients request exactly the data they need from a single endpoint.

**Core characteristics:**

- Single endpoint for all operations (typically `/graphql`)
- Client specifies the exact shape of the response
- Operations: `query` (read), `mutation` (write), `subscription` (real-time)
- A schema defines the types and relationships

**The problem GraphQL solves:**

Imagine a social media profile page that needs the user's name, their last 5 posts (with titles only), and their follower count. With REST, you might need three separate requests:

```
GET /api/v1/users/123          → Gets user (but also returns email, bio, settings you don't need)
GET /api/v1/users/123/posts    → Gets posts (but returns body, images, metadata you don't need)
GET /api/v1/users/123/followers → Gets full follower objects when you only need the count
```

That is three round trips, and each returns more data than you need (overfetching).

With GraphQL, one request:

```graphql
query {
  user(id: "123") {
    name
    posts(limit: 5) {
      title
    }
    followersCount
  }
}
```

One round trip. Exactly the data you need. Nothing extra.

**When GraphQL shines:** Complex UIs where different views need different slices of the same data. Mobile apps where bandwidth is precious and overfetching wastes data.

**When GraphQL is overkill:** Simple CRUD applications with predictable access patterns. REST is simpler to implement, cache, and debug.

### gRPC (Google Remote Procedure Call)

gRPC is a high-performance RPC framework that uses Protocol Buffers (protobuf) for serialization and HTTP/2 for transport.

**Core characteristics:**

- Methods defined in `.proto` files
- Binary serialization (protobuf) instead of text (JSON)
- Built-in streaming (client, server, and bidirectional)
- Strong typing with code generation

**Example .proto definition:**

```protobuf
service UserService {
  rpc GetUser (UserRequest) returns (UserResponse);
  rpc ListUsers (ListRequest) returns (stream UserResponse);
}

message UserRequest {
  string user_id = 1;
}

message UserResponse {
  string id = 1;
  string name = 2;
  string email = 3;
}
```

**When to use gRPC:** Microservice-to-microservice communication where performance matters. gRPC is significantly faster than REST for service-to-service calls because protobuf is smaller and faster to parse than JSON, and HTTP/2 supports multiplexing.

**When not to use gRPC:** Browser-to-server communication. Most browsers do not natively support HTTP/2 in the way gRPC requires. You would need a gRPC-Web proxy, which adds complexity.

## Head-to-Head Comparison

| Dimension | REST | GraphQL | gRPC |
| --- | --- | --- | --- |
| Protocol | HTTP/1.1 | HTTP/1.1 | HTTP/2 |
| Data format | JSON (text) | JSON (text) | Protobuf (binary) |
| Endpoints | Multiple (one per resource) | Single | Multiple (defined in proto) |
| Caching | HTTP caching (built-in, mature) | Application-level (harder) | Limited |
| Versioning | URL-based (v1, v2) | Schema evolution | Proto file versioning |
| Streaming | Not native | Subscriptions | Built-in (bidirectional) |
| Best for | Web/mobile APIs, public APIs | Complex UIs, mobile apps | Microservices, internal APIs |
| Learning curve | Low | Medium | High |

## API Protocols: The Transport Layer Underneath

### HTTP/HTTPS

The foundation of web APIs. Request-response model. Client sends a request, server sends a response.

**Key components of an HTTP request:**

- Method: GET, POST, PUT, PATCH, DELETE
- URL: the resource being accessed
- Headers: metadata (Authorization, Content-Type, Cache-Control)
- Body: data payload (for POST, PUT, PATCH)

**Key components of an HTTP response:**

- Status code: 200 (success), 400 (client error), 500 (server error)
- Headers: Content-Type, Cache-Control, etc.
- Body: the response data

HTTPS adds TLS/SSL encryption on top of HTTP. Your data is encrypted in transit. This is the baseline for any production API. Running HTTP without TLS in production is a security vulnerability.

### WebSockets

HTTP is request-response: the client always initiates. WebSockets enable bidirectional, persistent connections. After an initial handshake over HTTP, the connection upgrades to a WebSocket, and both sides can send data at any time.

**HTTP polling (the bad way):**

```
Client: "Any new messages?" → Server: "No"
Client: "Any new messages?" → Server: "No"
Client: "Any new messages?" → Server: "Yes, here are 2 messages"
Client: "Any new messages?" → Server: "No"
```

Wasteful. Most requests return nothing. Latency between when a message arrives and when the client sees it depends on the polling interval.

**WebSocket (the good way):**

```
Client ←→ Server (persistent connection after handshake)

Server has new message → pushes to client immediately
Client sends a message → server receives immediately
```

No wasted requests. Real-time delivery. Lower bandwidth usage.

**Use WebSockets for:** Chat applications, live notifications, collaborative editing, real-time dashboards, multiplayer games, live sports scores.

**Do not use WebSockets for:** Standard CRUD operations. HTTP is simpler, more cacheable, and better supported.

### AMQP (Advanced Message Queuing Protocol)

Used for asynchronous, decoupled communication between services. Instead of Service A calling Service B directly, Service A publishes a message to a queue, and Service B consumes it when ready.

```
Producer (Payment Service)
    |
    v
Message Broker (RabbitMQ)
    |
    +--- Queue: order-processing
    |
    v
Consumer (Inventory Service)
```

**Why this matters:** The producer and consumer are decoupled. If the inventory service is down, messages accumulate in the queue. When it comes back up, it processes the backlog. No data is lost.

**Use AMQP for:** Background job processing, event-driven architectures, systems where producers and consumers operate at different speeds.

## TCP vs UDP: The Transport Layer Decision

Both TCP and UDP sit below HTTP/WebSockets at the transport layer. They determine how data physically moves between machines.

**TCP (Transmission Control Protocol):**

- Connection-based (three-way handshake before data transfer)
- Guarantees delivery: lost packets are retransmitted
- Guarantees ordering: packets arrive in sequence
- Higher overhead, slower

**UDP (User Datagram Protocol):**

- Connectionless (no handshake)
- No delivery guarantee: lost packets are gone
- No ordering guarantee: packets may arrive out of order
- Lower overhead, faster

**When to use TCP:** Anything where data integrity matters. Banking, file transfers, web APIs, email. You cannot afford to lose a packet containing a payment confirmation.

**When to use UDP:** Anything where speed matters more than completeness. Video calls (a dropped frame is better than a delayed call), live streaming, online gaming (you want the latest game state, not a retransmission of a state from 2 seconds ago).

**Mental model:** TCP is registered mail with tracking and signature. UDP is shouting across a room. TCP guarantees the message arrives. UDP is faster but some words might get lost.

## The Four Pillars of Good API Design

Regardless of style (REST, GraphQL, gRPC), every well-designed API should be:

**1. Consistent.** Use the same naming conventions everywhere. If you use camelCase for one field (`userId`), do not use snake_case for another (`order_status`). Pick one and stick to it.

**2. Simple.** The best API is one developers can use without reading documentation. If someone sees `GET /api/v1/users/42`, they should immediately understand what it does.

**3. Secure.** Authentication (who are you?), authorization (what can you do?), input validation (is this data safe?), and rate limiting (are you abusing this?) are not optional.

**4. Performant.** Support pagination for large collections. Use caching headers. Minimize response payloads. Reduce unnecessary round trips.

## API Design Process for Interviews

When asked to design an API in an interview, follow this structure:

1. **Clarify the requirements.** What are the core use cases? What entities exist? What are the access patterns?
2. **Identify the resources.** Map domain concepts to API resources (users, orders, products).
3. **Define the endpoints.** For each resource, what operations are needed? What URL structure makes sense?
4. **Specify request/response formats.** What does the client send? What does the server return?
5. **Address cross-cutting concerns.** Authentication, pagination, rate limiting, error handling, versioning.

**Example: "Design an API for a URL shortener"**

Resources: shortened URLs

```
POST   /api/v1/urls          → Create a short URL
  Request:  { "originalUrl": "https://example.com/very/long/path" }
  Response: { "shortCode": "abc123", "shortUrl": "https://short.ly/abc123" }

GET    /api/v1/urls/abc123   → Get original URL for redirect
  Response: 301 redirect to original URL

GET    /api/v1/urls/abc123/stats → Get click analytics
  Response: { "clicks": 1420, "uniqueVisitors": 890, "topCountries": [...] }

DELETE /api/v1/urls/abc123   → Delete a short URL
  Response: 204 No Content
```

This shows you can model resources, choose appropriate HTTP methods, use meaningful status codes, and think about related data (analytics).

## Related Post

- [RESTful APIs: CRUD Operations, Status Codes, and Production Best Practices](/Blog/RESTful-apis/) — A deep dive into REST specifics, status codes, and patterns for building production-grade REST APIs.

Happy hacking!