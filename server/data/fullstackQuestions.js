/**
 * Full Stack Development Interview Questions
 * Sub-types: React (30), Node.js (30), Vite (30), Express.js (30), Next.js (30), Full Stack Architecture (30)
 */

const fullstackQuestions = {
  // -------------------------------------------------------------
  // 1. REACT.JS (30 Questions)
  // -------------------------------------------------------------
  react: [
    {
      id: 'react-1',
      q: 'What is the Virtual DOM and how does React reconciliation (Fiber) work?',
      a: 'The Virtual DOM is a lightweight in-memory JavaScript representation of the real DOM. When state changes, React creates a new Virtual DOM tree, diffs it with the previous tree using the Fiber reconciliation algorithm (heuristic O(n) diffing), and computes the minimum set of DOM mutations. React Fiber introduced incremental rendering, allowing React to split rendering work into chunks, prioritize user interactions, and pause/resume work without blocking the main browser thread.'
    },
    {
      id: 'react-2',
      q: 'What is the difference between useEffect, useLayoutEffect, and useInsertionEffect?',
      a: 'useEffect runs asynchronously after the DOM has been painted by the browser, making it ideal for non-blocking side effects like data fetching and subscriptions. useLayoutEffect runs synchronously immediately after all DOM mutations but before the browser paints the screen, making it essential for reading DOM layout measurements and making synchronous DOM adjustments to prevent visual flicker. useInsertionEffect runs before any DOM mutations, specifically designed for CSS-in-JS libraries (like styled-components) to inject styles before reading layout.'
    },
    {
      id: 'react-3',
      q: 'How does React state batching work in React 18 versus earlier versions?',
      a: 'In React 17 and earlier, state updates were only batched inside React synthetic event handlers. Updates inside setTimeout, Promises, or native event listeners triggered separate re-renders. In React 18, Automatic Batching batches all state updates together regardless of where they originate (promises, timeouts, native listeners), reducing unnecessary renders. If you need immediate synchronous DOM update, React provides ReactDOM.flushSync().'
    },
    {
      id: 'react-4',
      q: 'Explain the rules of React Hooks and why they cannot be called inside loops or conditions.',
      a: 'Hooks must only be called at the top level of functional components or custom hooks. They cannot be called inside loops, conditions, or nested functions. React relies on the exact call order of hooks on every render to map state values and effects to internal Fiber nodes via a linked list. Conditionally calling a hook would shift the index/order in the linked list, corrupting subsequent hook states.'
    },
    {
      id: 'react-5',
      q: 'What is the difference between useMemo and useCallback, and when should you avoid them?',
      a: 'useMemo caches the calculated RESULT of an expensive computation between renders based on dependencies. useCallback caches the FUNCTION INSTANCE itself to prevent passing new references to memoized child components (React.memo). Overusing them introduces unnecessary memory overhead and dependency array checks for trivial calculations or components that re-render anyway. Use them only for genuinely heavy calculations or when passing callbacks to optimized children or dependency arrays.'
    },
    {
      id: 'react-6',
      q: 'What are React Keys in lists and why should you never use array index as key for dynamic lists?',
      a: 'Keys provide a stable identity to list elements across renders so React diffing knows whether an item was inserted, deleted, or reordered. Using an array index as key breaks when items are reordered, prepended, or deleted, because the indices shift, causing React to mistakenly reuse previous component state, DOM input focus, and produce subtle UI bugs. Always use unique, persistent identifiers like database IDs.'
    },
    {
      id: 'react-7',
      q: 'Explain React Context API performance pitfalls and how to prevent unnecessary re-renders.',
      a: 'When a Context Provider value changes (e.g. value={{ state, dispatch }} created as a new object literal), EVERY component subscribing via useContext will re-render, even if it only uses an unaffected property. Solutions: 1) Split context into separate State and Dispatch contexts. 2) Memoize the provider value with useMemo. 3) Colocate state closer to where it is used. 4) Use external state libraries like Zustand or Redux Toolkit with fine-grained selectors.'
    },
    {
      id: 'react-8',
      q: 'What are Error Boundaries in React and what errors do they NOT catch?',
      a: 'Error Boundaries are class components implementing componentDidCatch and getDerivedStateFromError to catch JavaScript errors in their child component tree and display a fallback UI. They do NOT catch: 1) Errors inside event handlers (use standard try/catch). 2) Asynchronous code (e.g., setTimeout, Promise rejections). 3) Server-side rendering errors. 4) Errors thrown inside the Error Boundary component itself.'
    },
    {
      id: 'react-9',
      q: 'What is React.lazy and Suspense, and how does code splitting work?',
      a: 'React.lazy dynamically imports components on demand via dynamic import() syntax, splitting large bundles into separate chunks. Suspense wraps lazy components and provides a fallback prop (e.g., skeleton loader or spinner) while the bundle chunk or asynchronous resource is loading. In React 18+, Suspense also coordinates concurrent streaming data fetching.'
    },
    {
      id: 'react-10',
      q: 'How does useRef differ from useState, and what are its common use cases?',
      a: 'useState triggers a component re-render whenever state updates. useRef returns a mutable object with a .current property that persists across renders WITHOUT triggering a re-render when modified. Common use cases: 1) Direct DOM node access (focus, scroll position). 2) Storing timer IDs (setInterval/setTimeout). 3) Tracking previous state values or mounted lifecycle status.'
    },
    {
      id: 'react-11',
      q: 'Explain React Portals and when you would use them.',
      a: 'React Portals (ReactDOM.createPortal(child, domNode)) render child elements into a different DOM node outside the parent component DOM hierarchy while preserving React context and event bubbling. They are critical for UI elements that must break out of parent CSS constraints (overflow: hidden, z-index stacking), such as modals, tooltips, dialogs, and toast notifications.'
    },
    {
      id: 'react-12',
      q: 'What is prop drilling and what patterns solve it in large React applications?',
      a: 'Prop drilling occurs when data is passed through multiple intermediate components that do not need the data themselves just to reach a deeply nested child. Solutions: 1) Component Composition (passing children or JSX slots directly). 2) React Context API for shared global themes/auth. 3) State management libraries with granular atomic stores (Zustand, Redux, Recoil). 4) Server state tools (React Query/TanStack Query).'
    },
    {
      id: 'react-13',
      q: 'What is the purpose of forwardRef and useImperativeHandle?',
      a: 'React components cannot accept the ref attribute directly by default. forwardRef allows a functional component to receive a ref from its parent and forward it to a child DOM element. useImperativeHandle customizes the instance value exposed by the ref, allowing you to expose specific imperative methods (like focus(), reset()) instead of the raw DOM node.'
    },
    {
      id: 'react-14',
      q: 'Explain the concept of Controlled vs Uncontrolled components in React.',
      a: 'In a Controlled component, form element data is handled by React state (value={val} onChange={e => setVal(e.target.value)}), providing immediate validation, masking, and single source of truth. In an Uncontrolled component, form data is handled directly by the DOM itself, and values are accessed on submit using refs (ref={inputRef}). Uncontrolled inputs can offer faster performance for massive forms or integration with non-React libraries.'
    },
    {
      id: 'react-15',
      q: 'What are custom hooks in React and what are the best practices for creating them?',
      a: 'Custom hooks are JavaScript functions whose names start with "use" that can call other React hooks. They encapsulate and reuse stateful logic across multiple components without altering component hierarchy. Best practices: 1) Keep them focused on a single concern. 2) Return clean object or array interfaces. 3) Clean up side effects in return functions. 4) Use TypeScript for strict parameter and return type safety.'
    },
    {
      id: 'react-16',
      q: 'What is React StrictMode and why does it render components twice in development?',
      a: 'StrictMode is a development-only tool that highlights potential problems such as deprecated lifecycle methods, unsafe side effects, and legacy API usage. In development, React intentionally double-invokes render functions, component bodies, and useEffect setup/cleanup to help developers catch memory leaks, missing effect cleanups, and unintended mutations before production.'
    },
    {
      id: 'react-17',
      q: 'How does useId hook in React 18 solve accessibility and hydration mismatch problems?',
      a: 'useId generates unique, stable IDs across server and client rendering. When server-side rendering forms, generating IDs with Math.random() causes hydration mismatch warnings because client and server values differ. useId creates matching deterministic IDs derived from the component tree position, ideal for connecting HTML labels to form inputs (htmlFor/id) and aria-describedby attributes.'
    },
    {
      id: 'react-18',
      q: 'What is the difference between useTransition and useDeferredValue in React 18?',
      a: 'useTransition marks state updates as non-urgent transitions (startTransition(() => setSearch(val))), allowing urgent updates (like typing in an input) to interrupt the rendering of the slow UI list. useDeferredValue defers updating a secondary value derived from props or state (const deferredQuery = useDeferredValue(query)), yielding to higher priority renders while keeping the input responsive.'
    },
    {
      id: 'react-19',
      q: 'How do you optimize rendering performance in large lists of 10,000+ items?',
      a: '1) Virtualization / Windowing (using react-window or react-virtualized) to only render items currently visible in the viewport. 2) Memoization (React.memo, stable item keys). 3) Pagination or Infinite Scrolling. 4) CSS content-visibility: auto to skip rendering off-screen elements. 5) Avoiding inline function allocations in list item props.'
    },
    {
      id: 'react-20',
      q: 'Explain Higher Order Components (HOC) vs Render Props vs Custom Hooks.',
      a: 'HOC is a function that takes a component and returns an enhanced component (withAuth(Profile)). Render Props passes a function as a prop to share code (render={data => <View data={data}/>}). Custom Hooks allow sharing stateful logic directly inside functional components without wrapping or nesting DOM layers, making them the modern standard pattern in React.'
    },
    {
      id: 'react-21',
      q: 'What causes infinite re-render loops in React and how do you debug them?',
      a: 'Infinite loops occur when: 1) Calling a setState function directly in the component body during render. 2) Calling setState in useEffect without a dependency array or with a dependency that changes on every render (e.g., an unmemoized object or function). 3) Mutating state directly and setting it. Debug using React DevTools Profiler, checking dependency arrays, or inserting console.log in effects.'
    },
    {
      id: 'react-22',
      q: 'What is the difference between React Server Components (RSC) and Client Components?',
      a: 'Server Components execute exclusively on the server and render into a JSON format stream without sending any JavaScript bundle to the browser, drastically reducing bundle size and enabling direct database/file access. Client Components render on both server (HTML pre-render) and client (hydration), allowing state (useState), effects (useEffect), and browser event listeners (onClick).'
    },
    {
      id: 'react-23',
      q: 'How does React handle synthetic events compared to native browser events?',
      a: 'React SyntheticEvent is a cross-browser wrapper around native DOM events ensuring consistent behavior across all browsers. In React 17+, React attaches event listeners to the root DOM container (div#root) rather than document, making it easier to embed multiple React apps and integrate with micro-frontends without event conflicts.'
    },
    {
      id: 'react-24',
      q: 'What is useReducer and when should you choose it over useState?',
      a: 'useReducer manages complex state transitions using a reducer function (state, action) => newState. Choose useReducer when: 1) Component state involves multiple sub-values or nested objects. 2) Next state depends on previous state in intricate ways. 3) You want to pass dispatch down via context to avoid deep callback prop drilling.'
    },
    {
      id: 'react-25',
      q: 'Explain React Fiber architecture: WorkInProgress vs Current tree and double buffering.',
      a: 'React Fiber uses a double-buffering technique similar to graphics rendering. The "Current" tree represents what is currently rendered on screen. During updates, React builds a "WorkInProgress" tree in memory incrementally, processing fiber nodes. Once rendering finishes without interruption, React simply switches the root pointer from Current to WorkInProgress in a single synchronous commit phase, making the new UI visible atomically.'
    },
    {
      id: 'react-26',
      q: 'How does cleanup work in useEffect and why is it critical?',
      a: 'Returning a cleanup function inside useEffect runs before the component unmounts and before the effect re-runs on subsequent dependency changes. It is critical for canceling active fetch requests (AbortController), clearing intervals/timeouts, unsubscribing from WebSockets or event listeners, and preventing memory leaks or updating unmounted component state.'
    },
    {
      id: 'react-27',
      q: 'What is Hydration in React SSR and what causes Hydration Mismatch errors?',
      a: 'Hydration is the process where React attaches event listeners and state to server-rendered static HTML in the browser. Mismatch errors occur when the server-generated HTML differs from what the client renders initially—caused by non-deterministic code (Date.now(), window.innerWidth, localStorage checks before mounting, or invalid HTML nesting like <p><div></div></p>).'
    },
    {
      id: 'react-28',
      q: 'How do you abort an ongoing fetch request in a React component when it unmounts?',
      a: 'Instantiate an AbortController in useEffect: const controller = new AbortController(); fetch(url, { signal: controller.signal }).then(...).catch(err => if (err.name !== "AbortError") handleError(err));. In the cleanup function, return () => controller.abort();. This cancels the network request if dependencies change or the user navigates away.'
    },
    {
      id: 'react-29',
      q: 'What is the difference between shallow rendering and full DOM rendering in React testing?',
      a: 'Shallow rendering tests a component in isolation without rendering any of its child components, ensuring child implementation changes do not break parent tests. Full DOM rendering (using React Testing Library / Jest) renders the complete component hierarchy and simulates realistic browser user interactions, verifying user-facing behavior rather than implementation details.'
    },
    {
      id: 'react-30',
      q: 'What are React Compiler (React Forget) and upcoming features in React 19?',
      a: 'React 19 introduces React Compiler (an optimizing compiler that automatically memoizes values and callbacks without manual useMemo/useCallback), Actions (async transitions for form submissions), useActionState and useFormStatus hooks, direct resource loading via use(Promise), and native support for document metadata (<title>, <meta>) and stylesheet preloading.'
    }
  ],

  // -------------------------------------------------------------
  // 2. NODE.JS (30 Questions)
  // -------------------------------------------------------------
  node: [
    {
      id: 'node-1',
      q: 'Explain the Node.js Event Loop and its distinct execution phases.',
      a: 'The Event Loop allows Node.js to perform non-blocking asynchronous operations on a single thread by offloading work to the OS kernel via libuv. The phases in order are: 1) Timers (executes setTimeout/setInterval callbacks). 2) Pending Callbacks (executes I/O callbacks deferred to the next loop iteration). 3) Idle, Prepare (internal use). 4) Poll (retrieves new I/O events, executes I/O related callbacks). 5) Check (executes setImmediate callbacks). 6) Close Callbacks (e.g. socket.on("close")). Between each phase, process.nextTick and microtask queues (Promise.then) run immediately.'
    },
    {
      id: 'node-2',
      q: 'What is the difference between process.nextTick() and setImmediate()?',
      a: 'process.nextTick() executes immediately after the current operation finishes, before the event loop advances to the next phase or executes any other I/O callback (microtask queue). setImmediate() is queued in the Check phase of the event loop and executes on the next turn of the loop. Starving the event loop is possible with recursive process.nextTick() calls.'
    },
    {
      id: 'node-3',
      q: 'What is libuv and what role does it play in Node.js?',
      a: 'libuv is a multi-platform C library that powers the Node.js asynchronous architecture. It provides the event loop, cross-platform asynchronous I/O abstractions, file system operations, and manages a default thread pool of 4 worker threads (UV_THREADPOOL_SIZE) used for blocking tasks like fs operations, DNS lookups, compression (zlib), and crypto operations.'
    },
    {
      id: 'node-4',
      q: 'How do Node.js Streams work and what are the 4 types of streams?',
      a: 'Streams handle reading and writing data in chunks piece-by-piece rather than buffering the entire dataset in memory, preventing heap out-of-memory errors. The 4 types are: 1) Readable (e.g. fs.createReadStream). 2) Writable (e.g. fs.createWriteStream). 3) Duplex (both readable and writable, e.g. net.Socket). 4) Transform (modifies data while reading/writing, e.g. zlib.createGzip).'
    },
    {
      id: 'node-5',
      q: 'What is Backpressure in Node.js streams and how is it handled?',
      a: 'Backpressure occurs when data is read from a Readable stream faster than the Writable stream can write it to disk or network, causing memory accumulation in the buffer. When writable.write(chunk) returns false, the buffer is full; the reader should pause. The reader resumes when the writable stream emits the "drain" event. Using stream.pipe(destination) or pipeline() handles backpressure automatically.'
    },
    {
      id: 'node-6',
      q: 'Explain the difference between Cluster module and Worker Threads in Node.js.',
      a: 'The Cluster module forks multiple independent Node.js processes (one per CPU core) that each have their own memory and event loop, sharing the same server port via master process round-robin (ideal for I/O bound web servers). Worker Threads (worker_threads) run inside a single process, sharing memory via SharedArrayBuffer, ideal for CPU-intensive tasks (image processing, crypto, data parsing) without process spawning overhead.'
    },
    {
      id: 'node-7',
      q: 'How do you detect and prevent memory leaks in Node.js applications?',
      a: 'Common causes: uncleaned event listeners, global variables, closures holding references, and uncleaned intervals. Detection: 1) Monitor process.memoryUsage() (heapUsed, rss). 2) Generate heap snapshots using node --inspect and Chrome DevTools / clinic.js. 3) Set eventEmitter.setMaxListeners() warnings. 4) Use WeakMap/WeakSet for cache objects.'
    },
    {
      id: 'node-8',
      q: 'What is the Buffer class in Node.js and how does it allocate memory?',
      a: 'Buffer is a global class for handling raw binary data outside V8 heap memory in raw allocated memory chunks. Buffer.alloc(size) allocates initialized, zeroed-out memory (safe). Buffer.allocUnsafe(size) allocates uninitialized memory containing old residual data (fast, but must be filled immediately to avoid leaking sensitive data). Buffer.from() creates buffers from strings, arrays, or existing buffers.'
    },
    {
      id: 'node-9',
      q: 'What is the difference between CommonJS (CJS) and ECMAScript Modules (ESM)?',
      a: 'CommonJS uses require() and module.exports, loading modules synchronously at runtime; it has been Node’s default. ESM uses import and export, parsed and resolved statically at compile-time before execution. ESM natively supports top-level await and tree-shaking. In Node, ESM is enabled via "type": "module" in package.json or .mjs extensions.'
    },
    {
      id: 'node-10',
      q: 'What are unhandledRejection and uncaughtException in Node.js, and how should they be handled?',
      a: 'uncaughtException occurs when an unhandled synchronous exception bubbles up to the root. unhandledRejection occurs when a Promise rejects without a .catch() handler. In production, log the error with stack trace (using Winston/Pino), notify monitoring services (Sentry), gracefully close servers and active connections, and exit the process (process.exit(1)) so an orchestrator (PM2, Docker, K8s) can restart a clean process.'
    },
    {
      id: 'node-11',
      q: 'What is the difference between spawn, exec, execFile, and fork in child_process?',
      a: 'spawn launches a command in a new process, streaming data back via streams (best for long-running processes or large output). exec invokes a shell, buffering output in memory (returns buffer with maxBuffer limit, vulnerable to command injection). execFile runs an executable directly without a shell (faster, safer). fork is a specialized spawn for Node.js modules that establishes an IPC communication channel between parent and child.'
    },
    {
      id: 'node-12',
      q: 'How does Node.js handle CPU-intensive tasks without blocking the main event loop?',
      a: '1) Offload work to Worker Threads (worker_threads module). 2) Partition CPU work across setImmediate() ticks to yield back to the event loop. 3) Spawn separate child processes via child_process. 4) Offload heavy processing to external microservices or message queues (BullMQ, RabbitMQ, Celery).'
    },
    {
      id: 'node-13',
      q: 'What is the purpose of EventEmitter in Node.js and how does it handle errors?',
      a: 'EventEmitter is the core pattern for event-driven architecture in Node.js (emitter.on(event, cb), emitter.emit(event, data)). If an EventEmitter emits an "error" event and NO listener is registered for "error", Node.js throws an unhandled exception that crashes the process. Always register an emitter.on("error", handler) listener.'
    },
    {
      id: 'node-14',
      q: 'How does garbage collection work in Node.js (V8 engine)?',
      a: 'V8 uses a Generational Garbage Collector divided into Young Generation (Nursery & Intermediate) and Old Generation. Young generation uses Scavenge algorithm (fast, copying active objects between semi-spaces). Objects that survive multiple garbage collection cycles get promoted to the Old Generation, which uses Mark-Sweep-Compact algorithm. Garbage collection pauses can be observed using --trace-gc.'
    },
    {
      id: 'node-15',
      q: 'What is middleware in Node.js and how does the Onion model work?',
      a: 'Middleware functions have access to the request object (req), response object (res), and the next middleware function (next). The Onion model (prominent in Koa and Express) passes execution forward through a stack of middleware via await next(), and then flows backwards in reverse order after response generation, enabling timing and response manipulation.'
    },
    {
      id: 'node-16',
      q: 'How do you secure environment variables and configuration in Node.js?',
      a: '1) Never commit .env files to version control (use .gitignore). 2) Validate environment variables at startup using schemas (Joi, Zod, or dotenv-safe) so the app fails fast if keys are missing. 3) Use cloud secret managers (AWS Secrets Manager, Vault) in production. 4) Restrict file permissions on configuration files.'
    },
    {
      id: 'node-17',
      q: 'What is the difference between fs.readFile and fs.createReadStream?',
      a: 'fs.readFile buffers the entire file into memory before invoking the callback, causing high memory usage or Buffer out of memory errors for large files. fs.createReadStream reads the file in small sequential chunks (default 64KB), streaming data with constant, minimal memory usage regardless of file size.'
    },
    {
      id: 'node-18',
      q: 'How does Node.js handle module caching in require()?',
      a: 'Modules are cached in require.cache after the first load. Subsequent calls to require() for the same file return the cached export object without re-evaluating the module code. To force reload, you must explicitly delete require.cache[resolvedPath], though mutating cache is generally discouraged in production.'
    },
    {
      id: 'node-19',
      q: 'Explain Graceful Shutdown in Node.js and how to implement it.',
      a: 'Graceful shutdown allows ongoing HTTP requests to complete before terminating. Listen to OS signals (process.on("SIGTERM", shutdown) and SIGINT): 1) Stop accepting new requests (server.close()). 2) Set a timeout (e.g. 10s) to force exit if requests hang. 3) Close database connections, Redis clients, and file handles. 4) Call process.exit(0).'
    },
    {
      id: 'node-20',
      q: 'What is the role of package-lock.json in npm?',
      a: 'package-lock.json records the exact version of every installed dependency and sub-dependency (including checksum hashes). It guarantees deterministic, identical dependency trees across all developer machines and production CI/CD builds, preventing unexpected bugs from caret (^) or tilde (~) version range updates.'
    },
    {
      id: 'node-21',
      q: 'How do you profile performance and find CPU bottlenecks in a Node.js server?',
      a: '1) Use node --cpu-prof to generate a V8 CPU profile and view it in Chrome DevTools. 2) Use clinic.js (clinic doctor, clinic flame) to generate flamegraphs identifying slow functions. 3) Use APM monitoring tools (Datadog, New Relic) to trace slow database queries and event loop lag.'
    },
    {
      id: 'node-22',
      q: 'What is Path Traversal vulnerability in Node.js and how do you prevent it?',
      a: 'Path Traversal occurs when user input is concatenated into file system paths without sanitization (e.g. res.sendFile(path.join(uploadDir, req.query.file))), allowing attackers to use "../../etc/passwd". Prevention: 1) Use path.basename() to strip directory characters. 2) Validate that path.resolve(targetPath).startsWith(baseDirectory).'
    },
    {
      id: 'node-23',
      q: 'What is the pipeline function from the stream/promises module?',
      a: 'pipeline(source, transform, destination) safely pipes streams together while automatically forwarding errors and properly closing and cleaning up all involved streams if an error occurs. In modern Node.js, stream/promises provides await pipeline(...), making stream error handling clean with standard async/await try/catch.'
    },
    {
      id: 'node-24',
      q: 'How does Node.js handle DNS resolution and why can it cause thread pool exhaustion?',
      a: 'Node.js dns.lookup() uses the operating system getaddrinfo() system call, which is synchronous and blocking. libuv executes it inside the 4-thread worker pool. Making hundreds of simultaneous HTTP requests can saturate the 4 threads with DNS lookups, stalling file system operations. Solutions: increase UV_THREADPOOL_SIZE, or use dns.resolve() which uses c-ares asynchronously without worker threads.'
    },
    {
      id: 'node-25',
      q: 'What is REPL in Node.js and how can it be used in production debugging?',
      a: 'REPL (Read-Eval-Print Loop) is Node’s interactive shell. In production, advanced architectures can expose an internal REPL over a secure Unix domain socket or SSH connection, allowing engineers to inspect running application state, invoke methods, and inspect memory without restarting the process.'
    },
    {
      id: 'node-26',
      q: 'Explain the difference between crypto.randomBytes and Math.random() in Node.js.',
      a: 'Math.random() is pseudo-random (PRNG) and cryptographically insecure—its internal seed can be predicted. crypto.randomBytes() generates cryptographically secure pseudo-random bytes (CSPRNG) using operating system entropy sources (like /dev/urandom), essential for security tokens, passwords, salt generation, and session IDs.'
    },
    {
      id: 'node-27',
      q: 'What is the purpose of the AsyncLocalStorage API in Node.js?',
      a: 'AsyncLocalStorage provides thread-local storage equivalent across asynchronous execution chains. It allows storing contextual data (like a correlation request ID, user ID, or database transaction) without manually passing it as an argument through every function in the call stack.'
    },
    {
      id: 'node-28',
      q: 'How do you handle cross-origin resource sharing (CORS) preflight requests in Node.js?',
      a: 'Preflight requests (OPTIONS method) are sent by browsers for requests with custom headers, non-simple HTTP methods (PUT/DELETE/PATCH), or application/json content types. The server must respond to OPTIONS with 204 No Content and appropriate headers: Access-Control-Allow-Origin, Access-Control-Allow-Methods, and Access-Control-Allow-Headers.'
    },
    {
      id: 'node-29',
      q: 'What is the difference between fs.promises and callback-based fs in Node.js?',
      a: 'Callback-based fs uses error-first callbacks (err, data) => {} which can lead to callback hell when chaining multiple operations. fs.promises (or import fs from "fs/promises") returns native JavaScript Promises for every file operation, enabling clean async/await syntax and proper try/catch error handling.'
    },
    {
      id: 'node-30',
      q: 'What is PM2 and what advantages does it provide for production Node.js apps?',
      a: 'PM2 is a production process manager for Node.js. Key features: 1) Automatic process restarts on crash or server reboot. 2) Built-in Cluster Mode enabling zero-downtime reloads (pm2 reload). 3) Built-in log management and rotation. 4) Memory threshold monitoring with auto-restart on memory leaks.'
    }
  ],

  // -------------------------------------------------------------
  // 3. VITE & MODERN BUNDLERS (30 Questions)
  // -------------------------------------------------------------
  vite: [
    {
      id: 'vite-1',
      q: 'Why is Vite significantly faster than traditional bundlers like Webpack during development?',
      a: 'Webpack bundles your entire application code and node_modules into memory before serving it. As apps grow, dev server startup and rebuild times slow to 30-60+ seconds. Vite divides modules into: 1) Dependencies (pre-bundled once using lightning-fast esbuild written in Go). 2) Source code (served over native browser ESM without bundling). When a file changes, Vite only invalidates that single module, giving instant server startup and instantaneous Hot Module Replacement (HMR).'
    },
    {
      id: 'vite-2',
      q: 'How does Hot Module Replacement (HMR) work in Vite?',
      a: 'Vite performs HMR over native ESM. When a file is edited, Vite precisely invalidates the edited module and sends a WebSocket message to the browser. The browser requests only the updated module via dynamic import(). The application updates its state in-place without a full page refresh, preserving form input state, modal state, and component lifecycles.'
    },
    {
      id: 'vite-3',
      q: 'What role does esbuild play in Vite?',
      a: 'esbuild is written in Go and compiles to native machine code, running 10x-100x faster than JavaScript-based bundlers. Vite uses esbuild during development for dependency pre-bundling (converting CommonJS/UMD dependencies to ESM) and for transpiling TypeScript/JSX into vanilla JavaScript.'
    },
    {
      id: 'vite-4',
      q: 'Why does Vite use Rollup for production builds instead of esbuild?',
      a: 'While esbuild is extremely fast, Rollup provides mature, battle-tested production bundling features: advanced tree-shaking, sophisticated code-splitting algorithms, CSS code-splitting, dynamic asset hashing, and a rich ecosystem of production plugins that esbuild’s simpler linker cannot yet replicate with the same level of optimization.'
    },
    {
      id: 'vite-5',
      q: 'How do you configure environment variables in Vite and how do they differ from Webpack/CRA?',
      a: 'In Vite, environment variables in .env files must be prefixed with VITE_ (e.g. VITE_API_URL) to be exposed to client-side code, preventing accidental leakage of secret server keys. In client code, variables are accessed via import.meta.env.VITE_API_URL instead of process.env.REACT_APP_API_URL.'
    },
    {
      id: 'vite-6',
      q: 'What is Dependency Pre-Bundling in Vite and why is it necessary?',
      a: 'Pre-bundling solves two problems: 1) CommonJS/UMD compatibility: Many npm packages are still authored in CommonJS format; Vite converts them to ESM. 2) Network waterfall reduction: Packages like lodash-es have over 600 separate modules; pre-bundling consolidates them into a single module, preventing the browser from making hundreds of concurrent HTTP requests on page load.'
    },
    {
      id: 'vite-7',
      q: 'How do you configure path aliases (e.g. @/components) in Vite?',
      a: 'In vite.config.js, configure the resolve.alias option: import path from "path"; export default defineConfig({ resolve: { alias: { "@": path.resolve(__dirname, "./src") } } }). In a TypeScript project, you must also update tsconfig.json with baseUrl: "." and paths: { "@/*": ["src/*"] } for editor autocompletion.'
    },
    {
      id: 'vite-8',
      q: 'How does Vite handle static assets like images, fonts, and SVG files?',
      a: 'Importing a static asset (import img from "./logo.png") returns its resolved public URL path. Assets smaller than 4KB (configurable via build.assetsInlineLimit) are automatically inlined as base64 data URIs to reduce HTTP requests. Larger assets are emitted into the dist/assets folder with cache-busting content hashes.'
    },
    {
      id: 'vite-9',
      q: 'How do you set up a development API proxy in Vite to avoid CORS issues?',
      a: 'In vite.config.js inside server.proxy: export default defineConfig({ server: { proxy: { "/api": { target: "http://localhost:5000", changeOrigin: true, rewrite: (path) => path.replace(/^\\/api/, "") } } } }). Any request starting with /api is forwarded by the Vite dev server to the backend target.'
    },
    {
      id: 'vite-10',
      q: 'What is Tree-Shaking and how does Rollup achieve it in Vite production builds?',
      a: 'Tree-shaking is dead-code elimination. Because ES Modules use static import/export syntax, Rollup analyzes the abstract syntax tree (AST) to determine which exports are actually used across the application. Unused exports (e.g. imported functions that are never called) are excluded from the final production bundle, drastically minimizing payload size.'
    },
    {
      id: 'vite-11',
      q: 'Explain the Vite Plugin API and how it relates to Rollup plugins.',
      a: 'Vite’s plugin architecture extends Rollup’s plugin interface with Vite-specific hooks (config, configResolved, configureServer, transformIndexHtml, handleHotUpdate). Many existing Rollup plugins work directly in Vite, and custom plugins can intercept requests, transform files, or inject virtual modules.'
    },
    {
      id: 'vite-12',
      q: 'How does Vite support CSS Modules and preprocessors like Sass or Less?',
      a: 'Vite supports CSS Modules out-of-the-box: naming any file with .module.css (e.g., Button.module.css) automatically scopes class names. For Sass/Less/Stylus, you only need to install the preprocessor (npm install -D sass), and Vite handles compilation automatically without configuring separate loaders.'
    },
    {
      id: 'vite-13',
      q: 'What is Code Splitting and how do you customize manual chunk splitting in Vite?',
      a: 'Code splitting breaks bundles into smaller files loaded on demand. In vite.config.js under build.rollupOptions.output.manualChunks, you can split third-party vendor code: manualChunks: { vendor: ["react", "react-dom", "react-router-dom"] }. This allows vendor libraries to stay cached in the user’s browser even when application code updates.'
    },
    {
      id: 'vite-14',
      q: 'What are Glob Imports in Vite (import.meta.glob)?',
      a: 'import.meta.glob allows importing multiple modules dynamically from the file system using glob patterns: const modules = import.meta.glob("./pages/**/*.js"). Vite transforms this into lazy-loaded dynamic imports, making it easy to create automatic route registries, icon loaders, or plugin systems.'
    },
    {
      id: 'vite-15',
      q: 'How does Vite support Server-Side Rendering (SSR)?',
      a: 'Vite provides a programmatic SSR API (createViteServer({ server: { middlewareMode: true } })) that integrates with Express or Fastify. It loads source code directly in Node via ssrLoadModule(), transforming ESM, CSS, and JSX without requiring a separate server build during development.'
    },
    {
      id: 'vite-16',
      q: 'What is the purpose of the public/ directory in Vite?',
      a: 'The public/ directory contains assets that should NOT be processed by Vite’s build pipeline (e.g. robots.txt, favicon.ico, sitemap.xml). Assets in public/ are served at the root path (/) during development and copied directly to the root of dist/ on build without hash renaming.'
    },
    {
      id: 'vite-17',
      q: 'How do you analyze bundle sizes in a Vite project?',
      a: 'Install rollup-plugin-visualizer (npm i -D rollup-plugin-visualizer) and add it to plugins in vite.config.js: visualizer({ open: true, filename: "bundle-analysis.html" }). Running npm run build generates an interactive treemap diagram showing every dependency’s contribution to the bundle size.'
    },
    {
      id: 'vite-18',
      q: 'What is the difference between mode and command in Vite config?',
      a: 'command indicates whether Vite is running "serve" (dev server) or "build" (production bundling). mode indicates the environment mode ("development", "production", or custom like "staging"), which determines which .env files (.env.development, .env.production) are loaded. You can access both in a config function: export default defineConfig(({ command, mode }) => { ... }).'
    },
    {
      id: 'vite-19',
      q: 'How does Vite handle Web Workers (new Worker)?',
      a: 'Vite supports Web Workers with native syntax: const worker = new Worker(new URL("./worker.js", import.meta.url), { type: "module" }). In development, workers load via ESM; during production builds, Vite bundles workers into separate chunks automatically.'
    },
    {
      id: 'vite-20',
      q: 'What is the index.html entry point in Vite and why is it located in the project root?',
      a: 'In Webpack, index.html is a template processed by html-webpack-plugin. In Vite, index.html is treated as the direct source code entry point and root module of the application. It contains a standard script tag (<script type="module" src="/src/main.jsx"></script>), which allows Vite to serve the page directly as an HTML server and resolve imports naturally.'
    },
    {
      id: 'vite-21',
      q: 'How do you configure HTTPS for local development in Vite?',
      a: 'Install the @vitejs/plugin-basic-ssl plugin: import basicSsl from "@vitejs/plugin-basic-ssl"; export default defineConfig({ plugins: [basicSsl()] }). Alternatively, provide certificate paths in server.https: { key: fs.readFileSync("key.pem"), cert: fs.readFileSync("cert.pem") }.'
    },
    {
      id: 'vite-22',
      q: 'What are import.meta.hot and HMR boundaries in Vite?',
      a: 'import.meta.hot is Vite’s HMR API object. A component defines an HMR boundary by calling import.meta.hot.accept((newModule) => {}). If an edited module does not accept itself or its parent does not accept it, the update bubbles up the dependency tree until reaching the root, triggering a full page reload.'
    },
    {
      id: 'vite-23',
      q: 'How does Vite handle CSS Code Splitting in production builds?',
      a: 'By default (build.cssCodeSplit: true), Vite extracts CSS used by dynamically imported asynchronous chunks into separate CSS files. The browser only downloads the CSS file when the associated chunk is dynamically requested, preventing the initial page load from downloading styles for unvisited routes.'
    },
    {
      id: 'vite-24',
      q: 'How do you configure polyfills for legacy browsers in Vite?',
      a: 'Install @vitejs/plugin-legacy (npm i -D @vitejs/plugin-legacy). It generates companion legacy chunks with core-js polyfills and SystemJS loaders for older browsers that lack native ES Module support, serving modern ESM to capable browsers via <script type="module"> and legacy code via <script nomodule>.'
    },
    {
      id: 'vite-25',
      q: 'What is the optimizeDeps.include and optimizeDeps.exclude option in Vite?',
      a: 'optimizeDeps.include forces Vite to pre-bundle specific dependencies that may not be discovered during initial static scanning (e.g. dynamically computed imports). optimizeDeps.exclude tells Vite to skip pre-bundling a specific package (useful for local monorepo packages that are already pure ESM).'
    },
    {
      id: 'vite-26',
      q: 'How does Vite compare with Turbopack in Next.js?',
      a: 'Turbopack (developed by Vercel in Rust) is an incremental bundler tailored specifically for Next.js. Vite is framework-agnostic (works with React, Vue, Svelte, Solid, vanilla JS), has a massive plugin ecosystem built on Rollup standards, and leverages native ESM during development and Rollup for production.'
    },
    {
      id: 'vite-27',
      q: 'What is the difference between raw imports and URL imports in Vite?',
      a: 'Appending ?raw to an import (import shader from "./shader.glsl?raw") imports the file contents directly as a plain string. Appending ?url (import sound from "./audio.mp3?url") returns the public asset URL, bypassing default inlining behavior.'
    },
    {
      id: 'vite-28',
      q: 'How do you enable source maps in Vite and what are the production considerations?',
      a: 'Set build.sourcemap: true in vite.config.js (or "hidden" to generate maps without adding the comment link). In production, public source maps expose full original source code in DevTools. Use "hidden" source maps and upload them directly to error monitoring services (Sentry/Datadog) without publishing them to your public CDN.'
    },
    {
      id: 'vite-29',
      q: 'How do you configure Vite for a Monorepo setup?',
      a: 'In monorepos (pnpm workspaces / Turborepo), configure resolve.alias or set server.fs.allow to include sibling package directories so Vite is permitted to serve files outside the current project root. Also ensure shared workspace dependencies are marked in optimizeDeps.include.'
    },
    {
      id: 'vite-30',
      q: 'What are Virtual Modules in Vite plugins and what are they used for?',
      a: 'Virtual modules are synthetic modules generated in memory by plugins that do not exist on the file system (e.g. import config from "virtual:user-config"). Plugins resolve the module ID starting with \\0 and provide dynamic JavaScript code in the load() hook, useful for injecting build-time metadata or auto-generated routes.'
    }
  ],

  // -------------------------------------------------------------
  // 4. EXPRESS.JS (30 Questions)
  // -------------------------------------------------------------
  express: [
    {
      id: 'express-1',
      q: 'Explain Express middleware architecture and the significance of the next() function.',
      a: 'Express middleware functions are chained handlers with signature (req, res, next). When a request arrives, Express executes middleware sequentially. Calling next() passes execution to the next middleware in the chain. Calling next(err) with an argument bypasses all regular middleware and jumps straight to registered error-handling middleware. Omitting both next() and a response method (res.send/res.json) causes the client request to hang indefinitely.'
    },
    {
      id: 'express-2',
      q: 'How does error-handling middleware differ from regular middleware in Express?',
      a: 'Error-handling middleware MUST accept four arguments: (err, req, res, next). Express inspects function.length (arity) at runtime; having 4 arguments is how Express identifies an error handler. It must be defined at the very end of the middleware chain after all route definitions.'
    },
    {
      id: 'express-3',
      q: 'What is the difference between app.use() and app.all()?',
      a: 'app.use(path, middleware) mounts middleware for all HTTP methods (GET, POST, etc.) and matches any path that STARTS with the prefix (e.g., /api matches /api/users, /api/posts). app.all(path, handler) matches all HTTP methods, but strictly matches the EXACT route path.'
    },
    {
      id: 'express-4',
      q: 'What is express.Router and how does it facilitate modular application architecture?',
      a: 'express.Router is an isolated instance of middleware and routing. It functions like a mini-application, allowing you to define modular route groups in separate files (e.g. authRoutes.js, userRoutes.js) and mount them in the main app via app.use("/api/users", userRoutes).'
    },
    {
      id: 'express-5',
      q: 'Why should you use Helmet middleware in production Express applications?',
      a: 'Helmet sets security-focused HTTP response headers to protect against common web vulnerabilities: 1) Content-Security-Policy (prevents XSS). 2) X-Frame-Options (prevents clickjacking). 3) Strict-Transport-Security (enforces HTTPS). 4) X-Content-Type-Options: nosniff. 5) Hides the X-Powered-By: Express header so attackers cannot target framework-specific exploits.'
    },
    {
      id: 'express-6',
      q: 'What is the purpose of express.json() and express.urlencoded() middleware?',
      a: 'They are built-in body-parsing middleware. express.json() parses incoming HTTP request bodies with Content-Type: application/json into a JavaScript object accessible at req.body. express.urlencoded({ extended: true }) parses URL-encoded bodies (HTML form submissions) using the qs library to support nested objects.'
    },
    {
      id: 'express-7',
      q: 'How does Rate Limiting work in Express and how is it implemented?',
      a: 'Rate limiting restricts how many requests a client IP can make within a given time window, mitigating brute-force attacks and DDoS. It is implemented using express-rate-limit backed by Redis: const limiter = rateLimit({ windowMs: 15 * 60 * 1000, max: 100, message: "Too many requests" }); app.use("/api/", limiter);.'
    },
    {
      id: 'express-8',
      q: 'How do you handle asynchronous errors in Express 4 vs Express 5?',
      a: 'In Express 4, asynchronous errors thrown inside Promise rejections or async functions do not reach error middleware automatically and cause the server to crash or hang; you must catch them and call next(err), or use express-async-errors / wrapper utility. Express 5 natively catches rejected Promises in route handlers and forwards them to error middleware automatically.'
    },
    {
      id: 'express-9',
      q: 'What is the difference between req.params, req.query, and req.body?',
      a: 'req.params contains route parameters matched from the URL path pattern (e.g., /users/:id -> req.params.id). req.query contains parsed URL query string parameters (e.g., /users?sort=asc&page=2 -> req.query.sort). req.body contains data submitted in the HTTP request payload (JSON or form data), populated by body-parser.'
    },
    {
      id: 'express-10',
      q: 'How do you implement JWT authentication in an Express API?',
      a: '1) On login, verify credentials and issue a signed token: jwt.sign({ userId }, secret, { expiresIn: "1h" }). 2) Create an auth middleware that extracts the token from req.headers.authorization (Bearer token) or HTTP-only cookie. 3) Verify with jwt.verify(token, secret). If valid, attach req.user = decoded and call next(); if invalid, return 401 Unauthorized.'
    },
    {
      id: 'express-11',
      q: 'What is the difference between res.send(), res.json(), and res.end()?',
      a: 'res.send() sends various types of responses (Buffer, String, Object, Array), automatically setting Content-Type and Content-Length. res.json() explicitly formats objects/arrays as JSON, setting Content-Type: application/json and formatting with json replacer settings. res.end() ends the response process immediately without sending body data, ideal for empty responses like 204 No Content.'
    },
    {
      id: 'express-12',
      q: 'How do you prevent Cross-Site Scripting (XSS) and SQL/NoSQL Injection in Express?',
      a: '1) Use parameterized queries with ORMs (Prisma, TypeORM, Mongoose) to prevent SQL/NoSQL injection. 2) Sanitize and validate all incoming input using libraries like express-validator, Zod, or Joi. 3) Use helmet for Content Security Policy. 4) Store auth tokens in HTTP-only, Secure, SameSite cookies rather than localStorage.'
    },
    {
      id: 'express-13',
      q: 'What is CORS and how does the cors middleware handle origins in Express?',
      a: 'CORS is a browser security mechanism that restricts cross-origin HTTP requests. The cors middleware sets headers like Access-Control-Allow-Origin: "https://yourdomain.com", Access-Control-Allow-Credentials: true. In production, configure an origin whitelist function rather than cors() with wildcard (*), especially when sending credentials.'
    },
    {
      id: 'express-14',
      q: 'How do you handle file uploads in an Express server?',
      a: 'Use multer middleware. Multer parses multipart/form-data requests, stores files in memory (MemoryStorage) or on disk (DiskStorage), validates file types/sizes via fileFilter, and attaches file metadata to req.file or req.files for upload to cloud storage (S3/Cloudinary).'
    },
    {
      id: 'express-15',
      q: 'What is the difference between res.render() and res.sendFile()?',
      a: 'res.render(view, data) compiles and renders a server-side template (EJS, Pug, Handlebars) with dynamic data and sends the resulting HTML string. res.sendFile(path) reads a static file directly from disk and streams it to the client with appropriate Content-Type.'
    },
    {
      id: 'express-16',
      q: 'What is the purpose of app.param() in Express?',
      a: 'app.param(paramName, callback) defines callback triggers when a specific route parameter is present. It is ideal for loading database records once (e.g. finding user by :id) and attaching the document to req.user before handing execution to individual route handlers, eliminating repetitive lookups.'
    },
    {
      id: 'express-17',
      q: 'How do you structure a production-grade Express backend?',
      a: 'Layered architecture: 1) Routes (URL mapping & middleware assignment). 2) Controllers (HTTP request handling, input extraction, HTTP responses). 3) Services (business logic, transactions, third-party integrations). 4) Models / Data Access Layer (database schemas and queries). 5) Middleware (auth, validation, error handling). 6) Config (environment configuration).'
    },
    {
      id: 'express-18',
      q: 'How do you implement input validation in Express using Zod or express-validator?',
      a: 'Create a validation middleware: const validate = (schema) => (req, res, next) => { try { schema.parse({ body: req.body, query: req.query, params: req.params }); next(); } catch (err) { return res.status(400).json({ errors: err.errors }); } };. This ensures invalid requests are rejected with 400 Bad Request before reaching controllers.'
    },
    {
      id: 'express-19',
      q: 'What is the difference between res.redirect() and res.location()?',
      a: 'res.redirect([status,] url) sets the Location response header and sends an HTTP redirect response (default 302 Found) to the browser, prompting it to navigate to the new URL. res.location(url) only sets the Location header without ending or sending the response.'
    },
    {
      id: 'express-20',
      q: 'Why should you avoid storing sensitive sessions in Express memory (MemoryStore)?',
      a: 'MemoryStore (default in express-session) stores session data in Node process RAM. It leaks memory, cannot scale across multiple cluster processes or load-balanced servers, and loses all active user sessions whenever the server restarts. In production, always use a persistent session store like connect-redis or connect-mongo.'
    },
    {
      id: 'express-21',
      q: 'What is Morgan and Winston, and how do you implement structured logging in Express?',
      a: 'Morgan is an HTTP request logger middleware that logs request method, URL, status code, and response time. Winston is a universal logging framework that formats logs as structured JSON, supports log levels (info, warn, error), and writes to multiple transports (console, rotating files, Datadog/Elasticsearch).'
    },
    {
      id: 'express-22',
      q: 'How do you handle pagination, sorting, and filtering in Express REST APIs?',
      a: 'Extract parameters from req.query (page=1, limit=20, sort=-createdAt, filter). Compute skip = (page - 1) * limit and pass to database queries. Return data alongside metadata: { data, pagination: { total, page, totalPages, hasNextPage } }.'
    },
    {
      id: 'express-23',
      q: 'What is the difference between app.set() and app.use()?',
      a: 'app.set(name, value) sets internal Express application configuration settings (e.g. "trust proxy", "view engine", "views"). app.use() mounts middleware functions or sub-routers into the HTTP request processing pipeline.'
    },
    {
      id: 'express-24',
      q: 'How does the trust proxy setting work in Express when behind Nginx or AWS ALB?',
      a: 'When deployed behind a reverse proxy, the client IP in req.ip is the proxy’s IP. Setting app.set("trust proxy", 1) tells Express to trust the X-Forwarded-For, X-Forwarded-Proto, and X-Forwarded-Host headers set by the proxy, ensuring accurate client IP logging and correct HTTPS detection.'
    },
    {
      id: 'express-25',
      q: 'What is Idempotency in REST APIs and how do you implement it in Express?',
      a: 'Idempotency means making multiple identical requests has the same outcome as making a single request (GET, PUT, DELETE are idempotent; POST is not). To make POST requests (e.g. payments) idempotent, clients pass an Idempotency-Key header. Express middleware checks Redis: if key exists, return the cached result; if not, execute request and cache result with TTL.'
    },
    {
      id: 'express-26',
      q: 'How do you implement WebSocket communication in an Express server?',
      a: 'Create a shared HTTP server: const server = http.createServer(app); const io = new Server(server, { cors: { origin: "*" } });. Express handles standard REST routes, while Socket.IO attaches to the underlying HTTP server to handle real-time bidirectional WebSocket events over the same port.'
    },
    {
      id: 'express-27',
      q: 'What is HTTP Parameter Pollution (HPP) and how is it prevented in Express?',
      a: 'HPP occurs when attackers supply duplicate query parameters (e.g. ?id=1&id=2), causing Express to parse req.query.id as an array (["1", "2"]) instead of a string, potentially bypassing type checks or crashing database queries. Prevent using the hpp middleware (app.use(hpp())).'
    },
    {
      id: 'express-28',
      q: 'How do you test Express APIs using Supertest and Jest?',
      a: 'Export the app instance from app.js without calling app.listen(). In test files, import supertest: const request = require("supertest"); const app = require("./app");. In tests: const res = await request(app).post("/api/users").send({ name: "Alice" }); expect(res.status).toBe(201); expect(res.body.name).toBe("Alice");.'
    },
    {
      id: 'express-29',
      q: 'What is the purpose of res.format() in Express content negotiation?',
      a: 'res.format() performs content negotiation based on the client’s HTTP Accept header. It allows a single route to return HTML (if requested by a browser), JSON (if requested by an API client), or plain text, responding with 406 Not Acceptable if no matching formatter is available.'
    },
    {
      id: 'express-30',
      q: 'What are the major new features and breaking changes in Express 5?',
      a: 'Express 5 features: 1) Native support for asynchronous error handling without extra libraries (rejected Promises in handlers automatically forward to error middleware). 2) Path-to-regexp updated with stricter routing syntax. 3) Removed deprecated methods (app.del(), req.param()). 4) Native handling of status codes and improved performance.'
    }
  ],

  // -------------------------------------------------------------
  // 5. NEXT.JS (30 Questions)
  // -------------------------------------------------------------
  nextjs: [
    {
      id: 'next-1',
      q: 'Explain the difference between the Next.js App Router and the Pages Router.',
      a: 'Pages Router uses the pages/ directory with file-based routing and page-level data fetching methods (getStaticProps, getServerSideProps). App Router uses the app/ directory built on React Server Components (RSC), nested layouts (layout.tsx), streaming with Suspense, error boundaries (error.tsx), loading skeletons (loading.tsx), and async server components for direct database fetching without separate getServerSideProps.'
    },
    {
      id: 'next-2',
      q: 'What are React Server Components (RSC) in Next.js and how do they benefit performance?',
      a: 'RSCs render exclusively on the server and stream an optimized virtual representation to the client without shipping any of their dependencies or component code to the client bundle. Benefits: zero client-side JavaScript bundle size for server components, direct access to server resources (databases, file systems), and secure execution of secrets without exposing APIs.'
    },
    {
      id: 'next-3',
      q: 'When should you add the "use client" directive in Next.js App Router?',
      a: 'Use "use client" at the top of a file when a component requires: 1) React state hooks (useState, useReducer). 2) Lifecycle effects (useEffect, useLayoutEffect). 3) Browser event listeners (onClick, onChange). 4) Browser-only APIs (localStorage, window, navigator). 5) Custom client hooks.'
    },
    {
      id: 'next-4',
      q: 'Explain the 4 rendering strategies in Next.js: CSR, SSR, SSG, and ISR.',
      a: '1) CSR (Client-Side Rendering): HTML shell served, JavaScript renders UI in browser. 2) SSR (Server-Side Rendering): HTML generated on the server on EVERY request (dynamic). 3) SSG (Static Site Generation): HTML generated once at build time and served from CDN (fastest). 4) ISR (Incremental Static Regeneration): Static pages revalidated and regenerated in the background without full redeploy (export const revalidate = 60).'
    },
    {
      id: 'next-5',
      q: 'How does Incremental Static Regeneration (ISR) work in Next.js?',
      a: 'ISR serves cached static HTML instantly from edge CDN. When a request arrives after the revalidate interval (e.g. 60s), Next.js triggers a background regeneration. Once regenerated successfully, Next.js invalidates the cache and serves the updated page for subsequent requests, without rebuilding the whole site.'
    },
    {
      id: 'next-6',
      q: 'What are Server Actions in Next.js and how do they replace traditional API routes?',
      a: 'Server Actions are asynchronous functions defined with "use server" that execute on the server. They can be invoked directly from client or server components (e.g. form action={createPost}), handling mutations, validating data with Zod, mutating database records, and automatically revalidating cached paths (revalidatePath("/posts")) without creating separate /api endpoints.'
    },
    {
      id: 'next-7',
      q: 'What is Middleware in Next.js and what are its primary use cases?',
      a: 'Middleware (middleware.ts) runs on the edge before a request is completed. It allows inspecting requests and modifying responses via rewrite, redirect, adding custom headers, or returning responses directly. Use cases: authentication and session verification, internationalization routing (i18n), A/B testing, and bot protection.'
    },
    {
      id: 'next-8',
      q: 'How does Next.js Image component (<Image />) optimize images automatically?',
      a: 'Next.js Image automatically: 1) Converts images to modern formats (WebP, AVIF). 2) Resizes images on-demand for user viewports based on sizes prop. 3) Prevents Cumulative Layout Shift (CLS) by requiring width/height or fill. 4) Lazy-loads off-screen images by default with blur-up placeholders.'
    },
    {
      id: 'next-9',
      q: 'What is Route Handlers in the App Router and how do they replace API routes?',
      a: 'Route Handlers are defined in route.ts files using web standard Request and Response APIs. They export functions matching HTTP methods (export async function GET(request) {}, POST, PUT, DELETE, PATCH). They support edge or Node.js runtime and can be statically cached or dynamically evaluated.'
    },
    {
      id: 'next-10',
      q: 'Explain the difference between revalidatePath and revalidateTag in Next.js cache.',
      a: 'revalidatePath("/dashboard") invalidates the static cache for all routes matching that specific URL path. revalidateTag("products") invalidates data across ANY route that fetched data tagged with fetch(url, { next: { tags: ["products"] } }), enabling fine-grained cache purging across the entire app.'
    },
    {
      id: 'next-11',
      q: 'How do nested Layouts work in the Next.js App Router?',
      a: 'layout.tsx wraps child pages and child layouts in its directory tree. On client-side navigation between sibling routes (e.g. /dashboard/analytics to /dashboard/settings), the shared parent layout DOES NOT re-render or lose state (preserving scroll position and input state), while only the page.tsx component mounts.'
    },
    {
      id: 'next-12',
      q: 'What are Parallel Routes and Intercepting Routes in Next.js?',
      a: 'Parallel Routes (@folder convention) allow rendering multiple independent pages simultaneously within the same layout (e.g. @analytics and @team in a dashboard). Intercepting Routes ((.)folder convention) allow loading a route within the current layout while displaying a different URL in the browser, perfect for photo modal overlays that remain shareable on refresh.'
    },
    {
      id: 'next-13',
      q: 'How does Next.js optimize web fonts with next/font?',
      a: 'next/font automatically downloads Google Fonts or local font files at build time and self-hosts them with your deployment assets. It inlines CSS, eliminates external network roundtrips to Google servers, and uses CSS size-adjust to prevent Cumulative Layout Shift (CLS).'
    },
    {
      id: 'next-14',
      q: 'What is dynamic route segment matching in Next.js (e.g., [id] vs [...slug] vs [[...slug]])?',
      a: '[id] matches a single dynamic segment (/posts/1). [...slug] is a catch-all route matching one or more segments (/docs/api/v1). [[...slug]] is an optional catch-all route that also matches the root route (/docs as well as /docs/api/v1).'
    },
    {
      id: 'next-15',
      q: 'How does Next.js handle Streaming and progressive HTML rendering?',
      a: 'Using React Suspense and HTTP chunked transfer encoding, Next.js sends the static layout and skeleton loaders instantly to the browser while slow database queries resolve on the server. As each Suspense boundary resolves, Next.js streams the rendered HTML chunks over the same HTTP connection, drastically improving Time to First Byte (TTFB).'
    },
    {
      id: 'next-16',
      q: 'What is generateStaticParams in Next.js App Router and how does it replace getStaticPaths?',
      a: 'generateStaticParams is used in dynamic routes ([id]/page.tsx) to define the exact list of route parameters to pre-render statically at build time. It runs at build time and works seamlessly with fetch deduplication across layouts and pages.'
    },
    {
      id: 'next-17',
      q: 'Explain the 4 caching layers in Next.js 14/15.',
      a: '1) Request Memoization: deduplicates identical GET fetch requests in a single render pass. 2) Data Cache: persists fetch data across requests and deployments. 3) Full Route Cache: caches rendered HTML and RSC payload on the server. 4) Router Cache: in-memory client-side cache storing visited route segments in the browser.'
    },
    {
      id: 'next-18',
      q: 'How do you handle SEO and Dynamic Metadata in Next.js App Router?',
      a: 'Export either a static metadata object (export const metadata = { title: "Home" }) or an async generateMetadata({ params }) function that fetches dynamic content and returns { title, description, openGraph: { images: [...] } }. Next.js automatically injects the proper <head> tags.'
    },
    {
      id: 'next-19',
      q: 'What is the difference between dynamic = "force-dynamic" and dynamic = "force-static"?',
      a: 'export const dynamic = "force-dynamic" forces a route to execute dynamically on every request (equivalent to getServerSideProps), disabling static caching. "force-static" forces static pre-rendering, overriding dynamic functions like cookies() or searchParams.'
    },
    {
      id: 'next-20',
      q: 'How do you securely handle authentication sessions in Next.js App Router?',
      a: 'Use secure, HTTP-only, encrypted session cookies (via Iron Session, NextAuth/Auth.js, or Supabase). Read cookies on the server using the cookies() function from next/headers. Protect routes inside middleware.ts before page rendering starts.'
    },
    {
      id: 'next-21',
      q: 'What is error.tsx and how does it work in the App Router hierarchy?',
      a: 'error.tsx creates a React Error Boundary wrapping the page component. It must be a Client Component ("use client") and receives error and reset props. Calling reset() attempts to re-render the segment. An error.tsx in a sub-folder catches errors in its subtree without crashing parent layouts.'
    },
    {
      id: 'next-22',
      q: 'What is loading.tsx and how does it integrate with React Suspense?',
      a: 'loading.tsx creates an instant loading state using React Suspense behind the scenes. When a page component performs asynchronous data fetching, Next.js automatically wraps the page in Suspense and displays the loading.tsx skeleton instantly until data finishes resolving.'
    },
    {
      id: 'next-23',
      q: 'How do you deploy a Next.js application to non-Vercel environments (Docker/AWS)?',
      a: 'Enable output: "standalone" in next.config.js. Next.js creates a minimal standalone folder containing only necessary node_modules and files. Package this into a multi-stage Dockerfile running node server.js on port 3000, and deploy to AWS ECS, Kubernetes, or DigitalOcean.'
    },
    {
      id: 'next-24',
      q: 'What is the purpose of next/script and its strategy options?',
      a: 'next/script optimizes third-party scripts (Google Analytics, Stripe). Strategies: 1) beforeInteractive: loads before page hydration. 2) afterInteractive (default): loads immediately after page becomes interactive. 3) lazyOnload: loads during browser idle time. 4) worker: offloads script execution to a web worker via Partytown.'
    },
    {
      id: 'next-25',
      q: 'What is the difference between useRouter in next/navigation vs next/router?',
      a: 'next/router was used in the legacy Pages Router. In the App Router, you MUST import useRouter from next/navigation. The App Router router object features router.push(), router.replace(), router.refresh(), and router.back(), while query params are read separately via useSearchParams() and usePathname().'
    },
    {
      id: 'next-26',
      q: 'How does fetch deduplication work in Next.js App Router?',
      a: 'Next.js automatically patches the native fetch API so that if the same URL and options are called in multiple components across the tree (e.g. in both layout.tsx and page.tsx), only ONE network request is executed, and the result is reused across the render cycle.'
    },
    {
      id: 'next-27',
      q: 'What is Partial Prerendering (PPR) in Next.js 14/15?',
      a: 'PPR combines static generation and dynamic streaming in the exact same route. The static shell (navigation, product layout) is pre-rendered at build time and served instantly from edge cache, while embedded dynamic components (cart count, personalized recommendations) are streamed into Suspense holes on demand.'
    },
    {
      id: 'next-28',
      q: 'What are Route Groups (folder names with parentheses) in Next.js?',
      a: 'Route Groups ((auth), (dashboard)) organize routes into logical sections without affecting the URL path. They allow assigning different layouts to different route groups without adding extra path segments (e.g., app/(auth)/login renders at /login with an AuthLayout).'
    },
    {
      id: 'next-29',
      q: 'How do you implement Internationalization (i18n) in Next.js App Router?',
      a: 'Use dynamic route sub-paths ([lang]/page.tsx) combined with middleware.ts that detects the user’s Accept-Language header and redirects to the appropriate locale (/en/about or /es/about), loading localized JSON dictionaries on the server.'
    },
    {
      id: 'next-30',
      q: 'What is Turbopack and how do you enable it in Next.js?',
      a: 'Turbopack is an incremental bundler written in Rust designed as the successor to Webpack in Next.js. It achieves up to 7x faster dev server startup and 10x faster fast refresh updates. Enable it in development by adding the --turbo flag: next dev --turbo.'
    }
  ],

  // -------------------------------------------------------------
  // 6. FULL STACK ARCHITECTURE & REST APIS (30 Questions)
  // -------------------------------------------------------------
  fullstack_arch: [
    {
      id: 'fs-1',
      q: 'What are the principles of RESTful API architecture and what makes an API RESTful?',
      a: 'REST (Representational State Transfer) constraints: 1) Client-Server separation of concerns. 2) Statelessness (each request contains all context needed; no server-side session state). 3) Cacheability (explicit cache headers). 4) Uniform Interface (resource identification via URIs, standard HTTP methods GET/POST/PUT/PATCH/DELETE, standard status codes). 5) Layered System (proxies/gateways transparent to client).'
    },
    {
      id: 'fs-2',
      q: 'Explain the difference between Monolithic, Microservices, and Serverless architectures.',
      a: 'Monolith: Single codebase, single deployment unit, easy local development and shared memory, but scales as an entire unit. Microservices: Loosely coupled services communicating over HTTP/gRPC/queues, independently deployable and scalable, but introduces network latency, distributed transactions, and operational complexity. Serverless: Event-driven stateless functions (AWS Lambda) that scale to zero and run on-demand, reducing idle infrastructure costs but facing cold starts.'
    },
    {
      id: 'fs-3',
      q: 'What is the difference between Access Tokens and Refresh Tokens in JWT auth?',
      a: 'Access Tokens are short-lived (15 mins) and sent with every API request to authorize access. Stored in memory or secure context. Refresh Tokens are long-lived (7–30 days), stored securely in an HTTP-only, Secure cookie. When the access token expires, the client sends the refresh token to /auth/refresh to obtain a new access token without requiring re-login.'
    },
    {
      id: 'fs-4',
      q: 'How do you prevent Cross-Site Scripting (XSS) and Cross-Site Request Forgery (CSRF)?',
      a: 'XSS: Sanitize user input, encode output, use Content Security Policy (CSP), avoid dangerouslySetInnerHTML, and store tokens in HTTP-only cookies. CSRF: Use SameSite=Strict/Lax cookies, implement Anti-CSRF tokens for state-changing requests, and verify Origin and Referer headers on the server.'
    },
    {
      id: 'fs-5',
      q: 'What is the difference between SQL (Relational) and NoSQL (Document) databases and when to choose which?',
      a: 'SQL (PostgreSQL, MySQL): Structured schema, ACID compliance, complex relational JOINs, strong consistency. Best for financial systems, e-commerce orders, relational models. NoSQL (MongoDB, DynamoDB): Schema-less/flexible JSON documents, horizontal partitioning/sharding, eventual consistency. Best for rapid iteration, hierarchical document data, high-velocity unstructured writes.'
    },
    {
      id: 'fs-6',
      q: 'How does Database Indexing work (B-Trees) and what are its trade-offs?',
      a: 'An index is a separate data structure (typically a balanced B-Tree) that holds sorted column values with pointers to disk table records. It transforms full table scans (O(n)) into fast binary/B-Tree lookups (O(log n)). Trade-offs: Increases disk storage, and slows down write operations (INSERT/UPDATE/DELETE) because indexes must be updated synchronously on every write.'
    },
    {
      id: 'fs-7',
      q: 'Explain the Cache-Aside (Lazy Loading) pattern and how to prevent Cache Stampede.',
      a: 'Application first checks cache (Redis). If cache hit, return data. If cache miss, fetch from database, write to cache with TTL, and return. Cache Stampede occurs when a popular key expires and thousands of concurrent requests query the database simultaneously. Prevention: 1) Mutual exclusion locks (mutex) so only one request queries DB while others wait. 2) Probabilistic early expiration (XFetch algorithm). 3) Background cache pre-warming.'
    },
    {
      id: 'fs-8',
      q: 'What is the CAP Theorem and what are the trade-offs in distributed systems?',
      a: 'CAP states a distributed data store can guarantee at most two of three properties: Consistency (every read receives the most recent write or error), Availability (every request receives a non-error response), and Partition Tolerance (system functions despite network partitions). Since network partitions are inevitable in real networks, systems must choose between CP (Consistency over Availability, e.g. MongoDB, HBase) or AP (Availability over Consistency, e.g. Cassandra, DynamoDB).'
    },
    {
      id: 'fs-9',
      q: 'What is an API Gateway and what responsibilities does it handle?',
      a: 'An API Gateway is a reverse proxy entry point for microservices. Responsibilities: 1) Request routing to downstream services. 2) SSL termination. 3) Authentication and authorization verification. 4) Rate limiting and DDoS throttling. 5) Response aggregation and protocol translation (HTTP to gRPC). 6) Centralized logging and tracing.'
    },
    {
      id: 'fs-10',
      q: 'How do WebSockets differ from HTTP Polling, Long Polling, and Server-Sent Events (SSE)?',
      a: 'Polling: Client repeatedly requests server on fixed interval (inefficient). Long Polling: Client sends request; server holds connection open until data is available, then closes (moderate overhead). SSE: One-way persistent HTTP connection where server pushes text events to client (ideal for live scoreboards/news feeds). WebSockets: Full-duplex bidirectional TCP connection enabling real-time client-to-server and server-to-client communication (chat, multiplayer gaming).'
    },
    {
      id: 'fs-11',
      q: 'How do you design a robust database migration strategy in continuous deployment?',
      a: 'Use the Expand and Contract pattern (parallel change): 1) Expand: add new columns/tables without breaking old code; deploy code that writes to both old and new columns. 2) Backfill: run background scripts to migrate legacy data. 3) Switch: deploy code that reads from the new column. 4) Contract: remove the old column in a subsequent release.'
    },
    {
      id: 'fs-12',
      q: 'What are ACID properties in database transactions and how are they implemented?',
      a: 'Atomicity: all operations succeed or all rollback (Write-Ahead Logging). Consistency: transitions data from one valid state to another respecting constraints. Isolation: concurrent transactions execute without cross-interference (locking, MVCC). Durability: committed transactions survive server crashes and power outages (WAL committed to non-volatile disk).'
    },
    {
      id: 'fs-13',
      q: 'What is Optimistic vs Pessimistic Locking for concurrency control?',
      a: 'Pessimistic Locking locks database records on read (SELECT ... FOR UPDATE), blocking concurrent transactions until the lock releases (best for high contention, financial transactions). Optimistic Locking does not lock records; it checks a version or timestamp column upon write: UPDATE items SET stock=stock-1, version=version+1 WHERE id=1 AND version=v. If version changed, transaction aborts and retries (best for low-to-moderate contention).'
    },
    {
      id: 'fs-14',
      q: 'How does Horizontal Scaling differ from Vertical Scaling?',
      a: 'Vertical Scaling (Scale-Up): Adding more CPU, RAM, or faster SSDs to a single server. Limited by hardware maximums, expensive, and introduces single point of failure. Horizontal Scaling (Scale-Out): Adding more server nodes behind a load balancer. Provides near-infinite scale and fault tolerance, but requires stateless applications and distributed data management.'
    },
    {
      id: 'fs-15',
      q: 'What is Database Sharding and how do you choose a Shard Key?',
      a: 'Sharding partitions large database tables horizontally across independent database servers. A Shard Key determines which partition stores a given row. A good shard key has high cardinality, distributes read/write traffic evenly (avoids hotspotting), and aligns with common queries to prevent expensive cross-shard joins.'
    },
    {
      id: 'fs-16',
      q: 'What is the Circuit Breaker pattern in distributed microservices?',
      a: 'Prevents cascading system failure when a downstream service fails. States: 1) Closed: requests flow normally. If failures exceed a threshold (e.g. 50%), trip to Open. 2) Open: calls fail fast immediately without waiting for timeouts, returning cached/fallback responses. 3) Half-Open: after a sleep window, allow trial requests to test if the service has recovered. If successful, reset to Closed.'
    },
    {
      id: 'fs-17',
      q: 'How does OAuth 2.0 Authorization Code Flow with PKCE work?',
      a: '1) Client generates a secret code_verifier and derives code_challenge. 2) Client redirects user to Auth server with code_challenge. 3) User authenticates and consents; Auth server redirects to client with authorization code. 4) Client exchanges authorization code and raw code_verifier for tokens. 5) Auth server verifies code_challenge against verifier, mitigating authorization code interception attacks on public clients.'
    },
    {
      id: 'fs-18',
      q: 'What is CORS and why does it NOT protect backend resources from unauthorized access?',
      a: 'CORS is enforced strictly by web browsers to prevent malicious scripts on one origin from reading data from another origin. It does NOT protect backend APIs from non-browser clients (cURL, Postman, server-to-server HTTP requests, or mobile apps). Backend APIs must always authenticate requests using tokens or API keys, regardless of CORS.'
    },
    {
      id: 'fs-19',
      q: 'What is the difference between Load Balancer Layer 4 (L4) and Layer 7 (L7)?',
      a: 'L4 (Transport Layer) balances traffic at TCP/UDP level based on IP addresses and ports without inspecting packet payload (faster, lower CPU overhead, e.g. AWS NLB). L7 (Application Layer) inspects HTTP/HTTPS headers, URLs, cookies, and HTTP methods, enabling intelligent routing, SSL termination, and path-based routing (e.g. AWS ALB, Nginx).'
    },
    {
      id: 'fs-20',
      q: 'Explain the difference between Message Queues (RabbitMQ/BullMQ) and Event Streams (Kafka).',
      a: 'Message Queues (RabbitMQ) follow queue semantics: messages are delivered to individual consumers and deleted upon acknowledgment (point-to-point task distribution). Event Streams (Kafka) maintain an append-only distributed commit log: messages persist indefinitely based on retention policies, and multiple consumer groups read at their own independent offset pace.'
    },
    {
      id: 'fs-21',
      q: 'What is GraphQL and what problems does it solve compared to REST?',
      a: 'GraphQL is a query language for APIs. It solves: 1) Over-fetching (downloading fields not needed by the UI). 2) Under-fetching / N+1 network waterfall (requiring multiple roundtrips to /users, /posts, /comments to render one screen). In GraphQL, client specifies exact requested fields in a single query payload.'
    },
    {
      id: 'fs-22',
      q: 'What is the N+1 Query Problem in ORMs and how do you resolve it?',
      a: 'The N+1 problem occurs when fetching 1 parent record and then issuing N additional database queries in a loop to fetch associated child records (e.g., fetching 100 users, then 100 separate queries for each user’s profile). Solutions: Eager loading (JOIN FETCH), batch loading using DataLoader, or subquery joins.'
    },
    {
      id: 'fs-23',
      q: 'How does Content Delivery Network (CDN) caching work and what is Cache-Control max-age vs s-maxage?',
      a: 'CDNs store static assets (images, JS, CSS, pre-rendered HTML) on edge servers geographically close to users. max-age specifies how long browser client caches can store the resource. s-maxage applies specifically to shared public caches (CDNs and proxies), overriding max-age.'
    },
    {
      id: 'fs-24',
      q: 'What is Eventual Consistency and how do you handle it in distributed systems?',
      a: 'Eventual Consistency guarantees that if no new updates are made, all replicas will eventually converge to the same value, accepting temporary divergence in exchange for high availability and low latency. Handled using idempotency, reconciliation worker jobs, read-your-own-writes session consistency, or distributed consensus protocols.'
    },
    {
      id: 'fs-25',
      q: 'What is the Saga Pattern for distributed transactions across microservices?',
      a: 'Since traditional 2-Phase Commit (2PC) does not scale across microservices, Saga breaks a distributed transaction into a series of local transactions in individual services. If a step fails, the Saga executes compensating transactions in reverse order to undo changes (e.g., Order Created -> Payment Failed -> Compensate: Cancel Order).'
    },
    {
      id: 'fs-26',
      q: 'How do you secure a REST API against common OWASP Top 10 vulnerabilities?',
      a: '1) Enforce HTTPS and HSTS. 2) Implement strict input validation and parameterized SQL queries. 3) Use JWT authentication with rate limiting on auth endpoints. 4) Enforce Role-Based Access Control (RBAC). 5) Configure Helmet for secure headers. 6) Avoid exposing stack traces in error responses.'
    },
    {
      id: 'fs-27',
      q: 'What is Docker Multi-Stage Build and why is it essential for production containers?',
      a: 'Multi-stage builds use multiple FROM directives in a single Dockerfile. The build stage installs dependencies, compilers, and builds code (e.g. 1GB+ with devDependencies). The final production stage copies only compiled artifacts and production dependencies into a lightweight base image (Alpine/Distroless ~50MB), minimizing attack surface and speeding deployment.'
    },
    {
      id: 'fs-28',
      q: 'What is Database Read Replication and how does it improve system throughput?',
      a: 'Read Replication configures one Primary database for write operations (INSERT/UPDATE/DELETE) which replicates data asynchronously to one or more Read Replicas. Application directs heavy read traffic to replicas while writes go to primary, dramatically increasing read throughput and preventing write starvation.'
    },
    {
      id: 'fs-29',
      q: 'How do you implement Distributed Tracing in a full stack microservice ecosystem?',
      a: 'Assign a unique trace ID (and span ID) at the API Gateway or client request. Propagate this trace ID across all downstream HTTP headers (traceparent) and message queues using OpenTelemetry standards. Centralize telemetry data in Jaeger or Datadog to visualize full request latency graphs across services.'
    },
    {
      id: 'fs-30',
      q: 'What are Blue-Green and Canary deployment strategies and how do they reduce risk?',
      a: 'Blue-Green runs two identical environments; new version deploys to Green, passes smoke tests, and the router instantly switches 100% of traffic from Blue to Green (instant rollback if issues occur). Canary deploys the new version alongside the current version and routes a small percentage of traffic (e.g. 5%), monitoring error rates before progressively shifting all users.'
    }
  ]
};

module.exports = {
  fullstackQuestions
};
