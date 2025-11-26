---
type: post
title: Java Advanced Topics - Enums, Dates, and More
date: 2025-11-19 09:00:00 +0300
categories:
  - Java
---

In this post, we'll explore some advanced Java topics that are essential for building robust applications. We'll cover enums, date handling, and other important concepts.

## Enums

An `enum` is a special "class" that represents a group of **constants** (unchangeable variables, like `final` variables).

To create an `enum`, use the `enum` keyword (instead of class or interface), and separate the constants with a comma. Note that they should be in uppercase letters:

```java
enum Level {
    LOW,
    MEDIUM,
    HIGH
}
```

**Enum** is short for "enumerations", which means "specifically listed".

### Using Enums

```java
public class Main {
    enum Level {
        LOW,
        MEDIUM,
        HIGH
    }

    public static void main(String[] args) {
        Level myVar = Level.MEDIUM;
        System.out.println(myVar);
    }
}
```

### Enums with Methods

```java
public class Main {
    enum Level {
        LOW(1),
        MEDIUM(2),
        HIGH(3);

        private int levelCode;

        Level(int levelCode) {
            this.levelCode = levelCode;
        }

        public int getLevelCode() {
            return this.levelCode;
        }
    }

    public static void main(String[] args) {
        Level myVar = Level.HIGH;

        switch(myVar) {
            case LOW:
                System.out.println("Low level");
                break;
            case MEDIUM:
                System.out.println("Medium level");
                break;
            case HIGH:
                System.out.println("High level");
                break;
        }

        System.out.println("Level code: " + myVar.getLevelCode());
    }
}
```

### Why And When To Use Enums?

Use enums when you have values that you know aren't going to change, like month days, days, colors, deck of cards, etc.

```java
public class Main {
    enum Day {
        MONDAY, TUESDAY, WEDNESDAY, THURSDAY, FRIDAY, SATURDAY, SUNDAY
    }

    enum Priority {
        LOW, MEDIUM, HIGH, CRITICAL
    }

    public static void main(String[] args) {
        Day today = Day.TUESDAY;
        Priority taskPriority = Priority.HIGH;

        if (today == Day.SATURDAY || today == Day.SUNDAY) {
            System.out.println("It's weekend!");
        } else {
            System.out.println("It's a weekday.");
        }

        System.out.println("Task priority: " + taskPriority);
    }
}
```

## Java Dates

Java does not have a built-in Date class, but we can import the `java.time` package to work with the date and time API. The package includes many date and time classes. For example:

| Class               | Description                                                            |
| ------------------- | ---------------------------------------------------------------------- |
| `LocalDate`         | Represents a date (year, month, day (yyyy-MM-dd))                      |
| `LocalTime`         | Represents a time (hour, minute, second and nanoseconds (HH-mm-ss-ns)) |
| `LocalDateTime`     | Represents both a date and a time (yyyy-MM-dd-HH-mm-ss-ns)             |
| `DateTimeFormatter` | Formatter for displaying and parsing date-time objects                 |

### Working with LocalDate

```java
import java.time.LocalDate; // import the LocalDate class

public class Main {
    public static void main(String[] args) {
        LocalDate myObj = LocalDate.now(); // Create a date object
        System.out.println(myObj); // Display the current date

        // Create specific dates
        LocalDate specificDate = LocalDate.of(2025, 12, 25);
        System.out.println("Christmas 2025: " + specificDate);

        // Date operations
        LocalDate tomorrow = myObj.plusDays(1);
        LocalDate lastWeek = myObj.minusWeeks(1);
        System.out.println("Tomorrow: " + tomorrow);
        System.out.println("Last week: " + lastWeek);
    }
}
```

### Working with LocalTime

```java
import java.time.LocalTime; // import the LocalTime class

public class Main {
    public static void main(String[] args) {
        LocalTime myObj = LocalTime.now();
        System.out.println("Current time: " + myObj);

        // Create specific time
        LocalTime meetingTime = LocalTime.of(14, 30, 0); // 2:30 PM
        System.out.println("Meeting time: " + meetingTime);

        // Time operations
        LocalTime laterTime = myObj.plusHours(2);
        System.out.println("Two hours later: " + laterTime);
    }
}
```

### Working with LocalDateTime

```java
import java.time.LocalDateTime; // import the LocalDateTime class

public class Main {
    public static void main(String[] args) {
        LocalDateTime myObj = LocalDateTime.now();
        System.out.println("Current date and time: " + myObj);

        // Create specific date and time
        LocalDateTime eventDateTime = LocalDateTime.of(2025, 12, 31, 23, 59, 59);
        System.out.println("New Year's Eve countdown: " + eventDateTime);
    }
}
```

### Formatting Date and Time

The "T" in the example above is used to separate the date from the time. You can use the `DateTimeFormatter` class with the `ofPattern()` method in the same package to format or parse date-time objects. The following example will remove both the "T" and nanoseconds from the date-time:

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

        // Different formatting patterns
        DateTimeFormatter customFormat = DateTimeFormatter.ofPattern("EEEE, MMMM dd, yyyy 'at' hh:mm a");
        String customFormatted = myDateObj.format(customFormat);
        System.out.println("Custom format: " + customFormatted);
    }
}
```

The output will be:

```
Before Formatting: 2025-11-26T13:17:33.263199
After Formatting: 26-11-2025 13:17:33
Custom format: Tuesday, November 26, 2025 at 01:17 PM
```

## Common Date and Time Operations

```java
import java.time.*;
import java.time.format.DateTimeFormatter;
import java.time.temporal.ChronoUnit;

public class Main {
    public static void main(String[] args) {
        LocalDate today = LocalDate.now();
        LocalDate birthday = LocalDate.of(1990, 5, 15);

        // Calculate age
        long age = ChronoUnit.YEARS.between(birthday, today);
        System.out.println("Age: " + age + " years");

        // Days until next birthday
        LocalDate nextBirthday = birthday.withYear(today.getYear());
        if (nextBirthday.isBefore(today) || nextBirthday.isEqual(today)) {
            nextBirthday = nextBirthday.plusYears(1);
        }
        long daysUntilBirthday = ChronoUnit.DAYS.between(today, nextBirthday);
        System.out.println("Days until next birthday: " + daysUntilBirthday);

        // Working with time zones
        ZonedDateTime nowInTokyo = ZonedDateTime.now(ZoneId.of("Asia/Tokyo"));
        ZonedDateTime nowInNewYork = ZonedDateTime.now(ZoneId.of("America/New_York"));

        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss z");
        System.out.println("Time in Tokyo: " + nowInTokyo.format(formatter));
        System.out.println("Time in New York: " + nowInNewYork.format(formatter));
    }
}
```

## Practical Examples

### Example 1: Event Management System

```java
import java.time.*;
import java.time.format.DateTimeFormatter;

public class Event {
    private String name;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private Priority priority;

    public enum Priority {
        LOW("📘"),
        MEDIUM("📙"),
        HIGH("📕"),
        CRITICAL("🔥");

        private String icon;

        Priority(String icon) {
            this.icon = icon;
        }

        public String getIcon() {
            return icon;
        }
    }

    public Event(String name, LocalDateTime startTime, LocalDateTime endTime, Priority priority) {
        this.name = name;
        this.startTime = startTime;
        this.endTime = endTime;
        this.priority = priority;
    }

    public Duration getDuration() {
        return Duration.between(startTime, endTime);
    }

    public boolean isToday() {
        return startTime.toLocalDate().equals(LocalDate.now());
    }

    public void displayEvent() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        System.out.println(priority.getIcon() + " " + name);
        System.out.println("   Start: " + startTime.format(formatter));
        System.out.println("   End: " + endTime.format(formatter));
        System.out.println("   Duration: " + getDuration().toHours() + " hours");
        System.out.println("   Today: " + (isToday() ? "Yes" : "No"));
        System.out.println();
    }

    public static void main(String[] args) {
        Event meeting = new Event(
            "Team Meeting",
            LocalDateTime.of(2025, 11, 26, 14, 0),
            LocalDateTime.of(2025, 11, 26, 15, 30),
            Priority.HIGH
        );

        Event lunch = new Event(
            "Lunch Break",
            LocalDateTime.of(2025, 11, 26, 12, 0),
            LocalDateTime.of(2025, 11, 26, 13, 0),
            Priority.LOW
        );

        meeting.displayEvent();
        lunch.displayEvent();
    }
}
```

### Example 2: Task Status System

```java
public class Task {
    private String title;
    private String description;
    private Status status;
    private LocalDateTime createdAt;
    private LocalDateTime completedAt;

    public enum Status {
        TODO("⭕", "To Do"),
        IN_PROGRESS("🔄", "In Progress"),
        REVIEW("👀", "Under Review"),
        COMPLETED("✅", "Completed"),
        CANCELLED("❌", "Cancelled");

        private String icon;
        private String displayName;

        Status(String icon, String displayName) {
            this.icon = icon;
            this.displayName = displayName;
        }

        public String getIcon() {
            return icon;
        }

        public String getDisplayName() {
            return displayName;
        }
    }

    public Task(String title, String description) {
        this.title = title;
        this.description = description;
        this.status = Status.TODO;
        this.createdAt = LocalDateTime.now();
    }

    public void updateStatus(Status newStatus) {
        this.status = newStatus;
        if (newStatus == Status.COMPLETED) {
            this.completedAt = LocalDateTime.now();
        }
    }

    public void displayTask() {
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("MMM dd, yyyy 'at' hh:mm a");
        System.out.println(status.getIcon() + " " + title);
        System.out.println("   Description: " + description);
        System.out.println("   Status: " + status.getDisplayName());
        System.out.println("   Created: " + createdAt.format(formatter));

        if (completedAt != null) {
            Duration timeToComplete = Duration.between(createdAt, completedAt);
            System.out.println("   Completed: " + completedAt.format(formatter));
            System.out.println("   Time taken: " + timeToComplete.toHours() + " hours");
        }
        System.out.println();
    }

    public static void main(String[] args) {
        Task task1 = new Task("Fix bug in login system", "Users cannot log in with special characters in password");
        Task task2 = new Task("Write unit tests", "Add comprehensive unit tests for the user service");

        task1.displayTask();

        // Simulate task progression
        task1.updateStatus(Task.Status.IN_PROGRESS);
        task1.updateStatus(Task.Status.COMPLETED);
        task1.displayTask();

        task2.updateStatus(Task.Status.IN_PROGRESS);
        task2.displayTask();
    }
}
```

## Key Takeaways

1. **Enums** provide type-safe constants and can include methods and constructors
2. **LocalDate, LocalTime, LocalDateTime** are the modern way to handle dates and times
3. **DateTimeFormatter** allows flexible formatting and parsing of date-time objects
4. **Duration and Period** classes help with time calculations
5. **ZonedDateTime** handles time zones effectively
6. Combine enums with other classes for robust, readable code

These advanced topics help you write more professional, maintainable Java applications!

Happy coding!
