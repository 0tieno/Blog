---
type: post
title: "Databases: Choosing Between SQL, NoSQL, and Graph Stores"
date: 2026-04-23 10:00:00 +0300
categories:
  - backend
  - system design
  - interviews
  - databases
---

The database you pick shapes everything: your query patterns, your scaling strategy, your consistency guarantees, and the kinds of bugs that will wake you up at 3 AM. This is not a "use whatever you know" decision. It is a design decision with real engineering tradeoffs.

## The Two Camps

### Relational Databases (SQL/RDBMS)

Data lives in tables with rows and columns. Think spreadsheets with strict rules. Every row in a table follows the same schema. Relationships between tables are explicit and enforced.

**Popular options:** PostgreSQL, MySQL, Oracle, SQLite

**Example: Customers Table**

| id | name | age | email |
| --- | --- | --- | --- |
| 1 | John | 30 | john@email.com |
| 2 | Sarah | 28 | sarah@email.com |
| 3 | Mike | 35 | mike@email.com |

### Non-Relational Databases (NoSQL)

Data can take many shapes. No fixed schema required. Optimized for specific access patterns rather than general-purpose querying.

**Four major types:**

**Document stores** (MongoDB, CouchDB): Data stored as JSON-like documents. Each document can have a different structure. Good when your data is naturally hierarchical or varies between records.

```json
{
  "userId": 1,
  "name": "John",
  "orders": [
    { "orderId": 101, "product": "Laptop", "price": 999 },
    { "orderId": 102, "product": "Mouse", "price": 25 }
  ]
}
```

**Wide-column stores** (Cassandra, ScyllaDB, HBase): Data in tables with dynamic columns. Designed for massive write throughput and horizontal scaling. Netflix uses Cassandra to handle millions of writes per second for tracking what users are watching.

**Key-value stores** (Redis, Memcached, DynamoDB): The simplest model. A key maps to a value. Stored in memory for extreme read/write speed. Redis can handle 100,000+ operations per second on a single node.

**Graph databases** (Neo4j, Amazon Neptune): Data stored as nodes and edges (relationships). Amazon uses Neptune to power "customers who bought X also bought Y" recommendations by traversing relationship graphs.

## The Join Problem: Why It Matters

The biggest conceptual difference between SQL and NoSQL comes down to how you handle related data.

**SQL approach:** Normalize your data across tables, then join them at query time.

```sql
-- Three separate tables, joined at query time
SELECT customers.name, products.name, orders.quantity
FROM orders
JOIN customers ON orders.customer_id = customers.id
JOIN products ON orders.product_id = products.id
WHERE customers.id = 1;
```

This is elegant. Data is stored once (no duplication). Updates are simple (change a customer name in one place). But joins get expensive at scale, especially across large tables or across distributed nodes.

**NoSQL approach:** Denormalize. Embed related data in a single document.

```json
{
  "customerId": 1,
  "customerName": "John",
  "orders": [
    {
      "orderId": 101,
      "productName": "Laptop",
      "productPrice": 999,
      "quantity": 1
    }
  ]
}
```

This is fast to read (one lookup, no joins). But updating the product name means finding and updating every document that references it. You are trading write complexity for read speed.

## ACID: Why Banks Use SQL

SQL databases follow ACID properties, and this is not academic theory. It is the reason your bank account does not lose money during a transfer.

**Atomicity:** A transaction either fully completes or fully rolls back. If you transfer $500 from Account A to Account B, both the debit and credit happen, or neither does. There is no state where the money disappears.

**Consistency:** The database moves from one valid state to another. If your schema says `balance >= 0`, no transaction can violate that constraint.

**Isolation:** Concurrent transactions do not interfere with each other. If two people transfer money from the same account simultaneously, the database serializes the operations so the balance is always correct.

**Durability:** Once a transaction commits, it survives crashes, power failures, and restarts. The data is written to disk.

**Interview scenario:** "You are building a payment system. Which database do you use?"

Answer: A relational database like PostgreSQL. Payments require strong consistency and transactional integrity. If a user pays for an order, you need to guarantee that the payment record and the order status update happen atomically. If either fails, both roll back. NoSQL databases with eventual consistency could lead to situations where a payment is recorded but the order is not, or vice versa.

## When to Choose What

### Go SQL when:

- Your data has clear relationships (users, orders, products, invoices)
- You need transactional integrity (payments, inventory management, booking systems)
- Your query patterns are complex and involve joins across multiple entities
- Data consistency is more important than raw speed
- Your schema is well-defined and unlikely to change dramatically

**Real examples:** Banking systems, e-commerce order management, healthcare records, accounting software

### Go NoSQL when:

- Your data is unstructured or semi-structured (user activity logs, IoT sensor data, social media posts)
- You need extreme read/write throughput at scale
- Your access patterns are simple (get by key, get by a single attribute)
- You can tolerate eventual consistency
- Your schema evolves frequently

**Real examples:** Session storage (Redis), product catalogs with varying attributes (MongoDB), real-time analytics (Cassandra), social network recommendations (Neo4j)

## The CAP Theorem: The Fundamental Tradeoff

Every distributed database must choose between three properties, and you can only guarantee two at the same time:

**Consistency (C):** Every read returns the most recent write. All nodes see the same data at the same time.

**Availability (A):** Every request gets a response, even if some nodes are down.

**Partition Tolerance (P):** The system keeps working even when network communication between nodes is lost.

Since network partitions are inevitable in distributed systems, you are really choosing between CP (consistent but may reject requests during partitions) and AP (available but may return stale data during partitions).

**PostgreSQL** is CP by default. It will reject writes rather than risk inconsistency.

**Cassandra** is AP. It will accept writes even during partitions and eventually reconcile conflicts.

**Interview insight:** When someone asks about database choice, mentioning CAP shows you understand the fundamental constraint. The follow-up question is always: "What does your application need more, consistency or availability?" An e-commerce checkout needs consistency. A social media feed can tolerate eventual consistency.

## Common Interview Mistake: "Just Use MongoDB for Everything"

This is a trap. Document stores are excellent for specific use cases, but they fall apart when:

- You need complex queries across multiple collections (no efficient joins)
- You need strong transactional guarantees across documents
- Your data has deep, interconnected relationships
- You need to enforce schema constraints at the database level

The right answer in an interview is always: "It depends on the access patterns, consistency requirements, and scale." Then explain the tradeoffs for the specific system being designed.

## Practical Pattern: Polyglot Persistence

Most production systems use multiple databases, each chosen for a specific job:

- **PostgreSQL** for the core business data (orders, users, payments)
- **Redis** for caching and session storage
- **Elasticsearch** for full-text search
- **Cassandra or ClickHouse** for analytics and time-series data

This is called polyglot persistence. You pick the best tool for each access pattern rather than forcing one database to do everything.

**Example architecture for an e-commerce platform:**

```
User request
    |
    v
API Server
    |
    +---> PostgreSQL (orders, users, inventory)
    |
    +---> Redis (session data, product cache, rate limiting)
    |
    +---> Elasticsearch (product search, autocomplete)
    |
    +---> Cassandra (user activity tracking, analytics events)
```

Each database handles what it is best at. PostgreSQL handles the money. Redis handles the speed. Elasticsearch handles the search. Cassandra handles the volume.

## Related Post

- [System Foundations: From One Server to Millions of Users](/Blog/system-foundations/) — Learn the vertical vs. horizontal scaling tradeoffs that directly influence your database architecture decisions.

Happy hacking!