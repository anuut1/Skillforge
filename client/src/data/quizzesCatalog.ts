import type { Quiz } from '../types';

export const ALL_QUIZZES: Record<string, Quiz> = {
  'cs-quiz': {
    id: 'cs-quiz',
    courseId: 'course-dsa-masterclass',
    title: 'Computer Science Core Diagnostics Assessment',
    questions: [
      {
        id: 'csq1',
        text: 'What is the time complexity of searching in a balanced Binary Search Tree (AVL / Red-Black Tree)?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N log N)'],
        correctOptionIndex: 1
      },
      {
        id: 'csq2',
        text: 'Which database isolation level prevents dirty reads, non-repeatable reads, AND phantom reads?',
        options: ['Read Uncommitted', 'Read Committed', 'Repeatable Read', 'Serializable'],
        correctOptionIndex: 3
      },
      {
        id: 'csq3',
        text: 'In Linux Operating Systems, which system call creates a duplicate copy of the calling process?',
        options: ['exec()', 'fork()', 'clone()', 'pthread_create()'],
        correctOptionIndex: 1
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
        correctOptionIndex: 1
      },
      {
        id: 'csq5',
        text: 'Which transport layer protocol guarantees in-order byte stream delivery with congestion control?',
        options: ['UDP', 'ICMP', 'TCP', 'IP'],
        correctOptionIndex: 2
      }
    ]
  },
  'quiz-course-dsa-masterclass': {
    id: 'quiz-course-dsa-masterclass',
    courseId: 'course-dsa-masterclass',
    title: 'Data Structures & Algorithms Mastery Quiz',
    questions: [
      {
        id: 'dsaq1',
        text: 'Which algorithm is optimal for finding the shortest path in a weighted graph with non-negative edges?',
        options: ['Breadth-First Search (BFS)', 'Dijkstras Algorithm', 'Bellman-Ford Algorithm', 'Floyd-Warshall Algorithm'],
        correctOptionIndex: 1
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
        correctOptionIndex: 1
      },
      {
        id: 'dsaq3',
        text: 'What is the worst-case space complexity of recursive DFS on a skewed binary tree of N nodes?',
        options: ['O(1)', 'O(log N)', 'O(N)', 'O(N^2)'],
        correctOptionIndex: 2
      },
      {
        id: 'dsaq4',
        text: 'Which data structure can retrieve the maximum element and insert new elements in O(log N) time?',
        options: ['Sorted Array', 'Max Heap (Priority Queue)', 'Hash Map', 'Doubly Linked List'],
        correctOptionIndex: 1
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
        correctOptionIndex: 1
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
        correctOptionIndex: 1
      },
      {
        id: 'dbq3',
        text: 'What does the "I" in ACID guarantees represent?',
        options: ['Indexability', 'Isolation', 'Idempotency', 'Inheritance'],
        correctOptionIndex: 1
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
        correctOptionIndex: 2
      },
      {
        id: 'osq2',
        text: 'What phenomenon occurs when excessive paging causes the OS to spend more time swapping pages than executing instructions?',
        options: ['Starvation', 'Thrashing', 'Priority Inversion', 'Segmentation Fault'],
        correctOptionIndex: 1
      }
    ]
  }
};
