---
type: post
title: "Daily Java Challenge #4 - Square Root Calculation"
date: 2025-11-27 09:00:00 +0300
categories:
  - Java
  - Daily-Challenge
---

**Problem**: Write a Java program that calculates the square root of a number using both hardcoded values and user input.

## Solution
Here's my complete solution with user input functionality:

```java
// Basic version with hardcoded value
// public class Main {
//     public static void main(String[] args) {
//         double number = 16.0;
//         double squareRoot = Math.sqrt(number);
//         System.out.println("The square root of " + number + " is " + squareRoot);
//     }
// }

// Enhanced version with user input
import java.util.Scanner;
public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a number to calculate its square root: ");
        double number = scanner.nextDouble();

        double squareRoot = Math.sqrt(number);
        System.out.println("The square root of " + number + " is " + squareRoot);

        scanner.close(); // Clean up resources
    }
}
```

**Sample Output:**

```Enter a number to calculate its square root: 25
The square root of 25.0
is 5.0
```
**Explanation**
### Mathematical Formula:
The square root of a number \( x \) is a value \( y \) such that \( y^2 = x \). In Java, we can use the `Math.sqrt()` method to compute the square root.

### Hardcoded Version
In the basic version, we hardcode a number (e.g., 16) and calculate its square root using `Math.sqrt()`. This is useful for quick tests or examples.

### User Input Version
In the enhanced version, we use the `Scanner` class to read a number from the user
and then calculate its square root. This allows for dynamic input and makes the program more interactive.

### Conclusion
This program demonstrates how to calculate the square root of a number in Java, both with hardcoded values and user input. The use of `Math.sqrt()` simplifies the calculation, making it straightforward to implement and understand.

## What I Learned

- How to use the `Math.sqrt()` method for square root calculations.
- How to read user input using the `Scanner` class.

**📁 This code can be found at my:** [BlogCode Repository](https://github.com/0tieno/BlogCode/tree/main/2025-11-28-square-root)

Happy coding! 🎯
