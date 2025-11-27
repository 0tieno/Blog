---
type: post
title: "Daily Java Challenge #1 - Swap Two Variables"
date: 2025-11-26 09:00:00 +0300
categories:
  - Java
  - Daily-Challenge
---

**Problem**: Write a Java program that swaps the values of two variables without losing any data.

## Solution

Here's my solution using the classic temporary variable approach:

```java
public class Main {
    public static void main(String[] args) {
        // Example 1: Swapping integers
        // int a = 10;
        // int b = 5;
        //
        // int temp = a;
        // a = b;
        // b = temp;
        //
        // System.out.println("a = " + a + ", b = " + b);

        // Example 2: Swapping strings
        String a = "world!";
        String b = "Hello";

        String temp = a;
        a = b;
        b = temp;

        System.out.println("a = " + a + ", b = " + b);
    }
}
```

**Output:**

```
a = Hello, b = world!
```

## Explanation

The swapping process follows these steps:

1. **Store First Value**: Save the value of variable `a` in a temporary variable `temp`
2. **Move Second to First**: Assign the value of `b` to `a`
3. **Complete the Swap**: Assign the saved value (from `temp`) to `b`

**Visualization:**

```
Initial:  a = "world!"    b = "Hello"     temp = undefined
Step 1:   a = "world!"    b = "Hello"     temp = "world!"
Step 2:   a = "Hello"     b = "Hello"     temp = "world!"
Step 3:   a = "Hello"     b = "world!"    temp = "world!"
```

## Key Concepts Used

- **Variable Declaration**: Creating variables to store data
- **Assignment Operations**: Using `=` operator to assign values
- **Data Types**: Working with both `int` and `String` types
- **Temporary Storage**: Using an extra variable to preserve data during swapping

## Alternative Approaches

### For Numbers Only - Arithmetic Method:

```java
// Without temporary variable (integers only)
int a = 10, b = 5;
a = a + b;  // a = 15
b = a - b;  // b = 10 (original a)
a = a - b;  // a = 5 (original b)
```

### For Numbers Only - XOR Method:

```java
// Using bitwise XOR (integers only)
int a = 10, b = 5;
a = a ^ b;
b = a ^ b;
a = a ^ b;
```

## When to Use This

- Sorting algorithms (bubble sort, selection sort)
- Reversing arrays
- Rotating elements
- Any situation requiring value exchange

**Note**: The temporary variable method works with all data types and is the most readable approach!

**📁 This code can be found at:** [BlogCode Repository](https://github.com/0tieno/BlogCode/tree/main/2025-11-27-swap-two-variables)

Happy coding! 🎯
