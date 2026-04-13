---
type: post
title: "Backend Security Part 2: Authentication, Authorization, and Defense in Depth"
date: 2026-04-06 11:00:00 +0300
categories:
  - backend
  - security
---

This is Part 2 of the backend security series. [Part 1]({{ '/backend-security-everything-you-need-to-know/' | relative_url }}) covered the security mindset, injection attacks, and parameterized queries.

Here we cover authentication, password storage, sessions, JWTs, authorization vulnerabilities, XSS, CSRF, and how to think in layers. For a deeper history of how authentication evolved and an overview of all four auth types, see [Part 1 of the authentication series]({{ '/authentication-for-backend-engineers-part-1-the-evolution-of-authentication/' | relative_url }}).---

### Authentication: Build or Buy

Authentication — verifying who the user actually is — is easy to get 60 percent right and very difficult to get 99.9 percent right. If you get it wrong, attackers can impersonate users, access private data, take actions on their behalf, and steal money.

If you have the budget, use a third-party auth provider. Not because you cannot implement auth yourself, but because the full scope of what "authentication" means in production is much larger than it first appears:

- **Stateful auth** means tracking all active sessions across all devices, with the ability to revoke any session immediately — that alone involves databases, [caches like Redis]({{ '/caching-the-secret-behind-it-all/' | relative_url }}), expiry logic, and device management
- **Social login** (Sign in with Google, Sign in with GitHub) requires implementing OAuth flows on both frontend and backend with redirect mechanics
- **Account linking** means handling the case where a user signs up with email and later tries to sign in with Google using the same email — these must be recognized as the same account
- **Edge cases around token rotation, session timeouts, compromised accounts**, and concurrent logins add more surface area

Modern auth providers like Clerk handle all of this with an API key and a few lines of config. Their entire business is security — they have dedicated teams thinking about attack vectors around the clock and patching new vulnerabilities as they emerge. Paying for that service when you are starting out almost always makes more sense than spending weeks building it yourself.

That said, even when you use a provider, you need to understand what is happening underneath — so you can configure it correctly and recognize when something is wrong.---

### Password Storage

Even with a third-party auth provider, you will likely deal with passwords at some point. How you store them matters enormously.

**Plain text — never do this**

The naive approach is storing the user's password as a string in your database. The moment your database is breached — and breaches happen across companies of all sizes, for many reasons — those passwords are exposed in full.

This is worse than it sounds. More than 70% of internet users reuse the same email and password combination across multiple sites. An attacker who gets your users' credentials can immediately run them against banks, e-commerce platforms, social media, and payment services. The user might not even know until significant damage is done.

**Hashing**

Hashing is a one-way mathematical function. You feed in any string of any length, and you always get back a fixed-length output. The same input always produces the same output. But you cannot reverse it — you cannot go from the output back to the input.

So instead of storing the password, you store the hash. When the user logs in, you hash what they type and compare it to the stored hash. If they match, the password is correct.

The problem: attackers know this. They have built **rainbow tables** — precomputed maps of common passwords and their hashes. `password123` hashes to some known string. `123456` hashes to another known string. When they breach your database and see those hash values, they just look them up.

**Salting**

The fix for rainbow tables is salting. For each user at signup, you generate a cryptographically random string — the salt. You concatenate the salt with their password before hashing. Store the salt alongside the hash in the database.

Now even if two users have the same password, their hashes look completely different because each salt is unique. An attacker's precomputed rainbow table becomes useless because the inputs to the hash function are all different.

**Slow hashing functions**

Salting defeats precomputed lookups, but modern GPUs can compute billions of SHA-256 or MD5 hashes per second. An attacker with your breached database can do offline brute-forcing: take each user's salt, try common passwords one by one, hash and compare. At billions of attempts per second, even salted hashes of simple passwords fall quickly.

The fix is to use hashing algorithms specifically designed to be slow: **Argon2id** (current industry standard), **bcrypt**, or scrypt. These algorithms have a cost factor you control — you can tune how much computation each hash requires. A setting that takes 400 milliseconds per hash is imperceptible to a real user logging in, but it reduces an attacker's offline brute-force from billions of attempts per second to only a handful per second. What could be cracked in days now takes decades.

Two resources worth reading: the [Lucia authentication library docs](https://lucia-auth.com/) (even though Lucia is no longer an auth library, it remains an excellent guide to the mechanics of secure authentication and current industry standards), and the [OWASP cheat sheet on password storage](https://cheatsheetseries.owasp.org/cheatsheets/Password_Storage_Cheat_Sheet.html).---

### Sessions

Once a user has authenticated, you cannot ask them to re-enter their password for every request. Sessions are how your server remembers that this user has already proven who they are.

**Stateful sessions (recommended)**

When a user successfully signs in:

1. The server generates a random session ID — a cryptographically secure pseudo-random string, ideally 128 to 256 characters long. This length is important: with 128 bits there are more possible session IDs than atoms in the observable universe, making guessing practically impossible.
2. The server stores this session ID in a database or cache (Redis for speed), alongside session metadata: which user this session belongs to, when it was created, when it expires, the user's IP address, and the user agent (so you can show "logged in from Chrome on Android" in the account settings).
3. The server sends the session ID to the client as a cookie.

For every subsequent request, the client automatically sends the cookie back. The server extracts the session ID, looks it up, finds the associated user, and knows who is making the request.

The major advantage of stateful sessions: **immediate revocation**. If an account is compromised, you delete the session row from the database. On the very next request, the session ID will not be found, and the user is logged out. This matters for real-world support scenarios.

**JWTs (stateless sessions)**

An alternative is the JWT (JSON Web Token). Instead of storing anything on the server, all session data is packaged into a token, cryptographically signed, and sent to the client. The client stores it and sends it with every request. The server verifies the signature and reads the claims directly from the token without a database lookup.

A JWT has three parts: a **header** describing the signing algorithm, a **payload** containing claims (user ID, issue timestamp, any custom fields like whether the user is an admin), and a **signature** generated by signing the header and payload with a secret key stored in the server's environment variables.

The signature prevents tampering: if anything in the header or payload is modified, the signature will no longer match, and the verification will fail.

One critical misunderstanding: the payload is **Base64 encoded, not encrypted**. Anyone can decode it and read its contents. Never put sensitive information inside a JWT — no passwords, no private keys, nothing you would not want a user to see.

**The main weakness of JWTs: revocation is hard**

With stateful sessions, revoking access is immediate. With JWTs, you cannot. The token exists on the client. You cannot force the client to delete it or stop using it. If a user's account is compromised, you cannot instantly log them out the way you can with sessions.

The community has come up with workarounds. One is a **token blocklist** — when a user needs to be revoked, you store their token (or user ID) in a blocklist in [Redis]({{ '/caching-the-secret-behind-it-all/' | relative_url }}) and reject any requests matching it. This partially reintroduces server-side state and overhead.

The other common approach is **short-lived access tokens paired with refresh tokens**. The access token expires in something like 5 minutes. The refresh token expires in 1 day or 7 days. When the access token expires (indicated by a 401 response), the client exchanges the refresh token for a new pair of tokens. If an attacker steals the access token, they only have a few minutes before it becomes useless. Without the refresh token, they cannot renew it.

**Which to use?**

Unless you have specific horizontal scaling requirements that make server-side session storage complex, prefer stateful sessions. The revocation story is clean, the architecture is simpler, and you avoid the token storage problem entirely. If you do use JWTs, store them in `HttpOnly` cookies (not localStorage), use short expiration times, and implement refresh token flows.---

### Cookie Security Flags

However you manage sessions, if you are storing auth tokens in cookies, three flags are critical:

- **`HttpOnly`**: Prevents JavaScript from reading the cookie. If your site has any XSS vulnerability (covered below), malicious scripts cannot steal the session token when this flag is set.
- **`Secure`**: The cookie is only sent over HTTPS connections, never plain HTTP. Without this, on any unencrypted network — a coffee shop WiFi, a public router — anyone observing traffic can see the cookie.
- **`SameSite`**: Controls whether the cookie is sent with cross-origin requests. `Strict` means the cookie is only sent when the request originates from your own domain. `Lax` allows top-level navigations (clicking a link to your site) but blocks cookies from being sent in subresource requests like images or iframes. `None` allows all cross-origin, but requires `Secure` to be set. Set this to `Strict` or `Lax` — never `None` for auth cookies. This setting is your primary defense against CSRF (discussed below).---

### Rate Limiting on Authentication

Without rate limiting, attackers can try millions of password combinations per minute against your login endpoint, either until they find a match or until your server collapses under the load.

Authentication endpoints need stricter limits than regular API endpoints. Apply multiple layers:

**Per-IP limiting** — cap login attempts per IP per minute. This stops basic automated attacks, but attackers using botnets, VPNs, or rotating proxies can bypass it.

**Per-account limiting** — lock an account after several consecutive failed attempts in a short window. This stops targeted attacks against a single account, but an attacker who tries one password across thousands of accounts will evade it.

**Global limiting** — a hard system-wide cap on how many login attempts your entire backend will process per minute. Even if an attacker rotates IPs and spreads attempts across accounts, they hit a ceiling. When that ceiling triggers, you raise an alert and can deploy responses — block the IP ranges, surface CAPTCHAs, investigate the pattern.

These three layers together make credential brute-forcing impractical.---

### Authorization Vulnerabilities

Authentication confirms who the user is. Authorization determines what they are allowed to do. This distinction matters because authentication can be solid while authorization is fundamentally broken.

**Broken Object Level Authorization (BOLA / IDOR)**

A very common pattern in codebases: the routing layer checks that the user is authenticated and has the `read_invoices` permission. Then in the service layer, a database query like this runs:

```sql
SELECT * FROM invoices WHERE id = $1
```

The problem: the user supplies the ID in the query parameter. They can change `5` to `17`, `18`, `101`, and so on — and retrieve invoices belonging to other users. The authorization check at the routing layer passed, but at the actual point of data access there is no ownership check.

The fix: add `AND user_id = $2` to the query, passing the user ID extracted from the authenticated session (never from the request body or query string).

```sql
SELECT * FROM invoices WHERE id = $1 AND user_id = $2
```

The session is server-controlled. The ID comes from the client. You trust the session; you verify against the ID.

**Information leakage: 404 vs 403**

When a user requests a resource they do not own, what response do you return?

A `403 Forbidden` tells the attacker "this resource exists, you just do not have access." It confirms that the ID is valid and something is there. An attacker can enumerate IDs — `5`, `6`, `7`, `8` — and by observing which return `403` versus `404` they can map out the existence of all your data.

A better pattern: write the query so that it includes the ownership check. If the query returns no rows — either because the ID does not exist or because it belongs to someone else — return a `404 Not Found`. The attacker cannot tell the difference between "that ID doesn't exist" and "that ID exists but is not yours."

**Sequential IDs also help attackers**

If your database uses auto-incrementing integer IDs (101, 102, 103), anyone can guess that 104 and 105 probably also exist. Using UUIDs as primary keys makes IDs unpredictable and not guessable. There are some performance trade-offs to consider with UUIDs, but for exposed resource identifiers they are worth it.

**Broken Function Level Authorization (BFLA)**

This is a different axis. Instead of accessing another user's data (horizontal), the attacker escalates their own privileges to access functions they should not be able to use (vertical).

A typical example: an `/admin/invoices` endpoint that returns all invoices in the system. The only "protection" is that this URL is not widely known. An attacker monitoring network traffic or digging through JavaScript bundles can find it. Once they do, if there is no role check on the endpoint, any authenticated user can call it.

The fix: a middleware that checks the user's role before the handler executes. This should not be buried inside the handler — it should be at the routing layer, enforced consistently.

**Categorizing authorization attacks**

Two useful categories to keep in mind:

- **Horizontal attacks**: a user accesses the resources of another user at the same privilege level (BOLA / IDOR)
- **Vertical attacks**: a user accesses functions or resources belonging to a higher privilege level, like admin endpoints (BFLA)

Both require the same operational fix: check authorization at the exact point of access, not just at the routing layer.

**Authorization principles**

Centralize your authorization logic — scattered checks get forgotten or applied inconsistently. Adopt a **default deny policy**: unless your authorization logic explicitly allows an action, it is blocked. When new endpoints or resources are added, they are protected by default until access is explicitly granted.

Write **automated tests specifically for authorization edge cases**: user A cannot access user B's resources, regular members cannot access admin functions, unauthenticated users cannot reach authenticated resources. These tests need to run on every code change. Manual verification will miss cases.

Add **audit logs** for sensitive operations. Every access to an admin endpoint, every failed authorization check — these should be recorded with a timestamp and user identity. Audit logs are how you detect an ongoing attack before it becomes a full breach.---

### Cross-Site Scripting (XSS)

XSS happens when an attacker's JavaScript code runs in another user's browser in the context of your platform.

Why is this dangerous? JavaScript running in a browser with your platform's context can:

- read everything on the page including sensitive displayed data
- read cookies and local storage if they are not `HttpOnly`-protected
- make API requests as the logged-in user
- redirect users to phishing pages
- alter the visible content of the page to impersonate your site

**How stored XSS works**

Say you have a comment system where users write markdown. Your backend converts it to HTML and stores it. Other users load the page and the HTML is injected into the DOM.

If a malicious user manages to inject a `<script>` tag into the stored HTML — for example by finding a way to bypass the markdown-to-HTML conversion — then every user who loads that page will execute the attacker's script. The script can send session cookies to the attacker's server, redirect the user to a phishing page, or capture keystrokes.

In React, the `dangerouslySetInnerHTML` attribute exists specifically to warn you that injecting arbitrary HTML into the DOM is your responsibility. The name is intentional.

**The fix: sanitize before storing**

When user-provided markup arrives at your server, sanitize it before saving to the database. Strip any structure that looks like it could be executable — especially `<script>` tags, event handler attributes (`onload`, `onclick`), and dangerous URLs (`javascript:`).

**Content Security Policy (CSP)**

CSP is an HTTP header your server sends back to the browser. It tells the browser what it is allowed to execute. You can specify:

- only run scripts from these specific domains
- no inline scripts at all
- images can only load from these origins

A CSP header set to block inline scripts entirely would have stopped the above attack — the injected `<script>` tag would have been blocked by the browser regardless.

But CSP is a last line of defense, not a prevention. The right order is: sanitize input properly first, then use CSP as a safety net in case something slips through.---

### CSRF (Cross-Site Request Forgery)

CSRF works by exploiting the fact that browsers automatically include cookies in requests to a domain, even when the request originates from a different site.

The classic scenario: you are logged into your bank. Your browser has a session cookie for `bank.com`. You visit `evil.com` — maybe through a phishing link. That page contains a form that auto-submits to `bank.com/transfer`. Since your browser sends the `bank.com` cookie along with the request, the bank's server sees it as a legitimate request from you and processes the transfer.

In modern applications, this attack is largely mitigated by the `SameSite` cookie flag discussed above. When `SameSite` is set to `Lax` or `Strict`, the bank cookie will not be sent for that cross-origin request. Modern browsers also default to `Lax` for cookies that do not specify `SameSite` explicitly.

CORS configuration adds another layer: your backend checks whether requests originate from your own frontend and rejects cross-origin requests that do not match.

CSRF is not a primary threat if you are using modern frameworks and proper cookie settings. But it is worth knowing why the mitigations exist.---

### Misconfiguration

Beyond active attacks, configuration mistakes create passive vulnerabilities that are just as dangerous.

**Secrets management**

API keys, database passwords, encryption keys, JWT secrets — none of these belong in your source code. The moment they land in a git commit, anyone with access to your repository can read them. Even if you delete the secret and push a new commit, it remains in the commit history.

Always use environment variables or a secret management service (AWS Parameter Store, HashiCorp Vault, etc.). If you accidentally commit a secret to your VCS, rotate it (generate a new one and revoke the old one) immediately — don't just delete it from the code.

**Debug logs in production**

In local development, running at `debug` log level is normal. Debug logging prints full stack traces, explicit SQL queries, database connection details, and sensitive user information to stdout. This is useful when you are writing code.

In production, your log level should be `info`. Debug-level output does not belong in production logs. If production logs are ever exposed or breached, they should not contain all of that internal architecture and user data detail.

**Security headers**

Your backend frameworks all have middleware packages that inject standard HTTP security headers with one line of configuration. Use them.

One example: `X-Frame-Options` prevents other sites from embedding your page inside an `<iframe>`. Without this, attackers can display your site in an iframe on their domain, overlay invisible UI elements, and capture your users' clicks or credentials — an attack called clickjacking.

CSP (mentioned above), strict transport security, and other security headers all fit in this category. Modern frameworks make these trivial to add.---

### Everything Reduces to Boundaries

Every vulnerability covered in this series — SQL injection, command injection, XSS, broken authorization, CSRF — has the same underlying shape: **data crossing a trust boundary in a way the developer did not account for.**

- SQL injection: user input crossed from the browser into the SQL query language
- Command injection: user input crossed into the shell interpreter
- XSS: user-provided content crossed into HTML and JavaScript execution context
- BOLA: a request crossed from one user's privilege domain into another user's resources

Every time you write code, ask yourself three questions:

1. Where is data crossing a boundary here?
2. What assumptions am I making about that data?
3. What if those assumptions are wrong?

If you ask these three questions consistently, you can avoid the vast majority of vulnerabilities that real backend applications suffer from.---

### Thinking in Layers

No single defense is perfect. The goal is to make your system resilient even when one control fails.

Chain protections so that to cause harm an attacker must bypass multiple layers simultaneously:

1. **Input validation** — every piece of external data is validated strictly before it reaches your handlers
2. **Parameterized operations** — database queries and process execution always separate structure from data
3. **Point-of-access authorization** — authorization checks happen at the actual database query, not just at the routing layer
4. **Security headers and policies** — CSP, SameSite cookies, frame options, HSTS configured and applied
5. **Monitoring and audit logs** — suspicious activity is recorded, alerts are raised, incidents can be investigated

Defense in depth is the professional standard. It is not about any single technique being perfect. It is about making the attack surface expensive enough that most attacks fail before they reach anything critical.---

### Where to Go Deeper

Two resources worth independently exploring:

**[PortSwigger Web Security Academy](https://portswigger.net/web-security)** — free, comprehensive labs on every category of vulnerability discussed here, plus many more: SQL injection, XSS, CSRF, SSRF, OAuth attacks, JWT attacks, clickjacking. You learn both the theory and the mechanics through hands-on exercises.

**[OWASP Top 10](https://owasp.org/www-project-top-ten/)** — a regularly updated list of the most critical web application vulnerabilities, with real-world examples and severity context. The **[OWASP Cheat Sheet Series](https://cheatsheetseries.owasp.org/)** goes deeper on specific topics like session management, authentication, and password storage. Both are free and extensively reviewed by security professionals.

These are not supplementary material — they are where most of the deep knowledge lives.The mindset and the vocabulary are here; the depth comes from continued reading.

That was a lot! lol! ...and i did not add screenshots.

Happy hacking!
