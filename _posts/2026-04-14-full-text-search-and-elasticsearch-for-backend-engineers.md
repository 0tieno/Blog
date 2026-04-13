---
type: post
title: "Full-Text Search and Elasticsearch for Backend Engineers"
date: 2026-04-14 10:00:00 +0300
categories:
  - backend
  - databases
---

Picture this: it is 2005. You are a software engineer at a fast-growing e-commerce company. You have around 5,000 products in your database, and your task is to build a search API. The query you write looks something like this:

```sql
SELECT * FROM products
WHERE name ILIKE '%laptop%'
OR description ILIKE '%laptop%';
```

It works. Results come back in 50 milliseconds. Life is simple.

Then the company grows. Five thousand products becomes five million. That same query — the one that used to return in 50 milliseconds — now takes 30 seconds. Customers are frustrated. Your manager is frustrated. And you are getting requests that go beyond just "make it faster":

- Can we show the most relevant results first? When someone searches for _laptop_, show the MacBook Pro before the laptop bag.
- Can we handle typos? Customers in a hurry type _latpop_. We still want to return laptop results.

These three requirements — speed, relevance, and typo tolerance — are exactly why search engines like Elasticsearch exist. This post explains the fundamental ideas behind them, and when you should reach for full-text search instead of a standard database query.

## The Database's Fatal Flaw for Search

To understand why a tool like Elasticsearch is necessary, you need to understand what a relational database actually does when you run an `ILIKE` query with wildcard characters.

Think of the database as a librarian who knows exactly where every book is shelved. But there is a fatal flaw: when you ask this librarian for "books about machine learning," it has to walk to every single shelf in the entire library, pick up every single book, open it, and check whether the phrase "machine learning" appears inside. One by one. Every book.

For a small library, this is fine. For a library with 50 million books, it is catastrophic.

This is exactly what `ILIKE '%laptop%'` does. The database scans every row, examines every text field, and performs pattern matching character by character. It is thorough. It will find everything that matches. But it is painfully slow to do at scale.

The second problem is relevance. That same librarian returns books in whatever order it encounters them. A book titled _Introduction to Machine Learning_ — the most relevant result — might come after a book that happens to mention "machine learning" once in a footnote on the last page. The database has no concept of which result matters more. Results come back in an essentially random order, and relevance is up to you to sort out after the fact — which is expensive and still imperfect.

## The Inverted Index — The Idea That Changed Everything

The solution came from decades of research in information retrieval, a field that computer scientists have been studying since the 1960s.

The key insight was a reframing of the problem. Instead of searching through documents to find terms, what if you built a structure where you already know — for every term — exactly which documents contain it?

This data structure is called an **inverted index**.

Here is how it works. When a document (a product listing, a book, a user review) is stored, you do not just store the raw text. You extract every meaningful word from it, and for each word you record: which documents contain this word, and whereabouts in those documents it appears.

So for the word "machine":

| Document | Pages / Positions |
|---|---|
| Introduction to Machine Learning | 1, 15, 23 |
| The Machine Age | 5, 89 |
| Coffee Machine Manual | 1 |

And for the word "learning":

| Document | Pages / Positions |
|---|---|
| Introduction to Machine Learning | 1, 16, 24 |
| Learning to Cook | 3, 8 |
| Deep Learning Fundamentals | 5, 12, 41 |

When a search for "machine learning" arrives, the engine does not scan documents at all. It looks up "machine" in the index, looks up "learning" in the index, and finds the intersection — the documents that contain both terms. The work of finding candidates is done in microseconds instead of seconds. That is the inverted index.

This is why it is called *inverted*: instead of document → terms, you have terms → documents. The search is flipped.

This concept is the technology that powers Elasticsearch. Elasticsearch is not entirely new — it is built on top of a library called **Apache Lucene**, which has been implementing inverted index-based text search for decades. PostgreSQL also has full-text search support built on similar principles. Elasticsearch is not the only option; it is one of the most capable and widely used.

## Relevance Scoring

Speed alone is not enough. The inverted index tells you *which documents match*, but it does not tell you *which match matters most*. That is where relevance scoring comes in.

Elasticsearch uses an algorithm called **BM25** (which stands for Best Match 25, a name from the information retrieval research community). You do not need to understand the mathematics behind it to use the tool well, but you do need to understand the factors it weighs:

**Term frequency** — how often does the search term appear in the document? A product description that uses the word "laptop" twelve times is more relevant to a laptop search than one that uses it once.

**Document frequency** — how common is this term across all documents in the index? Words that appear in almost every document (like "the" or "a") carry almost no discriminating weight. A term that appears in only a small fraction of documents is more meaningful when it does appear.

**Document length** — a term appearing once in a 50-word description is more significant than the same term appearing once in a 5,000-word article.

**Field boosting** — matches in different parts of a document are not equally valuable. A product whose *title* is "Laptop Stand" is more relevant to a laptop search than a product whose *description* mentions laptops in passing. Elasticsearch lets you declare that matches in the title field should count more than matches in the description, which should count more than matches in the full content. This is field boosting, and it is one of the most commonly used features in practice.

When you send a search query to Elasticsearch, it computes a relevance score for every matching document and returns them sorted from most to least relevant. The results you get are not arbitrary — they reflect a principled calculation of which documents best satisfy the query.

## Typo Tolerance

One of the most visible advantages of full-text search engines is fuzzy matching — the ability to return correct results even when the query contains typos.

When a user types "latpop" instead of "laptop," a standard `ILIKE '%latpop%'` query returns nothing. The pattern does not match. The database has no way to know what the user intended.

Elasticsearch handles this through approximate string matching. It can calculate the "edit distance" between two strings — the number of single-character insertions, deletions, or substitutions needed to transform one into the other. "latpop" is one transposition away from "laptop." Elasticsearch can be configured to accept matches within a certain edit distance, so "latpop" still returns laptop results.

This is the mechanism behind the query suggestion behavior you see in Google or Amazon: you type something misspelled, and the system confidently returns results for what you probably meant. Building that experience into your own backend search is straightforward with a fuzzy query in Elasticsearch.

## When to Use Elasticsearch vs PostgreSQL

Both Elasticsearch and PostgreSQL offer full-text search. The right choice depends on your situation.

**PostgreSQL full-text search** is a strong option if:
- You are already using PostgreSQL
- Your search requirements are moderate in complexity
- You want to avoid adding another system to operate
- Your data volumes are manageable (millions, not tens of millions, of records)

PostgreSQL's `tsvector` and `tsquery` types, combined with GIN indexes, provide genuine inverted index-based search with relevance ranking. For many products, this is sufficient.

**Elasticsearch** becomes the better choice when:
- You need advanced relevance tuning with field boosting, multi-field queries, and custom scoring
- You need deep fuzzy matching and typo tolerance baked in
- You are dealing with very large document volumes where search performance is critical
- Your company is already running Elasticsearch for another purpose — specifically, the **ELK stack** (Elasticsearch, Logstash, Kibana) for [log management and observability]({{ '/logging-monitoring-and-observability/' | relative_url }}). If Elasticsearch is already in your infrastructure for logs, adding full-text search on top of it is a natural extension.

The performance difference is real. In a benchmark with 50,000 rows of product reviews, a search query against PostgreSQL using `ILIKE` took between 3 and 7.5 seconds depending on query breadth. The same query against Elasticsearch returned results in around 500 milliseconds. The gap widens as data grows.

## Practical Advice

Elasticsearch has a JSON-based query language (the Elasticsearch DSL) with a wide range of operators, analyzers, aggregations, and parameters. The documentation is comprehensive. The important thing to internalize is that you do not need to understand BM25 mathematics, the inner workings of inverted indexes, or the full breadth of Lucene internals to use Elasticsearch productively. You need to know:

1. **When to reach for it** — any feature with meaningful text search requirements: product search, document search, log search, type-ahead.
2. **The basic building blocks** — indexes (collections of JSON documents), mappings (how fields are typed: `text` for full-text search, `keyword` for exact matching), and the match query vs the term query.
3. **Field boosting** — declare which fields matter most in your relevance calculation; this single feature improves result quality dramatically.
4. **Fuzzy matching** — enable it for user-facing search to handle typos without extra work.

Unlike databases — where understanding [indexes]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }}), query planning, transactions, and connection management is mandatory to work effectively — Elasticsearch has a steeper learning curve but a shallower *required* depth for most use cases. Most search features can be implemented by adapting examples from the documentation. Deep optimization becomes necessary only at very high scale or with complex relevance requirements.

Know that it exists. Know when the problem calls for it. Then consult the docs.

Happy hacking!
