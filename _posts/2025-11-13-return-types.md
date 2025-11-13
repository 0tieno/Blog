---
type: post
title: Java Return Values
date: 2025-11-13 12:24:59 +0300
categories:
  - Java
---

In the previous post, we learned about Java method parameters and we used the void keyword in all examples (like static void myMethod(int x)), which indicates that the method should not return a value.

If you want the method to return a value, you can use a primitive data type (such as int, char, etc.) instead of void, and use the return keyword inside the method:

Example:

```java
public class Main {
  static int myMethod(int x) {
    return 5 + x;
  }

  public static void main(String[] args) {
    System.out.println(myMethod(3));
  }
}
// Outputs 8 (5 + 3)
```

In the example above, we created a method named `myMethod()` that takes an integer parameter `x`. The method returns the value of `5 + x` using the `return` keyword. In the `main` method, we called `myMethod(3)`, which returns `8`, and we printed that value to the console.

That's it for now! In the next post, see you tomorrow!

Happy hacking!