---
type: post
title: Bubble sort Algorithm
date: 2026-03-02 09:00:00 +0300
categories:
      - DSA - Java
---

Bubble sort is not efficient but easy to understand. It takes the input and compares

```
    public class BubbleSortAlgorithm {

    /**
     * Bubble sort Algorithm
     */

    static void main() {

    int [] nums = {5, 1, 4, 2, 8, 9, 3, 7, 6};
    int size = nums.length;
    int temp =0;

        System.out.println("Before sorting: ");
        for (int num:nums){
            System.out.print(num);
        }

        System.out.println();
        for (int i = 0; i < size; i++) {
            for (int j = 0; j < size-i-1; j++) {
                if (nums[j] >  nums[j+1]){
                    temp = nums[j];
                    nums[j] = nums[j+1];
                    nums[j+1]= temp;
                }
            }
            System.out.println();
            for (int num:nums){
                System.out.print(num);
            }
        }

        System.out.print("After sorting: ");
        for (int num:nums){
            System.out.print(num);
        }
    }


}

```

![](../images/2025/2026/03/bubble-sort.png)


This code can be found [here]()

Happy hacking!