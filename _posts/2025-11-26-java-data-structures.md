---
type: post
title: Java Data Structures - Arrays, ArrayLists, HashSets, and HashMaps
date: 2025-11-26 09:00:00 +0300
categories:
  - DSA - Java
---

Data structures are ways to store and organize data so you can use it efficiently.

An array is an example of a data structure, which allows multiple elements to be stored in a single variable.

Some of the most common are:

- `ArrayList`
- `HashSet`
- `HashMap`

**Tip:** Data structures are like supercharged arrays - more flexible and feature-rich!

## ArrayList

An `ArrayList` is a resizable array that can grow as needed.

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

        // Access elements
        System.out.println(cars.get(0)); // Outputs: Volvo

        // Change an element
        cars.set(0, "Tesla");

        // Remove an element
        cars.remove(0);

        // Size of ArrayList
        System.out.println("Size: " + cars.size());

        // Loop through ArrayList
        for (String car : cars) {
            System.out.println(car);
        }
    }
}
```

## Data Structures Overview

| Data Structure | Stores           | Keeps Order? | Allows Duplicates?    | Best For                         |
| -------------- | ---------------- | ------------ | --------------------- | -------------------------------- |
| ArrayList      | Ordered elements | Yes          | Yes                   | Accessing elements by index      |
| HashSet        | Unique elements  | No           | No                    | Avoiding duplicates, fast checks |
| HashMap        | Key-value pairs  | No           | Yes (keys are unique) | Fast lookup by key               |

### HashSet Example

```java
import java.util.HashSet;

public class Main {
    public static void main(String[] args) {
        HashSet<String> cars = new HashSet<String>();
        cars.add("Volvo");
        cars.add("BMW");
        cars.add("Ford");
        cars.add("BMW"); // Duplicate - will be ignored

        System.out.println(cars); // Outputs: [Volvo, BMW, Ford]
        System.out.println("Contains BMW: " + cars.contains("BMW")); // Outputs: true
    }
}
```

### HashMap Example

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, String> capitalCities = new HashMap<String, String>();
        capitalCities.put("England", "London");
        capitalCities.put("Germany", "Berlin");
        capitalCities.put("Norway", "Oslo");
        capitalCities.put("USA", "Washington DC");

        System.out.println(capitalCities);
        System.out.println("Capital of Germany: " + capitalCities.get("Germany"));

        // Loop through HashMap
        for (String country : capitalCities.keySet()) {
            System.out.println("Country: " + country + ", Capital: " + capitalCities.get(country));
        }
    }
}
```

## Iterators

When learning about data structures, you will often hear about iterators too.

An iterator is a way to loop through elements in a data structure.

It is called an "iterator" because "iterating" is the technical term for looping.

```java
import java.util.ArrayList;
import java.util.Iterator;

public class Main {
    public static void main(String[] args) {
        ArrayList<String> cars = new ArrayList<String>();
        cars.add("Volvo");
        cars.add("BMW");
        cars.add("Ford");
        cars.add("Mazda");

        // Get the iterator
        Iterator<String> it = cars.iterator();

        // Print the first item
        System.out.println(it.next());

        // Loop through the collection
        while(it.hasNext()) {
            System.out.println(it.next());
        }
    }
}
```

## Practical Examples

### Example 1: Grade Book with ArrayList

```java
import java.util.ArrayList;

public class Main {
    public static void main(String[] args) {
        ArrayList<Integer> grades = new ArrayList<Integer>();
        grades.add(85);
        grades.add(92);
        grades.add(78);
        grades.add(96);
        grades.add(88);

        // Calculate average
        int sum = 0;
        for (int grade : grades) {
            sum += grade;
        }
        double average = (double) sum / grades.size();

        System.out.println("Grades: " + grades);
        System.out.println("Average: " + average);
        System.out.println("Highest grade: " + java.util.Collections.max(grades));
        System.out.println("Lowest grade: " + java.util.Collections.min(grades));
    }
}
```

### Example 2: Student Registry with HashMap

```java
import java.util.HashMap;

public class Main {
    public static void main(String[] args) {
        HashMap<String, Integer> studentAges = new HashMap<String, Integer>();
        studentAges.put("Alice", 20);
        studentAges.put("Bob", 22);
        studentAges.put("Charlie", 19);
        studentAges.put("Diana", 21);

        // Find students over 20
        System.out.println("Students over 20:");
        for (String name : studentAges.keySet()) {
            if (studentAges.get(name) > 20) {
                System.out.println(name + " - Age: " + studentAges.get(name));
            }
        }
    }
}
```

## When to Use Each Data Structure

- **Arrays:** When you need a fixed-size collection and know the size in advance
- **ArrayList:** When you need a dynamic, resizable list with indexed access
- **HashSet:** When you need to ensure all elements are unique and don't care about order
- **HashMap:** When you need to associate keys with values for quick lookups

## Key Takeaways
- Data structures help organize and manage data efficiently
- Choose the right data structure based on your needs for order, uniqueness, and access patterns
- Use iterators to traverse data structures easily
- Practice with practical examples to solidify your understanding

Happy coding!