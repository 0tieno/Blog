---
type: post
title: Java Inheritance Basics
date: 2025-11-23 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore one of the fundamental pillars of Object-Oriented Programming: inheritance. Inheritance allows you to create new classes based on existing ones, promoting code reuse and establishing relationships between classes.

## What is Inheritance?

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

## Access Modifiers and Inheritance

Did you notice the `protected` modifier in Vehicle?

We set the **brand** attribute in **Vehicle** to a `protected` access modifier. If it was set to `private`, the Car class would not be able to access it.

### Access Modifier Summary

| Modifier    | Same Class | Same Package | Subclass | Other Classes |
| ----------- | ---------- | ------------ | -------- | ------------- |
| `private`   | ✅         | ❌           | ❌       | ❌            |
| `default`   | ✅         | ✅           | ❌       | ❌            |
| `protected` | ✅         | ✅           | ✅       | ❌            |
| `public`    | ✅         | ✅           | ✅       | ✅            |

```java
class Animal {
    private String species = "Unknown";      // Only accessible within Animal class
    protected String name = "Animal";        // Accessible in subclasses
    public int age = 0;                      // Accessible everywhere
    String habitat = "Wild";                 // Package-private (default)

    public void displayInfo() {
        System.out.println("Species: " + species);  // Can access private here
        System.out.println("Name: " + name);
        System.out.println("Age: " + age);
        System.out.println("Habitat: " + habitat);
    }
}

class Dog extends Animal {
    public void dogInfo() {
        // System.out.println(species);  // Error: Cannot access private
        System.out.println("Dog name: " + name);     // Can access protected
        System.out.println("Dog age: " + age);       // Can access public
        System.out.println("Dog habitat: " + habitat); // Can access package-private
    }
}

public class Main {
    public static void main(String[] args) {
        Dog myDog = new Dog();
        myDog.name = "Buddy";
        myDog.age = 3;

        myDog.displayInfo();
        myDog.dogInfo();
    }
}
```

## The super Keyword

In Java, the `super` keyword is used to refer to the **parent class** of a subclass.

The most common use of the `super` keyword is to eliminate the confusion between superclasses and subclasses that have methods with the same name.

It can be used in three main ways:

- To access attributes from the parent class
- To call methods from the parent class
- To call the parent class constructor

### Access Parent Methods

If a subclass has a method with the same name as one in its parent class, you can use `super` to call the parent version:

```java
class Vehicle {
    public void start() {
        System.out.println("Vehicle is starting...");
    }

    public void stop() {
        System.out.println("Vehicle is stopping...");
    }
}

class Car extends Vehicle {
    @Override
    public void start() {
        super.start(); // Call parent method first
        System.out.println("Car engine is running!");
    }

    public void fullStart() {
        System.out.println("Performing full startup sequence:");
        super.start();  // Call parent's start method
        System.out.println("Checking systems...");
        System.out.println("Car is ready to drive!");
    }

    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.start();      // Calls overridden method
        System.out.println();
        myCar.fullStart();  // Calls parent method explicitly
    }
}
```

**Note:** Use `super` when you want to call a method from the parent class that has been overridden in the child class.

### Access Parent Attributes

You can also use `super` to access an attribute from the parent class if they have an attribute with the same name:

```java
class Vehicle {
    protected String brand = "Generic Vehicle";
    protected int maxSpeed = 100;
}

class Car extends Vehicle {
    private String brand = "Car Brand";  // Hides parent's brand
    private int maxSpeed = 200;          // Hides parent's maxSpeed

    public void displayBrands() {
        System.out.println("Car brand: " + brand);        // Child's brand
        System.out.println("Vehicle brand: " + super.brand); // Parent's brand
    }

    public void displaySpeeds() {
        System.out.println("Car max speed: " + maxSpeed);
        System.out.println("Vehicle max speed: " + super.maxSpeed);
    }

    public static void main(String[] args) {
        Car myCar = new Car();
        myCar.displayBrands();
        myCar.displaySpeeds();
    }
}
```

### Calling Parent Constructor

```java
class Vehicle {
    protected String brand;
    protected int year;
    protected String color;

    public Vehicle(String brand, int year) {
        this.brand = brand;
        this.year = year;
        this.color = "Unknown";
        System.out.println("Vehicle constructor called");
    }

    public Vehicle(String brand, int year, String color) {
        this.brand = brand;
        this.year = year;
        this.color = color;
        System.out.println("Vehicle constructor with color called");
    }
}

class Car extends Vehicle {
    private String model;
    private int doors;

    public Car(String brand, int year, String model) {
        super(brand, year); // Call parent constructor
        this.model = model;
        this.doors = 4; // Default to 4 doors
        System.out.println("Car constructor called");
    }

    public Car(String brand, int year, String model, String color, int doors) {
        super(brand, year, color); // Call parent constructor with color
        this.model = model;
        this.doors = doors;
        System.out.println("Car constructor with all parameters called");
    }

    public void displayInfo() {
        System.out.println(year + " " + color + " " + brand + " " + model +
                          " with " + doors + " doors");
    }

    public static void main(String[] args) {
        System.out.println("Creating basic car:");
        Car car1 = new Car("Toyota", 2023, "Camry");
        car1.displayInfo();

        System.out.println("\nCreating detailed car:");
        Car car2 = new Car("Honda", 2024, "Civic", "Blue", 2);
        car2.displayInfo();
    }
}
```

**Note:** The call to `super()` must be the **first statement** in the subclass constructor.

## Method Overriding

When a subclass provides a specific implementation of a method that is already provided by its parent class, it's called method overriding:

```java
class Animal {
    public void makeSound() {
        System.out.println("The animal makes a sound");
    }

    public void sleep() {
        System.out.println("The animal sleeps");
    }

    public void eat() {
        System.out.println("The animal eats");
    }
}

class Dog extends Animal {
    @Override  // Good practice to use this annotation
    public void makeSound() {
        System.out.println("The dog barks: Woof! Woof!");
    }

    @Override
    public void eat() {
        System.out.println("The dog eats dog food");
    }

    // sleep() is not overridden, so it inherits the parent's implementation

    public void wagTail() {  // New method specific to Dog
        System.out.println("The dog wags its tail");
    }
}

class Cat extends Animal {
    @Override
    public void makeSound() {
        System.out.println("The cat meows: Meow! Meow!");
    }

    @Override
    public void sleep() {
        System.out.println("The cat sleeps 16 hours a day");
    }

    public void purr() {  // New method specific to Cat
        System.out.println("The cat purrs: Purr... Purr...");
    }
}

public class Main {
    public static void main(String[] args) {
        Animal genericAnimal = new Animal();
        Dog myDog = new Dog();
        Cat myCat = new Cat();

        System.out.println("=== Generic Animal ===");
        genericAnimal.makeSound();
        genericAnimal.eat();
        genericAnimal.sleep();

        System.out.println("\n=== Dog ===");
        myDog.makeSound();  // Overridden method
        myDog.eat();        // Overridden method
        myDog.sleep();      // Inherited method
        myDog.wagTail();    // Dog-specific method

        System.out.println("\n=== Cat ===");
        myCat.makeSound();  // Overridden method
        myCat.eat();        // Inherited method
        myCat.sleep();      // Overridden method
        myCat.purr();       // Cat-specific method
    }
}
```

## The final Keyword

If you don't want other classes to inherit from a class, use the `final` keyword:

```java
final class MathUtils {
    public static double calculateCircleArea(double radius) {
        return Math.PI * radius * radius;
    }

    public static double calculateSquareArea(double side) {
        return side * side;
    }
}

// This would cause a compilation error:
// class ExtendedMathUtils extends MathUtils {
//     ...
// }

public class Main {
    public static void main(String[] args) {
        double circleArea = MathUtils.calculateCircleArea(5.0);
        double squareArea = MathUtils.calculateSquareArea(4.0);

        System.out.println("Circle area: " + circleArea);
        System.out.println("Square area: " + squareArea);
    }
}
```

You can also use `final` with methods to prevent them from being overridden:

```java
class Vehicle {
    public final void startEngine() {  // Cannot be overridden
        System.out.println("Starting engine...");
    }

    public void honk() {  // Can be overridden
        System.out.println("Honk!");
    }
}

class Car extends Vehicle {
    // This would cause an error:
    // public void startEngine() { ... }

    @Override
    public void honk() {  // This is allowed
        System.out.println("Car honks: Beep! Beep!");
    }
}
```

## Practical Example: Employee Management System

```java
class Employee {
    protected String name;
    protected int employeeId;
    protected double baseSalary;

    public Employee(String name, int employeeId, double baseSalary) {
        this.name = name;
        this.employeeId = employeeId;
        this.baseSalary = baseSalary;
        System.out.println("Employee " + name + " created");
    }

    public void displayInfo() {
        System.out.println("ID: " + employeeId + ", Name: " + name +
                          ", Base Salary: $" + baseSalary);
    }

    public double calculateSalary() {
        return baseSalary;
    }

    public void work() {
        System.out.println(name + " is working");
    }
}

class Manager extends Employee {
    private double bonus;
    private int teamSize;

    public Manager(String name, int employeeId, double baseSalary, double bonus, int teamSize) {
        super(name, employeeId, baseSalary);  // Call parent constructor
        this.bonus = bonus;
        this.teamSize = teamSize;
        System.out.println("Manager " + name + " manages " + teamSize + " employees");
    }

    @Override
    public double calculateSalary() {
        return super.calculateSalary() + bonus;  // Base salary + bonus
    }

    @Override
    public void work() {
        super.work();  // Call parent work method
        System.out.println(name + " is managing the team");
    }

    public void conductMeeting() {
        System.out.println(name + " is conducting a team meeting");
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Bonus: $" + bonus + ", Team Size: " + teamSize +
                          ", Total Salary: $" + calculateSalary());
    }
}

class Developer extends Employee {
    private String programmingLanguage;
    private int projectsCompleted;

    public Developer(String name, int employeeId, double baseSalary, String language) {
        super(name, employeeId, baseSalary);
        this.programmingLanguage = language;
        this.projectsCompleted = 0;
        System.out.println("Developer " + name + " specializes in " + language);
    }

    @Override
    public void work() {
        super.work();
        System.out.println(name + " is coding in " + programmingLanguage);
    }

    public void completeProject() {
        projectsCompleted++;
        System.out.println(name + " completed project #" + projectsCompleted);
    }

    @Override
    public void displayInfo() {
        super.displayInfo();
        System.out.println("Language: " + programmingLanguage +
                          ", Projects Completed: " + projectsCompleted);
    }
}

public class Main {
    public static void main(String[] args) {
        Employee emp = new Employee("John Doe", 1001, 50000);
        Manager mgr = new Manager("Jane Smith", 2001, 80000, 15000, 5);
        Developer dev = new Developer("Mike Johnson", 3001, 70000, "Java");

        System.out.println("\n=== Employee Information ===");
        emp.displayInfo();
        mgr.displayInfo();
        dev.displayInfo();

        System.out.println("\n=== Work Activities ===");
        emp.work();
        mgr.work();
        mgr.conductMeeting();
        dev.work();
        dev.completeProject();
        dev.completeProject();

        System.out.println("\n=== Updated Developer Info ===");
        dev.displayInfo();
    }
}
```

## Why And When To Use Inheritance?

- **Code Reusability**: Reuse attributes and methods of an existing class when you create a new class
- **Method Overriding**: Provide specific implementations for subclasses
- **Polymorphism**: Treat objects of different classes uniformly (covered in the next post!)
- **Hierarchical Organization**: Model real-world relationships (Car is-a Vehicle)

## Key Takeaways

1. **Use `extends`** to create inheritance relationships
2. **Access modifiers** control what subclasses can access
3. **`super` keyword** accesses parent class methods, attributes, and constructors
4. **Method overriding** allows subclasses to provide specific implementations
5. **`final` keyword** prevents inheritance (classes) or overriding (methods)
6. **Call `super()` first** in subclass constructors

In the next post, we'll explore abstract classes and interfaces - powerful tools for defining contracts and achieving abstraction!

Happy coding!
