---
type: post
title: "Caching, the Secret Behind It All"
date: 2026-04-02 13:00:00 +0300
categories:
  - backend
  - caching
---

Caching is one of the biggest reasons modern applications feel fast.

In simple terms, caching is a way to reduce the time and effort it takes to perform work by keeping a useful subset of data in a faster location than the primary source.

That sounds abstract, so let us make it practical.

### What Is Caching?

A cache is not a replacement for the original data store. It is a faster place to keep frequently used data, so the system does not need to recompute or refetch everything every time.

A short definition:

**Caching is a mechanism used to reduce the time and effort required to retrieve data or perform repeated operations.**

The core idea is simple:

- keep a subset of useful data
- store it in a faster location
- reuse it when the same request comes again

That is why caching shows up in search engines, streaming platforms, social networks, browsers, databases, and backend APIs.

### Why Caching Matters

Without caching, a system may repeatedly do expensive work for the same result.

That creates problems:

- higher latency
- more CPU and memory usage
- more database load
- slower user experience

Caching helps when the same data or computation is requested repeatedly and the result does not change every second.

### Real-World Examples

#### 1) Search engines

Search queries can be expensive. A search engine may need to crawl, index, and rank billions of pages.

If millions of users keep asking similar questions, it is wasteful to recompute everything from scratch every time.

So the system caches common search results. If the result exists in cache, that is a **cache hit** and the response is returned quickly. If not, the system performs the work, stores the result, and serves it.

#### 2) Video platforms and CDNs

Streaming platforms like Netflix cannot serve every request from a single origin server.

Instead, they use **CDNs** and **edge locations** so content is cached closer to users around the world. This reduces buffering, lowers latency, and protects the origin infrastructure from overload.

This is one of the clearest examples of caching as distributed performance engineering.

#### 3) Social platforms and trending data

Trending topics usually do not change every second.

A platform like X can compute trends periodically, store them in cache, and serve them instantly to users. That avoids recalculating the same expensive aggregate for every page load.

### The Main Caching Layers

As a backend engineer, you usually encounter caching at three levels:

1. **Network-level caching**
2. **Hardware-level caching**
3. **Software-level caching**

#### Network-level caching

This includes things like:

- CDN caching
- DNS caching

CDNs store content at geographically close locations so users can fetch data from the nearest edge server.

DNS caching reduces the number of recursive lookups needed to resolve a domain name into an IP address.

#### Hardware-level caching

CPUs use multiple cache layers such as L1, L2, and L3 cache to speed up repeated memory access.

This is one reason sequential access patterns are often fast in practice: the processor is already optimized around how data is likely to be reused.

#### Software-level caching

This is the layer backend engineers use most often.

Tools like Redis, Memcached, and cloud-managed cache services keep data in memory so it can be read much faster than from disk-based databases.

### Why In-Memory Caches Are Fast

In-memory caches store data in RAM.

RAM is:

- much faster than disk
- direct-access oriented
- ideal for frequent reads

But RAM also has tradeoffs:

- it is more expensive
- it has lower capacity than disk
- it is volatile unless supported by persistence mechanisms

That is why caches are usually a subset of the data, not the full source of truth.

### Common Caching Strategies

#### Lazy caching, also called cache-aside

This is the most common pattern.

Flow:

1. The application checks the cache first
2. If the data exists, it returns it immediately
3. If not, it fetches from the primary store
4. It stores the result in cache
5. It returns the result to the client

This pattern is simple and widely used.

#### Write-through caching

With write-through, the application updates the database and the cache together in the same flow.

That means:

- reads are usually fresher
- the cache is easier to trust
- writes become slightly more expensive

This is a good tradeoff when freshness matters.

### Eviction Policies

Caches have limited space, so eventually something has to be removed.

That is where eviction policies come in.

Common eviction strategies include:

- **No eviction**: new writes fail when memory is full
- **LRU**: least recently used data is removed first
- **LFU**: least frequently used data is removed first
- **TTL-based eviction**: entries expire automatically after a configured time

Eviction is important because the cache should keep the most useful data, not just old data.

### Common Backend Use Cases

#### 1) Query caching

If a database query is expensive and hit frequently, cache the result.

This is common for dashboards, landing pages, reports, and other read-heavy endpoints.

#### 2) Session storage

[Authentication]({{ '/authentication-for-backend-engineers-part-2-sessions-jwts-and-the-four-auth-types/' | relative_url }}) sessions are often stored in Redis so that repeated API calls can validate users quickly without hitting the main database each time.

#### 3) API response caching

If your backend calls an external API repeatedly, cache the response for a short period.

This reduces:

- billing
- latency
- rate-limit pressure

#### 4) Rate limiting

Rate limiting middleware often uses in-memory storage to track request counts per IP or per user.

That makes enforcement fast and keeps the main database free from unnecessary write-heavy counters.

### Why Not Cache Everything?

Caching is powerful, but it is not free.

If you cache everything:

- memory cost rises
- invalidation becomes harder
- stale data risks increase
- the system becomes more complex

The right question is not "Can this be cached?" The better question is "Should this be cached, for how long, and under what invalidation rules?"

### TLDR 

Caching is about making repeated work cheaper.

The best caches hold data that is expensive to compute, frequently requested, and safe to reuse for a period of time. When used well, caching reduces latency, lowers server load, and makes backend systems feel much faster without changing the core business logic.

If you want the protocol-level side of this topic, read the HTTP caching post in the series as well. And when you are ready to apply caching as a [scaling strategy]({{ '/backend-scaling-and-performance-engineering-part-2-horizontal-scaling-load-balancers-and-database-scaling/' | relative_url }}), the horizontal scaling post covers how Redis fits into stateless, multi-instance architectures.

Happy hacking!
