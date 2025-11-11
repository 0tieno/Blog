---
layout: post
title: The Anatomy of a Java Program
date: 2025-11-10 12:24:59 +0300
categories:
  - Java
---
Java programs may seem complex at first, but they all share a common structure.
In this post, we’ll dissect the structure of a simple Java program to understand its components and how they work together.
Let’s start with this familiar example:

```java
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

```

We’ll take this apart line by line:

## 1. **Class Declaration**

```java
public class HelloWorld {

```

- **`class`** → Defines a *blueprint* for objects (everything in Java lives inside a class).
- **`HelloWorld`** → The *name* of the class.
    - Must start with a capital letter by convention.
    - The filename **must match** the public class name → `HelloWorld.java`

You can think of a class as a *container* that holds your code.

## 2. **Main Method**

```java
public static void main(String[] args)

```

This is the **entry point** of every Java program.

When you run your code, the JVM looks for this method first.

Let’s break it down:

| Keyword | Meaning |
| --- | --- |
| **`public`** | Accessible from anywhere. The JVM needs to call this method, so it must be public. |
| **`static`** | Belongs to the class itself, not to an object (so JVM can call it without creating an object). |
| **`void`** | Means the method doesn’t return any value. |
| **`main`** | The method name recognized by the JVM as the program’s starting point. |
| **`String[] args`** | Command-line arguments passed when running the program. (We’ll use these later.) |

Think of this line as:

> “Hey JVM! Start running my program from here.”


## 3. **Curly Braces `{ }`**

Braces `{}` define **blocks** of code.

- The first pair `{ }` encloses everything inside the class.
- The second pair encloses everything inside the `main()` method.

They show **scope** — what belongs to what.

Example:

```java
public class MyClass {     // Start of class
    public static void main(String[] args) {   // Start of method
        System.out.println("Hi!");
    }   // End of method
}   // End of class

```


## 4. **Statement**

```java
System.out.println("Hello, World!");

```

This is a **statement** — a single command that performs an action.

Let’s decode it:

| Part | Meaning |
| --- | --- |
| **`System`** | A built-in Java class that provides access to system resources. |
| **`out`** | A static member of `System` — represents the standard output stream (the console). |
| **`println()`** | A method that prints a line of text and moves to the next line. |

So `System.out.println("Hello, World!");` means

> “Print this text to the console and go to the next line.”


## 5. **Semicolon `;`**

In Java, **each statement ends with a semicolon** `;`.

It’s like a period in English — it tells Java that your thought (instruction) is complete.

Example:

```java
int x = 10;
System.out.println(x);

```

## 6. **Comments**

Comments are notes ignored by the compiler — used for explanations.

```java
// Single-line comment

/*
   Multi-line comment
   (ignored by compiler)
*/

```

Use them generously to describe your logic — they make code readable and professional.


## 7. **Putting It All Together**

Here’s a labeled version of a simple program:

```java
// This is my first Java program

// Class Declaration
public class HelloWorld {

    // Main Method - Entry point of the program
    public static void main(String[] args) {

        // Print statement
        System.out.println("Hello, World!");
    }
}

```

When you run this:

1. The **JVM** looks for the `main()` method.
2. Executes the code inside it.
3. Prints `Hello, World!` to the console.

## Summary

| Concept | Purpose |
| --- | --- |
| **Class** | Container for all code. |
| **Main method** | Program entry point. |
| **Curly braces `{}`** | Define scope or blocks. |
| **Statements** | Actual executable commands. |
| **Semicolons `;`** | End of a statement. |
| **Comments** | For explanation, ignored by compiler. |


Happy hacking!