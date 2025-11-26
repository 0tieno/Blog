---
type: post
title: Java Packages and APIs
date: 2025-11-21 09:00:00 +0300
categories:
  - Java
---

A package in Java is used to group related classes. Think of it as **a folder in a file directory**. We use packages to avoid name conflicts, and to write better maintainable code.

Packages are divided into two categories:

- Built-in Packages (packages from the Java API)
- User-defined Packages (create your own packages)

The library is divided into **packages** and **classes**. Meaning you can either import a single class (along with its methods and attributes), or a whole package that contains all the classes that belong to the specified package.

To use a class or a package from the library, you need to use the `import` keyword:

### Syntax

```java
import package.name.Class;   // Import a single class
import package.name.*;       // Import the whole package
```

### Example

```java
import java.util.Scanner;  // Import the Scanner class
import java.util.*;        // Import all classes from java.util package

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);
        System.out.println("Enter your name:");
        String name = scanner.nextLine();
        System.out.println("Hello, " + name);
        scanner.close();
    }
}
```

In the example above, we imported the `Scanner` class from the `java.util` package to read user input.

Happy coding!