import type { Quiz } from '../types';

export interface PlacementSubjectInfo {
  id: string;
  quizId: string;
  category: 'CS_FUNDAMENTALS' | 'SYSTEM_DESIGN' | 'APTITUDE';
  subject: string;
  topic: string;
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced';
  questionCount: number;
  description: string;
}

export const PLACEMENT_SUBJECTS: PlacementSubjectInfo[] = [
  // CS FUNDAMENTALS
  {
    id: 'subj-dbms',
    quizId: 'quiz-dbms',
    category: 'CS_FUNDAMENTALS',
    subject: 'DBMS',
    topic: 'Relational DBs, B+ Trees, ACID, Indexing & Normalization',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'B+ Tree index mechanics, ACID guarantees, WAL recovery, concurrency locks, and normalization rules.'
  },
  {
    id: 'subj-os',
    quizId: 'quiz-os',
    category: 'CS_FUNDAMENTALS',
    subject: 'Operating Systems',
    topic: 'Paging, Virtual Memory, Deadlocks & Thread Concurrency',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Coffman deadlock conditions, page fault handling, TLB caching, process scheduling, and semaphores.'
  },
  {
    id: 'subj-networks',
    quizId: 'quiz-networks',
    category: 'CS_FUNDAMENTALS',
    subject: 'Computer Networks',
    topic: 'TCP/IP Handshake, DNS, HTTP/2 & Routing Protocols',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'TCP 3-way handshake, TIME_WAIT state, application layer DNS, socket multiplexing, and routing loop prevention.'
  },
  {
    id: 'subj-oop',
    quizId: 'quiz-oop',
    category: 'CS_FUNDAMENTALS',
    subject: 'Object-Oriented Programming',
    topic: 'SOLID Principles, Polymorphism & Design Patterns',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Liskov Substitution, runtime vtable dynamic dispatch, composition vs inheritance, and design patterns.'
  },
  {
    id: 'subj-dsa',
    quizId: 'quiz-dsa-fundamentals',
    category: 'CS_FUNDAMENTALS',
    subject: 'Data Structures',
    topic: 'Binary Heaps, Balanced Trees, Tries & Graph Representations',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Heap invariant properties, Red-Black tree bounds, Trie prefix lookups, and graph adjacency traversal.'
  },
  {
    id: 'subj-arch',
    quizId: 'quiz-computer-architecture',
    category: 'CS_FUNDAMENTALS',
    subject: 'Computer Architecture',
    topic: 'Instruction Pipelining, Cache Coherence & Memory Hierarchy',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'CPU pipelining hazards, L1/L2/L3 cache coherence (MESI), branch prediction, and memory hierarchy.'
  },
  {
    id: 'subj-se',
    quizId: 'quiz-software-engineering',
    category: 'CS_FUNDAMENTALS',
    subject: 'Software Engineering',
    topic: 'Clean Architecture, CI/CD, Testing Pyramids & Refactoring',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Test-driven development, integration testing pyramids, CI/CD automated gates, and microservice coupling.'
  },
  {
    id: 'subj-sql',
    quizId: 'quiz-sql-mastery',
    category: 'CS_FUNDAMENTALS',
    subject: 'SQL & Query Optimization',
    topic: 'Window Functions, CTEs, Joins & Execution Plans',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'ROW_NUMBER vs DENSE_RANK, covering indexes, nested loop vs hash joins, and query plan diagnostics.'
  },

  // SYSTEM DESIGN
  {
    id: 'subj-sd-beg',
    quizId: 'quiz-system-design-beginner',
    category: 'SYSTEM_DESIGN',
    subject: 'System Design: Beginner',
    topic: 'Horizontal Scaling, Reverse Proxies, Stateless APIs & DNS',
    difficulty: 'Beginner',
    questionCount: 5,
    description: 'Client-server separation, stateless tier architectures, Nginx reverse proxy routing, and horizontal autoscaling.'
  },
  {
    id: 'subj-sd-int',
    quizId: 'quiz-system-design',
    category: 'SYSTEM_DESIGN',
    subject: 'System Design: Intermediate',
    topic: 'Consistent Hashing, Redis Caching, CAP Theorem & Rate Limiting',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Consistent hashing virtual rings, distributed cache eviction, CAP trade-offs, and Token Bucket rate limiting.'
  },
  {
    id: 'subj-sd-adv',
    quizId: 'quiz-system-design-advanced',
    category: 'SYSTEM_DESIGN',
    subject: 'System Design: Advanced',
    topic: 'Distributed Consensus (Raft), Event Sourcing, Sagas & CQRS',
    difficulty: 'Advanced',
    questionCount: 5,
    description: 'Raft leader election, distributed Sagas with compensating transactions, outbox patterns, and CQRS.'
  },

  // APTITUDE
  {
    id: 'subj-apt-quant',
    quizId: 'quiz-aptitude-quant',
    category: 'APTITUDE',
    subject: 'Quantitative Aptitude',
    topic: 'Time & Work, Speed & Distance, Percentages & Probability',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Relative speed calculations, combined work rates, profit/loss margins, and combinatorial probability.'
  },
  {
    id: 'subj-apt-log',
    quizId: 'quiz-aptitude-logical',
    category: 'APTITUDE',
    subject: 'Logical Reasoning',
    topic: 'Syllogisms, Blood Relations, Seating & Pattern Series',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Categorical syllogistic deductions, directional navigation, circular seating constraints, and sequences.'
  },
  {
    id: 'subj-apt-verb',
    quizId: 'quiz-aptitude-verbal',
    category: 'APTITUDE',
    subject: 'Verbal Ability',
    topic: 'Critical Reading, Sentence Correction & Para Jumbles',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Grammatical error spotting, modifier placements, contextual vocabulary, and coherent paragraph structuring.'
  },
  {
    id: 'subj-apt-di',
    quizId: 'quiz-aptitude-di',
    category: 'APTITUDE',
    subject: 'Data Interpretation',
    topic: 'Pie Charts, Tables, Caselets & Statistical Ratio Analysis',
    difficulty: 'Intermediate',
    questionCount: 5,
    description: 'Comparative growth rates, tabular trend extraction, multi-dimensional pie chart distributions, and ratios.'
  }
];

export const ALL_QUIZZES: Record<string, Quiz> = {
  // 1. CS FUNDAMENTALS: GENERAL CORE DIAGNOSTICS
  'cs-quiz': {
    id: 'cs-quiz',
    courseId: 'course-dsa-masterclass',
    title: 'Computer Science Core Diagnostics Assessment',
    questions: [
      {
        id: 'csq1',
        text: 'What is the time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctOptionIndex: 1,
        explanation: 'Balanced BSTs (AVL, Red-Black) maintain height bounded by O(log N), guaranteeing O(log N) worst-case search time.'
      },
      {
        id: 'csq2',
        text: 'Which database isolation level prevents dirty reads, non-repeatable reads, AND phantom reads?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        correctOptionIndex: 3,
        explanation: 'Serializable is the highest isolation level. It emulates serial transaction execution to completely prevent phantom reads, dirty reads, and non-repeatable reads.'
      },
      {
        id: 'csq3',
        text: 'In Linux Operating Systems, which system call creates a duplicate copy of the calling process?',
        options: ['exec()', 'fork()', 'clone()', 'pthread_create()'],
        correctOptionIndex: 1,
        explanation: 'fork() creates a child process that is an exact duplicate of the calling parent process with an isolated virtual address space.'
      },
      {
        id: 'csq4',
        text: 'What is the primary function of the Translation Lookaside Buffer (TLB) in CPU memory management?',
        options: [
          'To cache disk blocks in RAM',
          'To cache virtual-to-physical address translations',
          'To buffer network packets before TCP processing',
          'To store register states during context switching'
        ],
        correctOptionIndex: 1,
        explanation: 'The TLB is a high-speed associative hardware cache in the MMU that stores recent virtual-to-physical page mappings to avoid page table walk penalties.'
      },
      {
        id: 'csq5',
        text: 'Which transport layer protocol guarantees in-order byte stream delivery with congestion control?',
        options: ['UDP', 'ICMP', 'TCP', 'IP'],
        correctOptionIndex: 2,
        explanation: 'TCP (Transmission Control Protocol) is connection-oriented, provides sequence numbers, acknowledgements, flow control, and AIMD congestion control.'
      }
    ]
  },

  // 2. CS FUNDAMENTALS: DBMS
  'quiz-dbms': {
    id: 'quiz-dbms',
    courseId: 'course-dbms-sql-optimization',
    title: 'Database Management Systems (DBMS) Assessment',
    questions: [
      {
        id: 'dbms_q1',
        text: 'Why do B+ Tree indexes offer superior performance over B-Tree indexes for range scans in database engines?',
        options: [
          'B+ Trees store data pointers only in internal nodes',
          'B+ Trees link all leaf nodes in a continuous doubly-linked list for sequential scanning',
          'B+ Trees do not require rebalancing during deletions',
          'B+ Trees store records unordered'
        ],
        correctOptionIndex: 1,
        explanation: 'In a B+ Tree, all keys and records are stored in leaf nodes which are sequentially linked together. Range scans merely locate the lower bound and traverse the linked list.'
      },
      {
        id: 'dbms_q2',
        text: 'In relational database theory, what does the "C" in ACID stand for and guarantee?',
        options: [
          'Concurrency: Ensures multiple threads execute concurrently',
          'Consistency: Ensures a transaction transitions the database from one valid state to another satisfying all schema constraints',
          'Caching: Guarantees hot data remains in buffer pool',
          'Clustering: Orders the physical storage on disk'
        ],
        correctOptionIndex: 1,
        explanation: 'Consistency guarantees that transactions only bring the database from one valid state to another, maintaining all declared schema invariants, foreign keys, and check constraints.'
      },
      {
        id: 'dbms_q3',
        text: 'Which SQL normal form eliminates transitive functional dependencies on the primary key?',
        options: ['First Normal Form (1NF)', 'Second Normal Form (2NF)', 'Third Normal Form (3NF)', 'Boyce-Codd Normal Form (BCNF)'],
        correctOptionIndex: 2,
        explanation: 'Third Normal Form (3NF) requires a relation to be in 2NF and have no non-prime attribute transitively dependent on the candidate key.'
      },
      {
        id: 'dbms_q4',
        text: 'What type of lock prevents concurrent transactions from both reading and modifying the locked row?',
        options: ['Shared Lock (S-lock)', 'Exclusive Lock (X-lock)', 'Intent Shared Lock (IS-lock)', 'Optimistic Read Lock'],
        correctOptionIndex: 1,
        explanation: 'An Exclusive Lock (X-lock) is acquired during write operations (UPDATE, DELETE). No other transaction can obtain either a shared or exclusive lock on that row.'
      },
      {
        id: 'dbms_q5',
        text: 'What is the purpose of Write-Ahead Logging (WAL) in database recovery protocols (ARIES)?',
        options: [
          'To compress index files before committing to disk',
          'To ensure modifications are persisted to non-volatile log before corresponding data pages are flushed to disk',
          'To replicate data asynchronously to read replicas',
          'To prevent SQL injection attacks'
        ],
        correctOptionIndex: 1,
        explanation: 'WAL ensures durability (Atomicity and Durability) by writing log records describing changes to persistent storage before the actual dirty buffer cache pages are flushed.'
      }
    ]
  },

  // 3. CS FUNDAMENTALS: OPERATING SYSTEMS
  'quiz-os': {
    id: 'quiz-os',
    courseId: 'course-os-concurrency',
    title: 'Operating Systems & Concurrency Assessment',
    questions: [
      {
        id: 'os_q1',
        text: 'Which of the following is NOT one of Coffmans four necessary conditions for a Deadlock to occur?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correctOptionIndex: 2,
        explanation: 'Deadlock requires No Preemption (resources cannot be forcibly reclaimed from a thread holding them). If preemption is allowed, deadlocks are prevented.'
      },
      {
        id: 'os_q2',
        text: 'What phenomenon describes an operating system spending virtually all its CPU cycles paging data in and out of swap space rather than executing user code?',
        options: ['Starvation', 'Thrashing', 'Priority Inversion', 'Aging'],
        correctOptionIndex: 1,
        explanation: 'Thrashing occurs when the collective working set of active processes exceeds physical RAM, causing constant page faults and disk I/O thrashing.'
      },
      {
        id: 'os_q3',
        text: 'What is the difference between a mutex and a binary semaphore?',
        options: [
          'A mutex has an ownership concept: only the thread that locked the mutex can unlock it; a semaphore can be signaled by any thread',
          'A semaphore can only be used between processes on different machines',
          'A mutex can have count greater than 1',
          'There is no functional difference'
        ],
        correctOptionIndex: 0,
        explanation: 'A mutex includes the strict concept of ownership (the locking thread must be the releasing thread). A semaphore is a signaling mechanism without ownership.'
      },
      {
        id: 'os_q4',
        text: 'In preemptive scheduling, which algorithm gives the theoretically minimum average waiting time for a given set of processes?',
        options: ['First-Come First-Served (FCFS)', 'Round Robin (RR)', 'Shortest Remaining Time First (SRTF)', 'Priority Scheduling without aging'],
        correctOptionIndex: 2,
        explanation: 'Shortest Remaining Time First (the preemptive counterpart of SJF) is mathematically provable to yield the minimum average turnaround/waiting time.'
      },
      {
        id: 'os_q5',
        text: 'How does an OS handle a Translation Lookaside Buffer (TLB) miss on hardware with a software-managed TLB?',
        options: [
          'The CPU raises a TLB miss trap exception and transfers control to the OS kernel trap handler to walk page tables',
          'The process is immediately terminated with SIGSEGV',
          'The CPU bypasses virtual memory and writes directly to physical bus',
          'The MMU halts the machine clock'
        ],
        correctOptionIndex: 0,
        explanation: 'On architectures with software-managed TLBs (like MIPS), a TLB miss raises a hardware trap into the kernel page fault/TLB handler to populate the TLB.'
      }
    ]
  },

  // 4. CS FUNDAMENTALS: COMPUTER NETWORKS
  'quiz-networks': {
    id: 'quiz-networks',
    courseId: 'course-dsa-masterclass',
    title: 'Computer Networks & Internet Protocols Assessment',
    questions: [
      {
        id: 'net_q1',
        text: 'What flags are exchanged during the standard TCP 3-Way Handshake to initiate a reliable connection?',
        options: ['SYN -> SYN-ACK -> ACK', 'ACK -> SYN -> ACK', 'FIN -> ACK -> FIN-ACK', 'RST -> SYN -> SYN-ACK'],
        correctOptionIndex: 0,
        explanation: 'TCP 3-Way Handshake: Client sends SYN, Server replies with SYN-ACK, Client sends ACK to establish synchronized sequence numbers.'
      },
      {
        id: 'net_q2',
        text: 'What is the fundamental purpose of the TIME_WAIT state in the TCP client state machine during connection teardown?',
        options: [
          'To allow the client to download extra files',
          'To ensure the final ACK is received by the server and prevent old delayed duplicate packets from confusing a future reincarnated connection',
          'To negotiate cryptographic TLS keys',
          'To wait for ARP table cache refresh'
        ],
        correctOptionIndex: 1,
        explanation: 'TIME_WAIT lasts 2*MSL (Maximum Segment Lifetime) to ensure that retransmitted FINs can be ACKed and old segments from the connection expire in transit.'
      },
      {
        id: 'net_q3',
        text: 'Which protocol operates at the Application Layer to resolve human-readable domain names into IP addresses?',
        options: ['ARP', 'BGP', 'DNS', 'ICMP'],
        correctOptionIndex: 2,
        explanation: 'DNS (Domain Name System) operates at Layer 7 (Application Layer) over UDP/TCP port 53 to map hostnames to IP addresses.'
      },
      {
        id: 'net_q4',
        text: 'What key innovation was introduced in HTTP/2 compared to HTTP/1.1?',
        options: [
          'Binary framing and single-connection request multiplexing, eliminating head-of-line blocking at application layer',
          'Removal of TCP in favor of UDP',
          'Encryption is optional',
          'Plaintext headers only'
        ],
        correctOptionIndex: 0,
        explanation: 'HTTP/2 introduced binary framing layer and multiplexed streams over a single TCP socket, resolving HTTP/1.1 application-level head-of-line blocking.'
      },
      {
        id: 'net_q5',
        text: 'Which mechanism prevents routing loops in distance-vector routing protocols like RIP?',
        options: ['Split Horizon and Poison Reverse', 'Dijkstras Dijkstra algorithm', 'DNS Caching', 'Subnet Masking'],
        correctOptionIndex: 0,
        explanation: 'Split Horizon and Route Poisoning/Poison Reverse prevent distance-vector protocols from developing count-to-infinity routing loops.'
      }
    ]
  },

  // 5. CS FUNDAMENTALS: OBJECT ORIENTED PROGRAMMING
  'quiz-oop': {
    id: 'quiz-oop',
    courseId: 'course-dsa-masterclass',
    title: 'Object-Oriented Design & SOLID Principles Assessment',
    questions: [
      {
        id: 'oop_q1',
        text: 'What does the Liskov Substitution Principle (LSP) state in SOLID design?',
        options: [
          'Classes should have only one reason to change',
          'Subtypes must be substitutable for their base types without altering the correctness of the program',
          'Depend on abstractions, not concretions',
          'Clients should not be forced to depend upon interfaces they do not use'
        ],
        correctOptionIndex: 1,
        explanation: 'LSP (Liskov Substitution Principle) mandates that functions that use pointers or references to base classes must be able to use objects of derived classes without knowing it.'
      },
      {
        id: 'oop_q2',
        text: 'Which design pattern guarantees that a class has only one instance and provides a global point of access to it?',
        options: ['Factory Pattern', 'Singleton Pattern', 'Observer Pattern', 'Decorator Pattern'],
        correctOptionIndex: 1,
        explanation: 'The Singleton pattern restricts instantiation of a class to one single instance and provides global access (often using thread-safe double-checked locking).'
      },
      {
        id: 'oop_q3',
        text: 'In Java/C++, what is Dynamic Method Dispatch (Runtime Polymorphism)?',
        options: [
          'Resolving method calls at compile-time via function overloading',
          'Resolving overridden method calls at runtime using a virtual method table (vtable)',
          'Allocating memory on the thread stack',
          'Casting primitive types'
        ],
        correctOptionIndex: 1,
        explanation: 'Dynamic dispatch uses virtual tables (vtable) and virtual pointers (vptr) to look up the correct subclass implementation at runtime.'
      },
      {
        id: 'oop_q4',
        text: 'What is the key difference between Composition and Inheritance ("favor composition over inheritance")?',
        options: [
          'Composition defines a "has-a" relationship and allows dynamic runtime behavioral swapping; inheritance defines a rigid compile-time "is-a" coupling',
          'Inheritance is always faster than composition',
          'Composition cannot reuse code',
          'Inheritance allows multiple base classes in all languages'
        ],
        correctOptionIndex: 0,
        explanation: 'Composition models "has-a" and encapsulates behavior behind interfaces, minimizing fragile base-class coupling and enabling flexible runtime polymorphism.'
      },
      {
        id: 'oop_q5',
        text: 'Which SOLID principle is violated if a class implements an interface with methods it does not require or use?',
        options: [
          'Single Responsibility Principle',
          'Open/Closed Principle',
          'Interface Segregation Principle',
          'Dependency Inversion Principle'
        ],
        correctOptionIndex: 2,
        explanation: 'The Interface Segregation Principle (ISP) dictates that clients should never be forced to depend upon interfaces with methods they do not utilize.'
      }
    ]
  },

  // 6. CS FUNDAMENTALS: DATA STRUCTURES
  'quiz-dsa-fundamentals': {
    id: 'quiz-dsa-fundamentals',
    courseId: 'course-dsa-masterclass',
    title: 'Data Structures & Complexity Diagnostics',
    questions: [
      {
        id: 'ds_q1',
        text: 'What is the worst-case time complexity of inserting an element into a Min-Binary Heap of size N?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctOptionIndex: 1,
        explanation: 'Inserting into a binary heap places the element at the bottom and bubbles up along the tree height, taking O(log N) worst-case time.'
      },
      {
        id: 'ds_q2',
        text: 'Which property distinguishes a Red-Black Tree from a basic Binary Search Tree to ensure logarithmic height?',
        options: [
          'Every node must have exactly two children',
          'The root and leaves (NIL) are black, red nodes cannot have red children, and every path from root to leaf contains equal black nodes',
          'All nodes must be stored in contiguous memory',
          'Keys must be hashes of object pointers'
        ],
        correctOptionIndex: 1,
        explanation: 'Red-Black tree coloring rules enforce that the longest path from root to leaf is no more than twice the shortest path, guaranteeing O(log N) height.'
      },
      {
        id: 'ds_q3',
        text: 'In a Trie (Prefix Tree) containing N words of maximum length L over an alphabet of size S, what is the search time for a word of length M?',
        options: ['O(log N)', 'O(M)', 'O(N * M)', 'O(S^M)'],
        correctOptionIndex: 1,
        explanation: 'Searching a word in a Trie requires traversing at most M nodes (one character per edge), yielding O(M) time regardless of the total words N in the tree.'
      },
      {
        id: 'ds_q4',
        text: 'When representing a sparse graph with V vertices and E edges, which representation is more space-efficient than an adjacency matrix?',
        options: ['Adjacency Matrix O(V^2)', 'Adjacency List O(V + E)', 'Complete Bipartite Graph', 'Distance Tensor'],
        correctOptionIndex: 1,
        explanation: 'An Adjacency List consumes O(V + E) memory, which is significantly more space-efficient than an Adjacency Matrix O(V^2) when E << V^2.'
      },
      {
        id: 'ds_q5',
        text: 'What is the amortized time complexity of dynamic array resizing (e.g. std::vector in C++ or ArrayList in Java) when capacity doubles on overflow?',
        options: ['O(1) amortized', 'O(N) amortized', 'O(log N) amortized', 'O(N^2) amortized'],
        correctOptionIndex: 0,
        explanation: 'Doubling capacity causes infrequent O(N) copies, but over N insertions the total copying work is 2N, giving an amortized cost of O(1) per append.'
      }
    ]
  },

  // 7. CS FUNDAMENTALS: COMPUTER ARCHITECTURE
  'quiz-computer-architecture': {
    id: 'quiz-computer-architecture',
    courseId: 'course-dsa-masterclass',
    title: 'Computer Architecture & Memory Hierarchy Assessment',
    questions: [
      {
        id: 'ca_q1',
        text: 'What type of CPU pipeline hazard occurs when an instruction depends on the result of an uncompleted prior instruction?',
        options: ['Structural Hazard', 'Data Hazard (Read After Write)', 'Control Hazard (Branch)', 'TLB Hazard'],
        correctOptionIndex: 1,
        explanation: 'Data Hazards (specifically RAW - Read After Write) occur when instruction operands have data dependencies on prior incomplete pipeline stages.'
      },
      {
        id: 'ca_q2',
        text: 'Under the MESI cache coherence protocol, what state is a cache line in if it is present only in the current CPU cache and clean (matches main RAM)?',
        options: ['Modified (M)', 'Exclusive (E)', 'Shared (S)', 'Invalid (I)'],
        correctOptionIndex: 1,
        explanation: 'Exclusive (E) denotes that the line is cached exclusively in this processor core and has not been modified (its contents are identical to main memory).'
      },
      {
        id: 'ca_q3',
        text: 'What is the primary benefit of Spatial Locality in cache design?',
        options: [
          'Instructions repeatedly access the exact same memory location over time',
          'Accessing a memory address brings adjacent contiguous addresses into cache lines, accelerating subsequent sequential reads',
          'It eliminates virtual memory translation',
          'It converts CISC instructions to RISC micro-ops'
        ],
        correctOptionIndex: 1,
        explanation: 'Spatial locality means that when a memory address is referenced, nearby contiguous addresses are likely to be referenced soon, exploited by multi-word cache lines.'
      },
      {
        id: 'ca_q4',
        text: 'Which component in modern out-of-order processors holds speculative instruction results before committing them in program order?',
        options: ['Reorder Buffer (ROB)', 'Arithmetic Logic Unit (ALU)', 'Instruction Register (IR)', 'Level 1 Disk Cache'],
        correctOptionIndex: 0,
        explanation: 'The Reorder Buffer (ROB) tracks instructions executed speculatively/out-of-order and guarantees that architectural state updates commit in original program order.'
      },
      {
        id: 'ca_q5',
        text: 'What is a cold (compulsory) cache miss?',
        options: [
          'A miss caused by two addresses contending for the same cache set',
          'A miss occurring on the very first reference to a block of memory',
          'A miss caused by insufficient total cache capacity',
          'A miss caused by thermal throttling'
        ],
        correctOptionIndex: 1,
        explanation: 'Compulsory (cold) misses occur on the first access to a block because it has never previously been brought into the cache hierarchy.'
      }
    ]
  },

  // 8. CS FUNDAMENTALS: SOFTWARE ENGINEERING
  'quiz-software-engineering': {
    id: 'quiz-software-engineering',
    courseId: 'course-dsa-masterclass',
    title: 'Software Engineering & Clean Architecture Assessment',
    questions: [
      {
        id: 'se_q1',
        text: 'In the classic Testing Pyramid model proposed by Mike Cohn, what should form the broad base of the pyramid?',
        options: ['End-to-End (E2E) UI Tests', 'Manual Exploratory Tests', 'Automated Unit Tests', 'Chaos Engineering Tests'],
        correctOptionIndex: 2,
        explanation: 'Unit tests form the broad base: they are fast, isolated, inexpensive to maintain, and provide immediate feedback compared to high-level integration or UI tests.'
      },
      {
        id: 'se_q2',
        text: 'What does "Idempotence" mean in RESTful API design?',
        options: [
          'Making multiple identical requests produces the same server state as a single request',
          'Requests execute in less than 50 milliseconds',
          'The API does not require authentication',
          'Only GET endpoints can be called'
        ],
        correctOptionIndex: 0,
        explanation: 'An HTTP method is idempotent (e.g. GET, PUT, DELETE) if the side-effects of making N identical requests is identical to making 1 request.'
      },
      {
        id: 'se_q3',
        text: 'What architectural vulnerability is caused by "tight coupling" between microservices?',
        options: [
          'Zero network latency',
          'Changes to one service force synchronized cascading changes and deployments across dependent services',
          'Memory leaks in client browser',
          'Inability to write SQL queries'
        ],
        correctOptionIndex: 1,
        explanation: 'Tight coupling creates a "distributed monolith" where independent release cycles are lost, causing cascading failures and complex deploy locks.'
      },
      {
        id: 'se_q4',
        text: 'What is the purpose of Continuous Integration (CI) in modern DevOps pipelines?',
        options: [
          'Deploying to production once every 6 months',
          'Automatically merging, building, and running test suites on code changes frequently to detect regressions early',
          'Replacing source control systems with FTP uploads',
          'Eliminating all unit tests in favor of manual testing'
        ],
        correctOptionIndex: 1,
        explanation: 'Continuous Integration automates merging, static analysis, and testing on every commit to prevent merge hell and discover defects immediately.'
      },
      {
        id: 'se_q5',
        text: 'What does the Dependency Inversion Principle (DIP) state?',
        options: [
          'High-level modules should not import anything from low-level modules; both should depend on abstractions',
          'Classes should have multiple responsibilities',
          'Low-level code must inherit from concrete classes',
          'Software should be rewritten every year'
        ],
        correctOptionIndex: 0,
        explanation: 'DIP states that high-level policy should not depend on low-level implementation details; abstractions should not depend on details, details depend on abstractions.'
      }
    ]
  },

  // 9. CS FUNDAMENTALS: SQL MASTERY
  'quiz-sql-mastery': {
    id: 'quiz-sql-mastery',
    courseId: 'course-dbms-sql-optimization',
    title: 'SQL Mastery & Query Optimization Assessment',
    questions: [
      {
        id: 'sql_q1',
        text: 'What is the difference between ROW_NUMBER(), RANK(), and DENSE_RANK() in SQL window functions when values tie?',
        options: [
          'ROW_NUMBER assigns distinct numbers; RANK leaves gaps after ties; DENSE_RANK leaves no gaps after ties',
          'All three produce identical output in all SQL dialects',
          'RANK is only used for strings, DENSE_RANK for numbers',
          'ROW_NUMBER requires an unindexed table'
        ],
        correctOptionIndex: 0,
        explanation: 'When ties occur: ROW_NUMBER increments sequentially (1,2,3); RANK assigns the same rank and skips ranks (1,2,2,4); DENSE_RANK assigns the same rank without skipping (1,2,2,3).'
      },
      {
        id: 'sql_q2',
        text: 'What is a "Covering Index" in SQL databases?',
        options: [
          'An index that encrypts table columns on disk',
          'An index that contains all columns required by a query, allowing the database to answer the query without reading table heap pages',
          'An index applied to every single table in the database',
          'An index created on temporary tables only'
        ],
        correctOptionIndex: 1,
        explanation: 'A covering index includes all referenced columns (via key or INCLUDE clauses), enabling an "Index-Only Scan" that avoids costly table heap lookups.'
      },
      {
        id: 'sql_q3',
        text: 'Which SQL join algorithm is most efficient when joining two massive tables where both join keys are already sorted?',
        options: ['Nested Loop Join', 'Merge Join (Sort-Merge Join)', 'Hash Join with full in-memory buckets', 'Cartesian Cross Join'],
        correctOptionIndex: 1,
        explanation: 'Sort-Merge Join iterates through both sorted inputs with two pointers in O(M + N) time, making it optimal when indexes already provide sorted order.'
      },
      {
        id: 'sql_q4',
        text: 'What is the execution order of clauses in a standard SQL query?',
        options: [
          'SELECT -> FROM -> WHERE -> GROUP BY -> HAVING -> ORDER BY',
          'FROM -> WHERE -> GROUP BY -> HAVING -> SELECT -> ORDER BY -> LIMIT',
          'WHERE -> FROM -> SELECT -> GROUP BY -> HAVING -> ORDER BY',
          'ORDER BY -> SELECT -> FROM -> WHERE'
        ],
        correctOptionIndex: 1,
        explanation: 'SQL executes logically: FROM (identify sources) -> WHERE (filter rows) -> GROUP BY (aggregate) -> HAVING (filter groups) -> SELECT (project columns) -> ORDER BY (sort) -> LIMIT.'
      },
      {
        id: 'sql_q5',
        text: 'What is a Correlated Subquery and why does it often suffer from poor performance?',
        options: [
          'A subquery that runs on a remote database cluster',
          'A subquery that references columns from the outer query, causing it to be evaluated repeatedly for each row processed by the outer query',
          'A query containing multiple CTEs',
          'A query with a syntax error'
        ],
        correctOptionIndex: 1,
        explanation: 'Correlated subqueries depend on values from the outer query row-by-row, potentially turning an O(N) query into an O(N * M) nested evaluation unless optimized by the query planner.'
      }
    ]
  },

  // 10. SYSTEM DESIGN: BEGINNER
  'quiz-system-design-beginner': {
    id: 'quiz-system-design-beginner',
    courseId: 'course-system-design-interview',
    title: 'System Design Fundamentals (Beginner)',
    questions: [
      {
        id: 'sdb_q1',
        text: 'What is the difference between Horizontal Scaling (Scaling Out) and Vertical Scaling (Scaling Up)?',
        options: [
          'Vertical scaling adds more machines; Horizontal scaling adds more RAM/CPU to one machine',
          'Horizontal scaling adds more machines to a pool; Vertical scaling upgrades CPU/RAM on a single server',
          'Horizontal scaling is only for frontend; Vertical scaling is only for backend',
          'There is no functional difference'
        ],
        correctOptionIndex: 1,
        explanation: 'Horizontal scaling (scale out) adds more compute instances behind load balancers. Vertical scaling (scale up) adds resources to a single box, which has hardware limits.'
      },
      {
        id: 'sdb_q2',
        text: 'Why are Stateless Application Servers preferred in high-scale web architectures?',
        options: [
          'They do not allow user logins',
          'Any server can handle any incoming user request because session state is stored in external stores (e.g. Redis, DB), enabling seamless autoscaling',
          'They use zero memory',
          'They cannot connect to databases'
        ],
        correctOptionIndex: 1,
        explanation: 'Stateless servers do not hold client state locally. Traffic can be routed to any instance, enabling automatic autoscaling and resilient failure recovery.'
      },
      {
        id: 'sdb_q3',
        text: 'What is the primary role of a Reverse Proxy (such as Nginx or AWS ALB) in front of application backends?',
        options: [
          'To generate HTML templates',
          'To act as an intermediary handling SSL/TLS termination, request routing, caching, and load distribution',
          'To compile JavaScript code',
          'To replace relational databases'
        ],
        correctOptionIndex: 1,
        explanation: 'A reverse proxy intercepts client traffic, offloads SSL decryption, compresses content, caches static assets, and balances traffic across backend instances.'
      },
      {
        id: 'sdb_q4',
        text: 'What does a Content Delivery Network (CDN) do to reduce latency for global users?',
        options: [
          'Replaces backend APIs entirely',
          'Caches static media and assets at globally distributed Edge PoPs close to geographical user locations',
          'Encrypts hard drives on server racks',
          'Runs SQL migrations on edge servers'
        ],
        correctOptionIndex: 1,
        explanation: 'CDNs maintain geographically distributed edge servers (Edge PoPs) to serve cached media, images, and static assets from locations physically close to users.'
      },
      {
        id: 'sdb_q5',
        text: 'What is DNS round-robin load balancing?',
        options: [
          'Configuring DNS servers to return multiple IP addresses in rotating cyclical order to distribute traffic across endpoints',
          'Routing requests based on CPU utilization in real time',
          'A database replication protocol',
          'An encryption standard'
        ],
        correctOptionIndex: 0,
        explanation: 'DNS round-robin returns a list of IP addresses in rotated order for a domain, giving basic load distribution without requiring complex load balancer hardware.'
      }
    ]
  },

  // 11. SYSTEM DESIGN: INTERMEDIATE
  'quiz-system-design': {
    id: 'quiz-system-design',
    courseId: 'course-system-design-interview',
    title: 'System Design & High-Scale Distributed Systems (Intermediate)',
    questions: [
      {
        id: 'sys_q1',
        text: 'According to the CAP theorem, in the presence of a Network Partition (P), what trade-off must a distributed data store choose between?',
        options: [
          'Cost vs Performance',
          'Consistency (C) vs Availability (A)',
          'Latency vs Throughput',
          'Durability vs Atomicity'
        ],
        correctOptionIndex: 1,
        explanation: 'CAP theorem dictates that when a distributed system experiences a network partition (P), it must trade off either returning stale data (AP) or erroring out (CP).'
      },
      {
        id: 'sys_q2',
        text: 'What is the primary advantage of Consistent Hashing over traditional modulo hashing (hash(key) % N) in distributed caching clusters?',
        options: [
          'It eliminates hashing computations entirely',
          'When adding or removing a node, only K/N keys need remapping on average rather than almost all keys',
          'It forces all data to reside on a single server',
          'It provides cryptographic confidentiality'
        ],
        correctOptionIndex: 1,
        explanation: 'Consistent Hashing maps servers and keys onto a virtual ring. Adding or removing a cache node only shifts keys between neighboring nodes (K/N items).'
      },
      {
        id: 'sys_q3',
        text: 'Which caching strategy writes data to both the cache and the backing database synchronously before returning success to the client?',
        options: ['Cache-Aside (Lazy Loading)', 'Write-Through', 'Write-Back (Write-Behind)', 'Refresh-Ahead'],
        correctOptionIndex: 1,
        explanation: 'In Write-Through caching, the cache writes data directly to the database synchronously. Write-Back writes asynchronously, while Cache-Aside loads on read misses.'
      },
      {
        id: 'sys_q4',
        text: 'What is Database Sharding (Horizontal Partitioning)?',
        options: [
          'Splitting table columns across different databases',
          'Partitioning table rows across multiple autonomous database nodes based on a Shard Key',
          'Taking hourly database backups',
          'Compressing transaction log files'
        ],
        correctOptionIndex: 1,
        explanation: 'Database sharding partitions large tables row-wise across distinct physical database instances according to a shard key (e.g. user_id % 16).'
      },
      {
        id: 'sys_q5',
        text: 'What algorithm is commonly used in API gateways for rate limiting to accommodate burst traffic while enforcing smooth request averages?',
        options: ['Bubble Sort', 'Token Bucket Algorithm', 'Round Robin', 'Dijkstras Shortest Path'],
        correctOptionIndex: 1,
        explanation: 'The Token Bucket algorithm accumulates tokens at a steady refill rate, allowing instantaneous traffic bursts up to bucket capacity while guaranteeing average rate limits.'
      }
    ]
  },

  // 12. SYSTEM DESIGN: ADVANCED
  'quiz-system-design-advanced': {
    id: 'quiz-system-design-advanced',
    courseId: 'course-system-design-interview',
    title: 'Advanced Distributed Systems & High-Scale Architecture',
    questions: [
      {
        id: 'sda_q1',
        text: 'In the Raft consensus algorithm, what must a leader receive from followers before committing a log entry and applying it to its state machine?',
        options: [
          'Unanimous confirmation from 100% of cluster nodes',
          'AppendEntries acknowledgements from a strict majority (quorum) of cluster nodes',
          'Confirmation from a single follower node',
          'Approval from a centralized NTP time server'
        ],
        correctOptionIndex: 1,
        explanation: 'Raft requires a majority quorum (N/2 + 1) of cluster nodes to acknowledge an AppendEntries RPC before the leader marks the entry committed.'
      },
      {
        id: 'sda_q2',
        text: 'What problem does the Transactional Outbox Pattern solve in event-driven microservices architectures?',
        options: [
          'It cleans up obsolete database indexes automatically',
          'It guarantees atomic execution between updating local database state and publishing an asynchronous message/event without dual-write inconsistency',
          'It speeds up HTML rendering',
          'It eliminates network bandwidth consumption'
        ],
        correctOptionIndex: 1,
        explanation: 'The Transactional Outbox pattern writes the event into an outbox table within the same ACID database transaction, then an async poller publishes it reliably.'
      },
      {
        id: 'sda_q3',
        text: 'What is the difference between Choreography and Orchestration in the Saga Pattern for distributed microservice transactions?',
        options: [
          'Choreography uses a central coordinator service; Orchestration uses peer-to-peer pub/sub events',
          'Choreography services listen to events and trigger local transactions autonomously; Orchestration uses a central orchestrator directing participants',
          'Choreography is only for SQL databases; Orchestration is only for NoSQL',
          'There is no distinction'
        ],
        correctOptionIndex: 1,
        explanation: 'In Choreography, services communicate through decentralized domain events. In Orchestration, a central Saga orchestrator explicitly commands participants.'
      },
      {
        id: 'sda_q4',
        text: 'What is Command Query Responsibility Segregation (CQRS)?',
        options: [
          'Combining reads and writes into a single unified database table',
          'Separating the data model for mutating actions (commands) from the data model for reading queries (queries), often backed by read replicas or elasticsearch',
          'A protocol for encrypting TLS traffic',
          'A git branching methodology'
        ],
        correctOptionIndex: 1,
        explanation: 'CQRS segregates write operations (Commands) from read operations (Queries), allowing independent scaling, specialized read denormalization, and high throughput.'
      },
      {
        id: 'sda_q5',
        text: 'What guarantees does Vector Clock provide over simple scalar Lamport Timestamps in distributed systems?',
        options: [
          'It enables detecting concurrent (causally unrelated) events and causal ordering conflicts across nodes',
          'It syncs physical clock times down to nanosecond precision',
          'It prevents database deadlocks',
          'It eliminates network partitions'
        ],
        correctOptionIndex: 0,
        explanation: 'Vector clocks capture causal history across N nodes, distinguishing whether event A caused event B or whether A and B were concurrent conflicting writes.'
      }
    ]
  },

  // 13. APTITUDE: QUANTITATIVE
  'quiz-aptitude-quant': {
    id: 'quiz-aptitude-quant',
    courseId: 'course-behavioral-interview',
    title: 'Quantitative Aptitude Assessment',
    questions: [
      {
        id: 'quant_q1',
        text: 'A train 240 meters long passes a pole in 16 seconds. What is the speed of the train in km/h?',
        options: ['45 km/h', '54 km/h', '60 km/h', '72 km/h'],
        correctOptionIndex: 1,
        explanation: 'Speed = Distance / Time = 240m / 16s = 15 m/s. Converting to km/h: 15 * (18 / 5) = 54 km/h.'
      },
      {
        id: 'quant_q2',
        text: 'A can complete a project in 12 days and B can complete it in 24 days. Working together, in how many days will they finish the project?',
        options: ['6 days', '8 days', '10 days', '18 days'],
        correctOptionIndex: 1,
        explanation: '1/12 + 1/24 = 2/24 + 1/24 = 3/24 = 1/8 of the work per day. Hence, together they require exactly 8 days.'
      },
      {
        id: 'quant_q3',
        text: 'What is the probability of obtaining a sum of 7 when rolling two fair six-sided dice simultaneously?',
        options: ['1/12', '1/6', '7/36', '5/36'],
        correctOptionIndex: 1,
        explanation: 'Total outcomes = 6 * 6 = 36. Outcomes summing to 7: (1,6), (2,5), (3,4), (4,3), (5,2), (6,1) = 6 combinations. Probability = 6/36 = 1/6.'
      },
      {
        id: 'quant_q4',
        text: 'An item marked at $80 is sold with a 15% discount. If the merchant still makes a 20% profit on cost price, what was the original cost price?',
        options: ['$52.50', '$56.67', '$68.00', '$60.00'],
        correctOptionIndex: 1,
        explanation: 'Selling price = $80 * 0.85 = $68. Since SP = CP * 1.20, Cost Price (CP) = 68 / 1.20 = $56.67.'
      },
      {
        id: 'quant_q5',
        text: 'In how many different ways can the letters of the word "LEADER" be arranged?',
        options: ['720', '360', '120', '480'],
        correctOptionIndex: 1,
        explanation: '"LEADER" has 6 letters with letter E repeated 2 times. Total arrangements = 6! / 2! = 720 / 2 = 360.'
      }
    ]
  },

  // 14. APTITUDE: LOGICAL REASONING
  'quiz-aptitude-logical': {
    id: 'quiz-aptitude-logical',
    courseId: 'course-behavioral-interview',
    title: 'Logical Reasoning & Analytical Deduction Assessment',
    questions: [
      {
        id: 'log_q1',
        text: 'Statements: All mangoes are golden. Some golden things are expensive. Conclusions: I. Some mangoes are expensive. II. All golden things are mangoes.',
        options: ['Only conclusion I follows', 'Only conclusion II follows', 'Neither conclusion I nor II follows', 'Both conclusions follow'],
        correctOptionIndex: 2,
        explanation: 'The category of expensive items intersects with golden things, but may not overlap with the specific subset that is mangoes. Neither conclusion is guaranteed.'
      },
      {
        id: 'log_q2',
        text: 'Pointing to a photograph, a man said: "I have no brother or sister, but that mans father is my fathers son." Whose photograph was it?',
        options: ['His fathers', 'His own', 'His sons', 'His nephews'],
        correctOptionIndex: 2,
        explanation: '"My fathers son" (since he has no brother) is the speaker himself. So "that mans father is [the speaker]". Therefore, the photograph is of his son.'
      },
      {
        id: 'log_q3',
        text: 'Find the next number in the series: 3, 7, 15, 31, 63, ?',
        options: ['95', '127', '126', '128'],
        correctOptionIndex: 1,
        explanation: 'Pattern: Each number is (2 * previous) + 1. 3*2+1=7; 7*2+1=15; 15*2+1=31; 31*2+1=63; 63*2+1 = 127.'
      },
      {
        id: 'log_q4',
        text: 'In a certain code, COMPUTER is written as RFUVQNPC. How is MEDICINE written in that same code?',
        options: ['MFEDJJOE', 'EOJDEJFM', 'MFEJDJOE', 'EOJDJEFM'],
        correctOptionIndex: 3,
        explanation: 'Reverse the word order and increment each letter by 1: MEDICINE reversed is ENICIDEM. Incrementing each gives EOJDJEFM.'
      },
      {
        id: 'log_q5',
        text: 'Six persons A, B, C, D, E, F are sitting around a circular table facing the center. B is between A and C. E is between D and F. D is to the immediate left of A. Who is opposite to B?',
        options: ['E', 'D', 'F', 'C'],
        correctOptionIndex: 0,
        explanation: 'Placing them around the 6-seat circle: A, B, C, F, E, D. Position opposite to B is E.'
      }
    ]
  },

  // 15. APTITUDE: VERBAL ABILITY
  'quiz-aptitude-verbal': {
    id: 'quiz-aptitude-verbal',
    courseId: 'course-behavioral-interview',
    title: 'Verbal Ability & Comprehension Assessment',
    questions: [
      {
        id: 'verb_q1',
        text: 'Choose the word that is nearest in meaning (synonym) to "EPHEMERAL":',
        options: ['Enduring', 'Transient', 'Permanent', 'Substantial'],
        correctOptionIndex: 1,
        explanation: '"Ephemeral" means lasting for a very short time. "Transient" is its direct synonym.'
      },
      {
        id: 'verb_q2',
        text: 'Identify the grammatically correct sentence:',
        options: [
          'Neither the manager nor the employees was available for comment.',
          'Neither the manager nor the employees were available for comment.',
          'Neither the employees nor the manager were available for comment.',
          'Neither the manager or the employees was available for comment.'
        ],
        correctOptionIndex: 1,
        explanation: 'With "neither...nor", the verb agrees with the subject closer to it. "Employees" is plural and adjacent to the verb, requiring "were".'
      },
      {
        id: 'verb_q3',
        text: 'Select the antonym for the word "METICULOUS":',
        options: ['Careful', 'Sloppy', 'Thorough', 'Diligent'],
        correctOptionIndex: 1,
        explanation: '"Meticulous" means showing great attention to detail. "Sloppy" or "careless" is its antonym.'
      },
      {
        id: 'verb_q4',
        text: 'Fill in the blank: "The CEO was reluctant to ______ the proposal until all financial audits were certified."',
        options: ['endorse', 'repudiate', 'admonish', 'nullify'],
        correctOptionIndex: 0,
        explanation: '"Endorse" (support/approve) fits the context of hesitating to approve prior to audit certification.'
      },
      {
        id: 'verb_q5',
        text: 'Choose the correctly spelled word:',
        options: ['Accomodate', 'Accommodate', 'Acommodate', 'Accomadate'],
        correctOptionIndex: 1,
        explanation: 'The correct spelling is "Accommodate" with double c and double m.'
      }
    ]
  },

  // 16. APTITUDE: DATA INTERPRETATION
  'quiz-aptitude-di': {
    id: 'quiz-aptitude-di',
    courseId: 'course-behavioral-interview',
    title: 'Data Interpretation & Analytical Charts Assessment',
    questions: [
      {
        id: 'di_q1',
        text: 'A company reports total expenses of $500,000 across 4 departments: R&D (40%), Marketing (25%), Operations (20%), and HR (15%). How much does R&D spend compared to HR?',
        options: ['$100,000 more', '$125,000 more', '$150,000 more', '$200,000 more'],
        correctOptionIndex: 1,
        explanation: 'R&D = 40% of $500k = $200k. HR = 15% of $500k = $75k. Difference = $200k - $75k = $125,000.'
      },
      {
        id: 'di_q2',
        text: 'If quarterly software sales grew from $80,000 in Q1 to $120,000 in Q2, what was the percentage increase?',
        options: ['33.3%', '40.0%', '50.0%', '66.7%'],
        correctOptionIndex: 2,
        explanation: 'Percentage Increase = ((120,000 - 80,000) / 80,000) * 100 = (40,000 / 80,000) * 100 = 50%.'
      },
      {
        id: 'di_q3',
        text: 'In a class of 60 students, the ratio of boys to girls is 3:2. If 10 more girls join the class, what is the new ratio of boys to girls?',
        options: ['3:3 (1:1)', '36:34', '18:17', '6:5'],
        correctOptionIndex: 1,
        explanation: 'Total parts = 3 + 2 = 5. Boys = (3/5)*60 = 36. Girls = (2/5)*60 = 24. With 10 girls added, girls = 34. Ratio = 36:34 (or 18:17).'
      },
      {
        id: 'di_q4',
        text: 'In a pie chart, what angle at the center represents an expenditure category that accounts for 35% of total budget?',
        options: ['105 degrees', '126 degrees', '135 degrees', '140 degrees'],
        correctOptionIndex: 1,
        explanation: 'A circle is 360 degrees. 35% of 360 = 0.35 * 360 = 126 degrees.'
      },
      {
        id: 'di_q5',
        text: 'A factory produces 450 units on Monday and 540 units on Tuesday. If 5% of Monday production and 10% of Tuesday production are defective, what is the total number of non-defective units produced over both days?',
        options: ['900', '913.5', '909', '920'],
        correctOptionIndex: 1,
        explanation: 'Monday non-defective: 450 * 0.95 = 427.5. Tuesday non-defective: 540 * 0.90 = 486. Total = 427.5 + 486 = 913.5.'
      }
    ]
  },

  // 17. COURSE QUIZZES
  'quiz-course-dsa-masterclass': {
    id: 'quiz-course-dsa-masterclass',
    courseId: 'course-dsa-masterclass',
    title: 'Data Structures & Algorithms Mastery Quiz',
    questions: [
      {
        id: 'dsaq1',
        text: 'Which algorithm is optimal for finding the shortest path in a weighted graph with non-negative edges?',
        options: ['Breadth-First Search (BFS)', 'Dijkstras Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm'],
        correctOptionIndex: 1,
        explanation: 'Dijkstras algorithm with a min-priority queue computes single-source shortest paths in O((V + E) log V) time when edge weights are non-negative.'
      },
      {
        id: 'dsaq2',
        text: 'In sliding window problems, when is the window contract condition typically triggered?',
        options: [
          'When the right pointer reaches the end of the array',
          'When the current window violates the problem constraint (e.g. distinct elements or max sum)',
          'Only when array indices are negative',
          'When the left pointer equals the right pointer'
        ],
        correctOptionIndex: 1,
        explanation: 'The contract condition is triggered whenever extending the right pointer causes the window state to violate the target invariant.'
      },
      {
        id: 'dsaq3',
        text: 'What is the worst-case space complexity of recursive DFS on a skewed binary tree of N nodes?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctOptionIndex: 2,
        explanation: 'A skewed binary tree degenerates into a singly-linked list of height N, requiring O(N) call stack frames.'
      },
      {
        id: 'dsaq4',
        text: 'Which data structure can retrieve the maximum element and insert new elements in O(log N) time?',
        options: ['Sorted Array', 'Max Heap (Priority Queue)', 'Hash Map', 'Doubly Linked List'],
        correctOptionIndex: 1,
        explanation: 'A Max Binary Heap supports O(1) peek, O(log N) insertion, and O(log N) extract-max operations.'
      }
    ]
  },

  'quiz-course-dbms-sql-optimization': {
    id: 'quiz-course-dbms-sql-optimization',
    courseId: 'course-dbms-sql-optimization',
    title: 'Relational Database Design & SQL Optimization Quiz',
    questions: [
      {
        id: 'dbq1',
        text: 'Why do B-Tree indexes typically offer faster range queries than Hash indexes in relational databases?',
        options: [
          'B-Trees store records in continuous disk blocks',
          'B-Trees keep keys sorted in leaf nodes, allowing sequential linked scan',
          'Hash indexes do not support integer values',
          'B-Trees compress table storage'
        ],
        correctOptionIndex: 1,
        explanation: 'B-Trees maintain total order over keys. Once the starting key is located in O(log N), subsequent range keys are traversed sequentially.'
      },
      {
        id: 'dbq2',
        text: 'In PostgreSQL, what does a "Seq Scan" in EXPLAIN ANALYZE indicate?',
        options: [
          'The engine utilized the primary key B-Tree index',
          'The engine read every single page and row in the table sequentially',
          'The query was answered entirely from RAM cache',
          'A deadlock occurred during execution'
        ],
        correctOptionIndex: 1,
        explanation: 'A Sequential Scan (Seq Scan) means the query planner scanned the raw heap pages sequentially because no selective index was applicable.'
      },
      {
        id: 'dbq3',
        text: 'What does the "I" in ACID guarantees represent?',
        options: ['Indexability', 'Isolation', 'Idempotency', 'Inheritance'],
        correctOptionIndex: 1,
        explanation: 'Isolation controls how changes made by one transaction become visible to other concurrent transactions.'
      }
    ]
  },

  'quiz-course-os-concurrency': {
    id: 'quiz-course-os-concurrency',
    courseId: 'course-os-concurrency',
    title: 'Operating Systems & Concurrency Quiz',
    questions: [
      {
        id: 'osq1',
        text: 'Which condition is NOT one of Coffmans four necessary conditions for Deadlock?',
        options: ['Mutual Exclusion', 'Hold and Wait', 'Preemption Allowed', 'Circular Wait'],
        correctOptionIndex: 2,
        explanation: 'Coffmans conditions require No Preemption. If preemption is allowed, deadlocks cannot form.'
      },
      {
        id: 'osq2',
        text: 'What phenomenon occurs when excessive paging causes the OS to spend more time swapping pages than executing instructions?',
        options: ['Starvation', 'Thrashing', 'Priority Inversion', 'Segmentation Fault'],
        correctOptionIndex: 1,
        explanation: 'Thrashing occurs when active working sets exceed physical memory and page fault overhead dwarfs actual computation.'
      }
    ]
  }
};
