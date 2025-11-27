---
type: post
title: "Daily Java Challenge #2 - Add Two Numbers"
date: 2025-11-26 09:00:00 +0300
categories:
  - Java
  - Daily-Challenge
---

**Problem**: Write a Java program that adds two numbers and displays the result. Include both hardcoded values and user input versions.

## Solution

Here's my complete solution with user input functionality:

```java
// Basic version with hardcoded values
// public class Main {
//     public static void main(String[] args){
//         int x = 5;
//         int y = 10;
//         int sum = x + y;
//
//         System.out.println("The sum of " + x + " and " + y + " is: " + sum);
//     }
// }

// Enhanced version with user input
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter first number: ");
        int x = scanner.nextInt();

        System.out.print("Enter second number: ");
        int y = scanner.nextInt();

        int sum = x + y;
        System.out.println("The sum of " + x + " and " + y + " is: " + sum);

        scanner.close(); // Good practice to close scanner
    }
}
```

**Sample Output:**

```
Enter first number: 15
Enter second number: 25
The sum of 15 and 25 is: 40
```

## Explanation

### Basic Version:

1. **Variable Declaration**: Create two integer variables `x` and `y`
2. **Assignment**: Store values directly in the variables
3. **Calculation**: Use the `+` operator to add the numbers
4. **Output**: Display the result using string concatenation

### Enhanced Version with User Input:

1. **Import Scanner**: Import `java.util.Scanner` for user input
2. **Create Scanner Object**: Initialize scanner to read from `System.in`
3. **Prompt User**: Display messages asking for input
4. **Read Input**: Use `scanner.nextInt()` to capture integer input
5. **Process**: Perform the same addition operation
6. **Display Result**: Show the calculated sum
7. **Resource Management**: Close the scanner to free resources

## Key Concepts Used

- **Arithmetic Operations**: Using the `+` operator for addition
- **Variable Declaration and Initialization**: Creating and storing values
- **Scanner Class**: Reading user input from console
- **String Concatenation**: Combining strings and numbers for output
- **Resource Management**: Properly closing Scanner objects

## Variations and Extensions

### Working with Different Data Types:

```java
// Adding decimal numbers
double x = 5.5;
double y = 3.2;
double sum = x + y;
System.out.println("Sum: " + sum); // Output: 8.7
```

### Adding Multiple Numbers:

```java
Scanner scanner = new Scanner(System.in);
System.out.print("How many numbers? ");
int count = scanner.nextInt();

int sum = 0;
for (int i = 1; i <= count; i++) {
    System.out.print("Enter number " + i + ": ");
    sum += scanner.nextInt();
}

System.out.println("Total sum: " + sum);
```

### Error Handling:

```java
Scanner scanner = new Scanner(System.in);
try {
    System.out.print("Enter first number: ");
    int x = scanner.nextInt();

    System.out.print("Enter second number: ");
    int y = scanner.nextInt();

    System.out.println("Sum: " + (x + y));
} catch (Exception e) {
    System.out.println("Please enter valid integers!");
} finally {
    scanner.close();
}
```

## Real-World Applications

- Calculator applications
- Financial calculations (bills, budgets)
- Score tracking in games
- Inventory management systems
- Statistical computations

## What I Learned

- Scanner class is essential for interactive programs
- Always close resources to prevent memory leaks
- String concatenation automatically converts numbers to strings
- User input makes programs more dynamic and useful

**📁 This code can be found at my:** [BlogCode Repository](https://github.com/0tieno/BlogCode/tree/main/2025-11-26-add-two-numbers)

Happy coding! 🎯
