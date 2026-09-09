/**
 * Additional Sub-Type Interview Questions
 * Sub-types: MongoDB (30), Redis (30), Kubernetes (30), Machine Learning (30), Distributed Systems (30), STAR Behavioral (30)
 */

const moreSubtypeQuestions = {
  // -------------------------------------------------------------
  // 1. MONGODB & NOSQL (30 Questions)
  // -------------------------------------------------------------
  mongodb: [
    {
      id: 'mgo-1',
      q: 'How does MongoDB store data and what is BSON?',
      a: 'MongoDB stores data as BSON (Binary JSON) documents organized in collections. BSON extends JSON with support for additional data types (Date, ObjectId, Binary data, 64-bit integers, Decimal128) and enables fast traversal and indexing.'
    },
    {
      id: 'mgo-2',
      q: 'Explain the MongoDB Aggregation Pipeline and common stages ($match, $group, $project, $lookup).',
      a: 'The aggregation pipeline processes documents through a multi-stage pipeline: $match filters documents (like WHERE), $project reshapes fields (like SELECT), $group groups documents by an expression and computes aggregates (like GROUP BY with SUM/AVG), and $lookup performs left outer joins with other collections.'
    },
    {
      id: 'mgo-3',
      q: 'When should you Embed documents versus Reference documents in MongoDB schema design?',
      a: 'Embed (Denormalize) for 1-to-1 or 1-to-few relationships where child data is always accessed together with the parent (e.g., user addresses), ensuring atomic updates in a single read. Reference (Normalize) for 1-to-many, 1-to-squillions, or many-to-many relationships where data grows unbounded (exceeding the 16MB document limit) or is accessed independently.'
    },
    {
      id: 'mgo-4',
      q: 'What is a Replica Set in MongoDB and how does automatic failover work?',
      a: 'A Replica Set is a cluster of MongoDB servers maintaining identical data for high availability. It consists of one Primary node (handles all write operations) and multiple Secondary nodes (replicate via oplog). If the Primary fails, Secondaries hold an election using Raft consensus and elect a new Primary automatically within seconds.'
    },
    {
      id: 'mgo-5',
      q: 'What is MongoDB Sharding and what are the components of a sharded cluster?',
      a: 'Sharding partitions data horizontally across multiple machines to support massive throughput and data volume. Components: 1) Shard nodes: store data partitions (each shard is a replica set). 2) Mongos: query routers that route client requests. 3) Config Servers: store cluster metadata and chunk ranges.'
    },
    {
      id: 'mgo-6',
      q: 'What are Compound Indexes in MongoDB and what is the Equality, Sort, Range (ESR) rule?',
      a: 'A compound index indexes multiple fields (db.col.createIndex({ status: 1, age: 1 })). The ESR rule dictates optimal index key order: 1) Equality fields first (exact matches). 2) Sort fields second (avoids in-memory sorting). 3) Range filter fields last (<, >, $in).'
    },
    {
      id: 'mgo-7',
      q: 'What are TTL (Time-To-Live) indexes in MongoDB and what are they used for?',
      a: 'TTL indexes automatically delete documents after a specified number of seconds or at a specific expiration timestamp (expireAfterSeconds: 3600). Used for session expiration, temporary tokens, and log data rotation.'
    },
    {
      id: 'mgo-8',
      q: 'What is the MongoDB WiredTiger storage engine and what are its concurrency benefits?',
      a: 'WiredTiger is MongoDB’s default storage engine. Features: document-level concurrency control (optimistic concurrency without collection-level write locks), block compression (Snappy/zlib saving 50-70% disk space), and in-memory cache management.'
    },
    {
      id: 'mgo-9',
      q: 'How does MongoDB support Multi-Document ACID Transactions?',
      a: 'MongoDB introduced multi-document ACID transactions across replica sets and sharded clusters using sessions (session.startTransaction(), session.commitTransaction()). Transactions provide snapshot isolation, guaranteeing all-or-nothing atomicity across multiple collections.'
    },
    {
      id: 'mgo-10',
      q: 'What is Read Concern and Write Concern in MongoDB?',
      a: 'Write Concern controls acknowledgment level for writes: w: 1 (primary acknowledged), w: "majority" (persisted to majority of replica nodes), j: true (written to journal disk). Read Concern controls data isolation: "local" (returns current node data), "majority" (returns data acknowledged by majority, preventing dirty reads on failover).'
    },
    {
      id: 'mgo-11',
      q: 'What is the 16MB document size limit in MongoDB and how do you store larger files?',
      a: 'Individual BSON documents cannot exceed 16MB to prevent RAM bloat during queries. For files exceeding 16MB (videos, high-res images, large PDFs), use GridFS, which divides files into 255KB chunks stored in fs.chunks collection with metadata in fs.files.'
    },
    {
      id: 'mgo-12',
      q: 'What is an Oplog (Operations Log) in MongoDB?',
      a: 'The oplog (local.oplog.rs) is a capped collection on the Primary node that records a rolling history of all write operations. Secondary nodes tail the oplog to apply changes asynchronously, ensuring replica synchronization.'
    },
    {
      id: 'mgo-13',
      q: 'What is an Upsert in MongoDB and what operators are used?',
      a: 'An upsert atomically updates a document if it matches query criteria, or inserts a new document if no match is found (updateOne({ query }, { update }, { upsert: true })). Use $setOnInsert to specify fields that should only be initialized on creation.'
    },
    {
      id: 'mgo-14',
      q: 'What are Capped Collections in MongoDB?',
      a: 'Capped collections are fixed-size circular collections that maintain insertion order. When the allocated size is reached, MongoDB automatically overwrites the oldest documents like a circular buffer (ideal for logging and audit trails).'
    },
    {
      id: 'mgo-15',
      q: 'What is the difference between $set and $push in MongoDB update operations?',
      a: '$set adds or replaces the value of a specific field. $push appends a new element to an existing array field (e.g. adding a comment to a post’s comments array) without overwriting existing array elements.'
    },
    {
      id: 'mgo-16',
      q: 'What is Change Streams in MongoDB and how are they used in real-time apps?',
      a: 'Change Streams allow applications to listen to real-time data changes across collections or databases without polling, powered by the oplog. Clients receive notifications when documents are inserted, updated, or deleted, ideal for real-time dashboards and WebSocket events.'
    },
    {
      id: 'mgo-17',
      q: 'What is a Covered Query in MongoDB?',
      a: 'A covered query is a query that can be satisfied entirely using an index without inspecting any document on disk. All fields in the query filter and the projection must be present in the index, with _id explicitly excluded (_id: 0).'
    },
    {
      id: 'mgo-18',
      q: 'What is Collation in MongoDB and when is it needed?',
      a: 'Collation defines language-specific rules for string comparison and sorting (e.g. case sensitivity, letter accents like é vs e). It ensures correct alphabetical sorting according to local language conventions.'
    },
    {
      id: 'mgo-19',
      q: 'How does MongoDB handle indexing of array fields (Multikey Indexes)?',
      a: 'When an index is created on an array field (tags: ["tech", "news"]), MongoDB creates a Multikey index by indexing each distinct value in the array separately. Limitations: a compound index cannot contain more than one array field.'
    },
    {
      id: 'mgo-20',
      q: 'What are Mongoose Middleware (Hooks) and what types exist?',
      a: 'Mongoose middleware are functions passed control during the execution of asynchronous functions: 1) Document middleware (init, validate, save, remove). 2) Query middleware (find, updateOne). 3) Aggregate middleware. Pre hooks run before operations (e.g. hashing password before user.save()); post hooks run after operations.'
    },
    {
      id: 'mgo-21',
      q: 'What is Geospatial indexing in MongoDB (2dsphere vs 2d)?',
      a: '2dsphere indexes queries on an earth-like sphere using GeoJSON objects (Point, LineString, Polygon), supporting queries like $near, $geoWithin, and $geoIntersects. 2d indexes flat Euclidean coordinate planes.'
    },
    {
      id: 'mgo-22',
      q: 'What is the purpose of the explain("executionStats") method in MongoDB?',
      a: 'It details query execution statistics: totalDocsExamined vs nReturned, executionTimeMillis, and whether the query used an index (IXSCAN) or performed a slow collection scan (COLLSCAN).'
    },
    {
      id: 'mgo-23',
      q: 'How do you perform bulk write operations in MongoDB?',
      a: 'Use db.collection.bulkWrite([ ... ], { ordered: false }). It batches multiple insert, update, replace, and delete operations into a single network roundtrip to the server, dramatically improving write throughput.'
    },
    {
      id: 'mgo-24',
      q: 'What is the difference between $in and $or in MongoDB queries?',
      a: '$in performs equality checks for a single field against a list of values ({ status: { $in: ["A", "B"] } }) and utilizes single-field indexes efficiently. $or evaluates multiple different conditions across different fields.'
    },
    {
      id: 'mgo-25',
      q: 'What are Wildcard Indexes ($**) in MongoDB?',
      a: 'Wildcard indexes (createIndex({ "metadata.$**": 1 })) index all fields, sub-documents, and arrays within a dynamic or polymorphic sub-document where attribute names cannot be known in advance.'
    },
    {
      id: 'mgo-26',
      q: 'How do you handle schema validation in MongoDB natively without Mongoose?',
      a: 'MongoDB supports native JSON Schema validation at the database level using validator: { $jsonSchema: { bsonType: "object", required: ["email"], properties: { email: { bsonType: "string" } } } } defined when creating collections.'
    },
    {
      id: 'mgo-27',
      q: 'What is the MongoDB Write Conflict error and how is it handled?',
      a: 'A Write Conflict error occurs under WiredTiger when two concurrent transactions attempt to modify the same document simultaneously. One transaction succeeds while the other receives a write conflict and must be retried by the driver.'
    },
    {
      id: 'mgo-28',
      q: 'What are Partial Filter Indexes in MongoDB?',
      a: 'Partial filter indexes index only documents in a collection that meet a specified filter expression (partialFilterExpression: { rating: { $gt: 5 } }), saving index storage and speeding up write operations.'
    },
    {
      id: 'mgo-29',
      q: 'How does MongoDB Atlas handle automated backups and global clusters?',
      a: 'Atlas provides continuous point-in-time recovery (PITR) via snapshots, global multi-region clusters with zone sharding (pinning data to specific geographical regions for data sovereignty like GDPR), and auto-scaling tiers.'
    },
    {
      id: 'mgo-30',
      q: 'What is the difference between MongoDB findOneAndUpdate and updateOne?',
      a: 'updateOne updates matching documents and returns an acknowledgment object with matchedCount/modifiedCount. findOneAndUpdate atomically updates the document and returns the document itself (either pre-update or post-update via returnDocument: "after").'
    }
  ],

  // -------------------------------------------------------------
  // 2. REDIS & IN-MEMORY DATA STORES (30 Questions)
  // -------------------------------------------------------------
  redis: [
    {
      id: 'red-1',
      q: 'Why is Redis extremely fast and what is its single-threaded architecture model?',
      a: 'Redis stores all data directly in RAM (memory access is orders of magnitude faster than disk). Its core command execution is single-threaded, eliminating thread context switching and lock contention while handling tens of thousands of requests per second via I/O multiplexing (epoll/kqueue). In Redis 6+, multi-threading is used strictly for network I/O.'
    },
    {
      id: 'red-2',
      q: 'What are the core data structures supported by Redis?',
      a: '1) Strings (binary safe, up to 512MB). 2) Lists (linked lists for queues). 3) Sets (unordered unique elements). 4) Sorted Sets (ZSETs, scored elements for leaderboards). 5) Hashes (key-value maps for object storage). 6) Bitmaps. 7) HyperLogLogs (probabilistic cardinality). 8) Streams (append-only log).'
    },
    {
      id: 'red-3',
      q: 'What are the two persistence options in Redis: RDB vs AOF?',
      a: 'RDB (Redis Database): Point-in-time snapshots of dataset saved to disk at specified intervals (compact, fast recovery, but risks losing minutes of data on sudden crash). AOF (Append-Only File): Logs every write command sequentially. Recovering replays the log. AOF provides maximum durability (fsync every second) at the cost of larger file size.'
    },
    {
      id: 'red-4',
      q: 'What is the Cache Invalidation problem and common caching strategies?',
      a: '1) Cache-Aside (Lazy Loading): app reads cache; on miss, reads DB and populates cache. 2) Write-Through: writes update cache and DB synchronously. 3) Write-Behind (Write-Back): writes go to cache immediately and are flushed asynchronously to DB in batches. 4) Refresh-Ahead: background jobs refresh frequently read keys before expiration.'
    },
    {
      id: 'red-5',
      q: 'What is a Cache Stampede (Thundering Herd) and how do you prevent it in Redis?',
      a: 'Occurs when a high-traffic cache key expires and thousands of concurrent requests query the database at once. Solutions: 1) Distributed locking (Redlock) so only one thread recomputes the cache. 2) Probabilistic early expiration (XFetch). 3) Background cron refresh before key expires.'
    },
    {
      id: 'red-6',
      q: 'What is Cache Penetration vs Cache Breakdown vs Cache Avalanche?',
      a: 'Penetration: Queries for keys that do NOT exist in DB; queries hit DB every time (solution: cache null values or use Bloom Filters). Breakdown: A single hot key expires, overwhelming DB (solution: mutex lock). Avalanche: Thousands of keys expire at the exact same second, crashing DB (solution: add random jitter/variance to TTLs).'
    },
    {
      id: 'red-7',
      q: 'How does Redis Pub/Sub work and what are its limitations?',
      a: 'Pub/Sub allows publishers to broadcast messages to channels (PUBLISH channel msg) and subscribers to receive them (SUBSCRIBE channel). Limitation: messages are fire-and-forget; if a subscriber is offline, messages are lost permanently. For reliable messaging, use Redis Streams.'
    },
    {
      id: 'red-8',
      q: 'What is a Distributed Lock in Redis and how does Redlock algorithm work?',
      a: 'A distributed lock ensures only one node executes a critical section across a distributed cluster: SET lock_key unique_token NX PX 30000. Redlock acquires locks across N independent Redis nodes (e.g. 5 nodes) with a timeout; if acquired on majority (3/5) before timeout, lock is granted.'
    },
    {
      id: 'red-9',
      q: 'What are Redis Eviction Policies when memory limit (maxmemory) is reached?',
      a: '1) noeviction (returns error on writes). 2) allkeys-lru (removes least recently used keys). 3) volatile-lru (removes LRU among keys with TTL). 4) allkeys-lfu (removes least frequently used keys). 5) volatile-ttl (removes keys with shortest remaining TTL). 6) allkeys-random.'
    },
    {
      id: 'red-10',
      q: 'What is the difference between LRU and LFU eviction in Redis?',
      a: 'LRU (Least Recently Used) evicts keys based on time elapsed since last access (can prematurely evict a popular key accessed hours ago). LFU (Least Frequently Used) tracks access counts with a logarithmic decay counter, keeping consistently popular keys regardless of recent pauses.'
    },
    {
      id: 'red-11',
      q: 'What are Redis Transactions and how do MULTI, EXEC, and WATCH work?',
      a: 'MULTI starts a transaction block; subsequent commands are queued. EXEC executes all queued commands atomically. WATCH provides optimistic locking: if a watched key is modified by another client before EXEC, the transaction aborts and returns null.'
    },
    {
      id: 'red-12',
      q: 'How do Lua Scripts work in Redis and why are they atomic?',
      a: 'Redis executes Lua scripts (EVAL) directly in the engine. Because Redis is single-threaded, a Lua script executes with strict atomicity—no other client command can execute while a Lua script is running, making it ideal for custom atomic state transitions (e.g., token bucket rate limiters).'
    },
    {
      id: 'red-13',
      q: 'What is Redis Sentinel and what role does it play in High Availability?',
      a: 'Redis Sentinel monitors primary and replica instances, detects primary node failures, automatically performs failover by promoting a replica to primary, and reconfigures remaining replicas to follow the new primary, informing clients of the new address.'
    },
    {
      id: 'red-14',
      q: 'What is Redis Cluster and how does it partition data across 16,384 hash slots?',
      a: 'Redis Cluster provides horizontal sharding and high availability. The keyspace is divided into 16,384 hash slots. Every key is mapped to a slot using HASH_SLOT = CRC16(key) % 16384. Slots are distributed across master nodes.'
    },
    {
      id: 'red-15',
      q: 'What are Hash Tags ({...}) in Redis Cluster?',
      a: 'Hash tags force related keys into the exact same hash slot: user:{123}:profile and user:{123}:orders hash only the string inside braces ({123}). This enables multi-key operations (like MGET, transactions) on keys residing on the same node.'
    },
    {
      id: 'red-16',
      q: 'What are Redis Streams and Consumer Groups?',
      a: 'Redis Streams (XADD, XREAD) provide a persistent, append-only message log similar to Kafka. Consumer Groups (XREADGROUP, XACK) allow distributing message processing across multiple consumer workers with delivery acknowledgment.'
    },
    {
      id: 'red-17',
      q: 'What is HyperLogLog in Redis and when is it used?',
      a: 'HyperLogLog is a probabilistic data structure (PFADD, PFCOUNT) used to estimate unique cardinalities (e.g. unique daily website visitors) using a constant ~12KB of memory with a standard error of 0.81%, regardless of counting millions of unique items.'
    },
    {
      id: 'red-18',
      q: 'How do you implement a sliding window rate limiter in Redis?',
      a: 'Use a Redis Sorted Set (ZSET): ZADD key timestamp timestamp. Remove elements older than window: ZREMRANGEBYSCORE key 0 (now - window). Count remaining: ZCARD key. If count < limit, allow request; otherwise block.'
    },
    {
      id: 'red-19',
      q: 'What is Redis Pipelining and how does it reduce network latency?',
      a: 'Pipelining allows a client to send multiple commands to the Redis server in a single network packet without waiting for individual responses, reading all replies back in a single batch, drastically reducing round-trip time (RTT).'
    },
    {
      id: 'red-20',
      q: 'What is a Bloom Filter in Redis (RedisBloom)?',
      a: 'A Bloom filter is a space-efficient probabilistic data structure that tests whether an element is a member of a set. It returns either "possibly in set" or "definitely not in set", preventing database queries for non-existent keys (Cache Penetration).'
    },
    {
      id: 'red-21',
      q: 'What is the difference between EXPIRE, PEXPIRE, and PERSIST in Redis?',
      a: 'EXPIRE sets TTL in seconds. PEXPIRE sets TTL in milliseconds. PERSIST removes the timeout from a key, making it permanent.'
    },
    {
      id: 'red-22',
      q: 'What is the Big Key problem in Redis and how do you resolve it?',
      a: 'A Big Key is a key holding an excessively large value (e.g., a set or list with 1 million elements). Deleting or querying it blocks the single-threaded event loop for seconds. Solution: use UNLINK (async background deletion) instead of DEL, and paginate collections via SSCAN/HSCAN.'
    },
    {
      id: 'red-23',
      q: 'What are Bitmaps in Redis and what is a practical use case?',
      a: 'Bitmaps treat String values as arrays of bits (SETBIT, GETBIT, BITCOUNT). Ideal for tracking daily user activity: set bit user_id on key 2026-09-08. Checking total active users uses minimal memory (100 million users = ~12MB).'
    },
    {
      id: 'red-24',
      q: 'How does Redis handle master-replica synchronization (SYNC vs PSYNC)?',
      a: 'PSYNC (Partial Resynchronization) allows a disconnected replica to reconnect and request only the missing backlog buffer data without triggering a full expensive RDB snapshot transfer from the master.'
    },
    {
      id: 'red-25',
      q: 'What is the difference between HSET and SET for storing user profiles?',
      a: 'SET stores user profile as a serialized JSON string. HSET stores user fields as separate hash fields (hset user:1 name "Alice" age 30), allowing granular reading/writing of individual fields (HGET, HINCRBY) without transferring the entire object.'
    },
    {
      id: 'red-26',
      q: 'What is the SCAN command and why should you never use KEYS * in production?',
      a: 'KEYS * scans the entire database synchronously, blocking the single-threaded Redis server for seconds or minutes on millions of keys. SCAN is a cursor-based iterator that retrieves keys in incremental non-blocking batches.'
    },
    {
      id: 'red-27',
      q: 'How does Redis manage client connection limits and timeouts?',
      a: 'Configured via maxclients (default 10,000) and timeout (closes idle connections). Uses event loop file descriptor limits governed by the operating system ulimit -n.'
    },
    {
      id: 'red-28',
      q: 'What is the INFO command in Redis and what metrics are critical to monitor?',
      a: 'INFO returns server status and metrics. Critical metrics: used_memory, used_memory_rss, instantaneous_ops_per_sec, connected_clients, blocked_clients, evicted_keys, and rdb_last_bgsave_status.'
    },
    {
      id: 'red-29',
      q: 'What is Redis memory fragmentation ratio and how do you reduce it?',
      a: 'fragmentation_ratio = used_memory_rss / used_memory. A ratio > 1.5 indicates OS memory waste due to allocator fragmentation. Reduced by restarting nodes, upgrading memory allocators (Jemalloc), or enabling activedefrag yes.'
    },
    {
      id: 'red-30',
      q: 'How do you secure a Redis instance in production?',
      a: '1) Bind to private IP/VPC (bind 127.0.0.1). 2) Require strong authentication (AUTH password or ACLs). 3) Rename dangerous commands (rename-command FLUSHALL ""). 4) Enable TLS/SSL encryption for network traffic.'
    }
  ],

  // -------------------------------------------------------------
  // 3. KUBERNETES & CLOUD ORCHESTRATION (30 Questions)
  // -------------------------------------------------------------
  kubernetes: [
    {
      id: 'k8s-1',
      q: 'What is Kubernetes Control Plane architecture and its core components?',
      a: 'The Control Plane manages cluster state: 1) kube-apiserver: REST API gateway for cluster management. 2) etcd: consistent, distributed key-value store holding cluster state. 3) kube-scheduler: assigns pods to worker nodes based on resources. 4) kube-controller-manager: runs controllers (NodeController, DeploymentController). 5) cloud-controller-manager.'
    },
    {
      id: 'k8s-2',
      q: 'What are Worker Node components: kubelet, kube-proxy, and Container Runtime?',
      a: 'kubelet: node agent that communicates with apiserver and manages local pod lifecycles. Container Runtime (containerd, CRI-O): pulls images and runs containers. kube-proxy: maintains network packet filtering rules (iptables/IPVS) for Service routing.'
    },
    {
      id: 'k8s-3',
      q: 'What is a Pod in Kubernetes and why can multiple containers share a Pod?',
      a: 'A Pod is the smallest deployable computing unit in Kubernetes. Containers inside the same Pod share the same Network namespace (IP address and localhost port space), IPC namespace, and shared storage volumes (sidecar pattern).'
    },
    {
      id: 'k8s-4',
      q: 'Explain the 3 Kubernetes health probes: Liveness, Readiness, and Startup.',
      a: 'Startup Probe: verifies if container has finished initialization (delays liveness checks). Liveness Probe: detects if application is stuck or deadlocked; if it fails, kubelet restarts the container. Readiness Probe: detects if application is ready to accept traffic; if it fails, the pod IP is removed from Service endpoints.'
    },
    {
      id: 'k8s-5',
      q: 'What are the different types of Kubernetes Services: ClusterIP, NodePort, LoadBalancer, and ExternalName?',
      a: 'ClusterIP (default): Exposes Service on internal cluster-only IP. NodePort: Exposes Service on a static port (30000-32767) on every node’s IP. LoadBalancer: Provisions an external cloud load balancer (AWS NLB/ALB) that routes to NodePort. ExternalName: Maps Service to external CNAME record.'
    },
    {
      id: 'k8s-6',
      q: 'What is Kubernetes Ingress and how does an Ingress Controller work?',
      a: 'Ingress manages external HTTP/HTTPS routing to internal Services using path-based and host-based rules. An Ingress Controller (Nginx Ingress, Traefik) watches the Kubernetes API for Ingress resources and reconfigures its load balancing rules dynamically.'
    },
    {
      id: 'k8s-7',
      q: 'What is the difference between a Deployment, a StatefulSet, and a DaemonSet?',
      a: 'Deployment: Manages stateless replicas with rolling updates. StatefulSet: Manages stateful pods with ordered, graceful deployment, stable network IDs (pod-0, pod-1), and dedicated PersistentVolumes (ideal for databases). DaemonSet: Ensures exactly one copy of a pod runs on EVERY worker node (ideal for log collectors like Fluentd and node monitors).'
    },
    {
      id: 'k8s-8',
      q: 'What is Horizontal Pod Autoscaler (HPA) and how does it scale pods?',
      a: 'HPA automatically scales pod replica count up or down based on observed metrics (CPU utilization, memory, or custom Prometheus metrics). It queries the Metrics Server periodically and adjusts Deployment replicas via the formula: desiredReplicas = ceil(currentReplicas * (currentMetric / targetMetric)).'
    },
    {
      id: 'k8s-9',
      q: 'What are ConfigMaps and Secrets, and how are they injected into Pods?',
      a: 'ConfigMaps store non-sensitive configuration; Secrets store sensitive data (base64 encoded). Both can be injected into Pods as: 1) Environment variables (envFrom or env.valueFrom). 2) Mounted files inside a volume (volumeMounts).'
    },
    {
      id: 'k8s-10',
      q: 'What is PersistentVolume (PV), PersistentVolumeClaim (PVC), and StorageClass?',
      a: 'PV is a storage resource provisioned in the cluster (e.g. AWS EBS volume). PVC is a user’s request for storage (requesting size and access mode). StorageClass enables dynamic provisioning: when a user creates a PVC, the StorageClass automatically provisions the underlying cloud disk.'
    },
    {
      id: 'k8s-11',
      q: 'What is the Sidecar Pattern in Kubernetes?',
      a: 'The sidecar pattern deploys an auxiliary helper container inside the same Pod as the main application container to enhance its functionality without modifying main code (e.g., an Envoy proxy for service mesh, a log forwarder streaming logs, or a secrets sync agent).'
    },
    {
      id: 'k8s-12',
      q: 'What is RollingUpdate vs Recreate deployment strategy in Kubernetes?',
      a: 'RollingUpdate: Gradually replaces old pods with new pods with zero downtime, controlled by maxUnavailable and maxSurge parameters. Recreate: Terminates all existing pods before creating new pods (causes downtime, but prevents concurrent version conflicts).'
    },
    {
      id: 'k8s-13',
      q: 'What are Resource Requests and Limits (CPU and Memory)?',
      a: 'Requests: Minimum guaranteed resources used by scheduler to place pods on nodes. Limits: Maximum allowable resource threshold. If a pod exceeds CPU limit, it is throttled; if it exceeds memory limit, it is OOMKilled.'
    },
    {
      id: 'k8s-14',
      q: 'What are Namespaces in Kubernetes and what resources are NOT namespaced?',
      a: 'Namespaces provide logical virtual cluster isolation for multi-tenancy. Most objects (Pods, Services, Deployments) are namespaced. Cluster-scoped resources that are NOT namespaced include: Nodes, PersistentVolumes, StorageClasses, and Namespaces themselves.'
    },
    {
      id: 'k8s-15',
      q: 'What is Role-Based Access Control (RBAC) in Kubernetes?',
      a: 'RBAC regulates access to Kubernetes API resources using Roles (namespaced permissions) or ClusterRoles (cluster-wide permissions), bound to Users, Groups, or ServiceAccounts via RoleBindings or ClusterRoleBindings.'
    },
    {
      id: 'k8s-16',
      q: 'What are Network Policies in Kubernetes?',
      a: 'Network Policies control ingress and egress network traffic flow between Pods using IP addresses, ports, and label selectors, enforced by CNI plugins (Calico, Cilium) to achieve micro-segmentation.'
    },
    {
      id: 'k8s-17',
      q: 'What is Helm and what are Helm Charts?',
      a: 'Helm is the package manager for Kubernetes. Helm Charts are packages of pre-configured Kubernetes YAML templates with configurable values.yaml files, enabling versioned deployments and rollbacks.'
    },
    {
      id: 'k8s-18',
      q: 'What is a Kubernetes Operator and Custom Resource Definition (CRD)?',
      a: 'A CRD extends the Kubernetes API with custom resource types. An Operator is a custom controller that watches CRDs and automates complex operational knowledge (backups, failover, upgrades) for stateful applications like PostgreSQL or Kafka.'
    },
    {
      id: 'k8s-19',
      q: 'What are Taints, Tolerations, and Node Affinity?',
      a: 'Node Affinity attracts pods to specific nodes based on node labels. Taints allow nodes to repel sets of pods. Tolerations allow specific pods to schedule onto nodes with matching taints (e.g. dedicating GPU nodes to ML workloads).'
    },
    {
      id: 'k8s-20',
      q: 'What is PodDisruptionBudget (PDB)?',
      a: 'A PDB limits the number of pods of a replicated application that can be down simultaneously during voluntary disruptions (node maintenance, cluster upgrades), ensuring high availability.'
    },
    {
      id: 'k8s-21',
      q: 'How does Service Discovery work in Kubernetes using CoreDNS?',
      a: 'CoreDNS watches the Kubernetes API for Services and assigns them DNS records: service-name.namespace.svc.cluster.local. Pods resolve other services using standard DNS queries.'
    },
    {
      id: 'k8s-22',
      q: 'What are Init Containers in Kubernetes?',
      a: 'Init Containers run and complete sequentially before any application container starts in a Pod. Used for setup tasks like waiting for a database to be reachable or seeding initial config.'
    },
    {
      id: 'k8s-23',
      q: 'What happens when a Pod enters CrashLoopBackOff status?',
      a: 'CrashLoopBackOff means the container repeatedly starts, crashes, and restarts. Kubernetes adds an exponential backoff delay (10s, 20s, 40s... up to 5 mins) before trying to start the container again. Debug using kubectl logs --previous and kubectl describe pod.'
    },
    {
      id: 'k8s-24',
      q: 'What is the difference between a Job and a CronJob in Kubernetes?',
      a: 'A Job creates one or more pods and ensures a specified number successfully terminate (run-to-completion batch tasks). A CronJob runs Jobs on a repeating time-based schedule using standard cron expression syntax.'
    },
    {
      id: 'k8s-25',
      q: 'What is a Service Mesh (Istio / Linkerd)?',
      a: 'A Service Mesh injects sidecar proxies (Envoy) next to every application container to manage service-to-service communication, providing automatic mutual TLS (mTLS) encryption, traffic splitting (canary routing), rate limiting, and distributed tracing.'
    },
    {
      id: 'k8s-26',
      q: 'What is etcd and why is odd-numbered node sizing (3, 5) required for cluster quorum?',
      a: 'etcd is a strongly consistent distributed key-value store using the Raft consensus algorithm. Quorum requires (N/2) + 1 nodes. Odd numbers (3 or 5) maximize fault tolerance without adding unnecessary network synchronization overhead (3 nodes tolerate 1 failure; 4 nodes still tolerate only 1 failure).'
    },
    {
      id: 'k8s-27',
      q: 'What are Pod Security Standards (Privileged, Baseline, Restricted)?',
      a: 'Pod Security Standards enforce security levels via namespace labels: Privileged (unrestricted), Baseline (prevents known privilege escalations), and Restricted (hardens pods, enforces non-root user, drops Linux capabilities).'
    },
    {
      id: 'k8s-28',
      q: 'How do you perform a zero-downtime cluster node upgrade in Kubernetes?',
      a: '1) Cordon the node (kubectl cordon node-name) to prevent new pods from scheduling. 2) Drain the node (kubectl drain node-name --ignore-daemonsets) to evict existing pods respecting PDBs. 3) Upgrade node OS and kubelet. 4) Uncordon the node.'
    },
    {
      id: 'k8s-29',
      q: 'What is Kube-bench and CIS Kubernetes Benchmark?',
      a: 'Kube-bench checks whether Kubernetes is deployed securely according to the Center for Internet Security (CIS) benchmarks (inspecting apiserver flags, etcd file permissions, and kubelet settings).'
    },
    {
      id: 'k8s-30',
      q: 'How does kubectl port-forward work for debugging?',
      a: 'kubectl port-forward forwards connections from a local host port to a port on a remote Pod or Service inside the cluster over a secure API server tunnel, allowing developers to access internal databases without exposing public IPs.'
    }
  ],

  // -------------------------------------------------------------
  // 4. STAR BEHAVIORAL INTERVIEW SCENARIOS (30 Questions)
  // -------------------------------------------------------------
  star_behavioral: [
    {
      id: 'star-1',
      q: 'Tell me about a time you handled a critical production outage under high pressure.',
      a: 'Situation: During a Black Friday sale, our e-commerce checkout service began throwing 500 errors, causing a 60% revenue drop. Task: As lead engineer, I had to identify the root cause, restore service immediately, and communicate with stakeholders. Action: I initiated a war room, checked Datadog APM metrics, identified connection pool exhaustion in the primary database caused by an unindexed query, enabled a temporary read replica fallback, and deployed a targeted hotfix with an index within 22 minutes. Result: Checkout was fully restored, 99.9% uptime maintained for the rest of the sale, and I implemented an automated query performance audit in CI/CD.'
    },
    {
      id: 'star-2',
      q: 'Describe a situation where you had a strong technical disagreement with a teammate or lead.',
      a: 'Situation: Our team was choosing between GraphQL and REST for our mobile app rewrite. The lead preferred REST, while I advocated for GraphQL to solve over-fetching on slow cellular networks. Task: Reach consensus without delaying project timelines. Action: Instead of arguing opinions, I built two working prototypes measuring network payload sizes and round-trip latency, shared benchmark data, and demonstrated how GraphQL reduced mobile data usage by 65%. Result: The team adopted GraphQL for mobile endpoints, and the lead praised the data-driven approach.'
    },
    {
      id: 'star-3',
      q: 'Tell me about a time you had to deliver a project under an aggressive or unrealistic deadline.',
      a: 'Situation: A client required an MVP product launch in 4 weeks instead of the estimated 8 weeks. Task: Deliver a stable, valuable product on time without burning out the team. Action: I held a scoping session with product managers, used the MoSCoW prioritization method to defer non-essential features, leveraged battle-tested third-party auth (Auth0) and cloud templates, and ran daily 10-minute standups. Result: Delivered the core MVP 2 days ahead of deadline, acquiring 5,000 users in week one.'
    },
    {
      id: 'star-4',
      q: 'Describe a time when you made a serious mistake or pushed a bug to production.',
      a: 'Situation: I deployed a database migration that inadvertently dropped a column containing customer preference data. Task: Recover lost data and restore integrity. Action: I immediately alerted my team, restored the database from a 15-minute point-in-time recovery snapshot, backfilled the lost column data, and wrote a post-mortem blameless document. Result: No permanent data loss occurred, and I added pre-migration dry-run checks in GitHub Actions.'
    },
    {
      id: 'star-5',
      q: 'Tell me about a time you mentored a junior engineer or helped a struggling teammate.',
      a: 'Situation: A junior developer struggled with asynchronous JavaScript and was falling behind sprint deliverables. Task: Help them build confidence and improve code quality without doing the work for them. Action: I instituted 30-minute weekly pairing sessions, explained mental models of the event loop, reviewed PRs with constructive feedback, and provided small, incremental tasks. Result: Within 2 months, their velocity increased by 40%, and they successfully owned their first major feature release.'
    },
    {
      id: 'star-6',
      q: 'Give an example of a time you improved performance or reduced infrastructure costs.',
      a: 'Situation: Our cloud AWS bill increased by $12,000/month due to idle EC2 instances and unoptimized DynamoDB reads. Task: Reduce infrastructure spending by at least 25%. Action: I analyzed CloudWatch metrics, migrated legacy EC2 instances to Graviton ARM processors, introduced Redis caching for hot database keys, and set up auto-scaling policies. Result: Reduced monthly cloud expenditure by 38% ($4,500/month savings) while improving API p95 response time by 20%.'
    },
    {
      id: 'star-7',
      q: 'Tell me about a time you had to learn a completely new technology quickly.',
      a: 'Situation: Our team was tasked with building a real-time event streaming pipeline using Apache Kafka, which no one had worked with. Task: Master Kafka architecture and deliver the pipeline within 3 weeks. Action: I completed official documentation and hands-on courses over the weekend, built a local Docker-based sandbox, designed proof-of-concept producer/consumer scripts, and shared key architectural patterns with the team. Result: Delivered the pipeline on time, processing 50,000 events/sec with sub-second latency.'
    },
    {
      id: 'star-8',
      q: 'Describe a time when you had to make an important decision with incomplete information.',
      a: 'Situation: During a legacy system migration, user traffic patterns for an upcoming marketing blitz were unknown. Task: Architect a database scaling tier without exact traffic forecasts. Action: I designed a loosely coupled architecture with an Amazon SQS message buffer in front of workers, enabling the system to absorb traffic spikes without overwhelming the database. Result: When traffic surged 4x expected volume, zero requests were lost, and workers caught up within 15 minutes.'
    },
    {
      id: 'star-9',
      q: 'Tell me about a time you received difficult or critical feedback and how you handled it.',
      a: 'Situation: During a performance review, my manager noted that my pull requests were too large and difficult for peers to review, slowing team velocity. Task: Adapt my workflow to improve collaboration. Action: I accepted the feedback, researched small-batch development, broke down features into PRs under 250 lines, and created pull request templates with screenshots. Result: My PR review turnaround dropped from 3 days to under 4 hours, and teammates adopted the template.'
    },
    {
      id: 'star-10',
      q: 'Describe a time you proactively solved a problem before it escalated.',
      a: 'Situation: While reviewing system logs, I noticed database connection pool exhaustion warnings during peak hours, although no user-facing errors had occurred yet. Task: Address the bottleneck before a major crash happened. Action: I benchmarked query performance, added missing composite indexes, and implemented a connection pooler (PgBouncer). Result: Connection count dropped by 70%, preventing an outage during the company’s subsequent product announcement.'
    },
    {
      id: 'star-11',
      q: 'Tell me about a time you had to influence without formal authority.',
      a: 'Situation: Multiple engineering teams in our organization were writing inconsistent, duplicate REST API designs. Task: Establish company-wide API standardization without being a formal manager. Action: I drafted an open RFC document outlining REST conventions, held weekly office hours for feedback, and created a shared linting package that automated compliance. Result: 6 teams adopted the guidelines, reducing cross-team integration bugs by 50%.'
    },
    {
      id: 'star-12',
      q: 'Tell me about a time you had to deal with ambiguous requirements from a client or product team.',
      a: 'Situation: A product manager requested "a dashboard that shows intelligent user insights" with no specific metrics or wireframes. Task: Clarify requirements and deliver a measurable solution. Action: I scheduled a discovery meeting, asked targeted questions about user personas and business goals, built interactive clickable mockups in Figma, and iterated with stakeholders. Result: Defined 4 core KPIs that delivered value to executives on the first release.'
    },
    {
      id: 'star-13',
      q: 'Describe a time when you had to balance technical debt with delivering new features.',
      a: 'Situation: Our monolith had high technical debt, causing deployment failures and slowing feature velocity, but product managers wanted new features. Task: Negotiate a healthy balance between refactoring and feature delivery. Action: I calculated developer hours lost to build failures (15 hrs/week), presented the business case to leadership, and secured agreement on dedicating 20% of each sprint to debt reduction. Result: Reduced build failures to near zero and accelerated overall sprint velocity by 30% within three sprints.'
    },
    {
      id: 'star-14',
      q: 'Tell me about a time you worked with a difficult team member.',
      a: 'Situation: A senior developer on my team was frequently dismissive in code reviews and resistant to adopting new CI/CD standards. Task: Build a collaborative working relationship. Action: I scheduled a private 1-on-1 coffee chat, listened empathetically to their frustrations with past tooling changes, and asked for their direct input on shaping the new CI rules. Result: They felt respected, became an advocate for the tool, and our code review tone improved significantly.'
    },
    {
      id: 'star-15',
      q: 'Describe a project you are most proud of and why.',
      a: 'Situation: Our company lacked a unified design system, leading to inconsistent UI and duplicate CSS across 4 web apps. Task: Build an accessible, component-driven design system. Action: I spearheaded the project using React, TypeScript, and Storybook, ensuring full WCAG 2.1 AA accessibility compliance and publishing it as an internal npm package. Result: Reduced frontend development time by 35% across all 4 teams and won the company quarterly innovation award.'
    },
    {
      id: 'star-16',
      q: 'Tell me about a time you had to say "No" to a stakeholder or manager.',
      a: 'Situation: A client requested adding custom reporting features 2 days before a scheduled release, which would have compromised release stability. Task: Manage client expectations without damaging the relationship. Action: I explained the risk to system testing, demonstrated how a rushed release could cause data corruption, and offered an alternative: release the stable version on schedule and deploy the requested feature in a dedicated update the following week. Result: The client agreed, the launch was flawless, and the update followed smoothly.'
    },
    {
      id: 'star-17',
      q: 'Describe a time you navigated an unexpected technical blocker.',
      a: 'Situation: A third-party payment gateway API we depended on had an undocumented breaking change that crashed our staging environment. Task: Restore payment capabilities quickly. Action: I investigated HTTP responses, found the new required payload fields, submitted an urgent support ticket, and implemented a temporary adapter pattern in our service layer to transform data. Result: Staging was unblocked in 3 hours, and we met the launch date without customer impact.'
    },
    {
      id: 'star-18',
      q: 'Tell me about a time you took calculated technical risks.',
      a: 'Situation: Our relational database was struggling to keep up with live analytics during a sports event broadcast. Task: Improve throughput under tight time constraints. Action: I proposed caching query results in Redis with a 5-second TTL. While it introduced temporary 5-second data staleness, it reduced DB load by 85%. Result: The system handled 50,000 concurrent viewers with zero downtime, and users found the 5-second latency completely acceptable.'
    },
    {
      id: 'star-19',
      q: 'Describe an experience where you had to onboard into a complex legacy codebase.',
      a: 'Situation: I joined a project with an 8-year-old monolith with zero documentation and minimal test coverage. Task: Become productive and start fixing bugs within 2 weeks. Action: I read through existing PRs and commit history, drew architecture flow diagrams, wrote unit tests for bug-prone areas, and documented the setup process for future engineers. Result: Resolved my first production bug on day 6 and created the official onboarding documentation used by all future hires.'
    },
    {
      id: 'star-20',
      q: 'Tell me about a time you identified and resolved a security vulnerability.',
      a: 'Situation: During a routine code review, I noticed an endpoint querying user profiles using unsanitized string interpolation, exposing an SQL injection risk. Task: Remediate the vulnerability immediately and audit the rest of the codebase. Action: I refactored the query to use parameterized bindings, ran an automated static code analysis scan across the repo, and implemented automated SAST scanning in our CI pipeline. Result: Fixed the vulnerability before any breach occurred and prevented future vulnerabilities.'
    },
    {
      id: 'star-21',
      q: 'Give an example of a time you automated a manual process to save time.',
      a: 'Situation: Our QA team spent 4 hours every week manually running regression tests and deploying test builds. Task: Automate the test and deployment lifecycle. Action: I built a GitHub Actions workflow that automatically ran end-to-end Playwright tests on pull requests and deployed preview environments to AWS on merge. Result: Saved 16 hours of engineering time per month and caught 15 critical bugs before production.'
    },
    {
      id: 'star-22',
      q: 'Tell me about a time you had to manage competing priorities with tight deadlines.',
      a: 'Situation: I had to deliver a feature sprint commit while simultaneously resolving a critical bug for an enterprise customer. Task: Manage both deliverables without missing either. Action: I evaluated the customer impact with my manager, committed the first 4 hours to hotfixing the customer bug, and negotiated with my team to pair-program on the feature deliverables. Result: Hotfix deployed by noon, customer issue resolved, and sprint feature delivered on time.'
    },
    {
      id: 'star-23',
      q: 'Describe a situation where a project you worked on failed or was canceled.',
      a: 'Situation: After 3 months of building a recommendation engine, leadership pivoted company strategy, rendering the feature obsolete. Task: Handle the outcome constructively. Action: I conducted a retrospective to document lessons learned, extracted reusable microservices (like our caching layer), and cleanly archived the codebase. Result: Reusable modules accelerated our next project by 4 weeks.'
    },
    {
      id: 'star-24',
      q: 'Tell me about a time you received constructive feedback from code review and acted on it.',
      a: 'Situation: A peer reviewer noted that my algorithm had O(n^2) time complexity and suggested using a hash map. Task: Improve algorithm efficiency. Action: I analyzed their suggestion, refactored the logic using a Map data structure to achieve O(n) time complexity, and added benchmark tests demonstrating the 10x performance gain. Result: Gained a deeper appreciation for algorithmic review and thanked the reviewer publicly in our team channel.'
    },
    {
      id: 'star-25',
      q: 'Tell me about a time you went above and beyond your standard job duties.',
      a: 'Situation: Our customer support team was overwhelmed with manual requests to reset user accounts due to a legacy bug. Task: Reduce support ticket backlog. Action: On my own initiative during a hackathon, I built an internal self-service admin dashboard with proper audit logging. Result: Reduced support ticket volume by 30% and saved the support team 10+ hours per week.'
    },
    {
      id: 'star-26',
      q: 'Describe a situation where you had to adapt to a sudden change in leadership or strategy.',
      a: 'Situation: A new VP of Engineering joined and mandated a shift from Scrum to Kanban and a change in our cloud provider. Task: Maintain team morale and productivity during the transition. Action: I engaged positively, participated in migration planning, helped teammates adjust to the new Kanban board, and created step-by-step cloud migration guides. Result: Our team completed the migration 2 weeks ahead of all other teams.'
    },
    {
      id: 'star-27',
      q: 'Tell me about a time you helped resolve a conflict between two teammates.',
      a: 'Situation: Two frontend developers disagreed vehemently on whether to use Tailwind CSS or CSS Modules for a new project. Task: Resolve the impasse amicably. Action: I organized a design spike where each developer spent one day implementing a sample component, then facilitated a blameless evaluation based on developer experience, bundle size, and maintenance. Result: The team reached consensus on Tailwind CSS, and both engineers felt heard.'
    },
    {
      id: 'star-28',
      q: 'Describe a time you identified a flaw in a design or product specification.',
      a: 'Situation: A product specification required sending SMS OTPs on every user login, which would have cost the company over $50,000/month in SMS gateway fees. Task: Propose a cost-effective, secure alternative. Action: I presented an alternative: use email OTPs by default and remember trusted devices for 30 days using secure device fingerprinting. Result: Saved the company $40,000/month while maintaining multi-factor security.'
    },
    {
      id: 'star-29',
      q: 'Tell me about a time you handled a stressful situation with an external customer.',
      a: 'Situation: An enterprise customer called our support escalation line angry because their data sync failed during business hours. Task: De-escalate the situation and resolve their sync issue. Action: I listened patiently, validated their frustration, communicated clearly without technical jargon, identified an expired API token on their integration, and guided them through generating a new token. Result: Resolved in 20 minutes; the customer praised our team’s professionalism.'
    },
    {
      id: 'star-30',
      q: 'What motivates you as a software engineer and how do you stay current with tech?',
      a: 'Situation: Rapid advancements in web technologies require continuous learning. Task: Stay up-to-date and apply modern best practices. Action: I build side projects to test new tools (like Next.js 15, Vite, and Rust), contribute to open source, read technical engineering blogs (Netflix Tech Blog, Martin Fowler), and share learnings in team lunch-and-learns. Result: Consistently bring modern, battle-tested solutions to my engineering teams.'
    }
  ]
};

module.exports = {
  moreSubtypeQuestions
};
