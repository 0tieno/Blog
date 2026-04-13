---
type: post
title: "Authentication for Backend Engineers Part 2: Sessions, JWTs, and the Four Auth Types"
date: 2026-03-30 11:00:00 +0300
categories:
  - backend
  - security
---

[Part 1]({{ '/authentication-for-backend-engineers-part-1-the-evolution-of-authentication/' | relative_url }}) covered the history of authentication — from wax seals to asymmetric cryptography to MFA. Now let's get into the mechanics.

Before diving into the different authentication types, it helps to understand the three building blocks that appear across all of them: **sessions**, **JWTs**, and **cookies**.

## Three Core Components of Modern Authentication

### Sessions

HTTP is a stateless protocol. By design, it treats every request as an isolated interaction with no memory of any past exchange. For the early web — mostly static pages, read-only content — this was fine. Nobody needed the server to remember anything between requests.

But as the web became dynamic and interactive, statelessness became a problem. How does an e-commerce site remember what is in your cart? How does a platform keep you logged in as you navigate between pages? These needs marked the beginning of stateful interactions.

Sessions solved this. Here is how the workflow works:

1. **Session creation** — when a user logs in successfully, the server creates a unique session ID and stores it alongside the user's data (role, cart contents, whatever the server needs to remember) in a persistent store. Early implementations used file-based storage; modern systems use Redis or another in-memory store for fast lookups.

2. **Session delivery** — the session ID is sent to the client as a cookie (more on cookies shortly). Every subsequent request from that client includes the cookie, so the server can look up the session ID, retrieve the user's stored data, and identify the user.

3. **Session expiry** — sessions have an expiration time. After 15 minutes (or whatever the configured TTL is), the session becomes invalid and the user has to log in again.

The storage evolution of sessions mirrors the scaling demands of the web: file-based → database-backed → distributed in-memory stores like Redis and Memcached. Sessions are still used today and remain one of the most practical authentication mechanisms for web applications.

### JWTs — JSON Web Tokens

By the mid-2000s, web applications had grown into globally distributed systems. Sessions worked, but at scale they created problems:

- **Memory** — storing session data for millions of users in Redis became expensive
- **Replication** — in distributed architectures, synchronizing session state across servers in multiple regions introduced latency and consistency challenges

Developers needed a way to offload state from the server while keeping authentication secure. JWTs, formalized in 2015, solved this with a different approach: instead of storing user data on the server, the server encodes it inside the token itself.

A JWT is a base64-encoded string with three dot-separated parts:

**1. Header** — metadata about the token: the token type and the signing algorithm used (e.g., HS256).

**2. Payload** — the actual claims. Standard fields:
- `sub` — the user ID (the subject of the token)
- `iat` — issued at (when the token was created)
- Optional: `name`, `role`, and any other data your application needs

**3. Signature** — the server signs the header and payload using a secret key that only the server holds. When a JWT arrives in a request, the server re-computes the signature to verify the token has not been tampered with. If someone modifies the payload, the signature check fails and the token is rejected.

This makes JWTs **self-contained** and **stateless**: all the information needed to identify the user is inside the token. The server does not need a database lookup — just a cryptographic verification.

**Advantages of JWTs:**
- No server-side storage costs
- In distributed architectures, any server holding the shared secret key can verify the token — authentication is uniform across all instances
- Portable: JWT strings are URL-friendly and can be stored in cookies, forwarded between services, or sent in headers

**Disadvantages of JWTs:**
- **Revocation is hard.** If a JWT is stolen, there is no way to invalidate it until it expires — unless you change the secret key, which forces every user on the platform to log out
- **No real-time session control.** You cannot see which users currently hold valid tokens

A hybrid approach addresses the revocation problem: use short-lived JWTs for normal requests, and maintain a blacklist in Redis for tokens you want to revoke early. This adds one storage lookup per request — which partially undermines the statelessness benefit.

This trade-off is why the common advice for production systems is: **use an authentication provider**. Services like [Auth0](https://auth0.com/) and [Clerk](https://clerk.com/) have already solved these trade-offs, implemented the security best practices, and handle the full token lifecycle. Unless you are learning the mechanics (a great reason to implement auth yourself), production apps should lean on a provider.

### Cookies

A cookie is a small piece of data that a server can store in the client's browser. What makes cookies special from an authentication perspective is the direction of control: the server sets the cookie, but the browser automatically attaches it to every subsequent request to that same server.

The workflow:
1. User authenticates successfully
2. Server sets an `HttpOnly` cookie containing the token (session ID or JWT)
3. The `HttpOnly` flag means JavaScript cannot read the cookie's value — this protects against XSS attacks trying to steal the token
4. Every subsequent request from the browser includes the cookie automatically
5. Server reads the cookie, extracts the token, and validates the user

Cookies are the plumbing that makes session and JWT workflows seamless. Without cookies, the client would have to manage and attach tokens manually on every request.

## The Four Types of Authentication

Now that the building blocks are clear, here are the four main authentication patterns backend engineers use.

### 1. Stateful Authentication

**How it works:**
1. User sends credentials (email + password)
2. Server validates them
3. Server creates a session ID, stores it with the user's data in Redis
4. Server sends the session ID to the client in an `HttpOnly` cookie
5. All subsequent requests include the cookie
6. Server looks up the session ID in Redis, retrieves the user data, proceeds

**Best for:** Standard web applications, most SaaS products.

**Pros:**
- Centralized control — you can see all active sessions in real time
- Easy revocation — delete the session from Redis and the user is logged out immediately
- Works well for applications with strict session requirements

**Cons:**
- Limited scalability in large distributed systems — synchronizing session stores across regions introduces latency
- Higher operational complexity

### 2. Stateless Authentication

**How it works:**
1. User sends credentials
2. Server validates them and signs a JWT with its secret key
3. JWT is sent back to the client
4. All subsequent requests include the JWT in the `Authorization` header
5. Server cryptographically verifies the JWT — no database lookup needed
6. User identity and role are extracted from the token payload

**Best for:** APIs, distributed architectures, microservices, mobile applications.

**Pros:**
- No session store to maintain
- Any server instance can verify the token independently — ideal for horizontal scaling
- Portable across services and domains

**Cons:**
- Token revocation is complex and usually requires a hybrid approach (blacklist in Redis)
- No real-time visibility into active sessions

**A practical hybrid:** Use stateful authentication for web browsers (where `HttpOnly` cookies work naturally and revocation is important) and stateless JWTs for mobile apps and third-party API integrations (where cookies are not a native concept and scalability matters more).

### 3. API Key Authentication

The stateful and stateless approaches both involve some human interaction — login forms, credential entry, token storage in apps. API key authentication is designed for a different use case: **machine-to-machine communication**.

**How it works:**
1. A user generates a cryptographically random API key through a platform's UI
2. That key is stored securely in an environment variable on the calling server
3. The calling server includes the key in requests to the target API (typically in a header)
4. The target server validates the key and authorizes access based on the configured permissions

**Why it exists:** Consider building a feature that uses OpenAI's models. Your backend server does not log in with a username and password — there is no human sitting there to type credentials. Instead, your server holds an API key, and every request to their API carries that key. The target server uses it to identify your account, check your plan, track your usage, and enforce rate limits.

**Best for:** Server-to-server communication, programmatic access to APIs, single-purpose integrations.

**Advantages:** Easy to generate, easy to rotate, can be scoped to specific permissions and expiry dates.

### 4. OAuth 2.0 and OpenID Connect

#### The Delegation Problem

As platforms multiplied, a new problem emerged: one application needing access to resources on another. A travel app wanting to scan your Gmail for flight tickets. A social media app wanting to import your Google contacts. The first solution people tried was sharing passwords directly — which was a disaster. Sharing your Google password meant giving full, unrestricted access to everything, with no way to limit scope and no way to revoke access without changing your password everywhere.

#### OAuth 2.0: Solving Authorization via Delegation

OAuth 2.0 (formalized around 2010) solved this by replacing password sharing with token sharing. The token carries specific, limited permissions rather than full account access.

The four actors in OAuth:
- **Resource owner** — the user who owns the data
- **Client** — the app requesting access (e.g., a travel app)
- **Resource server** — the server holding the resources (e.g., Gmail's servers)
- **Authorization server** — the server that authenticates the user and issues tokens (e.g., Google's auth server)

**The Authorization Code Flow (the most common):**
1. The client redirects the user to the authorization server
2. The user logs in and grants specific permissions (e.g., "read contacts")
3. The authorization server sends an authorization code to the client
4. The client exchanges the code for an **access token**
5. The client uses the access token to call the resource server on the user's behalf

The access token only carries the permissions the user granted — not full account access. The user can revoke it without changing their password.

OAuth 2.0 also defines flows for different contexts:
- **Authorization Code Flow** — for server-side apps
- **Implicit Flow** — historically for browser-based apps, now discouraged due to security risks
- **Client Credentials Flow** — for machine-to-machine communication with no user involved
- **Device Code Flow** — for devices with limited input (e.g., Smart TV authentication)

#### OpenID Connect (OIDC): Adding Identity on Top of OAuth

OAuth 2.0 solved authorization — granting limited access to resources. But it did not solve authentication — confirming *who* the user is. An app with only an access token can call APIs on the user's behalf but does not know the user's name, email, or identity.

OpenID Connect (introduced around 2014) is built on top of OAuth 2.0 and adds an **ID token**: a JWT containing the user's identity information — their user ID, name, email, when they authenticated, and who issued the token.

This is exactly what powers "Sign in with Google." When you click that button:
1. The platform redirects you to Google's authorization server
2. You log in with your Google credentials and grant permissions
3. Google sends back an authorization code and an ID token
4. The platform exchanges the code for an access token
5. The ID token's JWT payload gives the platform your name, email, and Google user ID
6. The platform creates or looks up your account using that identity — no separate password needed

Together, OAuth 2.0 and OpenID Connect transformed the internet from a world of password sharing into a structured, permission-based ecosystem where applications can integrate securely without users ever exposing their credentials.

## When to Use Which

| Use case | Auth type |
|---|---|
| Web app, user sessions, SaaS | Stateful (session-based) |
| APIs, microservices, mobile apps | Stateless (JWT) |
| Machine-to-machine communication | API keys |
| Third-party login, cross-platform access | OAuth 2.0 + OpenID Connect |

In practice, you will use stateful and stateless authentication most often. Both have trade-offs, and a hybrid approach — stateful for browsers, stateless for APIs — is common in real systems.

In [Part 3]({{ '/authentication-for-backend-engineers-part-3-authorization-rbac-and-security-practices/' | relative_url }}), we cover authorization, role-based access control, secure error messages in auth flows, and timing attacks.

Happy hacking!
