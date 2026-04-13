---
type: post
title: "Logging, Monitoring, and Observability"
date: 2026-04-13 12:00:00 +0300
categories:
  - backend
---

Logging, monitoring, and observability are each deserving of their own deep dive. But they also belong together because they work together. You cannot meaningfully have one without the other two if you want to actually understand what is happening inside a running backend system.

One important framing before getting into the details: these are practices, not switches. No company follows every logging, monitoring, and observability best practice perfectly. They are implemented on a spectrum. The goal is not to feel intimidated by the terminology, tools, and products that get thrown around — it is to understand what each piece means and how they connect.

### Why You Need This

Modern backend applications do not run on a single machine. They run in distributed environments across multiple servers, sometimes across multiple geographic regions, serving users spread around the world.

In that environment, you need methodologies to keep track of what is happening. When something breaks — and things always break — you need to be able to find out what happened, where it happened, and why. Without logging, monitoring, and observability in place, a production failure becomes a guessing game.

### Logging — What Happened

Logging is the practice of recording the important events that happen throughout the life cycle of your application. You can think of logs as a journal your backend maintains. When the time comes to debug something, the logs tell you exactly what happened and when.

Not just the fact that something happened — but the context around it. Good logs attach metadata: which user triggered the request, what the latency was, which function was called, what the database query looked like. That context is what makes a log useful instead of just noise.

**Log levels**

Every logging library gives you a set of levels to assign to each log. These levels let you filter by severity and control what gets written to output in different environments.

- `DEBUG` — used in development when you need granular detail for troubleshooting. These logs are intentionally verbose and that is fine locally, but you disable them in production because the volume would be overwhelming and most of it is not useful once the system is healthy.
- `INFO` — general operational events and business events. If a user creates an item, if a background job starts, if a server connects to the database — these get logged at info level. They record the normal flow of the application.
- `WARN` — events that are not a success but also not a system failure. A user entering the wrong password is a warning: it is worth recording, but it is not your bug. Something taking longer than expected to complete is a warning.
- `ERROR` — actual failures in the system: a database query that fails, a validation error that cannot be recovered, a third-party API returning an unexpected response. This is the level you watch most closely in production.
- `FATAL` — a critical failure that is causing the application to shut down. After logging at this level, the process typically stops and restarts depending on infrastructure configuration.

**Structured vs. unstructured logging**

There are two formats logs can take: human-readable text and structured JSON.

In development, plain text with colors and formatting makes sense. You are reading the logs yourself in a terminal, and readability matters. You want to quickly spot which line is an error and what it says.

In production, the logs are not primarily for human reading. They are being ingested and parsed by log management tools — the ELK stack, Loki, or whatever your infrastructure uses. If you write them as plain text, those tools have to apply fragile text parsing to extract fields like user ID or request ID from unstructured sentences. That breaks easily and wastes time.

In production, log in JSON. Every field — level, message, user ID, request ID, timestamp, error detail — is a key-value pair in the JSON object. Log management tools can parse it reliably and you can query across any field without guessing at the format.

The practical implementation: configure your logger to check the environment at startup. In local mode, output human-readable text. In production mode, output JSON. The same log statements in your code work for both — only the formatter changes.

### Monitoring — Is Something Wrong

Monitoring is continuously checking the health and performance of your system. The data is near real-time — usually a few seconds to 15 seconds behind the actual state of the system, because you do not want the monitoring pipeline itself to become a bottleneck.

The concrete output of monitoring is **metrics**. Metrics are numbers that describe the state of your system at a point in time or over a time range. Examples:

- requests per second
- error rate (percentage of requests returning a non-2xx status)
- average response time / [p99 latency]({{ '/backend-scaling-and-performance-engineering-part-1-mental-models/' | relative_url }})
- CPU and memory usage
- number of open database connections

You configure which metrics you care about, and your monitoring tools collect and aggregate them continuously. You can then look at trends over time — not just "the error rate right now" but "the error rate over the last six hours compared to the same time last week."

**Alerts**

The most immediate operational value of monitoring is alerting. You set thresholds: if the error rate crosses 80%, send a message to the team Slack channel. If p99 latency exceeds 2 seconds, page the on-call engineer. This is how a production failure gets noticed quickly rather than discovered by users.

**The limitation of monitoring alone**

Monitoring tells you that something is wrong. An alert fires, a metric spikes, and you know there is a problem. But it does not tell you what is wrong or where to look. A decade ago, that was roughly all you had. Observability is the response to that limitation.

### Observability — Why Is It Wrong

A system is called observable if you can determine its internal state by looking at its external outputs. Observability does not replace monitoring — it extends it. Monitoring surfaces the problem; observability surfaces the cause.

Observability is built on three pillars. A system is only meaningfully observable if all three are in place.

**Pillar 1: Logs**

Logs tell you what specific events happened. You already know what logs are. They are the "what happened" component.

**Pillar 2: Metrics**

Metrics surface patterns and trends — the "how bad is it and when did it start" component. Same metrics discussed in monitoring, but now connected to the other two pillars so you can navigate from a metric spike directly into related logs.

**Pillar 3: Traces**

Traces are what genuinely separate observability from basic logging and monitoring.

A trace tracks a single request as it moves through every layer of your system. From the moment it arrives — whether at a load balancer, an API gateway, or directly at your server — the trace records every component it touches: the middleware, the handler, the [validation layer]({{ '/input-validation-and-data-transformation-for-backend-engineers/' | relative_url }}), the [service layer, the repository]({{ '/controllers-services-repositories-middlewares-and-request-context/' | relative_url }}), the database round-trip, and back out.

A trace is a transaction record. It shows you the full path of a request, the time spent at each step, and exactly where it failed. If a request successfully passes authentication and input validation but then fails at the database query in the service layer, the trace shows you exactly that — not just "something returned a 500."

### The Debugging Workflow When Everything Is In Place

When all three pillars are working together, a production incident follows a workflow like this:

1. **Alert fires**: a metric threshold is breached — error rate hits 80%. A notification lands in Slack.
2. **Metrics dashboard**: you open the dashboard and see the spike. It started 12 minutes ago. Response time is also elevated. Throughput looks normal, so it is probably not a traffic spike. (If you are not familiar with these metrics, [Backend Scaling Part 1]({{ '/backend-scaling-and-performance-engineering-part-1-mental-models/' | relative_url }}) covers latency percentiles and throughput in depth.)
3. **Logs**: the metrics view surfaces the specific logs associated with the failed requests. You see a cluster of `500 Internal Server Error` logs, all with the same error message pointing at a database operation.
4. **Trace**: you click one of those logs. It opens the trace for that request. You see the request arrive at the middleware, pass validation, enter the service layer — and then fail at a specific database call with a timeout error.

In minutes, you have gone from "something is broken" to "the `create_todo` database operation is timing out, and it started 12 minutes ago." That is what observability provides that monitoring alone cannot.

### Tools

Two main categories of tooling exist for this:

**Open-source stacks**

For teams with the engineering bandwidth to operate their own infrastructure:

- **Prometheus** — metrics collection and storage
- **Grafana** — dashboards and alerting over Prometheus metrics
- **Loki** — log aggregation, designed to integrate with Grafana
- **Jaeger** — distributed tracing
- **ELK stack** (Elasticsearch, Logstash, Kibana) — another popular option for log aggregation and search

These tools integrate well together and give you full control, but they each need to be deployed, configured, and maintained.

**Managed / all-in-one platforms**

For teams that do not have the resources or desire to run all of that:

- [**New Relic**](https://newrelic.com/) — a single platform covering logs, metrics, traces, and dashboards
- [**Datadog**](https://www.datadoghq.com/) — similar scope, widely used in enterprises

These platforms handle the infrastructure side so your team only needs to instrument the code and configure what to capture.

### Code-Level Implementation

Observability does not happen automatically. You have to instrument your code — meaning you write logging and tracing calls throughout your application to measure and record what is happening at each layer.

**OpenTelemetry**

[OpenTelemetry](https://opentelemetry.io/) is the modern open standard for instrumentation. It provides a vendor-neutral set of APIs and SDKs for most major languages (Go, Node.js, Python, Java, etc.) that let you instrument your code once and export the data to whatever backend you choose — New Relic, Grafana, Datadog, or your own infrastructure. You are not locked in.

**The context-passing pattern**

In practice, distributed tracing works by passing a transaction object through the request's context.

When a request first arrives, a middleware at the entry point creates a new transaction. It attaches initial metadata: the service name, the environment, the user's IP, the user agent, the request ID, the user ID. This transaction is then stored in the request context and passed downstream.

As the request travels deeper — through the handler, the service layer, the database layer — each function pulls the transaction out of the context, adds its own specific data (the operation name, the resource ID, any error it encounters), and records its success or failure to the ongoing trace.

When the request completes, the trace is a complete record of everything that happened, with timing for each segment. If any layer logged an error, it is attached to the trace at the exact point where it occurred.

This is why the three pillars tie together: the trace links to the log that recorded the error, and the log connects back to the metric that fired the alert.

### Putting It Together

Logging, monitoring, and observability are a collective responsibility. As a backend engineer, your job is the instrumentation side: writing logs at appropriate levels, using structured JSON in production, creating traces through context propagation, and recording the business events that matter.

The infrastructure and DevOps side handles collecting, aggregating, and displaying that data — configuring Prometheus to scrape metrics, setting up Grafana dashboards, routing logs to Loki or an ELK cluster.

When both sides are done well, the result is a system you can actually understand from the outside. You can look at a dashboard and know the state of your service. You can open a trace and know exactly what a request did. And when something breaks, you spend minutes diagnosing it instead of hours guessing.

Happy hacking!
