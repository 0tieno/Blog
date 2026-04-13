---
type: post
title: "Controllers, Services, Repositories, Middlewares, and Request Context"
date: 2026-04-13 09:00:00 +0300
categories:
  - backend
---

When a client sends an HTTP request to a server, the code that handles it doesn't have to live in one giant function. Separating it into distinct layers — Controllers, Services, and Repositories — is not strictly mandatory, but it is a fundamental design pattern that makes a codebase **scalable**, **maintainable**, easier to debug, and easier to extend.

Here's what each layer does, and why it matters.


### The Controller (Handler) Layer

The Controller is the entry point for an API route. Once the routing algorithm matches the incoming URL to a handler, the Controller takes over. Its job is to manage the flow of data from the client to the server, and back to the client.

A typical Controller does the following, in order:

1. **Data Extraction** — It receives the HTTP `request` and `response` objects and pulls out whatever data it needs: query parameters for a GET request, or the JSON body for a POST request.
2. **Binding (Deserialization)** — The request travels over the network as a JSON string. The Controller deserializes it into the language's native format (a Go struct, a Python dictionary, a JavaScript object). If this fails, it immediately returns a `400 Bad Request`.
3. **Validation** — It checks that the incoming data matches the expected format, that required fields are present, and that no malicious payloads are sneaking through.
4. **Transformation** — It shapes the data for backend convenience before passing it downstream. For example, if a client omits an optional `sort` parameter, the Controller can inject a default value (like sorting by date) before anything else sees it.
5. **Delegation** — It passes the clean, validated data to the Service layer.
6. **Sending the Response** — Once the Service layer finishes, the Controller picks the right HTTP status code (`200 OK`, `201 Created`, `400 Bad Request`, `500 Internal Server Error`, etc.) and sends the final response back to the client.

The Controller doesn't process business logic itself — it only orchestrates the flow.


### The Service Layer

The Service layer is where the actual business logic lives.

The most important rule here: **the Service layer should know absolutely nothing about HTTP**. No request objects, no response objects, no status codes, no validation. It simply acts as a standard function — data goes in, processing happens, a result comes out.

A single service method can do quite a lot. It might call multiple repositories, merge data from different sources, trigger an email, or make requests to an external API. That's fine — orchestration is exactly what this layer is for. What it should never do is reach back into HTTP concerns.

This isolation is what makes services independently testable and reusable.


### The Repository (Database) Layer

The Repository layer has one responsibility: database operations.

It takes data from the Service layer, builds the appropriate database query (insert, filter, sort, etc.), and returns the raw results. That's it.

A key principle here is the **Single Responsibility Principle**. A repository method should do one specific thing and return one type of data. Don't write a repository method with complex conditional logic that sometimes returns a single record and sometimes returns a list. Create two separate methods instead. Keeping them focused makes them predictable and easy to test.


### Middlewares

Middlewares are functions that execute **between** the moment a server receives a request and the moment it reaches the final Controller.

The reason to use them is simple: avoid duplicating code. A backend app might have hundreds of API endpoints, and many of them need the same operations — security checks, logging, body parsing. Middlewares centralize this logic so it's defined once and applied everywhere.

Every middleware receives the standard `request` and `response` objects, plus a `next` function. Calling `next()` passes execution to the next middleware (or the Controller) in the chain. A middleware can also choose **not** to call `next()` and instead return a response immediately — effectively terminating the request early.

The order middlewares are arranged in matters, because the request flows through them sequentially.

**Common middleware examples:**

- **CORS & Security Headers** — Placed very early. Checks the origin of the request and blocks it instantly if the domain is unauthorized.
- **Rate Limiting** — Checks the user's IP address. If they are spamming the server, it returns a `429 Too Many Requests` error before the request goes any further.
- **Authentication** — Verifies the user's token. Returns `401 Unauthorized` if it's invalid. If valid, extracts the user's identity and passes it downstream for other layers to use.
- **Logging** — Records details about each request (URL, method, parameters) for debugging purposes.
- **Global Error Handling** — Usually placed at the very end of the chain. It catches any unstructured errors thrown by controllers or services and formats them into clean, standardized error messages for the client.


### Request Context

Request Context is a shared, key-value storage mechanism that is scoped strictly to a **single HTTP request**.

Because a request passes through many isolated function boundaries — multiple middlewares and a controller — there needs to be a way for them to share state without tightly coupling the code. Request Context is that mechanism.

**Common use cases:**

1. **Passing Authentication Data** — When the Authentication middleware validates a token, it extracts the `user_id` and the user's `role` (e.g., admin vs. standard user) and saves them to the Context. When the Controller is ready to save a new record, it reads the `user_id` directly from the Context. This is a security-critical pattern: you should **never** trust a `user_id` sent by the client in the request body, since a malicious user could spoof it.

2. **Request Tracing** — An early middleware generates a unique ID (UUID) and stores it in the Context. As the request travels through different services and logs, that ID is attached everywhere — making it possible to trace the exact path of a bug across an entire distributed system.

3. **Cancellations and Timeouts** — The Context can carry abort signals and deadline values to prevent calls to external services from hanging indefinitely.


Putting it all together: a request arrives, passes through middlewares (security, auth, logging), reaches the Controller (validation, binding, transformation), gets delegated to the Service (business logic), which calls the Repository (database query), and the result bubbles back up to the client with the right status code. Each layer has one job, and that clarity is what makes backend systems maintainable at scale.

Happy hacking!
