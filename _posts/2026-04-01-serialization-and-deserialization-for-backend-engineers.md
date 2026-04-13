---
type: post
title: Serialization and Deserialization for Backend Engineers
date: 2026-04-9 09:00:00 +0300
categories:
  - backend
---

When a browser sends a request to a server, data has to travel across a network between two completely different environments. The client might be a JavaScript app; the server might be built with Rust, Java, or Python. So how do they understand each other? The answer is **serialization and deserialization**.

### The Problem: Different Languages, Different Data Types

Imagine a typical client-server setup:

- **Client**: A JavaScript frontend app (React, Angular, Vue, etc.)
- **Server**: A backend app written in Rust, Java, Python, or any other language

JavaScript is a dynamic, loosely-typed language. Rust is strictly typed and compiled. Their data types are completely different. If the client sends a JavaScript object to the server, the server has no native way to understand it — unless both sides agree on a **common format**.

```
Client (JavaScript) ──── HTTP Request ───► Server (Rust/Java/Python)
                      [ common format ]
Client (JavaScript) ◄─── HTTP Response ── Server (Rust/Java/Python)
                      [ common format ]
```

### What Is Serialization and Deserialization?

**Serialization** is the process of converting data from a language-specific format into a common, standard format for transmission or storage.

**Deserialization** is the reverse — taking that common format and converting it back into a language-specific data structure that the receiving program can understand and work with.

In short:

> Serialization and deserialization are techniques used to convert data to and from a common format so that it is understandable across different languages and domains.

### Serialization Standards

There are two broad categories of serialization formats:

#### Text-Based Formats
Human-readable formats that are easy to debug and understand:
- **JSON** (JavaScript Object Notation) — most widely used for HTTP/REST APIs
- **YAML** — common in configuration files
- **XML** — older standard, still used in enterprise systems

#### Binary Formats
More compact and faster to parse, but not human-readable:
- **Protocol Buffers (protobuf)** — popular in gRPC communication
- **Avro**, **MessagePack**, and others

For HTTP REST API communication — the most common pattern in modern backend engineering — **JSON is the dominant choice**.

### JSON: The Most Popular Serialization Standard

JSON stands for **JavaScript Object Notation**. Despite the name, it is language-agnostic and used everywhere: REST APIs, config files, log files, and more.

#### JSON Structure

A JSON object looks like this:

```json
{
  "id": 1,
  "title": "Serialization Explained",
  "author": "Ronney",
  "published": true,
  "tags": ["backend", "java", "api"],
  "address": {
    "country": "Kenya",
    "phone": 3456
  }
}
```

Key rules to remember:
- Starts and ends with curly braces `{}`
- All **keys** must be strings enclosed in **double quotes**
- **Values** can be: a string, number, boolean, array, or another nested object
- Arrays use square brackets `[]`

#### JSON in a Real HTTP Request

**POST Request (client sending data):**

```
POST /api/books HTTP/1.1
Content-Type: application/json

{
  "id": 1,
  "title": "Clean Code",
  "author": "Robert C. Martin"
}
```

**Server Response:**

```json
{
  "books": [
    { "id": 1, "title": "Clean Code", "author": "Robert C. Martin" },
    { "id": 2, "title": "The Pragmatic Programmer", "author": "David Thomas" }
  ]
}
```

The client sends JSON. The server receives it, deserializes it into its own data structures (e.g., a `struct` in Rust or a `class` in Java), processes it, serializes the result back to JSON, and sends it in the response. The client then deserializes that response and uses it to update the UI.

### The Full Flow

```
1. Client has data in JavaScript object format
2. Client SERIALIZES it → JSON string
3. JSON is sent over HTTP
4. Server DESERIALIZES JSON → language-specific type (e.g., Java class)
5. Server performs business logic
6. Server SERIALIZES result → JSON string
7. JSON is sent back over HTTP
8. Client DESERIALIZES JSON → JavaScript object
9. Client renders the UI
```

### What About the Network Layers?

You may have heard about the **OSI model** — the layered model that describes how data travels over a network, from the application layer all the way down to physical bits (0s and 1s) transmitted over fiber or copper.

As a backend engineer, your concern is the **application layer**. Your job is to produce and consume valid JSON. What happens in the transport, network, and physical layers is handled by the OS, network stack, and infrastructure — not by your application code.

> Mental model: You produce JSON at the application layer. It gets converted into packets, then bits, transmitted over the network, reassembled on the other end, and handed back to the server as JSON. You only deal with JSON.

### TLDR

- **Serialization** = converting data into a common format (e.g., JSON) for transmission or storage
- **Deserialization** = converting that common format back into a usable data structure
- **JSON** is the most popular format for HTTP REST API communication
- JSON is text-based, human-readable, and language-agnostic
- Binary formats like **protobuf** are used where performance matters (e.g., gRPC)
- Both client and server must agree on the same serialization format — this is the contract that makes communication possible

Understanding serialization and deserialization is foundational for backend engineering. Every time you build or consume an [API]({{ '/complete-rest-api-design/' | relative_url }}), this process is happening under the hood.

Happy hacking!
