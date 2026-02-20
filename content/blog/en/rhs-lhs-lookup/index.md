---
title: "RHS and LHS Lookup: How JavaScript Actually Finds Your Variables"
date: "2026-02-19"
excerpt: "Ever wondered what happens behind the scenes when JavaScript encounters a variable in your code? LHS and RHS lookups are the invisible mechanism that decides between assigning a value or retrieving one — and understanding this changes how you read errors."
tags: ["JavaScript", "Scope", "Engine", "YDKJS"]
author: "José Sanches"
---

When we write `var a = 2`, it looks like a single operation. But under the hood, the JavaScript engine performs **two distinct operations**: one for assignment and another for lookup. This distinction is the heart of what Kyle Simpson calls **LHS Lookup** and **RHS Lookup** in his book *You Don't Know JS: Scope & Closures*.

Understanding this mechanism is key to deciphering errors like `ReferenceError` and `TypeError`, and to truly grasping how scope works in JavaScript.

## What Do LHS and RHS Mean?

The terms come from **Left-Hand Side** and **Right-Hand Side** of an assignment operation, but the concept goes beyond literal position in code.

**LHS Lookup (Left-Hand Side):** occurs when the engine needs to find the variable **container** to **assign** a value to it. The question the engine asks is: *"Who is the target of this assignment?"*

**RHS Lookup (Right-Hand Side):** occurs when the engine needs to **retrieve the value** of a variable. The question is: *"What is the value stored here?"*

As Simpson puts it more precisely, think of LHS as **"who is the target of the assignment"** and RHS as **"who is the source of the value"**.

## Practical Example: Dissecting a Line of Code

Consider the following:

```js
var a = 2;
```

Two things happen in different phases:

1. **Compilation Phase:** the compiler declares variable `a` in the current scope (if it doesn't already exist).
2. **Execution Phase:** the engine performs an **LHS lookup** for `a` to assign the value `2` to it.

There is no RHS lookup on this line because nobody is trying to *read* the value of `a` — only *write* to it.

Now look at this more complete example:

```js
function foo(a) {
  var b = a;
  return a + b;
}

var c = foo(2);
```

Let's map every lookup:

**LHS Lookups (assignments):**
- `c = ...` → LHS for `c`
- `a = 2` → LHS for `a` (implicit parameter assignment)
- `b = ...` → LHS for `b`

**RHS Lookups (value retrieval):**
- `foo(2)` → RHS for `foo` (needs the function value/reference)
- `= a` → RHS for `a` (needs the value of `a` to assign to `b`)
- `a + b` → RHS for `a` and RHS for `b`

Total: **3 LHS lookups** and **4 RHS lookups**.

## Why Does This Matter? Error Behavior

The distinction between LHS and RHS is not just theoretical. It determines **what kind of error** JavaScript throws when something goes wrong.

### Failed RHS: ReferenceError

When an RHS lookup fails to find the variable in any nested scope, the engine throws a `ReferenceError`:

```js
function bar() {
  console.log(x); // RHS for 'x'
}
bar(); // ReferenceError: x is not defined
```

The engine looked for the **value** of `x`, climbed through every scope up to the global one, and found nothing. Result: error.

### Failed LHS: Treacherous Behavior (Non-Strict Mode)

When an LHS lookup fails in non-strict mode, JavaScript **does not throw an error**. Instead, the global scope "kindly" creates the variable for you:

```js
function bar() {
  x = 10; // LHS for 'x' — not declared anywhere
}
bar();
console.log(x); // 10 — global variable created automatically!
```

This is one of JavaScript's most dangerous behaviors. A simple missing `var`, `let`, or `const` can silently pollute the global scope.

### Strict Mode to the Rescue

In strict mode (`"use strict"`), both LHS and RHS throw `ReferenceError` when the variable is not found:

```js
"use strict";
function bar() {
  x = 10; // ReferenceError: x is not defined
}
bar();
```

### RHS Succeeds, but the Operation Is Invalid: TypeError

There's also the case where the RHS lookup **finds** the variable, but you try to do something impossible with the value:

```js
var a = 2;
a(); // TypeError: a is not a function
```

The RHS lookup for `a` succeeded (found the value `2`), but trying to execute a number as a function results in `TypeError`. The difference is subtle but important: `ReferenceError` relates to **scope resolution**, while `TypeError` relates to an **illegal operation on the found value**.

## The Role of Scope in These Lookups

LHS and RHS lookups don't happen in a vacuum. They follow the **scope chain**:

1. The engine starts searching in the function's local scope.
2. If not found, it moves up to the containing function's scope.
3. It keeps climbing until it reaches the global scope.
4. If it reaches global and still hasn't found it, the behavior depends on the lookup type (LHS or RHS) and the mode (strict or not).

```js
function outer() {
  var x = 10;

  function inner() {
    console.log(x); // RHS for 'x' → not found in 'inner', moves up to 'outer', found!
  }

  inner();
}
outer(); // 10
```

This "climbing" mechanism through scopes is exactly what makes closures possible — but that's a topic for another article.

## Visual Summary

| Scenario | Lookup Type | Failure (non-strict) | Failure (strict) |
|---|---|---|---|
| `a = 2` | LHS | Creates global | ReferenceError |
| `console.log(a)` | RHS | ReferenceError | ReferenceError |
| `a()` (where `a` is not a function) | RHS (success) + invalid operation | TypeError | TypeError |

## Conclusion

The distinction between LHS and RHS is one of those concepts that separates people who **use** JavaScript from those who **understand** JavaScript. Knowing that the engine treats assignment and reading as fundamentally different operations gives you the power to:

- Diagnose `ReferenceError` vs `TypeError` with precision.
- Understand why variables "leak" to the global scope.
- Justify the use of `"use strict"` with technical arguments.

As Kyle Simpson emphasizes in *You Don't Know JS*, these are the invisible gears that drive the language. And once you can see them, JavaScript stops looking like magic — and starts making sense.

---

**Sources:**
- SIMPSON, Kyle. *You Don't Know JS: Scope & Closures*. O'Reilly Media. [github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)
- MDN Web Docs. *Strict mode*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Strict_mode)
- MDN Web Docs. *ReferenceError*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/ReferenceError)
