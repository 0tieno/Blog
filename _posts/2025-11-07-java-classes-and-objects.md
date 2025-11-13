---
layout: post
title: What are Classes and Objects?
date: 2025-11-09 12:24:59 +0300
categories:
  - Java
---

As we learned in the previous post, Java is an Object-Oriented Programming (OOP) language and Classes and objects are the two main aspects of object-oriented programming.

To repeat what we said in our last post, Everything in Java is associated with classes and objects, along with its attributes and methods. 

For example: in real life, a car is an object. The car has attributes, such as weight and color, and methods, such as drive and brake.

When the individual objects are created, they inherit all the variables (attributes) and methods from the class.

## Create a Class

To create a class, use the keyword `class`.

In this example, we create a class named "`Main`" with a variable x:

```java
public class Main {
  int x = 5;
}
```

## Create an Object
In java, an object is created from a class. We have already created the class `Main`, so now we can use this class to create an object.

To create an object of `Main`, specify the class name, followed by the object name, and use the keyword `new`:

```java
public class Main{
    int x = 5;
    public static void main(String[] args){
        Main myObj = new Main();
        System.out.println(myObj.x);
    }
}

//this will output 5
```

In the example above, we created an object named `myObj` of class `Main`. To access the variable `x`, we used the syntax `myObj.x`, which returns the value of `x`, which is 5.

That's it for now! In the next post, we will explore more about Java attributes and methods.

Happy hacking!


