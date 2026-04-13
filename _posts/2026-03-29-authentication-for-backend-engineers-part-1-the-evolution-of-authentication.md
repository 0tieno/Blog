---
type: post
title: "Authentication for Backend Engineers Part 1: The Evolution of Authentication"
date: 2026-03-29 10:00:00 +0300
categories:
  - backend
  - security
---

Authentication and authorization are among the most fundamental topics in backend engineering, and they are also among the most misunderstood. These are workflows you encounter every single day — every login screen, every "Sign in with Google" button, every API key in a `.env` file is an implementation of these concepts.

Let's start with the simplest possible definition of each:

**Authentication** answers the question: *who are you?* It is the mechanism that assigns an identity to a subject in a given context — a platform, an operating system, a device.

**Authorization** answers the question: *what can you do?* It is the process of determining what permissions and capabilities an authenticated identity has in a given context.

These two questions are different, and conflating them leads to serious security gaps. Authentication confirms identity. Authorization determines access. You need both.

Understanding how authentication evolved helps explain why the modern systems work the way they do.

## A Brief History of Authentication

Understanding how authentication evolved helps explain why the modern systems work the way they do.

### Pre-Industrial Era: Implicit Trust

In pre-industrial societies, identity was tied to recognition. A respected village elder could vouch for someone. Deals were sealed with a handshake. This was authentication based on human contextual trust. It worked within tight communities, but it could not scale. The elder was not known or trusted beyond the village.

### Medieval Era: Seals and the First Tokens

As populations grew, society needed authentication that could function independently of any particular person's reputation. The solution was the wax seal — a unique physical pattern pressed into documents to act as a signature. These were the first widely adopted authentication *tokens*, based on the principle of *something you have*: if you possess the seal, you can authenticate yourself.

Seals had vulnerabilities — they could be forged. Forgery was the first recorded authentication bypass attack, and it drove the evolution toward watermarks and encrypted codes, laying the foundation for cryptographic thinking.

### Industrial Revolution: Passphrases and Shared Secrets

The telegraph became critical infrastructure during the Industrial Revolution. Operators needed secure message validation and began using pre-agreed passphrases — effectively static passwords. The authentication principle shifted from *something you possess* to *something you know*: a secret stored in memory rather than carried as an object.

### The 1960s: The Birth of Digital Authentication

In 1961, researchers at MIT's Project MAC introduced passwords for multi-user systems on the Compatible Time-Sharing System (CTSS). They wanted multiple users to use the same computer without sharing each other's data. Their initial implementation stored passwords in plain text — which turned out to be a critical vulnerability. The moment this became apparent (when someone printed the password file), the incident triggered the search for secure password storage. That search led to **hashing**: a cryptographic function that transforms a plain text password into a fixed-length, irreversible string. The same input always produces the same hash, but you cannot derive the original password from the hash. This principle drives how passwords are stored today.

### The 1970s: Asymmetric Cryptography

Whitfield Diffie and Martin Hellman's invention of the Diffie-Hellman key exchange introduced asymmetric cryptography — the ability for two parties to establish a shared secret over an untrusted medium. Asymmetric cryptography became the backbone of modern authentication protocols and Public Key Infrastructure (PKI). This era also saw the rise of Kerberos, which introduced ticket-based authentication and trusted third parties to issue tickets — a precursor to the token-based systems we use today.

### The 1990s: MFA

As the internet grew, simple username-password systems proved insufficient against brute force and dictionary attacks. Multi-Factor Authentication (MFA) emerged, combining multiple principles:
- *Something you know* — passwords, PINs
- *Something you have* — OTP generators, smart cards
- *Something you are* — biometrics (fingerprints, retina scans)

Combining these layers significantly raised the cost of attacking an authentication system.

### The Modern Era

The rise of cloud computing, mobile devices, and API-based architectures demanded more advanced frameworks. The most important modern authentication technologies are OAuth 2.0, OpenID Connect, and JWTs — all of which we will cover in this post.

Looking ahead, **post-quantum cryptography** is an active area of research. Quantum computers, when they become widely available, are expected to break the public-key cryptographic algorithms we rely on today (RSA, elliptic curve). Post-quantum cryptography aims to design algorithms that remain secure even against quantum computation. Decentralized identity (using blockchain) and behavioral biometrics are also emerging candidates.

In [Part 2]({{ '/authentication-for-backend-engineers-part-2-sessions-jwts-and-the-four-auth-types/' | relative_url }}), we get into the technical mechanics: sessions, JWTs, cookies, and the four authentication types backend engineers use.

Happy hacking!