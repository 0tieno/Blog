---
type: post
title: User Inputs in Java
date: 2025-11-13 12:30:00 +0300
categories:
  - Java
---

In this post, we will learn how to take user inputs in Java using the `Scanner` class.

The Scanner class is used to get user input, and it is found in the java.util package.

To use the Scanner class, create an object of the class and use any of the available methods found in the Scanner class documentation. In our example, we will use the nextLine() method, which is used to read Strings:

Example:

```java
import java.util.Scanner;  // Import the Scanner class
public class Main {
  public static void main(String[] args) {
    Scanner scanner = new Scanner(System.in);  // Create a Scanner object
    System.out.println("Enter your name:");   // Prompt the user for input
    String userName = scanner.nextLine();      // Read user input and store it in a variable
    System.out.println("Hello, " + userName);  // Output user input
    scanner.close();                           // Close the scanner
  }
}
```

In the example above, we first import the `Scanner` class from the `java.util` package. We then create a `Scanner` object named `scanner` to read input from the standard input stream (keyboard). We prompt the user to enter their name, read the input using `nextLine()`, and store it in the variable `userName`. Finally, we print a greeting message that includes the user's name.

## Input Types

In the example above, we used the nextLine() method, which is used to read Strings. To read other types, look at the table below:

| Method        | Description                         |
| ------------- | ----------------------------------- |
| nextBoolean() | Reads a boolean value from the user |
| nextByte()    | Reads a byte value from the user    |
| nextDouble()  | Reads a double value from the user  |
| nextFloat()   | Reads a float value from the user   |
| nextInt()     | Reads a int value from the user     |
| nextLine()    | Reads a String value from the user  |
| nextLong()    | Reads a long value from the user    |
| nextShort()   | Reads a short value from the user   |

That's it for now! See you in the next post!

Happy hacking!
