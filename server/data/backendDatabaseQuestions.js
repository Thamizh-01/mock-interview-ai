/**
 * Backend, Database & DevOps Interview Questions
 * Sub-types:
 * Python Backend (30), Java Spring (30),
 * PostgreSQL / SQL (30), MongoDB (30), Redis (30),
 * Docker (30), Kubernetes (30), AWS Cloud (30)
 */

const backendDatabaseQuestions = {
  // -------------------------------------------------------------
  // 1. PYTHON BACKEND (Django / FastAPI) (30 Questions)
  // -------------------------------------------------------------
  python_backend: [
    {
      id: 'py-1',
      q: 'What is the Global Interpreter Lock (GIL) in CPython and how does it impact concurrency?',
      a: 'The GIL is a mutex that prevents multiple native OS threads from executing Python bytecodes at once inside CPython. It ensures thread-safe memory management (reference counting). While it allows seamless multi-threading for I/O-bound tasks (network requests, DB queries) because threads release the GIL while waiting for I/O, it prevents multi-threaded CPU-bound programs from utilizing multiple CPU cores. For CPU parallelism, use multiprocessing or external worker processes (Celery).'
    },
    {
      id: 'py-2',
      q: 'Explain the difference between WSGI and ASGI in Python web frameworks.',
      a: 'WSGI (Web Server Gateway Interface, e.g. Gunicorn with Django/Flask) is a synchronous specification: one request per worker thread/process. ASGI (Asynchronous Server Gateway Interface, e.g. Uvicorn with FastAPI) supports asynchronous async/await concurrency, WebSockets, background tasks, and HTTP/2 on a single event loop process.'
    },
    {
      id: 'py-3',
      q: 'What are Python Decorators and how do you write a decorator that accepts arguments?',
      a: 'Decorators are functions that take another function as an argument, extend its behavior without modifying it, and return a new function. A decorator with arguments requires three nested functions: def repeat(num): def decorator(func): def wrapper(*args, **kwargs): for _ in range(num): func(*args, **kwargs); return wrapper; return decorator. Use functools.wraps to preserve original function name and docstring.'
    },
    {
      id: 'py-4',
      q: 'How does FastAPI achieve high performance and automatic documentation?',
      a: 'FastAPI runs on Starlette (high-performance ASGI toolkit) and uses Pydantic for data validation and serialization based on standard Python type hints. Because endpoints specify type hints, FastAPI automatically generates interactive OpenAPI documentation (/docs with Swagger UI and /redoc) and validates request bodies before handlers execute.'
    },
    {
      id: 'py-5',
      q: 'What are Python Generators and what is the difference between yield and return?',
      a: 'Generators produce a sequence of values lazily on-demand using yield instead of computing them all upfront in memory. return terminates a function and returns a single final value. yield pauses function state, emits a value to the caller, and resumes where it left off on the next iteration (via next()), using O(1) memory for arbitrarily large datasets.'
    },
    {
      id: 'py-6',
      q: 'Explain Django ORM select_related versus prefetch_related for query optimization.',
      a: 'Both prevent the N+1 query problem. select_related performs an SQL JOIN in a single query; it works only for single-valued relationships (ForeignKey and OneToOneField). prefetch_related executes a separate query for each relationship and performs joining in Python memory; it works for many-to-many and reverse foreign key relationships.'
    },
    {
      id: 'py-7',
      q: 'What is Celery and how does it work with Redis or RabbitMQ for background tasks?',
      a: 'Celery is an asynchronous distributed task queue for Python. The web application dispatches tasks (task.delay(args)) to a Message Broker (RabbitMQ or Redis). Separate background Celery worker processes consume messages from the broker, execute long-running tasks (sending emails, video transcoding, PDF generation), and store results in a Result Backend.'
    },
    {
      id: 'py-8',
      q: 'What are Python Context Managers and the __enter__ and __exit__ magic methods?',
      a: 'Context managers allocate and release resources safely using the with statement (e.g. with open("file.txt") as f:). __enter__() sets up the resource and returns the bound target. __exit__(exc_type, exc_val, exc_tb) handles cleanup (closing files, releasing locks) even if an exception is raised inside the block.'
    },
    {
      id: 'py-9',
      q: 'What is the difference between *args and **kwargs in Python function parameters?',
      a: '*args collects positional arguments into a tuple. **kwargs collects keyword arguments (named parameters) into a dictionary. They allow defining flexible functions with variable numbers of arguments.'
    },
    {
      id: 'py-10',
      q: 'How does Python garbage collection work (Reference Counting vs Cyclic GC)?',
      a: 'CPython’s primary GC is Reference Counting: every object tracks how many references point to it. When an object’s refcount drops to zero, its memory is deallocated immediately. To resolve cyclic references (Object A references B, B references A), Python includes an auxiliary generational cyclic garbage collector (gc module) that detects circular graphs across three generations.'
    },
    {
      id: 'py-11',
      q: 'What is Dependency Injection in FastAPI and how does Depends work?',
      a: 'FastAPI has a built-in Dependency Injection system using Depends(). Dependencies are reusable functions (e.g., getting DB sessions, checking auth tokens, validating headers) declared in route parameters. FastAPI resolves and executes dependencies before calling the route handler and handles cleanup via yield.'
    },
    {
      id: 'py-12',
      q: 'Explain the difference between deepcopy and copy in Python.',
      a: 'copy.copy() creates a shallow copy: it constructs a new collection but populates it with references to the original objects. copy.deepcopy() recursively clones the collection and all nested objects, creating completely independent data structures.'
    },
    {
      id: 'py-13',
      q: 'What are Metaclasses in Python and when would you use one?',
      a: 'A metaclass is the "class of a class"—it defines how classes are constructed and instantiated (type is the default metaclass). Metaclasses intercept class creation to enforce constraints, register subclasses automatically, or dynamically inject methods (used heavily in Django models and Pydantic).'
    },
    {
      id: 'py-14',
      q: 'How do you handle database migrations in Django versus FastAPI (Alembic)?',
      a: 'Django has a built-in migration system (python manage.py makemigrations and migrate) that inspects models.py and creates versioned migration scripts. In FastAPI (with SQLAlchemy), Alembic is used to generate migration revisions (alembic revision --autogenerate -m "add user") and apply schema changes (alembic upgrade head).'
    },
    {
      id: 'py-15',
      q: 'What is the difference between is and == in Python?',
      a: '== checks for equality of value (calls __eq__ method). is checks for object identity (verifies whether both variables point to the exact same memory address using id()). Always use is when comparing to None (x is None).'
    },
    {
      id: 'py-16',
      q: 'How does asyncio event loop work in Python?',
      a: 'asyncio provides an event loop that runs cooperative tasks. When an async coroutine hits an await expression (e.g. await db.fetch()), it yields control back to the event loop, which switches to run another pending task while waiting for the I/O event to signal completion.'
    },
    {
      id: 'py-17',
      q: 'What are Pydantic models in FastAPI and how do they differ from dataclasses?',
      a: 'Python dataclasses primarily store data without strict type enforcement. Pydantic models perform runtime parsing, type coercion, and strict schema validation: if an integer is passed as string "123", Pydantic parses it to int 123; if an invalid type is provided, it raises detailed ValidationError.'
    },
    {
      id: 'py-18',
      q: 'What is Method Resolution Order (MRO) and C3 Linearization in Python?',
      a: 'MRO defines the order in which Python searches for attributes and methods across complex multiple inheritance class hierarchies. Python uses the C3 Linearization algorithm to ensure monotonicity and consistency. You can inspect any class’s order using ClassName.__mro__.'
    },
    {
      id: 'py-19',
      q: 'What are Python slots (__slots__) and why do they save memory?',
      a: 'By default, Python instances store attributes in a dynamic dictionary (__dict__), which consumes significant RAM. Defining __slots__ = ("name", "age") allocates a fixed-size array for attributes instead of a dictionary, speeding attribute access and reducing memory consumption by up to 40-50% for millions of objects.'
    },
    {
      id: 'py-20',
      q: 'How do you structure database sessions with SQLAlchemy in a web application?',
      a: 'Use scoped_session or async sessionmaker with context managers. In FastAPI, define a get_db() dependency that yields a session and ensures session.close() is executed in a finally block after the request completes, preventing database connection leaks.'
    },
    {
      id: 'py-21',
      q: 'What is the purpose of Django middleware and what are process_request and process_response?',
      a: 'Django middleware is a framework of hooks into Django’s request/response cycle. Each middleware intercepts requests before view execution (authentication, sessions, CSRF checks) and can modify responses or headers before sending them to the client.'
    },
    {
      id: 'py-22',
      q: 'How do you prevent SQL injection in Python database applications?',
      a: 'Always use parameterized queries or ORMs (SQLAlchemy, Django ORM). Never concatenate or format raw user input strings directly into SQL queries (cursor.execute("SELECT * FROM users WHERE id = %s", (user_id,))).'
    },
    {
      id: 'py-23',
      q: 'What is the difference between threading, multiprocessing, and asyncio in Python?',
      a: 'threading uses OS threads; subject to GIL, suitable for I/O-bound tasks. multiprocessing spawns separate OS processes with independent GILs and memory spaces, suitable for CPU-bound tasks. asyncio uses single-threaded cooperative multitasking with an event loop, offering high concurrency for massive I/O.'
    },
    {
      id: 'py-24',
      q: 'What is the difference between list comprehensions and generator expressions?',
      a: 'List comprehension ([x*2 for x in data]) computes and stores the entire list in memory immediately. Generator expression ((x*2 for x in data)) returns a generator object that computes items on demand, using negligible memory.'
    },
    {
      id: 'py-25',
      q: 'How do you implement caching in Django using Redis?',
      a: 'Configure CACHES in settings.py using django-redis backend. Use @cache_page(60 * 15) decorator for view caching, or use low-level cache API: cache.get("key") and cache.set("key", value, timeout=300).'
    },
    {
      id: 'py-26',
      q: 'What is the difference between classmethod, staticmethod, and regular instance methods?',
      a: 'Instance methods take self as the first argument to access instance state. @classmethod takes cls as the first argument to access class state (used for factory constructors). @staticmethod takes neither self nor cls; it behaves like a regular function grouped inside the class namespace.'
    },
    {
      id: 'py-27',
      q: 'How does Python handle package imports and what does __init__.py do?',
      a: '__init__.py marks a directory as a Python package, allowing its modules to be imported. It can define package-level initialization code and export public symbols via __all__.'
    },
    {
      id: 'py-28',
      q: 'What is monkey patching in Python and why should it be used with caution?',
      a: 'Monkey patching is dynamically modifying a module, class, or method at runtime. While useful for mocking in unit tests, doing it in production code causes hidden side effects, breaks type checkers, and makes debugging difficult.'
    },
    {
      id: 'py-29',
      q: 'What is Pytest and what are fixtures and parameterize?',
      a: 'Pytest is a testing framework for Python. @pytest.fixture provides reusable setup and teardown dependencies for test functions. @pytest.mark.parametrize allows running a single test function with multiple input datasets and expected outcomes.'
    },
    {
      id: 'py-30',
      q: 'How do you profile memory and execution time in Python applications?',
      a: 'Use cProfile (python -m cProfile -s time script.py) to identify slow functions, snakeviz for interactive flamegraphs, and memory_profiler (@profile decorator) to measure line-by-line memory usage.'
    }
  ],

  // -------------------------------------------------------------
  // 2. DOCKER & CONTAINERS (30 Questions)
  // -------------------------------------------------------------
  docker: [
    {
      id: 'doc-1',
      q: 'What is the difference between a Docker Image and a Docker Container?',
      a: 'A Docker Image is an immutable, read-only template composed of layered file systems built from a Dockerfile. A Docker Container is a running instance of an image that adds a thin writable layer on top, executing in an isolated process namespace.'
    },
    {
      id: 'doc-2',
      q: 'How does Docker Layer Caching work and how do you optimize a Dockerfile for cache hits?',
      a: 'Each instruction in a Dockerfile (COPY, RUN) creates an immutable layer. Docker reuses cached layers if the instruction and its input files have not changed. Optimize by ordering commands from least frequently changed to most frequently changed: copy package.json and run npm install BEFORE copying application source code.'
    },
    {
      id: 'doc-3',
      q: 'What are Multi-Stage Builds in Docker and why are they critical?',
      a: 'Multi-stage builds use multiple FROM lines in one Dockerfile. One stage compiles code using heavy SDKs and build tools, and the final production stage copies only the compiled binaries/assets into a minimal base image (like Alpine or Distroless), reducing image size from 1GB+ down to ~50MB and shrinking attack surface.'
    },
    {
      id: 'doc-4',
      q: 'What is the difference between CMD and ENTRYPOINT in a Dockerfile?',
      a: 'ENTRYPOINT sets the default command that will always run when the container starts. CMD provides default arguments to the ENTRYPOINT, which can be overridden by passing arguments on the command line (docker run image [args]).'
    },
    {
      id: 'doc-5',
      q: 'What are the different types of Docker storage: Volumes, Bind Mounts, and tmpfs?',
      a: 'Volumes are managed entirely by Docker in host storage (/var/lib/docker/volumes); they are isolated from the host file system and are best for database persistence. Bind Mounts map an arbitrary host directory directly into the container (ideal for live development). tmpfs mounts in host system memory only (fast, non-persistent).'
    },
    {
      id: 'doc-6',
      q: 'Explain Docker Networking modes: bridge, host, none, and overlay.',
      a: 'Bridge (default): Private internal network with port mapping (-p 8080:80). Host: Container shares host network stack directly (no isolation, fastest performance). None: Container has no network access. Overlay: Multi-host network connecting containers across different Docker Swarm / Kubernetes nodes with encryption.'
    },
    {
      id: 'doc-7',
      q: 'What are Linux Namespaces and cgroups, and how do they enable Docker containerization?',
      a: 'Namespaces provide isolation (PID isolates process trees, NET isolates network interfaces, MNT isolates file systems, IPC isolates memory). cgroups (Control Groups) enforce resource limits and metering (restricting maximum CPU cores, RAM limits, and disk I/O per container).'
    },
    {
      id: 'doc-8',
      q: 'What is a .dockerignore file and why is it important?',
      a: '.dockerignore excludes files and folders (node_modules, .git, .env, build artifacts) from being copied into the Docker build context, speeding up image build times and preventing accidental leakage of secret keys.'
    },
    {
      id: 'doc-9',
      q: 'Why should you avoid running containers as the root user?',
      a: 'By default, containers run as root (UID 0). If an attacker exploits a container breakout vulnerability, they gain root access to the underlying host system. Best practice: create a non-privileged user (USER appuser) in the Dockerfile.'
    },
    {
      id: 'doc-10',
      q: 'What is Docker Compose and what are its key features?',
      a: 'Docker Compose is a tool for defining and running multi-container Docker applications using a YAML file (docker-compose.yml). It manages container creation, shared bridge networks, persistent volumes, environment variables, and startup dependencies (depends_on).'
    },
    {
      id: 'doc-11',
      q: 'What is Docker health check (HEALTHCHECK instruction)?',
      a: 'HEALTHCHECK tells Docker how to test if the application inside the container is actually working (HEALTHCHECK --interval=30s --timeout=3s CMD curl -f http://localhost:8080/health || exit 1). Orchestrators use health status to restart unhealthy containers or take them out of load balancers.'
    },
    {
      id: 'doc-12',
      q: 'How do you pass environment variables to Docker containers?',
      a: '1) At runtime with -e KEY=VAL. 2) Using an environment file with --env-file .env. 3) In docker-compose.yml under environment or env_file. 4) Static defaults inside Dockerfile using ENV.'
    },
    {
      id: 'doc-13',
      q: 'What is the difference between docker stop and docker kill?',
      a: 'docker stop sends SIGTERM to the main process (PID 1), giving the application a grace period (default 10s) to perform graceful shutdown before sending SIGKILL. docker kill sends SIGKILL immediately, terminating the process without cleanup.'
    },
    {
      id: 'doc-14',
      q: 'What is the PID 1 zombie reaping problem in Docker containers?',
      a: 'In Linux, PID 1 is responsible for reaping orphaned zombie child processes. If a containerized application (like Node.js) runs as PID 1 and does not properly reap zombie processes, child processes accumulate and exhaust system PIDs. Solution: use an init process like tini (docker run --init).'
    },
    {
      id: 'doc-15',
      q: 'What is the difference between ARG and ENV in a Dockerfile?',
      a: 'ARG defines build-time variables (e.g. build version) available only during docker build. ENV defines runtime environment variables that persist inside the built image and are accessible when the container runs.'
    },
    {
      id: 'doc-16',
      q: 'How do you scan Docker images for security vulnerabilities?',
      a: 'Use tools like Trivy, Snyk, or Docker Scout (docker scout cves image:tag). They analyze OS packages and application dependencies against known CVE databases.'
    },
    {
      id: 'doc-17',
      q: 'How do you limit container CPU and memory usage in Docker?',
      a: 'Use flags: --memory="512m" (sets max RAM) and --cpus="1.5" (limits to 1.5 CPU cores). If a container exceeds its memory limit, Linux OOM killer terminates it with exit code 137.'
    },
    {
      id: 'doc-18',
      q: 'What is the Docker daemon (dockerd) and how does the Docker CLI interact with it?',
      a: 'dockerd is the persistent background service that manages images, containers, networks, and storage. The Docker CLI is a client that communicates with dockerd over a REST API via Unix socket (/var/run/docker.sock) or TCP.'
    },
    {
      id: 'doc-19',
      q: 'What is a distroless container image?',
      a: 'Distroless images (created by Google) contain only your application and runtime dependencies (like Node or Python), omitting package managers, shells (sh/bash), and OS utilities. This drastically reduces attack surface and image size.'
    },
    {
      id: 'doc-20',
      q: 'How does Docker handle port forwarding (-p vs -P)?',
      a: '-p hostPort:containerPort explicitly binds a specific host port to a container port (e.g. -p 80:3000). -P (publish all) maps all exposed container ports to random high-numbered ports on the host.'
    },
    {
      id: 'doc-21',
      q: 'What is the difference between COPY and ADD in a Dockerfile?',
      a: 'COPY copies files and directories from host to container. ADD has two extra features: 1) It can auto-extract local tar archives. 2) It can download files from remote URLs. Best practice is to use COPY for predictability unless auto-extraction is specifically needed.'
    },
    {
      id: 'doc-22',
      q: 'What is Docker BuildKit and what advantages does it offer?',
      a: 'BuildKit (DOCKER_BUILDKIT=1) is Docker’s modern build engine. Features: parallel stage execution, secret mounts (RUN --mount=type=secret), SSH forwarding, and advanced cache backends.'
    },
    {
      id: 'doc-23',
      q: 'How do you clean up unused Docker resources to free disk space?',
      a: 'Run docker system prune -a --volumes. It removes all stopped containers, unused networks, dangling and unused images, and build cache.'
    },
    {
      id: 'doc-24',
      q: 'What are container registries and how does docker login authenticate?',
      a: 'Registries (Docker Hub, AWS ECR, GitHub Container Registry) store and distribute images. docker login authenticates and stores credentials in ~/.docker/config.json using base64 or credential helpers.'
    },
    {
      id: 'doc-25',
      q: 'How do you inspect container logs in Docker?',
      a: 'docker logs [options] container_id. Options: -f (stream live logs), --tail 100 (show last 100 lines), -t (add timestamps). Docker captures stdout and stderr emitted by PID 1.'
    },
    {
      id: 'doc-26',
      q: 'What is the difference between virtualization (Hypervisor) and containerization?',
      a: 'Hypervisors (VMware, VirtualBox) emulate hardware and run complete Guest Operating Systems with their own kernels. Containerization shares the host OS kernel, providing process-level isolation with near-zero overhead and instantaneous startup.'
    },
    {
      id: 'doc-27',
      q: 'How do you execute a command inside a running container?',
      a: 'docker exec -it container_name /bin/bash (or sh). -i keeps STDIN open, -t allocates a pseudo-TTY for interactive terminal access.'
    },
    {
      id: 'doc-28',
      q: 'What is the purpose of the EXPOSE instruction in a Dockerfile?',
      a: 'EXPOSE documents which network ports the container listens on at runtime. It functions as documentation between image author and operator; it does not actually publish the port unless -P is passed.'
    },
    {
      id: 'doc-29',
      q: 'What is Docker Content Trust (DCT)?',
      a: 'DCT uses digital signatures to verify the integrity and publisher of images pulled from registries (DOCKER_CONTENT_TRUST=1), preventing man-in-the-middle attacks.'
    },
    {
      id: 'doc-30',
      q: 'How do you share local files into a container for hot-reload during development?',
      a: 'Use bind mounts in Docker Compose: volumes: - ./src:/app/src. Edits made on the host machine reflect immediately inside the container, triggering nodemon or Vite HMR.'
    }
  ],

  // -------------------------------------------------------------
  // 3. POSTGRESQL & SQL (30 Questions)
  // -------------------------------------------------------------
  sql_postgres: [
    {
      id: 'sql-1',
      q: 'What is ACID in relational databases and how does PostgreSQL implement it?',
      a: 'Atomicity (all or nothing), Consistency (preserves constraints), Isolation (concurrent safety), Durability (persisted on crash). PostgreSQL implements ACID using Write-Ahead Logging (WAL) for Durability/Atomicity and Multi-Version Concurrency Control (MVCC) for Isolation.'
    },
    {
      id: 'sql-2',
      q: 'Explain Multi-Version Concurrency Control (MVCC) in PostgreSQL.',
      a: 'In PostgreSQL, readers never block writers and writers never block readers. When an UPDATE occurs, PostgreSQL creates a new version of the row with xmin (transaction creation ID) and xmax (deletion transaction ID) metadata instead of overwriting in-place. Vacuuming periodically cleans dead rows.'
    },
    {
      id: 'sql-3',
      q: 'What are SQL Window Functions and how do they differ from GROUP BY?',
      a: 'GROUP BY aggregates rows into a single row. Window functions (ROW_NUMBER(), RANK(), DENSE_RANK(), LAG(), LEAD() OVER (PARTITION BY ... ORDER BY ...)) perform calculations across a set of table rows while preserving each individual row in the output.'
    },
    {
      id: 'sql-4',
      q: 'What is the difference between B-Tree, GIN, and GiST indexes in PostgreSQL?',
      a: 'B-Tree (default): Best for comparison operators (=, <, >, BETWEEN) on scalar data. GIN (Generalized Inverted Index): Best for composite data like full-text search, arrays, and JSONB containment (@>). GiST: Best for geometric, spatial (PostGIS), and range data types.'
    },
    {
      id: 'sql-5',
      q: 'What is the purpose of EXPLAIN ANALYZE in PostgreSQL?',
      a: 'EXPLAIN displays the query execution plan generated by the cost-based optimizer (sequential scan, index scan, hash join). ANALYZE actually executes the query and compares estimated row counts/costs with real execution times and buffer hits.'
    },
    {
      id: 'sql-6',
      q: 'What are the 4 Transaction Isolation Levels in SQL and what anomalies do they prevent?',
      a: '1) Read Uncommitted (dirty reads). 2) Read Committed (prevents dirty reads; default in Postgres). 3) Repeatable Read (prevents non-repeatable reads). 4) Serializable (prevents phantom reads and serialization anomalies by simulating sequential execution).'
    },
    {
      id: 'sql-7',
      q: 'What is VACUUM in PostgreSQL and why is Autovacuum necessary?',
      a: 'Due to MVCC, deleted or updated rows remain on disk as dead tuples. VACUUM reclaims dead tuple space for future writes, updates table statistics for the query planner, and prevents transaction ID wraparound. Autovacuum runs maintenance tasks automatically in the background.'
    },
    {
      id: 'sql-8',
      q: 'What is the difference between JSON and JSONB data types in PostgreSQL?',
      a: 'JSON stores data as exact text representation (fast writes, slower queries, preserves whitespace/key order). JSONB parses data into decomposed binary format (slower writes, much faster queries, supports indexing with GIN).'
    },
    {
      id: 'sql-9',
      q: 'What is Database Normalization (1NF, 2NF, 3NF, BCNF) and when should you denormalize?',
      a: 'Normalization organizes tables to reduce redundancy and avoid insertion/deletion anomalies: 1NF: Atomic values, unique rows. 2NF: 1NF + no partial key dependencies. 3NF: 2NF + no transitive dependencies. Denormalize for read-heavy OLAP analytics where frequent joins cause unacceptable latency.'
    },
    {
      id: 'sql-10',
      q: 'What is a Common Table Expression (CTE) and recursive CTE?',
      a: 'A CTE (WITH cte_name AS (...)) creates a temporary named result set within a single SQL statement for readability. Recursive CTEs self-reference to query hierarchical and graph data (organizational charts, nested category trees).'
    },
    {
      id: 'sql-11',
      q: 'What is the difference between INNER JOIN, LEFT JOIN, RIGHT JOIN, and FULL OUTER JOIN?',
      a: 'INNER JOIN: returns matching rows from both tables. LEFT JOIN: returns all rows from left table and matched rows from right. RIGHT JOIN: returns all rows from right table. FULL OUTER JOIN: returns all rows from both tables, filling unmatched fields with NULL.'
    },
    {
      id: 'sql-12',
      q: 'What is Write-Ahead Logging (WAL) in PostgreSQL?',
      a: 'WAL records all changes to disk sequentially before data pages are written to disk. On crash recovery, PostgreSQL replays WAL records to restore database integrity to the last committed transaction.'
    },
    {
      id: 'sql-13',
      q: 'What is Connection Pooling (PgBouncer) and why is it necessary for PostgreSQL?',
      a: 'PostgreSQL uses a process-per-connection model. Creating thousands of direct connections exhausts server RAM and CPU context switching. PgBouncer pools and reuses connections across requests, allowing thousands of clients to share a smaller pool of active connections.'
    },
    {
      id: 'sql-14',
      q: 'How does Table Partitioning work in PostgreSQL (Range, List, Hash)?',
      a: 'Partitioning splits large tables into smaller physical tables (partitions) based on a key (e.g. date range, region). The query planner uses partition pruning to scan only relevant partitions, dramatically improving query performance on massive tables.'
    },
    {
      id: 'sql-15',
      q: 'What is a Partial Index and a Composite Index in PostgreSQL?',
      a: 'Composite Index: indexes multiple columns together (CREATE INDEX ON orders(user_id, created_at)). Partial Index: indexes only rows that satisfy a WHERE clause (CREATE INDEX ON orders(user_id) WHERE status = "active"), saving space and speed.'
    },
    {
      id: 'sql-16',
      q: 'What is the difference between UNION and UNION ALL in SQL?',
      a: 'UNION combines results from two queries and performs an expensive sort operation to remove duplicate rows. UNION ALL combines results without removing duplicates, making it significantly faster when duplicates are impossible or acceptable.'
    },
    {
      id: 'sql-17',
      q: 'What are Database Triggers and Stored Procedures in PostgreSQL?',
      a: 'Stored Procedures (PL/pgSQL) are reusable functions executed inside the database engine that can manage transactions (COMMIT/ROLLBACK). Triggers automatically execute a function in response to events (INSERT, UPDATE, DELETE) on a table.'
    },
    {
      id: 'sql-18',
      q: 'What is the difference between DELETE, TRUNCATE, and DROP in SQL?',
      a: 'DELETE: DML operation, deletes rows one by one, fires triggers, can be filtered with WHERE, slow on large tables. TRUNCATE: DDL operation, deallocates entire table data pages at once, resets identity counters, fast, cannot filter. DROP: removes data and table schema completely.'
    },
    {
      id: 'sql-19',
      q: 'How do you handle Upsert (INSERT ON CONFLICT DO UPDATE) in PostgreSQL?',
      a: 'INSERT INTO users(id, name, visits) VALUES (1, "Alice", 1) ON CONFLICT (id) DO UPDATE SET visits = users.visits + 1, name = EXCLUDED.name;. Atomically inserts or updates without race conditions.'
    },
    {
      id: 'sql-20',
      q: 'What is a Foreign Key constraint with CASCADE vs RESTRICT vs SET NULL?',
      a: 'ON DELETE CASCADE: deleting parent row automatically deletes all related child rows. RESTRICT: prevents deletion of parent row if child rows exist. SET NULL: sets foreign key column in child rows to NULL when parent is deleted.'
    },
    {
      id: 'sql-21',
      q: 'What is a Materialized View in PostgreSQL and how is it refreshed?',
      a: 'A Materialized View stores the computed result of a query physically on disk. Unlike a standard view, it does not re-run on query. It is refreshed manually or on schedule: REFRESH MATERIALIZED VIEW CONCURRENTLY view_name.'
    },
    {
      id: 'sql-22',
      q: 'What is the difference between HAVING and WHERE clauses in SQL?',
      a: 'WHERE filters rows BEFORE grouping and aggregation. HAVING filters grouped rows AFTER aggregation functions (SUM, COUNT) have been applied.'
    },
    {
      id: 'sql-23',
      q: 'How does PostgreSQL handle Full Text Search (tsvector and tsquery)?',
      a: 'PostgreSQL parses text into normalized lexemes using to_tsvector() and matches search expressions using to_tsquery() with the @@ match operator. Pairing this with a GIN index enables sub-millisecond search across millions of documents.'
    },
    {
      id: 'sql-24',
      q: 'What are Advisory Locks in PostgreSQL?',
      a: 'Advisory locks are application-defined locks managed by PostgreSQL (pg_advisory_lock(id)) that have no direct association with database tables. Useful for distributed task scheduling and cluster leader election.'
    },
    {
      id: 'sql-25',
      q: 'What is Point-In-Time Recovery (PITR) in PostgreSQL?',
      a: 'PITR combines a base physical backup with archived WAL logs to restore a database to the exact millisecond before a disastrous event occurred (e.g. an accidental DROP TABLE).'
    },
    {
      id: 'sql-26',
      q: 'What is the difference between CHAR, VARCHAR, and TEXT in PostgreSQL?',
      a: 'In PostgreSQL, all three use the same underlying storage engine and have identical performance. CHAR pads with spaces. VARCHAR(n) enforces character limits. TEXT has no limit and is preferred for arbitrary strings.'
    },
    {
      id: 'sql-27',
      q: 'How do you prevent Deadlocks in PostgreSQL?',
      a: 'Deadlocks occur when transactions wait on locks held by each other in circular fashion. Prevention: 1) Always acquire locks on multiple tables/rows in the exact same consistent order. 2) Keep transactions short. 3) Use optimistic locking.'
    },
    {
      id: 'sql-28',
      q: 'What is Sequence in PostgreSQL and how does SERIAL/IDENTITY work?',
      a: 'A sequence is a thread-safe counter generator (nextval()). SERIAL creates an integer column linked to an auto-incrementing sequence. Modern PostgreSQL recommends standard SQL syntax: id INT GENERATED ALWAYS AS IDENTITY.'
    },
    {
      id: 'sql-29',
      q: 'What is the difference between NULLS FIRST and NULLS LAST in SQL ordering?',
      a: 'By default, PostgreSQL sorts NULLs as greater than all values (appearing last in ASC, first in DESC). Explicitly adding NULLS FIRST or NULLS LAST controls where missing data appears in sorted pagination.'
    },
    {
      id: 'sql-30',
      q: 'What are Generated (Computed) Columns in PostgreSQL?',
      a: 'Generated columns compute values automatically from other columns in the same row (CREATE TABLE orders(price NUMERIC, qty INT, total NUMERIC GENERATED ALWAYS AS (price * qty) STORED)). Stored generated columns can be indexed.'
    }
  ]
};

module.exports = {
  backendDatabaseQuestions
};
