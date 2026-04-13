---
type: post
title: "Concurrency and Parallelism for Backend Engineers: IO-Bound vs CPU-Bound"
date: 2026-03-28 10:00:00 +0300
categories:
  - backend
  - performance
---

Every backend system you will ever build has one fundamental requirement: it must handle multiple things at once. A web server that can only process one request at a time is not a web server — it is a queue that forces thousands of users to wait for each other. Understanding how your server handles this concurrently, and the mechanical reasons behind it, shapes every architectural decision you will make.

This post builds that mental model from the ground up.

## The Problem: Your CPU Is Mostly Idle

Consider a typical API call. It receives a request, runs some validation, queries a database, possibly calls an external service, and sends a response.

Now focus on one specific slice of that: the time between sending a query to the database and receiving the response.

- On localhost: ~1–2 milliseconds
- Database in a different availability zone: ~20–30 milliseconds
- Database in a different region: ~90–100 milliseconds

During that wait, what is your server doing? Nothing. The CPU sits completely idle.

To understand how much waste that represents: a modern CPU can execute roughly 3 billion instructions per second — 3 million per millisecond. If your server is waiting 100 milliseconds for a database response, it could have executed **300 million instructions** instead. It executed zero.

Scale that up to a realistic API call:

- 3–5 database queries
- 1–2 calls to external services (email, cache, webhooks)
- Each network operation averaging ~50ms of wait time

Total time waiting for IO: ~250 milliseconds. Total time actually using the CPU: ~10 milliseconds. Your server's hardware was idle **95% of the time**.

This is the problem concurrency solves.

## IO-Bound vs CPU-Bound

Before getting into solutions, it helps to name the two categories of work your server does.

**IO-bound** work is anything where the CPU is waiting for an external response: [database queries]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }}), HTTP calls to external APIs, file reads and writes, [cache interactions]({{ '/caching-the-secret-behind-it-all/' | relative_url }}), logging to a remote service. The CPU cannot make progress until the response arrives — it is bound by input/output latency.

**CPU-bound** work is anything where the CPU is actively computing: parsing JSON, running validation logic, encrypting or signing tokens (like JWTs), image processing, compression, matrix operations. The CPU is the bottleneck — you are bound by raw processing speed.

In a typical backend application, **70–90% of the work is IO-bound**. The CPU is mostly waiting, not computing. The implications of this distinction are significant, and we will come back to them.

## Concurrency vs Parallelism

These two terms are frequently conflated. They are related but distinct.

**Parallelism** means executing multiple instructions at the exact same moment in time. This requires hardware support — at minimum, two CPU cores. One core, one instruction per moment. Two cores, two instructions simultaneously. Parallelism is about *doing* multiple things at once.

**Concurrency** means *dealing with* multiple things at once, even if you are only *doing* one at any given moment. Concurrency is about how you structure your program — starting a task, suspending it while it waits for IO, switching to another task, coming back when the first one's response arrives. A single CPU core can achieve concurrency through this interleaving.

The clearest way to see the difference is through a timeline.

### A Concurrent Timeline (1 CPU core)

Requests A and B arrive simultaneously. The server has one core.

- **0–5ms**: Request A gets CPU time. Runs validation, routing, parses the request body.
- **5ms**: Request A sends a database query. It no longer needs the CPU — it is waiting for IO.
- **5–20ms**: Request B gets the CPU. Runs its own processing.
- **20ms**: Request B also sends a database query. It too waits for IO.
- **40ms**: The database responds to Request A. It is marked runnable again.
- **50ms**: Request A gets the CPU back. Processes the response, returns to client.
- **50ms+**: Request B's database response arrives. It gets the CPU, finishes, returns to client.

From the client's perspective, both requests were in progress simultaneously. From the CPU's perspective, only one was running at any given moment. That is concurrency.

### A Parallel Timeline (2 CPU cores)

Same scenario, but with two cores. Request A starts on core 1 at 0ms. Request B starts on core 2 at the same moment. Both are genuinely executing at the same time — not interleaved, but simultaneous. That is parallelism.

## Why This Distinction Matters

**For IO-bound work: concurrency is the solution.**

The bottleneck is not the CPU — it is the waiting. Concurrency lets the CPU stay busy processing other requests while any given request waits for its database query or external API call to complete. You can achieve meaningful concurrency even with a single core, because the CPU is rarely the constraint. Adding more cores helps, but the limiting factor is IO latency, not CPU capacity.

**For CPU-bound work: parallelism is the solution.**

The bottleneck is the CPU itself. If you are processing video frames, running encryption, or doing heavy computation, you want to use every available core simultaneously. Concurrency helps here too — you can interleave multiple CPU-bound tasks — but you will not get a true speedup unless multiple cores are running in parallel.

In practice, most backend applications are IO-bound. Unless you are doing video encoding, cryptographic operations at scale, or heavy data processing, your CPU is not the limiting factor. Design for concurrency first.

## How Computers Actually Do Multiple Things: Threads

All concurrency primitives in every programming language — Go's goroutines, JavaScript's async/await, Java's virtual threads, Python's asyncio — build on two underlying mechanisms: **threads** and **event loops**. Threads first.

### What a Thread Is

A thread is an independent unit of execution managed by the operating system. When the OS creates a thread, it allocates:

- **A stack** — stores function call history and local variables. On Linux, the default stack size is 8MB per thread (mostly virtual memory, allocated lazily, but the limit is there).
- **An instruction pointer** — tracks exactly where in the code the thread is currently executing, so it can be resumed after being paused.

### Preemptive Scheduling

The OS scheduler controls which thread runs and for how long. It assigns each thread a time slice — typically a few milliseconds — then preempts it (pauses it, saves its state) and switches to the next thread. This happens whether the thread wants it to or not. That is what "preemptive" means: the OS is in control, not the program.

When a thread encounters a blocking IO operation — a database call, a network request, a file read — it tells the OS: "I'm waiting for IO and cannot use the CPU right now." The OS marks that thread as **blocked**, switches to another runnable thread, and only returns the blocked thread to the scheduler queue once its IO operation completes.

This is how a server handles thousands of simultaneous requests with OS threads: most threads are blocked waiting for IO at any given moment, while the scheduler keeps the CPU busy with the threads that are ready to run.

### Threads Share Memory Within a Process

Every running program is a **process**. Threads within the same process share the process's memory — specifically the heap, global variables, and any dynamically allocated data structures.

If thread A allocates an object and stores its address, thread B can access that object directly via the same pointer, with no copying or serialization involved. This makes inter-thread communication very fast.

But shared memory is also the primary source of concurrency bugs. If two threads read and modify the same data simultaneously without coordination, you get race conditions — one thread's write can corrupt another thread's in-progress operation. Dealing with shared mutable state correctly requires locks, mutexes, or other synchronization primitives, which introduce their own complexity and potential for deadlocks.

Threads from different processes are fully isolated. Process A's threads cannot see Process B's memory. This isolation is enforced by the OS for security and stability.

### The Cost of Threads

Threads are not free:

- **Memory**: 8MB stack per thread. A server handling 10,000 concurrent connections with one thread per connection needs 80GB of stack space — clearly unworkable.
- **Context switch overhead**: Saving and restoring thread state (registers, stack pointer, instruction pointer) every time the scheduler switches between threads takes CPU time. At very high thread counts, the scheduler itself becomes a bottleneck.

This overhead is why languages like Go (goroutines) and Java (virtual threads, added in Java 21) introduced lightweight concurrency primitives that are managed by the language runtime rather than the OS. Instead of one OS thread per task, the runtime multiplexes thousands of lightweight tasks onto a smaller pool of OS threads, dramatically reducing memory and context switch costs.

## TDLR

Most backend application time is spent waiting for IO. Concurrency is what lets your server stay productive during that wait — not by doing two things simultaneously, but by switching to something useful whenever one task is blocked.

Parallelism is what lets CPU-bound work finish faster by genuinely executing on multiple cores at the same time.

For IO-bound backends (which is most backends), concurrency is the essential tool. Parallelism is a bonus when hardware is available. Understanding the difference tells you which knob to turn when performance problems arise — and why blindly adding CPU cores often does not fix a slow API that is bottlenecked on database round-trips.

When you are ready to go deeper on performance, [Backend Scaling and Performance Engineering Part 1]({{ '/backend-scaling-and-performance-engineering-part-1-mental-models/' | relative_url }}) builds on these foundations with latency percentiles, throughput, utilization curves, and bottleneck identification.

Happy hacking!
