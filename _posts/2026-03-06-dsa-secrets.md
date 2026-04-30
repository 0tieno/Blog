---
type: post
title: The Secret to Mastering DSA, Recognizing Patterns
date: 2026-03-06 09:00:00 +0300
categories:
  - dsa - java
---

Most algorithm problems follow patterns. If you recognize the pattern, the solution becomes obvious.

### Pattern 1 — HashMap / HashSet (Lookup Problems)

Used when you need fast search.

Clues:

```
find pair
duplicates
frequency
count occurrences
```

Example problems:

- Two Sum
- Contains Duplicate
- Longest Substring Without Repeating Characters

Example structure:

```
HashMap<Integer, Integer> map = new HashMap<>();
HashSet<Integer> set = new HashSet<>();
```

### Pattern 2 — Two Pointers

Used when working with sorted arrays or opposite ends.

Idea:
```
one pointer at start
one pointer at end
move inward
```

Example:

```
[1,2,3,4,6]
target = 6
```

Pointers:

```
left → 1
right → 6
```

Check:
```
1 + 6 > 6
move right
```

Used in:

- Two Sum (sorted)
- Container With Most Water
- Remove duplicates from sorted array

### Pattern 3 — Sliding Window

Used when dealing with subarrays or substrings. Instead of checking every subarray, maintain a moving window.

Example:

Longest substring without repeating characters

Window expands:

`abc`

Then shrinks when duplicates appear.

Structure:

```
expand right pointer
shrink left pointer
```

Used in:

- Maximum subarray
- Longest substring
- Minimum window substring

### Pattern 4 — Binary Search

Used when data is sorted.

Idea:

cut search space in half

Example:

`1 3 5 7 9`

Check middle:

`5`

Target smaller → search left
Target larger → search right

Time complexity:

`O(log n)`

Used in:

- Search in sorted array
- First/last occurrence
- Peak element

### Pattern 5 — DFS / BFS (Graph Traversal)

Used in:

- trees
- graphs
- grids
- networks

Two ways to explore nodes:

1. DFS (Depth First)
go deep first

Uses:

- recursion
- stack

Example:

- tree traversal
- islands in grid

2. BFS (Breadth First)
- level by level

Uses:

`queue`

Example:

`shortest path`

### Pattern 6 — Dynamic Programming (DP)

Used when:

big problem = smaller repeated problems

Clues:

```
minimum
maximum
number of ways
```

Example:

```
climbing stairs
fibonacci
knapsack
```

Idea:

```
store results
avoid recomputation
```
### Pattern 7 — Backtracking

Used when exploring all possible combinations.

Example:

```
generate permutations
sudoku solver
subsets
```

Idea:

```
choose
explore
undo choice
```

Structure:

```
add element
recurse
remove element
```

### How Experts Recognize Patterns

When reading a problem, ask:

| Question                                   | Pattern                      |
| ------------------------------------------ | ---------------------------- |
| Need fast lookup?                          | HashMap                      |
| Sorted array?                              | Two pointers / Binary search |
| Subarray / substring?                      | Sliding window               |
| Tree / graph?                              | DFS / BFS                    |
| Optimization with overlapping subproblems? | Dynamic programming          |
| All combinations?                          | Backtracking                 |

The Secret of Becoming Good at DSA

You don't memorize solutions.

You train your brain to ask:

Which pattern is this?

Most problems reduce to one of the 7 patterns.


Happy hacking!