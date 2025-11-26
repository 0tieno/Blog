---
type: post
title: Java Arrays and Collections
date: 2025-11-16 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore Java arrays and collections - essential data structures that allow you to store and manipulate multiple values efficiently.

## Java Arrays

Arrays are used to store multiple values in a single variable, instead of declaring separate variables for each value.

### Declaring and Initializing Arrays

To declare an array, define the variable type with **square brackets** `[ ]`:

```java
String[] cars;
```

You can initialize arrays in several ways:

```java
// Method 1: Initialize with values
String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};

// Method 2: Declare size first, then assign values
String[] cars = new String[4];
cars[0] = "Volvo";
cars[1] = "BMW";
cars[2] = "Ford";
cars[3] = "Mazda";

// Method 3: For numeric arrays
int[] students = new int[4];
```

### Accessing Array Elements

```java
public class Main {
    public static void main(String[] args) {
        String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};

        System.out.println(cars[0]); // Outputs: Volvo
        System.out.println(cars.length); // Outputs: 4

        // Modify an element
        cars[0] = "Tesla";
        System.out.println(cars[0]); // Outputs: Tesla
    }
}
```

### Looping Through Arrays

**Traditional For Loop:**

```java
public class Main {
    public static void main(String[] args) {
        String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};

        for (int i = 0; i < cars.length; i++) {
            System.out.println(cars[i]);
        }
    }
}
```

**Enhanced For Loop (For-Each):**

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

The colon (`:`) is read as "in". So you can read the loop as: _"for each car in cars"_.

In the next post, we'll dive into Object-Oriented Programming concepts in Java!

Happy coding!
