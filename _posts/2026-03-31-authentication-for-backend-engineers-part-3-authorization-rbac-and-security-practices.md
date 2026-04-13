---
type: post
title: "Authentication for Backend Engineers Part 3: Authorization, RBAC, and Security Practices"
date: 2026-03-31 11:00:00 +0300
categories:
  - backend
  - security
---

[Part 2]({{ '/authentication-for-backend-engineers-part-2-sessions-jwts-and-the-four-auth-types/' | relative_url }}) covered the mechanics of authentication — sessions, JWTs, cookies, and the four types of authentication (stateful, stateless, API keys, OAuth 2.0 + OIDC).

This post covers the other half: authorization (determining what an authenticated user is allowed to do), role-based access control, and two critical security practices that apply specifically to authentication flows.


## Authorization

Authentication confirms identity — it answers "who are you?" Authorization determines permissions — it answers "what can you do?"

You need both. A user can be perfectly authenticated and still be trying to access a resource they have no business touching. Authorization is what stops that.

### Why Authorization Is Needed

Consider a note-taking platform. A user signs up, logs in, and can create, edit, and delete their own notes. That is the standard user experience. But as the platform's creator, you also need to:

- Access all notes in a "Dead Zone" — a holding area for notes that users have deleted, kept for 30 days before permanently purging
- Perform administrative operations that regular users should never have access to

One approach is to hardcode a special string into your server and check for it in certain API routes. If the request contains that string, grant elevated access. This works for a single person, but it does not scale. What if you want to give the same elevated access to your team members? You issue them copies of the string. Now the string is in multiple places, and if any one of those people leaves or gets compromised, you have to rotate the string across all of them. The management burden grows linearly and the security surface grows with it.

What you actually need is a principled way to assign specific permissions to specific users. That is authorization.


## Role-Based Access Control (RBAC)

RBAC is the most widely used authorization model in backend systems. The idea is straightforward: instead of assigning permissions directly to individual users, you define roles, assign permissions to those roles, and assign roles to users.

**An example setup:**

| Role | Permissions |
|---|---|
| User | Read own notes, Write own notes, Delete own notes |
| Moderator | Read all notes, Write all notes |
| Admin | Read all notes, Write all notes, Access Dead Zone, Delete permanently |

Each role is a group of permissions. A user is assigned one or more roles. When an authenticated request comes in, the server reads the user's role (from the JWT payload or a database lookup) and decides whether the requested operation falls within that role's permissions.

If a user with the `user` role tries to access the Dead Zone endpoint, the server returns `403 Forbidden`. The user is authenticated — the server knows who they are — but they do not have the authorization to perform that action.

### How RBAC Works in the Request Cycle

The role check happens early in the request pipeline. In a typical backend, authentication middleware runs first: it validates the token, extracts the user ID and role, and attaches them to the request context. By the time the request reaches the actual handler or any downstream middleware, the user's role is already known. Subsequent code can simply read the role from context and gate access accordingly.

This pattern is important. The user's role should always come from the server-authoritative token or database — never from data the client sends in the request body. A malicious client could claim any role in a request body, but cannot forge a role in a signed JWT without knowing the server's secret key.

### RBAC in Multi-Tenant Architectures

RBAC becomes especially important in multi-tenant setups — platforms where users can create organizations and invite other users. In that context, an organization admin should be able to grant other members read-only or read-write access to specific resources within the organization. The RBAC model supports this: you define the roles (admin, member with write, member with read-only), map them to permissions on resources, and let admins assign those roles to other users in their organization.


## Security Best Practices in Authentication Flows

Two security practices that every backend engineer needs to know apply specifically to how authentication endpoints handle errors.

### 1. Use Generic Error Messages

During an authentication flow, there are several points where something can go wrong:
- The email does not exist in the database
- The email exists but the password is wrong
- The account is locked after too many failed attempts

The instinct is to be helpful: return specific messages like "User not found," "Incorrect password," or "Account locked." These messages are useful for legitimate users. They are also extremely useful for attackers.

Here is how an attacker exploits specific error messages on a login endpoint:

1. The attacker has a list of email addresses they want to test against your platform
2. They script requests with each email and an arbitrary password
3. For emails that do not exist, they get "User not found" — they move on
4. For an email that does exist, they get "Incorrect password" — they have confirmed a valid account
5. Now they have a valid email and shift strategy to brute-forcing or dictionary-attacking that account's password

Specific error messages turned what would have been a blind attack into a structured enumeration attack. The attacker now knows which emails are registered on your platform, which they can use for targeted credential stuffing, phishing, or further brute force.

**The fix is simple:** always return the same generic message regardless of what actually went wrong in the authentication check.

```
"Authentication failed"
```

or

```
"Invalid username or password"
```

Whether the email was not found, the password was wrong, or the account is locked — the response is identical. The attacker gets no information about which step failed. See the [OWASP Authentication Cheat Sheet](https://cheatsheetseries.owasp.org/cheatsheets/Authentication_Cheat_Sheet.html) for this and other authentication best practices.

This applies in authentication specifically. For other workflows — validation errors, business logic errors — you should absolutely send descriptive, user-friendly messages. The constraint is specific to authentication.

### 2. Defend Against Timing Attacks

A timing attack is more subtle, and it exploits how long your server takes to respond rather than the content of the response.

Here is why it happens. A typical login flow works like this:

1. Look up the user by email in the database
2. Check if the account is locked
3. Hash the provided password and compare it to the stored hash

Step 1 and 2 are fast. Step 3 — the password hash comparison — is intentionally slow. Modern password hashing algorithms (bcrypt, Argon2) are designed to be computationally expensive, making brute force attacks infeasible.

Now consider what happens in the two failure cases:

- **Email does not exist** → the server fails at step 1, returns immediately. Fast response.
- **Email exists but password is wrong** → the server runs through all three steps, including the slow hash comparison at step 3. Slower response.

An attacker can measure this difference. Even a few hundred milliseconds of difference in response time reveals whether the email exists or not — without any change in the response body. This is a timing side-channel attack. It lets an attacker enumerate valid email addresses the same way poorly-worded error messages do, but through timing measurement alone.

**Two defenses:**

**Constant-time operations** — cryptographic libraries expose constant-time comparison functions for password hashes. These functions are implemented so that execution time does not vary based on input values. Use them when comparing password hashes.

**Simulated delay** — add a fixed artificial delay to authentication responses regardless of where the flow fails. If every authentication response takes at least 300ms (by sleeping before responding when the flow fails early), the attacker cannot distinguish between step-1 failures and step-3 failures from timing alone.

Both defenses serve the same goal: equalize response times so that the server's internal logic is not visible through timing measurement.


## TDLR

Authentication and authorization are two questions every backend system must answer:

- **Authentication**: Who are you? Verified through sessions, JWTs, API keys, or OAuth + OIDC depending on the context.
- **Authorization**: What can you do? Enforced through RBAC — roles assigned to users, permissions assigned to roles, enforcement early in the request cycle.

The two security practices that apply specifically to authentication:

1. Never return specific error messages from auth endpoints — always use a generic failure message regardless of what failed
2. Equalize response times to prevent timing side-channel attacks — use constant-time comparisons and/or artificial delays

Getting these right significantly raises the cost of attacking your authentication system.

Happy hacking!
