---
type: post
title: "Complete REST API Design"
date: 2026-04-04 11:00:00 +0300
categories:
  - backend
  - http
---

Designing a REST API is not just about exposing endpoints. It is about designing communication rules that remain predictable, scalable, and easy for other engineers to consume over time.

This guide walks through REST from first principles to practical endpoint design decisions you can apply immediately.

If you are following the HTTP series on this blog, this post acts as the practical design bridge between protocol fundamentals and production API decisions.

### Quick Visual Maps

#### Request flow map

```text
Client
  |
  |  HTTP Request
  v
API Gateway / Router
  |
  v
Middleware Chain (auth, rate limit, logging)
  |
  v
Controller -> Service -> Repository -> Database
  |
  v
HTTP Response (status code + body)
```

#### Method and idempotency map

```text
GET     -> Read resource                  -> Idempotent
PUT     -> Replace full resource          -> Idempotent
PATCH   -> Update partial fields          -> Idempotent (with stable payload semantics)
DELETE  -> Remove resource                -> Idempotent
POST    -> Create resource / custom action-> Non-idempotent (by default)
```


### 1) What Is REST? (History and Definition)

In the 1990s, Tim Berners-Lee invented the World Wide Web. As the web grew rapidly, scalability became a major challenge. In 2000, Roy Fielding proposed an architectural style to standardize web communication and improve scalability: **REST (Representational State Transfer)**.

Let's break down the name:

- **Representational**: A resource can be represented in different formats depending on the client. An API client may receive JSON, while a browser may receive HTML.
- **State**: The current condition of a resource, such as the items and total price in a shopping cart.
- **Transfer**: Moving these representations between client and server using standard HTTP methods.


### 2) The 6 REST Constraints

To be truly RESTful, a system should follow six constraints proposed by Fielding:

1. **Client-Server**: Strict separation of concerns. The client handles UI/UX; the server handles business logic and data.
2. **Uniform Interface**: A consistent, standardized way for components to communicate.
3. **Layered System**: Requests can pass through layers (proxies, gateways, load balancers), and each layer only interacts with adjacent layers.
4. **Cache**: Responses should clearly declare whether they are [cacheable]({{ '/caching-the-secret-behind-it-all/' | relative_url }}).
5. **Stateless**: The server should not store client [session state]({{ '/authentication-for-backend-engineers-part-2-sessions-jwts-and-the-four-auth-types/' | relative_url }}) between requests.
6. **Code on Demand (Optional)**: The server can send executable code (such as JavaScript) to extend client behavior temporarily.


### 3) Anatomy of a RESTful Route

A typical API route follows a predictable structure:

`https://api.example.com/v1/books`

That includes:

- secure scheme: `https`
- API subdomain: `api`
- version: `v1`
- resource path: `books`

Key route design rules:

- Use **plural nouns** for resources: `/books`, `/organizations`
- Use IDs for single-resource retrieval: `/books/123`
- Avoid spaces and underscores in URLs
- Use lowercase and hyphenated slugs: `/books/harry-potter`
- Use hierarchical nesting when relationships matter: `/organizations/123/projects`


### 4) HTTP Methods and Idempotency

**Idempotency** means making the same request multiple times has the same server-side effect as making it once.

- **GET** (Idempotent): Reads data only; repeated calls do not change state.
- **PUT** (Idempotent): Replaces a full resource representation.
- **PATCH** (Idempotent in typical update semantics): Updates selected fields; applying the same patch repeatedly should stabilize to the same final state.
- **DELETE** (Idempotent): First call removes the resource; later calls should not create additional side effects.
- **POST** (Non-idempotent by default): Usually creates new resources, so repeated calls can create duplicates.

Use this model deliberately when designing retry behavior and client SDKs.


### 5) Custom Actions (When CRUD Is Not Enough)

Not every domain action maps cleanly to Create/Read/Update/Delete. Some actions trigger workflows, jobs, and side effects beyond standard updates, such as cloning or archiving.

When that happens, model the action as **POST** on a resource-specific sub-route:

- `POST /projects/123/clone`
- `POST /organizations/5/archive`

This keeps your API expressive while preserving clean resource boundaries.


### 6) Designing Robust List APIs

List endpoints should be built for large datasets from day one. Three features are essential:

1. **Pagination**

Return chunks, not everything at once. A practical paginated response includes:

- `data`: array for the current page
- `total`: total number of matching records
- `page`: current page number
- `totalPages`: total number of pages

2. **Sorting**

Allow clients to sort explicitly, e.g. `?sortBy=name&sortOrder=ascending`.

3. **Filtering**

Allow query-based filtering, e.g. `?status=active&name=org`.

Well-designed list APIs dramatically reduce frontend complexity and bandwidth waste.


### 7) Handling Status Codes Correctly

Use status codes intentionally and consistently:

- `200 OK`: successful fetch/update/custom action
- `201 Created`: successful resource creation via POST
- `204 No Content`: successful delete with empty body

A common rule many teams get wrong:

- Return `404 Not Found` when a **specific single resource** does not exist (e.g. `GET /users/999`)
- For list endpoints with no matches, return `200 OK` with an empty list (`[]`), not `404`

That distinction keeps API behavior predictable for client code.


### 8) Golden Rules for API Engineers

- **Extract nouns from UI**: Look at product wireframes and identify core entities (projects, users, tasks). Those nouns usually become your resources.
- **Use sane defaults**: If optional inputs are missing, apply defaults (for example, limit = 10, sort by `createdAt` descending, default status = `active`).
- **Be relentlessly consistent**: Keep naming conventions stable (`camelCase` in payloads, same field names across endpoints).
- **Ship interactive docs**: Use Swagger/OpenAPI so consumers can read and test the API in one place.

Consistency is what turns an API from "working" into "pleasant to use."


### Related HTTP Series Reading

- Foundations: [HTTP for Backend Engineers (Part 1)]({{ '/http-for-backend-engineers-part-1-foundations/' | relative_url }})
- Methods and idempotency deep dive: [HTTP for Backend Engineers (Part 3)]({{ '/http-for-backend-engineers-part-3-methods-and-idempotency/' | relative_url }})
- Status code semantics: [HTTP for Backend Engineers (Part 6)]({{ '/http-for-backend-engineers-part-6-status-codes/' | relative_url }})
- Caching behavior: [HTTP for Backend Engineers (Part 7)]({{ '/http-for-backend-engineers-part-7-http-caching/' | relative_url }})
- Routing deep dive: [What is Routing in Backend?]({{ '/what-is-routing-in-backend/' | relative_url }})
- Input handling: [Input Validation and Data Transformation]({{ '/input-validation-and-data-transformation-for-backend-engineers/' | relative_url }})


A well-designed REST API is a long-term product, not a one-time implementation detail. The cleaner your resource modeling, method semantics, status codes, and defaults are today, the fewer integration bugs and breaking changes you will fight tomorrow.

Happy hacking!
