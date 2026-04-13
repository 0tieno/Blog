---
type: post
title: "Backend Scaling and Performance Engineering Part 1: Mental Models"
date: 2026-04-11 10:00:00 +0300
categories:
  - backend
  - performance
---

Scaling and performance are among the most widely discussed topics in backend engineering. They are also among the most misunderstood — partly because people jump straight to techniques (add [caching]({{ '/caching-the-secret-behind-it-all/' | relative_url }}), add servers, upgrade the database) before building a clear mental model of how systems actually behave under load.

This post starts from the beginning. Before any scaling techniques, before any specific optimizations, you need to understand the language of performance: the metrics, their relationships, and the traps in how people typically think about them. Get this right and the techniques will make sense on their own.

## What Does "Fast" Actually Mean?

When a user clicks a button on your web app, a chain of events begins: the browser sends a request across the internet to your server, your server processes it (possibly querying a database, calling an external API, sending an email), and eventually sends a JSON response back. The browser parses that response and renders something on screen.

The total time from the user clicking the button to the content appearing on screen is called **latency**.

Latency is the metric users are describing when they say your app is slow — whether or not they know the word. When someone says "this app feels sluggish," they are talking about latency.

## Why Averages Lie

The first instinct when measuring latency is to compute the average. But averages are nearly useless for performance measurement.

Consider this scenario: you measure a thousand requests and get an average latency of 100 milliseconds. Sounds good. But look at the distribution: 99% of requests completed in under 50 milliseconds, while 1% took around 5 seconds.

If your system handles 1 million requests per day, that 1% represents 10,000 users who had to stare at a spinner for 5 full seconds. The average tells you nothing about them. Average latency would have you believe the system is healthy while thousands of users have terrible experiences.

The problem is that averages smooth out exactly the variations that matter most.

## Percentiles: The Right Language for Latency

Instead of averages, performance engineers talk in **percentiles**.

- **P50** — 50% of requests complete at or below this latency. The experience of the median user.
- **P90** — 10% of requests experience this latency or worse.
- **P99** — 1% of requests experience this latency or worse. Equivalently: 99% of requests are *faster* than this number.

If your P99 latency is 2 seconds, it means 1% of your users wait 2 seconds or more. At scale, that 1% is a real and large group of people.

Backend engineers focus heavily on **P99 and P95** latencies. Not just because those users deserve a good experience (though they do), but because the requests that end up in that tail are almost always your most complex ones: queries with multiple joins, workflows that call external services, payment processing, operations that trigger webhooks or send emails. The latency tail is where the hard business logic lives.

And the users experiencing P99 latencies tend to be your most valuable customers — the ones making purchases, completing payments, and doing the things that actually generate revenue.

## Throughput

Latency describes how long a single request takes. **Throughput** describes how many requests your system can handle per unit of time — typically expressed as requests per second (RPS) or requests per minute.

The two are connected in a non-obvious way. A system might handle 10 requests per second with a P99 latency of 150 milliseconds — that is excellent. Crank the load up to 1,000 RPS and the same P99 latency might jump to 2 seconds. The underlying code did not change. The infrastructure did not change. The load profile changed, and the system revealed a limit you did not know was there.

Understanding throughput alongside latency lets you answer practical questions:

- Can our system handle the traffic spike on Black Friday?
- If we run an email campaign and traffic doubles overnight, how many concurrent users can we support?
- How many requests per second can we sustain before we need to scale?

None of these questions are answerable from latency numbers alone.

## Utilization and the Exponential Trap

**Utilization** is the percentage of your system's capacity currently in use. At 0%, the system is idle. At 100%, it is maxed out.

Here is the critical insight: **the relationship between utilization and latency is not linear.** Up to modest utilization levels, latency grows slowly and predictably. But as you approach 100% utilization, latency grows exponentially — the curve bends sharply upward.

The ice cream shop analogy makes this intuitive. When the shop is empty, you walk in and instantly get served. When there is a queue, each customer waits for everyone ahead to be served first. The ice cream worker's speed has not changed — the bottleneck is the queue that forms when demand meets limited capacity. At some point the queue grows faster than it can be cleared, and wait times shoot up.

The highway analogy is similar: at 50% capacity, traffic flows smoothly. At 80%, you notice slowdowns. At 90%, behavior becomes unpredictable — sometimes traffic flows, sometimes it jams, and a single impatient lane change causes a ripple effect. At 100%, nothing moves.

The practical implication: **you cannot run systems at 100% utilization and expect them to perform well.** Production systems generally run at 60–80% utilization, reserving the remaining capacity as headroom.

That headroom matters for a specific reason: traffic is not linear. Real-world traffic comes in **bursts**. Even if your average load sits at 40% utilization, a burst can spike you past 100% in seconds. Without headroom, those spikes crash your service. With it, the burst is absorbed and performance degrades gracefully rather than catastrophically.

## Find the Bottleneck Before You Fix Anything

When a system is slow, something specific is causing the slowness. Finding that specific thing is called **identifying the bottleneck**. It sounds obvious — but in practice, engineers skip this step and jump straight to by-the-book solutions.

The most common pattern: latency appears in an API → assume it is the database → add caching → deploy → latency is unchanged.

A real example of this: an API that fetches product details was running slowly. The database was assumed to be the culprit. A [Redis caching layer]({{ '/caching-the-secret-behind-it-all/' | relative_url }}) was designed, implemented, and deployed — about a week of work. After deployment, the API was still slow.

Adding granular timing measurements to the code revealed the actual cause: a [logging function]({{ '/logging-monitoring-and-observability/' | relative_url }}) that wrote to a remote logging service synchronously. The database query took 10 milliseconds. The Redis cache took 5 milliseconds. The logging call blocked the entire request for 500 milliseconds while it waited for the remote service to respond.

The database was never the problem. The caching layer solved a problem that did not exist, while the real bottleneck — a synchronous log write — was never touched.

The lesson: **measure before you optimize.** Add timing instrumentation across your request lifecycle — when the request arrives, when the database call starts and ends, when each external call is made, when the response is serialized. You will often find the bottleneck in places you did not expect:

- A [JSON serialization]({{ '/serialization-and-deserialization-for-backend-engineers/' | relative_url }}) step on a large response
- A synchronous call to a [logging or monitoring service]({{ '/logging-monitoring-and-observability/' | relative_url }})
- Payload size causing slow network transfer after processing is complete
- A single slow query among fast ones that skews the whole request

The bottleneck is rarely where intuition says it is. Measure first. Then fix it.

This is the foundation. Latency, throughput, utilization, percentiles, bottlenecks — these are the mental models and vocabulary you need before scaling techniques mean anything.

In [Part 2]({{ '/backend-scaling-and-performance-engineering-part-2-horizontal-scaling-load-balancers-and-database-scaling/' | relative_url }}), we get into the mechanics: horizontal scaling, load balancers and their algorithms, and database scaling with read replicas.

Happy hacking!
