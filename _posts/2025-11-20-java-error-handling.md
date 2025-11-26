---
type: post
title: Java Error Handling and Debugging
date: 2025-11-20 09:00:00 +0300
categories:
  - Java
---

In this final post of our Java series, we'll explore error handling, debugging techniques, and best practices for writing robust Java applications. Understanding how to handle errors properly is crucial for creating reliable software.

## Java Errors - Understanding the Basics

Even experienced Java developers make mistakes. The key is learning how to **spot** and **fix** them!

These sections cover common errors and helpful debugging tips to help you understand what's going wrong and how to fix it.

### Types of Errors in Java

| Error Type         | Description                                                |
| ------------------ | ---------------------------------------------------------- |
| Compile-Time Error | Detected by the compiler. Prevents code from running.      |
| Runtime Error      | Occurs while the program is running. Often causes crashes. |
| Logical Error      | Code runs but gives incorrect results. Hardest to find.    |

### Compile-Time Errors

```java
public class Main {
    public static void main(String[] args) {
        // Syntax error - missing semicolon
        System.out.println("Hello World") // Error: missing semicolon

        // Type mismatch error
        int number = "Hello"; // Error: cannot assign String to int

        // Variable not declared
        System.out.println(undeclaredVariable); // Error: variable not found
    }
}
```

### Runtime Errors

```java
public class Main {
    public static void main(String[] args) {
        // Division by zero
        int result = 10 / 0; // RuntimeException: ArithmeticException

        // Array index out of bounds
        int[] numbers = {1, 2, 3};
        System.out.println(numbers[5]); // RuntimeException: ArrayIndexOutOfBoundsException

        // Null pointer exception
        String text = null;
        System.out.println(text.length()); // RuntimeException: NullPointerException
    }
}
```

### Logical Errors

```java
public class Main {
    public static void main(String[] args) {
        // Logic error - off-by-one in loop condition
        int[] numbers = {1, 2, 3, 4, 5};

        // This will skip the last element
        for (int i = 0; i < numbers.length - 1; i++) { // Should be: i < numbers.length
            System.out.println(numbers[i]);
        }

        // Logic error - incorrect calculation
        double average = (85 + 90 + 92) / 3; // Result will be 89 instead of 89.0
        // Should be: double average = (85 + 90 + 92) / 3.0;
    }
}
```

## Java Exceptions

As mentioned in the errors section, different types of errors can occur while running a program - such as coding mistakes, invalid input, or unexpected situations.

When an error occurs, Java will normally stop and generate an error message. The technical term for this is: Java will throw an **exception** (throw an error).

### Exception Hierarchy

```
Throwable
├── Error (JVM errors - shouldn't be caught)
└── Exception
    ├── RuntimeException (Unchecked exceptions)
    │   ├── ArithmeticException
    │   ├── NullPointerException
    │   ├── ArrayIndexOutOfBoundsException
    │   └── IllegalArgumentException
    └── Checked Exceptions
        ├── IOException
        ├── SQLException
        └── ClassNotFoundException
```

## Exception Handling (try and catch)

Exception handling lets you catch and handle errors during runtime - so your program doesn't crash.

It uses different keywords:

The `try` statement allows you to define a block of code to be tested for errors while it is being executed.

The `catch` statement allows you to define a block of code to be executed, if an error occurs in the try block.

The `try` and `catch` keywords come in pairs:

```java
public class Main {
    public static void main(String[] args) {
        try {
            int[] myNumbers = {1, 2, 3};
            System.out.println(myNumbers[10]); // This will cause an exception
        } catch (Exception e) {
            System.out.println("Something went wrong: " + e.getMessage());
        }

        System.out.println("Program continues...");
    }
}
```

### Specific Exception Handling

```java
import java.util.InputMismatchException;
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        try {
            System.out.print("Enter a number: ");
            int number = scanner.nextInt();

            System.out.print("Enter another number: ");
            int divisor = scanner.nextInt();

            int result = number / divisor;
            System.out.println("Result: " + result);

        } catch (InputMismatchException e) {
            System.out.println("Error: Please enter valid numbers only!");
        } catch (ArithmeticException e) {
            System.out.println("Error: Cannot divide by zero!");
        } catch (Exception e) {
            System.out.println("An unexpected error occurred: " + e.getMessage());
        }

        scanner.close();
    }
}
```

### Multiple Catch Blocks vs Multi-Catch

```java
public class Main {
    public static void main(String[] args) {
        // Method 1: Multiple catch blocks
        try {
            // Some code that might throw exceptions
            int[] arr = {1, 2, 3};
            System.out.println(arr[10]);
        } catch (ArrayIndexOutOfBoundsException e) {
            System.out.println("Array index error: " + e.getMessage());
        } catch (NullPointerException e) {
            System.out.println("Null pointer error: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("General error: " + e.getMessage());
        }

        // Method 2: Multi-catch (Java 7+)
        try {
            // Some code that might throw exceptions
            String text = null;
            System.out.println(text.length());
        } catch (NullPointerException | IllegalArgumentException e) {
            System.out.println("Expected error occurred: " + e.getMessage());
        } catch (Exception e) {
            System.out.println("Unexpected error: " + e.getMessage());
        }
    }
}
```

## Finally

The `finally` statement lets you execute code, after `try...catch`, regardless of the result:

```java
import java.io.File;
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        FileWriter writer = null;

        try {
            writer = new FileWriter("test.txt");
            writer.write("Hello World!");
            System.out.println("File written successfully");
        } catch (IOException e) {
            System.out.println("Error writing to file: " + e.getMessage());
        } finally {
            // This block always executes
            try {
                if (writer != null) {
                    writer.close();
                    System.out.println("File closed");
                }
            } catch (IOException e) {
                System.out.println("Error closing file: " + e.getMessage());
            }
        }
    }
}
```

### Try-with-resources (Java 7+)

A cleaner way to handle resources:

```java
import java.io.FileWriter;
import java.io.IOException;

public class Main {
    public static void main(String[] args) {
        // Try-with-resources automatically closes the resource
        try (FileWriter writer = new FileWriter("test.txt")) {
            writer.write("Hello World!");
            System.out.println("File written successfully");
        } catch (IOException e) {
            System.out.println("Error with file: " + e.getMessage());
        }
        // FileWriter is automatically closed here, even if an exception occurs
    }
}
```

## The throw keyword

The `throw` statement allows you to create a custom error.

The `throw` statement is used together with an **exception type**. There are many exception types available in Java: `ArithmeticException`, `FileNotFoundException`, `ArrayIndexOutOfBoundsException`, `SecurityException`, etc:

### Example

Throw an exception if **age** is below 18 (print "Access denied"). If age is 18 or older, print "Access granted":

```java
public class Main {
    static void checkAge(int age) {
        if (age < 18) {
            throw new ArithmeticException("Access denied - You must be at least 18 years old.");
        } else {
            System.out.println("Access granted - You are old enough!");
        }
    }

    public static void main(String[] args) {
        try {
            checkAge(15); // Set age to 15 (which is below 18...)
        } catch (ArithmeticException e) {
            System.out.println(e.getMessage());
        }
    }
}
```

### Custom Exceptions

```java
// Custom exception class
class InvalidEmailException extends Exception {
    public InvalidEmailException(String message) {
        super(message);
    }
}

// Class using custom exception
class User {
    private String name;
    private String email;

    public User(String name, String email) throws InvalidEmailException {
        this.name = name;
        setEmail(email);
    }

    public void setEmail(String email) throws InvalidEmailException {
        if (email == null || !email.contains("@")) {
            throw new InvalidEmailException("Invalid email format: " + email);
        }
        this.email = email;
    }

    public void displayInfo() {
        System.out.println("Name: " + name + ", Email: " + email);
    }
}

public class Main {
    public static void main(String[] args) {
        try {
            User user1 = new User("Alice", "alice@email.com");
            user1.displayInfo();

            User user2 = new User("Bob", "invalid-email"); // This will throw exception
        } catch (InvalidEmailException e) {
            System.out.println("Error creating user: " + e.getMessage());
        }
    }
}
```

## Good Habits to Avoid Errors

- Use meaningful variable names
- Read the error message carefully. What line does it mention?
- Check for missing semicolons or braces
- Look for typos in variable or method names

### Best Practices Example

```java
import java.util.Scanner;

public class CalculatorApp {
    private static final Scanner scanner = new Scanner(System.in);

    public static void main(String[] args) {
        System.out.println("=== Simple Calculator ===");

        try {
            double num1 = getValidNumber("Enter first number: ");
            double num2 = getValidNumber("Enter second number: ");
            char operator = getValidOperator("Enter operator (+, -, *, /): ");

            double result = performCalculation(num1, num2, operator);
            System.out.printf("%.2f %c %.2f = %.2f%n", num1, operator, num2, result);

        } catch (Exception e) {
            System.out.println("An error occurred: " + e.getMessage());
        } finally {
            scanner.close();
        }
    }

    private static double getValidNumber(String prompt) {
        while (true) {
            try {
                System.out.print(prompt);
                return Double.parseDouble(scanner.nextLine());
            } catch (NumberFormatException e) {
                System.out.println("Error: Please enter a valid number.");
            }
        }
    }

    private static char getValidOperator(String prompt) {
        while (true) {
            System.out.print(prompt);
            String input = scanner.nextLine().trim();

            if (input.length() == 1) {
                char op = input.charAt(0);
                if (op == '+' || op == '-' || op == '*' || op == '/') {
                    return op;
                }
            }
            System.out.println("Error: Please enter a valid operator (+, -, *, /).");
        }
    }

    private static double performCalculation(double num1, double num2, char operator)
            throws ArithmeticException {
        switch (operator) {
            case '+':
                return num1 + num2;
            case '-':
                return num1 - num2;
            case '*':
                return num1 * num2;
            case '/':
                if (num2 == 0) {
                    throw new ArithmeticException("Cannot divide by zero!");
                }
                return num1 / num2;
            default:
                throw new IllegalArgumentException("Invalid operator: " + operator);
        }
    }
}
```

## Debugging Checklist

- Read the full error message, it often tells you exactly what's wrong
- Check if all variables are initialized before use
- Print variable values to trace the problem
- Watch for off-by-one errors in loops and arrays
- Comment out sections of code to find bugs

### Debugging with Print Statements

```java
public class Main {
    public static void main(String[] args) {
        int[] numbers = {5, 10, 15, 20, 25};
        int target = 15;
        int index = findNumber(numbers, target);

        if (index != -1) {
            System.out.println("Found " + target + " at index " + index);
        } else {
            System.out.println(target + " not found");
        }
    }

    public static int findNumber(int[] array, int target) {
        System.out.println("DEBUG: Searching for " + target); // Debug print

        for (int i = 0; i < array.length; i++) {
            System.out.println("DEBUG: Checking index " + i + ", value = " + array[i]); // Debug print

            if (array[i] == target) {
                System.out.println("DEBUG: Found match at index " + i); // Debug print
                return i;
            }
        }

        System.out.println("DEBUG: No match found"); // Debug print
        return -1;
    }
}
```

## Key Exception Handling Principles

1. **Catch specific exceptions** before general ones
2. **Don't ignore exceptions** - always handle them appropriately
3. **Use finally blocks** for cleanup code
4. **Create custom exceptions** when needed for business logic
5. **Log meaningful error messages** for debugging
6. **Fail fast** - detect and report errors as early as possible
7. **Use try-with-resources** for automatic resource management

## Summary

Throughout this Java series, we've covered:

1. **Variables and Data Types** - The foundation of Java programming
2. **Control Structures** - Making decisions and repeating actions
3. **Arrays and Collections** - Storing and managing multiple values
4. **OOP Concepts** - Classes, objects, encapsulation, and methods
5. **Inheritance and Polymorphism** - Code reuse and flexibility
6. **Advanced Topics** - Enums, dates, and modern Java features
7. **Error Handling** - Writing robust, reliable applications

You now have a solid foundation in Java programming! Remember: good error handling is the difference between a program that crashes and one that gracefully handles unexpected situations.

Keep practicing, keep learning, and happy coding! 🎉
