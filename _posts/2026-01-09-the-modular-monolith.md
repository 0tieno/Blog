---
type: post
title: The Modular Monolith — The Architecture Nobody Talks About
date: 2026-01-09 09:00:00 +0300
categories:
  - system design
  - Monolith vs Microservices series
---

Software architecture discussions often feel polarized.

You’re told to either:

Stick with a monolith and suffer later, or

Jump to microservices and "do it right"

But there is a powerful, practical architecture that lives quietly in between — and it’s the one most successful systems evolve into first.

The modular monolith is not a compromise. It is a deliberate design choice.

## What Is a Modular Monolith?

A modular monolith is:

- One deployable application
- One runtime
- One database (usually)
But internally:

- Clear domain-based modules
- Strong boundaries
- Explicit interfaces
- Minimal shared state

From the outside, it looks like a monolith. From the inside, it behaves like a set of well-disciplined services.

## Why Most Monoliths Fail (And This One Doesn’t)

Most monoliths fail because:

- Boundaries are implicit
- Modules reach into each other’s internals
- The database becomes a shared dumping ground

A modular monolith enforces:
- Dependency direction
- Encapsulation
- Domain ownership

Change stays local.

## The Core Principles of a Modular Monolith
1. Domain-Driven Boundaries

Modules are organized around business capabilities, not technical layers.

Examples:

- Identity
- Billing
- Orders
- Notifications
Not:

- Controllers
- Services
- Repositories

2. Explicit Module Interfaces

Modules communicate through:

- Public APIs
- Contracts
- Events (even internally)
- Direct access to internal classes is forbidden.
This forces discipline early.

3. Independent Evolution

Each module:

- Can be developed independently
- Has its own tests
- Has clear ownership
- Teams think in terms of products, not files.

4. Controlled Data Access

The most important rule:

A module owns its data.

Other modules interact through APIs, not direct database access.

This single rule prevents most architectural decay.

## Why Modular Monoliths Are So Powerful

1. Simplicity Without Naivety

You avoid:

- Network failures
- Distributed tracing
- Operational overhead

Yet still gain:

- Clear boundaries
- Safer refactoring
- Predictable change

2. Performance by Default

- In-process calls
- Shared memory
- No serialization overhead
You get microservice-like structure with monolith-level performance.

3. The Best Migration Story
A modular monolith is microservices-ready by design.

When the time comes:

- Extract one module at a time
- Replace in-process calls with network calls
- Leave the rest untouched

No big rewrite.

## Why Nobody Talks About This Architecture

Because:

- It’s not trendy
- It’s harder to explain in a diagram
- It requires discipline, not tooling
- There’s no conference talk titled:

“How We Successfully Did Nothing Fancy”

But that’s exactly why it works.

## Final Thought

The modular monolith is the architecture of grown-up teams.

It respects complexity, controls change, and delays distribution until it is truly necessary.

Next, we’ll conclude this series by answering the most important question of all:

When are microservices actually worth it?

Happy Architecting!