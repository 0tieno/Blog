---
type: post
title: "RESTful APIs: CRUD Operations, Status Codes, and Production Best Practices"
date: 2026-04-24 10:00:00 +0300
categories:
  - backend
  - system design
  - interviews
---

REST is not a protocol or a library. It is a set of architectural constraints that, when followed, produce APIs that are predictable, cacheable, and easy to reason about. This guide covers the practical mechanics of building REST APIs that other developers actually want to use.

## Resource Modeling: Think in Nouns

The first step in designing a REST API is identifying your resources. Resources map to the core entities in your business domain, and they are always expressed as nouns.

**Domain concepts to REST resources:**

```
Business Domain          REST Resource
─────────────           ─────────────
Product catalog    →    /products
Customer accounts  →    /users
Purchase records   →    /orders
Product feedback   →    /reviews
```

**The noun rule in practice:**

```
✅  GET /products          → Fetch the list of products
✅  GET /products/42       → Fetch a specific product
✅  POST /products         → Create a product

❌  GET /getProducts       → Verb in URL (bad)
❌  POST /createProduct    → Verb in URL (bad)
❌  POST /deleteProduct/42 → Wrong method + verb in URL (very bad)
```

The HTTP method is the verb. The URL is the noun. Mixing verbs into URLs creates confusion and breaks the REST contract.

**Nested resources for clear relationships:**

```
GET /products/42/reviews       → All reviews for product 42
GET /products/42/reviews/7     → Specific review 7 on product 42
GET /users/15/orders           → All orders for user 15
GET /users/15/orders/301/items → Items in order 301 for user 15
```

The URL structure communicates the relationship hierarchy. Anyone reading this URL knows exactly what data they are accessing.

## CRUD Operations and HTTP Methods

Each HTTP method has a specific semantic meaning. Using them correctly makes your API predictable.

### GET: Read a Resource

```
GET /api/v1/products/42

Response (200 OK):
{
  "id": 42,
  "name": "Mechanical Keyboard",
  "price": 149.99,
  "inStock": true,
  "category": "electronics"
}
```

GET requests are **safe** (they do not change server state) and **idempotent** (calling them 10 times produces the same result as calling them once). If a GET request modifies data on the server, your API is broken.

### POST: Create a Resource

```
POST /api/v1/products

Request Body:
{
  "name": "USB-C Hub",
  "price": 39.99,
  "category": "accessories"
}

Response (201 Created):
{
  "id": 108,
  "name": "USB-C Hub",
  "price": 39.99,
  "category": "accessories",
  "createdAt": "2025-04-18T10:30:00Z"
}
```

POST is **not idempotent**. Sending the same POST twice creates two resources with different IDs. The response status should be `201 Created`, not `200 OK`. The response body should include the created resource with its server-assigned ID.

### PUT: Replace a Resource Entirely

```
PUT /api/v1/products/42

Request Body:
{
  "name": "Mechanical Keyboard Pro",
  "price": 179.99,
  "inStock": true,
  "category": "electronics"
}

Response (200 OK):
{
  "id": 42,
  "name": "Mechanical Keyboard Pro",
  "price": 179.99,
  "inStock": true,
  "category": "electronics"
}
```

PUT replaces the entire resource. If you omit a field from the request body, that field gets removed or set to its default. PUT is idempotent: sending the same PUT request twice produces the same result.

### PATCH: Update a Resource Partially

```
PATCH /api/v1/products/42

Request Body:
{
  "price": 129.99
}

Response (200 OK):
{
  "id": 42,
  "name": "Mechanical Keyboard",
  "price": 129.99,
  "inStock": true,
  "category": "electronics"
}
```

PATCH only modifies the fields you include. Everything else stays unchanged. This is what you want for most update operations. Using PUT when you only need to change one field forces the client to send the entire object, which is wasteful and error-prone.

### DELETE: Remove a Resource

```
DELETE /api/v1/products/42

Response (204 No Content)
```

The `204 No Content` response means the deletion was successful, and there is nothing to return. Some APIs return `200 OK` with the deleted resource in the body. Both approaches are valid, but 204 is more common and more semantically correct.

## Status Codes: Communicating What Happened

Status codes tell the client whether the request succeeded and, if not, whose fault it was.

### 2xx: Success

| Code | Meaning | When to Use |
| --- | --- | --- |
| 200 OK | Request succeeded | GET requests, successful updates |
| 201 Created | Resource created | Successful POST requests |
| 204 No Content | Success, nothing to return | Successful DELETE, or PUT with no response body |

### 4xx: Client Made a Mistake

| Code | Meaning | When to Use |
| --- | --- | --- |
| 400 Bad Request | Malformed request | Invalid JSON, missing required fields, wrong data types |
| 401 Unauthorized | Not authenticated | No token provided, expired token, invalid credentials |
| 403 Forbidden | Authenticated but not allowed | User exists but lacks permission for this resource |
| 404 Not Found | Resource does not exist | Queried for product ID 999 but it is not in the database |
| 409 Conflict | Request conflicts with current state | Trying to create a user with an email that already exists |
| 422 Unprocessable Entity | Valid syntax but invalid semantics | Price is negative, email format is wrong |
| 429 Too Many Requests | Rate limit exceeded | Client sent too many requests in a given window |

**The 401 vs 403 distinction matters:**

401 means "I do not know who you are." The client needs to authenticate (log in, provide a token).

403 means "I know who you are, but you are not allowed to do this." The client is authenticated but lacks authorization. Sending the request again with the same credentials will not change the outcome.

### 5xx: Server Made a Mistake

| Code | Meaning | When to Use |
| --- | --- | --- |
| 500 Internal Server Error | Unexpected failure | Unhandled exception, bug in server code |
| 502 Bad Gateway | Upstream service failed | Your API called another service that returned an error |
| 503 Service Unavailable | Temporarily overloaded or in maintenance | Server is up but cannot handle the request right now |
| 504 Gateway Timeout | Upstream service timed out | Your API called another service that did not respond in time |

**Error response format (be consistent):**

```json
{
  "error": {
    "code": "PRODUCT_NOT_FOUND",
    "message": "Product with ID 999 does not exist",
    "status": 404
  }
}
```

Use a consistent error object structure across all endpoints. Include a machine-readable error code (for programmatic handling), a human-readable message (for debugging), and the HTTP status code.

## Filtering, Sorting, and Pagination

Production APIs never return unbounded result sets. If you have 100,000 products in your database and a client calls `GET /products`, returning all of them in one response is a disaster for both the server and the client.

### Filtering

Use query parameters to narrow results:

```
GET /api/v1/products?category=electronics&inStock=true&minPrice=50&maxPrice=200
```

The client gets exactly the subset they need. The database query is more efficient (fewer rows scanned, less data transferred).

### Sorting

```
GET /api/v1/products?sort=price:asc
GET /api/v1/products?sort=createdAt:desc
GET /api/v1/products?sort=rating:desc,price:asc    → Sort by rating first, then price
```

**Always sort on the backend.** If the client needs products sorted by price, do not return all 100,000 unsorted and let the frontend sort them. The database has indexes optimized for sorting. Let it do the work.

### Pagination

Three common approaches:

**Offset-based (simplest):**

```
GET /api/v1/products?page=3&limit=20

Response:
{
  "data": [...20 products...],
  "pagination": {
    "page": 3,
    "limit": 20,
    "total": 4521,
    "totalPages": 227
  }
}
```

Easy to understand and implement. The downside: skipping large offsets is slow in most databases (`OFFSET 100000` means the database scans and discards 100,000 rows before returning the next 20).

**Cursor-based (more performant at scale):**

```
GET /api/v1/products?limit=20&cursor=eyJpZCI6NDJ9

Response:
{
  "data": [...20 products...],
  "pagination": {
    "nextCursor": "eyJpZCI6NjJ9",
    "hasMore": true
  }
}
```

The cursor is an opaque token (usually a base64-encoded reference to the last item). The database uses it to efficiently start the next page from exactly where it left off, regardless of how deep into the dataset you are.

**When to use which:** Offset for admin dashboards where users jump to specific pages. Cursor for infinite scroll feeds (social media, chat history) where users paginate sequentially.

## Versioning Your API

APIs evolve. Fields get added, removed, or renamed. Versioning prevents breaking existing clients when you make changes.

**URL versioning (most common):**

```
GET /api/v1/products/42    → Original version
GET /api/v2/products/42    → Updated version with new fields
```

Simple, explicit, easy to route at the load balancer level. The downside: URL changes might require client-side code updates.

**Header versioning:**

```
GET /api/products/42
Accept: application/vnd.myapp.v2+json
```

Cleaner URLs but harder to test (you cannot just paste a URL into a browser).

**Best practice:** Use URL versioning. It is the most widely adopted, the easiest to understand, and the simplest to implement. Keep old versions running for a deprecation period, then sunset them.

## REST Best Practices Checklist

**Naming:**

- Use plural nouns for collections: `/products`, not `/product`
- Use lowercase with hyphens for multi-word resources: `/order-items`, not `/orderItems`
- Do not put verbs in URLs: `/products`, not `/getProducts`

**Methods:**

- GET for reads, POST for creates, PATCH for partial updates, PUT for full replacements, DELETE for removals
- Never modify data on a GET request

**Responses:**

- Return the created resource on POST (with its new ID)
- Return the updated resource on PATCH/PUT
- Return 204 (no body) on DELETE
- Use consistent error response format

**Headers:**

- Set `Content-Type: application/json` on all JSON responses
- Use `Cache-Control` headers to enable HTTP caching on GET responses
- Return `Location` header on 201 responses pointing to the new resource

**Security:**

- Always use HTTPS
- Validate all input
- Implement rate limiting
- Authenticate before processing


## Related Post

- [API Design: REST, GraphQL, gRPC, and Choosing the Right Protocol](/Blog/api-designs-rest-graphql-grpc-and-choosing-the-right-protocol/) — A broader look at REST alongside GraphQL and gRPC so you know when to use each.

Happy hacking!