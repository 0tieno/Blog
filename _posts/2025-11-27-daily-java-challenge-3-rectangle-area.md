---
type: post
title: "Daily Java Challenge #3 - Calculate Rectangle Area"
date: 2025-11-27 09:00:00 +0300
categories:
  - Java
  - Daily-Challenge
---

**Problem**: Write a Java program that calculates the area of a rectangle given its length and width. Include both hardcoded values and user input versions.

## Solution

Here's my complete solution with user input functionality:

```java
// Basic version with hardcoded values
// public class Main {
//     public static void main(String[] args) {
//         double length = 5.0;
//         double width = 3.0;
//         double area = length * width;
//         System.out.println("The area of the rectangle is " + area + "cm²");
//     }
// }

// Enhanced version with user input
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.print("Enter the length of the rectangle in cm: ");
        double length = scanner.nextDouble();

        System.out.print("Enter the width of the rectangle in cm: ");
        double width = scanner.nextDouble();

        double area = length * width;
        System.out.println("The area of the rectangle is " + area + "cm²");

        scanner.close(); // Clean up resources
    }
}
```

**Sample Output:**

```
Enter the length of the rectangle in cm: 7.5
Enter the width of the rectangle in cm: 4.2
The area of the rectangle is 31.5cm²
```

## Explanation

### Mathematical Formula:

**Area of Rectangle = Length × Width**

### Program Flow:

1. **Import Scanner**: Enable user input functionality
2. **Get Length**: Prompt user for rectangle length
3. **Get Width**: Prompt user for rectangle width
4. **Calculate Area**: Multiply length by width using `*` operator
5. **Display Result**: Show the calculated area with proper units
6. **Cleanup**: Close scanner to free system resources

### Key Points:

- **Data Type Choice**: Using `double` allows for decimal measurements
- **Direct Calculation**: Computing area inline in the print statement
- **Unit Display**: Including "cm²" makes the output meaningful
- **User Experience**: Clear prompts guide user input

## Key Concepts Used

- **Arithmetic Operations**: Multiplication using `*` operator
- **Double Data Type**: Handling decimal numbers for precise measurements
- **Scanner.nextDouble()**: Reading decimal input from user
- **Mathematical Formulas**: Implementing geometric calculations
- **String Concatenation**: Combining text, numbers, and units

## Enhanced Versions

### With Input Validation:

```java
import java.util.Scanner;

public class Main {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        double length = getPositiveInput(scanner, "Enter the length in cm: ");
        double width = getPositiveInput(scanner, "Enter the width in cm: ");

        double area = length * width;
        System.out.printf("The area of the rectangle is %.2f cm²%n", area);

        scanner.close();
    }

    public static double getPositiveInput(Scanner scanner, String prompt) {
        double value;
        do {
            System.out.print(prompt);
            value = scanner.nextDouble();
            if (value <= 0) {
                System.out.println("Please enter a positive number!");
            }
        } while (value <= 0);
        return value;
    }
}
```

### Multiple Shape Calculator:

```java
import java.util.Scanner;

public class ShapeCalculator {
    public static void main(String[] args) {
        Scanner scanner = new Scanner(System.in);

        System.out.println("Shape Area Calculator");
        System.out.println("1. Rectangle");
        System.out.println("2. Square");
        System.out.print("Choose option (1-2): ");

        int choice = scanner.nextInt();

        switch (choice) {
            case 1:
                calculateRectangleArea(scanner);
                break;
            case 2:
                calculateSquareArea(scanner);
                break;
            default:
                System.out.println("Invalid choice!");
        }

        scanner.close();
    }

    public static void calculateRectangleArea(Scanner scanner) {
        System.out.print("Enter length: ");
        double length = scanner.nextDouble();
        System.out.print("Enter width: ");
        double width = scanner.nextDouble();

        double area = length * width;
        System.out.printf("Rectangle area: %.2f cm²%n", area);
    }

    public static void calculateSquareArea(Scanner scanner) {
        System.out.print("Enter side length: ");
        double side = scanner.nextDouble();

        double area = side * side;
        System.out.printf("Square area: %.2f cm²%n", area);
    }
}
```

## Related Geometric Formulas

Once you master rectangle area, try these:

- **Square Area**: `side × side`
- **Triangle Area**: `(base × height) / 2`
- **Circle Area**: `π × radius²`
- **Rectangle Perimeter**: `2 × (length + width)`

## Real-World Applications

- **Construction**: Calculating floor space, wall areas
- **Gardening**: Planning garden bed sizes
- **Interior Design**: Determining carpet or tile requirements
- **Manufacturing**: Material usage calculations
- **Real Estate**: Property size calculations

## What I Learned

- Geometric calculations translate directly into code
- `double` data type is essential for measurements
- User input validation improves program reliability
- Printf formatting (`%.2f`) creates cleaner output
- Breaking code into methods improves organization


**📁 This code can be found at my:** [BlogCode Repository](https://github.com/0tieno/BlogCode/tree/main/2025-11-26-rectangle-area)

Happy coding! 🎯
