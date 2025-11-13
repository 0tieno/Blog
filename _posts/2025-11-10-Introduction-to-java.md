---
layout: post
title: Introduction to Java
date: 2025-11-06 12:24:59 +0300
categories:
  - Java
---

Java is a **high-level, object-oriented programming language** that’s designed to be portable — *“Write Once, Run Anywhere (WORA).”* In this blog post, we’ll cover the basics of Java programming, including setting up your environment, writing your first program, and understanding variables and data types.

That means code written on one system can run on any other system that has a Java Virtual Machine (JVM).

---

### ☕ The Java Ecosystem

| Component | Full Form | Purpose |
| --- | --- | --- |
| **JVM** | Java Virtual Machine | Runs Java bytecode (compiled Java programs). Makes Java platform-independent. |
| **JRE** | Java Runtime Environment | Provides libraries + JVM needed to run Java applications. (Runtime only, not for development.) |
| **JDK** | Java Development Kit | Includes everything in JRE + development tools (like compiler `javac`) to write and compile Java code. |

**In short:**

```
JDK = JRE + Development Tools
JRE = JVM + Libraries

```

---

## 2. Writing Your First Java Program

### Step 1: Install Java

Download & install the latest **JDK** from [Oracle](https://www.oracle.com/java/technologies/javase-downloads.html) or [OpenJDK](https://openjdk.org/).

### Step 2: Write a Program

Create a file named **HelloWorld.java**

```java
// This is a simple Java program
public class HelloWorld {
    public static void main(String[] args) {
        System.out.println("Hello, World!");
    }
}

```

### Step 3: Compile and Run

Open your terminal in the file’s directory and type:

```bash
javac HelloWorld.java     // Compiles the code → creates HelloWorld.class
java HelloWorld           // Runs the program

```

**Output:**

```
Hello, World!

```


## 3. Variables and Data Types

### Variables

A variable stores data.

Syntax:

```java
type variableName = value;

```

Example:

```java
int age = 25;
String name = "Alice";
double price = 19.99;

```

### Data Types in Java

| Type | Example | Description |
| --- | --- | --- |
| **int** | `int x = 10;` | Integer numbers |
| **double** | `double pi = 3.14;` | Decimal numbers |
| **char** | `char grade = 'A';` | Single character |
| **boolean** | `boolean isJavaFun = true;` | True or False |
| **String** | `String name = "Bob";` | Sequence of characters (not primitive) |

---

## Example Program with Variables

```java
public class VariablesExample {
    public static void main(String[] args) {
        int age = 20;
        double height = 5.9;
        char grade = 'A';
        boolean isStudent = true;
        String name = "Emma";

        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Height: " + height);
        System.out.println("Grade: " + grade);
        System.out.println("Is Student: " + isStudent);
    }
}

```

**Output:**

```
Name: john
Age: 20
Height: 5.9
Grade: A
Is Student: true

```

---

## Summary

- **JVM** runs the code, **JRE** lets you run it, **JDK** lets you write it.
- Java programs start from the `main()` method.
- Variables store data using various **data types**.
- `System.out.println()` prints output to the console.

Happy hacking!
