---
type: post
title: Java Variables and Primitive Data Types
date: 2025-11-21 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore the foundation of Java programming: variables and primitive data types. Understanding these concepts is crucial for storing and manipulating data in your Java programs.

## What are Variables?

All Java **variables** must be **identified** with **unique names**. These unique names are called **identifiers**.

Think of variables as containers that store data values. In Java, every variable must have a specific type that determines what kind of data it can hold.

```java
public class Main {
    public static void main(String[] args) {
        int age = 25;           // Integer variable
        double salary = 50000.50; // Double variable
        char grade = 'A';       // Character variable
        boolean isStudent = true; // Boolean variable

        System.out.println("Age: " + age);
        System.out.println("Salary: " + salary);
        System.out.println("Grade: " + grade);
        System.out.println("Is student: " + isStudent);
    }
}
```

## Primitive Data Types in Java

Java has 8 built-in primitive data types that store simple values directly in memory.

### Integer Types

Java provides four integer types of different sizes:

| Type    | Size   | Range                           | Example                        |
| ------- | ------ | ------------------------------- | ------------------------------ |
| `byte`  | 8-bit  | -128 to 127                     | `byte age = 25;`               |
| `short` | 16-bit | -32,768 to 32,767               | `short year = 2025;`           |
| `int`   | 32-bit | -2,147,483,648 to 2,147,483,647 | `int population = 1000000;`    |
| `long`  | 64-bit | Very large range                | `long distance = 9876543210L;` |

```java
public class Main {
    public static void main(String[] args) {
        byte temperature = 25;
        short studentsCount = 1500;
        int cityPopulation = 500000;
        long worldPopulation = 8000000000L; // Note the 'L' suffix

        System.out.println("Temperature: " + temperature + "°C");
        System.out.println("Students: " + studentsCount);
        System.out.println("City population: " + cityPopulation);
        System.out.println("World population: " + worldPopulation);
    }
}
```

**Note:** For `long` variables, add an 'L' suffix to the number to indicate it's a long value.

### Floating-Point Types

For numbers with decimal points, Java provides two floating-point types:

| Type     | Size   | Precision            | Example                      |
| -------- | ------ | -------------------- | ---------------------------- |
| `float`  | 32-bit | 6-7 decimal digits   | `float price = 19.99f;`      |
| `double` | 64-bit | 15-16 decimal digits | `double pi = 3.14159265359;` |

### Which to Choose: float or double?

The **precision** of a floating-point value indicates how many digits the value can have after the decimal point. The precision of `float` is only 6-7 decimal digits, while `double` variables have a precision of about 15-16 digits.

**Therefore, it is safer to use `double` for most calculations.**

You should use a floating-point type whenever you need a number with a decimal, such as 9.99 or 3.14159.

```java
public class Main {
    public static void main(String[] args) {
        float gasPrice = 3.45f;  // Note the 'f' suffix
        double pi = 3.14159265358979323846;
        double bankBalance = 1250.75;

        System.out.println("Gas price: $" + gasPrice);
        System.out.println("Pi: " + pi);
        System.out.println("Bank balance: $" + bankBalance);

        // Demonstrating precision difference
        float floatResult = 10.0f / 3.0f;
        double doubleResult = 10.0 / 3.0;

        System.out.println("Float result: " + floatResult);    // Less precise
        System.out.println("Double result: " + doubleResult);  // More precise
    }
}
```

**Note:** For `float` variables, add an 'f' suffix to the number.

### Boolean Type

The `boolean` type stores true or false values:

```java
public class Main {
    public static void main(String[] args) {
        boolean isJavaFun = true;
        boolean isCompleted = false;
        boolean canDrive = 18 <= 25;  // Result of comparison

        System.out.println("Is Java fun? " + isJavaFun);
        System.out.println("Is completed? " + isCompleted);
        System.out.println("Can drive? " + canDrive);

        // Using boolean in conditions
        if (isJavaFun) {
            System.out.println("Let's continue learning Java!");
        }
    }
}
```

### Character Type

The `char` type stores single characters:

```java
public class Main {
    public static void main(String[] args) {
        char initial = 'J';
        char symbol = '$';
        char digit = '7';        // This is a character, not a number
        char unicodeChar = '\u0041';  // Unicode for 'A'

        System.out.println("Initial: " + initial);
        System.out.println("Symbol: " + symbol);
        System.out.println("Digit character: " + digit);
        System.out.println("Unicode character: " + unicodeChar);

        // Characters can be used in arithmetic (converted to ASCII values)
        char a = 'A';
        char b = 'B';
        System.out.println("ASCII value of A: " + (int)a);  // 65
        System.out.println("ASCII value of B: " + (int)b);  // 66
    }
}
```

**Note:** Character values must be surrounded by single quotes `'`.

## Working with Variables

### Variable Declaration and Initialization

```java
public class Main {
    public static void main(String[] args) {
        // Method 1: Declare then initialize
        int score;
        score = 95;

        // Method 2: Declare and initialize together
        double average = 87.5;

        // Method 3: Multiple variables of same type
        int math, science, english;
        math = 90;
        science = 85;
        english = 92;

        // Method 4: Multiple variables with same value
        int x = 10, y = 10, z = 10;

        System.out.println("Score: " + score);
        System.out.println("Average: " + average);
        System.out.println("Math: " + math + ", Science: " + science + ", English: " + english);
        System.out.println("x: " + x + ", y: " + y + ", z: " + z);
    }
}
```

### Variable Naming Rules

1. Must start with a letter, underscore `_`, or dollar sign `$`
2. Cannot start with a digit
3. Cannot contain spaces
4. Cannot use Java reserved words (like `int`, `class`, `public`)
5. Are case-sensitive (`myVar` and `myvar` are different)

```java
public class Main {
    public static void main(String[] args) {
        // Valid variable names
        int age = 25;
        int _count = 10;
        int $price = 100;
        int studentAge = 20;
        int CONSTANT_VALUE = 50;

        // Invalid variable names (these would cause errors):
        // int 2value = 10;     // Cannot start with digit
        // int my-var = 5;      // Cannot contain hyphen
        // int class = 15;      // Cannot use reserved word
        // int my var = 20;     // Cannot contain spaces

        System.out.println("Valid variables work fine!");
    }
}
```

## Practical Examples

### Example 1: Student Grade Calculator

```java
public class Main {
    public static void main(String[] args) {
        // Student information
        char studentGrade = 'B';
        int mathScore = 85;
        int scienceScore = 92;
        int englishScore = 78;
        boolean isPassing = true;

        // Calculate average
        double average = (mathScore + scienceScore + englishScore) / 3.0;

        // Display results
        System.out.println("=== Student Report Card ===");
        System.out.println("Math Score: " + mathScore);
        System.out.println("Science Score: " + scienceScore);
        System.out.println("English Score: " + englishScore);
        System.out.println("Average: " + average);
        System.out.println("Grade: " + studentGrade);
        System.out.println("Passing: " + isPassing);
    }
}
```

### Example 2: Bank Account Information

```java
public class Main {
    public static void main(String[] args) {
        // Account details
        long accountNumber = 1234567890123456L;
        double currentBalance = 1250.75;
        double interestRate = 2.5f;
        boolean isActive = true;
        char accountType = 'S';  // S for Savings

        // Calculate yearly interest
        double yearlyInterest = currentBalance * (interestRate / 100);

        System.out.println("=== Bank Account Summary ===");
        System.out.println("Account Number: " + accountNumber);
        System.out.println("Current Balance: $" + currentBalance);
        System.out.println("Interest Rate: " + interestRate + "%");
        System.out.println("Yearly Interest: $" + yearlyInterest);
        System.out.println("Account Type: " + accountType);
        System.out.println("Active: " + isActive);
    }
}
```

## Key Takeaways

1. **Primitive types** store simple values directly in memory
2. **Choose the right size** for your data to optimize memory usage
3. **Use `double` for decimal calculations** instead of `float` for better precision
4. **Follow naming conventions** to make your code readable
5. **Initialize variables** before using them to avoid errors

In the next post, we'll explore Java Strings and learn about type conversion between different data types!

Happy coding!
