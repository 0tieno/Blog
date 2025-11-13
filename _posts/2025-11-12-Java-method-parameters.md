---
layout: post
title: Java Method Parameters
date: 2025-11-12 12:24:59 +0300
categories:
  - Java
---


In the previous post, we learned about Java class methods. Now, let's explore Java method parameters.

Method parameters are variables that are passed to a method when it is called. They allow you to pass data into a method so that the method can use that data to perform its task.

Parameters are specified after the method name, inside the parentheses. You can add as many parameters as you want, just separate them with a comma.

when a method is called, you need to pass arguments (the actual values) for each parameter.

Example:

Create a method that takes a parameter called `fname`:

```java
public class Main {
  static void myMethod(String fname) {
    System.out.println(fname + " , how are you?");
  }
}
```
Example Explained
`String fname` is the parameter of the method `myMethod()`. It is of type `String`, which means it can hold text values.

When you call the method, you need to pass an argument for the `fname` parameter:

```java
public class Main {
  static void myMethod(String fname) {
    System.out.println(fname + " , how are you?");
  }
}
  public static void main(String[] args) {
    myMethod("Liam");   // call the method with argument "Liam"
    myMethod("Jenny");  // call the method with argument "Jenny"
    myMethod("Anja");   // call the method with argument "Anja"
  }
}
``` 

In the example above, we created a method named `myMethod()` that takes a parameter `fname`. When we call the method, we pass different names as arguments, and the method prints a personalized greeting for each name.

That's it for now! In the next post, we will explore more about Java method return values.

Happy hacking!