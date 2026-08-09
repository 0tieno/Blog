---
type: post
title: Performance Testing and Its Types With Practical Examples
date: 2026-08-09 09:00:00 +0300
categories:
  - software testing
---

A system can work perfectly for one person and still fail when hundreds of people use it at the same time. Performance testing helps us discover these problems before users do.

In this post, we will explore performance testing, the measurements that matter, and five common types: load, stress, scalability, volume, and soak testing.

## What Is Performance Testing?

**Performance testing** is the process of testing the stability and response time of an application by applying a load.

It helps answer questions such as:

- Can the application support the expected number of users?
- How quickly does it respond under load?
- What happens when traffic exceeds the expected level?
- Does performance degrade during long periods of activity?
- Can the system process and store a large amount of data?

In other words, performance testing checks whether an application can support its designed number of users and respond within the required time.

## Key Performance Concepts

Before comparing the test types, it is useful to understand the measurements behind them.

### Stability

Stability is the application's ability to withstand its designed number of users.

For example, if an application is designed for 50 users at a time, stability testing checks whether it can support all 50 users without failing.

### Response Time

Response time is the time taken to send a request to the server, run the required program on the server, and receive the response.

For example, after a customer enters payment details and clicks the send button, the request goes to the server for processing. The server then returns a response that takes the customer from the payment page to the OTP page. The time required for this complete process is the response time.

Response-time percentiles are often more useful than a simple average. If the 95th percentile response time is two seconds, 95% of requests completed within two seconds.

### Load

Load is the number of users using an application during a particular period. In practical performance tests, workload may also be measured as:

- Concurrent users
- Requests per second
- Transactions per minute
- Messages processed per second
- Amount of data transferred

### Throughput and Error Rate

**Throughput** measures how much work the application completes in a given time. **Error rate** is the percentage of requests that fail.

A useful performance test monitors response time, throughput, error rate, and resource usage together. Looking at only one metric can hide the real problem.

## 1. Load Testing

Load testing checks the stability and response time of an application by applying a load that is less than or equal to its designed number of users.

Suppose an application is designed to support **50 users** at a time. During load testing, it can be tested with 45 users or with the full 50 users. The test verifies that:

- Response times remain within the target
- The error rate stays acceptably low
- Transactions complete correctly
- CPU, memory, database connections, and network usage remain healthy

The main question is: **Can the application maintain its stability and required response time at or below its designed load?**

## 2. Stress Testing

Stress testing checks the stability and response time of an application by applying a load greater than its designed number of users.

Suppose an application is designed to support **1,000 users** at a time and respond within **three seconds**. During stress testing, more than 1,000 users are applied while testers continue to check its stability and response time.

The additional observations can reveal:

- When response times become unacceptable
- Which component becomes the bottleneck
- Whether the application fails gradually or suddenly
- Whether data remains consistent during failure
- Whether the system recovers after the load is reduced

The defining feature of this test is that the applied load exceeds the application's designed number of users.

## 3. Scalability Testing

Scalability testing checks the stability and response time of an application by applying more than its designed number of users and finding the point at which the software crashes.

Suppose an application is designed for **1,000 users** and should respond within **two seconds**. Testers continue increasing the load and record the results:

| Applied Load | Result |
| ------------ | ------ |
| 1,500 users | The application responds within 2 seconds |
| 2,000 users | The application responds within 6 seconds |
| 5,000 users | The application responds within 42 seconds |
| 5,150 users | The application crashes |

In this example, scalability testing identifies 5,150 users as the point at which the software breaks.

## 4. Volume Testing

Volume testing, also called **flood testing**, checks the stability and response time of an application by transferring a huge volume of data. It tests the capacity of the database rather than applying a user load.

Examples include:

- Running searches against millions of product records
- Importing a very large CSV file
- Processing years of transaction history
- Storing and retrieving many uploaded files
- Generating reports from a large database

For example, suppose a website database has a capacity of 1 GB. Uploading 50 videos may work correctly because the data remains within that capacity. Uploading 100 more videos at the same time may exceed the database's capacity and cause it to crash.

Additional analysis of this test can uncover inefficient queries, missing indexes, storage limits, long backup times, and excessive memory usage.

## 5. Soak Testing

Soak testing, also known as **endurance testing**, checks the stability and response time of an application by applying a load continuously for a long period.

Depending on the application, the test may run continuously for 18, 24, or 72 hours. Televisions, mobile phones, cars, and motorcycles are examples of products that must continue working during long periods of use.

During a software soak test, teams can monitor:

- Memory growth
- CPU usage
- Database and connection-pool utilization
- Disk space and log growth
- Response-time trends
- Failed requests and background jobs

The main question is: **Can the application remain stable and maintain its response time while the load continues for a long period?**

## Performance Testing Types Compared

| Test Type | Workload or Data | Main Goal |
| --------- | ---------------- | --------- |
| Load | Less than or equal to the designed user load | Test stability and response time at the designed capacity |
| Stress | Greater than the designed user load | Test stability and response time beyond the designed capacity |
| Scalability | Increasing load beyond the designed user load | Find the point at which the software crashes |
| Volume | A huge volume of transferred data | Test the capacity of the database |
| Soak | A load applied continuously for a long period | Test long-term stability and response time |

## A Practical Performance Test Workflow

### 1. Define Clear Requirements

Avoid vague goals such as "the application should be fast." Use measurable targets instead:

- Support 1,000 concurrent users
- Keep the 95th percentile response time below two seconds
- Maintain an error rate below 1%
- Process at least 500 orders per minute

### 2. Model Real User Behavior

Not every user performs the same action. A realistic workload may contain 60% browsing, 25% searching, 10% adding items to a cart, and 5% checking out.

Include pauses between actions so that virtual users behave more like real users.

### 3. Prepare a Production-Like Environment

Test results are most useful when the test environment resembles production in configuration, network behavior, database size, and external dependencies.

### 4. Increase Load Gradually

Ramp traffic up and down instead of starting every virtual user at once. This makes it easier to identify the workload at which performance begins to degrade.

### 5. Monitor the Entire System

Collect client-side results and server-side metrics. Monitor the application, database, cache, message queues, external services, containers, and infrastructure.

### 6. Analyze, Improve, and Retest

A test result should lead to a diagnosis. Fix the bottleneck, run the same test again, and compare the results. Performance testing is most valuable as a repeatable process, not a one-time event.

## Common Performance Testing Tools

Popular tools include:

- **Apache JMeter** for protocol-level load testing
- **Gatling** for code-based performance scenarios
- **k6** for scriptable tests and automated pipelines
- **Locust** for Python-based user behavior

The best tool depends on the application's protocols, the team's skills, and how tests will be automated. The workload model and measurements matter more than the tool name.

## Conclusion

Each type of performance testing answers a different question:

- Load testing applies a load less than or equal to the designed number of users.
- Stress testing applies a load greater than the designed number of users.
- Scalability testing increases the load to find where the software crashes.
- Volume testing transfers a huge amount of data to test database capacity.
- Soak testing applies a load continuously for a long period.

Using these tests together provides a much clearer picture of an application's speed, stability, capacity, and reliability.

Happy hacking!