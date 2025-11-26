---
type: post
title: Java Strings and Type Conversion
date: 2025-11-22 09:00:00 +0300
categories:
  - Java
---

In this post, we'll dive deep into Java Strings and explore how to convert between different data types. Strings are one of the most commonly used data types in Java programming.

## Understanding Strings

A String in Java is actually a **non-primitive** data type, because it refers to an object. The String object has methods that are used to perform certain operations on strings.

### Primitive vs Non-Primitive Types

The main differences between **primitive** and **non-primitive** data types are:

- **Primitive types** in Java are predefined and built into the language, while **non-primitive types** are created by the programmer (except for `String`).
- **Non-primitive types** can be used to call methods to perform certain operations, whereas **primitive types** cannot.
- **Primitive types** start with a lowercase letter (like `int`), while **non-primitive types** typically start with an uppercase letter (like `String`).
- **Primitive types** always hold a value, whereas **non-primitive types** can be `null`.

Examples of non-primitive types are Strings, Arrays, Classes, etc.

## Working with Strings

Text must be wrapped inside double quotation marks `""`.

If you forget the double quotes, an error occurs.

```java
public class Main {
    public static void main(String[] args) {
        String greeting = "Hello, World!";
        String name = "Alice";
        String city = "New York";

        System.out.println(greeting);
        System.out.println("Name: " + name);
        System.out.println("City: " + city);

        // This would cause an error:
        // String error = Hello;  // Missing quotes!
    }
}
```

### String Concatenation

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

        // Numbers vs Strings
        int a = 5;
        int b = 10;
        int sum = a + b;                    // Addition: 15
        String numString = a + " + " + b;   // Concatenation: "5 + 10"
        String result = a + " + " + b + " = " + sum;  // Mixed: "5 + 10 = 15"

        System.out.println("Sum: " + sum);
        System.out.println("Expression: " + numString);
        System.out.println("Result: " + result);
    }
}
```

### Common String Methods

Strings come with many useful methods:

```java
public class Main {
    public static void main(String[] args) {
        String text = "Hello, Java Programming!";

        // Length
        System.out.println("Length: " + text.length());

        // Convert case
        System.out.println("Uppercase: " + text.toUpperCase());
        System.out.println("Lowercase: " + text.toLowerCase());

        // Character at specific position
        System.out.println("First character: " + text.charAt(0));
        System.out.println("Last character: " + text.charAt(text.length() - 1));

        // Check contents
        System.out.println("Contains 'Java': " + text.contains("Java"));
        System.out.println("Starts with 'Hello': " + text.startsWith("Hello"));
        System.out.println("Ends with '!': " + text.endsWith("!"));

        // Find position
        System.out.println("Index of 'Java': " + text.indexOf("Java"));

        // Replace
        String replaced = text.replace("Java", "Python");
        System.out.println("Replaced: " + replaced);

        // Split into parts
        String[] words = text.split(" ");
        System.out.println("Number of words: " + words.length);
        for (String word : words) {
            System.out.println("Word: " + word);
        }
    }
}
```

### String Comparison

Be careful when comparing strings! Use `.equals()` instead of `==`:

```java
public class Main {
    public static void main(String[] args) {
        String name1 = "Alice";
        String name2 = "Alice";
        String name3 = new String("Alice");

        // Correct way to compare strings
        System.out.println("name1.equals(name2): " + name1.equals(name2));     // true
        System.out.println("name1.equals(name3): " + name1.equals(name3));     // true

        // Wrong way (compares memory addresses, not content)
        System.out.println("name1 == name2: " + (name1 == name2));             // true (same reference)
        System.out.println("name1 == name3: " + (name1 == name3));             // false (different references)

        // Case-sensitive vs case-insensitive comparison
        String text1 = "Hello";
        String text2 = "HELLO";

        System.out.println("Case-sensitive: " + text1.equals(text2));          // false
        System.out.println("Case-insensitive: " + text1.equalsIgnoreCase(text2)); // true
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
import java.util.ArrayList;
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        // Traditional way
        String message = "Hello World";
        int number = 42;
        ArrayList<String> cars = new ArrayList<String>();
        HashMap<String, Integer> ages = new HashMap<String, Integer>();

        // With var keyword
        var message2 = "Hello World";           // Compiler knows it's String
        var number2 = 42;                       // Compiler knows it's int
        var cars2 = new ArrayList<String>();    // Much cleaner!
        var ages2 = new HashMap<String, Integer>(); // Much cleaner!

        // You can still use the variables normally
        cars2.add("Toyota");
        cars2.add("Honda");
        ages2.put("Alice", 25);
        ages2.put("Bob", 30);

        System.out.println("Cars: " + cars2);
        System.out.println("Ages: " + ages2);
    }
}
```

## Final Variables (Constants)

Use the `final` keyword to create constants - variables that cannot be changed once assigned:

```java
public class Main {
    public static void main(String[] args) {
        final int BIRTH_YEAR = 1990;
        final String COMPANY_NAME = "TechCorp";
        final double PI = 3.14159;

        System.out.println("Birth year: " + BIRTH_YEAR);
        System.out.println("Company: " + COMPANY_NAME);
        System.out.println("Pi: " + PI);

        // This would cause an error:
        // BIRTH_YEAR = 1991; // Cannot reassign final variable

        // Final arrays and lists can still be modified (contents change, not reference)
        final int[] scores = {85, 90, 78};
        scores[0] = 95; // This is allowed - we're changing content, not the reference
        System.out.println("First score: " + scores[0]);
    }
}
```

**Note:** By convention, final variables in Java are usually written in UPPER_CASE. It is not required, but useful for code readability.

## Type Conversion (Casting)

If you need to change between types, you can use type casting or conversion methods.

### Automatic Casting (Widening)

Java automatically converts smaller types to larger types:

```java
public class Main {
    public static void main(String[] args) {
        int myInt = 100;
        double myDouble = myInt;    // Automatic casting: int to double

        char myChar = 'A';
        int charToInt = myChar;     // char to int (ASCII value)

        float myFloat = 10.5f;
        double floatToDouble = myFloat;  // float to double

        System.out.println("Original int: " + myInt);
        System.out.println("Converted to double: " + myDouble);
        System.out.println("Char 'A': " + myChar);
        System.out.println("ASCII value: " + charToInt);
        System.out.println("Float: " + myFloat);
        System.out.println("Double: " + floatToDouble);
    }
}
```

### Manual Casting (Narrowing)

For converting larger types to smaller types, you need explicit casting:

```java
public class Main {
    public static void main(String[] args) {
        double myDouble = 9.78;
        int myInt = (int) myDouble;         // Manual casting: double to int

        int bigNumber = 300;
        byte myByte = (byte) bigNumber;     // int to byte (may lose data!)

        long myLong = 100L;
        int longToInt = (int) myLong;       // long to int

        System.out.println("Original double: " + myDouble);
        System.out.println("Converted to int: " + myInt);      // Decimal part lost
        System.out.println("Big number: " + bigNumber);
        System.out.println("As byte: " + myByte);              // Data overflow!
        System.out.println("Long: " + myLong);
        System.out.println("As int: " + longToInt);
    }
}
```

### String Conversions

Converting between strings and other types:

```java
public class Main {
    public static void main(String[] args) {
        // Converting TO String
        int number = 123;
        double decimal = 45.67;
        boolean flag = true;

        String numberStr = String.valueOf(number);      // or: "" + number
        String decimalStr = String.valueOf(decimal);    // or: "" + decimal
        String flagStr = String.valueOf(flag);          // or: "" + flag

        System.out.println("Number as string: '" + numberStr + "'");
        System.out.println("Decimal as string: '" + decimalStr + "'");
        System.out.println("Boolean as string: '" + flagStr + "'");

        // Converting FROM String
        String ageStr = "25";
        String salaryStr = "50000.50";
        String activeStr = "true";

        int age = Integer.parseInt(ageStr);
        double salary = Double.parseDouble(salaryStr);
        boolean isActive = Boolean.parseBoolean(activeStr);

        System.out.println("Parsed age: " + age);
        System.out.println("Parsed salary: " + salary);
        System.out.println("Parsed boolean: " + isActive);

        // Be careful with invalid strings!
        try {
            int invalid = Integer.parseInt("not a number");  // This will cause an error
        } catch (NumberFormatException e) {
            System.out.println("Cannot convert 'not a number' to integer!");
        }
    }
}
```

## Practical Examples

### Example 1: User Information System

```java
public class Main {
    public static void main(String[] args) {
        // User data
        var firstName = "Alice";
        var lastName = "Johnson";
        var ageStr = "28";
        var salaryStr = "65000.50";

        // Process the data
        String fullName = firstName + " " + lastName;
        int age = Integer.parseInt(ageStr);
        double salary = Double.parseDouble(salaryStr);

        // Create user profile
        String profile = "Name: " + fullName +
                        ", Age: " + age +
                        ", Salary: $" + salary;

        // Display information
        System.out.println("=== User Profile ===");
        System.out.println(profile);
        System.out.println("First name length: " + firstName.length());
        System.out.println("Full name uppercase: " + fullName.toUpperCase());
        System.out.println("Is adult: " + (age >= 18));
        System.out.println("Monthly salary: $" + (salary / 12));
    }
}
```

### Example 2: Text Processing

```java
public class Main {
    public static void main(String[] args) {
        String email = "alice.johnson@techcorp.com";

        // Extract information from email
        int atIndex = email.indexOf("@");
        String username = email.substring(0, atIndex);
        String domain = email.substring(atIndex + 1);

        // Process username
        String[] nameParts = username.split("\\.");
        String firstName = nameParts[0];
        String lastName = nameParts[1];

        // Create display name
        String displayName = firstName.substring(0, 1).toUpperCase() +
                           firstName.substring(1) + " " +
                           lastName.substring(0, 1).toUpperCase() +
                           lastName.substring(1);

        System.out.println("=== Email Analysis ===");
        System.out.println("Email: " + email);
        System.out.println("Username: " + username);
        System.out.println("Domain: " + domain);
        System.out.println("Display name: " + displayName);
        System.out.println("Is corporate email: " + domain.contains("corp"));
    }
}
```

## Key Takeaways

1. **Strings are objects**, not primitive types, so they have methods
2. **Use `.equals()`** to compare strings, not `==`
3. **String concatenation** with `+` is simple but can be inefficient for many operations
4. **The `var` keyword** can make code cleaner, especially for complex types
5. **Final variables** create constants that cannot be reassigned
6. **Type conversion** can be automatic (widening) or manual (narrowing)
7. **Parse methods** convert strings to numbers: `Integer.parseInt()`, `Double.parseDouble()`

In the next post, we'll explore Java control structures and learn how to make decisions in your programs!

Happy coding!
