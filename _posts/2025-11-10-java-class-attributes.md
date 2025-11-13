---
layout: post
title: Java Class Attributes
date: 2025-11-10 12:24:59 +0300
categories:
  - Java
---

In the previous post, we used the term "variable" for x in the example (as shown below). It is actually an attribute of the class. Or you could say that class attributes are variables within a class:

Create a class called "Main" with two attributes: x and y:

```java
public class Main {
  int x = 5;
  int y = 3;
}
```
Another term for class attributes is `fields`.

## Accessing Class Attributes

You can access attributes by creating an object of the class, and by using the `dot syntax (.)`:

The following example will create an object of the Main class, with the name `myObj`. We use the `x` attribute on the object to print its value:

Create an object called "`myObj`" and print the value of `x`:

```java

public class Main {
  int x = 5;

  public static void main(String[] args) {
    Main myObj = new Main();
    System.out.println(myObj.x);
  }
}
```

In the example above, we created an object named `myObj` of class `Main`. To access the variable `x`, we used the syntax `myObj.x`, which returns the value of `x`, which is 5.

That's it for now! In the next post, we will explore more about Java methods.

Happy hacking!