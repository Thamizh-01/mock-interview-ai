/**
 * Master Domain & Sub-Type Interview Questions Catalog & Aggregator
 * Supports 14 primary interview domains with 45 specialized technology sub-types.
 * Every single sub-type contains 30 professional interview questions with model answers.
 * Total: 45 x 30 = 1,350 Curated Interview Questions.
 */

const { fullstackQuestions } = require('./fullstackQuestions');
const { frontendQuestions } = require('./frontendQuestions');
const { backendDatabaseQuestions } = require('./backendDatabaseQuestions');
const { moreSubtypeQuestions } = require('./moreSubtypeQuestions');
const { additionalDomainsQuestions } = require('./additionalDomainsQuestions');
const { newDomainsQuestions1 } = require('./newDomainsQuestions1');
const { newDomainsQuestions2 } = require('./newDomainsQuestions2');

const domainCatalog = [
  {
    id: 'fullstack',
    name: 'Full Stack Development',
    icon: '⚡',
    badge: 'Popular',
    description: 'Frontend, backend, modern build bundlers, and end-to-end full stack architecture',
    subtypes: [
      { id: 'react', name: 'React.js', count: 30, icon: '⚛️', description: 'Components, hooks, virtual DOM, state management, reconciliation, and performance' },
      { id: 'node', name: 'Node.js', count: 30, icon: '🟢', description: 'Event loop, streams, asynchronous I/O, clustering, buffers, and worker threads' },
      { id: 'vite', name: 'Vite & Bundlers', count: 30, icon: '⚡', description: 'ESM dev server, Rollup bundling, HMR, plugins, and modern build optimizations' },
      { id: 'express', name: 'Express.js', count: 30, icon: '🚂', description: 'Routing, middleware chains, error handling, security headers, and REST APIs' },
      { id: 'nextjs', name: 'Next.js', count: 30, icon: '▲', description: 'App Router, React Server Components, SSR, SSG, ISR, and API routes' },
      { id: 'fullstack_arch', name: 'Full Stack Architecture', count: 30, icon: '🌐', description: 'Client-server patterns, auth (JWT/OAuth), CORS, WebSockets, and scaling' }
    ]
  },
  {
    id: 'frontend',
    name: 'Frontend Development',
    icon: '🎨',
    badge: 'Core',
    description: 'Modern JavaScript, TypeScript, responsive CSS, and modern frontend frameworks',
    subtypes: [
      { id: 'javascript', name: 'Modern JavaScript (ES6+)', count: 30, icon: '🟨', description: 'Closures, prototypes, promises, async/await, event loop, and memory' },
      { id: 'typescript', name: 'TypeScript', count: 30, icon: '🔷', description: 'Generics, interfaces, utility types, unions, type narrowing, and safety' },
      { id: 'html_css', name: 'HTML5 & Modern CSS', count: 30, icon: '📑', description: 'Flexbox, Grid, subgrid, semantic markup, animations, and accessibility' },
      { id: 'vue', name: 'Vue.js', count: 30, icon: '💚', description: 'Reactivity system, Composition API, Pinia, Vue Router, and SFC compiler' }
    ]
  },
  {
    id: 'backend',
    name: 'Backend Development',
    icon: '⚙️',
    badge: 'High Demand',
    description: 'Server frameworks, API design, concurrency, message brokers, and enterprise backends',
    subtypes: [
      { id: 'python_backend', name: 'Python (FastAPI / Django)', count: 30, icon: '🐍', description: 'ASGI/WSGI, Pydantic, ORM, async def, decorators, and GIL concurrency' },
      { id: 'java_spring', name: 'Java Spring Boot', count: 30, icon: '☕', description: 'Inversion of Control, Dependency Injection, JPA, Spring Security, and AOP' },
      { id: 'golang', name: 'Go (Golang)', count: 30, icon: '🐹', description: 'Goroutines, channels, interfaces, memory model, GC, and concurrency' },
      { id: 'microservices', name: 'Microservices & APIs', count: 30, icon: '🧩', description: 'Saga pattern, API gateways, gRPC, distributed tracing, and resilience' }
    ]
  },
  {
    id: 'cybersecurity',
    name: 'Cybersecurity & InfoSec',
    icon: '🛡️',
    badge: 'Critical',
    description: 'Web application security, OWASP Top 10, penetration testing, and cryptography',
    subtypes: [
      { id: 'web_security', name: 'Web Security & OWASP Top 10', count: 30, icon: '🌐', description: 'SQLi, XSS, CSRF, SSRF, IDOR, CSP, and secure session management' },
      { id: 'network_security', name: 'Network Security & Pen Testing', count: 30, icon: '🔍', description: 'TCP handshakes, Wireshark, Nmap, firewalls, DDoS mitigation, and lateral movement' },
      { id: 'cryptography', name: 'Cryptography & SecOps', count: 30, icon: '🔐', description: 'AES-GCM, RSA, ECC, PKI, digital signatures, envelope encryption, and SIEM/SOC' }
    ]
  },
  {
    id: 'mobile',
    name: 'Mobile App Development',
    icon: '📱',
    badge: 'Trending',
    description: 'Cross-platform mobile frameworks, native iOS Swift, and Android Kotlin',
    subtypes: [
      { id: 'react_native', name: 'React Native', count: 30, icon: '⚛️', description: 'Fabric, TurboModules, JSI, Reanimated, FlatList, Expo, and navigation' },
      { id: 'flutter', name: 'Flutter & Dart', count: 30, icon: '💙', description: 'Impeller engine, Widget/Element trees, BLoC, Riverpod, and platform channels' },
      { id: 'android_kotlin', name: 'Android Native (Kotlin)', count: 30, icon: '🤖', description: 'Jetpack Compose, Coroutines, Flow, ViewModel, Hilt, Room, and WorkManager' },
      { id: 'ios_swift', name: 'iOS Native (Swift)', count: 30, icon: '🍎', description: 'SwiftUI, UIKit, ARC memory, Swift Concurrency (async/await/actors), and Combine' }
    ]
  },
  {
    id: 'dataengineering',
    name: 'Data Engineering & Big Data',
    icon: '📊',
    badge: 'High Demand',
    description: 'Distributed data processing, streaming event pipelines, and cloud data warehousing',
    subtypes: [
      { id: 'spark', name: 'Apache Spark & Big Data', count: 30, icon: '💥', description: 'Catalyst optimizer, Tungsten, RDDs, DataFrames, broadcast joins, and data skew' },
      { id: 'kafka_streaming', name: 'Kafka & Real-Time Streaming', count: 30, icon: '📨', description: 'Partitions, consumer groups, ISR, exactly-once, zero-copy, and compaction' },
      { id: 'data_warehousing', name: 'Data Warehousing & ETL (Snowflake/BigQuery/dbt)', count: 30, icon: '❄️', description: 'Dimensional modeling, micro-partitions, Star schema, dbt models, and SCD' }
    ]
  },
  {
    id: 'database',
    name: 'Database Engineering',
    icon: '🗄️',
    badge: 'Essential',
    description: 'Relational SQL, NoSQL document stores, caching, indexing, and query optimization',
    subtypes: [
      { id: 'sql_postgres', name: 'PostgreSQL & Relational SQL', count: 30, icon: '🐘', description: 'ACID transactions, window functions, indexes, joins, and normalization' },
      { id: 'mongodb', name: 'MongoDB & NoSQL', count: 30, icon: '🍃', description: 'Document schema design, aggregation pipelines, replica sets, and sharding' },
      { id: 'redis', name: 'Redis & In-Memory Caching', count: 30, icon: '🔴', description: 'Data structures, cache-aside, TTL, pub/sub, invalidation, and Redlock' }
    ]
  },
  {
    id: 'devops',
    name: 'DevOps & Cloud',
    icon: '☁️',
    badge: 'Trending',
    description: 'Containers, Kubernetes orchestration, CI/CD automation, and cloud architecture',
    subtypes: [
      { id: 'docker', name: 'Docker & Containers', count: 30, icon: '🐳', description: 'Containerization, multi-stage Dockerfiles, networking, volumes, and security' },
      { id: 'kubernetes', name: 'Kubernetes (K8s)', count: 30, icon: '☸️', description: 'Pods, deployments, services, ingress, HPA, ConfigMaps, and architecture' },
      { id: 'aws_cloud', name: 'AWS Cloud Architecture', count: 30, icon: '🟧', description: 'VPC, EC2, S3, Lambda, RDS, IAM, CloudFront, and Well-Architected Framework' },
      { id: 'cicd_pipelines', name: 'CI/CD & Automation', count: 30, icon: '🔄', description: 'GitHub Actions, GitOps, automated testing, blue-green deployments, and DORA' }
    ]
  },
  {
    id: 'blockchain',
    name: 'Blockchain & Web3',
    icon: '⛓️',
    badge: 'Web3',
    description: 'Solidity smart contracts, EVM bytecode internals, and decentralized finance (DeFi)',
    subtypes: [
      { id: 'solidity', name: 'Solidity & Smart Contracts', count: 30, icon: '📜', description: 'Reentrancy, storage vs memory, ERC-20/721, proxies, flash loans, and gas' },
      { id: 'ethereum_evm', name: 'Ethereum & EVM Architecture', count: 30, icon: '🔷', description: 'Stack, opcodes, gas model, Merkle Patricia trie, PoS, and rollups' },
      { id: 'web3_defi', name: 'Web3 Protocols & DeFi Security', count: 30, icon: '🪙', description: 'Uniswap AMM math, impermanent loss, oracles, liquidations, and vaults' }
    ]
  },
  {
    id: 'qa_testing',
    name: 'QA & Test Automation',
    icon: '🧪',
    badge: 'Quality',
    description: 'End-to-end browser automation, API load testing, and software quality frameworks',
    subtypes: [
      { id: 'automation_testing', name: 'Automated Testing (Playwright/Cypress/Selenium)', count: 30, icon: '🎭', description: 'Page Object Model, locators, auto-waiting, visual regression, and headless CI' },
      { id: 'api_testing', name: 'API Testing & Performance (Postman/JMeter/k6)', count: 30, icon: '⚡', description: 'Status codes, schema validation, load testing, latency percentiles, and k6' },
      { id: 'qa_methodologies', name: 'QA Methodologies & TDD/BDD', count: 30, icon: '📋', description: 'Test pyramid, TDD cycles, Gherkin BDD, defect lifecycle, and test coverage' }
    ]
  },
  {
    id: 'datascience',
    name: 'Data Science & AI',
    icon: '🤖',
    badge: 'AI Era',
    description: 'Machine learning algorithms, deep neural networks, transformers, and LLM systems',
    subtypes: [
      { id: 'machine_learning', name: 'Machine Learning Core', count: 30, icon: '🧠', description: 'Supervised/unsupervised learning, bias-variance, evaluation metrics, and ensembling' },
      { id: 'deep_learning', name: 'Deep Learning & LLMs', count: 30, icon: '🔮', description: 'Transformers, self-attention, RAG, LoRA, quantization, and agent architectures' }
    ]
  },
  {
    id: 'systemdesign',
    name: 'System Design',
    icon: '🏗️',
    badge: 'Senior / Staff',
    description: 'Large-scale distributed systems, high availability, fault tolerance, and trade-offs',
    subtypes: [
      { id: 'distributed_systems', name: 'Distributed Systems Core', count: 30, icon: '🌐', description: 'CAP/PACELC theorem, consistent hashing, Raft consensus, and CRDTs' },
      { id: 'system_design_cases', name: 'Classic Design Cases', count: 30, icon: '📐', description: 'TinyURL, Rate Limiter, Slack Chat, Twitter Feed, and Uber architecture' }
    ]
  },
  {
    id: 'product_design',
    name: 'Product & UI/UX Design',
    icon: '🎯',
    badge: 'Strategy',
    description: 'UI/UX design systems, user research, product discovery, and growth strategy',
    subtypes: [
      { id: 'uiux_design', name: 'UI/UX Design Systems & Research', count: 30, icon: '🎨', description: 'Design tokens, Jakob\'s/Fitts\'s laws, WCAG accessibility, and heuristic evaluation' },
      { id: 'product_mgmt', name: 'Product Management & Strategy', count: 30, icon: '📈', description: 'Product-Market Fit, RICE prioritization, North Star Metric, OKRs, and PLG' }
    ]
  },
  {
    id: 'behavioral',
    name: 'Behavioral & Leadership',
    icon: '🤝',
    badge: 'All Roles',
    description: 'STAR methodology answers, conflict resolution, leadership, and team culture',
    subtypes: [
      { id: 'star_behavioral', name: 'STAR Behavioral Scenarios', count: 30, icon: '🌟', description: 'Overcoming technical challenges, handling deadlines, failure, and ambiguity' },
      { id: 'leadership', name: 'Leadership & Conflict', count: 30, icon: '👑', description: 'Mentoring peers, cross-functional conflicts, technical trade-offs, and ownership' }
    ]
  }
];

// Master lookup mapping
const domainQuestionsMap = {
  // 1. Full Stack
  react: fullstackQuestions.react,
  node: fullstackQuestions.node,
  vite: fullstackQuestions.vite,
  express: fullstackQuestions.express,
  nextjs: fullstackQuestions.nextjs,
  fullstack_arch: fullstackQuestions.fullstack_arch,

  // 2. Frontend
  javascript: frontendQuestions.javascript,
  typescript: frontendQuestions.typescript,
  html_css: additionalDomainsQuestions.html_css,
  vue: additionalDomainsQuestions.vue,

  // 3. Backend
  python_backend: backendDatabaseQuestions.python_backend,
  java_spring: additionalDomainsQuestions.java_spring,
  golang: additionalDomainsQuestions.golang,
  microservices: additionalDomainsQuestions.microservices,

  // 4. Cybersecurity & InfoSec
  web_security: newDomainsQuestions1.web_security,
  network_security: newDomainsQuestions1.network_security,
  cryptography: newDomainsQuestions1.cryptography,

  // 5. Mobile App Development
  react_native: newDomainsQuestions1.react_native,
  flutter: newDomainsQuestions1.flutter,
  android_kotlin: newDomainsQuestions1.android_kotlin,
  ios_swift: newDomainsQuestions1.ios_swift,

  // 6. Data Engineering & Big Data
  spark: newDomainsQuestions1.spark,
  kafka_streaming: newDomainsQuestions1.kafka_streaming,
  data_warehousing: newDomainsQuestions1.data_warehousing,

  // 7. Database Engineering
  sql_postgres: backendDatabaseQuestions.sql_postgres,
  mongodb: moreSubtypeQuestions.mongodb,
  redis: moreSubtypeQuestions.redis,

  // 8. DevOps & Cloud
  docker: backendDatabaseQuestions.docker,
  kubernetes: moreSubtypeQuestions.kubernetes,
  aws_cloud: additionalDomainsQuestions.aws_cloud,
  cicd_pipelines: additionalDomainsQuestions.cicd_pipelines,

  // 9. Blockchain & Web3
  solidity: newDomainsQuestions2.solidity,
  ethereum_evm: newDomainsQuestions2.ethereum_evm,
  web3_defi: newDomainsQuestions2.web3_defi,

  // 10. QA & Test Automation
  automation_testing: newDomainsQuestions2.automation_testing,
  api_testing: newDomainsQuestions2.api_testing,
  qa_methodologies: newDomainsQuestions2.qa_methodologies,

  // 11. Data Science & AI
  machine_learning: additionalDomainsQuestions.machine_learning,
  deep_learning: additionalDomainsQuestions.deep_learning,

  // 12. System Design
  distributed_systems: additionalDomainsQuestions.distributed_systems,
  system_design_cases: additionalDomainsQuestions.system_design_cases,

  // 13. Product & UI/UX Design
  uiux_design: newDomainsQuestions2.uiux_design,
  product_mgmt: newDomainsQuestions2.product_mgmt,

  // 14. Behavioral & Leadership
  star_behavioral: moreSubtypeQuestions.star_behavioral,
  leadership: additionalDomainsQuestions.leadership
};

/**
 * Retrieve 30 questions for a given domain and subtype.
 */
function getQuestionsBySubtype(domainId, subtypeId) {
  const cleanSubtype = (subtypeId || '').toLowerCase().trim();
  if (domainQuestionsMap[cleanSubtype]) {
    return domainQuestionsMap[cleanSubtype];
  }
  // Fallback check in domain catalog
  const domain = domainCatalog.find(d => d.id === domainId);
  if (domain && domain.subtypes) {
    const matched = domain.subtypes.find(s => s.id === cleanSubtype);
    if (matched && domainQuestionsMap[matched.id]) {
      return domainQuestionsMap[matched.id];
    }
  }
  return [];
}

module.exports = {
  domainCatalog,
  domainQuestionsMap,
  getQuestionsBySubtype
};
