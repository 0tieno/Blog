---
type: post
title: "Daily Java Challenge #5 - Sum of Digits in a Number"
date: 2025-12-01 09:00:00 +0300
categories:
  - Java
  - Daily-Challenge
---

**Problem**: Write a Java program that sums the digits in a number — for example, 501 → 5 + 0 + 1 = 6.

There are multiple ways to solve this, but in this challenge we’ll use the simplest approach for summing digits in a positive integer.

### Understanding the Logic

Imagine your number is 501. You want to split it into 5, 0, 1 and then add them.

Java gives us two simple operations to help with this:

1️⃣ % 10 → Gets the last digit

Examples:

- 501 % 10 = 1
- 50 % 10 = 0
- 5 % 10 = 5

2️⃣ / 10 → Removes the last digit

Examples:

- 501 / 10 = 50
- 50 / 10 = 5
- 5 / 10 = 0 → stop here

We repeat this process until the number becomes 0, that's why we use the `while loop`.

### Step-by-Step Walkthrough

Start with:

```java
  n = 501  
  sum = 0
```

### Loop 1

- Last digit = 501 % 10 = 1
- Add to sum → sum = 1
- Remove last digit → n = 501 / 10 = 50

### Loop 2

- Last digit = 50 % 10 = 0
- Add to sum → sum = 1
- Remove last digit → n = 50 / 10 = 5

### Loop 3

- Last digit = 5 % 10 = 5
- Add to sum → sum = 6
- Remove last digit → n = 5 / 10 = 0 → stop

`Final Answer: 6`

```java
public class Main {
    public static void main(String[] args) {

        int n = 501;
        int sum = 0;

        while (n > 0) {
            int lastDigit = n % 10; // get last digit
            sum += lastDigit;       // add to sum
            n = n / 10;             // remove last digit
        }

        System.out.println(sum); // prints 6
    }
}
```

This code can be found in my [github](https://github.com/0tieno/BlogCode/blob/main/2025-12-2-add-digits-in-a-number)

Happy hacking!