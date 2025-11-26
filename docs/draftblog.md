# draftblog

Every line of code that runs in Java must be inside a `class`. The class name should always start with an uppercase first letter. In our example, we named the class **Main**.

A **computer program** is a list of "instructions" to be "executed" by a computer.

In a programming language, these programming instructions are called **statements**.

Text must be wrapped inside double quotations marks `""`.

If you forget the double quotes, an error occurs:

In Java, the `+` symbol has two meanings:

- For text (strings), it joins them together (called **concatenation**).
- For numbers, it adds values together.

All Java **variables** must be **identified** with **unique names**.

These unique names are called **identifiers**.

**Note:** By convention, final variables in Java are usually written in upper case (e.g. `BIRTHYEAR`). It is not required, but useful for code readability and common for many programmers.

If you really need to change between types, you must use [type casting](https://www.w3schools.com/java/java_type_casting.asp) or conversion methods (for example, turning an `int` into a `double`).

Use `float` or `double`?

The **precision** of a floating point value indicates how many digits the value can have after the decimal point. The precision of `float` is only 6-7 decimal digits, while `double` variables have a precision of about 16 digits.

Therefore it is safer to use `double` for most calculations.

You should use a floating point type whenever you need a number with a decimal, such as 9.99 or 3.14515.

A String in Java is actually a **non-primitive** data type, because it refers to an object. The String object has methods that are used to perform certain operations on strings.

The main differences between **primitive** and **non-primitive** data types are:

- Primitive types in Java are predefined and built into the language, while non-primitive types are created by the programmer (except for `String`).
- Non-primitive types can be used to call methods to perform certain operations, whereas primitive types cannot.
- Primitive types start with a lowercase letter (like `int`), while non-primitive types typically starts with an uppercase letter (like `String`).
- Primitive types always hold a value, whereas non-primitive types can be `null`.

Examples of non-primitive types are [Strings](https://www.w3schools.com/java/java_strings.asp), [Arrays](https://www.w3schools.com/java/java_arrays.asp), [Classes](https://www.w3schools.com/java/java_classes.asp) etc.

# The var Keyword

The `var` keyword was introduced in Java 10 (released in 2018).

The `var` keyword lets the compiler automatically detect the type of a variable based on the value you assign to it.

This helps you write cleaner code and avoid repeating types, especially for long or complex types.

# When to Use var

For simple variables, it's usually clearer to write the type directly (`int`, `double`, `char`, etc.).

But for more complex types, such as [`ArrayList`](https://www.w3schools.com/java/java_arraylist.asp) or [`HashMap`](https://www.w3schools.com/java/java_hashmap.asp), `var` can make the code shorter and easier to read:

```java
// Without var
ArrayList<String> cars = new ArrayList<String>();

// With var
var cars = new ArrayList<String>();
```

There is also a short-hand [if else](https://www.w3schools.com/java/java_conditions_else.asp), which is known as the **ternary operator** because it consists of three operands.

It can be used to replace multiple lines of code with a single line, and is most often used to replace simple if else statements:

*`variable = (condition) ? expressionTrue :  expressionFalse;`*

# Java For Loop

When you know exactly how many times you want to loop through a block of code, use the `for` loop instead of a [`while`](https://www.w3schools.com/java/java_while_loop.asp) loop:

**Good to Remember:**

- `break` = stop the loop completely.
- `continue` = skip this round, but keep looping.

# Java Arrays

Arrays are used to store multiple values in a single variable, instead of declaring separate variables for each value.

To declare an array, define the variable type with **square brackets** `[ ]` :

`String[] cars;`

`String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};`

`Int[] students = new Int[4];`

There is also a "**for-each**" loop, which is used exclusively to loop through elements in an array (or other [data structures](https://www.w3schools.com/java/java_data_structures.asp)):

**Syntax**

`for (*type* *variable* : *arrayname*) {
  // code block to be executed
}`

the colon (`:`) is read as "in". So you can read the loop as: *"for each variable in array"*.

The following example uses a **for-each** loop to print all elements in the **cars** array:

**Example**

`String[] cars = {"Volvo", "BMW", "Ford", "Mazda"};

for (String car : cars) {
  System.out.println(car);
}`

# Method Overloading

With **method overloading**, multiple methods can have the same name with different parameters:

**Example[Get your own Java Server](https://www.w3schools.com/java/java_server.asp)**

`int myMethod(int x)
float myMethod(float x)
double myMethod(double x, double y)`

**Note:** Multiple methods can have the same name as long as the number and/or type of parameters are different.

# Java Scope

In Java, variables are only accessible inside the region where they are created. This is called **scope**.

# Loop Scope

Variables declared inside a `for` loop only exist inside the loop:

# Class Scope

Variables declared inside a class but outside any method have **class scope** (also called fields). These variables can be accessed by all methods in the class:

# Java Recursion

Recursion is the technique of making a function call itself. This technique provides a way to break complicated problems down into simpler problems which are easier to solve.

# Java Constructors

A constructor in Java is a **special method** that is used to initialize objects.

The constructor is called when an object of a class is created.

It can be used to set initial values for object attributes:

Note that the constructor name must **match the class name**, and it cannot have a **return type** (like `void`).

Also note that the constructor is called when the object is created.

All classes have constructors by default: if you do not create a class constructor yourself, Java creates one for you. However, then you are not able to set initial values for object attributes.

# Encapsulation

The meaning of **Encapsulation**, is to make sure that "sensitive" data is hidden from users. To achieve this, you must:

- declare class variables/attributes as `private`
- provide public **get** and **set** methods to access and update the value of a `private` variable

The `get` method returns the variable value, and the `set` method sets the value.

Syntax for both is that they start with either `get` or `set`, followed by the name of the variable, with the first letter in upper case:

# Why Encapsulation?

- Better control of class attributes and methods
- Class attributes can be made **read-only** (if you only use the `get` method), or **write-only** (if you only use the `set` method)
- Flexible: the programmer can change one part of the code without affecting other parts
- Increased security of data

# Java Packages & API

A package in Java is used to group related classes. Think of it as **a folder in a file directory**. We use packages to avoid name conflicts, and to write a better maintainable code. Packages are divided into two categories:

- Built-in Packages (packages from the Java API)
- User-defined Packages (create your own packages)

The library is divided into **packages** and **classes**. Meaning you can either import a single class (along with its methods and attributes), or a whole package that contain all the classes that belong to the specified package.

To use a class or a package from the library, you need to use the `import` keyword:

# Syntax

```java
importpackage.name.Class;   // Import a single class
importpackage.name.*;   // Import the whole package
```

# Java Inheritance (Subclass and Superclass)

In Java, it is possible to inherit attributes and methods from one class to another. We group the "inheritance concept" into two categories:

- **subclass** (child) - the class that inherits from another class
- **superclass** (parent) - the class being inherited from

To inherit from a class, use the `extends` keyword.

```java
class Vehicle {
  protected String brand = "Ford";        // Vehicle attribute
  public void honk() {                    // Vehicle method
    System.out.println("Tuut, tuut!");
  }
}

class Car extends Vehicle {
  private String modelName = "Mustang";    // Car attribute
  public static void main(String[] args) {

    // Create a myCar object
    Car myCar = new Car();

    // Call the honk() method (from the Vehicle class) on the myCar object
    myCar.honk();

    // Display the value of the brand attribute (from the Vehicle class) and the value of the modelName from the Car class
    System.out.println(myCar.brand + " " + myCar.modelName);
  }
}
```

Did you notice the `protected` modifier in Vehicle?

We set the **brand** attribute in **Vehicle** to a `protected` [access modifier](https://www.w3schools.com/java/java_modifiers.asp). If it was set to `private`, the Car class would not be able to access it.

### Why And When To Use "Inheritance"?

- It is useful for code reusability: reuse attributes and methods of an existing class when you create a new class.

**Tip:** Also take a look at the next chapter, [Polymorphism](https://www.w3schools.com/java/java_polymorphism.asp), which uses inherited methods to perform different tasks.

# The final Keyword

If you don't want other classes to inherit from a class, use the `final` keyword:

If you try to access a `final` class, Java will generate an error:

```java
final class Vehicle {
  ...
}

class Car extends Vehicle {
  ...
}
```

# Java Polymorphism

Polymorphism means "many forms", and it occurs when we have many classes that are related to each other by inheritance.

Like we specified in the previous chapter; [**Inheritance**](https://www.w3schools.com/java/java_inheritance.asp) lets us inherit attributes and methods from another class. **Polymorphism** uses those methods to perform different tasks. This allows us to perform a single action in different ways.

For example, think of a superclass called `Animal` that has a method called `animalSound()`. Subclasses of Animals could be Pigs, Cats, Dogs, Birds - And they also have their own implementation of an animal sound (the pig oinks, and the cat meows, etc.):

### Why And When To Use "Inheritance" and "Polymorphism"?

- It is useful for code reusability: reuse attributes and methods of an existing class when you create a new class.

# Java super Keyword

In Java, the `super` keyword is used to refer to the **parent class** of a subclass.

The most common use of the `super` keyword is to eliminate the confusion between superclasses and subclasses that have methods with the same name.

It can be used in two main ways:

- To access attributes and methods from the parent class
- To call the parent class constructor

# Access Parent Methods

If a subclass has a method with the same name as one in its parent class, you can use `super` to call the parent version:

**Note:** Use `super` when you want to call a method from the parent class that has been overridden in the child class.

# Access Parent Attributes

You can also use `super` to access an attribute from the parent class if they have an attribute with the same name:

**Note:** The call to `super()` must be the **first statement** in the subclass constructor.

# Abstract Classes and Methods

Data **abstraction** is the process of hiding certain details and showing only essential information to the user.

Abstraction can be achieved with either **abstract classes** or [**interfaces**](https://www.w3schools.com/java/java_interface.asp) (which you will learn more about in the next chapter).

The `abstract` keyword is a non-access modifier, used for classes and methods:

- **Abstract class:** is a restricted class that cannot be used to create objects (to access it, it must be inherited from another class).
- **Abstract method:** can only be used in an abstract class, and it does not have a body. The body is provided by the subclass (inherited from).

  `// Abstract method (does not have a body)`

### Why And When To Use Abstract Classes and Methods?

To achieve security - hide certain details and only show the important details of an object.

**Note:** Abstraction can also be achieved with [Interfaces](https://www.w3schools.com/java/java_interface.asp), which you will learn more about in the next chapter.

# Interfaces

Another way to achieve [abstraction](https://www.w3schools.com/java/java_abstract.asp) in Java, is with interfaces.

An `interface` is a completely "**abstract class**" that is used to group related methods with empty bodies:

```java
// interface
interface Animal {
  public void animalSound(); // interface method (does not have a body)
  public void run(); // interface method (does not have a body)
}
```

To access the interface methods, the interface must be "implemented" (kinda like inherited) by another class with the `implements` keyword (instead of `extends`). The body of the interface method is provided by the "implement" class:

```java
// Interface
interface Animal {
  public void animalSound(); // interface method (does not have a body)
  public void sleep(); // interface method (does not have a body)
}

// Pig "implements" the Animal interface
class Pig implements Animal {
  public void animalSound() {
    // The body of animalSound() is provided here
    System.out.println("The pig says: wee wee");
  }
  public void sleep() {
    // The body of sleep() is provided here
    System.out.println("Zzz");
  }
}

class Main {
  public static void main(String[] args) {
    Pig myPig = new Pig();  // Create a Pig object
    myPig.animalSound();
    myPig.sleep();
  }
}
```

### Notes on Interfaces:

- Like **abstract classes**, interfaces **cannot** be used to create objects (in the example above, it is not possible to create an "Animal" object in the MyMainClass)
- Interface methods do not have a body - the body is provided by the "implement" class
- On implementation of an interface, you must override all of its methods
- Interface methods are by default `abstract` and `public`
- Interface attributes are by default `public`, `static` and `final`
- An interface cannot contain a constructor (as it cannot be used to create objects)

### Why And When To Use Interfaces?

1) To achieve security - hide certain details and only show the important details of an object (interface).

2) Java does not support "multiple inheritance" (a class can only inherit from one superclass). However, it can be achieved with interfaces, because the class can **implement** multiple interfaces. **Note:** To implement multiple interfaces, separate them with a comma (see example below).

# Enums

An `enum` is a special "class" that represents a group of **constants** (unchangeable variables, like `final` variables).

To create an `enum`, use the `enum` keyword (instead of class or interface), and separate the constants with a comma. Note that they should be in uppercase letters:

```java
enum Level {
  LOW,
  MEDIUM,
  HIGH
}
```

**Enum** is short for "enumerations", which means "specifically listed".

### Why And When To Use Enums?

Use enums when you have values that you know aren't going to change, like month days, days, colors, deck of cards, etc.

# Java Dates

Java does not have a built-in Date class, but we can import the `java.time` package to work with the date and time API. The package includes many date and time classes. For example:

| Class | Description |
| --- | --- |
| `LocalDate` | Represents a date (year, month, day (yyyy-MM-dd)) |
| `LocalTime` | Represents a time (hour, minute, second and nanoseconds (HH-mm-ss-ns)) |
| `LocalDateTime` | Represents both a date and a time (yyyy-MM-dd-HH-mm-ss-ns) |
| `DateTimeFormatter` | Formatter for displaying and parsing date-time objects |

```java
import java.time.LocalDate; // import the LocalDate class

public class Main {
  public static void main(String[] args) {
    LocalDate myObj = LocalDate.now(); // Create a date object
    System.out.println(myObj); // Display the current date
  }
}
```

```java
import java.time.LocalTime; // import the LocalTime class

public class Main {
  public static void main(String[] args) {
    LocalTime myObj = LocalTime.now();
    System.out.println(myObj);
  }
}
```

```java
import java.time.LocalDateTime; // import the LocalDateTime class

public class Main {
  public static void main(String[] args) {
    LocalDateTime myObj = LocalDateTime.now();
    System.out.println(myObj);
  }
}
```

# Formatting Date and Time

The "T" in the example above is used to separate the date from the time. You can use the `DateTimeFormatter` class with the `ofPattern()` method in the same package to format or parse date-time objects. The following example will remove both the "T" and nanoseconds from the date-time:

```java
import java.time.LocalDateTime; // Import the LocalDateTime class
import java.time.format.DateTimeFormatter; // Import the DateTimeFormatter class

public class Main {
  public static void main(String[] args) {
    LocalDateTime myDateObj = LocalDateTime.now();
    System.out.println("Before formatting: " + myDateObj);
    DateTimeFormatter myFormatObj = DateTimeFormatter.ofPattern("dd-MM-yyyy HH:mm:ss");

    String formattedDate = myDateObj.format(myFormatObj);
    System.out.println("After formatting: " + formattedDate);
  }
}

```

The output will be:

`Before Formatting: 2025-11-26T13:17:33.263199After Formatting: 26-11-2025 13:17:33`

# Java Errors

Even experienced Java developers make mistakes. The key is learning how to **spot** and **fix** them!

These pages cover common errors and helpful debugging tips to help you understand what's going wrong and how to fix it.

---

# Types of Errors in Java

| Error Type | Description |
| --- | --- |
| Compile-Time Error | Detected by the compiler. Prevents code from running. |
| Runtime Error | Occurs while the program is running. Often causes crashes. |
| Logical Error | Code runs but gives incorrect results. Hardest to find. |

# Good Habits to Avoid Errors

- Use meaningful variable names
- Read the error message carefully. What line does it mention?
- Check for missing semicolons or braces
- Look for typos in variable or method names

# Debugging Checklist

- Read the full error message, it often tells you exactly what's wrong
- Check if all variables are initialized before use
- Print variable values to trace the problem
- Watch for off-by-one errors in loops and arrays
- Comment out sections of code to find bugs

# Java Exceptions

As mentioned in the [Errors chapter](https://www.w3schools.com/java/java_errors.asp), different types of errors can occur while running a program - such as coding mistakes, invalid input, or unexpected situations.

When an error occurs, Java will normally stop and generate an error message. The technical term for this is: Java will throw an **exception** (throw an error).

# Exception Handling (try and catch)

Exception handling lets you catch and handle errors during runtime - so your program doesn't crash.

It uses different keywords:

The `try` statement allows you to define a block of code to be tested for errors while it is being executed.

The `catch` statement allows you to define a block of code to be executed, if an error occurs in the try block.

The `try` and `catch` keywords come in pairs:

# Finally

The `finally` statement lets you execute code, after `try...catch`, regardless of the result:

# The throw keyword

The `throw` statement allows you to create a custom error.

The `throw` statement is used together with an **exception type**. There are many exception types available in Java: `ArithmeticException`, `FileNotFoundException`, `ArrayIndexOutOfBoundsException`, `SecurityException`, etc:

# Example

Throw an exception if **age** is below 18 (print "Access denied"). If age is 18 or older, print "Access granted":

```java
public class Main {
  static void checkAge(int age) {
    if (age < 18) {
      throw new ArithmeticException("Access denied - You must be at least 18 years old.");
    }
    else {
      System.out.println("Access granted - You are old enough!");
    }
  }

  public static void main(String[] args) {
    checkAge(15); // Set age to 15 (which is below 18...)
  }
}
```

# Java Data Structures

Data structures are ways to store and organize data so you can use it efficiently.

An [array](https://www.w3schools.com/java/java_arrays.asp) is an example of a data structure, which allows multiple elements to be stored in a single variable.

Some of the most common are:

- `ArrayList`
- `HashSet`
- `HashMap`

**Tip:** Data structures are like supercharged arrays - more flexible and feature-rich!

# ArrayList

An `ArrayList` is a resizable array that can grow as needed.

It allows you to store elements and access them by index.

```java
// Import the ArrayList class
import java.util.ArrayList;

public class Main {
  public static void main(String[] args) {
    ArrayList<String> cars = new ArrayList<String>();
    cars.add("Volvo");
    cars.add("BMW");
    cars.add("Ford");
    cars.add("Mazda");
    System.out.println(cars);
}}
```

# Data Structures Overview

| Data Structure | Stores | Keeps Order? | Allows Duplicates? | Best For |
| --- | --- | --- | --- | --- |
| ArrayList | Ordered elements | Yes | Yes | Accessing elements by index |
| HashSet | Unique elements | No | No | Avoiding duplicates, fast checks |
| HashMap | Key-value pairs | No | Yes (keys are unique) | Fast lookup by key |

# Iterators

When learning about data structures, you will often hear about iterators too.

An iterator is a way to loop through elements in a data structure.

It is called an "iterator" because "iterating" is the technical term for looping.