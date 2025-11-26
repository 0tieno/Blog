---
type: post
title: Java Object-Oriented Programming Concepts
date: 2025-11-17 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore the fundamental concepts of Object-Oriented Programming (OOP) in Java. Understanding these concepts is crucial for writing maintainable and scalable Java applications.

## Classes and Objects - The Foundation

Every line of code that runs in Java must be inside a `class`. The class name should always start with an uppercase first letter. In our example, we named the class **Main**.

A class is a blueprint or template for creating objects. Objects are instances of classes.

```java
public class Car {
    // Class attributes (fields)
    String brand;
    String model;
    int year;

    // Class methods
    public void startEngine() {
        System.out.println("The engine is starting...");
    }

    public void displayInfo() {
        System.out.println(year + " " + brand + " " + model);
    }
}
```

## Java Constructors

A constructor in Java is a **special method** that is used to initialize objects.

The constructor is called when an object of a class is created.

It can be used to set initial values for object attributes:

```java
public class Car {
    String brand;
    String model;
    int year;

    // Constructor
    public Car(String brand, String model, int year) {
        this.brand = brand;
        this.model = model;
        this.year = year;
    }

    public void displayInfo() {
        System.out.println(year + " " + brand + " " + model);
    }
}

public class Main {
    public static void main(String[] args) {
        Car myCar = new Car("Toyota", "Camry", 2023);
        myCar.displayInfo(); // Outputs: 2023 Toyota Camry
    }
}
```

**Note:** The constructor name must **match the class name**, and it cannot have a **return type** (like `void`).

Also note that the constructor is called when the object is created.

All classes have constructors by default: if you do not create a class constructor yourself, Java creates one for you. However, then you are not able to set initial values for object attributes.

## Method Overloading

With **method overloading**, multiple methods can have the same name with different parameters:

```java
public class Calculator {
    public int add(int x, int y) {
        return x + y;
    }

    public double add(double x, double y) {
        return x + y;
    }

    public int add(int x, int y, int z) {
        return x + y + z;
    }

    public static void main(String[] args) {
        Calculator calc = new Calculator();
        System.out.println(calc.add(5, 3));        // Outputs: 8
        System.out.println(calc.add(5.5, 3.2));   // Outputs: 8.7
        System.out.println(calc.add(1, 2, 3));    // Outputs: 6
    }
}
```

**Note:** Multiple methods can have the same name as long as the number and/or type of parameters are different.

## Encapsulation

The meaning of **Encapsulation**, is to make sure that "sensitive" data is hidden from users. To achieve this, you must:

- declare class variables/attributes as `private`
- provide public **get** and **set** methods to access and update the value of a `private` variable

The `get` method returns the variable value, and the `set` method sets the value.

Syntax for both is that they start with either `get` or `set`, followed by the name of the variable, with the first letter in upper case:

```java
public class Person {
    private String name;
    private int age;

    // Constructor
    public Person(String name, int age) {
        this.name = name;
        this.age = age;
    }

    // Getter for name
    public String getName() {
        return name;
    }

    // Setter for name
    public void setName(String name) {
        this.name = name;
    }

    // Getter for age
    public int getAge() {
        return age;
    }

    // Setter for age with validation
    public void setAge(int age) {
        if (age > 0) {
            this.age = age;
        }
    }
}

public class Main {
    public static void main(String[] args) {
        Person person = new Person("Alice", 25);

        System.out.println("Name: " + person.getName());
        System.out.println("Age: " + person.getAge());

        person.setName("Bob");
        person.setAge(30);

        System.out.println("Updated Name: " + person.getName());
        System.out.println("Updated Age: " + person.getAge());
    }
}
```

### Why Encapsulation?

- Better control of class attributes and methods
- Class attributes can be made **read-only** (if you only use the `get` method), or **write-only** (if you only use the `set` method)
- Flexible: the programmer can change one part of the code without affecting other parts
- Increased security of data

## Java Recursion

Recursion is the technique of making a function call itself. This technique provides a way to break complicated problems down into simpler problems which are easier to solve.

```java
public class Main {
    public static int factorial(int n) {
        if (n == 0 || n == 1) {
            return 1; // Base case
        } else {
            return n * factorial(n - 1); // Recursive case
        }
    }

    public static int fibonacci(int n) {
        if (n <= 1) {
            return n; // Base case
        } else {
            return fibonacci(n - 1) + fibonacci(n - 2); // Recursive case
        }
    }

    public static void main(String[] args) {
        System.out.println("Factorial of 5: " + factorial(5)); // Outputs: 120
        System.out.println("Fibonacci of 7: " + fibonacci(7)); // Outputs: 13
    }
}
```

## Practical Example: Bank Account Class

Let's create a more comprehensive example that demonstrates multiple OOP concepts:

```java
public class BankAccount {
    private String accountNumber;
    private String accountHolder;
    private double balance;
    private static int totalAccounts = 0; // Class variable

    // Constructor
    public BankAccount(String accountNumber, String accountHolder, double initialBalance) {
        this.accountNumber = accountNumber;
        this.accountHolder = accountHolder;
        this.balance = initialBalance;
        totalAccounts++;
    }

    // Overloaded constructor
    public BankAccount(String accountNumber, String accountHolder) {
        this(accountNumber, accountHolder, 0.0); // Call other constructor
    }

    // Getters
    public String getAccountNumber() {
        return accountNumber;
    }

    public String getAccountHolder() {
        return accountHolder;
    }

    public double getBalance() {
        return balance;
    }

    // Methods
    public void deposit(double amount) {
        if (amount > 0) {
            balance += amount;
            System.out.println("Deposited $" + amount + ". New balance: $" + balance);
        }
    }

    public boolean withdraw(double amount) {
        if (amount > 0 && amount <= balance) {
            balance -= amount;
            System.out.println("Withdrew $" + amount + ". New balance: $" + balance);
            return true;
        } else {
            System.out.println("Insufficient funds or invalid amount.");
            return false;
        }
    }

    public void displayAccountInfo() {
        System.out.println("Account: " + accountNumber);
        System.out.println("Holder: " + accountHolder);
        System.out.println("Balance: $" + balance);
    }

    // Static method
    public static int getTotalAccounts() {
        return totalAccounts;
    }
}

public class Main {
    public static void main(String[] args) {
        BankAccount account1 = new BankAccount("123456", "Alice Johnson", 1000.0);
        BankAccount account2 = new BankAccount("789012", "Bob Smith");

        account1.displayAccountInfo();
        account1.deposit(250.0);
        account1.withdraw(100.0);

        account2.displayAccountInfo();
        account2.deposit(500.0);

        System.out.println("Total accounts created: " + BankAccount.getTotalAccounts());
    }
}
```

## Key OOP Principles

1. **Encapsulation**: Hide internal details and provide controlled access through methods
2. **Constructor Overloading**: Multiple ways to create objects with different parameters
3. **Method Overloading**: Same method name with different parameters for flexibility
4. **Static Members**: Belong to the class rather than instances
5. **Packages**: Organize related classes and avoid naming conflicts

In the next post, we'll explore inheritance and how to build relationships between classes!

Happy coding!
