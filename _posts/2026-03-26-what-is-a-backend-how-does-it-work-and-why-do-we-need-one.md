---
type: post
title: "What is a Backend, How Does It Work, and Why Do We Need One?"
date: 2026-03-26 10:00:00 +0300
categories:
  - backend
---

At its most literal, a backend is a computer listening for requests — HTTP, WebSocket, gRPC, or otherwise — on an open port, accessible over the internet, so that clients can connect to it, send data, and receive data. We call it a server because it *serves* content: JSON responses, static files, HTML, images.

That definition is accurate, but abstract. Let's trace what actually happens when a request leaves a browser and reaches a server, then work backwards to understand why backends exist at all.


## The Journey of a Request

Take a backend deployed on an AWS EC2 instance. A user types a domain name into their browser. Here is every hop that request makes:

**1. DNS resolution.** The browser queries a DNS server for the IP address behind the domain name. DNS records map domain names and subdomains to IP addresses using A records, or to other domain names using CNAME records. The subdomain in this case points to the public IP of an EC2 instance.

**2. Firewall.** The request arrives at that IP address. Before it reaches the server process, it passes through the cloud provider's firewall (in AWS, a security group). The firewall only permits traffic on allowed ports — typically port 443 for HTTPS and port 80 for HTTP. If those ports are not explicitly opened, the request is dropped here and never reaches the application.

**3. Reverse proxy.** Inside the EC2 instance, a reverse proxy (commonly Nginx) is listening on the external ports. It receives the request and redirects it to the application process running on a local port — say, `localhost:3001`. The reverse proxy handles SSL termination, domain-to-port routing, and centralizes configuration so you do not have to change every server individually when routing rules change.

**4. Application server.** The Node.js (or Go, or Java, or whatever) process is running on that local port. It receives the request, executes business logic, interacts with the database if needed, and sends back a JSON response.

The same path in reverse carries the response back to the browser.

When you are developing locally, steps 1–3 collapse. You just open `localhost:3000/users` and your request goes directly to the application process. The DNS, firewall, and proxy layers are only necessary when the server is accessible over the public internet.


## Why Backends Exist

Here is a concrete example. You are scrolling Instagram and you like a friend's post. Your friend's phone shows a notification a moment later. What happened in between?

1. Your app sent a request to a server identifying you and the post you liked
2. The server persisted that action to a database
3. The server looked up who owns the post
4. The server triggered a notification to that user's device

A server had to be involved because this operation requires **centralized, shared state**. Your phone only knows about your account. Your friend's phone only knows about theirs. The server knows about both — and about every other user on the platform. It is the only entity in the system that can coordinate between them.

If you strip backend engineering down to its core responsibility, it is this: **receiving, processing, and persisting data**, and coordinating actions that involve data shared between multiple users or services.


## Why Not Just Do It on the Frontend?

A reasonable question: modern frontend devices are powerful. Why not connect the browser directly to the database and skip the backend entirely?

There are several reasons this does not work.

### Security and the Browser Sandbox

Browsers execute code fetched from remote servers. Because of this, they run in a heavily sandboxed environment — isolated from the operating system, file system, and other processes. This is intentional: if browsers did not enforce this isolation, any website you visit could read your files and exfiltrate your data.

That same sandboxing makes browsers unsuitable for backend work. A backend server needs to read environment variables, write log files, access the file system, and open raw socket connections. Browsers are restricted from all of these.

### CORS Restrictions

Browsers enforce a security policy called CORS (Cross-Origin Resource Sharing) that blocks JavaScript from calling APIs on a different domain unless that API explicitly permits it. Backend servers face no such restriction — they can call any external service freely. Building a product that integrates with third-party APIs (payment providers, email services, external data sources) is not practical from a browser environment.

### Database Drivers and Connection Pooling

Database drivers — the libraries that communicate with PostgreSQL, MySQL, MongoDB — are designed for server environments. They maintain **[connection pools]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }})**: a pre-established set of persistent connections to the database that requests share, rather than creating and destroying a connection for every query.

This matters enormously at scale. A backend receiving thousands of requests per second reuses connections from the pool. If every browser client connected directly to the database, each user would need their own connection. A database server can only handle a limited number of simultaneous connections — a few hundred to a few thousand. With millions of users, this collapses immediately.

Even technically, browsers are not designed to maintain persistent TCP connections to databases or handle the binary protocols those drivers use.

### Compute Consistency

Frontend devices span an enormous range of hardware — from high-end desktops to low-end smartphones with 256MB of RAM and a single CPU core. If business logic runs on the client, you cannot guarantee it will execute reliably across that range. A centralized server with known, controllable hardware does not have this problem, and you can scale its resources up or down as demand changes.


## TDLR

A backend is a centralized server that:
- Listens for requests over the internet through open ports
- Sits behind DNS, firewalls, and a reverse proxy that route traffic to it
- Processes requests, executes business logic, persists and retrieves data
- Coordinates actions that require knowledge of shared state across multiple users

It exists because browsers cannot safely or reliably do these things — both for security reasons that are fundamental to how browsers work, and for practical reasons around database connectivity, connection management, and computational consistency.

Everything else in backend engineering — APIs, databases, [caching]({{ '/caching-the-secret-behind-it-all/' | relative_url }}), [authentication]({{ '/authentication-for-backend-engineers-part-1-the-evolution-of-authentication/' | relative_url }}), scaling — builds on this foundation.

Happy hacking!
