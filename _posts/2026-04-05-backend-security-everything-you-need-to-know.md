---
type: post
title: "Backend Security Part 1: The Security Mindset and Injection Attacks"
date: 2026-04-05 10:00:00 +0300
categories:
  - backend
  - security
---

Security is a huge domain. There is browser security, network security, server and OS security, and backend application security. Each of these is its own rabbit hole. This series focuses on what is directly within your control as a backend engineer: the vulnerabilities that arise from the code you write and how to prevent them.

The goal here is not to teach you every security technique in one sitting. Security is too vast for that. The goal is to make you paranoid. To give you a mindset that makes you ask security questions every single time you write code, regardless of framework, language, or project.

### The One Question Attackers Are Always Asking

Attackers do not care about your framework, library, or programming language. They only care about one question:

**Where did the developer make an assumption?**

Developers assume the happy path, especially when working under deadline:

- "The user will enter a valid email"
- "This request is definitely coming from our frontend"
- "No one will open the network tab and modify parameters"

These assumptions feel entirely reasonable when you are shipping fast. You are always thinking about the path where the user fills in the correct form, clicks the right buttons, and navigates the app the way it was designed to be used.

Attackers do the opposite. They poke at every boundary, modify every input, and try to break every assumption you have made.

By the end of this series, you will have a mental model that sticks: every time you write code, ask yourself — **what could go wrong here in terms of security?**

### Your Backend Speaks Multiple Languages

To understand injection attacks, you first need to understand something fundamental about your backend: it speaks multiple languages at the same time.

- It speaks **SQL** when querying or writing to your database
- It speaks **HTML and CSS** when dealing with frontend rendering or static assets
- It speaks **shell** when performing OS-level operations like file processing

Each of these languages has its own grammar, its own set of special characters, and its own way of separating commands from data.

Most vulnerabilities arise when user input from one language context crosses the boundary into another. Characters that are harmless in one context carry meaning in another. When that happens, data gets treated as code.

### SQL Injection

Take a simple login page: an email field, a password field, a submit button. Your server receives the email, builds a database query, and checks if the user exists.

The vulnerable query looks like this:

```sql
SELECT * FROM users WHERE email = '" + userInput + "'
```

**The happy path:** User types `alice@gmail.com`. The query becomes:

```sql
SELECT * FROM users WHERE email = 'alice@gmail.com'
```

Works perfectly. No problems.

**What an attacker does instead:**

They type this into the email field:

```
' OR '1'='1' --
```

After string concatenation, the query becomes:

```sql
SELECT * FROM users WHERE email = '' OR '1'='1' --'
```

Break this down step by step:

- The injected `'` closes the opening quote — now `email = ''` is a complete condition checking for an empty string
- `OR '1'='1'` adds a second condition that is always true, since the string `'1'` always equals `'1'`
- `--` comments out everything after it, including the trailing single quote that would otherwise cause a syntax error
- Since the right side of the `OR` is always true, the entire `WHERE` clause evaluates to true
- The query becomes effectively `SELECT * FROM users` — it returns every row in your table

With that single string, the attacker can read every user's email, hashed password, address, phone number, and any other column stored in your users table.

**Even more destructive:**

```
'; DROP TABLE users; --
```

The `;` ends the SELECT statement. `DROP TABLE users` is now an independent statement that deletes your entire users table. `--` comments out the trailing quote to avoid a syntax error.

**Two defenses against this:**

First: give your database connection credentials only DML (Data Manipulation Language) permissions — INSERT, UPDATE, DELETE. Never give your application's database user DDL (Data Definition Language) permissions like DROP or ALTER. Even if an injection goes through, it cannot delete or alter your tables.

Second, and more important: **parameterized queries**, also called prepared statements.

Instead of building one string with everything concatenated:

```sql
"SELECT * FROM users WHERE email = '" + userInput + "'"
```

You separate the query structure from the data:

```sql
statement = "SELECT * FROM users WHERE email = $1"
db.query(statement, [userInput])
```

Your database receives two separate things: the query template and the values. Whatever goes into the `$1` slot is treated purely as a string — never parsed as SQL. It does not matter what characters the attacker includes. Single quotes, semicolons, SQL keywords — all of it lands in the slot as literal data and can never alter the query structure.

If the attacker passes `' OR '1'='1' --`, the database sees that as a garbage string being compared against an email column. It returns no rows and causes no harm.

Most ORMs use parameterized queries by default. Modern database drivers also make this the easy path. You only become vulnerable if you deliberately bypass all of that by building raw SQL strings yourself.

### NoSQL Injection

If you are using MongoDB or another document database, you are not automatically safe. MongoDB query objects can contain operators — `$ne` (not equal), `$gt` (greater than), `$exists`, and many others — specified as nested objects with keys starting with `$`.

A normal query finds a document where email equals a string. But if you pass a raw user-supplied JSON object directly into your query filter without validation, an attacker can inject these operators and completely change what your query does.

The fix: [validate]({{ '/input-validation-and-data-transformation-for-backend-engineers/' | relative_url }}) the shape and contents of user input before it reaches your database. Allowlist expected fields and types. Do not pass raw client JSON directly into database query objects.

### Command Injection

Some backend operations require calling external CLI tools. A common example is image processing. Say your service accepts image uploads and uses `ffmpeg` to resize them.

The vulnerable pattern:

```
exec("ffmpeg -height 120 -width 220 -o " + userFilename)
```

The user controls the output filename. If they pass:

```
output.jpg; rm -rf /
```

The shell sees a complete `ffmpeg` command, then a semicolon marking the end of that command, then `rm -rf /` — which deletes your entire root filesystem.

Attackers can also use pipes to redirect output to other destructive commands, or background operators (`&`) to run processes as persistent spyware inside your server.

**The fix:** use the process APIs provided by your language or framework, which accept the command and arguments as separate parameters.

Instead of:
```
exec("ffmpeg -o " + filename)
```

Use:
```
spawn("ffmpeg", ["-o", filename])
```

When you pass arguments separately, they go directly into the spawned process without being parsed by a shell interpreter. The user's input is never treated as code — it is always a plain string value, no matter how many semicolons or pipes it contains.

### The Mental Model for All Injection Attacks

SQL injection, NoSQL injection, command injection — they all share the same root cause: **treating data as code**.

This happens when:
1. You build a string that will be interpreted by another system
2. That string includes user input
3. You do not separate the structure from the data

The prevention principle is the same across all of them: whenever you are building something that will be executed or interpreted by another system, and user input is involved, find the parameterized alternative. It almost always exists.

**For databases**: [parameterized queries]({{ '/mastering-databases-with-postgres-for-backend-engineers/' | relative_url }}). 

**For OS processes**: argument arrays. Never concatenate user input directly into executable strings.

Every shell, every query language, every system your backend talks to has its own special characters. When you assume user input is clean data and mix it directly into command structure, you give attackers a way to inject whatever meaning those special characters carry in that language.

In [Part 2]({{ '/backend-security-part-2-authentication-authorization-and-defense/' | relative_url }}), we cover authentication and password storage, sessions and JWTs, authorization vulnerabilities, XSS, CSRF, and defense in depth.

Happy hacking!
