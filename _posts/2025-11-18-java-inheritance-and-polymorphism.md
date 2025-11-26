---
type: post
title: Java Inheritance and Polymorphism
date: 2025-11-18 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore two fundamental pillars of Object-Oriented Programming: inheritance and polymorphism. These concepts allow you to create more flexible, reusable, and maintainable code.

## Java Inheritance (Subclass and Superclass)

In Java, it is possible to inherit attributes and methods from one class to another. We group the "inheritance concept" into two categories:

- **subclass** (child) - the class that inherits from another class
- **superclass** (parent) - the class being inherited from

To inherit from a class, use the `extends` keyword.

```java
class Vehicle {
    protected String brand = "Ford";        // Vehicle attribute
    public void honk() {                    // Vehicle method
        System.out.println("Tuut, tuut!");
    }
}

class Car extends Vehicle {
    private String modelName = "Mustang";    // Car attribute

    public void displayInfo() {
        System.out.println(brand + " " + modelName);
    }

    public static void main(String[] args) {
        // Create a myCar object
        Car myCar = new Car();

        // Call the honk() method (from the Vehicle class) on the myCar object
        myCar.honk();

        // Display the value of the brand attribute (from the Vehicle class)
        // and the value of the modelName from the Car class
        myCar.displayInfo();
    }
}
```

Did you notice the `protected` modifier in Vehicle?

We set the **brand** attribute in **Vehicle** to a `protected` access modifier. If it was set to `private`, the Car class would not be able to access it.

### Why And When To Use "Inheritance"?

- It is useful for code reusability: reuse attributes and methods of an existing class when you create a new class.

## The final Keyword

If you don't want other classes to inherit from a class, use the `final` keyword:

```java
final class Vehicle {
    protected String brand = "Ford";
    public void honk() {
        System.out.println("Tuut, tuut!");
    }
}

// This would cause an error:
// class Car extends Vehicle {
//     ...
// }
```

If you try to access a `final` class, Java will generate an error.

## Java Polymorphism

Polymorphism means "many forms", and it occurs when we have many classes that are related to each other by inheritance.

Like we specified in the previous chapter; **Inheritance** lets us inherit attributes and methods from another class. **Polymorphism** uses those methods to perform different tasks. This allows us to perform a single action in different ways.

For example, think of a superclass called `Animal` that has a method called `animalSound()`. Subclasses of Animals could be Pigs, Cats, Dogs, Birds - And they also have their own implementation of an animal sound (the pig oinks, and the cat meows, etc.):

```java
// Superclass
class Animal {
    public void animalSound() {
        System.out.println("The animal makes a sound");
    }
}

// Subclasses
class Pig extends Animal {
    public void animalSound() {
        System.out.println("The pig says: wee wee");
    }
}

class Dog extends Animal {
    public void animalSound() {
        System.out.println("The dog says: bow wow");
    }
}

class Cat extends Animal {
    public void animalSound() {
        System.out.println("The cat says: meow");
    }
}

class Main {
    public static void main(String[] args) {
        Animal myAnimal = new Animal();  // Create an Animal object
        Animal myPig = new Pig();        // Create a Pig object
        Animal myDog = new Dog();        // Create a Dog object
        Animal myCat = new Cat();        // Create a Cat object

        myAnimal.animalSound();
        myPig.animalSound();
        myDog.animalSound();
        myCat.animalSound();
    }
}
```

### Why And When To Use "Inheritance" and "Polymorphism"?

- It is useful for code reusability: reuse attributes and methods of an existing class when you create a new class.

## Java super Keyword

In Java, the `super` keyword is used to refer to the **parent class** of a subclass.

The most common use of the `super` keyword is to eliminate the confusion between superclasses and subclasses that have methods with the same name.

It can be used in two main ways:

- To access attributes and methods from the parent class
- To call the parent class constructor

### Access Parent Methods

If a subclass has a method with the same name as one in its parent class, you can use `super` to call the parent version:

```java
class Vehicle {
    public void start() {
        System.out.println("Vehicle is starting...");
    }
}

class Car extends Vehicle {
    public void start() {
        super.start(); // Call parent method
        System.out.println("Car engine is running!");
    }

    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.start();
    }
}
```

**Note:** Use `super` when you want to call a method from the parent class that has been overridden in the child class.

### Access Parent Attributes

You can also use `super` to access an attribute from the parent class if they have an attribute with the same name:

```java
class Vehicle {
    protected String brand = "Generic Vehicle";
}

class Car extends Vehicle {
    private String brand = "Car Brand";

    public void displayBrands() {
        System.out.println("Car brand: " + brand);
        System.out.println("Vehicle brand: " + super.brand);
    }

    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.displayBrands();
    }
}
```

### Calling Parent Constructor

```java
class Vehicle {
    protected String brand;
    protected int year;

    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
        System.out.println("Vehicle constructor called");
    }
}

class Car extends Vehicle {
    private String model;

    public Car(String brand, int year, String model) {
        super(brand, year); // Call parent constructor
        this.model = model;
        System.out.println("Car constructor called");
    }

    public void displayInfo() {
        System.out.println(year + " " + brand + " " + model);
    }

    public static void main(String[] args) {
        Car myCar = new Car("Toyota", 2023, "Camry");
        myCar.displayInfo();
    }
}
```

**Note:** The call to `super()` must be the **first statement** in the subclass constructor.

## Abstract Classes and Methods

Data **abstraction** is the process of hiding certain details and showing only essential information to the user.

Abstraction can be achieved with either **abstract classes** or **interfaces**.

The `abstract` keyword is a non-access modifier, used for classes and methods:

- **Abstract class:** is a restricted class that cannot be used to create objects (to access it, it must be inherited from another class).
- **Abstract method:** can only be used in an abstract class, and it does not have a body. The body is provided by the subclass (inherited from).

```java
// Abstract class
abstract class Animal {
    // Abstract method (does not have a body)
    public abstract void animalSound();

    // Regular method
    public void sleep() {
        System.out.println("Zzz");
    }
}

// Subclass (inherit from Animal)
class Pig extends Animal {
    public void animalSound() {
        // The body of animalSound() is provided here
        System.out.println("The pig says: wee wee");
    }
}

class Main {
    public static void main(String[] args) {
        Pig myPig = new Pig(); // Create a Pig object
        myPig.animalSound();
        myPig.sleep();
    }
}
```

### Why And When To Use Abstract Classes and Methods?

To achieve security - hide certain details and only show the important details of an object.

**Note:** Abstraction can also be achieved with Interfaces, which you will learn more about in the next chapter.

## Interfaces

Another way to achieve abstraction in Java, is with interfaces.

An `interface` is a completely "**abstract class**" that is used to group related methods with empty bodies:

```java
// interface
interface Animal {
    public void animalSound(); // interface method (does not have a body)
    public void run(); // interface method (does not have a body)
}
```

To access the interface methods, the interface must be "implemented" (kinda like inherited) by another class with the `implements` keyword (instead of `extends`). The body of the interface method is provided by the "implement" class:

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

- Like **abstract classes**, interfaces **cannot** be used to create objects
- Interface methods do not have a body - the body is provided by the "implement" class
- On implementation of an interface, you must override all of its methods
- Interface methods are by default `abstract` and `public`
- Interface attributes are by default `public`, `static` and `final`
- An interface cannot contain a constructor (as it cannot be used to create objects)

### Why And When To Use Interfaces?

1. To achieve security - hide certain details and only show the important details of an object (interface).

2. Java does not support "multiple inheritance" (a class can only inherit from one superclass). However, it can be achieved with interfaces, because the class can **implement** multiple interfaces. **Note:** To implement multiple interfaces, separate them with a comma.

```java
interface FirstInterface {
    public void myMethod();
}

interface SecondInterface {
    public void myOtherMethod();
}

class DemoClass implements FirstInterface, SecondInterface {
    public void myMethod() {
        System.out.println("Some text..");
    }

    public void myOtherMethod() {
        System.out.println("Some other text...");
    }
}

class Main {
    public static void main(String[] args) {
        DemoClass myObj = new DemoClass();
        myObj.myMethod();
        myObj.myOtherMethod();
    }
}
```

## Practical Example: Shape Hierarchy

Let's create a comprehensive example that demonstrates inheritance, polymorphism, and abstraction:

```java
// Abstract base class
abstract class Shape {
    protected String color;

    public Shape(String color) {
        this.color = color;
    }

    // Abstract method - must be implemented by subclasses
    public abstract double calculateArea();

    // Concrete method - inherited by all subclasses
    public void displayInfo() {
        System.out.println("This is a " + color + " shape with area: " + calculateArea());
    }
}

// Interface for shapes that can be rotated
interface Rotatable {
    void rotate(double degrees);
}

// Circle class
class Circle extends Shape implements Rotatable {
    private double radius;

    public Circle(String color, double radius) {
        super(color);
        this.radius = radius;
    }

    @Override
    public double calculateArea() {
        return Math.PI * radius * radius;
    }

    @Override
    public void rotate(double degrees) {
        System.out.println("Circle rotated " + degrees + " degrees (no visual change)");
    }
}

// Rectangle class
class Rectangle extends Shape implements Rotatable {
    private double width;
    private double height;

    public Rectangle(String color, double width, double height) {
        super(color);
        this.width = width;
        this.height = height;
    }

    @Override
    public double calculateArea() {
        return width * height;
    }

    @Override
    public void rotate(double degrees) {
        System.out.println("Rectangle rotated " + degrees + " degrees");
        // In a real implementation, you might swap width and height for 90-degree rotations
    }
}

class Main {
    public static void main(String[] args) {
        // Polymorphism in action - same reference type, different objects
        Shape[] shapes = {
            new Circle("Red", 5.0),
            new Rectangle("Blue", 4.0, 6.0),
            new Circle("Green", 3.0)
        };

        // Process all shapes polymorphically
        for (Shape shape : shapes) {
            shape.displayInfo(); // Calls appropriate calculateArea() method

            // Check if shape can be rotated
            if (shape instanceof Rotatable) {
                ((Rotatable) shape).rotate(45);
            }
        }
    }
}
```

## Key Concepts Summary

1. **Inheritance**: Use `extends` to create child classes that inherit parent functionality
2. **Polymorphism**: Same method call produces different behavior based on object type
3. **Abstract Classes**: Cannot be instantiated, may contain abstract methods
4. **Interfaces**: Contract that implementing classes must follow
5. **super Keyword**: Access parent class methods, attributes, and constructors
6. **final Keyword**: Prevents inheritance when applied to classes

These concepts work together to create flexible, maintainable, and reusable code!

**Note:** This comprehensive topic has been split into more focused posts: [Java Inheritance Basics](/Blog/java-inheritance-basics), Java Abstract Classes and Interfaces (coming soon), and Java Polymorphism in Action (coming soon) for better learning.

Happy coding!
