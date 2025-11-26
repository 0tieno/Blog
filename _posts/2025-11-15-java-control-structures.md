---
type: post
title: Java Control Structures - Conditions and Loops
date: 2025-11-15 09:00:00 +0300
categories:
  - Java
---

In this post, we'll dive into Java control structures - the building blocks that control the flow of your program. We'll cover conditional statements, loops, and decision-making constructs.

## Conditional Statements

### The Ternary Operator

There is also a short-hand if else, which is known as the **ternary operator** because it consists of three operands.

It can be used to replace multiple lines of code with a single line, and is most often used to replace simple if else statements:

**Syntax:** `variable = (condition) ? expressionTrue : expressionFalse;`

```java
public class Main {
    public static void main(String[] args) {
        int age = 20;
        String message = (age >= 18) ? "You can vote" : "You cannot vote yet";
        System.out.println(message);
    }
}
```

## Loops in Java

### Java For Loop

When you know exactly how many times you want to loop through a block of code, use the `for` loop instead of a `while` loop:

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            System.out.println("Count: " + i);
        }
    }
}
```

### Enhanced For Loop (For-Each)

There is also a "**for-each**" loop, which is used exclusively to loop through elements in an array (or other data structures):

**Syntax:**

```java
for (type variable : arrayname) {
    // code block to be executed
}
```

The colon (`:`) is read as "in". So you can read the loop as: _"for each variable in array"_.

The following example uses a **for-each** loop to print all elements in the **cars** array:

```java
public class Main {
    public static void main(String[] args) {
        String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};

        for (String car : cars) {
            System.out.println(car);
        }
    }
}
```

### Loop Control Statements

**Good to Remember:**

- `break` = stop the loop completely.
- `continue` = skip this round, but keep looping.

```java
public class Main {
    public static void main(String[] args) {
        // Example with break
        for (int i = 0; i < 10; i++) {
            if (i == 4) {
                break; // Exit the loop when i equals 4
            }
            System.out.println("Break example: " + i);
        }

        // Example with continue
        for (int i = 0; i < 10; i++) {
            if (i == 4) {
                continue; // Skip the rest of this iteration when i equals 4
            }
            System.out.println("Continue example: " + i);
        }
    }
}
```

## Java Scope

In Java, variables are only accessible inside the region where they are created. This is called **scope**.

### Loop Scope

Variables declared inside a `for` loop only exist inside the loop:

```java
public class Main {
    public static void main(String[] args) {
        for (int i = 0; i < 5; i++) {
            int loopVariable = i * 2;
            System.out.println("Loop variable: " + loopVariable);
        }
        // System.out.println(loopVariable); // This would cause an error!
        // System.out.println(i); // This would also cause an error!
    }
}
```

### Class Scope

Variables declared inside a class but outside any method have **class scope** (also called fields). These variables can be accessed by all methods in the class:

```java
public class Main {
    static int classVariable = 10; // Class scope variable

    public static void main(String[] args) {
        System.out.println("Class variable: " + classVariable);
        anotherMethod();
    }

    public static void anotherMethod() {
        System.out.println("Accessing class variable from another method: " + classVariable);
    }
}
```

## Practical Examples

Let's combine what we've learned with some practical examples:

### Example 1: Number Guessing Game Logic

```java
public class Main {
    public static void main(String[] args) {
        int secretNumber = 7;
        int[] guesses = {3, 5, 7, 9, 2};

        for (int guess : guesses) {
            String result = (guess == secretNumber) ? "Correct!" : "Try again";
            System.out.println("Guess " + guess + ": " + result);

            if (guess == secretNumber) {
                break; // Stop when we find the correct number
            }
        }
    }
}
```

### Example 2: Grade Calculator

```java
public class Main {
    public static void main(String[] args) {
        int[] scores = {85, 92, 78, 96, 88, 73};
        int total = 0;
        int count = 0;

        for (int score : scores) {
            if (score < 70) {
                continue; // Skip failing grades
            }
            total += score;
            count++;
            System.out.println("Valid score: " + score);
        }

        if (count > 0) {
            double average = (double) total / count;
            System.out.println("Average of passing grades: " + average);
        }
    }
}
```

## Key Takeaways

- Use the **ternary operator** for simple conditional assignments
- Choose **for loops** when you know the number of iterations
- Use **for-each loops** for iterating through collections
- **break** exits a loop completely, **continue** skips to the next iteration
- Be mindful of **variable scope** - variables are only accessible within their declared region

In the next post, we'll explore Java arrays and collections in detail!

Happy coding!
