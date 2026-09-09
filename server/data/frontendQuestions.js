/**
 * Frontend Development Interview Questions
 * Sub-types: Modern JavaScript (30), TypeScript (30), HTML5/CSS3 (30), Vue.js (30)
 */

const frontendQuestions = {
  // -------------------------------------------------------------
  // 1. MODERN JAVASCRIPT ES6+ (30 Questions)
  // -------------------------------------------------------------
  javascript: [
    {
      id: 'js-1',
      q: 'What are Closures in JavaScript and what is a practical real-world use case?',
      a: 'A closure is the combination of a function bundled together with references to its lexical environment. In JavaScript, closures allow an inner function to access an outer function’s variables even after the outer function has returned. Real-world use cases: 1) Data privacy/encapsulation (private variables and factory functions). 2) Function currying and partial application. 3) Maintaining state in asynchronous callbacks and memoization functions.'
    },
    {
      id: 'js-2',
      q: 'Explain the difference between var, let, and const in terms of scope, hoisting, and re-declaration.',
      a: 'var is function-scoped (or globally scoped if declared outside a function), hoisted to the top and initialized with undefined, and can be re-declared. let and const are block-scoped ({ }), hoisted to the top but NOT initialized (occupying the Temporal Dead Zone until execution reaches the declaration), and cannot be re-declared in the same scope. const references cannot be reassigned (though internal object properties remain mutable).'
    },
    {
      id: 'js-3',
      q: 'What is the Temporal Dead Zone (TDZ) in JavaScript?',
      a: 'The Temporal Dead Zone is the period between the entering of a block scope and the actual execution of the let or const declaration. Accessing the variable during the TDZ throws a ReferenceError, unlike var which returns undefined.'
    },
    {
      id: 'js-4',
      q: 'How does the JavaScript Prototype Chain work and what is Prototypal Inheritance?',
      a: 'In JavaScript, every object has an internal link to another object called its prototype (__proto__ or Object.getPrototypeOf). When accessing a property on an object, the JS engine searches the object itself; if not found, it traverses up the prototype chain until it finds the property or reaches null (Object.prototype.__proto__). Prototypal inheritance allows objects to inherit methods and properties from other objects directly without classical classes.'
    },
    {
      id: 'js-5',
      q: 'Explain how the this keyword is determined in JavaScript (default, implicit, explicit, and new bindings).',
      a: 'this is determined by how a function is called: 1) Default binding: In non-strict mode it points to the global object (window); in strict mode it is undefined. 2) Implicit binding: When a method is called on an object (obj.method()), this refers to obj. 3) Explicit binding: Using call(), apply(), or bind() forces this to a specific object. 4) new binding: Inside a constructor function called with new, this refers to the newly created instance. Arrow functions do not have their own this; they inherit it lexically from their enclosing scope.'
    },
    {
      id: 'js-6',
      q: 'What is the difference between call(), apply(), and bind()?',
      a: 'call(thisArg, arg1, arg2...) invokes the function immediately with arguments passed individually. apply(thisArg, [argsArray]) invokes the function immediately with arguments passed as an array. bind(thisArg, arg1, arg2...) does NOT invoke the function immediately; it returns a new bound function that can be called later.'
    },
    {
      id: 'js-7',
      q: 'How does the JavaScript Event Loop handle Macro-tasks vs Micro-tasks?',
      a: 'The Call Stack executes synchronous code. When async tasks finish: Micro-tasks (Promise.then/catch/finally, queueMicrotask, MutationObserver) are queued in the Microtask Queue. Macro-tasks (setTimeout, setInterval, setImmediate, I/O) are queued in the Macrotask Queue. The Event Loop prioritizes the Microtask Queue: whenever the call stack is empty, ALL microtasks are executed until the microtask queue is completely drained before processing the next macrotask.'
    },
    {
      id: 'js-8',
      q: 'What is the difference between synchronous code, Promises, and async/await?',
      a: 'Synchronous code executes line-by-line, blocking execution until finished. Promises represent the eventual completion or failure of an asynchronous operation (.then(res => ...).catch(err => ...)). async/await is syntactic sugar over Promises, making asynchronous code read and behave like synchronous code with standard try/catch blocks while maintaining non-blocking asynchronous execution under the hood.'
    },
    {
      id: 'js-9',
      q: 'What is the difference between Promise.all(), Promise.allSettled(), Promise.race(), and Promise.any()?',
      a: 'Promise.all(iterable): Resolves when ALL promises resolve; rejects immediately if ANY promise rejects (fail-fast). Promise.allSettled(iterable): Waits for ALL promises to settle (either resolve or reject), returning an array of status objects. Promise.race(iterable): Settles as soon as the FIRST promise settles (resolves or rejects). Promise.any(iterable): Resolves as soon as the FIRST promise resolves successfully; rejects only if ALL promises reject (AggregateError).'
    },
    {
      id: 'js-10',
      q: 'What is Currying in JavaScript and how do you implement an infinite curry function?',
      a: 'Currying transforms a function with multiple arguments f(a, b, c) into a sequence of functions that each take a single argument f(a)(b)(c). Infinite curry example: function add(a) { return function(b) { return b !== undefined ? add(a + b) : a; }; }; add(1)(2)(3)().'
    },
    {
      id: 'js-11',
      q: 'What is the difference between Debouncing and Throttling?',
      a: 'Debouncing delays function execution until a certain amount of time has elapsed since the LAST time the event was triggered (ideal for search input autocomplete). Throttling enforces a maximum frequency of execution, ensuring the function is called at most once every X milliseconds (ideal for scroll events and window resizing).'
    },
    {
      id: 'js-12',
      q: 'What is Deep Copy vs Shallow Copy, and how do you perform a deep copy in modern JavaScript?',
      a: 'Shallow copy copies top-level properties; nested objects/arrays share references with the original (Object.assign, spread operator {...obj}). Deep copy recursively clones all nested objects so modifications to the clone do not affect the original. In modern JS, use structuredClone(obj). Alternatively, use Lodash _.cloneDeep() or JSON.parse(JSON.stringify(obj)) (note: JSON method loses functions, Symbols, and Date objects).'
    },
    {
      id: 'js-13',
      q: 'What are JavaScript Generators and what is the yield keyword?',
      a: 'Generators are functions that can be exited and later re-entered (function* generator()). The yield keyword pauses generator execution and emits a value ({ value: x, done: false }). Calling .next() resumes execution from where it was paused until the next yield or return.'
    },
    {
      id: 'js-14',
      q: 'What are WeakMap and WeakSet and how do they help prevent memory leaks?',
      a: 'WeakMap and WeakSet hold "weak" references to objects. If an object stored as a key in a WeakMap has no other references in memory, the Garbage Collector can reclaim it automatically without needing manual removal from the collection. Keys must be objects, and they are non-enumerable (no .size or iteration).'
    },
    {
      id: 'js-15',
      q: 'What is Event Bubbling, Event Capturing, and Event Delegation?',
      a: 'When an event triggers, it traverses in 3 phases: 1) Capturing phase (travels from document down to target). 2) Target phase (reaches the target). 3) Bubbling phase (bubbles up from target to document). Event Delegation leverages bubbling by attaching a single event listener to a common parent element instead of adding individual listeners to hundreds of child elements, checking e.target to identify the clicked element.'
    },
    {
      id: 'js-16',
      q: 'What is the difference between == and ===, and what is Object.is()?',
      a: '== (loose equality) converts operands to the same type via implicit coercion before comparing. === (strict equality) compares value and type without type coercion. Object.is(a, b) behaves identically to === except it correctly identifies Object.is(NaN, NaN) as true (whereas NaN === NaN is false) and Object.is(+0, -0) as false.'
    },
    {
      id: 'js-17',
      q: 'What is the difference between null, undefined, and undeclared?',
      a: 'undefined indicates a variable has been declared but has not been assigned a value. null is an intentional assignment representing the explicit absence of any object value. Undeclared means the variable has never been declared in any scope; accessing it throws a ReferenceError.'
    },
    {
      id: 'js-18',
      q: 'How does the JavaScript Garbage Collection Mark-and-Sweep algorithm work?',
      a: 'The engine maintains a set of "roots" (global variables, call stack references). The garbage collector traverses all roots and marks any object reachable directly or indirectly through references. In the sweep phase, any object that was not marked as reachable is considered unreachable and its memory is reclaimed.'
    },
    {
      id: 'js-19',
      q: 'What are Symbols in JavaScript and what are well-known symbols used for?',
      a: 'Symbol is a primitive data type that generates guaranteed unique identifiers (Symbol("id") !== Symbol("id")). Used for creating private or non-colliding object property keys. Well-known symbols (Symbol.iterator, Symbol.toPrimitive, Symbol.hasInstance) allow customizing core language behaviors like making objects iterable with for...of.'
    },
    {
      id: 'js-20',
      q: 'What is the Proxy object and Reflect API in JavaScript?',
      a: 'Proxy wraps an object to intercept and redefine fundamental operations (property lookup, assignment, function invocation) using trap handlers (get, set, has, deleteProperty). Reflect is a built-in object that provides default implementations of the intercepted operations, ensuring safe forwarding (e.g. Reflect.get(target, prop, receiver)). Powers modern reactivity engines like Vue 3.'
    },
    {
      id: 'js-21',
      q: 'What is the optional chaining (?.) and nullish coalescing (??) operator?',
      a: 'Optional chaining (user?.profile?.address) short-circuits and returns undefined if the left operand is null or undefined without throwing a TypeError. Nullish coalescing (a ?? b) returns the right-hand operand ONLY if the left-hand operand is null or undefined, preserving falsy values like 0, false, and "" (unlike logical OR a || b).'
    },
    {
      id: 'js-22',
      q: 'What is tail call optimization (TCO) in JavaScript?',
      a: 'TCO is a compiler optimization where recursive function calls that happen as the very last action of a function reuse the current stack frame instead of allocating a new one, preventing "Maximum call stack size exceeded" errors in deep recursion.'
    },
    {
      id: 'js-23',
      q: 'Explain the difference between Array.prototype.map(), filter(), reduce(), and forEach().',
      a: 'forEach executes a callback for each item without returning a new array (used for side effects). map transforms each element and returns a new array of the same length. filter returns a new array containing only elements that pass a boolean test. reduce iterates through an array accumulating values into a single return value (object, number, array).'
    },
    {
      id: 'js-24',
      q: 'What are JavaScript Modules (ESM) and what is Top-Level Await?',
      a: 'ES Modules use import and export statements, execute in strict mode by default, and have isolated file-level scope. Top-Level Await allows using the await keyword outside of async functions at the root level of a module, enabling asynchronous dependency loading, resource initialization, and database connections before child modules evaluate.'
    },
    {
      id: 'js-25',
      q: 'How do Web Workers work and how do they communicate with the main thread?',
      a: 'Web Workers run scripts in background threads isolated from the main UI thread, preventing long computations from freezing the user interface. They do not have access to the DOM or window object. Communication with the main thread occurs via message passing using postMessage() and listening via onmessage event handlers.'
    },
    {
      id: 'js-26',
      q: 'What is Memory Leak in JavaScript and what are the 3 most common causes?',
      a: 'A memory leak occurs when allocated memory is no longer needed by the application but is not freed by the garbage collector. 3 common causes: 1) Accidental global variables (window.data). 2) Forgotten timers or intervals (setInterval holding closures). 3) Lingering event listeners attached to DOM nodes that have been removed.'
    },
    {
      id: 'js-27',
      q: 'What is Function Borrowing in JavaScript?',
      a: 'Function borrowing is the practice of using a method from one object on another object without copying the method. Achieved using call() or apply(), e.g. Array.prototype.slice.call(arguments) to convert array-like objects into true arrays.'
    },
    {
      id: 'js-28',
      q: 'How does Object.freeze() differ from Object.seal() and const?',
      a: 'const prevents variable reassignment but allows mutating object properties. Object.seal(obj) prevents adding or deleting properties, but existing writable properties can still be modified. Object.freeze(obj) makes an object completely immutable: no properties can be added, deleted, or modified (shallow freeze).'
    },
    {
      id: 'js-29',
      q: 'What is the difference between synchronous XHR, Fetch API, and Axios?',
      a: 'XMLHttpRequest (XHR) is the legacy callback-based API. Fetch is the modern promise-based native browser standard with streaming support, but requires manual handling of HTTP error status checks (res.ok) and JSON parsing (res.json()). Axios is a third-party library that automatically transforms JSON, rejects on non-2xx status codes, supports request/response interceptors, and handles cancellation via AbortController.'
    },
    {
      id: 'js-30',
      q: 'What is the difference between imperative and declarative programming in JavaScript?',
      a: 'Imperative programming focuses on HOW to achieve a result step-by-step with explicit loops and state mutations (for loop with counter). Declarative programming focuses on WHAT outcome is desired, abstracting away control flow (e.g. array.map, array.filter, React JSX).'
    }
  ],

  // -------------------------------------------------------------
  // 2. TYPESCRIPT (30 Questions)
  // -------------------------------------------------------------
  typescript: [
    {
      id: 'ts-1',
      q: 'What is the difference between an Interface and a Type Alias in TypeScript?',
      a: 'Both can define object shapes. Interfaces support Declaration Merging (defining the same interface name multiple times merges their fields) and are ideal for public API contracts and OOP class implementations (implements). Type aliases are more versatile: they can represent primitives, union types (A | B), intersection types, tuples, mapped types, and conditional types. Interfaces cannot represent unions directly.'
    },
    {
      id: 'ts-2',
      q: 'What are Generics in TypeScript and why are they useful?',
      a: 'Generics allow creating reusable components and functions that work over a variety of types rather than a single one, while maintaining strict compile-time type safety. Example: function identity<T>(arg: T): T { return arg; }. They avoid losing type information or resorting to any.'
    },
    {
      id: 'ts-3',
      q: 'What is the difference between any, unknown, and never in TypeScript?',
      a: 'any disables all type checking, allowing you to access any property or method without compile errors (defeating TypeScript). unknown is the type-safe counterpart of any: any value can be assigned to unknown, but you CANNOT perform operations on it without first narrowing the type (typeof, instanceof). never represents values that never occur (e.g. a function that always throws an error, or the exhausted case in exhaustive type checking).'
    },
    {
      id: 'ts-4',
      q: 'How does Type Narrowing (Type Guards) work in TypeScript?',
      a: 'Type narrowing refines a broad type into a more specific type within a conditional block. Mechanisms: 1) typeof checks (typeof x === "string"). 2) instanceof checks (x instanceof Date). 3) "property" in object checks. 4) Custom type predicates (function isFish(pet: Pet): pet is Fish { return ... }). 5) Discriminated unions (checking a common literal tag property like kind: "circle").'
    },
    {
      id: 'ts-5',
      q: 'What are Discriminated Unions (Tagged Unions) and why are they powerful?',
      a: 'A Discriminated Union is a union of object types where each type shares a common singleton property with distinct literal values (e.g. { status: "success", data: T } | { status: "error", error: string }). When inspecting the status property inside a switch statement, TypeScript automatically narrows the remaining properties with complete type safety.'
    },
    {
      id: 'ts-6',
      q: 'What are Utility Types in TypeScript? Explain Partial, Required, Pick, and Omit.',
      a: 'Utility types transform existing types. Partial<T> makes all properties optional. Required<T> makes all properties required. Pick<T, K> constructs a type by picking specific keys K from T. Omit<T, K> constructs a type by picking all properties from T and removing keys K.'
    },
    {
      id: 'ts-7',
      q: 'What is the purpose of the keyof and typeof type operators?',
      a: 'keyof takes an object type and produces a string or numeric literal union of its keys (keyof { name: string; age: number } -> "name" | "age"). typeof in type position captures the TypeScript type of an existing JavaScript variable or object (type Config = typeof appConfig).'
    },
    {
      id: 'ts-8',
      q: 'What are Mapped Types in TypeScript and how do you write a custom mapped type?',
      a: 'Mapped types build new types based on old types by iterating over keys using the in operator: type ReadonlyNullable<T> = { readonly [K in keyof T]: T[K] | null };. They allow transforming property names, modifying readonly/optional modifiers (+readonly, -readonly, ?).'
    },
    {
      id: 'ts-9',
      q: 'What are Conditional Types in TypeScript (T extends U ? X : Y)?',
      a: 'Conditional types select one of two possible types based on a subtyping relationship: type IsString<T> = T extends string ? true : false. When combined with generics and unions, conditional types distribute over union members automatically (Distributive Conditional Types).'
    },
    {
      id: 'ts-10',
      q: 'What is the infer keyword in TypeScript conditional types?',
      a: 'The infer keyword allows declaring a type variable within the extends clause of a conditional type to deduce and extract a type dynamically: type ReturnType<T> = T extends (...args: any[]) => infer R ? R : any;. Extracts the return type R from any function signature.'
    },
    {
      id: 'ts-11',
      q: 'What is the difference between readonly property, Readonly<T>, and as const assertions?',
      a: 'readonly property makes an individual object key immutable after creation. Readonly<T> shallowly marks all properties of type T as readonly. as const (const assertion) creates deeply immutable literal types, converting all properties to readonly and narrowing primitives to their exact literal values (e.g. ["admin", "user"] becomes readonly ["admin", "user"]).'
    },
    {
      id: 'ts-12',
      q: 'What is the difference between type casting using as and type assertion?',
      a: 'TypeScript does not have true runtime casting; as is a compile-time Type Assertion that tells the compiler: "Trust me, I know this type better than you." It does not perform any runtime data conversion or validation. If asserted incorrectly, it leads to runtime crashes.'
    },
    {
      id: 'ts-13',
      q: 'What are Template Literal Types in TypeScript?',
      a: 'Template literal types build new string types by concatenating string literal types using backtick syntax: type Event = "click" | "hover"; type HandlerName = `on${Capitalize<Event>}`; (resolves to "onClick" | "onHover"). Powerful for typing CSS units, API endpoints, and event names.'
    },
    {
      id: 'ts-14',
      q: 'What is the strict compiler flag in tsconfig.json and what sub-flags does it enable?',
      a: 'strict: true enables maximum type safety. It turns on: 1) strictNullChecks (null and undefined are not assignable to other types). 2) noImplicitAny (flags variables with uninferrable any). 3) strictFunctionTypes (enforces contravariant parameter checking). 4) strictBindCallApply. 5) strictPropertyInitialization (requires class properties to be initialized in constructor).'
    },
    {
      id: 'ts-15',
      q: 'How does structural typing (duck typing) differ from nominal typing?',
      a: 'TypeScript uses structural typing: type compatibility is determined solely by the shape and members of an object, not its declared name or inheritance. If two classes or interfaces have the identical properties and types, TypeScript considers them interchangeable. In nominal typing (Java, C#), types are only equal if explicitly declared by the same named class or interface.'
    },
    {
      id: 'ts-16',
      q: 'How do you create Nominal (Branded) types in TypeScript?',
      a: 'Add a unique phantom property (brand) to primitive types: type UserId = string & { readonly __brand: unique symbol };. This prevents accidentally passing an OrderId to a function expecting a UserId, even though both are fundamentally strings at runtime.'
    },
    {
      id: 'ts-17',
      q: 'What are Ambient Declarations and .d.ts files in TypeScript?',
      a: 'Ambient declarations (declare module, declare var) describe the shape of existing JavaScript code to the TypeScript compiler without generating output code. .d.ts files (type declaration files) contain only type signatures, enabling type checking and editor autocompletion for third-party libraries (like @types/node, @types/react).'
    },
    {
      id: 'ts-18',
      q: 'What is the non-null assertion operator (!) and why should it be avoided when possible?',
      a: 'The exclamation mark (x!) tells the compiler to assume x is neither null nor undefined. Overusing it silences real type errors and leads to runtime "Cannot read properties of undefined" exceptions. Prefer optional chaining (?.), nullish coalescing (??), or explicit type guards.'
    },
    {
      id: 'ts-19',
      q: 'What is Exhaustive Type Checking with the never type?',
      a: 'In a switch statement over a discriminated union, the default case assigns the switch variable to a variable of type never: default: const _exhaustive: never = action; throw new Error("Unhandled action");. If a new member is later added to the union and not handled in the switch, TypeScript raises a compile error.'
    },
    {
      id: 'ts-20',
      q: 'What are Enums in TypeScript and why do many engineers prefer union types over numeric enums?',
      a: 'Enums define a set of named constants. Numeric enums have pitfalls: 1) They emit actual JavaScript runtime IIFE objects rather than zero-cost types. 2) Numeric enums are not type-safe in older versions (arbitrary numbers could be assigned). Const object literals (const Roles = { Admin: "admin" } as const) with union types (type Role = typeof Roles[keyof typeof Roles]) are zero-cost, safer, and tree-shakeable.'
    },
    {
      id: 'ts-21',
      q: 'What are Function Overloads in TypeScript and how are they defined?',
      a: 'Function overloads define multiple function signatures for different argument types followed by a single implementation signature: function makeDate(timestamp: number): Date; function makeDate(m: number, d: number, y: number): Date; function makeDate(mOrTimestamp: number, d?: number, y?: number): Date { ... }.'
    },
    {
      id: 'ts-22',
      q: 'What is Declaration Merging in TypeScript?',
      a: 'Declaration merging allows TypeScript to combine multiple declarations with the same name into a single definition. Useful for merging interfaces (extending third-party library types or Window/Express Request objects) and merging namespaces with classes or functions.'
    },
    {
      id: 'ts-23',
      q: 'How do you extend the Express Request interface in TypeScript to include user properties?',
      a: 'Create a declarations file (types/express.d.ts): declare global { namespace Express { interface Request { user?: { id: string; role: string; }; } } }; export {};. TypeScript merges this with Express’s internal Request definition.'
    },
    {
      id: 'ts-24',
      q: 'What is the satisfies operator introduced in TypeScript 4.9?',
      a: 'satisfies validates that an expression matches a type WITHOUT widening the expression’s inferred type. For example, const palette = { red: [255, 0, 0], green: "#00ff00" } satisfies Record<string, string | number[]>; allows TypeScript to know palette.red is an array and palette.green is a string while ensuring all keys are valid.'
    },
    {
      id: 'ts-25',
      q: 'What is the difference between covariant and contravariant parameter types?',
      a: 'Covariance preserves subtyping direction (if Dog extends Animal, then List<Dog> extends List<Animal>). Contravariance reverses subtyping direction (used in function parameters under strictFunctionTypes): a function accepting Animal can safely be passed where a function accepting Dog is expected, because it can handle any dog.'
    },
    {
      id: 'ts-26',
      q: 'What is the Record<K, T> utility type in TypeScript?',
      a: 'Record<K, T> creates an object type whose property keys are K and property values are T. Example: type UserRoles = Record<string, "admin" | "editor" | "viewer">;. Ensures all keys adhere to K and values adhere to T.'
    },
    {
      id: 'ts-27',
      q: 'What is the difference between import type and regular import in TypeScript?',
      a: 'import type { User } from "./models" guarantees that the import is strictly for compile-time type checking and will be completely removed (elided) from the emitted JavaScript output, preventing circular dependencies and reducing bundle bloat.'
    },
    {
      id: 'ts-28',
      q: 'What are Decorators in TypeScript and how do they work in TypeScript 5+?',
      a: 'Decorators are functions that can be attached to classes, methods, accessors, and fields to inspect, modify, or enhance behavior. TypeScript 5 conforms to the official Stage 3 ECMAScript Decorator standard, eliminating the need for experimentalDecorators flag for standard class enhancements.'
    },
    {
      id: 'ts-29',
      q: 'How does TypeScript handle Index Signatures and what are their drawbacks?',
      a: 'An index signature defines arbitrary properties: interface Cache { [key: string]: any; }. Drawback: it disables strict property typo checks because ANY property name is accepted as valid, and return values default to the value type without guaranteeing the property exists.'
    },
    {
      id: 'ts-30',
      q: 'What is the unknown type and how does it improve safety when parsing JSON?',
      a: 'JSON.parse returns any by default, bypassing all type checks. Typing the result as unknown forces developers to write runtime schema validation (using Zod, Yup, or custom guards) before accessing properties: const data: unknown = JSON.parse(str); if (isUser(data)) { console.log(data.name); }.'
    }
  ]
};

module.exports = {
  frontendQuestions
};
