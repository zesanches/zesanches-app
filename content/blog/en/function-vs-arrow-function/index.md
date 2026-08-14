---
title: "Function vs Arrow Function: The Difference That Goes Way Beyond Syntax"
date: "2026-08-14"
excerpt: "Swapping `function` for `() =>` looks like a purely stylistic choice, but it completely changes how `this`, `arguments`, and even `new` behave. Here's the mechanism behind it, before it breaks your code in production."
tags: ["JavaScript", "Functions", "This", "Fundamentals"]
author: "José Sanches"
---

If you've ever copied a method from a class, swapped `function` for an arrow function "because it looks more modern," and watched the code break for no obvious reason, you're not alone. It's one of the most common traps in modern JavaScript: arrow functions and traditional functions look interchangeable, but they aren't. The difference isn't cosmetic — it's structural, and it reaches directly into how the JavaScript engine resolves `this`, `arguments`, and even the very concept of "constructing an object."

Understanding that difference is what separates developers who reach for arrow functions out of habit from those who know exactly when — and why — to use them.

## 1. `this`: the real dividing line

The most important difference — and the one responsible for the most bugs — is how each one resolves `this`.

A **traditional function** (declaration or expression) has its own `this` binding, and that value is decided **dynamically, at call time**, depending on *how* the function is invoked (as a method, as a standalone call, via `call`/`apply`/`bind`, and so on).

An **arrow function has no `this` of its own**. It simply captures the `this` of the lexical scope where it was *created* — the "outer" `this`. It doesn't matter how you call it later; that value never changes.

```js
const counter = {
  value: 0,

  // traditional function: 'this' depends on HOW it's called
  incrementTraditional: function () {
    setTimeout(function () {
      this.value++; // 'this' here is the global object (or undefined in strict mode)
      console.log(this.value); // NaN or an error
    }, 100);
  },

  // arrow function: 'this' is inherited from where it was defined
  incrementArrow: function () {
    setTimeout(() => {
      this.value++; // 'this' here is the same 'this' as incrementArrow: the 'counter' object
      console.log(this.value); // 1
    }, 100);
  },
};

counter.incrementTraditional();
counter.incrementArrow();
```

Before arrow functions (ES2015), the usual workaround for this problem was stashing a reference (`const self = this` or `var that = this`) or reaching for `.bind(this)`. Arrow functions solved this "for free," because they were never meant to have their own `this` in the first place — they simply borrow it from the surrounding context.

> **Note:** This also means `call()`, `apply()`, and `bind()` **cannot change** an arrow function's `this`. They'll still accept being called, but the first argument (the intended new `this`) is silently ignored.

## 2. `arguments`, hoisting, and the nature of the declaration

Beyond `this`, three other structural differences matter a lot in practice.

**a) The `arguments` object**

Traditional functions have access to the array-like `arguments` object, holding every argument passed at call time. Arrow functions **don't get their own `arguments`** — if you reference `arguments` inside an arrow function, JavaScript looks that identifier up in the enclosing scope instead (exactly like it does with `this`).

```js
function traditional() {
  console.log(arguments); // [Arguments] { '0': 1, '1': 2, '2': 3 }
}
traditional(1, 2, 3);

const arrow = () => {
  console.log(arguments); // ReferenceError (or the parent scope's 'arguments', if one exists)
};
arrow(1, 2, 3);

// The modern alternative, which works in both cases:
const arrowWithRest = (...args) => {
  console.log(args); // [1, 2, 3]
};
arrowWithRest(1, 2, 3);
```

**b) Hoisting**

Function *declarations* (`function name() {}`) get full hoisting: the JavaScript engine registers the entire function during the compilation phase, so it can be called before it even appears in the source. Arrow functions are always assigned to a variable (`const sum = (a, b) => a + b`), so they follow `const`/`let` hoisting rules instead: the variable exists, but it sits in the *temporal dead zone* until the assignment line actually runs.

```js
greet(); // works: "Hello!" — function declarations get full hoisting

function greet() {
  console.log("Hello!");
}

farewell(); // ReferenceError: Cannot access 'farewell' before initialization

const farewell = () => {
  console.log("Bye!");
};
```

**c) Usage as a constructor**

Traditional functions can be used with `new` because they carry an internal `[[Construct]]` slot and a `prototype` property. Arrow functions have neither — trying to use `new` on one throws a `TypeError` immediately.

```js
function Person(name) {
  this.name = name;
}
const john = new Person("John"); // works

const PersonArrow = (name) => {
  this.name = name;
};
const mary = new PersonArrow("Mary"); // TypeError: PersonArrow is not a constructor
```

## 3. Why this isn't "weaker" — it's different by design

It's tempting to think of arrow functions as a "watered-down" version of traditional functions, but the ECMAScript specification introduced them to solve two specific problems: a leaner syntax for short functions, and eliminating the accidental re-binding of `this` inside callbacks. They were never meant to be a universal replacement.

That becomes obvious when you look at where arrow functions **don't** fit:

- **Object methods**, whenever you need `this` to point at the object itself.
- **Prototype/class methods** that rely on a dynamic `this`.
- **DOM event listeners**, where `this` is expected to be the element that fired the event.
- **Generators** — arrow functions can't use `function*`; there's no such thing as an "arrow generator."

And where they genuinely shine:

- **Short callbacks** (`array.map(x => x * 2)`), where conciseness matters and there's no `this` at stake.
- **Preserving the lexical `this`** inside class methods or async handlers, without resorting to `.bind(this)`.
- **Pure utility functions**, with no state and no context to speak of.

```js
class Button {
  constructor(element) {
    this.clicks = 0;
    this.element = element;

    // Arrow function as a class field: 'this' always points to the
    // instance, no matter who ends up calling the handler.
    this.element.addEventListener("click", () => {
      this.clicks++;
      console.log(`Clicks: ${this.clicks}`);
    });
  }
}
```

## Visual Summary

| Feature | Traditional Function | Arrow Function |
|---|---|---|
| **`this`** | Dynamic — depends on how it's called | Lexical — inherited from the enclosing scope |
| **`arguments`** | Has its own `arguments` object | None; falls back to the parent scope's (or use `...rest`) |
| **Hoisting** | Declarations get full hoisting | Follows `const`/`let` rules (TDZ) |
| **Usable with `new`** | Can act as a constructor | `TypeError` — can never be a constructor |
| **`prototype`** | Has one | Doesn't have one |
| **`call`/`apply`/`bind`** | Change `this` | Don't change `this` (argument is ignored) |
| **Generators (`function*`)** | Supported | Not supported |
| **Implicit return syntax** | Doesn't exist | `x => x * 2` returns without an explicit `return` |

## Conclusion

The difference between `function` and arrow functions isn't a matter of taste or "more modern code" — it's a difference in **internal mechanics**. One decides `this` at call time; the other inherits `this` from wherever it was written. One has `arguments` and can become a constructor; the other depends entirely on its surrounding context.

Knowing this saves you from two common traps: reaching for an arrow function where you actually needed a dynamic `this` (like an object method), and reaching for a traditional function with a manual `.bind(this)` where an arrow function would have solved the problem outright. As Kyle Simpson puts it in *You Don't Know JS: this & Object Prototypes*, `this` in JavaScript was never about where a function was defined, but about how it was called — and the arrow function is the deliberate exception to that rule. Understanding that exception means understanding half of the context bugs you'll run into down the road.

---

**Sources:**
- SIMPSON, Kyle. *You Don't Know JS: this & Object Prototypes*. O'Reilly Media. [github.com/getify/You-Dont-Know-JS](https://github.com/getify/You-Dont-Know-JS)
- MDN Web Docs. *Arrow function expressions*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Functions/Arrow_functions)
- MDN Web Docs. *this*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Operators/this)
- MDN Web Docs. *Functions*. [developer.mozilla.org](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Functions)
- PAVLUTIN, Dmitri. *5 Differences Between Arrow and Regular Functions*. [dmitripavlutin.com](https://dmitripavlutin.com/differences-between-arrow-and-regular-functions/)
