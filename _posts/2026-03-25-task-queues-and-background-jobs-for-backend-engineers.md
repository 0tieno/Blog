---
type: post
title: "Task Queues and Background Jobs for Backend Engineers"
date: 2026-03-25 10:00:00 +0300
categories:
  - backend
---

Every backend you build will eventually have work it needs to do that is not part of answering a request. Sending a welcome email, resizing an uploaded image, generating a weekly report, cleaning up expired sessions — none of these need to happen while the user waits. Making them happen asynchronously, in a separate process, is what background jobs are for.

Understanding background jobs is foundational for building backends that are responsive, resilient, and scalable. This post walks through the concept, the mechanics, and the practical patterns.

## The Problem: Everything in One Request

The clearest way to understand background jobs is through a concrete example.

A user signs up on your platform. They submit their name, email, and password. Your server validates the input, hashes the password, writes the user record to the database, generates a verification code, and sends a verification email to the address they provided. The user sees: "We've sent a verification email — check your inbox."

That last step — sending the email — requires making an API call to a third-party email provider (Resend, Mailgun, Bravo, etc.). In a **synchronous** implementation, your server makes that API call inline, waits for the response, and only then returns the 201 to the user.

This creates two problems.

**Latency.** Your server is now blocked waiting for an external service. The user cannot proceed until that service responds. If the email provider is slow, your signup endpoint is slow. You have coupled your response time to a service you do not control.

**Fragility.** If the email provider is down — even briefly — the API call fails. Depending on your error handling, you either surface a 500 to the user (sign-up appeared to fail) or you return a success response despite the email never being sent (you told the user to check their inbox, but there is nothing there). Neither outcome is acceptable.

Both problems share the same root cause: work that does not need to block the user *is* blocking the user.

## The Solution: Offload to a Queue

The fix is to separate *deciding to do work* from *actually doing the work*.

When the user signs up, instead of calling the email provider directly, your server packages all the information needed to send the email — the recipient address, the verification code, the HTML template — [serializes it]({{ '/serialization-and-deserialization-for-backend-engineers/' | relative_url }}) into JSON, and pushes it into a **task queue**. Then it returns the 201 immediately. From the user's perspective, sign-up is instant.

Separately, a **worker process** is running in the background, watching the queue. When it sees the new task, it picks it up, deserializes the payload, and makes the actual call to the email provider. This happens independently of the original HTTP request — usually within milliseconds, well within the 15-minute window before a verification link expires.

The key insight is that the user's experience is now decoupled from the reliability of an external service. Sign-up always succeeds. Email delivery happens best-effort in the background.

## The Three Roles

Every task queue system has the same three components.

**Producer** — your application code. It creates a task, serializes the data the worker will need to execute it, and pushes the task into the queue. The producer's job ends at enqueue. It does not wait for the task to run.

**Broker** — the queue itself: the storage layer that holds tasks between production and consumption. It is the buffer. Common implementations are Redis (using its pub/sub or list primitives), RabbitMQ, or a managed cloud service like AWS SQS. The broker's job is durability — it holds tasks until a worker is ready, and it does not drop tasks if a worker crashes.

**Consumer (Worker)** — a separate process that monitors the queue, dequeues tasks as they arrive, and executes them. The consumer runs independently of the web server process. You can run one worker or many, depending on throughput requirements. Each worker handles one task at a time (or a configurable number concurrently).

The flow:

```
User request → Server (producer)
                   → serializes task → pushes to broker
                   → returns 201 immediately

Broker → Worker (consumer)
             → dequeues task
             → deserializes payload
             → executes handler (calls email provider, etc.)
             → sends acknowledgement to broker
```

## Retries and Failure Handling

One of the most valuable properties of a task queue system is built-in retry logic.

When a worker executes a task and the execution fails — the email provider returned a 500, the external API timed out, a database constraint was violated — the task is not silently dropped. The worker reports the failure back to the broker, and depending on configuration, the broker re-enqueues the task for another attempt.

The standard retry strategy is **exponential backoff**: after the first failure, retry after 1 minute. After the second failure, retry after 2 minutes. After the third, 4 minutes. The interval doubles each time, up to a configured maximum number of attempts. This is the same pattern used for [recoverable errors in general error handling]({{ '/error-handling-and-building-fault-tolerant-systems/' | relative_url }}).

Exponential backoff matters because most transient failures — email provider briefly down, rate limit hit, temporary network partition — resolve within seconds. By the second or third retry, the external service is usually back up. The task completes without ever surfacing the failure to the user.

After the maximum retries are exhausted, tasks typically land in a **dead letter queue** — a separate queue for permanently failed tasks — where they can be inspected and manually retried or discarded.

## Acknowledgements and Visibility Timeout

The broker needs to know whether a task was successfully processed. Workers communicate this through **acknowledgements**.

When a worker finishes executing a task successfully, it sends an ACK to the broker. The broker removes the task from the queue. If the worker crashes mid-execution and never sends an ACK, the task is not lost — this is where **visibility timeout** comes in.

Visibility timeout is the window during which a task is considered "in progress" by a worker. The broker hides the task from other workers during this window to prevent double-processing. If the worker handling it does not send an ACK within the timeout — because it crashed, hung, or the external service stopped responding — the broker makes the task visible again. Another worker picks it up and retries it.

This guarantees that no task disappears silently. As long as the broker is durable, every enqueued task will eventually be processed or explicitly moved to a dead letter queue.

## Types of Tasks

### One-off tasks

A one-off task is triggered by a specific event and runs once. This is the most common pattern.

Examples:
- Send a verification email when a user signs up
- Send a password reset email when requested
- Send a push notification when a friend sends a message
- Process and resize a user-uploaded image after upload

These tasks are enqueued in the request handler and consumed asynchronously. The user never waits for them.

### Recurring tasks (Cron jobs)

Recurring tasks are not triggered by events — they are scheduled to run on a fixed interval.

Examples:
- Send a daily digest email to users at midnight
- Generate a weekly report PDF and email it to account admins
- Run a cleanup job at the end of each month to delete orphaned records

The "orphaned sessions" example is common: if you use [stateful authentication]({{ '/authentication-for-backend-engineers-part-2-sessions-jwts-and-the-four-auth-types/' | relative_url }}), old sessions accumulate in the database over time — sessions from devices a user has not touched in months. A recurring job that deletes sessions inactive beyond a retention threshold keeps the sessions table from growing unboundedly.

Libraries like Celery (Python), BullMQ (Node.js), and Asynq (Go) all have built-in support for scheduled and recurring tasks. You declare the interval (every day at midnight, every Sunday at 9am) and the handler, and the library manages the scheduling.

### Chain tasks

Chain tasks have a parent-child relationship: one task completing triggers one or more subsequent tasks. The output of the first task may be the input of the second.

A content platform is a good example. When an instructor uploads a new video course, the system needs to: transcode the video into multiple resolutions, generate a thumbnail from a keyframe, extract a transcript, and notify enrolled students. Each step depends on the previous one completing successfully. Building this as a chain of tasks means each step runs in the background, failures in one step do not affect others, and the whole pipeline is observable and retryable at each stage.

## Common Tooling

The broker and worker frameworks you use depend on your stack:

| Language | Popular Libraries |
|---|---|
| Python | Celery, Dramatiq |
| Node.js | BullMQ, Bee-Queue |
| Go | Asynq, Machinery |
| Java | Spring Batch, Quartz |

For the broker (storage layer): Redis is the most common choice for small to medium scale — it is fast, widely deployed, and most task libraries have first-class Redis support. If you are already using [Redis for caching]({{ '/caching-the-secret-behind-it-all/' | relative_url }}), you may already have the infrastructure. RabbitMQ adds more messaging guarantees and routing flexibility. AWS SQS is the managed option for cloud deployments that need to scale across regions without operating a broker yourself.

## What Belongs in a Background Job

The practical heuristic is: offload any work that is slow, depends on an external service, or does not need to be done before responding to the user.

- **Email sending** — depends on an external provider, does not affect the user's immediate action
- **Push notifications** — same: depends on Apple/Google services
- **Image/video processing** — CPU or time-intensive, user does not need to wait
- **Report generation** — CPU-intensive, scheduled or triggered, result delivered separately
- **Webhook delivery** — delivering events to third-party endpoints that may be slow or unreliable
- **Search index updates** — re-indexing content after a write, without blocking the write response
- **Cleanup/maintenance** — session pruning, soft-delete purges, log rotation

The thread through all of these: they are work the user does not need to wait for, and making the user wait for them provides no benefit while creating real cost in latency and fragility.

Background jobs are not optional at any meaningful scale. They are the mechanism that keeps your API responsive when the world around it is slow or unreliable. The pattern is simple: enqueue fast, process asynchronously, retry on failure. Once that is in place, a whole category of infrastructure fragility disappears.

Happy hacking!
