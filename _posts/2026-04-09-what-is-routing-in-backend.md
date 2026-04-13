---
type: post
title: "What is Routing in Backend? How Requests Find Their Way Home"
date: 2026-04-09 11:00:00 +0300
categories:
  - backend
---

In the [previous post on HTTP methods]({{ '/http-for-backend-engineers-part-3-methods-and-idempotency/' | relative_url }}), we talked about how HTTP methods express the *intent* of a request — do you want to fetch data, create something, update it, or delete it? You can think of HTTP methods as expressing the **what** of a request.

Routing expresses the **where**.

Where do you want to send that intent? Which resource do you want to act on? The server needs to know both things to do anything useful. When a `GET` request comes in for `/api/users`, the server reads the method and the path together, maps that combination to a specific [handler]({{ '/controllers-services-repositories-middlewares-and-request-context/' | relative_url }}), and the handler runs the business logic, does whatever database operations are needed, and returns a response.

Routing is simply the process of mapping a URL path combined with an HTTP method to server-side logic.

## Static Routes vs Dynamic Routes

The first and most fundamental distinction in routing is between static and dynamic routes.

**Static routes** are constant strings with no variable parts. `/api/books` is always `/api/books`. The path never changes, it always points to the same resource, and it always triggers the same handler. A `GET /api/books` and a `POST /api/books` are two distinct routes — the server forms a unique key from the method plus the path, so they never clash and each maps to different logic.

**Dynamic routes** contain variable slots in the path. Instead of a fixed string, part of the URL is a placeholder that the server extracts as data when a request comes in. In most backend frameworks — Node.js, Python, Go, Java, it does not matter — the convention for declaring a dynamic segment is a colon prefix, like:

```
GET /api/users/:id
```

When a request for `/api/users/123` arrives, the server matches the pattern, extracts `123`, and makes it available to the handler as the `id` parameter. From there the handler can look up user 123 in the database and return the details.

## Path Parameters vs Query Parameters

Once you have dynamic routes, there are two ways to pass variable data through a URL. They serve different purposes and are not interchangeable.

### Path Parameters

Path parameters are the variable segments embedded directly in the route path, right after a forward slash. The `123` in `/api/users/123` is a path parameter. Their purpose is **semantic expression** — they communicate meaning. Reading `/api/users/123` tells you exactly what you are asking for: the user whose ID is 123.

### Query Parameters

`GET` requests in REST APIs do not have a request body. If you need to send additional data with a `GET` request — a search term, pagination settings, a sort order — query parameters are the mechanism for that.

They are appended to the route after a `?` as key-value pairs:

```
GET /api/books?page=2&limit=20
```

A paginated list endpoint is the classic example. The server has a default behavior (return page 1 with a limit of 20) and exposes query parameters so the client can adjust: `page=2` to get the next page, `limit=50` to increase the page size. Filter and sort parameters work the same way. If you want the results sorted in ascending order, you send `sort=asc` as a query parameter.

The distinction matters because path parameters carry semantic weight — they identify *which* resource you are addressing. Query parameters carry optional metadata about *how* you want to receive it.

## Nested Routes

Nested routing is a standard practice in [REST APIs]({{ '/complete-rest-api-design/' | relative_url }}) for expressing a hierarchy between resources. The idea is to build up a path that reads semantically from left to right, getting more specific with each segment.

Consider a platform where users have posts:

| Route | Meaning |
|---|---|
| `GET /api/users` | Fetch all users |
| `GET /api/users/123` | Fetch the user with ID 123 |
| `GET /api/users/123/posts` | Fetch all posts belonging to user 123 |
| `GET /api/users/123/posts/456` | Fetch post 456 belonging to user 123 |

Each route is a valid, distinct endpoint with its own handler in the server. The nesting communicates the relationship between resources in a way that is readable at a glance. Any API with even moderate complexity will end up using nested routes — it is not a special feature, it is just the natural result of expressing hierarchical data in a URL.

## Route Versioning and Deprecation

As applications grow, requirements change. At some point you may need to change the structure of the data your API returns — add a field, rename a key, restructure the response format entirely. The problem is that if you change a live route, you break every client currently calling it.

Route versioning solves this. Instead of modifying the existing route, you introduce a new version:

```
GET /api/v1/products   →  { id, name, price }
GET /api/v2/products   →  { id, title, price }
```

Both versions live on the server simultaneously. When v2 is ready, you notify the frontend engineers that v1 is deprecated and give them a window to migrate their code. Once all clients have moved to v2, you remove v1 entirely and, if you want, rename v2 to v1 to clean things up.

The benefit is a controlled, non-breaking migration path for breaking changes. Your clients have time to adapt, and you never have to take down a live endpoint to make a structural change.

## Catch-All Routes

After the server runs through all of its route matching logic, there will be requests that do not match anything — a client requesting a route that does not exist, a typo in a URL, an outdated link. By default, if nothing handles the request, the server either throws an error or returns nothing useful.

A catch-all route handles this cleanly. It is placed at the very end of the routing configuration, using a wildcard pattern like `/*`, and it acts as a final fallback. Any request that makes it through all the previous matching attempts without finding a handler ends up here. The catch-all handler returns a friendly `404 Not Found` response with a clear message — "this route does not exist" — rather than an empty or broken response.

It is a small addition that makes any API significantly more debuggable and user-friendly.

## Putting It Together

The mental model for routing is:

1. The HTTP method expresses **what** you want to do
2. The route path expresses **where** you want to do it
3. The server combines them into a unique key and routes the request to the matching handler

Static routes for fixed resources. Dynamic routes with path parameters to address specific items. Query parameters for optional metadata on GET requests. Nested routes to represent resource hierarchies. Versioning for breaking changes. A catch-all at the end for everything that falls through.

That is the full routing picture, and understanding it is the foundation for reading and working in any backend codebase regardless of the language or framework.

Happy hacking!
