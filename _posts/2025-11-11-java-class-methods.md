---
layout: post
title: Java Class Methods
date: 2025-11-11 12:24:59 +0300
categories:
  - Java
---

In the previous post, we learned about Java class attributes. Now, let's explore Java class methods.

A method is a block of code which only runs when it is called.

You can pass data, known as parameters, into a method.

Methods are used to perform certain actions, and they are also known as `functions`.

Why use methods? To reuse code: define the code once, and use it many times.

Methods are declared within a class, and they are used to perform certain actions.

Example:

Create a method inside Main:

```java
public class Main {
  static void myMethod() {
    // code to be executed
  }
}
```

Example Explained

`myMethod()` is the name of the method.

`static` means that the method belongs to the Main class and not an object of the Main class.

`void` means that this method does not have a return value. 

## Call a Method
To call a method in Java, write the method's name followed by two parentheses () and a semicolon;

```java
public class Main {
  static void myMethod() {
    System.out.println("Hello World!");
  }
}
  public static void main(String[] args) {
    myMethod(); // call the method
  }
}
```

In the example above, we created a method named `myMethod()`, which prints "Hello World!" to the console. We then called this method inside the `main` method to execute it.

That's it for now! In the next post, we will explore more about Java method parameters and return values.

Happy hacking!