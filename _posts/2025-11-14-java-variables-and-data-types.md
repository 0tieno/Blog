---
type: post
title: Java Variables and Data Types
date: 2025-11-14 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore Java variables, data types, and how to work with them effectively. Understanding these concepts is fundamental to mastering Java programming.

## What are Variables?

All Java **variables** must be **identified** with **unique names**. These unique names are called **identifiers**.

Think of variables as containers that store data values. In Java, every variable must have a specific type that determines what kind of data it can hold.

## Primitive Data Types

Java has several built-in primitive data types:

### Numeric Types

**Integers:**

- `byte` - 8-bit integer
- `short` - 16-bit integer
- `int` - 32-bit integer
- `long` - 64-bit integer

**Floating Point:**

- `float` - 32-bit floating point
- `double` - 64-bit floating point

### Use float or double?

The **precision** of a floating point value indicates how many digits the value can have after the decimal point. The precision of `float` is only 6-7 decimal digits, while `double` variables have a precision of about 16 digits.

Therefore it is safer to use `double` for most calculations.

You should use a floating point type whenever you need a number with a decimal, such as 9.99 or 3.14515.

### Other Primitive Types

- `boolean` - true/false values
- `char` - single character

## Non-Primitive Data Types

A String in Java is actually a **non-primitive** data type, because it refers to an object. The String object has methods that are used to perform certain operations on strings.

### Main Differences Between Primitive and Non-Primitive Types

- **Primitive types** in Java are predefined and built into the language, while **non-primitive types** are created by the programmer (except for `String`).
- **Non-primitive types** can be used to call methods to perform certain operations, whereas **primitive types** cannot.
- **Primitive types** start with a lowercase letter (like `int`), while **non-primitive types** typically start with an uppercase letter (like `String`).
- **Primitive types** always hold a value, whereas **non-primitive types** can be `null`.

Examples of non-primitive types are Strings, Arrays, Classes, etc.

## Working with Strings

Text must be wrapped inside double quotation marks `""`.

If you forget the double quotes, an error occurs.

In Java, the `+` symbol has two meanings:

- For text (strings), it joins them together (called **concatenation**).
- For numbers, it adds values together.

```java
public class Main {
    public static void main(String[] args) {
        String firstName = "John";
        String lastName = "Doe";
        String fullName = firstName + " " + lastName;
        System.out.println("Full name: " + fullName);

        int a = 5;
        int b = 10;
        int sum = a + b;
        System.out.println("Sum: " + sum);
    }
}
```

## The var Keyword

The `var` keyword was introduced in Java 10 (released in 2018).

The `var` keyword lets the compiler automatically detect the type of a variable based on the value you assign to it.

This helps you write cleaner code and avoid repeating types, especially for long or complex types.

### When to Use var

For simple variables, it's usually clearer to write the type directly (`int`, `double`, `char`, etc.).

But for more complex types, such as `ArrayList` or `HashMap`, `var` can make the code shorter and easier to read:

```java
// Without var
ArrayList<String> cars = new ArrayList<String>();

// With var
var cars = new ArrayList<String>();
```

## Final Variables

**Note:** By convention, final variables in Java are usually written in upper case (e.g. `BIRTHYEAR`). It is not required, but useful for code readability and common for many programmers.

```java
public class Main {
    public static void main(String[] args) {
        final int BIRTH_YEAR = 1990;
        System.out.println("Birth year: " + BIRTH_YEAR);
        // BIRTH_YEAR = 1991; // This would cause an error!
    }
}
```

## Type Conversion

If you really need to change between types, you must use type casting or conversion methods (for example, turning an `int` into a `double`).

```java
public class Main {
    public static void main(String[] args) {
        int myInt = 100;
        double myDouble = myInt; // Automatic casting: int to double

        double anotherDouble = 9.78;
        int anotherInt = (int) anotherDouble; // Manual casting: double to int

        System.out.println(myInt);      // Outputs 100
        System.out.println(myDouble);   // Outputs 100.0
        System.out.println(anotherDouble);  // Outputs 9.78
        System.out.println(anotherInt);     // Outputs 9
    }
}
```

That's it for Java variables and data types! In the next post, we'll explore control structures like if statements, loops, and more.

Happy coding!
