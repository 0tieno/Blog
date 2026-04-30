---
type: post
title: "Authentication and Authorization: Knowing Who They Are and What They Can Do"
date: 2026-04-28 10:00:00 +0300
categories:
  - backend
  - system design
  - interviews
  - security
---

Most developers mix these up. Authentication and authorization are two separate steps, and confusing them leads to insecure systems and confused interview answers.

**Authentication:** Who are you? (Identity verification)

**Authorization:** What can you do? (Permission enforcement)

A user must be authenticated before they can be authorized. You cannot decide what someone is allowed to do if you do not know who they are.

## Part 1: Authentication Methods

Authentication answers one question: is this user who they claim to be?

### Basic Authentication

The simplest possible method. The client sends a username and password encoded in Base64 with every request.

```
GET /api/users HTTP/1.1
Authorization: Basic am9objpwYXNzd29yZDEyMw==
```

That Base64 string decodes to `john:password123`. Base64 is encoding, not encryption. Anyone who intercepts this request can decode the credentials instantly.

**Why it still exists:** Internal tools behind VPNs, quick prototypes, or machine-to-machine calls where simplicity trumps security. Never use it for user-facing production systems unless wrapped in HTTPS.

### API Key Authentication

The server generates a unique string for each client. The client includes it in every request.

```
GET /api/products HTTP/1.1
X-API-Key: sk_live_a1b2c3d4e5f6g7h8i9j0
```

On the server side, the API key is looked up in a database to identify the client and their permissions.

**Important distinction:** API keys are random strings with no embedded information. The server must hit the database on every request to validate the key and look up the associated user/permissions. This is a key difference from JWTs.

**Weaknesses:**

- If the key leaks, anyone can use it until you manually revoke it
- No built-in expiration (you have to implement rotation yourself)
- Keys are often accidentally committed to Git repositories, logged in plaintext, or shared in Slack messages

**Where you see API keys in the wild:** Stripe, OpenAI, Twilio, AWS. They are standard for service-to-service authentication where a human is not logging in interactively.

### Session-Based Authentication

The traditional web authentication model. The user logs in once with credentials. The server creates a session, stores it in a session store, and sends a session ID back as a cookie.

```
1. Client sends: POST /login { "email": "john@email.com", "password": "..." }
2. Server validates credentials
3. Server creates session in session store (Redis, database, memory)
4. Server responds with: Set-Cookie: session_id=abc123; HttpOnly; Secure
5. All future requests include the cookie automatically
6. Server looks up session_id in session store on each request
```

**Session storage options:**

| Storage | Pros | Cons |
| --- | --- | --- |
| In-memory | Fastest | Lost on server restart. Not shared across instances. |
| Redis | Fast, supports TTL (auto-expiration), shared across servers | Extra infrastructure to manage |
| Database | Persistent, queryable | Slower, adds load to your database |

**The scalability problem:** Sessions are stateful. The server must remember every active session. If you have 3 API servers behind a load balancer, the session created on Server 1 does not exist on Server 2 unless you use a shared session store like Redis.

This is called the "sticky session problem." You either need all of a user's requests to go to the same server (IP hash load balancing) or all servers need access to a shared session store.

### JWT (JSON Web Tokens)

JWTs changed the game by making authentication stateless. A JWT is a signed JSON object that carries the user's identity and claims. The server does not need to store anything.

**JWT structure (three parts, separated by dots):**

```
Header.Payload.Signature

eyJhbGciOiJIUzI1NiJ9.eyJ1c2VyX2lkIjoiNDIiLCJyb2xlIjoiYWRtaW4iLCJleHAiOjE3MTM1MDAwMDB9.signature_here
```

**Decoded payload:**

```json
{
  "user_id": "42",
  "role": "admin",
  "exp": 1713500000
}
```

**How it works:**

```
1. Client sends credentials: POST /login
2. Server validates credentials
3. Server generates JWT with user_id, role, expiration, signs it with a secret key
4. Client stores the JWT
5. Client sends JWT with every request: Authorization: Bearer eyJ...
6. Server verifies the signature locally (no database lookup needed)
7. If valid and not expired, request is authorized
```

**Why JWTs are stateless:** The token itself contains all the information the server needs. No session store, no database lookup. The server just verifies the cryptographic signature to confirm the token was issued by the server and has not been tampered with.

**The critical tradeoff:** You cannot easily revoke a JWT before it expires. With sessions, you can delete the session from Redis and the user is immediately logged out. With JWTs, the token is valid until it expires. This is why JWTs should have short expiration times (15 minutes to 1 hour).

### Access Tokens and Refresh Tokens

Modern systems use a two-token pattern to balance security with user experience:

**Access token:** Short-lived (15 min to 1 hour). Used for API calls. If compromised, the damage window is small.

**Refresh token:** Long-lived (days to weeks). Used only to get new access tokens. Stored securely in an HttpOnly cookie (inaccessible to JavaScript, preventing XSS attacks).

```
Login Flow:
1. User logs in → Server returns access token + refresh token
2. Client uses access token for API calls
3. Access token expires → API returns 401
4. Client sends refresh token to /auth/refresh
5. Server validates refresh token → issues new access token
6. Client continues with new access token

The user never has to log in again until the refresh token expires.
```

**Why HttpOnly cookies for refresh tokens:** If you store tokens in localStorage, any JavaScript on the page can read them. An XSS vulnerability (injected script) could steal the token and impersonate the user. HttpOnly cookies are invisible to JavaScript. The browser sends them automatically, but scripts cannot access them.

### OAuth 2.0: Delegated Authorization (Not Authentication)

This is the most misunderstood concept in auth. **OAuth 2.0 is an authorization framework, not an authentication method.** It answers: "what can this app access on behalf of the user?"

**Real example: Connecting a deployment platform to your GitHub**

```
1. You click "Connect GitHub" on the deployment platform
2. You are redirected to GitHub's consent screen
3. GitHub shows: "This app wants to read your repositories. Allow?"
4. You click Allow
5. GitHub sends an authorization code back to the deployment platform
6. The platform exchanges the code for an access token
7. The platform uses that token to read your repos via GitHub's API
```

The access token proves the app can access your repositories. But it does not tell the app who you are. It does not contain your email, name, or GitHub username. It is purely about resource access.

### OpenID Connect (OIDC): Authentication on Top of OAuth 2.0

OIDC adds an identity layer. When you click "Sign in with Google," here is what actually happens:

```
1. You click "Sign in with Google"
2. You are redirected to Google's login page
3. You enter your Google credentials
4. Google returns an authorization code
5. Your app exchanges the code for:
   - Access token (OAuth 2.0, for accessing Google APIs)
   - ID token (OIDC, a JWT containing your identity: email, name, user ID)
6. Your app verifies the ID token signature
7. Your app extracts your identity and creates a local session
```

The ID token is the authentication piece. It is a JWT that tells your app who the user is. The access token is the authorization piece that lets your app access Google services on the user's behalf.

**This is the modern standard.** When you see "Sign in with Google/GitHub/Apple," it is OIDC doing the authentication and OAuth 2.0 handling the authorization underneath.

### Single Sign-On (SSO)

SSO is a user experience pattern, not an authentication method. It means logging in once and getting access to multiple services.

**Example: Google SSO**

You log in to Google once. Now you have access to Gmail, Google Drive, YouTube, Calendar, and Docs without logging in again to each service. Under the hood, a global session is created with Google's identity provider, and each service validates against that session.

**SSO uses identity protocols underneath:**

**SAML (Security Assertion Markup Language):** XML-based, used heavily in enterprise and legacy systems (Salesforce, corporate dashboards). The identity provider returns a SAML assertion (an XML document) confirming your identity.

**OpenID Connect:** JSON/JWT-based, the modern approach. Used by Google, Microsoft, GitHub, and most consumer-facing services.

### Passkeys and Multi-Factor Authentication

Everything above covers the first factor: proving your identity once. Modern systems add a second factor (something you have or something you are) to protect against stolen credentials. This includes TOTP codes from authenticator apps (Google Authenticator, Authy), push notifications (Duo, Microsoft Authenticator), hardware security keys (YubiKey), and the newest approach: passkeys.

Passkeys are the most important shift in authentication in years. Built on the FIDO2/WebAuthn standard, they use public-key cryptography so that no shared secret ever crosses the network. The private key stays on your device, the server only stores your public key, and the credential is cryptographically bound to the domain, making passkeys fully phishing-proof. Apple, Google, and Microsoft all support passkeys natively, and major services (GitHub, Google, Amazon) are actively rolling them out.

These topics (TOTP, push auth, passkeys, SMS OTP tradeoffs, MFA fatigue attacks, and implementation details) are covered in depth in the companion file: **06b - Multi-Factor Authentication**.

## Part 2: Authorization Models

Once you know who someone is, you need to decide what they can do.

### Role-Based Access Control (RBAC)

Users are assigned roles. Roles have permissions. This is the most common model.

```
Role: Admin
  Permissions: create, read, update, delete, manage_users

Role: Editor
  Permissions: create, read, update

Role: Viewer
  Permissions: read
```

**Example: A CMS**

```
User "Alice" has role "Admin"
  → Can create posts, edit any post, delete posts, manage other users

User "Bob" has role "Editor"
  → Can create posts, edit posts. Cannot delete or manage users.

User "Carol" has role "Viewer"
  → Can read posts. Cannot create, edit, or delete anything.
```

**Strengths:** Simple to understand, implement, and audit. Works well when permissions map cleanly to job functions.

**Weakness:** Becomes rigid with complex permission requirements. "Editors can edit any post" might be too broad. What if Bob should only edit posts in the Sports category?

### Attribute-Based Access Control (ABAC)

Instead of fixed roles, access decisions are based on attributes of the user, the resource, and the environment.

```
Policy: Allow access if:
  user.department == "engineering"
  AND resource.classification == "internal"
  AND environment.time is within business hours
  AND user.clearanceLevel >= resource.requiredClearance
```

**More flexible than RBAC** because you can express fine-grained rules. But more complex to implement, test, and debug. Policy conflicts are common and hard to detect.

**Where it fits:** Government systems, healthcare (access based on patient relationship), financial systems with complex compliance requirements.

### Access Control Lists (ACL)

Each resource has its own list of who can access it and what they can do.

```
Document: "Q3 Financial Report"
  - Alice: read, write
  - Bob: read
  - Carol: no access
  - David: read, write, share
```

**You use this every day.** Google Docs sharing is an ACL. When you click "Share" and add someone with "Editor" or "Viewer" access, you are editing the ACL for that document.

**Strengths:** Extremely granular. Perfect for systems where access varies per resource (file systems, document sharing, repository permissions).

**Weakness:** Does not scale easily. If you have millions of documents and millions of users, managing individual ACLs becomes unwieldy. Often combined with RBAC (default permissions from roles, with per-resource overrides via ACL).

## Interview Framework: Auth Questions

When asked about auth in an interview, demonstrate that you understand the full picture:

1. **Authentication method:** "Users authenticate via OIDC (Sign in with Google/GitHub). The server receives an ID token, verifies it, and creates a local session with a short-lived JWT access token and a longer-lived refresh token stored in an HttpOnly cookie."
2. **Multi-factor authentication:** "I would support passkeys as the primary passwordless option (phishing-proof, no shared secrets). For users who have not adopted passkeys yet, TOTP via authenticator apps is the second factor. SMS OTP is available only as a last-resort fallback because of SIM swap and interception risks."
3. **Authorization model:** "I would use RBAC for the base permissions (admin, editor, viewer) and layer on resource-level ACLs where needed (e.g., per-project permissions)."
4. **Token strategy:** "Access tokens expire in 15 minutes. Refresh tokens expire in 7 days. The refresh token is rotated on each use (the old one is invalidated when a new one is issued)."

This answer covers identity verification, second-factor protection, permission enforcement, and the token lifecycle, which are the four pillars of a secure auth system.

## Related Post

- [Multi-Factor Authentication: Passkeys, TOTP, Authenticator Apps, and Two-Step Verification](/Blog/multifactor-authentication/) — A deep dive into every modern MFA method and the tradeoffs between them.

Happy hacking!