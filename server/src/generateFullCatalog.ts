import fs from 'fs';
import path from 'path';
import { PROBLEMS_1_20 } from './problemData/problems1_20';
import { PROBLEMS_21_40 } from './problemData/problems21_40';
import { PROBLEMS_41_60 } from './problemData/problems41_60';
import { PROBLEMS_61_80 } from './problemData/problems61_80';
import { PROBLEMS_81_100 } from './problemData/problems81_100';
import { PROBLEMS_101_120 } from './problemData/problems101_120';
import { DSAProblemFull } from './problemData/types';

export const ALL_120_PROBLEMS: DSAProblemFull[] = [
  ...PROBLEMS_1_20,
  ...PROBLEMS_21_40,
  ...PROBLEMS_41_60,
  ...PROBLEMS_61_80,
  ...PROBLEMS_81_100,
  ...PROBLEMS_101_120,
];

console.log(`Aggregated ${ALL_120_PROBLEMS.length} problems for catalog compilation.`);

// Verify slug uniqueness
const seenSlugs = new Set<string>();
for (const p of ALL_120_PROBLEMS) {
  if (seenSlugs.has(p.slug)) {
    throw new Error(`Duplicate slug detected: ${p.slug}`);
  }
  seenSlugs.add(p.slug);
}

export const DSA_CATEGORIES: string[] = [
  "Arrays",
  "Strings",
  "Hashing",
  "Two Pointers",
  "Sliding Window",
  "Binary Search",
  "Sorting",
  "Linked List",
  "Stack",
  "Queue",
  "Deque",
  "Recursion",
  "Backtracking",
  "Trees",
  "Binary Search Tree",
  "Heap / Priority Queue",
  "Greedy",
  "Graphs",
  "BFS",
  "DFS",
  "Dynamic Programming",
  "Bit Manipulation",
  "Tries",
  "Intervals",
  "Matrix",
  "Math / Number Theory"
];

export function extractStarterCode(solutions: { javascript?: string; python?: string; java?: string; cpp?: string }) {
  // 1. JavaScript
  let jsStarter = 'function solve() {\n  // Write your solution here\n  \n}';
  if (solutions.javascript) {
    const lines = solutions.javascript.split('\n');
    const funcLine = lines.find(l => /^(?:async\s+)?function\s+\w+\s*\(/.test(l.trim()));
    if (funcLine) {
      const trimmed = funcLine.trim();
      const openBrace = trimmed.endsWith('{') ? '' : ' {';
      jsStarter = `${trimmed}${openBrace}\n  // Write your solution here\n  \n}`;
    }
  }

  // 2. Python
  let pyStarter = 'def solve():\n    # Write your solution here\n    pass';
  if (solutions.python) {
    const lines = solutions.python.split('\n');
    const defLine = lines.find(l => /^def\s+\w+\s*\(/.test(l.trim()));
    if (defLine) {
      const trimmed = defLine.trim();
      const colon = trimmed.endsWith(':') ? '' : ':';
      pyStarter = `${trimmed}${colon}\n    # Write your solution here\n    pass`;
    }
  }

  // 3. Java
  let javaStarter = 'class Solution {\n    public void solve() {\n        // Write your solution here\n        \n    }\n}';
  if (solutions.java) {
    const lines = solutions.java.split('\n');
    const methodLine = lines.find(l => /public\s+[\w<>\[\],\s]+\s+\w+\s*\(/.test(l.trim()));
    if (methodLine) {
      const trimmed = methodLine.trim().replace(/\s*\{$/, '');
      javaStarter = `class Solution {\n    ${trimmed} {\n        // Write your solution here\n        \n    }\n}`;
    }
  }

  // 4. C++
  let cppStarter = `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    void solve() {
        // Write your solution here
        
    }
};`;
  if (solutions.cpp) {
    const lines = solutions.cpp.split('\n');
    const methodLine = lines.find(l => /(?:vector<[\w<>]+>|int|bool|string|double|void|ListNode\*|TreeNode\*|long long)\s+\w+\s*\(/.test(l.trim()) && !l.includes('class'));
    if (methodLine) {
      const trimmed = methodLine.trim().replace(/\s*\{$/, '');
      cppStarter = `#include <vector>
#include <string>
#include <unordered_map>
#include <algorithm>
using namespace std;

class Solution {
public:
    ${trimmed} {
        // Write your solution here
        
    }
};`;
    }
  }

  return {
    javascript: jsStarter,
    python: pyStarter,
    java: javaStarter,
    cpp: cppStarter
  };
}

const catalogEntries = ALL_120_PROBLEMS.map(p => {
  const rawSolutions = (p.referenceSolution || p.starterCode || {}) as { javascript?: string; python?: string; java?: string; cpp?: string };
  const pureStarters = extractStarterCode(rawSolutions);

  return {
    title: p.title,
    slug: p.slug,
    difficulty: p.difficulty,
    category: p.category,
    description: p.description,
    examples: JSON.stringify(p.examples),
    constraints: JSON.stringify(p.constraints),
    hints: JSON.stringify(p.hints),
    starterCode: JSON.stringify(pureStarters),
    referenceSolution: JSON.stringify(rawSolutions),
    testCases: JSON.stringify(p.testCases),
    relatedSkillName: p.relatedSkillName || 'Data Structures & Algorithms (DSA)',
    contentReady: true
  };
});

const fileContent = `export interface DSAProblemItem {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: string;
  constraints: string;
  hints: string;
  starterCode: string;
  referenceSolution: string;
  testCases: string;
  relatedSkillName: string;
  contentReady: boolean;
}

export const DSA_CATEGORIES: string[] = ${JSON.stringify(DSA_CATEGORIES, null, 2)};

export const DSA_PROBLEMS_CATALOG: DSAProblemItem[] = ${JSON.stringify(catalogEntries, null, 2)};
`;

const serverDest = path.join(__dirname, 'data', 'dsaCatalog.ts');
const clientDest = path.resolve(__dirname, '..', '..', 'client', 'src', 'data', 'dsaCatalog.ts');

fs.writeFileSync(serverDest, fileContent, 'utf-8');
console.log(`[SUCCESS] Wrote ${ALL_120_PROBLEMS.length} problems to Server: ${serverDest}`);

fs.writeFileSync(clientDest, fileContent, 'utf-8');
console.log(`[SUCCESS] Wrote ${ALL_120_PROBLEMS.length} problems to Client: ${clientDest}`);
