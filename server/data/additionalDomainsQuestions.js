/**
 * Additional Domains & Sub-Types Interview Questions
 * Sub-types:
 * - HTML5 & Modern CSS (30)
 * - Vue.js (30)
 * - Java Spring Boot (30)
 * - Go / Golang (30)
 * - Microservices & APIs (30)
 * - AWS Cloud Architecture (30)
 * - CI/CD Pipelines & Automation (30)
 * - Machine Learning Core (30)
 * - Deep Learning & LLMs (30)
 * - Distributed Systems & Scalability (30)
 * - Classic System Design Cases (30)
 * - Leadership & Conflict Resolution (30)
 */

const additionalDomainsQuestions = {
  // -------------------------------------------------------------
  // 1. HTML5 & MODERN CSS (30 Questions)
  // -------------------------------------------------------------
  html_css: [
    {
      id: 'htmlcss-1',
      q: 'What is the CSS Box Model and how does box-sizing: border-box change it?',
      a: 'The CSS Box Model consists of content, padding, border, and margin. By default (content-box), width and height only apply to the content area; padding and borders add to total visible dimensions. With box-sizing: border-box, width and height include padding and borders, ensuring element dimensions remain predictable and responsive.'
    },
    {
      id: 'htmlcss-2',
      q: 'What is the difference between CSS Flexbox and CSS Grid, and when should you choose each?',
      a: 'Flexbox is one-dimensional (handles content in a single row OR single column), ideal for component layouts, navbars, and aligning dynamic content. CSS Grid is two-dimensional (handles rows AND columns simultaneously), designed for overall page structure, dashboards, and grid alignments.'
    },
    {
      id: 'htmlcss-3',
      q: 'Explain CSS Specificity and how it is calculated.',
      a: 'Specificity determines which CSS rule applies when selectors conflict. It is calculated as a 4-part weight: Inline styles (1,0,0,0) > IDs (0,1,0,0) > Classes, attributes, and pseudo-classes (0,0,1,0) > Elements and pseudo-elements (0,0,0,1). The !important flag overrides normal specificity.'
    },
    {
      id: 'htmlcss-4',
      q: 'What are CSS Custom Properties (Variables) and how do they differ from preprocessor variables (Sass/Less)?',
      a: 'CSS Custom Properties (--var-name) are native, live in the DOM, cascade down the element tree, and can be updated at runtime dynamically via JavaScript. Sass/Less variables are static, compiled away into fixed values at build time and cannot react to DOM changes.'
    },
    {
      id: 'htmlcss-5',
      q: 'Explain the difference between display: none and visibility: hidden.',
      a: 'display: none removes the element from the document layout flow entirely; it occupies no space and screen readers ignore it. visibility: hidden hides the element visually, but it retains its space and layout footprint in the document flow.'
    },
    {
      id: 'htmlcss-6',
      q: 'What is a Stacking Context in CSS and what creates one?',
      a: 'A stacking context is a three-dimensional conceptualization of HTML elements along an imaginary z-axis relative to the user. It is created by the root element, elements with position relative/absolute/fixed and z-index other than auto, opacity < 1, transform/filter properties, or will-change.'
    },
    {
      id: 'htmlcss-7',
      q: 'What are Semantic HTML elements and why are they critical for SEO and Accessibility?',
      a: 'Semantic elements (<article>, <section>, <nav>, <header>, <main>, <footer>) clearly describe their meaning to both browser and developer. They establish a meaningful DOM tree for screen readers (accessibility), improve keyboard navigation, and provide search engine crawlers with structured content hierarchy for SEO.'
    },
    {
      id: 'htmlcss-8',
      q: 'What is the difference between rem, em, vw/vh, and px units in CSS?',
      a: 'px is an absolute unit (1/96th of an inch). em is relative to the font-size of its immediate parent element (or its own font-size for other properties). rem (root em) is relative to the root <html> font-size, making it scalable for responsive typography. vw/vh represent 1% of the viewport width/height.'
    },
    {
      id: 'htmlcss-9',
      q: 'How does CSS Grid auto-fit differ from auto-fill in repeat(auto-fill, minmax(200px, 1fr))?',
      a: 'auto-fill creates as many column tracks as can fit in the container, even if columns are empty. auto-fit creates the tracks but collapses empty tracks to 0px, causing the non-empty columns to expand and fill the available container space.'
    },
    {
      id: 'htmlcss-10',
      q: 'What is the Critical Rendering Path (CRP) and how do CSS and JS affect it?',
      a: 'CRP is the sequence of steps the browser takes to convert HTML, CSS, and JavaScript into pixels: HTML parsing -> DOM tree + CSSOM tree -> Render Tree -> Layout -> Paint. CSS is render-blocking because the Render Tree cannot be built until CSSOM is ready. Synchronous JS is parser-blocking because it halts DOM parsing.'
    },
    {
      id: 'htmlcss-11',
      q: 'What are the rel="noopener noreferrer" attributes and why are they used on target="_blank" links?',
      a: 'target="_blank" without rel="noopener" allows the opened page to access window.opener, enabling the target site to redirect the original page to a malicious phishing URL (reverse tabnabbing). noopener severs this link; noreferrer also prevents sending the Referer HTTP header.'
    },
    {
      id: 'htmlcss-12',
      q: 'What is the difference between inline, block, and inline-block display values?',
      a: 'block elements start on a new line, take up 100% available width, and accept width, height, and margins on all sides. inline elements flow within text, only take up as much width as content, and ignore width, height, and top/bottom margins. inline-block flows inline like text but respects width, height, and all padding/margins.'
    },
    {
      id: 'htmlcss-13',
      q: 'Explain the CSS clamp(), min(), and max() functions for fluid typography.',
      a: 'clamp(MIN, VAL, MAX) takes three values: a lower bound, preferred dynamic value, and upper bound (e.g. font-size: clamp(1rem, 2.5vw, 2rem)). min() picks the smallest value; max() picks the largest value. They enable fluid responsive design without numerous media query breakpoints.'
    },
    {
      id: 'htmlcss-14',
      q: 'What is the BEM (Block Element Modifier) methodology in CSS?',
      a: 'BEM is a modular naming convention: .block represents a standalone entity (e.g. .card), .block__element is a child part of the block (e.g. .card__title), and .block--modifier or .block__element--modifier represents a state or variation (e.g. .card--featured). It prevents selector conflicts and deep nesting.'
    },
    {
      id: 'htmlcss-15',
      q: 'What is CSS Subgrid and what problem does it solve?',
      a: 'Subgrid (grid-template-columns: subgrid) allows a child element that is itself a grid container to adopt the rows or columns of its parent grid. This solves alignment problems where cards in adjacent columns need their headers, bodies, and footers aligned across rows perfectly.'
    },
    {
      id: 'htmlcss-16',
      q: 'What is the difference between SVG and Canvas in HTML5?',
      a: 'SVG is XML-based vector graphics, retaining resolution at any scale, with DOM elements that support CSS styling and event listeners (better for UI icons, charts, and interactive diagrams). Canvas is raster-based (pixel-by-pixel immediate mode rendering via JS), ideal for high-performance animations, games, and video processing.'
    },
    {
      id: 'htmlcss-17',
      q: 'What are Data Attributes (data-*) in HTML5 and how do you access them in CSS and JS?',
      a: 'data-* attributes store custom application data on HTML elements. In JS, access them via element.dataset.propertyName (camelCased). In CSS, match them using attribute selectors like [data-status="active"] and display their values with content: attr(data-label).'
    },
    {
      id: 'htmlcss-18',
      q: 'What are CSS pseudo-classes :is(), :where(), and :has()?',
      a: ':is(h1, h2, h3) groups selectors with the specificity of the most specific selector in the list. :where() does the same but with zero specificity. :has() is the "parent selector" allowing an element to be styled based on its children or following siblings (e.g. figure:has(figcaption)).'
    },
    {
      id: 'htmlcss-19',
      q: 'How does CSS will-change work and what are the performance trade-offs?',
      a: 'will-change informs the browser in advance about anticipated changes (e.g. will-change: transform), allowing the browser to allocate a GPU composition layer ahead of time for buttery smooth 60fps animations. Overusing will-change consumes excessive GPU memory and degrades overall performance.'
    },
    {
      id: 'htmlcss-20',
      q: 'Explain the srcset and sizes attributes on the <img> tag for responsive images.',
      a: 'srcset defines a comma-separated list of image source URLs paired with width descriptors (e.g. image-800w.jpg 800w). sizes tells the browser the layout width of the image slot at various media query conditions (e.g. (max-width: 600px) 100vw, 50vw). The browser uses both plus device pixel ratio (DPR) to fetch the smallest optimal file.'
    },
    {
      id: 'htmlcss-21',
      q: 'What is the purpose of ARIA attributes (e.g. aria-label, aria-live, aria-expanded)?',
      a: 'Accessible Rich Internet Applications (ARIA) attributes bridge semantic gaps in dynamic web apps for screen readers. aria-label provides accessible names when no visual text exists; aria-live informs assistive technologies of dynamic content changes (polite vs assertive); aria-expanded communicates accordion or dropdown open/closed states.'
    },
    {
      id: 'htmlcss-22',
      q: 'Explain the difference between localStorage, sessionStorage, Cookies, and IndexedDB.',
      a: 'Cookies: ~4KB, sent with every HTTP request, configurable expiration, supports HttpOnly/Secure flags. localStorage: ~5-10MB, synchronous key-value store, persists indefinitely across sessions. sessionStorage: ~5MB, scoped to the browser tab session, cleared on tab close. IndexedDB: large structured NoSQL object store, asynchronous, supports indexes and transactions.'
    },
    {
      id: 'htmlcss-23',
      q: 'What is content-visibility: auto in CSS and how does it optimize page loading?',
      a: 'content-visibility: auto instructs the browser to skip rendering and layout calculations for off-screen elements until the user scrolls near them, acting like virtualized rendering for pure CSS. Paired with contain-intrinsic-size, it dramatically speeds up initial paint on long web pages.'
    },
    {
      id: 'htmlcss-24',
      q: 'What causes Reflow (Layout) vs Repaint, and how do you minimize them in web performance?',
      a: 'Reflow occurs when changes affect element geometry or layout (width, height, fontSize, offsetTop), recalculating positions of elements. Repaint occurs when visual styling changes without affecting layout (color, background, visibility). Changes to transform and opacity trigger neither reflow nor repaint, operating directly on the compositor thread.'
    },
    {
      id: 'htmlcss-25',
      q: 'What is Web Open Font Format 2 (WOFF2) and font-display: swap?',
      a: 'WOFF2 is the standard web font format offering superior Brotli compression (~30% smaller than WOFF). font-display: swap tells the browser to display fallback system text immediately (avoiding Flash of Invisible Text - FOIT) and swap to the web font once it finishes downloading.'
    },
    {
      id: 'htmlcss-26',
      q: 'What is Shadow DOM and how does it achieve CSS encapsulation?',
      a: 'Shadow DOM is a Web Component standard that creates an isolated, scoped DOM subtree attached to an element. Styles defined inside a shadow root cannot bleed out, and global document styles cannot penetrate in (except inherited properties like color/font and custom CSS properties).'
    },
    {
      id: 'htmlcss-27',
      q: 'How do you create accessible, focusable keyboard navigation with tabindex in HTML?',
      a: 'tabindex="0" makes a non-interactive element (like a <div>) keyboard focusable in natural tab order. tabindex="-1" makes an element programmatically focusable via JS element.focus() but excludes it from sequential tab order. Positive values (tabindex="1+") disrupt natural document tab flow and are an anti-pattern.'
    },
    {
      id: 'htmlcss-28',
      q: 'What is the difference between CSS Transitions and CSS Animations (@keyframes)?',
      a: 'Transitions animate changes smoothly between two defined states (start and end) triggered by an event (like :hover). Animations using @keyframes allow complex, multi-step sequences with custom keyframe percentages (0%, 50%, 100%), looping (infinite), alternate directions, and automatic triggers.'
    },
    {
      id: 'htmlcss-29',
      q: 'What are CSS Container Queries (@container) and how do they differ from Media Queries?',
      a: 'Media queries (@media) query the global viewport dimensions or device capabilities. Container Queries (@container) allow an element to adapt its layout based on the size of its immediate parent or designated container, enabling truly self-contained, modular UI components.'
    },
    {
      id: 'htmlcss-30',
      q: 'What is the role of Content Security Policy (CSP) headers in web security?',
      a: 'CSP is an HTTP response header that restricts the resources (scripts, images, stylesheets, iframes) the browser is allowed to load and execute for a given page. It mitigates Cross-Site Scripting (XSS), clickjacking, and data injection attacks by enforcing a whitelist of trusted domains and nonces.'
    }
  ],

  // -------------------------------------------------------------
  // 2. VUE.JS (30 Questions)
  // -------------------------------------------------------------
  vue: [
    {
      id: 'vue-1',
      q: 'What is the difference between the Vue 2 Options API and Vue 3 Composition API?',
      a: 'Options API organizes component logic by property types (data, methods, computed, watch, mounted), which fractures feature logic across large files. Composition API (<script setup>, ref, reactive, computed) organizes code by logical concerns/features, enabling superior code colocation, reusability via composables, and seamless TypeScript integration.'
    },
    {
      id: 'vue-2',
      q: 'How does Vue 3 reactivity work with ES6 Proxy vs Vue 2 Object.defineProperty()?',
      a: 'Vue 2 used Object.defineProperty() to convert properties into getters/setters, failing to detect dynamically added/deleted properties or direct array index modifications (requiring Vue.set). Vue 3 uses ES6 Proxy to wrap entire objects, intercepting all operations (get, set, deleteProperty, has) natively, with faster initialization and smaller memory footprint.'
    },
    {
      id: 'vue-3',
      q: 'What is the difference between ref() and reactive() in Vue 3?',
      a: 'ref() takes any primitive or object value and wraps it in a reactive object with a .value property (automatically unwrapped in templates). reactive() only takes objects/arrays and returns a deep reactive Proxy without .value. However, destructuring a reactive() object destroys reactivity (unless toRefs() is used).'
    },
    {
      id: 'vue-4',
      q: 'Explain the Vue 3 component lifecycle hooks.',
      a: 'Creation: setup() (runs before create). Mounting: onBeforeMount -> onMounted (DOM accessible). Updating: onBeforeUpdate -> onUpdated (DOM patched). Unmounting: onBeforeUnmount -> onUnmounted (clean up timers, listeners). Error handling: onErrorCaptured.'
    },
    {
      id: 'vue-5',
      q: 'What is the difference between computed properties and watch/watchEffect in Vue?',
      a: 'computed is declarative and cached based on its reactive dependencies, re-evaluating only when dependencies change, and must return a value. watch is imperative, watching specific sources to trigger side effects (API calls, logging) with access to old and new values. watchEffect automatically tracks dependencies executed within its callback function immediately.'
    },
    {
      id: 'vue-6',
      q: 'What is <script setup> in Vue 3 and why is it recommended?',
      a: '<script setup> is compile-time syntactic sugar for using the Composition API inside Single File Components (SFC). Variables and functions declared at top level are automatically exposed to the template without explicit return statements. It compiles into more performant render functions with zero runtime overhead.'
    },
    {
      id: 'vue-7',
      q: 'What is Pinia and how does it improve over Vuex 4?',
      a: 'Pinia is the official lightweight state management library for Vue. Improvements over Vuex: 1) Full TypeScript type inference without boilerplate. 2) No mutations; actions can be synchronous or asynchronous. 3) Modular store architecture by default without namespacing hoops. 4) Extremely lightweight (<1KB).'
    },
    {
      id: 'vue-8',
      q: 'What is a Vue Composable and how does it compare to React Custom Hooks?',
      a: 'A composable is a function that leverages Vue Composition API to encapsulate and share stateful logic (e.g. useMouse, useFetch). Similar to React custom hooks, but Vue composables only execute once during setup rather than re-running on every reactive update, avoiding dependency array bugs.'
    },
    {
      id: 'vue-9',
      q: 'What is the purpose of defineProps and defineEmits in <script setup>?',
      a: 'They are compiler macros available only inside <script setup> (no import required). defineProps declares the reactive props passed from parent with runtime or TypeScript type validation. defineEmits declares custom events the component can emit to notify parents.'
    },
    {
      id: 'vue-10',
      q: 'Explain Vue Teleport and practical scenarios where it is used.',
      a: '<Teleport to="#modal-root"> renders a component’s template DOM subtree into a different part of the DOM outside the component hierarchy (such as document.body), while retaining component state, props, and parent-child event communication. Ideal for modals, tooltips, toasts, and dropdowns.'
    },
    {
      id: 'vue-11',
      q: 'What is Vue Suspense and how does it handle asynchronous components?',
      a: '<Suspense> is a built-in component that orchestrates nested async dependencies (async setup(), top-level await, or defineAsyncComponent). It displays a #fallback template until all async child dependencies resolve before rendering the default slot.'
    },
    {
      id: 'vue-12',
      q: 'How does v-model two-way binding work under the hood in Vue 3?',
      a: 'On standard form inputs, v-model="text" is shorthand for :value="text" @input="text = $event.target.value". On custom components, Vue 3 defaults to :modelValue="text" and @update:modelValue="text = $event". Vue 3 also supports multiple named v-models (e.g. v-model:first="a" v-model:last="b").'
    },
    {
      id: 'vue-13',
      q: 'What is the difference between v-if and v-show?',
      a: 'v-if conditionally renders the element by physically inserting or destroying it from the DOM tree, with higher toggle cost. v-show always renders the element into the DOM and toggles its CSS display: none property, with higher initial render cost but cheaper toggle cost.'
    },
    {
      id: 'vue-14',
      q: 'Why is the :key attribute mandatory in v-for loops in Vue?',
      a: ':key provides a unique identifier for Vue’s virtual DOM reconciliation algorithm to track node identity across updates. Without unique keys (or using array indices), Vue reuses in-place DOM elements, leading to rendering bugs with form state, animations, and child component states.'
    },
    {
      id: 'vue-15',
      q: 'What is provide and inject in Vue and what is its primary use case?',
      a: 'provide/inject allows an ancestor component to serve as a dependency provider for all its descendants regardless of component tree depth, avoiding "prop drilling". Values provided can be reactive refs to maintain reactivity across the tree.'
    },
    {
      id: 'vue-16',
      q: 'What is nextTick() in Vue and when would you use it?',
      a: 'Vue batches DOM updates asynchronously after reactive state changes. nextTick(callback) returns a Promise that resolves immediately after the next DOM update cycle completes, allowing you to safely read DOM measurements or manipulate updated DOM elements.'
    },
    {
      id: 'vue-17',
      q: 'How does KeepAlive work in Vue and what lifecycle hooks does it add?',
      a: '<KeepAlive> caches inactive component instances in memory rather than destroying them when switching dynamic components (<component :is="...">). It adds two lifecycle hooks: onActivated (called when component enters DOM) and onDeactivated (called when cached).'
    },
    {
      id: 'vue-18',
      q: 'What is the difference between scoped CSS and CSS Modules in Vue SFC?',
      a: 'Scoped CSS (<style scoped>) adds a unique data attribute (e.g. data-v-7ba5bd90) to component elements and rewrites CSS selectors to target that attribute. CSS Modules (<style module>) compiles class names into unique hashed identifiers exposed via the $style object.'
    },
    {
      id: 'vue-19',
      q: 'What are custom directives in Vue and when should you create one?',
      a: 'Custom directives (e.g. v-focus, v-click-outside) provide low-level direct DOM access on elements. They define lifecycle hooks (created, mounted, updated, unmounted) for DOM manipulation that cannot be achieved via declarative templates.'
    },
    {
      id: 'vue-20',
      q: 'What is defineAsyncComponent and how does it support route lazy loading?',
      a: 'defineAsyncComponent(() => import("./HeavyComp.vue")) dynamically imports component code only when it needs to be rendered, splitting code into separate bundle chunks. In Vue Router, passing () => import("./Page.vue") enables route-level code splitting.'
    },
    {
      id: 'vue-21',
      q: 'What are Vue Slots, Scoped Slots, and Named Slots?',
      a: 'Slots allow passing template content into child components. Named slots (<slot name="header">) allow defining multiple distinct content outlets. Scoped slots pass data from the child back up to the parent slot template (<slot :item="item">).'
    },
    {
      id: 'vue-22',
      q: 'Explain shallowRef and shallowReactive and their performance benefits.',
      a: 'shallowRef only tracks mutations to the .value property itself; nested object properties are not reactive. shallowReactive only tracks root-level properties. They provide massive performance boosts when wrapping large immutable datasets or external third-party instances (like Leaflet maps or Three.js scenes).'
    },
    {
      id: 'vue-23',
      q: 'What is the purpose of markRaw() in Vue 3?',
      a: 'markRaw(obj) marks an object so that it will never be converted into a reactive Proxy. Used for complex external instances (e.g. Chart.js, Axios, WebGL contexts) that should not incur reactivity overhead.'
    },
    {
      id: 'vue-24',
      q: 'How does Vue Router navigation guards work (beforeEach, beforeEnter, beforeRouteEnter)?',
      a: 'Navigation guards intercept route transitions. router.beforeEach runs globally before any navigation, commonly used for auth redirects. beforeEnter is route-specific. Component-level guards like onBeforeRouteUpdate and onBeforeRouteLeave handle component-specific transition logic.'
    },
    {
      id: 'vue-25',
      q: 'What is VitePress and Nuxt 3 in the Vue ecosystem?',
      a: 'Nuxt 3 is a full-stack meta-framework for Vue providing SSR, SSG, file-based routing, auto-imports, and server engine (Nitro). VitePress is a fast static site generator powered by Vite and Vue, optimized for technical documentation and blogs.'
    },
    {
      id: 'vue-26',
      q: 'Explain the difference between watch and watchEffect flush options (pre, post, sync).',
      a: 'flush: "pre" (default) runs the watcher callback before the DOM updates. flush: "post" runs the watcher callback after the DOM has updated (accessible via watchPostEffect). flush: "sync" runs synchronously the instant reactive state changes.'
    },
    {
      id: 'vue-27',
      q: 'What is toRef and toRefs and how do they preserve reactivity when destructuring?',
      a: 'Destructuring a reactive object breaks reactivity because properties become plain values. toRefs(reactiveObj) converts every property of the object into an individual ref connected to the original source. toRef(obj, "key") creates a ref for a single property.'
    },
    {
      id: 'vue-28',
      q: 'How does Vue 3 compiler optimize Virtual DOM rendering with Patch Flags and Hoisting?',
      a: 'Vue 3 static analysis hoists static VNodes outside render functions so they are created only once. Dynamic nodes receive numeric Bitwise Patch Flags (e.g. TEXT, CLASS, PROPS), enabling the runtime diffing algorithm to skip unchanged nodes and inspect only dynamic properties.'
    },
    {
      id: 'vue-29',
      q: 'How do you handle global error handling in Vue 3 applications?',
      a: 'Set app.config.errorHandler = (err, instance, info) => { ... } to catch unhandled errors from all component renders, watchers, and event handlers. For subtree errors, components can implement onErrorCaptured lifecycle hook.'
    },
    {
      id: 'vue-30',
      q: 'What is hydration in Vue SSR and what causes Hydration Mismatches?',
      a: 'Hydration is the process where client-side Vue attaches event listeners and takes over pre-rendered static HTML from the server. A hydration mismatch occurs when the server-rendered HTML does not match the client’s initial Virtual DOM (e.g. using Date.now() or window size during render).'
    }
  ],

  // -------------------------------------------------------------
  // 3. JAVA SPRING BOOT (30 Questions)
  // -------------------------------------------------------------
  java_spring: [
    {
      id: 'spring-1',
      q: 'What is Inversion of Control (IoC) and Dependency Injection (DI) in Spring?',
      a: 'IoC is a software design principle where the control of object creation, configuration, and lifecycle is transferred from the application code to a container (Spring IoC Container / ApplicationContext). Dependency Injection is the mechanism implementing IoC: dependencies are provided to an object via Constructor Injection, Setter Injection, or Field Injection (@Autowired).'
    },
    {
      id: 'spring-2',
      q: 'Why is Constructor Injection preferred over Field Injection (@Autowired on fields)?',
      a: 'Constructor injection ensures immutability (dependencies can be declared final), guarantees that beans cannot be instantiated in an uninitialized state, prevents NullPointerExceptions, simplifies unit testing without mocking reflection frameworks, and immediately detects circular dependencies at startup.'
    },
    {
      id: 'spring-3',
      q: 'What are Spring Bean Scopes and what is the default scope?',
      a: 'Default scope is Singleton (one instance per Spring IoC container). Other scopes: Prototype (new instance every time requested), Request (one per HTTP request in web apps), Session (one per HTTP session), and Application (one per ServletContext).'
    },
    {
      id: 'spring-4',
      q: 'What does @SpringBootApplication encapsulate?',
      a: 'It combines three annotations: 1) @Configuration (marks class as source of bean definitions). 2) @EnableAutoConfiguration (enables Spring Boot auto-configuration based on classpath jars). 3) @ComponentScan (scans the package and sub-packages for @Component, @Service, @Repository, @Controller).'
    },
    {
      id: 'spring-5',
      q: 'What is Spring AOP (Aspect-Oriented Programming) and what are Pointcut and Advice?',
      a: 'Spring AOP modularizes cross-cutting concerns (logging, security, transaction management) away from business logic. An Aspect is the module. Advice is the action taken (Before, After, AfterReturning, AfterThrowing, Around). Pointcut is a predicate expression defining where advice should execute.'
    },
    {
      id: 'spring-6',
      q: 'How does @Transactional work in Spring and what causes rollback failures?',
      a: '@Transactional uses Spring AOP proxies to wrap method execution in a database transaction. By default, it rolls back ONLY on unchecked exceptions (RuntimeException and Error), NOT checked exceptions (unless specified via rollbackFor = Exception.class). It also fails to intercept calls made from within the same class (self-invocation bypasses the proxy).'
    },
    {
      id: 'spring-7',
      q: 'What is the N+1 Query Problem in Spring Data JPA / Hibernate and how do you resolve it?',
      a: 'The N+1 problem occurs when fetching an entity with lazy relationships triggers 1 query for the parent list and N individual queries for each child. Solutions: 1) Use JOIN FETCH in JPQL (@Query("SELECT p FROM Parent p JOIN FETCH p.children")). 2) Use @EntityGraph. 3) Configure Hibernate batch fetching (@BatchSize).'
    },
    {
      id: 'spring-8',
      q: 'What is the difference between @Component, @Service, and @Repository?',
      a: '@Component is the generic stereotype for any Spring-managed component. @Service specializes it for business logic layers. @Repository specializes it for data access layers and automatically translates database-specific SQLExceptions into Spring’s DataAccessException hierarchy.'
    },
    {
      id: 'spring-9',
      q: 'What is the difference between JPA and Hibernate?',
      a: 'JPA (Jakarta Persistence API) is a standard Java specification (interfaces, annotations) defining Object-Relational Mapping. Hibernate is an open-source ORM framework that implements the JPA specification, adding additional features like caching and custom types.'
    },
    {
      id: 'spring-10',
      q: 'Explain First-Level and Second-Level Cache in Hibernate.',
      a: 'First-Level Cache is mandatory and bound to the current Hibernate Session / EntityManager; it caches entities within the transaction. Second-Level Cache is optional, application-wide across sessions (e.g. Ehcache, Hazelcast, Redis), caching data across multiple transactions.'
    },
    {
      id: 'spring-11',
      q: 'What is Spring Boot Actuator and what are its key endpoints?',
      a: 'Spring Boot Actuator provides production-ready monitoring and management endpoints. Key endpoints: /actuator/health (liveness/readiness for Kubernetes), /actuator/metrics (JVM, CPU, memory, HTTP latency), /actuator/env (environment properties), and /actuator/loggers.'
    },
    {
      id: 'spring-12',
      q: 'What is the difference between @RestController and @Controller in Spring MVC?',
      a: '@Controller is used in traditional MVC web apps returning view templates (JSP, Thymeleaf). @RestController is a convenience annotation combining @Controller and @ResponseBody, automatically serializing return values directly into JSON/XML HTTP response bodies.'
    },
    {
      id: 'spring-13',
      q: 'How does Spring Security filter chain work and what is SecurityFilterChain?',
      a: 'Spring Security intercepts HTTP requests through a chain of servlet filters (DelegatingFilterProxy -> FilterChainProxy). SecurityFilterChain defines rules for authentication (UsernamePasswordAuthenticationFilter, BearerTokenAuthenticationFilter) and authorization (csrf, cors, authorizeHttpRequests).'
    },
    {
      id: 'spring-14',
      q: 'Explain JWT authentication flow in a Spring Boot REST API.',
      a: '1) Client POSTs credentials to /login. 2) AuthenticationManager authenticates credentials. 3) JwtService generates signed JWT. 4) Client sends JWT in Authorization: Bearer <token> header for subsequent requests. 5) JwtAuthenticationFilter intercepts request, validates signature, extracts claims, and populates SecurityContextHolder.'
    },
    {
      id: 'spring-15',
      q: 'What are optimistic locking and pessimistic locking in JPA?',
      a: 'Optimistic locking uses a @Version column; if another transaction modifies the record before commit, an OptimisticLockException is thrown. Pessimistic locking locks the database row directly (SELECT ... FOR UPDATE) preventing concurrent access until the transaction completes.'
    },
    {
      id: 'spring-16',
      q: 'What is the purpose of @ControllerAdvice and @ExceptionHandler?',
      a: '@ControllerAdvice provides global exception handling across all controllers. Methods annotated with @ExceptionHandler(CustomException.class) catch specific exceptions, log details, and return standardized ResponseEntity error schemas (e.g. RFC 7807 Problem Details).'
    },
    {
      id: 'spring-17',
      q: 'How do you handle database migrations in Spring Boot using Flyway or Liquibase?',
      a: 'Flyway applies versioned SQL scripts (V1__init.sql, V2__add_users.sql) sequentially upon application startup, tracking applied versions in a flyway_schema_history table. This ensures deterministic, automated, and reproducible schema updates across all environments.'
    },
    {
      id: 'spring-18',
      q: 'What is Spring WebFlux and how does it compare to Spring MVC?',
      a: 'Spring MVC is a synchronous, blocking I/O framework following the thread-per-request model (Tomcat). Spring WebFlux is an asynchronous, non-blocking reactive framework based on Project Reactor (Mono, Flux) running on Netty, handling high concurrent connections with minimal threads.'
    },
    {
      id: 'spring-19',
      q: 'What is Spring Cloud Config Server and how does it enable centralized configuration?',
      a: 'Spring Cloud Config Server provides externalized, centralized configuration management backed by a Git repository. Microservices fetch environment-specific configurations at startup and refresh configurations dynamically via /actuator/refresh.'
    },
    {
      id: 'spring-20',
      q: 'What is Resilience4j in Spring Boot and what patterns does it provide?',
      a: 'Resilience4j is a fault-tolerance library providing resilience patterns: Circuit Breaker (stops cascading failures), Rate Limiter (throttles requests), Retry (retries transient failures), Bulkhead (isolates thread pools), and TimeLimiter.'
    },
    {
      id: 'spring-21',
      q: 'What is the difference between @NotNull, @NotEmpty, and @NotBlank in Bean Validation?',
      a: '@NotNull ensures the value is not null (empty strings or whitespace allowed). @NotEmpty ensures not null and size/length > 0 (whitespace allowed). @NotBlank ensures not null and contains at least one non-whitespace character (strings only).'
    },
    {
      id: 'spring-22',
      q: 'What is Spring Data JPA Projections (Interface-based vs DTO-based)?',
      a: 'Projections retrieve only a subset of columns rather than full entity tables. Interface-based projections define getter methods for desired columns; DTO projections use constructor expressions (SELECT new com.dto.UserDTO(u.id, u.name) FROM User u), avoiding unnecessary database I/O.'
    },
    {
      id: 'spring-23',
      q: 'Explain Spring Boot profiles and how they are activated.',
      a: 'Profiles segregate parts of application configuration for specific environments (application-dev.yml, application-prod.yml). They are activated via spring.profiles.active property, command line flags (--spring.profiles.active=prod), or environment variables.'
    },
    {
      id: 'spring-24',
      q: 'What is the purpose of @Async in Spring and what must be configured to enable it?',
      a: '@Async runs a method in a separate thread pool asynchronously, returning void or CompletableFuture<T>. It requires @EnableAsync on a configuration class and an explicit TaskExecutor bean configuration to avoid default unbounded SimpleAsyncTaskExecutor.'
    },
    {
      id: 'spring-25',
      q: 'How does Spring Kafka integrate Apache Kafka into Spring applications?',
      a: 'Spring Kafka provides KafkaTemplate for publishing messages and @KafkaListener for consuming messages asynchronously from topics, handling consumer groups, offset commits, partition rebalancing, and dead-letter topics (DLT).'
    },
    {
      id: 'spring-26',
      q: 'What is the difference between save() and saveAndFlush() in Spring Data JPA?',
      a: 'save() marks the entity to be persisted/merged in the Hibernate Persistence Context; the SQL INSERT/UPDATE is executed later during transaction commit or flush. saveAndFlush() immediately executes the SQL flush to the database within the transaction.'
    },
    {
      id: 'spring-27',
      q: 'What is the Open Session in View (OSIV) anti-pattern in Spring Boot?',
      a: 'OSIV keeps the Hibernate Session open throughout the entire HTTP request lifecycle to allow lazy loading in views/controllers. It holds database connections open longer than necessary, causing connection pool exhaustion under load; it should be set to spring.jpa.open-in-view=false.'
    },
    {
      id: 'spring-28',
      q: 'What is Virtual Threads (Project Loom) support in Spring Boot 3.2+?',
      a: 'Spring Boot 3.2+ supports Java 21 Virtual Threads via spring.threads.virtual.enabled=true. Virtual threads are lightweight, JVM-managed threads that unblock underlying carrier OS threads during blocking I/O, achieving high-throughput concurrency without reactive programming complexities.'
    },
    {
      id: 'spring-29',
      q: 'How does Spring Boot handle Graceful Shutdown?',
      a: 'Configuring server.shutdown=graceful allows the embedded web server (Tomcat/Jetty) to stop accepting new requests and provide an active grace period (spring.lifecycle.timeout-per-shutdown-phase=30s) for in-flight requests to complete before terminating.'
    },
    {
      id: 'spring-30',
      q: 'How do you test Spring Boot applications using @SpringBootTest, @WebMvcTest, and @DataJpaTest?',
      a: '@SpringBootTest loads the entire application context for full integration tests. @WebMvcTest slices only the web layer (controllers, filters) mocking services with @MockBean. @DataJpaTest slices only repository and database components with an embedded/test database.'
    }
  ],

  // -------------------------------------------------------------
  // 4. GO (GOLANG) (30 Questions)
  // -------------------------------------------------------------
  golang: [
    {
      id: 'go-1',
      q: 'What are Goroutines and how do they differ from OS threads?',
      a: 'Goroutines are lightweight user-space threads managed by the Go runtime scheduler (M:N scheduler). A goroutine starts with only ~2KB of stack memory (which grows and shrinks dynamically), whereas an OS thread requires 1-2MB with fixed stack size. Context switching between goroutines occurs in user space without expensive kernel interrupts, allowing millions of goroutines to run concurrently.'
    },
    {
      id: 'go-2',
      q: 'Explain the Go GMP Scheduler Model (G, M, P).',
      a: 'G represents a Goroutine (stack, instruction pointer). M represents an OS thread (Machine). P represents a Processor (logical context with a local run queue of goroutines, GOMAXPROCS). An OS thread (M) must acquire a processor (P) to execute goroutines (G). Work-stealing allows idle Ps to steal half of another P’s run queue.'
    },
    {
      id: 'go-3',
      q: 'What is the difference between Buffered and Unbuffered Channels in Go?',
      a: 'An unbuffered channel (make(chan int)) has capacity 0; sending blocks until another goroutine receives from it, synchronizing both goroutines. A buffered channel (make(chan int, 10)) has a FIFO buffer; sending only blocks when the buffer is full, and receiving only blocks when the buffer is empty.'
    },
    {
      id: 'go-4',
      q: 'What happens when you send to or receive from a closed channel in Go?',
      a: 'Sending to a closed channel causes a runtime panic. Receiving from a closed channel yields the remaining buffered values; once empty, it yields the zero-value of the channel type without blocking (v, ok := <-ch returns ok == false). Closing an already closed or nil channel panics.'
    },
    {
      id: 'go-5',
      q: 'What is the select statement in Go and what happens if multiple cases are ready?',
      a: 'The select statement allows a goroutine to wait on multiple channel communications. If multiple cases are ready simultaneously, Go picks one at pseudo-random. If no cases are ready and a default: block exists, it executes immediately without blocking.'
    },
    {
      id: 'go-6',
      q: 'How does Go handle errors without exceptions (panic/recover vs error interface)?',
      a: 'Go treats errors as regular return values implementing the error interface: type error interface { Error() string }. Idiomatic Go checks if err != nil immediately. panic is reserved for unrecoverable errors (out of memory, nil dereference) and can only be caught using recover() inside a deferred function.'
    },
    {
      id: 'go-7',
      q: 'Explain the defer statement and its execution order.',
      a: 'defer schedules a function call to be executed immediately after the surrounding function returns, commonly used for resource cleanup (file.Close(), mutex.Unlock()). Deferred calls are executed in Last-In-First-Out (LIFO) order. Arguments to deferred functions are evaluated immediately when defer is encountered.'
    },
    {
      id: 'go-8',
      q: 'What is the difference between Array and Slice in Go?',
      a: 'An array has a fixed length defined at compile time ([5]int) and is passed by value (copying all elements). A slice is a dynamic view over an underlying array; it is a 24-byte struct consisting of a pointer to the array, a length (len), and a capacity (cap).'
    },
    {
      id: 'go-9',
      q: 'What is the make() vs new() function in Go?',
      a: 'new(T) allocates zeroed memory for type T and returns a pointer (*T). make(T, args) is used only for slices, maps, and channels; it initializes the internal data structures and returns an initialized value of type T (not a pointer).'
    },
    {
      id: 'go-10',
      q: 'How do Interfaces work in Go and what is Duck Typing / Implicit Implementation?',
      a: 'An interface defines a method set. In Go, a type implements an interface implicitly simply by implementing all methods in that interface—no "implements" keyword exists. Under the hood, an interface value is a 2-word pair: (itab pointer with concrete type metadata, pointer to value).'
    },
    {
      id: 'go-11',
      q: 'What is the empty interface interface{} (or any in Go 1.18+) and type assertions?',
      a: 'interface{} or any can hold values of any type because all types implement zero methods. To access the underlying concrete type, use a type assertion: val, ok := x.(string). If ok is false, it avoids a runtime panic.'
    },
    {
      id: 'go-12',
      q: 'What is the sync.Mutex vs sync.RWMutex in Go?',
      a: 'sync.Mutex provides mutual exclusion; only one goroutine can hold the lock at a time. sync.RWMutex allows multiple readers (RLock()) simultaneously while ensuring exclusive access for writers (Lock()), significantly improving read-heavy performance.'
    },
    {
      id: 'go-13',
      q: 'What is sync.WaitGroup and how do you avoid common race conditions with it?',
      a: 'sync.WaitGroup coordinates waiting for a collection of goroutines to finish. wg.Add(1) increments the counter, wg.Done() decrements it, and wg.Wait() blocks until counter is 0. Common pitfall: wg.Add() must be called BEFORE launching the goroutine, and wg must be passed by pointer.'
    },
    {
      id: 'go-14',
      q: 'Explain the context package (context.Context) in Go.',
      a: 'Context carries deadlines, cancellation signals, and request-scoped values across API boundaries and goroutines. Common constructors: context.Background(), context.WithCancel(), context.WithTimeout(), and context.WithValue(). When a parent context cancels, all child goroutines listening to ctx.Done() terminate gracefully.'
    },
    {
      id: 'go-15',
      q: 'What is escape analysis in Go and what causes variables to escape to the heap?',
      a: 'Escape analysis is a compiler optimization that determines whether a variable can be allocated on the fast stack or must escape to the heap. A variable escapes to the heap if its reference outlives the function call (returning a pointer), if its size is dynamic/unknown, or if passed to an interface{} parameter (e.g. fmt.Println).'
    },
    {
      id: 'go-16',
      q: 'How does Go Garbage Collection work?',
      a: 'Go uses a concurrent, tri-color mark-and-sweep garbage collector designed for sub-millisecond stop-the-world (STW) pauses. Objects are marked White (unvisited/garbage candidate), Grey (visited, children pending), and Black (reachable). Pacer algorithm adjusts GC frequency based on GOGC (default 100%).'
    },
    {
      id: 'go-17',
      q: 'What is sync.Pool and when should you use it?',
      a: 'sync.Pool is a concurrent set of temporary objects that can be saved and retrieved to relieve pressure on the Garbage Collector. Ideal for reusing allocated byte buffers or structs across high-throughput request handlers.'
    },
    {
      id: 'go-18',
      q: 'What is the Race Detector in Go and how do you use it?',
      a: 'Go includes a built-in race detector powered by ThreadSanitizer. Running go test -race or go run -race instruments memory accesses to detect data races (concurrent read/write to shared memory without synchronization) at runtime.'
    },
    {
      id: 'go-19',
      q: 'Explain Generics (Type Parameters) introduced in Go 1.18.',
      a: 'Generics allow writing functions and data structures with type parameters constrained by interfaces (e.g. func Min[T constraints.Ordered](a, b T) T). Go uses Monomorphization with GCShape stashing to generate efficient code without code bloat.'
    },
    {
      id: 'go-20',
      q: 'What is the difference between Value Receiver and Pointer Receiver in Go methods?',
      a: 'A value receiver (func (t Type) Method()) receives a copy of the struct; modifications do not affect the caller. A pointer receiver (func (t *Type) Method()) receives the memory address; modifications mutate the caller, and it avoids copying large structs.'
    },
    {
      id: 'go-21',
      q: 'What are Go Modules (go.mod and go.sum)?',
      a: 'Go Modules is the official dependency management system. go.mod records the module path, Go version, and required dependencies with semantic versions. go.sum contains cryptographic SHA-256 checksums to guarantee build reproducibility and tamper protection.'
    },
    {
      id: 'go-22',
      q: 'What is embedding in Go structs and interfaces?',
      a: 'Go does not support classical inheritance; instead, it uses composition via struct embedding (anonymous fields). The outer struct automatically promotes all fields and methods of the embedded struct, allowing method overriding and interface satisfaction.'
    },
    {
      id: 'go-23',
      q: 'How does Go handle HTTP servers and connection concurrency (net/http)?',
      a: 'Go’s net/http server automatically spawns a new goroutine for every incoming TCP connection (go c.serve(ctx)). Because goroutines are extremely lightweight, Go servers handle tens of thousands of concurrent connections out-of-the-box without thread pooling.'
    },
    {
      id: 'go-24',
      q: 'What is the init() function in Go and in what order does it execute?',
      a: 'init() functions execute automatically before main() without explicit invocation. Execution order: 1) Imported package constants and variables. 2) Imported package init() functions recursively. 3) Current package variables, then init() functions in file alphabetical order.'
    },
    {
      id: 'go-25',
      q: 'What is the difference between string and []byte in Go and what is []rune?',
      a: 'A string is an immutable read-only slice of bytes ([]byte) typically encoded in UTF-8. A rune is an alias for int32, representing a single Unicode Code Point. Converting a string with multi-byte characters to []rune allows indexing by characters rather than raw bytes.'
    },
    {
      id: 'go-26',
      q: 'What is sync.Once and how is it used to implement thread-safe Singletons?',
      a: 'sync.Once guarantees that a function is executed exactly once across all goroutines, even under heavy concurrent access. once.Do(func() { instance = &Singleton{} }) provides thread-safe lazy initialization with zero mutex lock overhead after initial execution.'
    },
    {
      id: 'go-27',
      q: 'What is pprof in Go and how do you profile CPU and Memory?',
      a: 'pprof is Go’s built-in profiling tool. By importing _ "net/http/pprof", an HTTP server exposes profiling endpoints (/debug/pprof/). Developers use go tool pprof to analyze CPU flame graphs, memory allocations (alloc_space, inuse_space), and block/mutex contention.'
    },
    {
      id: 'go-28',
      q: 'What causes Goroutine Leaks and how do you diagnose them?',
      a: 'Goroutine leaks occur when a goroutine is launched but blocks indefinitely on an unbuffered channel send/receive with no receiver, an uncancelled context, or an unclosed resource. Diagnose by inspecting runtime.NumGoroutine() or using pprof goroutine dump.'
    },
    {
      id: 'go-29',
      q: 'Explain the internal implementation of Go Maps.',
      a: 'Go maps are implemented as hash tables consisting of buckets (each holding 8 key-value pairs). High bits of the hash select the tophash inside the bucket; low bits select the bucket index. When load factor exceeds 6.5, the map doubles its bucket count incrementally (evacuation).'
    },
    {
      id: 'go-30',
      q: 'What is the atomic package (sync/atomic) and when should it be preferred over Mutex?',
      a: 'sync/atomic provides low-level atomic memory primitives (AddInt64, CompareAndSwap, LoadPointer) directly implemented via CPU hardware instructions (CAS). It is lock-free and significantly faster than Mutex for simple counter updates or state flags.'
    }
  ],

  // -------------------------------------------------------------
  // 5. MICROSERVICES & APIS (30 Questions)
  // -------------------------------------------------------------
  microservices: [
    {
      id: 'ms-1',
      q: 'What is the Saga Pattern in distributed microservices and how does Orchestration differ from Choreography?',
      a: 'The Saga pattern manages distributed transactions across multiple microservices using a sequence of local transactions. If a step fails, compensating transactions undo preceding steps. In Orchestration, a central coordinator service tells participants what local transactions to execute. In Choreography, services react to domain events published by each other via message brokers.'
    },
    {
      id: 'ms-2',
      q: 'What is the API Gateway Pattern and what responsibilities does it handle?',
      a: 'An API Gateway acts as a single reverse proxy entry point for client requests. It handles cross-cutting concerns: authentication/authorization, SSL termination, rate limiting, request routing, caching, response aggregation, and protocol translation (HTTP to gRPC).'
    },
    {
      id: 'ms-3',
      q: 'What is the Circuit Breaker Pattern and how do its three states work?',
      a: 'Circuit Breaker prevents cascading failures when a downstream service is struggling. 1) Closed: requests pass through normally. 2) Open: if error rate exceeds threshold, calls fail immediately without hitting downstream service. 3) Half-Open: after timeout, a limited number of probe requests are allowed; if successful, it closes; if failure persists, it re-opens.'
    },
    {
      id: 'ms-4',
      q: 'What is the Outbox Pattern in microservices and what problem does it solve?',
      a: 'The Transactional Outbox pattern ensures dual-write consistency between database updates and message publishing (e.g. Kafka). In a single local ACID transaction, the business entity and an Outbox message table are updated together. An asynchronous CDC (Change Data Capture) tool like Debezium reads the Outbox table and publishes events reliably.'
    },
    {
      id: 'ms-5',
      q: 'Explain CQRS (Command Query Responsibility Segregation).',
      a: 'CQRS separates read and write operations into distinct models: Commands mutate state (optimized for transactional consistency and validation), while Queries retrieve state (optimized for fast reads using denormalized read replicas or Elasticsearch). Synchronization is typically handled via asynchronous event streams.'
    },
    {
      id: 'ms-6',
      q: 'What is Event Sourcing and how does it differ from traditional CRUD state storage?',
      a: 'In CRUD, only the current state of an entity is stored, overwriting past history. In Event Sourcing, every state change is stored as an immutable sequence of events in an append-only event store. Current state is reconstructed by replaying events, providing complete auditability, time-travel debugging, and event replay.'
    },
    {
      id: 'ms-7',
      q: 'What is gRPC and how does it compare to REST over JSON?',
      a: 'gRPC is a high-performance RPC framework by Google using HTTP/2 for transport and Protocol Buffers (Protobuf) for binary serialization. Advantages over REST/JSON: binary payload is 5-10x smaller and faster to serialize, enforces strict type contracts (.proto), supports bidirectional streaming, and generates client stubs automatically.'
    },
    {
      id: 'ms-8',
      q: 'What is Distributed Tracing and how do Trace ID and Span ID work (OpenTelemetry)?',
      a: 'Distributed tracing tracks requests across distributed microservice boundaries. A Trace ID represents the end-to-end journey of a request. Each service invocation creates a Span with a unique Span ID and references the Parent Span ID. OpenTelemetry headers (W3C traceparent) propagate these IDs through HTTP headers.'
    },
    {
      id: 'ms-9',
      q: 'What is Idempotency in API design and how do you implement Idempotency Keys?',
      a: 'An operation is idempotent if executing it multiple times produces the identical side-effect as executing it once (GET, PUT, DELETE). For non-idempotent POST requests (e.g. payment processing), clients include an Idempotency-Key header. The server caches the key and returned response in Redis; duplicate requests return the cached result without re-executing.'
    },
    {
      id: 'ms-10',
      q: 'What is Database-per-Service pattern and why is shared database considered an anti-pattern in microservices?',
      a: 'Each microservice must own its private database schema. Sharing a database couples services tightly at the schema level, breaks independent deployment, prevents using polyglot persistence (e.g. relational vs document store), and causes database connection contention.'
    },
    {
      id: 'ms-11',
      q: 'What is the Strangler Fig Pattern in legacy application modernization?',
      a: 'The Strangler Fig pattern incrementally replaces legacy monolithic features with new microservices behind an API gateway or reverse proxy. Over time, traffic is gradually redirected to new services until the monolithic component can be safely retired without a risky big-bang rewrite.'
    },
    {
      id: 'ms-12',
      q: 'What is Service Discovery (Client-Side vs Server-Side)?',
      a: 'Service discovery dynamically resolves network locations (IP/port) of autoscaling microservice instances. In Client-Side discovery (Netflix Eureka), the client queries the registry and load balances itself. In Server-Side discovery (Kubernetes ClusterIP/Kube-DNS, AWS ALB), the client calls a load balancer that queries the registry and routes traffic.'
    },
    {
      id: 'ms-13',
      q: 'What is Rate Limiting and what algorithms are commonly used (Token Bucket, Leaky Bucket, Sliding Window)?',
      a: 'Rate limiting protects APIs from abuse and denial of service. Token Bucket allows bursts by maintaining tokens refilled at a constant rate. Leaky Bucket processes requests at a steady rate. Sliding Window Log/Counter tracks timestamps within rolling time windows, preventing burst attacks on window boundaries.'
    },
    {
      id: 'ms-14',
      q: 'What is mTLS (Mutual TLS) in microservices and why is it used in Service Meshes (Istio)?',
      a: 'In standard TLS, only the server proves its identity to the client. In mTLS, both client and server authenticate each other using X.509 digital certificates. It encrypts internal east-west microservice traffic and enforces zero-trust identity verification across the cluster.'
    },
    {
      id: 'ms-15',
      q: 'Explain the difference between Orchestration and Message-Driven Choreography in Microservices.',
      a: 'Orchestration relies on a central controller making synchronous or directed calls to services (easier to monitor, clear workflow, but potential single point of failure). Choreography is decentralized: services broadcast domain events asynchronously without knowledge of consumers (high decoupling, but harder to trace end-to-end flows).'
    },
    {
      id: 'ms-16',
      q: 'What is the Bulkhead Pattern in software resilience?',
      a: 'Named after partitions in a ship’s hull, the Bulkhead pattern isolates resources (thread pools, CPU, memory, connection pools) for different services. If one downstream dependency fails or runs slowly, its dedicated thread pool exhausts without affecting threads dedicated to healthy dependencies.'
    },
    {
      id: 'ms-17',
      q: 'What is HATEOAS in RESTful API maturity (Richardson Maturity Model Level 3)?',
      a: 'Hypermedia As The Engine Of Application State (HATEOAS) means API responses contain hypermedia links (_links) that guide the client to possible next actions dynamically (e.g. links to pay, cancel, or track an order), decoupling clients from hardcoded URL paths.'
    },
    {
      id: 'ms-18',
      q: 'What is Backpressure in asynchronous messaging and reactive streams?',
      a: 'Backpressure is a feedback mechanism where a slow consumer signals a fast producer to slow down message emission. Without backpressure, consumer memory exhausts, resulting in buffer overflows and out-of-memory crashes.'
    },
    {
      id: 'ms-19',
      q: 'How do you handle Distributed Locking across microservices using Redis (Redlock)?',
      a: 'A distributed lock ensures only one service instance executes a critical task across a distributed cluster. In Redis, single-instance lock uses SET resource_name my_random_value NX PX 30000. Redlock acquires locks across N independent Redis nodes (majority N/2 + 1) to withstand single-node failures.'
    },
    {
      id: 'ms-20',
      q: 'What is Dead Letter Queue (DLQ) and Dead Letter Exchange (DLX)?',
      a: 'A DLQ is a secondary message queue where messages that fail processing after max retry attempts are routed. It prevents poison-pill messages from blocking the primary consumer queue while allowing engineers to inspect, debug, and replay unprocessable messages.'
    },
    {
      id: 'ms-21',
      q: 'What is Canary Releasing vs Blue-Green Deployment for microservices?',
      a: 'Blue-Green runs two identical production environments; traffic instantly flips from Blue to Green via router. Canary deployment rolls out the new version to a tiny subset of real users (e.g. 2% -> 10% -> 50% -> 100%) while observing error rates and latency before full rollout.'
    },
    {
      id: 'ms-22',
      q: 'What is the Sidecar Pattern in microservice architectures?',
      a: 'The Sidecar pattern deploys a helper container alongside the primary application container in the same pod/host. The sidecar shares lifecycle, network, and storage, handling cross-cutting concerns like proxying (Envoy), log forwarding (Fluentd), or metrics collection without modifying app code.'
    },
    {
      id: 'ms-23',
      q: 'What is OpenAPI / Swagger and why is API-first design important?',
      a: 'OpenAPI is a machine-readable JSON/YAML specification defining REST API endpoints, schemas, headers, and responses. API-first design defines the contract before writing code, allowing frontend and backend teams to work in parallel using auto-generated mock servers and client SDKs.'
    },
    {
      id: 'ms-24',
      q: 'How do you prevent Cascading Failures in microservice ecosystems?',
      a: '1) Apply Circuit Breakers (Resilience4j). 2) Set aggressive timeouts and deadlines on all outgoing network calls. 3) Implement Bulkhead isolation. 4) Provide graceful fallbacks (cached data or degraded features). 5) Apply rate limiting.'
    },
    {
      id: 'ms-25',
      q: 'What is Schema Evolution in message brokers (Protobuf / Avro with Schema Registry)?',
      a: 'Schema Registry ensures backward and forward compatibility when event schemas change. Backward compatibility ensures newer consumers can read events written by older producers; forward compatibility ensures older consumers can process events written by newer producers (ignoring unrecognized fields).'
    },
    {
      id: 'ms-26',
      q: 'What is OAuth 2.0 vs OpenID Connect (OIDC)?',
      a: 'OAuth 2.0 is an authorization framework that delegates access to resources via Access Tokens without sharing user passwords. OpenID Connect (OIDC) is an authentication layer built on top of OAuth 2.0 that provides user identity verification via an ID Token (JWT).'
    },
    {
      id: 'ms-27',
      q: 'What is Contract Testing in Microservices (e.g. Pact)?',
      a: 'Contract testing verifies that microservices can communicate with each other by validating agreed-upon request/response contracts without deploying full end-to-end environments. A consumer defines expected interactions, and the provider validates that it fulfills them in CI.'
    },
    {
      id: 'ms-28',
      q: 'What is Zero Downtime Database Migration for microservices (Expand and Contract Pattern)?',
      a: 'Expand and Contract (Parallel Run): 1) Expand: add new column/table without altering existing fields; code writes to both old and new columns. 2) Backfill existing data. 3) Switch code to read from new column. 4) Contract: remove old column once no dependencies remain.'
    },
    {
      id: 'ms-29',
      q: 'What is GraphQL Federation (Apollo Federation)?',
      a: 'Apollo Federation allows multiple microservices (subgraphs) to contribute to a unified, distributed supergraph schema. The federated gateway resolves client queries across multiple underlying microservices seamlessly based on entity directives (@key, @extends).'
    },
    {
      id: 'ms-30',
      q: 'What are Health Checks (Liveness vs Readiness vs Startup probes)?',
      a: 'Liveness probes check if the application container is still running and healthy; if it fails, the orchestrator restarts it. Readiness probes check if the application is ready to accept incoming user traffic (connected to DB/cache); if it fails, traffic is routed away. Startup probes protect slow-starting legacy apps.'
    }
  ],

  // -------------------------------------------------------------
  // 6. AWS CLOUD ARCHITECTURE (30 Questions)
  // -------------------------------------------------------------
  aws_cloud: [
    {
      id: 'aws-1',
      q: 'What is the AWS Well-Architected Framework and its 6 Pillars?',
      a: 'The 6 Pillars are: 1) Operational Excellence (running and monitoring systems). 2) Security (protecting data, systems, assets). 3) Reliability (recovery from disruptions). 4) Performance Efficiency (efficient computing resource usage). 5) Cost Optimization (avoiding unneeded expense). 6) Sustainability (minimizing environmental impacts).'
    },
    {
      id: 'aws-2',
      q: 'What is a VPC (Virtual Private Cloud) and what are Public vs Private Subnets?',
      a: 'A VPC is a logically isolated virtual network dedicated to your AWS account. A public subnet has an Internet Gateway (IGW) attached in its route table, allowing resources with public IPs to communicate with the Internet. A private subnet has no direct IGW route; outbound Internet access requires a NAT Gateway located in a public subnet.'
    },
    {
      id: 'aws-3',
      q: 'What is the difference between Security Groups and Network ACLs (NACLs)?',
      a: 'Security Groups are stateful firewalls operating at the EC2 instance/ENI level; return traffic is automatically allowed regardless of inbound rules. NACLs are stateless firewalls operating at the subnet boundary; return traffic must be explicitly permitted by rule number.'
    },
    {
      id: 'aws-4',
      q: 'What is the difference between Application Load Balancer (ALB) and Network Load Balancer (NLB)?',
      a: 'ALB operates at Layer 7 (HTTP/HTTPS), supporting path-based routing, host-based routing, query parameter routing, and WebSockets. NLB operates at Layer 4 (TCP/UDP/TLS), capable of handling millions of requests per second with ultra-low latency and static IP addresses.'
    },
    {
      id: 'aws-5',
      q: 'What is AWS Lambda and what is a Cold Start?',
      a: 'AWS Lambda is a serverless compute service that executes code in response to events without provisioning servers. A cold start occurs when an invocation requires spinning up a new container microVM (Firecracker) and initializing runtime/libraries before executing code. Mitigate with Provisioned Concurrency.'
    },
    {
      id: 'aws-6',
      q: 'Explain AWS S3 Storage Classes and Lifecycle Rules.',
      a: 'S3 Standard: frequent access, low latency. S3 Standard-IA: infrequent access with retrieval fee. S3 One Zone-IA: lower cost single-AZ. S3 Glacier Flexible & Deep Archive: low-cost archival (minutes to hours retrieval). S3 Intelligent-Tiering automatically moves objects between tiers based on access patterns without operational overhead.'
    },
    {
      id: 'aws-7',
      q: 'How does Amazon RDS Multi-AZ Deployment differ from Read Replicas?',
      a: 'Multi-AZ provides high availability and automatic failover by synchronously replicating data to a standby instance in another Availability Zone (standby cannot serve read traffic). Read Replicas provide read scalability via asynchronous replication; replicas can handle read queries across multiple regions.'
    },
    {
      id: 'aws-8',
      q: 'What is Amazon DynamoDB and how do Partition Keys and Sort Keys work?',
      a: 'DynamoDB is a fully managed, serverless NoSQL key-value and document database providing single-digit millisecond latency at scale. Partition Key (PK) determines the physical storage partition via internal hash. Sort Key (SK) stores items in sorted order within the partition, enabling range queries.'
    },
    {
      id: 'aws-9',
      q: 'What is DynamoDB Global Secondary Index (GSI) vs Local Secondary Index (LSI)?',
      a: 'LSI uses the same partition key as the primary key but a different sort key, created ONLY at table creation time, sharing provisioned throughput. GSI can have a completely different partition key and sort key, can be created or deleted anytime, and has independent provisioned throughput.'
    },
    {
      id: 'aws-10',
      q: 'What is AWS IAM and how does Principle of Least Privilege apply to IAM Roles and Policies?',
      a: 'IAM manages access to AWS services. IAM Policies are JSON documents defining explicit Allow/Deny permissions. IAM Roles are assumed temporarily by AWS services (EC2, Lambda) via STS credentials without hardcoded access keys. Least privilege grants only permissions required to perform the task.'
    },
    {
      id: 'aws-11',
      q: 'What is CloudFront and how do Origin Access Control (OAC) and Edge Lambdas work?',
      a: 'Amazon CloudFront is a global Content Delivery Network (CDN) caching content at edge locations. OAC securely restricts S3 bucket access so objects can ONLY be fetched through CloudFront. Lambda@Edge / CloudFront Functions execute custom code at edge locations for URL rewrites, auth, or A/B testing.'
    },
    {
      id: 'aws-12',
      q: 'What is Amazon SQS and what is the difference between Standard and FIFO Queues?',
      a: 'SQS is a fully managed message queuing service. Standard queues offer nearly unlimited throughput, at-least-once delivery, and best-effort ordering. FIFO queues guarantee strictly once processing (exactly-once) and preserved first-in-first-out ordering, limited to 300 msg/s (or 3000 with batching).'
    },
    {
      id: 'aws-13',
      q: 'What is Amazon SNS and how does SNS-to-SQS Fan-Out work?',
      a: 'SNS is a publish/subscribe messaging service. In the Fan-Out pattern, a message published to a single SNS topic is automatically delivered in parallel to multiple subscribed SQS queues, allowing multiple independent microservices to process the identical event asynchronously.'
    },
    {
      id: 'aws-14',
      q: 'What is Amazon ECS vs Amazon EKS and what is AWS Fargate?',
      a: 'ECS is AWS’s proprietary container orchestration service (simpler setup, deep AWS integration). EKS is managed Kubernetes. AWS Fargate is a serverless compute engine for both ECS and EKS that runs containers without managing underlying EC2 server instances.'
    },
    {
      id: 'aws-15',
      q: 'What is AWS Auto Scaling and what scaling policies exist (Target Tracking, Step, Simple)?',
      a: 'Auto Scaling dynamically adjusts EC2 instance counts. Target Tracking scaling increases/decreases capacity to maintain a specific metric (e.g. keep average CPU at 50%). Step scaling adjusts capacity based on step thresholds. Scheduled scaling adjusts based on recurring schedules.'
    },
    {
      id: 'aws-16',
      q: 'What is AWS CloudWatch and what are Metrics, Alarms, and Logs Insights?',
      a: 'CloudWatch is a monitoring and observability service. CloudWatch Metrics collects numeric performance data. Alarms trigger automated actions (Auto Scaling or SNS notifications) when thresholds are breached. Logs Insights enables fast interactive querying and analysis of log data using a purpose-built query syntax.'
    },
    {
      id: 'aws-17',
      q: 'What is AWS X-Ray and how does it assist in serverless debugging?',
      a: 'AWS X-Ray provides distributed tracing and service maps across serverless components (API Gateway, Lambda, DynamoDB, SQS). It visualizes request paths, measures latency across service hops, and pinpoints errors or bottlenecks.'
    },
    {
      id: 'aws-18',
      q: 'What is AWS KMS (Key Management Service) and Envelope Encryption?',
      a: 'KMS generates and manages cryptographic encryption keys (KMS Keys). In Envelope Encryption, data is encrypted using a local Data Encryption Key (DEK). The DEK is then encrypted using the KMS Root Key and stored alongside the encrypted data, avoiding performance bottlenecks of sending large data to KMS.'
    },
    {
      id: 'aws-19',
      q: 'What is Amazon Route 53 and what Routing Policies are available?',
      a: 'Route 53 is a highly available DNS and domain registration service. Routing policies: Simple (single resource), Weighted (percentage traffic split), Latency-based (lowest latency region), Failover (active-passive DR), Geolocation (based on user continent/country), and Multivalue Answer.'
    },
    {
      id: 'aws-20',
      q: 'What is AWS Secrets Manager vs Parameter Store (SSM)?',
      a: 'Systems Manager Parameter Store is a low-cost key-value store for configurations and passwords with plain-text or SecureString (KMS) types. AWS Secrets Manager adds automatic credential rotation (e.g. for RDS passwords), cross-account sharing, and fine-grained secret lifecycle management.'
    },
    {
      id: 'aws-21',
      q: 'What is AWS EventBridge and how does it power Event-Driven Architectures?',
      a: 'EventBridge is a serverless event bus that routes events between AWS services, SaaS apps, and custom microservices. It evaluates incoming JSON events against rule patterns and dispatches events to targets (Lambda, SQS, Step Functions) without point-to-point integration.'
    },
    {
      id: 'aws-22',
      q: 'What is AWS Step Functions and when should you use it over chaining Lambdas?',
      a: 'Step Functions is a serverless visual workflow orchestrator for coordinating multi-step distributed tasks. It handles state transitions, retries, exponential backoffs, human approval tasks, and parallel execution, preventing brittle Lambda-chaining anti-patterns.'
    },
    {
      id: 'aws-23',
      q: 'What is Amazon Aurora and how does its storage engine differ from standard RDS?',
      a: 'Amazon Aurora is a cloud-native relational database (MySQL/PostgreSQL compatible). Unlike RDS which uses EBS volumes, Aurora separates compute from storage: its distributed storage volume replicates 6 copies of data across 3 AZs automatically, backing up continuously to S3 with self-healing blocks.'
    },
    {
      id: 'aws-24',
      q: 'What is AWS WAF (Web Application Firewall) and what common attacks does it mitigate?',
      a: 'AWS WAF monitors HTTP/S requests forwarded to CloudFront, ALB, or API Gateway. It protects against common web exploits: SQL injection (SQLi), Cross-Site Scripting (XSS), rate-based IP flooding (DDoS mitigation), and bad bot scraping using managed rule groups.'
    },
    {
      id: 'aws-25',
      q: 'What is AWS Transit Gateway and how does it simplify complex VPC Peering topologies?',
      a: 'VPC Peering requires point-to-point connections between every pair of VPCs (O(N^2) complexity with no transitive peering). AWS Transit Gateway acts as a central cloud router connecting thousands of VPCs and on-premises networks (VPN / Direct Connect) via a hub-and-spoke model.'
    },
    {
      id: 'aws-26',
      q: 'What is AWS Direct Connect vs Site-to-Site VPN?',
      a: 'Site-to-Site VPN establishes an encrypted IPsec tunnel over the public Internet (lower cost, quick to set up, but subject to internet variability). Direct Connect establishes a dedicated physical fiber connection between your data center and AWS (consistent latency, high bandwidth up to 100Gbps).'
    },
    {
      id: 'aws-27',
      q: 'What is Amazon OpenSearch Service and common enterprise use cases?',
      a: 'Amazon OpenSearch (successor to Elasticsearch) is a distributed search and analytics engine used for real-time application search (fuzzy queries, faceting), centralized log analytics (with OpenSearch Dashboards), and security information event management (SIEM).'
    },
    {
      id: 'aws-28',
      q: 'What is Infrastructure as Code (IaC) on AWS: CloudFormation vs AWS CDK vs Terraform?',
      a: 'CloudFormation is AWS native JSON/YAML declarative templating. AWS CDK (Cloud Development Kit) allows defining infrastructure using expressive programming languages (TypeScript, Python) compiling into CloudFormation. Terraform is hashicorp’s multi-cloud HCL tool with state files.'
    },
    {
      id: 'aws-29',
      q: 'What is Disaster Recovery (DR) in AWS and what are the 4 DR strategies?',
      a: '1) Backup and Restore (lowest cost, highest RTO/RPO). 2) Pilot Light (core database running/replicated, compute spun up during disaster). 3) Warm Standby (scaled-down running version in secondary region). 4) Multi-Region Active-Active (highest cost, near-zero RTO/RPO).'
    },
    {
      id: 'aws-30',
      q: 'What are AWS Spot Instances and how do you use them safely for cost reduction?',
      a: 'Spot Instances offer unused EC2 spare capacity at up to 90% discount compared to On-Demand prices. However, AWS can reclaim them with a 2-minute interruption notice. Use Spot instances for stateless, fault-tolerant workloads like batch processing, CI workers, or containerized worker tasks.'
    }
  ],

  // -------------------------------------------------------------
  // 7. CI/CD & AUTOMATION (30 Questions)
  // -------------------------------------------------------------
  cicd_pipelines: [
    {
      id: 'cicd-1',
      q: 'What is the difference between Continuous Integration, Continuous Delivery, and Continuous Deployment?',
      a: 'Continuous Integration (CI): developers frequently merge code to main branch; automated builds and tests validate changes. Continuous Delivery (CD): every valid build is automatically packaged and prepared for release to production, but deployment requires manual approval. Continuous Deployment: every change that passes the automated pipeline is deployed to production automatically without human intervention.'
    },
    {
      id: 'cicd-2',
      q: 'What is GitOps and how does ArgoCD or Flux implement it in Kubernetes?',
      a: 'GitOps uses a Git repository as the single source of truth for desired infrastructure and application state. ArgoCD/Flux runs an agent inside the Kubernetes cluster that continuously monitors the Git repository and pulls/reconciles any drift between desired state in Git and actual live cluster state.'
    },
    {
      id: 'cicd-3',
      q: 'What are GitHub Actions and how do Workflows, Jobs, and Steps correlate?',
      a: 'A Workflow is an automated process defined in a .github/workflows/*.yml file triggered by events (push, pull_request, schedule). A workflow contains one or more Jobs running on runners (in parallel by default or sequentially via needs:). Each Job consists of sequential Steps (shell scripts or actions).'
    },
    {
      id: 'cicd-4',
      q: 'Explain Blue-Green Deployment vs Rolling Deployment vs Canary Deployment.',
      a: 'Rolling deployment replaces instances one by one (zero extra infrastructure needed, but mixed versions coexist during deployment). Blue-Green switches 100% traffic instantly between two complete identical environments (instant rollback, requires double resources). Canary gradually shifts a percentage of real traffic to the new version while monitoring telemetry.'
    },
    {
      id: 'cicd-5',
      q: 'What is Static Application Security Testing (SAST) vs Dynamic Application Security Testing (DAST)?',
      a: 'SAST (e.g. SonarQube, Snyk) analyzes source code, byte code, or binaries at rest without executing the application to detect vulnerabilities (SQL injection, hardcoded secrets). DAST (e.g. OWASP ZAP) tests a running application from the outside by simulating malicious attacks to find runtime vulnerabilities.'
    },
    {
      id: 'cicd-6',
      q: 'How do you handle secrets securely in CI/CD pipelines (avoiding leaks in logs)?',
      a: '1) Store secrets in encrypted secret managers (GitHub Secrets, Vault, AWS Secrets Manager). 2) Use OpenID Connect (OIDC) to authenticate runners with cloud providers without long-lived access keys. 3) Configure automated secret masking in CI logs. 4) Use pre-commit hooks (TruffleHog, git-secrets) to block accidental commits.'
    },
    {
      id: 'cicd-7',
      q: 'What is Dependency Scanning and Software Bill of Materials (SBOM)?',
      a: 'Dependency scanning tools (Dependabot, Snyk) identify known vulnerabilities (CVEs) in open-source libraries. An SBOM is a formal, machine-readable inventory of all components, libraries, and modules used in building the software artifact (e.g. CycloneDX, SPDX).'
    },
    {
      id: 'cicd-8',
      q: 'What is Semantic Versioning (SemVer) and how is it automated in CI/CD (Semantic Release)?',
      a: 'SemVer uses MAJOR.MINOR.PATCH format (MAJOR for breaking changes, MINOR for backwards-compatible features, PATCH for bug fixes). Automated semantic release tools parse Conventional Commits (feat:, fix:, chore:, BREAKING CHANGE:) to determine the next version number, generate CHANGELOG.md, and create git tags automatically.'
    },
    {
      id: 'cicd-9',
      q: 'What is Docker Layer Caching and how do you optimize Docker builds in CI pipelines?',
      a: 'Docker builds images layer by layer; unchanged instructions use cached layers. Optimize by ordering commands from least frequently changed to most frequently changed: copy package.json first, run npm install, and then copy source code. In CI, use remote cache backends (e.g. --cache-from).'
    },
    {
      id: 'cicd-10',
      q: 'What is the Test Pyramid in automated testing?',
      a: 'The Test Pyramid categorizes automated tests into three layers: 1) Unit Tests (base): largest quantity, fast, isolated, inexpensive. 2) Integration Tests (middle): verifies interaction between components/databases. 3) End-to-End / UI Tests (peak): smallest quantity, slower, testing full user journeys.'
    },
    {
      id: 'cicd-11',
      q: 'What is Trunk-Based Development and how does it compare to GitFlow?',
      a: 'GitFlow uses long-lived branches (develop, feature, release, hotfix), leading to painful merge conflicts. Trunk-Based Development has developers merge small, frequent commits directly into the single shared main branch (trunk) multiple times a day, relying on Feature Flags to decouple deployment from release.'
    },
    {
      id: 'cicd-12',
      q: 'What are Feature Flags (Feature Toggles) and why are they vital for continuous deployment?',
      a: 'Feature flags wrap code in conditional checks (if (featureFlag.isEnabled("new_checkout"))), allowing new features to be deployed into production dark (disabled). Features can be tested in production, rolled out to internal employees, gradually released, or instantly disabled without redeploying code.'
    },
    {
      id: 'cicd-13',
      q: 'What is Artifact Management and why should you never rebuild artifacts between stages?',
      a: 'Artifact management (Nexus, Artifactory, AWS ECR) stores immutable build outputs (Docker images, jar files). The "Build Once, Deploy Anywhere" principle dictates that the exact same binary tested in Staging must be deployed to Production, changing only external environment configurations.'
    },
    {
      id: 'cicd-14',
      q: 'What is Flaky Test detection and remediation in CI/CD?',
      a: 'A flaky test intermittently passes or fails without code changes, usually due to race conditions, timing/sleep issues, shared state, or network dependencies. Flaky tests destroy pipeline trust; remediate by isolating test state, avoiding hardcoded sleeps, using polling/await assertions, and quarantining offenders.'
    },
    {
      id: 'cicd-15',
      q: 'What is Pipeline as Code and what are its benefits?',
      a: 'Pipeline as Code stores pipeline configuration directly inside the application repository (e.g. Jenkinsfile, .gitlab-ci.yml, .github/workflows). Benefits include version controlling pipeline logic alongside code, code reviews via pull requests, and branch-specific pipeline testing.'
    },
    {
      id: 'cicd-16',
      q: 'What is Self-Hosted Runners vs Cloud Runners in CI systems?',
      a: 'Cloud-hosted runners (GitHub-hosted) are fully managed, ephemeral, and secure out-of-the-box, but have runtime limits and standard hardware. Self-hosted runners run on your private cloud/VMs, providing custom hardware (GPUs), access to private VPC resources, and persistent local caching.'
    },
    {
      id: 'cicd-17',
      q: 'What is Infrastructure Drift and how do you detect and remediate it?',
      a: 'Infrastructure drift occurs when manual modifications (e.g. in AWS Console) cause live cloud resources to diverge from IaC definitions (Terraform/CloudFormation). Detect by running automated terraform plan schedules; remediate by applying Terraform to overwrite drift or updating code to reflect valid changes.'
    },
    {
      id: 'cicd-18',
      q: 'What is Matrix Testing in CI pipelines?',
      a: 'Matrix builds execute the same job across multiple combinations of variables simultaneously (e.g. Node 18, 20, 22 on Ubuntu, macOS, and Windows). It ensures cross-platform compatibility and library portability across runtime environments efficiently.'
    },
    {
      id: 'cicd-19',
      q: 'What is Linting and Code Formatting and why should they run first in CI?',
      a: 'Linters (ESLint, golangci-lint) detect programmatic errors, bugs, and stylistic issues; formatters (Prettier, gofmt) enforce consistent code styles. Running them as the first lightweight pipeline stage fails fast on syntax/formatting errors before triggering expensive build or test jobs.'
    },
    {
      id: 'cicd-20',
      q: 'What is Code Coverage in CI and what are its limitations?',
      a: 'Code coverage measures the percentage of code executed during automated test runs (line, branch, function coverage). High coverage does not guarantee high test quality—tests can execute lines without validating assertions (assertion-free tests). Focus on branch coverage and meaningful assertions.'
    },
    {
      id: 'cicd-21',
      q: 'How does GitHub Actions OIDC work with AWS / GCP / Azure to eliminate hardcoded credentials?',
      a: 'The GitHub runner requests an ephemeral JSON Web Token (OIDC token) from GitHub. The runner passes this token to the cloud STS endpoint (e.g. aws-actions/configure-aws-credentials). The cloud provider validates the token signature and assumes an IAM role, returning short-lived credentials.'
    },
    {
      id: 'cicd-22',
      q: 'What is Automated Rollback in CD pipelines?',
      a: 'Automated rollback triggers an automatic reversion to the previous stable release if synthetic tests fail or error rate / latency metrics exceed alert thresholds during deployment, minimizing Mean Time to Recovery (MTTR) without manual human triage.'
    },
    {
      id: 'cicd-23',
      q: 'What is Immutable Infrastructure and why is it preferred over mutable servers?',
      a: 'In mutable infrastructure, servers are updated in-place via SSH or scripts, leading to configuration drift across instances. Immutable infrastructure never modifies running instances; every deployment builds a new machine image (AMI) or container and replaces old instances completely.'
    },
    {
      id: 'cicd-24',
      q: 'What is Chaos Engineering in production verification (e.g. Chaos Mesh, Gremlin)?',
      a: 'Chaos Engineering intentionally injects controlled failures (killing pods, introducing network latency, dropping packets) into staging or production environments to proactively verify that resilience mechanisms (circuit breakers, autoscaling, failover) function as designed.'
    },
    {
      id: 'cicd-25',
      q: 'What is DORA Metrics and what are the 4 key metrics for DevOps performance?',
      a: 'DevOps Research and Assessment (DORA) identifies 4 key indicators of engineering velocity and stability: 1) Deployment Frequency. 2) Lead Time for Changes (commit to production). 3) Change Failure Rate (percentage of releases requiring hotfixes/rollbacks). 4) Time to Restore Service (MTTR).'
    },
    {
      id: 'cicd-26',
      q: 'What is Monorepo vs Polyrepo CI pipeline optimization?',
      a: 'In a monorepo, many projects reside in one repo. CI optimization requires Path Filtering / Change Detection (e.g. Nx, Turborepo) to execute build and test pipelines ONLY for packages that have modified files or affected downstream dependencies.'
    },
    {
      id: 'cicd-27',
      q: 'What is Shift-Left Testing and Shift-Left Security?',
      a: 'Shift-Left means moving testing, quality assurance, and security evaluations earlier into the software development lifecycle (IDE linters, local pre-commit hooks, CI pull request checks) rather than discovering vulnerabilities or defects in production.'
    },
    {
      id: 'cicd-28',
      q: 'What is a Synthetic Transaction in post-deployment monitoring?',
      a: 'A synthetic transaction is an automated, continuous robot that simulates real user actions (e.g. logging in, adding item to cart, completing checkout) against production endpoints to detect downtime or degraded functionality before actual users encounter it.'
    },
    {
      id: 'cicd-29',
      q: 'What is Container Image Scanning and tools like Trivy / Clair?',
      a: 'Container scanners inspect container image base OS layers and installed packages against national vulnerability databases (CVEs), checking for critical security patches, outdated packages, or malware before allowing images to be pushed to container registries.'
    },
    {
      id: 'cicd-30',
      q: 'How do you design a zero-downtime deployment for database schema changes in CI/CD?',
      a: 'Decouple database migration from code deployment. Apply non-breaking migrations first (add nullable columns, create new tables). Deploy code that utilizes new columns. Backfill data in background batches. Finally, run a cleanup migration to drop obsolete columns.'
    }
  ],

  // -------------------------------------------------------------
  // 8. MACHINE LEARNING CORE (30 Questions)
  // -------------------------------------------------------------
  machine_learning: [
    {
      id: 'ml-1',
      q: 'What is the Bias-Variance Tradeoff in machine learning?',
      a: 'Bias is error introduced by approximating a real-world problem with a simplified model (high bias causes underfitting). Variance is error from sensitivity to small fluctuations in the training set (high variance causes overfitting). Total error is Bias² + Variance + Irreducible Error; the goal is optimal model complexity that minimizes total error on unseen data.'
    },
    {
      id: 'ml-2',
      q: 'Explain L1 (Lasso) vs L2 (Ridge) Regularization and how L1 causes sparsity.',
      a: 'Both penalize large weights to prevent overfitting. L2 adds λ∑w² to the loss function, shrinking weights toward zero smoothly. L1 adds λ∑|w|, having diamond-shaped constraint contours that intersect coordinate axes directly, forcing irrelevant feature weights to exactly zero and performing automatic feature selection.'
    },
    {
      id: 'ml-3',
      q: 'What is the difference between Precision, Recall, F1-Score, and ROC-AUC?',
      a: 'Precision (TP / (TP+FP)): proportion of positive predictions that were actually correct. Recall (TP / (TP+FN)): proportion of actual positives correctly identified. F1-Score: harmonic mean of Precision and Recall. ROC-AUC evaluates true positive rate vs false positive rate across all decision thresholds.'
    },
    {
      id: 'ml-4',
      q: 'How does Random Forest work and why does it reduce variance?',
      a: 'Random Forest is an ensemble of decision trees using Bagging (Bootstrap Aggregation) and Feature Randomness. Each tree is trained on a bootstrap sample of data, and at each split, only a random subset of features is considered. Averaging uncorrelated trees cancels out individual errors, dramatically reducing variance without increasing bias.'
    },
    {
      id: 'ml-5',
      q: 'What is Gradient Boosting (GBDT) and how does it differ from Random Forest?',
      a: 'Random Forest trains multiple deep trees in parallel independently. Gradient Boosting trains shallow trees sequentially: each subsequent tree is trained to predict the pseudo-residuals (gradients of the loss function) of the preceding trees, systematically correcting errors.'
    },
    {
      id: 'ml-6',
      q: 'What is Cross-Validation and why is Stratified K-Fold necessary for imbalanced datasets?',
      a: 'K-Fold cross-validation partitions data into K equal subsets; the model trains on K-1 folds and evaluates on the remaining fold, rotating K times. For imbalanced classification, standard K-Fold might create folds with zero minority class samples; Stratified K-Fold preserves the exact percentage of each class across all folds.'
    },
    {
      id: 'ml-7',
      q: 'What is Data Leakage and how do you prevent it during preprocessing?',
      a: 'Data leakage occurs when information from outside the training dataset (such as target labels or test set distributions) inadvertently influences model training. Prevention: perform train/test split BEFORE any scaling, imputation, or feature engineering; use Scikit-Learn Pipelines.'
    },
    {
      id: 'ml-8',
      q: 'How does Logistic Regression work and what is the Logit function?',
      a: 'Logistic regression models binary classification by taking a linear combination of input features (z = w^T x + b) and passing it through the Sigmoid function (σ(z) = 1 / (1 + e^-z)) to output a probability between 0 and 1. The logit function is the natural log of the odds: ln(p / (1-p)).'
    },
    {
      id: 'ml-9',
      q: 'What is Principal Component Analysis (PCA) and how does it reduce dimensionality?',
      a: 'PCA is an unsupervised linear transformation that projects data onto orthogonal axes of maximal variance. It standardizes data, calculates the covariance matrix, computes its eigenvectors and eigenvalues, and projects the data onto the top K eigenvectors (Principal Components).'
    },
    {
      id: 'ml-10',
      q: 'How does K-Means Clustering work and what is the Elbow Method?',
      a: 'K-Means partitions data into K clusters: 1) Initialize K centroids randomly. 2) Assign points to nearest centroid. 3) Recompute centroids as the mean of assigned points. 4) Repeat until convergence. The Elbow Method plots Within-Cluster Sum of Squares (WCSS) against K to find the point where distortion reduction sharply diminishes.'
    },
    {
      id: 'ml-11',
      q: 'How do Support Vector Machines (SVM) work and what is the Kernel Trick?',
      a: 'SVM finds the optimal hyperplane that maximizes the geometric margin between classes. Support vectors are the data points closest to the hyperplane. For non-linearly separable data, the Kernel Trick (RBF, Polynomial) computes inner products in a higher-dimensional space without explicitly mapping points there.'
    },
    {
      id: 'ml-12',
      q: 'How do you handle Imbalanced Datasets (SMOTE, class weights, focal loss)?',
      a: '1) Resampling: SMOTE (Synthetic Minority Over-sampling Technique) creates synthetic minority instances by interpolating between nearest neighbors. 2) Cost-sensitive learning: assign class weights inversely proportional to class frequencies. 3) Loss functions: Focal Loss discounts easy examples. 4) Evaluate with PR-AUC rather than accuracy.'
    },
    {
      id: 'ml-13',
      q: 'What is the Curse of Dimensionality and how does it impact distance-based algorithms?',
      a: 'As the number of feature dimensions increases, data volume grows exponentially, making data extremely sparse. Distances between points become virtually equidistant, causing distance metrics (Euclidean) in KNN and K-Means to lose discriminatory power.'
    },
    {
      id: 'ml-14',
      q: 'What is Feature Engineering vs Feature Selection?',
      a: 'Feature engineering creates new predictive signals from existing data (e.g. extracting hour from timestamp, text embeddings, interaction terms). Feature selection chooses the most relevant existing features while discarding redundant/noisy ones (filter methods, wrapper methods, LASSO).'
    },
    {
      id: 'ml-15',
      q: 'What is Gradient Descent (Batch, Stochastic, Mini-Batch) and Learning Rate?',
      a: 'Gradient descent minimizes loss functions by updating parameters in the negative gradient direction: θ = θ - η∇L(θ). Batch uses the entire dataset per update (stable, slow). Stochastic (SGD) updates per sample (fast, noisy). Mini-Batch updates per subset (balances stability and GPU efficiency). Learning rate (η) governs step size.'
    },
    {
      id: 'ml-16',
      q: 'What is XGBoost and what architectural optimizations make it so fast and accurate?',
      a: 'XGBoost optimizes gradient boosting through: 1) Second-order Taylor expansion of the loss function (hessians and gradients). 2) Built-in L1/L2 regularization on tree leaves. 3) Exact and approximate split-finding algorithms. 4) Column block caching for parallel tree construction.'
    },
    {
      id: 'ml-17',
      q: 'What is the difference between One-Hot Encoding and Target Encoding?',
      a: 'One-Hot Encoding creates binary columns for each category (increases dimensionality; bad for high-cardinality features). Target Encoding replaces each category with the mean of the target variable for that category (compact, but prone to target leakage without smoothing or K-fold out-of-fold encoding).'
    },
    {
      id: 'ml-18',
      q: 'What are Evaluation Metrics for Regression models (MSE, RMSE, MAE, R²)?',
      a: 'MAE (Mean Absolute Error) is the average magnitude of errors, robust to outliers. MSE (Mean Squared Error) penalizes large errors heavily. RMSE is the square root of MSE in original target units. R² (Coefficient of Determination) measures the proportion of variance explained by the model compared to a baseline mean predictor.'
    },
    {
      id: 'ml-19',
      q: 'What is Concept Drift vs Data Drift and how do you monitor for them?',
      a: 'Data Drift (Covariate Shift) occurs when the distribution of input features P(X) changes over time (e.g. population demographics shift). Concept Drift occurs when the statistical relationship between features and target P(Y|X) changes (e.g. consumer purchasing patterns change after an economic shock). Monitor via Kolmogorov-Smirnov tests or Population Stability Index (PSI).'
    },
    {
      id: 'ml-20',
      q: 'How does Naive Bayes Classifier work and why is it termed "Naive"?',
      a: 'Naive Bayes applies Bayes’ Theorem P(A|B) = P(B|A)P(A) / P(B). It is called "naive" because it makes the strong assumption that all features are mutually independent given the class label. Despite this unrealistic assumption, it performs surprisingly well for text classification and spam detection.'
    },
    {
      id: 'ml-21',
      q: 'What is SHAP (SHapley Additive exPlanations) and LIME for model interpretability?',
      a: 'SHAP calculates the marginal contribution of each feature to a prediction based on cooperative game theory (Shapley values), guaranteeing consistency and local accuracy. LIME fits an interpretable local surrogate linear model around a single prediction to explain black-box models.'
    },
    {
      id: 'ml-22',
      q: 'What is t-SNE vs UMAP for high-dimensional data visualization?',
      a: 'Both are non-linear dimensionality reduction algorithms for 2D/3D visualization. t-SNE preserves local neighborhood structure well but struggles with global structure and is computationally slow. UMAP preserves both local and global structure, scales to large datasets faster, and supports projecting new unseen points.'
    },
    {
      id: 'ml-23',
      q: 'What is Hyperparameter Tuning: Grid Search vs Random Search vs Bayesian Optimization?',
      a: 'Grid Search exhausts every possible combination in a discrete search space (computationally expensive). Random Search samples random combinations, often finding optimal points faster. Bayesian Optimization (Optuna) models the objective function probabilistically, picking hyperparameters that maximize Expected Improvement.'
    },
    {
      id: 'ml-24',
      q: 'What is Stacking (Stacked Generalization) in ensemble learning?',
      a: 'Stacking trains multiple diverse base models (e.g. XGBoost, Random Forest, Neural Network) in parallel using K-Fold cross-validation. Their out-of-fold predictions serve as input features for a higher-level meta-model (e.g. Logistic Regression) to produce the final prediction.'
    },
    {
      id: 'ml-25',
      q: 'How does LightGBM achieve faster training than traditional GBDT?',
      a: 'LightGBM uses: 1) GOSS (Gradient-based One-Side Sampling) to keep instances with large gradients and randomly sample small gradients. 2) EFB (Exclusive Feature Bundling) to bundle mutually exclusive sparse features. 3) Leaf-wise tree growth with depth limits rather than level-wise growth.'
    },
    {
      id: 'ml-26',
      q: 'What is Early Stopping and how does it prevent overfitting?',
      a: 'Early stopping monitors model performance on a separate validation set during iterative training. When the validation metric stops improving for a specified number of epochs (patience), training is halted, and the model weights from the best validation checkpoint are restored.'
    },
    {
      id: 'ml-27',
      q: 'What is Standardization (Z-score) vs Normalization (Min-Max Scaling)?',
      a: 'Min-Max Normalization rescales features into [0, 1] range: (x - min) / (max - min), highly sensitive to outliers. Z-score Standardization transforms features to zero mean and unit variance: (x - μ) / σ, handling outliers better and suitable for gradient descent and distance metrics.'
    },
    {
      id: 'ml-28',
      q: 'What is CatBoost and how does it natively handle categorical features?',
      a: 'CatBoost implements Target Statistics calculated on random permutations of data to prevent target leakage, and uses Oblivious Trees (symmetric decision trees where the same split condition is applied across all nodes at the same level), enabling fast GPU execution and preventing overfitting.'
    },
    {
      id: 'ml-29',
      q: 'What is an Anomaly Detection model: Isolation Forest vs One-Class SVM?',
      a: 'Isolation Forest isolates anomalies instead of profiling normal points: because anomalies are few and structurally different, they require fewer random recursive splits in decision trees to isolate (shorter path lengths). One-Class SVM learns a tight boundary enclosing the dense normal data in feature space.'
    },
    {
      id: 'ml-30',
      q: 'What is MLOps and what are the core components of an ML pipeline (Feature Store, Model Registry)?',
      a: 'MLOps applies DevOps practices to machine learning systems. Core components: Feature Store (Feast) for centralized feature engineering and training-serving consistency; Experiment Tracker (MLflow); Model Registry for versioning, lineage, and staging/production approvals; and Drift Monitoring.'
    }
  ],

  // -------------------------------------------------------------
  // 9. DEEP LEARNING & LLMS (30 Questions)
  // -------------------------------------------------------------
  deep_learning: [
    {
      id: 'dl-1',
      q: 'What is the Self-Attention Mechanism in Transformers and how is Attention(Q, K, V) calculated?',
      a: 'Self-attention allows tokens in a sequence to dynamically attend to and weigh the relevance of all other tokens. Query (Q), Key (K), and Value (V) matrices are computed via learned linear projections of token embeddings. The formula is: Attention(Q, K, V) = softmax((Q K^T) / sqrt(d_k)) * V. Dividing by sqrt(d_k) prevents dot products from growing excessively large, avoiding vanishing softmax gradients.'
    },
    {
      id: 'dl-2',
      q: 'What is the difference between Encoder-Only, Decoder-Only, and Encoder-Decoder LLM architectures?',
      a: 'Encoder-Only (BERT) uses bidirectional attention to understand full sentence context, ideal for classification and extraction. Decoder-Only (GPT-4, Llama) uses causal masked self-attention to predict next tokens autoregressively, ideal for open-ended text generation. Encoder-Decoder (T5) encodes input and generates output autoregressively, ideal for translation and summarization.'
    },
    {
      id: 'dl-3',
      q: 'What is the Vanishing and Exploding Gradient problem and how do ResNets and LayerNorm address it?',
      a: 'In deep networks, backpropagating gradients through many layers with small weights/derivatives causes gradients to exponentially decay toward zero (vanishing) or explode toward infinity. ResNets introduce skip/residual connections (y = F(x) + x), allowing gradients to flow directly through identity paths. LayerNorm standardizes activations across feature dimensions.'
    },
    {
      id: 'dl-4',
      q: 'What is RLHF (Reinforcement Learning from Human Feedback) and DPO (Direct Preference Optimization)?',
      a: 'RLHF aligns LLMs with human intent: 1) Supervised fine-tuning. 2) Train a reward model on human-ranked outputs. 3) Optimize the policy using PPO reinforcement learning with a KL-divergence penalty. DPO simplifies this by optimizing the policy directly on paired preference data (chosen vs rejected) using cross-entropy loss without training a separate reward model.'
    },
    {
      id: 'dl-5',
      q: 'What is LoRA (Low-Rank Adaptation) and QLoRA for efficient LLM fine-tuning?',
      a: 'LoRA freezes pre-trained model weights W (d x k) and injects trainable low-rank decomposition matrices A (d x r) and B (r x k) where rank r << min(d, k), reducing trainable parameters by 99%+. QLoRA quantizes the base model weights to 4-bit NormalFloat (NF4) and uses Double Quantization, allowing 70B parameter models to be fine-tuned on a single consumer GPU.'
    },
    {
      id: 'dl-6',
      q: 'What is Retrieval-Augmented Generation (RAG) and what are its key components?',
      a: 'RAG augments LLM generation with external domain knowledge. Key steps: 1) Ingestion: chunk documents, generate dense vector embeddings via embedding model, and store in a vector database (Pinecone, Chroma). 2) Retrieval: embed user query, search top-K relevant chunks via cosine similarity/HNSW. 3) Generation: pass retrieved context alongside query in prompt to the LLM.'
    },
    {
      id: 'dl-7',
      q: 'What is KV Caching in autoregressive LLM inference?',
      a: 'In autoregressive generation, each new token requires attending to all preceding tokens. Without caching, Q, K, and V would be recalculated for all past tokens at every step (O(N^2) compute). KV Caching stores the Key and Value tensors of past tokens in GPU VRAM, reducing each subsequent token generation step to computing only the new token’s Query and attending to the cache.'
    },
    {
      id: 'dl-8',
      q: 'Explain PagedAttention and vLLM for high-throughput LLM serving.',
      a: 'Standard KV caching causes severe GPU memory fragmentation because sequence lengths are unpredictable. PagedAttention (vLLM) manages KV caches inspired by virtual memory paging in operating systems, storing continuous keys and values in non-contiguous physical memory blocks, boosting serving throughput by 2-4x.'
    },
    {
      id: 'dl-9',
      q: 'What are FlashAttention and FlashAttention-2 and how do they optimize GPU memory bandwidth?',
      a: 'Standard self-attention computes intermediate N x N attention matrices and writes them to slow GPU High Bandwidth Memory (HBM). FlashAttention tiles the computation into blocks that fit within ultra-fast on-chip SRAM, computing softmax incrementally via online softmax without materializing the full N x N matrix in HBM, yielding massive speedups and linear memory scaling.'
    },
    {
      id: 'dl-10',
      q: 'What is the difference between Cross-Entropy Loss and Softmax?',
      a: 'Softmax is an activation function converting raw model logits into a normalized probability distribution summing to 1: σ(z_i) = e^{z_i} / ∑ e^{z_j}. Cross-Entropy Loss measures the performance of this classification model: L = -∑ y_i * log(p_i), heavily penalizing confident wrong predictions.'
    },
    {
      id: 'dl-11',
      q: 'What are Positional Encodings: Sinusoidal vs Learned vs RoPE (Rotary Position Embedding)?',
      a: 'Because self-attention is permutation-invariant, positional information must be injected. Original Transformers used fixed sinusoidal functions; BERT used learned absolute embeddings. RoPE (Rotary Position Embedding) multiplies query and key vectors by a rotation matrix, naturally capturing relative token distances and extrapolating better to long context windows.'
    },
    {
      id: 'dl-12',
      q: 'What is Mixture of Experts (MoE) in models like Mixtral and GPT-4?',
      a: 'Instead of passing all tokens through a single dense feed-forward network (FFN), an MoE layer contains multiple parallel expert networks and a learned gating/router network. For each token, the router selects only top-K experts (e.g. 2 out of 8), providing massive total parameter capacity while keeping active compute per token low.'
    },
    {
      id: 'dl-13',
      q: 'What is Quantization (FP32, FP16, BF16, INT8, INT4, AWQ, GGUF)?',
      a: 'Quantization reduces the precision of neural network weights and activations to save memory and accelerate inference. FP32 (32-bit float) is standard training precision; BF16/FP16 halves memory. INT8/INT4 quantization (AWQ, GPTQ) compresses weights into 8 or 4 bits with negligible perplexity degradation. GGUF is a binary file format optimized for fast CPU/Apple Silicon inference via llama.cpp.'
    },
    {
      id: 'dl-14',
      q: 'What is Temperature, Top-P (Nucleus), and Top-K sampling in LLM text generation?',
      a: 'Temperature divides logits before softmax: low values (<0.5) make distribution peakier (deterministic), high values (>1.0) flatten it (creative/random). Top-K restricts sampling to the K most likely tokens. Top-P (Nucleus) samples from the smallest set of tokens whose cumulative probability exceeds P (e.g. 0.9), dynamically adapting candidate pool size.'
    },
    {
      id: 'dl-15',
      q: 'What is Speculative Decoding in LLM inference acceleration?',
      a: 'Speculative decoding uses a small, fast draft model to generate K candidate tokens sequentially, and then runs the large target model once in parallel to verify all K tokens simultaneously. Verified tokens are accepted; if the target model rejects token i, tokens i+1..K are discarded, yielding 2-3x speedups without changing output distribution.'
    },
    {
      id: 'dl-16',
      q: 'What is the AdamW Optimizer and why does it decouple weight decay from gradient updates?',
      a: 'Adam computes adaptive learning rates using first (momentum) and second (RMSprop) moments of gradients. In standard Adam with L2 regularization, the penalty is added directly to gradients, distorting the moving averages for weights with large gradients. AdamW decouples weight decay, subtracting λ*w directly from weights at each step.'
    },
    {
      id: 'dl-17',
      q: 'What is Vector Similarity Search: Cosine Similarity vs Dot Product vs Euclidean Distance?',
      a: 'Cosine similarity measures the angle between vectors: A·B / (||A||*||B||), ranging from -1 to 1 regardless of vector magnitude. Dot product measures both angle and magnitude; if vectors are normalized to unit length, dot product equals cosine similarity but is significantly faster to compute on GPUs.'
    },
    {
      id: 'dl-18',
      q: 'What is HNSW (Hierarchical Navigable Small World) in vector databases?',
      a: 'HNSW is a graph-based Approximate Nearest Neighbor (ANN) algorithm. It builds a multi-layer graph where upper layers have long-range links for fast greedy traversal across clusters, and bottom layers have dense local links for fine-grained neighbor search, achieving O(log N) search complexity.'
    },
    {
      id: 'dl-19',
      q: 'What is Hallucination in LLMs and what engineering strategies mitigate it?',
      a: 'Hallucination occurs when an LLM produces factually incorrect assertions with high confidence. Mitigations: 1) RAG with grounded citations. 2) Lower temperature (<0.3). 3) Chain-of-Thought prompting. 4) Self-consistency sampling. 5) Guardrails checking model responses against retrieved source passages.'
    },
    {
      id: 'dl-20',
      q: 'What is Chain-of-Thought (CoT) and Tree-of-Thoughts (ToT) prompting?',
      a: 'CoT prompts the model to generate intermediate reasoning steps ("think step by step") before giving the final answer, allocating more token compute to complex reasoning. Tree-of-Thoughts generalizes CoT by exploring multiple reasoning paths concurrently, evaluating choices, and backtracking via search algorithms (BFS/DFS).'
    },
    {
      id: 'dl-21',
      q: 'What is ReAct (Reasoning + Acting) pattern in AI Agents?',
      a: 'ReAct interleaves reasoning traces (Thought) and task-specific actions (Action: calling tools/APIs like web search or calculators) with observation feedback (Observation). The agent analyzes observations to decide whether to take further actions or return the final answer.'
    },
    {
      id: 'dl-22',
      q: 'What is Multi-Head Attention (MHA) vs Multi-Query Attention (MQA) vs Grouped-Query Attention (GQA)?',
      a: 'MHA has separate Q, K, and V heads for each attention head. MQA shares a single K and V head across all Q heads, drastically reducing KV cache size during inference but potentially hurting model capacity. GQA (used in Llama 2/3) groups Q heads to share a smaller number of K/V heads (e.g. 8 K/V heads for 32 Q heads), balancing quality and memory.'
    },
    {
      id: 'dl-23',
      q: 'What is BPE (Byte Pair Encoding) Tokenization?',
      a: 'BPE is a subword tokenization algorithm. It begins with a base vocabulary of individual characters/bytes and iteratively merges the most frequently co-occurring pair of adjacent tokens into a new single token until target vocabulary size is reached, effectively handling rare and out-of-vocabulary words.'
    },
    {
      id: 'dl-24',
      q: 'What is Dropout and Batch Normalization in deep neural networks?',
      a: 'Dropout randomly zeroes out a fraction (e.g. 20%) of neuron activations during training, preventing co-adaptation and acting as ensemble regularization. Batch Normalization normalizes layer inputs across the mini-batch dimension to mean 0 and variance 1, smoothing the optimization landscape and speeding up convergence.'
    },
    {
      id: 'dl-25',
      q: 'What is Convolution and Pooling in Convolutional Neural Networks (CNNs)?',
      a: 'Convolution applies learned 2D filter kernels sliding across input feature maps to capture spatial local features (edges, textures) with weight sharing. Pooling (MaxPool, AvgPool) downsamples spatial dimensions, reducing compute and granting translation invariance.'
    },
    {
      id: 'dl-26',
      q: 'What is Distributed Training: Data Parallelism vs Pipeline Parallelism vs Tensor Parallelism?',
      a: 'Data Parallelism (DDP) replicates the model across GPUs; each GPU processes a mini-batch slice and synchronizes gradients via AllReduce. Pipeline Parallelism splits layers across GPUs sequentially. Tensor Parallelism (Megatron-LM) splits individual weight matrices (e.g. attention projections) across GPUs within a node.'
    },
    {
      id: 'dl-27',
      q: 'What is ZeRO (Zero Redundancy Optimizer) in DeepSpeed?',
      a: 'ZeRO removes memory redundancies in data-parallel training: ZeRO-1 partitions optimizer states (saving 4x memory); ZeRO-2 partitions optimizer states and gradients (saving 8x memory); ZeRO-3 partitions optimizer states, gradients, and model parameters, allowing massive models to be trained across GPU clusters without complex tensor parallelism.'
    },
    {
      id: 'dl-28',
      q: 'What is Context Window Extension in LLMs (LongLoRA, YaRN, Sliding Window)?',
      a: 'Techniques to scale context lengths beyond pre-trained limits: YaRN (Yet another RoPE extensioN) interpolates RoPE frequencies in the Fourier domain. Sliding Window Attention (Mistral) attends only to the nearest W tokens at each layer while information propagates transitively through stacked layers.'
    },
    {
      id: 'dl-29',
      q: 'What is Function Calling / Tool Use in LLMs and how does structured output (JSON mode) work?',
      a: 'LLMs are trained to detect when a user prompt requires external tools, outputting a structured JSON schema conforming to tool definitions. Constrained decoding (grammar-based sampling like Outlines or instructor) masks invalid tokens at each decoding step, mathematically guaranteeing 100% valid JSON conforming to Pydantic schemas.'
    },
    {
      id: 'dl-30',
      q: 'What is catastrophic forgetting in neural network fine-tuning and how do you prevent it?',
      a: 'Catastrophic forgetting occurs when a pre-trained network fine-tuned on a new task completely overwrites its previously learned general knowledge. Mitigations: parameter-efficient fine-tuning (LoRA), replay buffers containing pre-training samples, Elastic Weight Consolidation (EWC), and low learning rates.'
    }
  ],

  // -------------------------------------------------------------
  // 10. DISTRIBUTED SYSTEMS & SCALABILITY (30 Questions)
  // -------------------------------------------------------------
  distributed_systems: [
    {
      id: 'dist-1',
      q: 'What is the CAP Theorem and how do PACELC theorem expand it?',
      a: 'CAP states a distributed system can guarantee at most two of Consistency, Availability, and Partition Tolerance. In network partitions (P), you must choose C or A. PACELC expands this: If there is a Partition (P), choose Availability (A) or Consistency (C); Else (E), when running normally, trade off Latency (L) versus Consistency (C).'
    },
    {
      id: 'dist-2',
      q: 'What is Consistent Hashing and why is it essential in distributed caching and databases?',
      a: 'Consistent Hashing maps both node servers and keys to a logical 360-degree hash ring. A key is assigned to the next closest node clockwise. When nodes are added or removed, only K/N keys are remapped on average (compared to modular hashing hash(key)%N which invalidates 100% of keys). Virtual nodes ensure even distribution.'
    },
    {
      id: 'dist-3',
      q: 'What is the Raft Consensus Algorithm and how does Leader Election work?',
      a: 'Raft achieves consensus via an elected leader managing replicated logs. If followers stop receiving heartbeats within an election timeout, a follower transitions to Candidate, increments its term, votes for itself, and requests votes. If it receives votes from a majority of nodes, it becomes Leader.'
    },
    {
      id: 'dist-4',
      q: 'What is the Split-Brain Problem and how does Quorum prevent it?',
      a: 'Split-brain occurs when network partition splits a cluster into two disconnected halves, each electing its own leader and accepting conflicting writes. Quorum prevents this by requiring a strict majority (N/2 + 1) of nodes to agree before electing a leader or committing a write.'
    },
    {
      id: 'dist-5',
      q: 'What is Vector Clocks and how do they establish causality in distributed systems?',
      a: 'Vector clocks track causality without synchronized physical clocks. Each node maintains a vector of logical counters for all nodes. When an event occurs, the local counter increments; messages send the full vector. By comparing vectors element-wise, the system determines if event A happened before event B, or if they are concurrent conflicts.'
    },
    {
      id: 'dist-6',
      q: 'Explain Two-Phase Commit (2PC) vs Three-Phase Commit (3PC).',
      a: '2PC coordinates atomic distributed transactions: Phase 1 (Prepare): coordinator asks participants if they can commit; participants vote YES/NO. Phase 2 (Commit): if all vote YES, coordinator sends COMMIT; otherwise ROLLBACK. 2PC is blocking if coordinator crashes. 3PC adds a Pre-Commit phase and timeouts to avoid blocking.'
    },
    {
      id: 'dist-7',
      q: 'What is Strong Consistency vs Eventual Consistency vs Read-Your-Writes Consistency?',
      a: 'Strong consistency guarantees any read returns the most recent write. Eventual consistency guarantees all replicas converge to the same value given no new updates. Read-Your-Writes guarantees a user always sees updates made by their own session, even if other users see stale data temporarily.'
    },
    {
      id: 'dist-8',
      q: 'What are Gossip Protocols and how are they used in decentralized clusters (Cassandra)?',
      a: 'Gossip protocols are decentralized peer-to-peer communication protocols where nodes periodically share state information with a few randomly selected peers. Within O(log N) rounds, cluster membership, health status, and metadata propagate to all nodes without a central coordinator.'
    },
    {
      id: 'dist-9',
      q: 'What is Sharding in databases and what are Range-based vs Hash-based sharding strategies?',
      a: 'Sharding splits large database datasets horizontally across independent servers. Range-based sharding partitions data by key ranges (e.g. IDs 1-1000, 1001-2000), making range queries fast but creating hot-spots for sequential keys. Hash-based sharding applies a hash function to the sharding key, guaranteeing uniform data distribution.'
    },
    {
      id: 'dist-10',
      q: 'What is the difference between Synchronous and Asynchronous Replication?',
      a: 'Synchronous replication waits for confirmation from standby replicas before acknowledging writes to client (guarantees zero data loss / RPO=0, but increases write latency and depends on replica availability). Asynchronous replication acknowledges writes immediately after writing to primary, replicating in background (low latency, but risks data loss upon leader crash).'
    },
    {
      id: 'dist-11',
      q: 'What is Leader-Follower vs Multi-Leader vs Leaderless Replication (Dynamo-style)?',
      a: 'Leader-Follower directs all writes to single leader; followers serve reads. Multi-Leader allows writes to multiple regional leaders, requiring conflict resolution. Leaderless (Dynamo, Cassandra) allows clients to write to any replica directly, using Quorum (W + R > N) and hinted handoff.'
    },
    {
      id: 'dist-12',
      q: 'What is Conflict-Free Replicated Data Types (CRDTs)?',
      a: 'CRDTs are data structures replicated across multiple nodes that can be updated concurrently without central coordination. Updates are commutative and associative; replicas are guaranteed to mathematically converge to identical state regardless of message delivery order. Used in collaborative apps (Figma, Google Docs).'
    },
    {
      id: 'dist-13',
      q: 'What is Write-Ahead Logging (WAL) and how does it guarantee durability in distributed storage?',
      a: 'WAL mandates that any change must be appended sequentially to a persistent log on disk BEFORE modifying in-memory data structures or table pages. If the server crashes, in-memory state is recovered deterministically by replaying the uncommitted log entries from the WAL.'
    },
    {
      id: 'dist-14',
      q: 'What is an LSM-Tree (Log-Structured Merge-tree) vs B-Tree?',
      a: 'B-Trees perform random in-place updates on disk (optimal for fast reads, slower for write-heavy workloads). LSM-Trees (Cassandra, RocksDB) append writes sequentially into an in-memory Memtable backed by WAL; when full, it flushes to immutable disk files (SSTables) and merges periodically via compaction (optimal for write throughput).'
    },
    {
      id: 'dist-15',
      q: 'What is Cache Invalidation and what are Cache-Aside, Write-Through, and Write-Behind patterns?',
      a: 'Cache-Aside: application reads cache; on miss, reads DB and writes to cache. Write-Through: application writes to cache, which synchronously writes to DB before responding. Write-Behind (Write-Back): application writes to cache; cache asynchronously batches writes to DB in background (high performance, risk of data loss on crash).'
    },
    {
      id: 'dist-16',
      q: 'What is Cache Penetration, Cache Breakdown, and Cache Avalanche?',
      a: 'Penetration: queries for non-existent keys bypass cache, hitting DB repeatedly (fix: cache nulls or use Bloom Filters). Breakdown: a single hot key expires, causing massive concurrent queries to storm the DB (fix: mutex locking or soft expiration). Avalanche: many keys expire at the same instant (fix: add random jitter to TTL).'
    },
    {
      id: 'dist-17',
      q: 'What is Bloom Filter and how does it prevent unnecessary disk / database reads?',
      a: 'A Bloom Filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It can yield False Positives (might say element exists when it doesn’t), but NEVER False Negatives (if it says element does not exist, it definitely does not exist), allowing quick rejection of queries for non-existent keys.'
    },
    {
      id: 'dist-18',
      q: 'What are Lamport Timestamps and how do they establish partial ordering?',
      a: 'A Lamport timestamp is a simple integer counter maintained by each process. When an internal event occurs, counter increments. When sending a message, the counter is attached. When receiving, local counter = max(local_counter, message_counter) + 1. If a -> b, then L(a) < L(b).'
    },
    {
      id: 'dist-19',
      q: 'How does Google TrueTime and Spanner achieve external consistency (Serializable ACID) globally?',
      a: 'Google Spanner utilizes the TrueTime API, which uses synchronized atomic clocks and GPS receivers across data centers to bound clock uncertainty (ε ≈ 7ms). By waiting out the uncertainty window (wait 2ε before committing), Spanner guarantees that transaction commit timestamps reflect real-world physical time order.'
    },
    {
      id: 'dist-20',
      q: 'What is Thundering Herd Problem and how do you resolve it in distributed systems?',
      a: 'Thundering herd occurs when a large number of waiting processes or clients are awakened simultaneously when an event occurs (e.g. cache key invalidation), overwhelming CPU and database resources. Mitigate by using distributed locks (single flight pattern) or staggered exponential backoffs with jitter.'
    },
    {
      id: 'dist-21',
      q: 'What is Load Balancing: L4 vs L7 and common algorithms?',
      a: 'L4 load balancing routes traffic at transport layer (TCP/UDP) based on IP and port without inspecting packet payload (ultra-fast). L7 inspects application layer (HTTP headers, cookies, URL paths). Common algorithms: Round Robin, Least Connections, Weighted Least Connections, IP Hash.'
    },
    {
      id: 'dist-22',
      q: 'What is Eventual Consistency and how does Read Repair work?',
      a: 'In eventual consistency systems (Cassandra), replicas may temporarily disagree. During a read operation with quorum, the client compares checksums from multiple replicas. If a mismatch is detected, the client reads full values, determines the newest version via timestamp, returns it to caller, and asynchronously sends the newest version to stale replicas (Read Repair).'
    },
    {
      id: 'dist-23',
      q: 'What is Database Connection Pooling and what happens during Connection Starvation?',
      a: 'Creating database TCP/TLS connections is computationally expensive. A connection pool (HikariCP) maintains a fixed set of open connections reused across requests. Connection starvation occurs when all connections are checked out by slow queries, causing new requests to queue up and timeout.'
    },
    {
      id: 'dist-24',
      q: 'What is Idempotency in distributed messaging (At-least-once vs Exactly-once delivery)?',
      a: 'Message brokers (Kafka, SQS) typically guarantee At-Least-Once delivery, meaning network retries can deliver duplicate messages. Consumers must achieve idempotency by storing processed message IDs in a unique constraint table or Redis cache to deduplicate before applying business side effects.'
    },
    {
      id: 'dist-25',
      q: 'What is Distributed Deadlock and how is it detected or prevented (Wait-Die vs Wound-Wait)?',
      a: 'Distributed deadlock occurs when two or more transactions across different nodes hold locks that the others require in a circular dependency. Wound-Wait: older transaction wounds (aborts) younger transaction if younger holds lock. Wait-Die: older transaction is allowed to wait for younger; younger transaction dies (aborts) if older holds lock.'
    },
    {
      id: 'dist-26',
      q: 'What is Content Delivery Network (CDN) Dynamic Acceleration (TCP optimization, Route optimization)?',
      a: 'CDNs accelerate dynamic uncacheable content by terminating client TLS handshakes at nearby edge servers, maintaining persistent, warmed TCP connections over optimized private fiber backbones directly to the origin server, bypassing congested public Internet BGP routing.'
    },
    {
      id: 'dist-27',
      q: 'What is Geohash and Quadtree in Location-Based Services (Uber, Yelp)?',
      a: 'Geohash encodes latitude and longitude into a base-32 string where common prefixes denote geographic proximity (bounding boxes). A Quadtree is a tree data structure where each internal node has exactly 4 children, recursively partitioning 2D geographic space into quadrants to query nearby points in O(log N).'
    },
    {
      id: 'dist-28',
      q: 'What is Shuffled Sharding and how does it achieve fault isolation?',
      a: 'Instead of assigning all customers to single shards, shuffled sharding assigns each customer to a unique random subset of shards (e.g. 2 out of 8 shards). If a toxic request impacts a shard, only customers sharing that exact subset combination are affected, isolating blast radius to a fraction of a percent.'
    },
    {
      id: 'dist-29',
      q: 'What is Graceful Degradation in distributed system overload?',
      a: 'Under extreme traffic spikes, instead of collapsing completely, the system intentionally disables non-critical features (recommendations, real-time counters, search autocompletion) to preserve CPU and database bandwidth for mission-critical paths (login, payments, checkout).'
    },
    {
      id: 'dist-30',
      q: 'What is Change Data Capture (CDC) and how does it synchronize data across heterogenous systems?',
      a: 'CDC (Debezium) hooks directly into database transaction logs (PostgreSQL WAL, MySQL binlog), capturing every INSERT, UPDATE, and DELETE event at the row level in real time. It streams these change events into Apache Kafka, updating search indexes (Elasticsearch) and caches reliably without dual-write bugs.'
    }
  ],

  // -------------------------------------------------------------
  // 11. CLASSIC SYSTEM DESIGN CASES (30 Questions)
  // -------------------------------------------------------------
  system_design_cases: [
    {
      id: 'cases-1',
      q: 'Design a URL Shortener (TinyURL / Bitly).',
      a: 'Requirements: Shorten long URLs to 7-character aliases, redirect in <10ms, highly available. Math: Base62 (a-z, A-Z, 0-9) with 7 characters yields 62^7 ≈ 3.5 trillion URLs. Architecture: 1) Distributed ID generator (Snowflake or pre-allocated counter ranges). 2) Convert 64-bit integer ID to Base62 string. 3) Store in NoSQL/KV store (DynamoDB/Cassandra) with key: short_code, value: long_url. 4) Cache hot URLs in Redis with LRU eviction. 5) Return HTTP 302 Found (for analytics) or 301 Moved Permanently (for browser caching).'
    },
    {
      id: 'cases-2',
      q: 'Design a Distributed Rate Limiter.',
      a: 'Requirements: Limit users to N requests per minute across cluster. Architecture: 1) API Gateway layer. 2) Store user request timestamps in Redis using Sliding Window Log via Redis Sorted Set (ZADD, ZREMRANGEBYSCORE, ZCARD) executed in an atomic Lua script to avoid race conditions. 3) Return HTTP 429 Too Many Requests with Retry-After header if limit exceeded. 4) Use Local in-memory Token Bucket for secondary tier protection.'
    },
    {
      id: 'cases-3',
      q: 'Design a Real-Time Chat System (WhatsApp / Slack).',
      a: 'Requirements: 1-on-1 and group messaging, online/offline status, message delivery receipts (sent, delivered, read). Architecture: 1) WebSocket Gateway maintaining persistent TCP connections. 2) User Session Registry in Redis (mapping userId -> gateway_host). 3) Message Broker (Kafka/RabbitMQ) routing messages to target gateway. 4) Cassandra for chat message history storage (partition key: chat_id, cluster key: message_timestamp). 5) Push Notifications (APNs/FCM) for offline users.'
    },
    {
      id: 'cases-4',
      q: 'Design a Social Media News Feed (Twitter / Instagram).',
      a: 'Architecture: Hybrid Fan-out approach. Fan-out-on-write (Push): when standard user posts, write post ID directly into all followers’ timeline Redis lists (instant read latency). Fan-out-on-read (Pull): for celebrity users with millions of followers (e.g. Elon Musk), do NOT fan out to millions of feeds; instead, merge their tweets into user feeds dynamically at read time, avoiding write amplification.'
    },
    {
      id: 'cases-5',
      q: 'Design a Distributed Web Crawler (Googlebot).',
      a: 'Requirements: Crawl billions of web pages without getting stuck in spider traps. Architecture: 1) URL Frontier: prioritized queue managing seed URLs. 2) Politeness Manager: domain-based queues ensuring no single domain is bombarded (respecting robots.txt). 3) DNS Caching to avoid DNS query bottlenecks. 4) HTML Fetcher & Parser. 5) Content Deduplication using SimHash / MinHash. 6) Storage: document metadata in Bigtable, raw content in S3.'
    },
    {
      id: 'cases-6',
      q: 'Design a Video Streaming Platform (YouTube / Netflix).',
      a: 'Architecture: 1) Upload Service stores raw master videos in S3. 2) Transcoding Pipeline (AWS MediaConvert) converts video into multiple resolutions (1080p, 720p, 480p) and adaptive streaming formats (HLS, MPEG-DASH) split into 2-6 second chunks (.ts). 3) Multi-CDN distribution (CloudFront, Akamai) caching video chunks at edge servers close to users. 4) Client video player dynamically switches bitrates based on available network bandwidth.'
    },
    {
      id: 'cases-7',
      q: 'Design a Collaborative Document Editing System (Google Docs).',
      a: 'Architecture: Concurrent real-time conflict resolution. 1) Operational Transformation (OT) or CRDTs (Conflict-Free Replicated Data Types like Yjs / Automerge). 2) Centralized OT server sequences operations and transforms concurrent character insertions/deletions. 3) WebSocket connections for low-latency cursor synchronization and edits. 4) Periodic snapshotting to S3 + delta logging in PostgreSQL.'
    },
    {
      id: 'cases-8',
      q: 'Design a Ride-Sharing Service (Uber / Lyft).',
      a: 'Architecture: 1) Location Ingestion Service receives driver GPS updates every 4 seconds via WebSocket. 2) Geospatial Index: in-memory Quadtree or Uber H3 (hexagonal hierarchical spatial index) stored in Redis. 3) Matchmaking Engine: queries drivers within radius, calculates ETA via routing graph service. 4) Trip Management Service coordinates dispatch state machine using distributed transactions (Saga).'
    },
    {
      id: 'cases-9',
      q: 'Design an E-Commerce Flash Sale System (Amazon Prime Day / Ticketmaster).',
      a: 'Requirements: 10,000 items, 1,000,000 users attempting to buy at the same second without overselling. Architecture: 1) Static assets cached on CDN. 2) Rate Limiter and Virtual Waiting Room (Cloudflare Queue) throttling traffic. 3) Redis Lua script decr inventory atomically: if redis.call("get", key) > 0 then redis.call("decr", key) return 1 else return 0. 4) Enqueue successful buyers into Kafka for asynchronous checkout and payment processing.'
    },
    {
      id: 'cases-10',
      q: 'Design a Distributed Unique ID Generator (Twitter Snowflake).',
      a: '64-bit ID structure: 1) 1 bit: unused sign bit (0). 2) 41 bits: epoch timestamp in milliseconds (gives 69 years of IDs). 3) 10 bits: machine/worker ID (supports 1,024 generator nodes). 4) 12 bits: local sequence counter (supports 4,096 IDs per millisecond per node). Total capacity: ~4 million IDs per second per node, strictly k-ordered by time without cross-node network coordination.'
    },
    {
      id: 'cases-11',
      q: 'Design an Autocomplete / Search Typeahead System (Google Search).',
      a: 'Architecture: 1) Data structure: Trie (Prefix Tree) where each node stores the top 5-10 most frequent search terms for that prefix, eliminating full-tree traversals at query time. 2) Caching: store frequent prefix queries in Redis. 3) Offline Analytics Pipeline: MapReduce / Spark aggregates daily search logs, updates query frequencies, and rebuilds the Trie periodically. 4) Client-side debouncing (300ms).'
    },
    {
      id: 'cases-12',
      q: 'Design a Distributed Notification Service (Apple / Google push, SMS, Email).',
      a: 'Architecture: 1) Notification API receives send requests. 2) Prioritized Message Queues (Kafka) separated by channel (SMS, Push, Email). 3) Rate limiting and user preference service (opt-outs, quiet hours). 4) Pluggable worker pools calling third-party gateways (Twilio for SMS, SendGrid for Email, APNs/FCM for push) with exponential retry backoff.'
    },
    {
      id: 'cases-13',
      q: 'Design a Metrics and Alerting Monitoring System (Datadog / Prometheus).',
      a: 'Architecture: 1) Push (StatsD) or Pull (Prometheus scraping endpoints) metric collection. 2) Time-Series Database (TSDB like InfluxDB / TimescaleDB) using chunked columnar storage and Gorillas compression. 3) Real-time Evaluation Engine evaluates alert thresholds against sliding windows. 4) Notification Dispatcher routes alerts to PagerDuty/Slack.'
    },
    {
      id: 'cases-14',
      q: 'Design an E-Commerce Shopping Cart System.',
      a: 'Requirements: High availability, low latency, cross-device sync. Architecture: 1) Store cart items in high-availability NoSQL (DynamoDB or Redis) keyed by user_id or guest_session_id. 2) Merge guest cart with user cart upon authentication. 3) Decouple inventory check: cart holds desired items without reserving stock; hard inventory reservation occurs only when user clicks "Checkout".'
    },
    {
      id: 'cases-15',
      q: 'Design a Payment Processing Gateway (Stripe).',
      a: 'Requirements: Zero double-charging, strict ACID compliance, auditability. Architecture: 1) Idempotency Keys stored in Redis to prevent duplicate processing on retries. 2) Double-entry bookkeeping ledger: every financial transaction consists of equal debit and credit entries. 3) Asynchronous webhook notification delivery with exponential retry. 4) Tokenization service compliant with PCI-DSS.'
    },
    {
      id: 'cases-16',
      q: 'Design a Real-Time Gaming Leaderboard.',
      a: 'Requirements: Update scores in real time, rank millions of players instantly. Architecture: 1) Redis Sorted Sets (ZSET). 2) ZADD leaderboard score userId updates score in O(log N). 3) ZREVRANK leaderboard userId fetches player rank in O(log N). 4) ZREVRANGE leaderboard 0 9 WITHSCORES fetches top 10 global players in O(log N + M). 5) Sharded Redis clusters by game mode/region.'
    },
    {
      id: 'cases-17',
      q: 'Design a Proximity Service / Nearby Places (Yelp / Google Maps).',
      a: 'Architecture: 1) Spatial indexing using Geohash or Google S2 geometry library. 2) Partition geographic regions into cells; each cell maps to a list of place IDs stored in database. 3) When user queries nearby places, compute the geohash of user location plus 8 neighboring cells to account for boundary edge cases. 4) Cache hot location queries in Memcached/Redis.'
    },
    {
      id: 'cases-18',
      q: 'Design an Object Storage Service (Amazon S3).',
      a: 'Architecture: 1) API Layer: handles REST PUT/GET requests. 2) Metadata Service: stores object name, size, bucket, and block mappings in distributed KV store. 3) Storage Nodes: files split into data blocks; use Erasure Coding (e.g. Reed-Solomon 8+4) across distinct server racks to survive multiple hard drive and rack failures with minimal storage overhead. 4) Background Garbage Collector cleans deleted blocks.'
    },
    {
      id: 'cases-19',
      q: 'Design a Distributed Cache (Memcached / Redis).',
      a: 'Architecture: 1) In-memory hash table with doubly linked list for O(1) LRU (Least Recently Used) cache eviction. 2) Multi-threading or event loop I/O multiplexing (epoll). 3) Client-side Consistent Hashing with virtual nodes to distribute keys across cache nodes. 4) Heartbeat health checks to detect node failure and rebalance.'
    },
    {
      id: 'cases-20',
      q: 'Design a Distributed Message Broker (Apache Kafka).',
      a: 'Architecture: 1) Topics partitioned into append-only commit logs written to disk sequentially. 2) Zero-copy data transfer using OS sendfile syscall directly from page cache to NIC socket. 3) Consumer Groups track offsets independently. 4) Leader-follower replication per partition with In-Sync Replicas (ISR).'
    },
    {
      id: 'cases-21',
      q: 'Design an Online Code Execution Platform (LeetCode / HackerRank).',
      a: 'Architecture: 1) Submission Queue (Kafka) to buffer submissions during contests. 2) Judge Worker Nodes: isolate untrusted code execution using secure Linux sandboxes / containers (gVisor, Firecracker microVMs) with strict cgroup limits (CPU, memory, no network access, limited disk). 3) Test runner compares standard output with expected test cases.'
    },
    {
      id: 'cases-22',
      q: 'Design a Stock Trading Exchange (NASDAQ).',
      a: 'Requirements: Ultra-low sub-millisecond latency, strict deterministic FIFO order. Architecture: 1) In-memory Order Book matching bids and asks using Price-Time Priority (B-Tree of price levels, FIFO queue of orders at each price). 2) Single-threaded matching engine per instrument to eliminate lock contention. 3) Sequencer using LMAX Disruptor ring buffer. 4) Async journal logging to NVMe.'
    },
    {
      id: 'cases-23',
      q: 'Design a Digital Asset Cloud Drive (Google Drive / Dropbox).',
      a: 'Architecture: 1) Chunking: split large files into 4MB chunks on the client. 2) Hash deduplication: compute SHA-256 for each chunk; if chunk already exists in S3, avoid re-uploading. 3) Delta sync: upload only modified chunks when a file changes. 4) Sync Service broadcasts chunk updates via WebSockets.'
    },
    {
      id: 'cases-24',
      q: 'Design an Ad Click Event Aggregator.',
      a: 'Requirements: Aggregate billions of ad clicks per minute for billing and real-time dashboards without double counting. Architecture: 1) Ad Click Ingestion API writes raw events to Kafka. 2) Stream Processing Engine (Apache Flink / Spark Streaming) aggregates clicks over tumbling/sliding time windows (1 min, 1 hour). 3) Deduplication using Redis Bloom Filter. 4) Store aggregated counts in OLAP store (ClickHouse).'
    },
    {
      id: 'cases-25',
      q: 'Design a Hotel / Flight Booking System (Airbnb / Booking.com).',
      a: 'Requirements: Prevent double-booking across concurrent checkouts. Architecture: 1) Reservation State Machine: PENDING -> RESERVED -> PAID / CANCELLED. 2) Distributed lock (or database pessimistic lock: SELECT ... FOR UPDATE) during the 10-minute checkout window. 3) Expired reservation cleaner via Redis TTL event / message delay queue. 4) Saga pattern coordinating booking and payment.'
    },
    {
      id: 'cases-26',
      q: 'Design a Webhook Delivery System (Stripe Webhooks).',
      a: 'Architecture: 1) Webhook event producer publishes payload to Kafka. 2) Delivery Worker pools make HTTP POST requests to customer endpoints with timeouts (5s). 3) Exponential backoff with jitter on 5xx or network failures (retry after 1m, 5m, 1h up to 3 days). 4) Dead Letter Queue for permanent failures. 5) Customer portal for manual webhook retries.'
    },
    {
      id: 'cases-27',
      q: 'Design a Parking Garage Management System.',
      a: 'Object-Oriented & System Architecture: 1) Entities: ParkingSpot (compact, large, handicapped, EV), Ticket, Payment, Vehicle. 2) Strategy Pattern for hourly parking fee calculation. 3) Real-time Display Board updated via Redis Pub/Sub as sensors detect vehicle entry/exit.'
    },
    {
      id: 'cases-28',
      q: 'Design a Global Content Delivery Network (CDN).',
      a: 'Architecture: 1) Anycast BGP routing directs user traffic to physically nearest Edge Point of Presence (PoP). 2) Edge Servers cache static content with Reverse Proxy (Nginx/Envoy). 3) Consistent Hashing caches objects across edge nodes. 4) Origin shield reduces load on master origin server.'
    },
    {
      id: 'cases-29',
      q: 'Design a Live Polling / Voting System (Mentimeter / Twitch Polls).',
      a: 'Architecture: 1) WebSockets broadcast real-time poll updates to millions of clients. 2) Ingestion layer writes vote votes to Redis: HINCRBY poll:123 option_a 1. 3) Redis Pub/Sub aggregates and batches vote updates every 500ms to avoid overwhelming client WebSockets. 4) Snapshot counts to PostgreSQL at poll conclusion.'
    },
    {
      id: 'cases-30',
      q: 'Design a Ticket Booking System (Ticketmaster).',
      a: 'Architecture: 1) Seat Map Service serves cached visual seat layouts via CDN. 2) Seat Lock Service locks selected seats for 8 minutes using Redis: SET seat:row4:seat12 userId NX EX 480. 3) Virtual Waiting Room throttles incoming checkout traffic. 4) Database ACID transaction finalizes purchase upon payment confirmation.'
    }
  ],

  // -------------------------------------------------------------
  // 12. LEADERSHIP & CONFLICT RESOLUTION (30 Questions)
  // -------------------------------------------------------------
  leadership: [
    {
      id: 'lead-1',
      q: 'How do you handle a technical disagreement with a Senior Engineer or Architect?',
      a: 'I focus on objective business requirements, performance data, and architectural trade-offs rather than subjective opinions. I propose a quick Proof of Concept (PoC) with measurable benchmarks to compare both approaches empirically. If a consensus cannot be reached after evaluating data, I respect organizational hierarchy, commit fully to the agreed direction, and work diligently to ensure its success.'
    },
    {
      id: 'lead-2',
      q: 'Describe how you mentor junior and mid-level engineers to accelerate their growth.',
      a: 'I practice empathetic mentorship through three pillars: 1) Guiding rather than giving answers: asking probing questions during code reviews so they develop critical thinking. 2) Pair programming on complex system designs to demonstrate debugging methodologies. 3) Creating safe learning environments where failures are treated as post-mortem learning opportunities.'
    },
    {
      id: 'lead-3',
      q: 'How do you manage competing priorities between delivering new product features and paying down technical debt?',
      a: 'I align technical debt with business impact. Rather than framing tech debt as an abstract aesthetic issue, I quantify its cost: slower release velocity, increased bug frequency, and customer-impacting latency. I partner with Product Managers to allocate a consistent percentage (e.g. 15-20%) of sprint bandwidth toward tech debt and integrate refactoring into related feature deliverables.'
    },
    {
      id: 'lead-4',
      q: 'How do you handle a team member who is underperforming or missing deadlines?',
      a: 'I initiate a private 1-on-1 conversation with empathy and curiosity: "I noticed the last milestone slipped; is anything blocking you?" I work to uncover root causes (unclear requirements, personal challenges, skill gaps). We establish clear, objective short-term goals with weekly check-ins. If the issue is skill-related, I provide pair programming and resources; if motivation/alignment, I set clear expectations.'
    },
    {
      id: 'lead-5',
      q: 'Describe a time you had to drive adoption of a major architectural change or new technology across a team.',
      a: 'I start by building consensus rather than mandating changes from the top down. I write a clear RFC (Request for Comments) outlining the problem, alternatives considered, trade-offs, and migration plan. I host an open discussion session to address concerns, build a small prototype demonstrating tangible benefits (e.g. 40% faster builds), and create comprehensive starter templates to minimize friction.'
    },
    {
      id: 'lead-6',
      q: 'How do you conduct blameless post-mortems after a critical production outage?',
      a: 'I establish that systemic failures, not human error, cause outages: good systems must be resilient to honest mistakes. We map the precise timeline of events, identify root causes using the "5 Whys" methodology, and document actionable preventive measures with assigned owners and deadlines (e.g. adding automated canary checks or circuit breakers) without assigning blame.'
    },
    {
      id: 'lead-7',
      q: 'How do you deliver constructive, critical feedback to a colleague effectively?',
      a: 'I deliver feedback privately, promptly, and focused strictly on behaviors and impact rather than personality traits (using the Situation-Behavior-Impact model). Example: "During the design review (Situation), interrupting other engineers before they finished speaking (Behavior) made team members hesitant to share ideas (Impact)." I then partner with them to brainstorm actionable alternatives.'
    },
    {
      id: 'lead-8',
      q: 'How do you handle scope creep and tight, unrealistic deadlines imposed by stakeholders?',
      a: 'I believe in transparent, data-driven negotiation based on the Iron Triangle (Scope, Time, Resources). When deadlines are immovable, I collaborate with Product Managers to prioritize Must-Have vs Nice-to-Have features (MoSCoW method), cutting low-priority scope for Phase 1 to guarantee quality without burning out the team.'
    },
    {
      id: 'lead-9',
      q: 'How do you foster an inclusive, psychologically safe engineering culture?',
      a: 'I model vulnerability by openly acknowledging my own mistakes and knowledge gaps, proving that perfection is not expected. I ensure all voices are heard in meetings by intentionally inviting input from quieter engineers, celebrate team members’ successes publicly, and treat questions as opportunities for collective learning.'
    },
    {
      id: 'lead-10',
      q: 'What is your philosophy on code reviews: how do you balance thoroughness with development velocity?',
      a: 'I automate everything that can be automated (formatting, linting, test coverage) so reviewers focus purely on architectural design, edge cases, and business logic. I categorize review comments clearly (e.g. "Nitpick:" vs "Blocking:") so authors know what is critical. I maintain a team SLA of reviewing PRs within 24 hours to prevent blockers.'
    },
    {
      id: 'lead-11',
      q: 'How do you manage cross-functional conflicts between Engineering, Product, and Design?',
      a: 'I ground conversations in our shared goal: delivering maximum value to our users. When design proposals introduce severe engineering complexity or performance degradation, I bring designers and engineers together with interactive prototypes to explore compromise designs that preserve UX intent while reducing implementation risk.'
    },
    {
      id: 'lead-12',
      q: 'How do you evaluate whether to build an internal solution versus buying a commercial third-party tool?',
      a: 'I assess whether the problem represents our core business differentiator. If a capability is commoditized infrastructure (e.g. auth via Auth0, email delivery via SendGrid), buying or using open-source saves months of engineering maintenance. If the problem is our proprietary competitive advantage, we build in-house.'
    },
    {
      id: 'lead-13',
      q: 'Describe your approach to delegating tasks to team members.',
      a: 'I delegate outcomes and ownership rather than micro-managing step-by-step implementation. I match tasks with engineers’ growth aspirations, provide clear context on business objectives and acceptance criteria, define milestone check-in cadences, and remain accessible as an unblocker and advisor.'
    },
    {
      id: 'lead-14',
      q: 'How do you manage remote or geographically distributed engineering teams across time zones?',
      a: 'I prioritize asynchronous communication as the default: writing detailed RFCs, maintaining up-to-date documentation, and recording video walkthroughs (Loom). For overlapping hours, we reserve time for high-value collaborative meetings (1-on-1s, design brainstorms) while respecting working hours across time zones.'
    },
    {
      id: 'lead-15',
      q: 'How do you maintain team morale and focus during high-pressure crises or re-orgs?',
      a: 'I provide transparent, honest communication to filter out rumors and reduce anxiety. I break overwhelming problems down into small, achievable daily milestones, celebrate incremental wins, and prioritize the team’s mental health by preventing overtime heroics and ensuring fair rotation of on-call burdens.'
    },
    {
      id: 'lead-16',
      q: 'How do you say "No" to a high-priority executive request professionally?',
      a: 'I say "Yes, and here are the trade-offs" rather than a flat "No". I lay out our current commitments: "We can certainly deliver this executive initiative by Q3; to do so with existing capacity, we would need to defer Feature B or hire external contractors. Which trade-off aligns best with leadership priorities?"'
    },
    {
      id: 'lead-17',
      q: 'How do you encourage innovation and continuous learning within an engineering team?',
      a: 'I advocate for dedicated exploration time (such as 10% innovation time or quarterly hackathons). We hold bi-weekly "Lunch and Learn" tech talks where team members share interesting technologies or post-mortem learnings, and provide company-sponsored learning stipends for conferences and certifications.'
    },
    {
      id: 'lead-18',
      q: 'Describe how you onboard a new software engineer effectively in their first 30 days.',
      a: 'I set up a structured 30-60-90 day plan. Day 1-7: setup local dev environment, assign an onboarding buddy, and have them merge their first small documentation or bug fix PR to production. Day 30: independently complete a medium-sized feature, shadow on-call rotations, and understand team architectural foundations.'
    },
    {
      id: 'lead-19',
      q: 'How do you handle a situation where you realize a project you championed was a mistake?',
      a: 'I practice intellectual honesty and reject the Sunk Cost Fallacy. I gather performance and engagement data, evaluate why original hypotheses failed, document key learnings openly, and present a decisive recommendation to leadership to pivot or decommission the project, redeploying resources to higher-impact initiatives.'
    },
    {
      id: 'lead-20',
      q: 'How do you prevent burnout on your engineering team during prolonged launch cycles?',
      a: 'I monitor leading indicators of burnout: cynical tone in communications, declining code review participation, or commits at odd hours. I enforce realistic sprint planning, ensure developers take accumulated time off after major milestones, and normalize sustainable pacing over crunch culture.'
    },
    {
      id: 'lead-21',
      q: 'How do you advocate for engineering best practices (testing, documentation) when stakeholders push for speed?',
      a: 'I demonstrate that "the only way to go fast is to go well" (Uncle Bob). I show historical data illustrating how skipped automated tests resulted in regression bugs that derailed subsequent sprint velocity by 50%. High quality is not a luxury; it is the prerequisite for sustained speed.'
    },
    {
      id: 'lead-22',
      q: 'How do you handle difficult stakeholders who frequently change requirements mid-sprint?',
      a: 'I implement clear sprint boundaries with two-week cadences. Once a sprint begins, scope is locked unless a true business emergency occurs. For incoming requests, we triage them into the backlog for the next sprint planning, maintaining developer focus while providing stakeholders a predictable channel for change.'
    },
    {
      id: 'lead-23',
      q: 'What is your process for making tough architectural decisions when data is ambiguous?',
      a: 'I use the Two-Way Door vs One-Way Door framework (Jeff Bezos). If a decision is a Two-Way Door (reversible with low cost), I encourage rapid action and experimentation. If it is a One-Way Door (irreversible or massive migration cost, like core database selection), I invest time in rigorous prototyping, RFC reviews, and risk mitigation.'
    },
    {
      id: 'lead-24',
      q: 'How do you ensure equitable recognition and visibility for "glue work" (unrecognized maintenance, onboarding, mentoring)?',
      a: 'I explicitly recognize glue work in team standups and sprint retrospectives. During performance reviews, I evaluate cultural contributions, mentorship, and documentation quality with equal weight alongside pure feature output, ensuring team builders are rewarded fairly.'
    },
    {
      id: 'lead-25',
      q: 'How do you handle knowledge silos and single points of failure (bus factor of 1)?',
      a: 'I implement mandatory documentation standards, rotate feature ownership across sprints, require pairing on critical legacy components, and ensure PR reviews for specialized domains are distributed across multiple engineers so domain expertise is shared across the team.'
    },
    {
      id: 'lead-26',
      q: 'How do you manage an engineer who is technically brilliant but abrasive or dismissive to colleagues?',
      a: 'I address it directly in 1-on-1s. I clarify that engineering effectiveness is evaluated on both technical delivery AND teamwork/collaboration. A brilliant engineer who alienates teammates creates net negative productivity. I provide specific examples of abrasive interactions, coach them on constructive communication, and hold them accountable.'
    },
    {
      id: 'lead-27',
      q: 'How do you drive alignment when team members have wildly divergent opinions on architecture?',
      a: 'I organize a structured architectural workshop. We define explicit evaluation criteria upfront (scalability, developer experience, maintenance cost, time to market). We score each proposal against the matrix openly. By focusing on agreed criteria rather than personalities, the team aligns naturally around the best collective solution.'
    },
    {
      id: 'lead-28',
      q: 'How do you build trust with a newly inherited or acquired engineering team?',
      a: 'I enter listening mode first: conducting 1-on-1s with every team member to understand their pain points, aspirations, and what is working well. I avoid immediate sweeping changes. Instead, I identify quick operational wins (fixing broken CI, clearing annoying blockers) to demonstrate servant leadership and earn their trust.'
    },
    {
      id: 'lead-29',
      q: 'How do you handle on-call rotation fairness and incident fatigue?',
      a: 'I ensure on-call rotations are distributed evenly. If a developer gets paged overnight, they are expected to take time off the following morning. Every page must correspond to an actionable alert; non-actionable noise is promptly tuned down or deleted to protect engineer sleep and prevent alert fatigue.'
    },
    {
      id: 'lead-30',
      q: 'What does "Extreme Ownership" mean to you as an engineering leader?',
      a: 'Extreme ownership means that when the team succeeds, credit belongs to the team; when a bug slips, a deadline is missed, or a server crashes, accountability rests with me as a leader. It means proactively unblocking colleagues, anticipating risks before they materialize, and focusing on solutions rather than excuses.'
    }
  ]
};

module.exports = {
  additionalDomainsQuestions
};
