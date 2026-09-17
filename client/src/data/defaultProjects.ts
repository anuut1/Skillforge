import type { ProjectItem } from '../types';

export const DEFAULT_PROJECTS: ProjectItem[] = [
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
    relatedSkillName: 'Spring Boot & Microservices'
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
    relatedSkillName: 'React & Frontend State'
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
    relatedSkillName: 'Microservices & Message Queues'
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
    relatedSkillName: 'Generative AI & LLM Engineering'
  }
];
