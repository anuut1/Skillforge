const fs = require('fs');

const coursesCatalog = [
  // CLOUD & CERTIFICATION
  {
    id: 'course-aws-fundamentals',
    title: 'AWS Cloud Fundamentals',
    description: 'Master Amazon Web Services foundational services: IAM security, VPC networking, EC2 compute, and S3 object storage with hands-on architecture diagrams.',
    category: 'Cloud',
    difficulty: 'Beginner',
    duration: '8 hours',
    isCertificationPrep: true,
    targetCertification: 'AWS Certified Cloud Practitioner (CLF-C02)',
    certDisclaimer: 'Preparation for External AWS Certification (Exam fee not included)',
    skills: ['AWS', 'IAM', 'EC2', 'S3', 'VPC', 'CloudWatch'],
    modulesCount: 6,
    lectures: [
      { id: 'aws-l1', title: 'Cloud Concepts, Shared Responsibility & Global Infrastructure', duration: 25 },
      { id: 'aws-l2', title: 'Identity & Access Management (IAM): Users, Roles & Least Privilege', duration: 40 },
      { id: 'aws-l3', title: 'Elastic Compute Cloud (EC2) & Auto Scaling Groups', duration: 50 },
      { id: 'aws-l4', title: 'Amazon S3 Storage Classes, Lifecycle Rules & Encryption', duration: 45 },
      { id: 'aws-l5', title: 'Virtual Private Cloud (VPC) Subnets, Route Tables & Security Groups', duration: 60 },
      { id: 'aws-l6', title: 'Monitoring & Auditing with CloudWatch & CloudTrail', duration: 35 }
    ]
  },
  {
    id: 'course-aws-practitioner-prep',
    title: 'AWS Cloud Practitioner Exam Prep & Practice Tests',
    description: 'Comprehensive preparation track for the AWS CLF-C02 exam with question breakdowns, billing management, and security compliance principles.',
    category: 'Certification Prep',
    difficulty: 'Intermediate',
    duration: '10 hours',
    isCertificationPrep: true,
    targetCertification: 'AWS Certified Cloud Practitioner (CLF-C02)',
    certDisclaimer: 'SkillForge Exam Preparation Curriculum aligned to the official AWS Exam Guide.',
    skills: ['AWS Governance', 'Billing & Cost Explorer', 'Well-Architected Framework', 'Security Compliance'],
    modulesCount: 5,
    lectures: [
      { id: 'awsp-l1', title: 'AWS Well-Architected Framework: The 6 Pillars', duration: 40 },
      { id: 'awsp-l2', title: 'AWS Billing, Budgets, and Cost Allocation Tags', duration: 35 },
      { id: 'awsp-l3', title: 'Database Offerings: RDS vs DynamoDB vs Aurora', duration: 45 },
      { id: 'awsp-l4', title: 'Application Integration: SQS, SNS, and EventBridge', duration: 40 },
      { id: 'awsp-l5', title: 'Exam Readiness & High-Probability Scenario Walkthroughs', duration: 60 }
    ]
  },
  {
    id: 'course-azure-fundamentals',
    title: 'Microsoft Azure Fundamentals (AZ-900) Preparation',
    description: 'Learn core Azure architectural components, management tools, virtual networks, blob storage, and identity integration with Microsoft Entra ID.',
    category: 'Cloud',
    difficulty: 'Beginner',
    duration: '7 hours',
    isCertificationPrep: true,
    targetCertification: 'Microsoft Certified: Azure Fundamentals (AZ-900)',
    certDisclaimer: 'Official Exam Preparation track. Independent certification earned through Microsoft Pearson VUE.',
    skills: ['Azure', 'Entra ID', 'Azure VMs', 'Resource Groups', 'Blob Storage'],
    modulesCount: 5,
    lectures: [
      { id: 'az-l1', title: 'Azure Architectural Components: Regions, Geographies & Resource Groups', duration: 30 },
      { id: 'az-l2', title: 'Azure Compute: VMs, App Services, and Azure Container Instances', duration: 45 },
      { id: 'az-l3', title: 'Azure Virtual Networks, VPN Gateways & ExpressRoute', duration: 40 },
      { id: 'az-l4', title: 'Security & Identity: Microsoft Entra ID & Zero Trust Architecture', duration: 45 },
      { id: 'az-l5', title: 'Governance, Azure Policy & Cost Management', duration: 30 }
    ]
  },
  {
    id: 'course-gcp-fundamentals',
    title: 'Google Cloud Fundamentals: Core Infrastructure',
    description: 'Explore GCP Compute Engine, Google Kubernetes Engine (GKE), BigQuery analytics, Cloud Storage, and VPC firewall networks.',
    category: 'Cloud',
    difficulty: 'Beginner',
    duration: '7 hours',
    isCertificationPrep: true,
    targetCertification: 'Google Cloud Digital Leader',
    certDisclaimer: 'Preparation for External Google Cloud Certification.',
    skills: ['Google Cloud', 'Compute Engine', 'GKE', 'BigQuery', 'Cloud Storage'],
    modulesCount: 5,
    lectures: [
      { id: 'gcp-l1', title: 'Introduction to Google Cloud Platform & Resource Hierarchy', duration: 25 },
      { id: 'gcp-l2', title: 'Compute Options: Compute Engine, Cloud Run & App Engine', duration: 45 },
      { id: 'gcp-l3', title: 'Containers and Google Kubernetes Engine (GKE)', duration: 50 },
      { id: 'gcp-l4', title: 'Cloud Storage & Cloud SQL Database Persistence', duration: 40 },
      { id: 'gcp-l5', title: 'BigQuery Big Data & IAM Access Control', duration: 40 }
    ]
  },
  {
    id: 'course-docker-fundamentals',
    title: 'Docker Fundamentals & Containerization',
    description: 'Learn container virtualization, writing multi-stage Dockerfiles, networking between containers, Docker Compose, and image security optimization.',
    category: 'DevOps',
    difficulty: 'Beginner',
    duration: '6 hours',
    isCertificationPrep: true,
    targetCertification: 'Docker Certified Associate (DCA)',
    certDisclaimer: 'Prepares learners for Docker certification competencies.',
    skills: ['Docker', 'Containers', 'Docker Compose', 'Dockerfiles', 'Microservices'],
    modulesCount: 5,
    lectures: [
      { id: 'dk-l1', title: 'Containerization vs Virtual Machines: Namespaces & cgroups', duration: 30 },
      { id: 'dk-l2', title: 'Writing Production-Grade Multi-Stage Dockerfiles', duration: 45 },
      { id: 'dk-l3', title: 'Docker Networking: Bridge, Host, and Overlay Networks', duration: 35 },
      { id: 'dk-l4', title: 'Orchestrating Multi-Container Applications with Docker Compose', duration: 45 },
      { id: 'dk-l5', title: 'Image Vulnerability Scanning and Container Registry Security', duration: 30 }
    ]
  },
  {
    id: 'course-kubernetes-fundamentals',
    title: 'Kubernetes Fundamentals (CKA / CKAD Prep)',
    description: 'Master Kubernetes cluster architecture: Pods, Deployments, Services, Ingress controllers, PersistentVolumes, and ConfigMaps.',
    category: 'DevOps',
    difficulty: 'Intermediate',
    duration: '12 hours',
    isCertificationPrep: true,
    targetCertification: 'Certified Kubernetes Administrator (CKA)',
    certDisclaimer: 'Rigorous hands-on preparation for Linux Foundation CKA/CKAD performance exams.',
    skills: ['Kubernetes', 'K8s Pods', 'Deployments', 'Ingress', 'Helm', 'ConfigMaps'],
    modulesCount: 6,
    lectures: [
      { id: 'k8s-l1', title: 'K8s Control Plane & Worker Node Internal Architecture', duration: 40 },
      { id: 'k8s-l2', title: 'Pods, ReplicaSets & Zero-Downtime Rolling Deployments', duration: 50 },
      { id: 'k8s-l3', title: 'ClusterIP, NodePort, and LoadBalancer Services', duration: 45 },
      { id: 'k8s-l4', title: 'Ingress NGINX & TLS Certificate Termination', duration: 45 },
      { id: 'k8s-l5', title: 'Storage Management: PV, PVC, and CSI StorageClasses', duration: 50 },
      { id: 'k8s-l6', title: 'Helm Package Management & Troubleshooting CrashLoopBackOff', duration: 55 }
    ]
  },

  // DEVELOPMENT
  {
    id: 'course-fullstack-web-dev',
    title: 'Full Stack Web Development with React & Node.js',
    description: 'Learn full-stack web development from scratch. Master HTML, CSS, JavaScript, React, Node.js, Express, and PostgreSQL with real-world architectures.',
    category: 'Development',
    difficulty: 'Intermediate',
    duration: '18 hours',
    isCertificationPrep: false,
    skills: ['React', 'Node.js', 'Express', 'PostgreSQL', 'REST APIs', 'JWT'],
    modulesCount: 6,
    lectures: [
      { id: 'fs-l1', title: 'Modern Full-Stack Architecture & Client-Server Contracts', duration: 35 },
      { id: 'fs-l2', title: 'State Management, Hooks & Responsive UI with React & Tailwind', duration: 55 },
      { id: 'fs-l3', title: 'Express.js Middleware Pipeline, Routing & Error Handling', duration: 45 },
      { id: 'fs-l4', title: 'Relational Modeling with PostgreSQL and Prisma ORM', duration: 50 },
      { id: 'fs-l5', title: 'Stateless Authentication with Access & Refresh JWT Tokens', duration: 40 },
      { id: 'fs-l6', title: 'Deploying Production Full-Stack Apps to Cloud Platforms', duration: 45 }
    ]
  },
  {
    id: 'course-react-mastery',
    title: 'React 19 & Next.js Production Engineering',
    description: 'Deep dive into React 19 actions, server components, compiler, state hooks, and scalable Next.js App Router applications.',
    category: 'Development',
    difficulty: 'Intermediate',
    duration: '10 hours',
    isCertificationPrep: false,
    skills: ['React 19', 'Next.js', 'Server Components', 'TypeScript', 'Tailwind CSS'],
    modulesCount: 5,
    lectures: [
      { id: 'rc-l1', title: 'React 19 Core: Compiler, use() hook, and Server Actions', duration: 45 },
      { id: 'rc-l2', title: 'Next.js 15 App Router: Layouts, Templates & Route Handlers', duration: 50 },
      { id: 'rc-l3', title: 'Client vs Server Components: Data Fetching and Streaming SSR', duration: 55 },
      { id: 'rc-l4', title: 'Optimistic UI Updates and Form Validation with Zod', duration: 40 },
      { id: 'rc-l5', title: 'Performance Tuning: Core Web Vitals, Dynamic Imports & Caching', duration: 45 }
    ]
  },
  {
    id: 'course-spring-boot-microservices',
    title: 'Spring Boot 3 & Microservices Architecture',
    description: 'Build enterprise distributed systems with Spring Boot, Spring Data JPA, Spring Security, Kafka messaging, and Eureka service discovery.',
    category: 'Development',
    difficulty: 'Advanced',
    duration: '14 hours',
    isCertificationPrep: false,
    skills: ['Java', 'Spring Boot', 'Microservices', 'Kafka', 'PostgreSQL', 'Docker'],
    modulesCount: 6,
    lectures: [
      { id: 'sb-l1', title: 'Spring Core: Inversion of Control & Dependency Injection Internals', duration: 40 },
      { id: 'sb-l2', title: 'Spring Data JPA: Entity Mappings, Transactions, and N+1 Fixes', duration: 50 },
      { id: 'sb-l3', title: 'Spring Security 6: OAuth2 Resource Server & JWT Validation', duration: 45 },
      { id: 'sb-l4', title: 'Event-Driven Microservices with Apache Kafka & Avro Schemas', duration: 60 },
      { id: 'sb-l5', title: 'API Gateway, Service Registry & Resilience4j Circuit Breakers', duration: 55 },
      { id: 'sb-l6', title: 'Observability: Distributed Tracing with Micrometer & Zipkin', duration: 45 }
    ]
  },
  {
    id: 'course-rest-api-design',
    title: 'Production REST API Design & Security',
    description: 'Master RESTful URI conventions, HTTP status semantics, versioning, pagination, rate-limiting, and OWASP API security.',
    category: 'Development',
    difficulty: 'Intermediate',
    duration: '6 hours',
    isCertificationPrep: false,
    skills: ['REST', 'API Security', 'HTTP', 'Rate Limiting', 'OpenAPI'],
    modulesCount: 4,
    lectures: [
      { id: 'rest-l1', title: 'REST Architectural Constraints & Proper Resource URI Modeling', duration: 35 },
      { id: 'rest-l2', title: 'Idempotency, HTTP Methods & Granular Status Code Semantics', duration: 40 },
      { id: 'rest-l3', title: 'Cursor-Based Pagination, Filtering & OpenAPI Documentation', duration: 45 },
      { id: 'rest-l4', title: 'OWASP API Top 10: Defending Against BOLA, BFLA & Injection', duration: 50 }
    ]
  },

  // PROGRAMMING
  {
    id: 'course-java-programming',
    title: 'Mastering Java & OOP for High-Scale Backends',
    description: 'Deep dive into modern Java (17/21): OOP principles, memory model, garbage collection, collections framework, and virtual threads.',
    category: 'Programming',
    difficulty: 'Intermediate',
    duration: '12 hours',
    isCertificationPrep: true,
    targetCertification: 'Oracle Certified Professional: Java SE Developer',
    certDisclaimer: 'Prepares candidates for Oracle Certified Professional Java SE exams.',
    skills: ['Java', 'OOP', 'Multithreading', 'Generics', 'JVM Internals'],
    modulesCount: 5,
    lectures: [
      { id: 'jv-l1', title: 'Object-Oriented Design Principles: SOLID in Practice', duration: 45 },
      { id: 'jv-l2', title: 'Java Collections Internals: HashMap Collisions & Red-Black Trees', duration: 50 },
      { id: 'jv-l3', title: 'Generics, Reflection & Functional Interfaces with Streams', duration: 45 },
      { id: 'jv-l4', title: 'Concurrency & Multithreading: Virtual Threads & Executors', duration: 60 },
      { id: 'jv-l5', title: 'JVM Memory Architecture: Heap, Stack & G1 Garbage Collector', duration: 55 }
    ]
  },
  {
    id: 'course-python-engineering',
    title: 'Python for Enterprise & Backend Automation',
    description: 'Master idiomatic Python, decorators, async IO, type hints, pytest testing suites, and high-performance algorithms.',
    category: 'Programming',
    difficulty: 'Beginner',
    duration: '8 hours',
    isCertificationPrep: false,
    skills: ['Python', 'AsyncIO', 'OOP', 'Unit Testing', 'Decorators'],
    modulesCount: 5,
    lectures: [
      { id: 'py-l1', title: 'Idiomatic Python, Comprehensions & Memory Model', duration: 35 },
      { id: 'py-l2', title: 'Generators, Iterators, and Custom Decorators', duration: 45 },
      { id: 'py-l3', title: 'Asynchronous Programming with asyncio & Coroutines', duration: 50 },
      { id: 'py-l4', title: 'Object-Oriented Python: Dunder Methods and Metaclasses', duration: 45 },
      { id: 'py-l5', title: 'Comprehensive Testing with pytest & Mocking Strategies', duration: 40 }
    ]
  },
  {
    id: 'course-cpp-systems',
    title: 'C++ Systems Programming & Memory Model',
    description: 'Learn modern C++ (C++17/20): manual memory management, RAII, pointers, templates, smart pointers, and multi-threading.',
    category: 'Programming',
    difficulty: 'Advanced',
    duration: '11 hours',
    isCertificationPrep: false,
    skills: ['C++', 'Pointers', 'RAII', 'Memory Management', 'STL'],
    modulesCount: 5,
    lectures: [
      { id: 'cpp-l1', title: 'Pointers, References & Memory Layout of Objects', duration: 45 },
      { id: 'cpp-l2', title: 'RAII and Smart Pointers: unique_ptr vs shared_ptr', duration: 50 },
      { id: 'cpp-l3', title: 'Move Semantics, Rvalue References & Rule of 5', duration: 55 },
      { id: 'cpp-l4', title: 'Standard Template Library (STL) Internals & Iterators', duration: 50 },
      { id: 'cpp-l5', title: 'C++ Concurrency: std::thread, Mutexes, and Condition Variables', duration: 60 }
    ]
  },

  // CORE COMPUTER SCIENCE
  {
    id: 'course-dsa-masterclass',
    title: 'Data Structures & Algorithms in Practice',
    description: 'Complete hands-on masterclass covering Big-O notation, Arrays, Linked Lists, Trees, Graphs, Sorting, and Dynamic Programming.',
    category: 'Core CS',
    difficulty: 'Intermediate',
    duration: '20 hours',
    isCertificationPrep: false,
    skills: ['DSA', 'Big-O', 'Algorithms', 'Data Structures', 'Problem Solving'],
    modulesCount: 7,
    lectures: [
      { id: 'dsa-l1', title: 'Asymptotic Analysis: Big-O, Big-Omega & Space Invariants', duration: 40 },
      { id: 'dsa-l2', title: 'Two Pointers & Sliding Window Patterns', duration: 50 },
      { id: 'dsa-l3', title: 'Binary Search Edge Cases & Monotonic Predicates', duration: 45 },
      { id: 'dsa-l4', title: 'Trees & BST Traversal: Recursive vs Iterative Stack DFS', duration: 55 },
      { id: 'dsa-l5', title: 'Graph Algorithms: BFS, DFS, Dijkstra & Topological Sort', duration: 65 },
      { id: 'dsa-l6', title: 'Dynamic Programming: Memoization vs Tabulation Patterns', duration: 70 },
      { id: 'dsa-l7', title: 'Monotonic Stacks, Priority Queues & Heap Operations', duration: 50 }
    ]
  },
  {
    id: 'course-dbms-sql-optimization',
    title: 'Relational Database Design & SQL Optimization',
    description: 'Master ER diagrams, normalization (1NF-BCNF), B-Tree indexing, query execution plans, transaction locks, and distributed storage.',
    category: 'Core CS',
    difficulty: 'Intermediate',
    duration: '9 hours',
    isCertificationPrep: false,
    skills: ['SQL', 'DBMS', 'Indexing', 'Query Optimization', 'Transactions'],
    modulesCount: 5,
    lectures: [
      { id: 'db-l1', title: 'Relational Modeling & Normalization: Eliminating Anomalies', duration: 40 },
      { id: 'db-l2', title: 'Deep Dive: B-Tree vs Hash vs GiST Index Mechanics', duration: 55 },
      { id: 'db-l3', title: 'Reading EXPLAIN ANALYZE & Eliminating Sequential Scans', duration: 50 },
      { id: 'db-l4', title: 'ACID Guarantees, MVCC (Multi-Version Concurrency) & Deadlocks', duration: 45 },
      { id: 'db-l5', title: 'Partitioning, Sharding & Read Replication Strategies', duration: 45 }
    ]
  },
  {
    id: 'course-os-concurrency',
    title: 'Operating Systems & System Architecture',
    description: 'Understand process scheduling, virtual memory, paging, cache coherency, deadlocks, and system calls with concrete Linux examples.',
    category: 'Core CS',
    difficulty: 'Intermediate',
    duration: '8 hours',
    isCertificationPrep: false,
    skills: ['Operating Systems', 'Processes', 'Threads', 'Virtual Memory', 'Linux'],
    modulesCount: 5,
    lectures: [
      { id: 'os-l1', title: 'Process Lifecycle, Context Switching & CPU Scheduling', duration: 40 },
      { id: 'os-l2', title: 'Virtual Memory, Page Tables, TLB & Page Faults', duration: 50 },
      { id: 'os-l3', title: 'Thread Concurrency, Race Conditions, Semaphores & Mutexes', duration: 55 },
      { id: 'os-l4', title: 'Deadlock Detection, Prevention & Banker Algorithm', duration: 40 },
      { id: 'os-l5', title: 'File Systems, Inodes, Buffer Cache & Linux Syscalls', duration: 45 }
    ]
  },
  {
    id: 'course-computer-networks',
    title: 'Computer Networks & TCP/IP Protocol Suite',
    description: 'Explore OSI 7 layers, TCP 3-way handshake, flow control, DNS resolution, TLS 1.3 encryption, HTTP/2 & HTTP/3 QUIC.',
    category: 'Core CS',
    difficulty: 'Intermediate',
    duration: '8 hours',
    isCertificationPrep: false,
    skills: ['Networking', 'TCP/IP', 'DNS', 'TLS/HTTPS', 'HTTP/3'],
    modulesCount: 5,
    lectures: [
      { id: 'net-l1', title: 'OSI vs TCP/IP Models: Packets, Frames & Encapsulation', duration: 35 },
      { id: 'net-l2', title: 'TCP Connection Lifecycle, Window Scaling & Congestion Control', duration: 50 },
      { id: 'net-l3', title: 'DNS Resolution Hierarchy & Anycast Routing', duration: 40 },
      { id: 'net-l4', title: 'Transport Layer Security (TLS 1.3) Handshake & Encryption', duration: 45 },
      { id: 'net-l5', title: 'HTTP Evolution: HTTP/1.1 vs HTTP/2 Multiplexing vs HTTP/3 QUIC', duration: 50 }
    ]
  },

  // AI / ML
  {
    id: 'course-ml-fundamentals',
    title: 'Machine Learning Fundamentals with Scikit-Learn',
    description: 'Learn practical supervised and unsupervised ML: regression, classification, clustering, cross-validation, and feature scaling.',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    duration: '10 hours',
    isCertificationPrep: false,
    skills: ['Machine Learning', 'Python', 'Scikit-Learn', 'Feature Engineering'],
    modulesCount: 5,
    lectures: [
      { id: 'ml-l1', title: 'Supervised Learning: Linear & Logistic Regression', duration: 40 },
      { id: 'ml-l2', title: 'Decision Trees, Random Forests & Gradient Boosting', duration: 55 },
      { id: 'ml-l3', title: 'Unsupervised Learning: K-Means Clustering & PCA', duration: 45 },
      { id: 'ml-l4', title: 'Feature Scaling, Imputation & Cross-Validation Strategies', duration: 40 },
      { id: 'ml-l5', title: 'Model Evaluation Metrics: Precision, Recall, F1 & ROC-AUC', duration: 45 }
    ]
  },
  {
    id: 'course-genai-llm-apps',
    title: 'Generative AI & LLM Application Development',
    description: 'Build modern AI applications: Prompt engineering, Retrieval-Augmented Generation (RAG), vector embeddings, LangChain, and function calling.',
    category: 'AI/ML',
    difficulty: 'Intermediate',
    duration: '9 hours',
    isCertificationPrep: false,
    skills: ['Generative AI', 'LLMs', 'RAG', 'Vector DBs', 'LangChain', 'Prompt Engineering'],
    modulesCount: 5,
    lectures: [
      { id: 'genai-l1', title: 'Transformer Architecture & Foundation Model Capabilities', duration: 40 },
      { id: 'genai-l2', title: 'System Prompt Engineering, Few-Shot In-Context Learning', duration: 45 },
      { id: 'genai-l3', title: 'Retrieval-Augmented Generation (RAG) Architecture', duration: 55 },
      { id: 'genai-l4', title: 'Vector Embeddings, Cosine Similarity & Vector Databases', duration: 45 },
      { id: 'genai-l5', title: 'Tool / Function Calling & Autonomous Agent Loops', duration: 50 }
    ]
  },

  // PLACEMENT
  {
    id: 'course-dsa-interview-prep',
    title: 'FAANG DSA Interview Sprint & Pattern Mastery',
    description: 'High-yield interview prep mastering the top 14 algorithmic patterns: two pointers, fast/slow, sliding window, topological sort, and DP.',
    category: 'Placement',
    difficulty: 'Advanced',
    duration: '15 hours',
    isCertificationPrep: false,
    skills: ['Interview Prep', 'LeetCode Patterns', 'FAANG Problem Solving', 'Time Complexity'],
    modulesCount: 6,
    lectures: [
      { id: 'dsaip-l1', title: 'How FAANG Engineers Think: Clarifying Questions & Trade-Offs', duration: 35 },
      { id: 'dsaip-l2', title: 'Pattern 1-3: Sliding Window, Two Pointers & Fast/Slow Pointer', duration: 60 },
      { id: 'dsaip-l3', title: 'Pattern 4-6: Merge Intervals, Cyclic Sort & In-Place Reversal', duration: 55 },
      { id: 'dsaip-l4', title: 'Pattern 7-9: Two Heaps, Subsets & Modified Binary Search', duration: 60 },
      { id: 'dsaip-l5', title: 'Pattern 10-12: Top K Elements, K-way Merge & Knapsack DP', duration: 65 },
      { id: 'dsaip-l6', title: 'Mock Technical Interview Live Walkthrough & Clean Coding', duration: 50 }
    ]
  },
  {
    id: 'course-system-design-interview',
    title: 'High-Throughput Distributed System Design',
    description: 'Master System Design interview fundamentals: CDN caching, consistent hashing, load balancing, replication, CAP theorem, and rate limiters.',
    category: 'Placement',
    difficulty: 'Advanced',
    duration: '12 hours',
    isCertificationPrep: false,
    skills: ['System Design', 'Scalability', 'Distributed Systems', 'Caching', 'Load Balancing'],
    modulesCount: 6,
    lectures: [
      { id: 'sd-l1', title: 'Foundations: Vertical vs Horizontal Scaling, Latency vs Throughput', duration: 40 },
      { id: 'sd-l2', title: 'Consistent Hashing, Sharding & CAP Theorem in Production', duration: 50 },
      { id: 'sd-l3', title: 'Caching Strategies: Write-Through vs Write-Back vs Cache-Aside', duration: 45 },
      { id: 'sd-l4', title: 'Designing a Distributed Rate Limiter (Token Bucket / Sliding Log)', duration: 55 },
      { id: 'sd-l5', title: 'Designing a Scalable URL Shortener (TinyURL Architecture)', duration: 50 },
      { id: 'sd-l6', title: 'Designing a High-Scale News Feed Architecture (Fan-out on Read/Write)', duration: 60 }
    ]
  },
  {
    id: 'course-behavioral-interview',
    title: 'Behavioral & Leadership Principles Interview Mastery',
    description: 'Master the STAR method for behavioral rounds at Amazon, Google, Meta, and Microsoft. Articulate conflict resolution, ownership, and failure.',
    category: 'Placement',
    difficulty: 'Beginner',
    duration: '4 hours',
    isCertificationPrep: false,
    skills: ['Behavioral Interview', 'STAR Method', 'Leadership Principles', 'Communication'],
    modulesCount: 3,
    lectures: [
      { id: 'beh-l1', title: 'The STAR Method (Situation, Task, Action, Result) Framework', duration: 35 },
      { id: 'beh-l2', title: 'Structuring High-Impact Stories: Failure, Disagreements & Ownership', duration: 45 },
      { id: 'beh-l3', title: 'Executive Presence, Confidence & Asking Strategic Interviewer Questions', duration: 30 }
    ]
  }
];

const courseFileContent = `export interface CourseCatalogItem {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  duration: string;
  isCertificationPrep: boolean;
  targetCertification?: string;
  certDisclaimer?: string;
  skills: string[];
  modulesCount: number;
  lectures: { id: string; title: string; duration: number }[];
}

export const COURSE_CATEGORIES: string[] = [
  'All',
  'Programming',
  'DSA',
  'Core CS',
  'Development',
  'Cloud',
  'AI/ML',
  'DevOps',
  'Placement',
  'Certification Prep'
];

export const COURSES_CATALOG: CourseCatalogItem[] = ${JSON.stringify(coursesCatalog, null, 2)};
`;

fs.writeFileSync('src/data/courseCatalog.ts', courseFileContent, 'utf-8');
console.log('Successfully generated courseCatalog.ts with ' + coursesCatalog.length + ' comprehensive courses.');

