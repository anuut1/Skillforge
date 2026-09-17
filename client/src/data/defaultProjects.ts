import type { ProjectItem } from '../types';

export interface ProjectCurriculumItem extends ProjectItem {
  domain: string;
  targetRoles: string[];
}

export const DEFAULT_PROJECTS: ProjectCurriculumItem[] = [
  {
    id: 'prj-banking-rest-api',
    title: 'Production Banking REST API with Spring Boot & PostgreSQL',
    description: 'Build a secure, scalable multi-currency banking system with transactional accounts, atomic fund transfers, JWT auth, and audit logging.',
    difficulty: 'Intermediate',
    technologies: JSON.stringify(['Java 21', 'Spring Boot 3', 'PostgreSQL', 'Docker', 'JWT']),
    requirements: JSON.stringify([
      'Atomic account transfers adhering to strict ACID transactional rollback guarantees',
      'Role-based access control (CUSTOMER, AUDITOR, ADMIN) with stateless JWT tokens',
      'Database indexing on transaction timestamps and sender/receiver foreign keys',
      'Centralized exception handler returning RFC 7807 Problem Details payload',
      'Unit test coverage (>80%) utilizing Mockito and JUnit 5'
    ]),
    milestones: JSON.stringify([
      'Milestone 1: Database schema, ER model, and Flyway migrations',
      'Milestone 2: User registration, password hashing, and authentication filter',
      'Milestone 3: Account ledger, deposit/withdrawal API with balance locks',
      'Milestone 4: Transaction transfer endpoint with @Transactional isolation',
      'Milestone 5: Docker compose and automated Postman test collection'
    ]),
    expectedOutcome: 'A deployable banking microservice capable of processing 100+ concurrent transfer transactions without race conditions.',
    relatedSkillName: 'Spring Boot & Microservices',
    domain: 'Backend Development',
    targetRoles: ['Backend Developer', 'Java Developer', 'Software Engineer']
  },
  {
    id: 'prj-expense-tracker',
    title: 'Full-Stack Distributed Expense & Budget Intelligence Platform',
    description: 'Create an intelligent financial dashboard featuring interactive expense tracking, recurring bills, receipt attachments, and monthly analytics visualizer.',
    difficulty: 'Beginner',
    technologies: JSON.stringify(['React', 'Node.js', 'Express', 'Tailwind CSS', 'PostgreSQL/SQLite']),
    requirements: JSON.stringify([
      'CRUD operations for income and expenses with customizable category tags',
      'Interactive charts rendering monthly expenditure breakdown by category',
      'Filtering by date ranges, amount thresholds, and payment methods',
      'Responsive layout optimized for mobile and desktop screens',
      'RESTful endpoints with token-based user isolation'
    ]),
    milestones: JSON.stringify([
      'Milestone 1: REST endpoints for transactions and categories',
      'Milestone 2: Frontend dashboard with KPI overview cards',
      'Milestone 3: Visual analytics with charts and category distribution',
      'Milestone 4: CSV/PDF export capability'
    ]),
    expectedOutcome: 'A production-ready web application providing responsive financial tracking.',
    relatedSkillName: 'React & Frontend State',
    domain: 'Full Stack Web Development',
    targetRoles: ['Full Stack Developer', 'Frontend Developer', 'Software Engineer']
  },
  {
    id: 'prj-distributed-task-queue',
    title: 'Distributed Asynchronous Task Queue & Job Scheduler',
    description: 'Engineer a distributed message worker queue using Redis, Node.js/Go, and WebSockets for real-time task status dispatching and retry handling.',
    difficulty: 'Advanced',
    technologies: JSON.stringify(['Node.js', 'Redis', 'WebSockets', 'Docker', 'PostgreSQL']),
    requirements: JSON.stringify([
      'Decoupled producer-consumer queue with Redis pub/sub and bullmq streams',
      'Exponential backoff retry with Dead Letter Queue (DLQ) for failed payloads',
      'Real-time WebSocket event streaming to client dashboards',
      'Worker auto-scaling simulation with concurrency semaphores',
      'Structured logging with correlation IDs'
    ]),
    milestones: JSON.stringify([
      'Milestone 1: Redis connection and job queue definitions',
      'Milestone 2: Worker processes and concurrency controls',
      'Milestone 3: DLQ error handling and exponential retries',
      'Milestone 4: Real-time status dashboard via WebSockets'
    ]),
    expectedOutcome: 'A resilient asynchronous execution engine processing 5,000+ jobs/min with automated failure isolation.',
    relatedSkillName: 'Microservices & Message Queues',
    domain: 'Systems & Backend Architecture',
    targetRoles: ['Backend Developer', 'Systems Engineer', 'Cloud / DevOps Engineer']
  },
  {
    id: 'prj-rag-knowledge-base',
    title: 'Enterprise RAG Search Engine with LangChain & Vector DB',
    description: 'Architect a Retrieval-Augmented Generation (RAG) assistant that indexes technical documentation, extracts vector embeddings, and answers queries with citations.',
    difficulty: 'Intermediate',
    technologies: JSON.stringify(['Python 3.11', 'FastAPI', 'LangChain', 'ChromaDB / Pinecone', 'OpenAI / Bedrock']),
    requirements: JSON.stringify([
      'Document chunking with recursive character splitters and token overlap',
      'Dense vector embedding generation using modern embedding models',
      'Hybrid semantic vector search + keyword BM25 re-ranking',
      'In-context citation attribution pointing to source document pages',
      'FastAPI REST server with streaming SSE token responses'
    ]),
    milestones: JSON.stringify([
      'Milestone 1: Ingestion pipeline for PDFs, Markdown, and TXT documents',
      'Milestone 2: Vector embedding and similarity indexing in ChromaDB',
      'Milestone 3: Prompt chain construction with source citations',
      'Milestone 4: Streaming API endpoint and test query suite'
    ]),
    expectedOutcome: 'A domain-specific search agent delivering sub-second answers grounded in uploaded enterprise knowledge bases.',
    relatedSkillName: 'Generative AI & LLM Engineering',
    domain: 'AI & Machine Learning',
    targetRoles: ['AI / ML Engineer', 'Data Scientist', 'Python Developer']
  },
  {
    id: 'prj-ecommerce-microservices',
    title: 'Cloud-Native E-Commerce Platform & Order Orchestrator',
    description: 'Build a distributed e-commerce backend with decoupled catalog, cart, checkout, payment webhook handlers, and inventory reservations.',
    difficulty: 'Advanced',
    technologies: JSON.stringify(['TypeScript', 'Node.js / Express', 'MongoDB / PostgreSQL', 'Docker', 'AWS S3']),
    requirements: JSON.stringify([
      'State machine order processing: Created -> Paid -> Shipped -> Completed',
      'Idempotent payment webhook consumption preventing duplicate charges',
      'Optimistic locking on inventory quantity during flash checkout peaks',
      'Full API documentation with Swagger/OpenAPI specifications',
      'Containerized development environment via Docker Compose'
    ]),
    milestones: JSON.stringify([
      'Milestone 1: Product catalog, SKU variations, and full-text search',
      'Milestone 2: Cart persistence and session cache with TTL expiration',
      'Milestone 3: Checkout transaction with payment intent integration',
      'Milestone 4: Webhook listener and order confirmation dispatch'
    ]),
    expectedOutcome: 'High-availability retail checkout pipeline prepared for high concurrency placement interviews.',
    relatedSkillName: 'Cloud Architecture & Web Services',
    domain: 'Full Stack Web Development',
    targetRoles: ['Full Stack Developer', 'Software Engineer', 'Backend Developer']
  },
  {
    id: 'prj-cloud-observability-pipeline',
    title: 'Cloud Infrastructure Monitoring & Telemetry Visualizer',
    description: 'Deploy an automated telemetry collector consuming real-time system metrics, error spikes, and container health with alert webhooks.',
    difficulty: 'Intermediate',
    technologies: JSON.stringify(['Go / Python', 'Prometheus', 'Grafana', 'Docker', 'AWS CloudWatch']),
    requirements: JSON.stringify([
      'P95/P99 latency calculations and anomaly detection thresholds',
      'Prometheus custom metrics exporter instrumentation',
      'Multi-channel webhook dispatching (Slack, Discord, PagerDuty)',
      'Automated health probe checking HTTP 200/500 service responses'
    ]),
    milestones: JSON.stringify([
      'Milestone 1: Metric scraper and system probe daemon',
      'Milestone 2: Grafana dashboard definitions as code',
      'Milestone 3: Alert rule engine with threshold dampening',
      'Milestone 4: Simulated load generator and chaos tests'
    ]),
    expectedOutcome: 'A complete SRE observability stack ready to demonstrate in DevOps and Infrastructure interviews.',
    relatedSkillName: 'DevOps, CI/CD & Observability',
    domain: 'DevOps & Cloud Engineering',
    targetRoles: ['Cloud / DevOps Engineer', 'Site Reliability Engineer', 'Software Engineer']
  }
];
