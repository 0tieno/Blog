---
type: post
title: "Error Handling and Building Fault-Tolerant Systems"
date: 2026-04-10 10:00:00 +0300
categories:
  - backend
---

In the world of backend development, errors are not just problems to solve — they are a normal part of building applications. Your database queries will sometimes fail. Your external APIs will sometimes time out. Your users will sometimes send bad data that breaks your APIs. And your business logic will hit unexpected edge cases.

The question is not whether errors will happen, but how you will handle them when they do.

This post is not about tools, frameworks, or code snippets. It is about a mindset — the fault-tolerant mindset you need as a backend engineer to be prepared for the worst, know what can go wrong, and have strategies in place when it does.

## The Five Types of Backend Errors

### 1. Logic Errors

Logic errors are the sneakiest and most dangerous type. They do not crash your application — they just make it do the wrong thing. The code runs fine, but the results are incorrect.

Take an e-commerce backend as an example. If a discount is accidentally applied twice, customers get negative shipping costs. The app does not crash. Your platform just quietly loses money on every single order. These errors can go completely unnoticed for weeks or months if you are not monitoring them and your users are not reporting them.

They happen because of:
- **Misunderstood requirements** — a discussion with the product manager left some ambiguity and you implemented the wrong thing
- **Incorrect algorithms** — a complex discount calculation with a slight miscalculation
- **Missed edge cases** — an unexpected user behavior in a payment or order workflow

Logic errors tied to payments, money, or security are especially dangerous because they can corrupt data and produce wrong business results over a long period without ever getting flagged.

### 2. Database Errors

Most backend apps rely heavily on their database, so database errors can bring your entire system down.

**Connection errors** happen when your app cannot reach the database — the network is down, the server is overloaded, or the [connection pool]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }}) is exhausted. Connection pooling is an optimization that keeps a set of open TCP connections ready so each new request does not have to do a full handshake. When the pool is full, no new requests can get through, and your backend starts throwing 500 errors everywhere.

**Constraint violations** happen when an operation breaks a database rule. The two most common:
- **Unique constraint** — trying to create a user with an email that already exists
- **Foreign key constraint** — inserting an order with a `customer_id` that does not exist in the `customers` table

For unique constraint errors, the fix is not in the database — only the database knows whether an email is unique. Your job is to catch that error and send a meaningful, user-friendly message back rather than letting a raw database error bubble into a 500.

**Query errors** happen when SQL is malformed — a typo in a table name, a query that times out because it is too complex.

**Deadlocks** are particularly tricky. They occur when multiple database operations are waiting on each other, creating a circular dependency. Queries never complete and the database has to intervene and kill one of them.

### 3. External Service Errors

Modern SaaS apps depend on a lot of external services: payment processors like Stripe, email providers like Resend, cloud storage like S3, authentication services like Clerk or Auth0. Each one of these is a point of failure you have no control over.

This does not mean you stop using them — you cannot rebuild Stripe from scratch. It means you expect them to fail and you plan for it.

**Network failures** — your connection to an external service can fail at any time. Connection timeouts, DNS failures, network partitions, these are all real. You need to expect them and plan for them.

**Rate limiting** — most external services enforce rate limits. If your platform hits their API too many times in a short window (whether through unexpected user activity or a logic error in your code), they will start returning `429 Too Many Requests`. The standard strategy for this is **exponential backoff**: if you get a 429, wait 1 minute and retry. If you get another 429, wait 2 minutes. Then 4 minutes. Keep doubling until you start getting successful responses. You must build this logic into your error handling when working with any rate-limited external service.

**Service outages** — sometimes a major cloud provider just goes down. When that happens, a lot of their clients go down with them. You cannot prevent this, but you can handle it gracefully with fallbacks. If [Redis]({{ '/caching-the-secret-behind-it-all/' | relative_url }}) goes down, fall back to in-memory caching. If your primary service is unavailable, disable the non-essential features that depend on it and keep your core functionality alive.

### 4. Input Validation Errors

These happen when users send data that does not meet your system's requirements. They are the easiest errors to handle because you already know the rules — you just need to enforce them at the entry point of your backend before the data goes anywhere.

The common categories:
- **Format validation** — is this actually a valid email address? A valid phone number? A valid date?
- **Range validation** — is this number within the expected min/max? Is this string too long? Does this array have the right number of items?
- **Required field validation** — are all the mandatory fields present?

For all of these, the right response is a `400 Bad Request` with a clear message explaining exactly what is wrong. These are user errors and fixable on their end. Catch them early, return a clear error, and you have done your job.

A robust [validation layer]({{ '/input-validation-and-data-transformation-for-backend-engineers/' | relative_url }}) is your first line of defense against both bad data and malicious input.

### 5. Configuration Errors

Configuration errors usually show up when you move code between development, staging, and production. The classic scenario: you add an environment variable (like an OpenAI API key) to your local `.env` file during development, raise a PR, it gets merged, and everything looks fine — until production deployment, when you realize you forgot to set that variable in the production environment.

If you have proper startup validation, your app fails to start immediately. This is the best possible outcome in this scenario. In modern deployments using blue/green deployment strategies, a failed new deployment leaves your previous deployment running. Your app is not down.

If you do not have startup validation, the app starts fine. But the moment a user hits an API endpoint that depends on that missing config key, they get a `500 Internal Server Error`. You have a silent, runtime failure that only reveals itself under real user load.

**Best practice: always validate all required configuration variables before your server starts.** If anything is missing or corrupted, fail immediately with a meaningful message. Never let a missing config variable reach runtime.

## Proactive Error Detection

The best error handling strategy starts before errors cause damage. Proactive detection is about catching problems before they impact users.

### Health Checks

An HTTP health check endpoint at `/health` or `/status` returning a `200 OK` tells you whether your server process is running. That is a starting point — not enough on its own.

You should also verify that your services are actually doing their job:

- **Database health checks** — test connectivity with a representative query. If queries that used to take 500ms are suddenly taking 4 seconds, something is wrong. Check data integrity too, not just whether a connection opens.
- **External service health checks** — run test transactions for payment processors, send test emails to internal addresses, generate and validate test tokens for authentication services.
- **Core functionality checks** — verify all required configuration is loaded, populate critical caches, confirm that internal data structures are in a consistent state.

All of this combined is proactive error detection: methodologies to prevent errors from reaching users, and recovery plans for when they inevitably do.

### Monitoring and Observability

We have [a dedicated post on logging, monitoring, and observability]({{ '/logging-monitoring-and-observability/' | relative_url }}) — it is a big topic and deserves its own treatment. But in the context of error handling, the key points are:

- **Track more than error rates.** Performance degradation is often an early warning sign before a full system failure. If response times are climbing, something is wrong even if error rates look normal.
- **Track business metrics.** A sudden drop in successful checkouts or completed authentications is a signal that something is technically wrong, even if no errors are being thrown yet.
- **Cover all your error sources.** HTTP errors, database errors, external service failures, business logic errors — your monitoring setup should be comprehensive.
- **Use structured logging** (JSON format) so that tools like [Grafana](https://grafana.com/) and Loki can parse and search your logs, and you can explore error rates in a visual dashboard.

## Error Handling Philosophies

When an error happens, your immediate response determines whether it becomes a minor hiccup or a major incident.

### Recoverable Errors

For errors you can recover from automatically — like a network timeout or an exhausted database connection pool — retry mechanisms and exponential backoff are your go-to strategies. They work well because the condition is temporary. One important caveat: make sure your retry logic does not add more stress to a system that is already under pressure. Your recovery logic should be designed not to make things worse.

### Non-Recoverable Errors

For errors you cannot automatically recover from, the strategy is **containment and graceful degradation** — switching to cached data, disabling non-essential features, providing a fallback, and limiting the blast radius. The goal is to keep the core of your application alive even if parts of it are unavailable.

### Error Propagation

Not all errors should be handled at the exact point where they occur. Sometimes a low-level error (like a database failure) needs to propagate up to a higher level in your application where there is more business context to make a decision. This is error bubbling.

In exception-based languages like JavaScript or Python, you throw the error and catch it further up. In languages like Go, you return the error from every layer until it reaches the part of your application that knows what to do with it.

**Error boundaries** — the points where you stop errors from propagating further — are especially important in service architectures. You want errors in one service to stay contained and not cascade into neighboring services. Separate processes, timeouts at service boundaries, and message queues for asynchronous decoupled communication are the tools for this.

## The Global Error Handler — Your Final Safety Net

Implementing a **global error handling middleware** is one of the highest-leverage things you can do in a backend application. It is the final safety net, and once you build it well, it pays dividends immediately.

It relies on the architecture that most backend apps follow: routing layer → [handler → service → repository]({{ '/controllers-services-repositories-middlewares-and-request-context/' | relative_url }}). When an error occurs at any layer, instead of handling it right there on the spot, you bubble it all the way up to a single centralized middleware that inspects the error and decides what HTTP response to send.

Here is how it works in practice, using a book management app as an example:

**Creating a new book:**
- User sends a book name that is 700 characters long (max is 500 characters). The handler catches this and bubbles up a validation error. The global error handler sees a validation error → returns `400 Bad Request` with the specific field error.
- User sends a book name that already exists in the database. The repository runs the `INSERT` query, the database throws a unique constraint violation, it bubbles up. The global error handler sees a unique constraint error → returns `400 Bad Request` with "book already exists."

**Fetching a book by ID:**
- The user navigates to `/books/123` but book ID 123 does not exist. The repository runs `SELECT * FROM books WHERE id = 123`, the database driver returns a "no rows" error, it bubbles up. The global error handler sees a no-rows error on a resource-fetch request → returns `404 Not Found` with "book with ID 123 does not exist."

**Author ID that does not exist:**
- A create-book request comes in with an `author_id` that has no matching record in the `authors` table. The database throws a foreign key violation error. The global error handler sees a foreign key error → returns `404 Not Found` for the missing author resource.

The two major advantages of this pattern:

1. **Robustness** — if a developer forgets to handle a specific error case in a repository method, the uncaught error still reaches the global handler instead of becoming a raw, confusing `500 Internal Server Error`.
2. **No redundancy** — without a central handler, you would need to write the same error-format logic in every repository method, every service, every handler. That is fragile and prone to inconsistencies.

## Security in Error Handling

Error messages and logs are surfaces that attackers actively look for weaknesses in. You must be deliberate about what information leaves your backend.

### Never Leak Internal Details

When a database error occurs, never send the raw database error message to the user. Raw errors often contain table names, index names, constraint names, and query fragments — exactly what an attacker needs to craft more targeted SQL injection attacks. Always intercept these errors in your global error handler and return a controlled, generic message like "Something went wrong" for any unrecognized error.

### Prevent Enumeration Attacks

In login endpoints, be very careful about the granularity of your error messages. If a user provides a wrong email and you return "A user with this email does not exist," you have given attackers a tool: they can now automate requests with different email addresses until they find one that does exist. Once they have a valid email, they move on to password guessing.

The fix is simple: always use a generic message like **"Invalid username or password"** regardless of whether the email was not found or the password was wrong. The [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) documents this and many related practices.

### Sanitize Your Logs

Logs feel internal — they live on your servers, visible only to your team. But logs get leaked. In major data breaches, the leaked asset is often the application logs. If those logs contain plain-text passwords, API keys, credit card numbers, or user emails, attackers now have all of that.

When logging errors for debugging, never log sensitive data. Use non-sensitive identifiers instead: log the **User ID**, not the email. Log a **Correlation ID**, not the session token. If an authentication error occurs, log enough context to debug the issue without logging anything that could harm your users if the log file were exposed.

## TDLR

Fault-tolerant systems are not built by hoping errors do not happen. They are built by expecting every type of error and having a clear, deliberate response for each one. The key points:

- Validate configuration at startup — fail fast before users are affected
- Build a robust validation layer — it is your first and easiest line of defense
- Use exponential backoff for recoverable external service errors
- Design fallbacks for service outages
- Implement a global error handler as your final safety net
- Keep error messages generic — never leak internal details to the outside world
- Sanitize logs — never log sensitive user data

Happy hacking!
