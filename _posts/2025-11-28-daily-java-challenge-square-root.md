---
type: post
title: "Daily Java Challenge #4 - Square Root Calculation"
date: 2025-11-28 09:00:00 +0300
categories:
  - Java
  - Daily-Challenge
---

**Problem**: Write a Java program that calculates and displays the square root of a number using the Math.sqrt() method.

## Solution

Here's my solution based on the original challenge:

```java
//import static java.lang.Math.sqrt;

public class Main {
    public static void main(String[] args){
        double myNumber = 9;
        double result = Math.sqrt(myNumber);
        System.out.println(result);
    }
}

//You can use Math.sqrt() to find the square root of a number:
```

**Output:**

```
3.0
```

## Explanation

### Mathematical Concept:

The square root of a number ( x ) is a value ( y ) such that ( y^2 = x ). In Java, we can use the Math.sqrt() method to compute the square root.

For example: √9 = 3 because 3 × 3 = 9

### Program Flow:

1. **Declare Variable**: Store the number (9) in `myNumber`
2. **Calculate**: Use `Math.sqrt()` to find the square root
3. **Store Result**: Save the calculated value in `result`
4. **Display**: Print the result directly

### Key Points:

- **Math.sqrt()**: Built-in Java method for square root calculations
- **Double Data Type**: Handles decimal results accurately
- **Direct Output**: Simple `println()` displays the numerical result
- **Static Import**: The commented line shows alternative import syntax

## Key Concepts Used

- **Math Class**: Accessing mathematical functions in Java
- **Method Call**: Using `Math.sqrt()` with a parameter
- **Variable Assignment**: Storing calculation results
- **Data Types**: Working with `double` for precision

## Enhanced Versions

### With User Input:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a number: ");
        double myNumber = scanner.nextDouble();
        double result = Math.sqrt(myNumber);
        System.out.println("The square root of " + myNumber + " is " + result);

        scanner.close();
    }
}
```

### With Input Validation:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter a positive number: ");
        double myNumber = scanner.nextDouble();

        if (myNumber >= 0) {
            double result = Math.sqrt(myNumber);
            System.out.printf("√%.2f = %.2f%n", myNumber, result);
        } else {
            System.out.println("Error: Cannot calculate square root of negative numbers!");
        }

        scanner.close();
    }
}
```

### Multiple Calculations:

```java
public class SquareRootCalculator {
    public static void main(String[] args) {
        double[] numbers = {4, 9, 16, 25, 36};

        System.out.println("Square Root Calculations:");
        System.out.println("Number\t√Number");
        System.out.println("---------------");

        for (double num : numbers) {
            double result = Math.sqrt(num);
            System.out.printf("%.0f\t%.1f%n", num, result);
        }
    }
}
```

## Related Mathematical Functions

Once you master square root, explore these Math class methods:

- **Math.pow(x, y)**: Calculate x raised to power y
- **Math.cbrt(x)**: Calculate cube root
- **Math.abs(x)**: Get absolute value
- **Math.round(x)**: Round to nearest integer
- **Math.ceil(x)**: Round up
- **Math.floor(x)**: Round down

## Real-World Applications

- **Engineering**: Calculating distances and dimensions
- **Physics**: Working with formulas involving square roots
- **Statistics**: Computing standard deviation
- **Graphics**: Distance calculations in 2D/3D space
- **Finance**: Risk calculations and statistical analysis

## What I Learned

- The `Math.sqrt()` method is the standard way to calculate square roots
- `double` data type is essential for mathematical calculations
- Java's Math class provides many useful mathematical functions
- Simple variable assignment makes code readable
- Direct output is effective for basic calculations



**📁 This code can be found at:** [BlogCode Repository](https://github.com/0tieno/BlogCode/tree/main/2025-11-28-square-root)

Happy hacking! 🎯
