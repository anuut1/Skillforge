import { DSAProblemFull } from './types';

export const PROBLEMS_61_80: DSAProblemFull[] = [
  {
    title: 'Power of Three',
    slug: 'power-of-three',
    difficulty: 'Easy',
    category: 'Recursion',
    description: 'Given an integer n, return true if it is a power of three. Otherwise, return false. An integer n is a power of three if there exists an integer x such that n == 3^x.',
    examples: [
      { input: 'n = 27', output: 'true', explanation: '27 = 3^3.' },
      { input: 'n = 0', output: 'false', explanation: '0 is not a power of 3.' },
      { input: 'n = -1', output: 'false', explanation: 'Negative numbers cannot be power of 3.' }
    ],
    constraints: ['-2^31 <= n <= 2^31 - 1'],
    hints: ['If n <= 0, return false.', 'Iteratively divide n by 3 while n % 3 == 0.'],
    starterCode: {
      javascript: 'function isPowerOfThree(n) {\n  if (n <= 0) return false;\n  while (n % 3 === 0) n /= 3;\n  return n === 1;\n}',
      python: 'def isPowerOfThree(n: int) -> bool:\n    if n <= 0: return False\n    while n % 3 == 0: n //= 3\n    return n == 1',
      java: 'class Solution {\n    public boolean isPowerOfThree(int n) {\n        return n > 0 && 1162261467 % n == 0;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isPowerOfThree(int n) {\n        return n > 0 && 1162261467 % n == 0;\n    }\n};'
    },
    testCases: [
      { input: '27', expectedOutput: 'true' },
      { input: '0', expectedOutput: 'false' },
      { input: '9', expectedOutput: 'true' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Pow(x, n)',
    slug: 'powx-n',
    difficulty: 'Medium',
    category: 'Recursion',
    description: 'Implement pow(x, n), which calculates x raised to the power n (i.e., x^n) in O(log n) time using binary exponentiation.',
    examples: [
      { input: 'x = 2.00000, n = 10', output: '1024.00000', explanation: '2^10 = 1024.' },
      { input: 'x = 2.10000, n = 3', output: '9.26100', explanation: '2.1^3 = 9.261.' },
      { input: 'x = 2.00000, n = -2', output: '0.25000', explanation: '2^-2 = 1/4 = 0.25.' }
    ],
    constraints: ['-100.0 < x < 100.0', '-2^31 <= n <= 2^31-1', 'n is an integer.', '-10^4 <= x^n <= 10^4'],
    hints: ['Handle negative power: x^(-n) = (1/x)^n.', 'If n is even, x^n = (x^2)^(n/2); if odd, x^n = x * (x^2)^((n-1)/2).'],
    starterCode: {
      javascript: 'function myPow(x, n) {\n  let p = n;\n  if (p < 0) { x = 1 / x; p = -p; }\n  let res = 1;\n  while (p > 0) {\n    if (p % 2 === 1) res *= x;\n    x *= x;\n    p = Math.floor(p / 2);\n  }\n  return res;\n}',
      python: 'def myPow(x: float, n: int) -> float:\n    if n < 0: x, n = 1 / x, -n\n    res = 1\n    while n > 0:\n        if n % 2 == 1: res *= x\n        x *= x\n        n //= 2\n    return res',
      java: 'class Solution {\n    public double myPow(double x, int n) {\n        long p = n;\n        if (p < 0) { x = 1 / x; p = -p; }\n        double res = 1;\n        while (p > 0) {\n            if (p % 2 == 1) res *= x;\n            x *= x;\n            p /= 2;\n        }\n        return res;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    double myPow(double x, int n) {\n        long long p = n;\n        if (p < 0) { x = 1 / x; p = -p; }\n        double res = 1;\n        while (p > 0) {\n            if (p % 2 == 1) res *= x;\n            x *= x;\n            p /= 2;\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '2.00000, 10', expectedOutput: '1024.00000' },
      { input: '2.00000, -2', expectedOutput: '0.25000' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Letter Combinations of a Phone Number',
    slug: 'letter-combinations-of-a-phone-number',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given a string containing digits from 2-9 inclusive, return all possible letter combinations that the number could represent. Return the answer in any order. A mapping of digits to letters (just like on the telephone buttons) is given.',
    examples: [
      { input: 'digits = "23"', output: '["ad","ae","af","bd","be","bf","cd","ce","cf"]', explanation: 'All combinations for 2 and 3.' },
      { input: 'digits = ""', output: '[]', explanation: 'Empty input.' }
    ],
    constraints: ['0 <= digits.length <= 4', 'digits[i] is a digit in the range [\'2\', \'9\'].'],
    hints: ['Create a phone keypad mapping (e.g., 2 -> "abc", 3 -> "def").', 'Use backtracking to build strings character by character.'],
    starterCode: {
      javascript: 'function letterCombinations(digits) {\n  if (!digits) return [];\n  const map = { "2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz" };\n  const res = [];\n  function backtrack(idx, path) {\n    if (idx === digits.length) { res.push(path); return; }\n    for (const letter of map[digits[idx]]) {\n      backtrack(idx + 1, path + letter);\n    }\n  }\n  backtrack(0, "");\n  return res;\n}',
      python: 'def letterCombinations(digits: str) -> list[str]:\n    if not digits: return []\n    mapping = {"2": "abc", "3": "def", "4": "ghi", "5": "jkl", "6": "mno", "7": "pqrs", "8": "tuv", "9": "wxyz"}\n    res = []\n    def backtrack(idx, path):\n        if idx == len(digits):\n            res.append(path)\n            return\n        for letter in mapping[digits[idx]]:\n            backtrack(idx + 1, path + letter)\n    backtrack(0, "")\n    return res',
      java: 'class Solution {\n    public java.util.List<String> letterCombinations(String digits) {\n        if (digits == null || digits.isEmpty()) return new java.util.ArrayList<>();\n        String[] map = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};\n        java.util.List<String> res = new java.util.ArrayList<>();\n        backtrack(digits, 0, new StringBuilder(), res, map);\n        return res;\n    }\n    private void backtrack(String d, int idx, StringBuilder path, java.util.List<String> res, String[] map) {\n        if (idx == d.length()) { res.add(path.toString()); return; }\n        String letters = map[d.charAt(idx) - \'0\'];\n        for (char c : letters.toCharArray()) {\n            path.append(c);\n            backtrack(d, idx + 1, path, res, map);\n            path.deleteCharAt(path.length() - 1);\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\n    vector<string> map = {"", "", "abc", "def", "ghi", "jkl", "mno", "pqrs", "tuv", "wxyz"};\n    vector<string> res;\npublic:\n    vector<string> letterCombinations(string digits) {\n        if (digits.empty()) return {};\n        string path = "";\n        backtrack(digits, 0, path);\n        return res;\n    }\n    void backtrack(const string& d, int idx, string& path) {\n        if (idx == (int)d.size()) { res.push_back(path); return; }\n        for (char c : map[d[idx] - \'0\']) {\n            path.push_back(c);\n            backtrack(d, idx + 1, path);\n            path.pop_back();\n        }\n    }\n};'
    },
    testCases: [
      { input: '"23"', expectedOutput: '["ad","ae","af","bd","be","bf","cd","ce","cf"]' },
      { input: '""', expectedOutput: '[]' },
      { input: '"2"', expectedOutput: '["a","b","c"]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Subsets',
    slug: 'subsets',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given an integer array nums of unique elements, return all possible subsets (the power set). The solution set must not contain duplicate subsets. Return the solution in any order.',
    examples: [
      { input: 'nums = [1,2,3]', output: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]', explanation: 'All 2^3 = 8 subsets.' },
      { input: 'nums = [0]', output: '[[],[0]]', explanation: 'Power set of single element.' }
    ],
    constraints: ['1 <= nums.length <= 10', '-10 <= nums[i] <= 10', 'All the numbers of nums are unique.'],
    hints: ['At each step, push a copy of current path to result.', 'Iterate from start to len(nums), pick nums[i], recurse with i + 1, and backtrack.'],
    starterCode: {
      javascript: 'function subsets(nums) {\n  const res = [];\n  function backtrack(start, path) {\n    res.push([...path]);\n    for (let i = start; i < nums.length; i++) {\n      path.push(nums[i]);\n      backtrack(i + 1, path);\n      path.pop();\n    }\n  }\n  backtrack(0, []);\n  return res;\n}',
      python: 'def subsets(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(start, path):\n        res.append(list(path))\n        for i in range(start, len(nums)):\n            path.append(nums[i])\n            backtrack(i + 1, path)\n            path.pop()\n    backtrack(0, [])\n    return res',
      java: 'class Solution {\n    public java.util.List<java.util.List<Integer>> subsets(int[] nums) {\n        java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();\n        backtrack(0, nums, new java.util.ArrayList<>(), res);\n        return res;\n    }\n    private void backtrack(int start, int[] nums, java.util.List<Integer> path, java.util.List<java.util.List<Integer>> res) {\n        res.add(new java.util.ArrayList<>(path));\n        for (int i = start; i < nums.length; i++) {\n            path.add(nums[i]);\n            backtrack(i + 1, nums, path, res);\n            path.remove(path.size() - 1);\n        }\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> subsets(vector<int>& nums) {\n        vector<vector<int>> res;\n        vector<int> path;\n        auto backtrack = [&](auto& self, int start) -> void {\n            res.push_back(path);\n            for (size_t i = start; i < nums.size(); i++) {\n                path.push_back(nums[i]);\n                self(self, i + 1);\n                path.pop_back();\n            }\n        };\n        backtrack(backtrack, 0);\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3]', expectedOutput: '[[],[1],[2],[1,2],[3],[1,3],[2,3],[1,2,3]]' },
      { input: '[0]', expectedOutput: '[[],[0]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Permutations',
    slug: 'permutations',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given an array nums of distinct integers, return all the possible permutations. You can return the answer in any order.',
    examples: [
      { input: 'nums = [1,2,3]', output: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]', explanation: 'All 3! = 6 permutations.' },
      { input: 'nums = [0,1]', output: '[[0,1],[1,0]]', explanation: 'All permutations of [0,1].' }
    ],
    constraints: ['1 <= nums.length <= 6', '-10 <= nums[i] <= 10', 'All the integers of nums are unique.'],
    hints: ['Maintain a boolean visited array to avoid reusing the same number.', 'When path.length == nums.length, save current permutation.'],
    starterCode: {
      javascript: 'function permute(nums) {\n  const res = [];\n  const used = new Array(nums.length).fill(false);\n  function backtrack(path) {\n    if (path.length === nums.length) { res.push([...path]); return; }\n    for (let i = 0; i < nums.length; i++) {\n      if (used[i]) continue;\n      used[i] = true;\n      path.push(nums[i]);\n      backtrack(path);\n      path.pop();\n      used[i] = false;\n    }\n  }\n  backtrack([]);\n  return res;\n}',
      python: 'def permute(nums: list[int]) -> list[list[int]]:\n    res = []\n    def backtrack(path, used):\n        if len(path) == len(nums):\n            res.append(list(path))\n            return\n        for i, n in enumerate(nums):\n            if used[i]: continue\n            used[i] = True\n            path.append(n)\n            backtrack(path, used)\n            path.pop()\n            used[i] = False\n    backtrack([], [False] * len(nums))\n    return res',
      java: 'class Solution {\n    public java.util.List<java.util.List<Integer>> permute(int[] nums) {\n        java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();\n        backtrack(nums, new boolean[nums.length], new java.util.ArrayList<>(), res);\n        return res;\n    }\n    private void backtrack(int[] nums, boolean[] used, java.util.List<Integer> path, java.util.List<java.util.List<Integer>> res) {\n        if (path.size() == nums.length) { res.add(new java.util.ArrayList<>(path)); return; }\n        for (int i = 0; i < nums.length; i++) {\n            if (used[i]) continue;\n            used[i] = true;\n            path.add(nums[i]);\n            backtrack(nums, used, path, res);\n            path.remove(path.size() - 1);\n            used[i] = false;\n        }\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> permute(vector<int>& nums) {\n        vector<vector<int>> res;\n        vector<int> path;\n        vector<bool> used(nums.size(), false);\n        auto backtrack = [&](auto& self) -> void {\n            if (path.size() == nums.size()) { res.push_back(path); return; }\n            for (size_t i = 0; i < nums.size(); i++) {\n                if (used[i]) continue;\n                used[i] = true; path.push_back(nums[i]);\n                self(self);\n                path.pop_back(); used[i] = false;\n            }\n        };\n        backtrack(backtrack);\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3]', expectedOutput: '[[1,2,3],[1,3,2],[2,1,3],[2,3,1],[3,1,2],[3,2,1]]' },
      { input: '[0,1]', expectedOutput: '[[0,1],[1,0]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Combination Sum',
    slug: 'combination-sum',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given an array of distinct integers candidates and a target integer target, return a list of all unique combinations of candidates where the chosen numbers sum to target. You may return the combinations in any order. The same number may be chosen from candidates an unlimited number of times.',
    examples: [
      { input: 'candidates = [2,3,6,7], target = 7', output: '[[2,2,3],[7]]', explanation: '2+2+3=7, 7=7.' },
      { input: 'candidates = [2,3,5], target = 8', output: '[[2,2,2,2],[2,3,3],[3,5]]', explanation: 'All unique combinations summing to 8.' }
    ],
    constraints: ['1 <= candidates.length <= 30', '2 <= candidates[i] <= 40', 'All elements of candidates are distinct.', '1 <= target <= 40'],
    hints: ['Sort candidates in ascending order to enable early pruning.', 'In recursion, allow picking the same element at index i again (remain - candidates[i]).'],
    starterCode: {
      javascript: 'function combinationSum(candidates, target) {\n  candidates.sort((a, b) => a - b);\n  const res = [];\n  function backtrack(start, remain, path) {\n    if (remain === 0) { res.push([...path]); return; }\n    for (let i = start; i < candidates.length; i++) {\n      if (candidates[i] > remain) break;\n      path.push(candidates[i]);\n      backtrack(i, remain - candidates[i], path);\n      path.pop();\n    }\n  }\n  backtrack(0, target, []);\n  return res;\n}',
      python: 'def combinationSum(candidates: list[int], target: int) -> list[list[int]]:\n    candidates.sort()\n    res = []\n    def backtrack(start, remain, path):\n        if remain == 0:\n            res.append(list(path))\n            return\n        for i in range(start, len(candidates)):\n            if candidates[i] > remain: break\n            path.append(candidates[i])\n            backtrack(i, remain - candidates[i], path)\n            path.pop()\n    backtrack(0, target, [])\n    return res',
      java: 'class Solution {\n    public java.util.List<java.util.List<Integer>> combinationSum(int[] candidates, int target) {\n        java.util.Arrays.sort(candidates);\n        java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();\n        backtrack(0, candidates, target, new java.util.ArrayList<>(), res);\n        return res;\n    }\n    private void backtrack(int start, int[] c, int remain, java.util.List<Integer> path, java.util.List<java.util.List<Integer>> res) {\n        if (remain == 0) { res.add(new java.util.ArrayList<>(path)); return; }\n        for (int i = start; i < c.length; i++) {\n            if (c[i] > remain) break;\n            path.add(c[i]);\n            backtrack(i, c, remain - c[i], path, res);\n            path.remove(path.size() - 1);\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> combinationSum(vector<int>& candidates, int target) {\n        sort(candidates.begin(), candidates.end());\n        vector<vector<int>> res;\n        vector<int> path;\n        auto backtrack = [&](auto& self, int start, int remain) -> void {\n            if (remain == 0) { res.push_back(path); return; }\n            for (size_t i = start; i < candidates.size(); i++) {\n                if (candidates[i] > remain) break;\n                path.push_back(candidates[i]);\n                self(self, i, remain - candidates[i]);\n                path.pop_back();\n            }\n        };\n        backtrack(backtrack, 0, target);\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[2,3,6,7], 7', expectedOutput: '[[2,2,3],[7]]' },
      { input: '[2,3,5], 8', expectedOutput: '[[2,2,2,2],[2,3,3],[3,5]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Word Search',
    slug: 'word-search',
    difficulty: 'Medium',
    category: 'Backtracking',
    description: 'Given an m x n grid of characters board and a string word, return true if word exists in the grid. The word can be constructed from letters of sequentially adjacent cells, where adjacent cells are horizontally or vertically neighboring. The same letter cell may not be used more than once.',
    examples: [
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCCED"', output: 'true', explanation: 'Word exists sequentially.' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "SEE"', output: 'true', explanation: 'Word exists.' },
      { input: 'board = [["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], word = "ABCB"', output: 'false', explanation: 'Cannot reuse cell "B".' }
    ],
    constraints: ['m == board.length', 'n = board[i].length', '1 <= m, n <= 6', '1 <= word.length <= 15', 'board and word consist of only lowercase and uppercase English letters.'],
    hints: ['DFS from every cell that matches word[0].', 'Mark cell as visited (e.g., board[r][c] = \'#\') during recursion and restore character upon backtracking.'],
    starterCode: {
      javascript: 'function exist(board, word) {\n  const m = board.length, n = board[0].length;\n  function dfs(r, c, k) {\n    if (k === word.length) return true;\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== word[k]) return false;\n    const temp = board[r][c];\n    board[r][c] = "#";\n    const found = dfs(r + 1, c, k + 1) || dfs(r - 1, c, k + 1) || dfs(r, c + 1, k + 1) || dfs(r, c - 1, k + 1);\n    board[r][c] = temp;\n    return found;\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (dfs(r, c, 0)) return true;\n    }\n  }\n  return false;\n}',
      python: 'def exist(board: list[list[str]], word: str) -> bool:\n    m, n = len(board), len(board[0])\n    def dfs(r, c, k):\n        if k == len(word): return True\n        if not (0 <= r < m and 0 <= c < n) or board[r][c] != word[k]: return False\n        temp = board[r][c]\n        board[r][c] = "#"\n        found = dfs(r+1, c, k+1) or dfs(r-1, c, k+1) or dfs(r, c+1, k+1) or dfs(r, c-1, k+1)\n        board[r][c] = temp\n        return found\n    return any(dfs(r, c, 0) for r in range(m) for c in range(n))',
      java: 'class Solution {\n    public boolean exist(char[][] board, String word) {\n        int m = board.length, n = board[0].length;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (dfs(board, word, r, c, 0)) return true;\n            }\n        }\n        return false;\n    }\n    private boolean dfs(char[][] b, String w, int r, int c, int k) {\n        if (k == w.length()) return true;\n        if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != w.charAt(k)) return false;\n        char temp = b[r][c];\n        b[r][c] = \'#\';\n        boolean found = dfs(b, w, r + 1, c, k + 1) || dfs(b, w, r - 1, c, k + 1) || dfs(b, w, r, c + 1, k + 1) || dfs(b, w, r, c - 1, k + 1);\n        b[r][c] = temp;\n        return found;\n    }\n}',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool exist(vector<vector<char>>& board, string word) {\n        int m = board.size(), n = board[0].size();\n        auto dfs = [&](auto& self, int r, int c, int k) -> bool {\n            if (k == (int)word.size()) return true;\n            if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != word[k]) return false;\n            char temp = board[r][c];\n            board[r][c] = \'#\';\n            bool found = self(self, r+1, c, k+1) || self(self, r-1, c, k+1) || self(self, r, c+1, k+1) || self(self, r, c-1, k+1);\n            board[r][c] = temp;\n            return found;\n        };\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                if (dfs(dfs, r, c, 0)) return true;\n        return false;\n    }\n};'
    },
    testCases: [
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCCED"', expectedOutput: 'true' },
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "SEE"', expectedOutput: 'true' },
      { input: '[["A","B","C","E"],["S","F","C","S"],["A","D","E","E"]], "ABCB"', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'N-Queens',
    slug: 'n-queens',
    difficulty: 'Hard',
    category: 'Backtracking',
    description: 'The n-queens puzzle is the problem of placing n queens on an n x n chessboard such that no two queens attack each other. Given an integer n, return all distinct solutions to the n-queens puzzle in any order.',
    examples: [
      { input: 'n = 4', output: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]', explanation: '4-Queens valid chessboard configurations.' },
      { input: 'n = 1', output: '[["Q"]]', explanation: 'Single queen on 1x1 board.' }
    ],
    constraints: ['1 <= n <= 9'],
    hints: ['Track attacked columns, diagonal (r - c), and anti-diagonal (r + c) in Sets.', 'Place queens row by row.'],
    starterCode: {
      javascript: 'function solveNQueens(n) {\n  const res = [];\n  const cols = new Set(), diag1 = new Set(), diag2 = new Set();\n  const board = Array.from({ length: n }, () => new Array(n).fill("."));\n  function backtrack(r) {\n    if (r === n) { res.push(board.map(row => row.join(""))); return; }\n    for (let c = 0; c < n; c++) {\n      if (cols.has(c) || diag1.has(r - c) || diag2.has(r + c)) continue;\n      cols.add(c); diag1.add(r - c); diag2.add(r + c);\n      board[r][c] = "Q";\n      backtrack(r + 1);\n      board[r][c] = ".";\n      cols.delete(c); diag1.delete(r - c); diag2.delete(r + c);\n    }\n  }\n  backtrack(0);\n  return res;\n}',
      python: 'def solveNQueens(n: int) -> list[list[str]]:\n    res = []\n    cols, diag1, diag2 = set(), set(), set()\n    board = [["."] * n for _ in range(n)]\n    def backtrack(r):\n        if r == n:\n            res.append(["".join(row) for row in board])\n            return\n        for c in range(n):\n            if c in cols or (r - c) in diag1 or (r + c) in diag2: continue\n            cols.add(c); diag1.add(r - c); diag2.add(r + c)\n            board[r][c] = "Q"\n            backtrack(r + 1)\n            board[r][c] = "."\n            cols.remove(c); diag1.remove(r - c); diag2.remove(r + c)\n    backtrack(0)\n    return res',
      java: 'class Solution {\n    public java.util.List<java.util.List<String>> solveNQueens(int n) {\n        java.util.List<java.util.List<String>> res = new java.util.ArrayList<>();\n        char[][] board = new char[n][n];\n        for (char[] row : board) java.util.Arrays.fill(row, \'.\');\n        boolean[] cols = new boolean[n], d1 = new boolean[2 * n], d2 = new boolean[2 * n];\n        backtrack(0, n, board, cols, d1, d2, res);\n        return res;\n    }\n    private void backtrack(int r, int n, char[][] b, boolean[] cols, boolean[] d1, boolean[] d2, java.util.List<java.util.List<String>> res) {\n        if (r == n) {\n            java.util.List<String> list = new java.util.ArrayList<>();\n            for (char[] row : b) list.add(new String(row));\n            res.add(list);\n            return;\n        }\n        for (int c = 0; c < n; c++) {\n            int id1 = r - c + n, id2 = r + c;\n            if (cols[c] || d1[id1] || d2[id2]) continue;\n            cols[c] = d1[id1] = d2[id2] = true;\n            b[r][c] = \'Q\';\n            backtrack(r + 1, n, b, cols, d1, d2, res);\n            b[r][c] = \'.\';\n            cols[c] = d1[id1] = d2[id2] = false;\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> solveNQueens(int n) {\n        vector<vector<string>> res;\n        vector<string> board(n, string(n, \'.\'));\n        vector<bool> cols(n, false), d1(2 * n, false), d2(2 * n, false);\n        auto backtrack = [&](auto& self, int r) -> void {\n            if (r == n) { res.push_back(board); return; }\n            for (int c = 0; c < n; c++) {\n                int id1 = r - c + n, id2 = r + c;\n                if (cols[c] || d1[id1] || d2[id2]) continue;\n                cols[c] = d1[id1] = d2[id2] = true;\n                board[r][c] = \'Q\';\n                self(self, r + 1);\n                board[r][c] = \'.\';\n                cols[c] = d1[id1] = d2[id2] = false;\n            }\n        };\n        backtrack(backtrack, 0);\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '4', expectedOutput: '[[".Q..","...Q","Q...","..Q."],["..Q.","Q...","...Q",".Q.."]]' },
      { input: '1', expectedOutput: '[["Q"]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Sudoku Solver',
    slug: 'sudoku-solver',
    difficulty: 'Hard',
    category: 'Backtracking',
    description: 'Write a program to solve a Sudoku puzzle by filling the empty cells (represented by \'.\'). A sudoku solution must satisfy: each row, each column, and each of the nine 3x3 sub-boxes must contain digits 1-9 without repetition.',
    examples: [
      { input: 'board = [["5","3",".",".","7",".",".",".","."],["6",".",".","1","9","5",".",".","."],[".","9","8",".",".",".",".","6","."],["8",".",".",".","6",".",".",".","3"],["4",".",".","8",".","3",".",".","1"],["7",".",".",".","2",".",".",".","6"],[".","6",".",".",".",".","2","8","."],[".",".",".","4","1","9",".",".","5"],[".",".",".",".","8",".",".","7","9"]]', output: 'board solved in-place', explanation: 'Sudoku matrix successfully completed.' }
    ],
    constraints: ['board.length == 9', 'board[i].length == 9', 'board[i][j] is a digit or \'.\'.', 'It is guaranteed that the input board has only one solution.'],
    hints: ['Iterate through cells; for the first empty cell \'.\', try placing digits \'1\' through \'9\'.', 'Validate placement against row, col, and 3x3 box. Recurse and return true if puzzle completes.'],
    starterCode: {
      javascript: 'function solveSudoku(board) {\n  function isValid(r, c, ch) {\n    for (let i = 0; i < 9; i++) {\n      if (board[r][i] === ch || board[i][c] === ch) return false;\n      const br = 3 * Math.floor(r / 3) + Math.floor(i / 3);\n      const bc = 3 * Math.floor(c / 3) + (i % 3);\n      if (board[br][bc] === ch) return false;\n    }\n    return true;\n  }\n  function solve() {\n    for (let r = 0; r < 9; r++) {\n      for (let c = 0; c < 9; c++) {\n        if (board[r][c] === ".") {\n          for (let d = 1; d <= 9; d++) {\n            const ch = String(d);\n            if (isValid(r, c, ch)) {\n              board[r][c] = ch;\n              if (solve()) return true;\n              board[r][c] = ".";\n            }\n          }\n          return false;\n        }\n      }\n    }\n    return true;\n  }\n  solve();\n  return board;\n}',
      python: 'def solveSudoku(board: list[list[str]]) -> None:\n    def is_valid(r, c, ch):\n        for i in range(9):\n            if board[r][i] == ch or board[i][c] == ch: return False\n            if board[3 * (r // 3) + i // 3][3 * (c // 3) + i % 3] == ch: return False\n        return True\n    def solve():\n        for r in range(9):\n            for c in range(9):\n                if board[r][c] == ".":\n                    for d in map(str, range(1, 10)):\n                        if is_valid(r, c, d):\n                            board[r][c] = d\n                            if solve(): return True\n                            board[r][c] = "."\n                    return False\n        return True\n    solve()',
      java: 'class Solution {\n    public void solveSudoku(char[][] board) {\n        solve(board);\n    }\n    private boolean solve(char[][] b) {\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                if (b[r][c] == \'.\') {\n                    for (char ch = \'1\'; ch <= \'9\'; ch++) {\n                        if (isValid(b, r, c, ch)) {\n                            b[r][c] = ch;\n                            if (solve(b)) return true;\n                            b[r][c] = \'.\';\n                        }\n                    }\n                    return false;\n                }\n            }\n        }\n        return true;\n    }\n    private boolean isValid(char[][] b, int r, int c, char ch) {\n        for (int i = 0; i < 9; i++) {\n            if (b[r][i] == ch || b[i][c] == ch) return false;\n            if (b[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == ch) return false;\n        }\n        return true;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solveSudoku(vector<vector<char>>& board) {\n        solve(board);\n    }\n    bool solve(vector<vector<char>>& b) {\n        for (int r = 0; r < 9; r++) {\n            for (int c = 0; c < 9; c++) {\n                if (b[r][c] == \'.\') {\n                    for (char ch = \'1\'; ch <= \'9\'; ch++) {\n                        if (isValid(b, r, c, ch)) {\n                            b[r][c] = ch;\n                            if (solve(b)) return true;\n                            b[r][c] = \'.\';\n                        }\n                    }\n                    return false;\n                }\n            }\n        }\n        return true;\n    }\n    bool isValid(const vector<vector<char>>& b, int r, int c, char ch) {\n        for (int i = 0; i < 9; i++) {\n            if (b[r][i] == ch || b[i][c] == ch) return false;\n            if (b[3 * (r / 3) + i / 3][3 * (c / 3) + i % 3] == ch) return false;\n        }\n        return true;\n    }\n};'
    },
    testCases: [
      { input: '9x9 valid Sudoku board', expectedOutput: 'Solved in-place' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Maximum Depth of Binary Tree',
    slug: 'maximum-depth-of-binary-tree',
    difficulty: 'Easy',
    category: 'Trees',
    description: 'Given the root of a binary tree, return its maximum depth. A binary tree\'s maximum depth is the number of nodes along the longest path from the root node down to the farthest leaf node.',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '3', explanation: 'Longest path 3->20->15 has 3 nodes.' },
      { input: 'root = [1,null,2]', output: '2', explanation: 'Path 1->2 has 2 nodes.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-100 <= Node.val <= 100'],
    hints: ['If root is null, return 0.', 'Recursively return 1 + max(maxDepth(root.left), maxDepth(root.right)).'],
    starterCode: {
      javascript: 'function maxDepth(root) {\n  if (!root) return 0;\n  return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n}',
      python: 'def maxDepth(root) -> int:\n    if not root: return 0\n    return 1 + max(maxDepth(root.left), maxDepth(root.right))',
      java: 'class Solution {\n    public int maxDepth(TreeNode root) {\n        if (root == null) return 0;\n        return 1 + Math.max(maxDepth(root.left), maxDepth(root.right));\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int maxDepth(TreeNode* root) {\n        if (!root) return 0;\n        return 1 + max(maxDepth(root->left), maxDepth(root->right));\n    }\n};'
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '3' },
      { input: '[1,null,2]', expectedOutput: '2' },
      { input: '[]', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Invert Binary Tree',
    slug: 'invert-binary-tree',
    difficulty: 'Easy',
    category: 'Trees',
    description: 'Given the root of a binary tree, invert the tree, and return its root.',
    examples: [
      { input: 'root = [4,2,7,1,3,6,9]', output: '[4,7,2,9,6,3,1]', explanation: 'Left and right children mirrored.' },
      { input: 'root = [2,1,3]', output: '[2,3,1]', explanation: 'Children swapped.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 100].', '-100 <= Node.val <= 100'],
    hints: ['Base case: if root is null, return null.', 'Swap root.left and root.right, then recursively invert both subtrees.'],
    starterCode: {
      javascript: 'function invertTree(root) {\n  if (!root) return null;\n  const temp = root.left;\n  root.left = invertTree(root.right);\n  root.right = invertTree(temp);\n  return root;\n}',
      python: 'def invertTree(root):\n    if not root: return None\n    root.left, root.right = invertTree(root.right), invertTree(root.left)\n    return root',
      java: 'class Solution {\n    public TreeNode invertTree(TreeNode root) {\n        if (root == null) return null;\n        TreeNode temp = root.left;\n        root.left = invertTree(root.right);\n        root.right = invertTree(temp);\n        return root;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    TreeNode* invertTree(TreeNode* root) {\n        if (!root) return nullptr;\n        TreeNode* temp = root->left;\n        root->left = invertTree(root->right);\n        root->right = invertTree(temp);\n        return root;\n    }\n};'
    },
    testCases: [
      { input: '[4,2,7,1,3,6,9]', expectedOutput: '[4,7,2,9,6,3,1]' },
      { input: '[2,1,3]', expectedOutput: '[2,3,1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Same Tree',
    slug: 'same-tree',
    difficulty: 'Easy',
    category: 'Trees',
    description: 'Given the roots of two binary trees p and q, write a function to check if they are the same or not. Two binary trees are considered the same if they are structurally identical, and the nodes have the same value.',
    examples: [
      { input: 'p = [1,2,3], q = [1,2,3]', output: 'true', explanation: 'Both trees are identical in structure and values.' },
      { input: 'p = [1,2], q = [1,null,2]', output: 'false', explanation: 'Structural mismatch.' }
    ],
    constraints: ['The number of nodes in both trees is in the range [0, 100].', '-10^4 <= Node.val <= 10^4'],
    hints: ['If both p and q are null, return true.', 'If only one is null or p.val != q.val, return false. Otherwise, verify left and right subtrees.'],
    starterCode: {
      javascript: 'function isSameTree(p, q) {\n  if (!p && !q) return true;\n  if (!p || !q || p.val !== q.val) return false;\n  return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n}',
      python: 'def isSameTree(p, q) -> bool:\n    if not p and not q: return True\n    if not p or not q or p.val != q.val: return False\n    return isSameTree(p.left, q.left) and isSameTree(p.right, q.right)',
      java: 'class Solution {\n    public boolean isSameTree(TreeNode p, TreeNode q) {\n        if (p == null && q == null) return true;\n        if (p == null || q == null || p.val != q.val) return false;\n        return isSameTree(p.left, q.left) && isSameTree(p.right, q.right);\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isSameTree(TreeNode* p, TreeNode* q) {\n        if (!p && !q) return true;\n        if (!p || !q || p->val != q->val) return false;\n        return isSameTree(p->left, q->left) && isSameTree(p->right, q->right);\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3], [1,2,3]', expectedOutput: 'true' },
      { input: '[1,2], [1,null,2]', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Binary Tree Level Order Traversal',
    slug: 'binary-tree-level-order-traversal',
    difficulty: 'Medium',
    category: 'Trees',
    description: 'Given the root of a binary tree, return the level order traversal of its nodes\' values (i.e., from left to right, level by level).',
    examples: [
      { input: 'root = [3,9,20,null,null,15,7]', output: '[[3],[9,20],[15,7]]', explanation: 'BFS level-order traversal.' },
      { input: 'root = [1]', output: '[[1]]', explanation: 'Single node.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 2000].', '-1000 <= Node.val <= 1000'],
    hints: ['Use a queue to perform Breadth-First Search.', 'At each level, record queue length and process all nodes in the current tier into a list.'],
    starterCode: {
      javascript: 'function levelOrder(root) {\n  if (!root) return [];\n  const res = [], queue = [root];\n  while (queue.length) {\n    const levelSize = queue.length, level = [];\n    for (let i = 0; i < levelSize; i++) {\n      const node = queue.shift();\n      level.push(node.val);\n      if (node.left) queue.push(node.left);\n      if (node.right) queue.push(node.right);\n    }\n    res.push(level);\n  }\n  return res;\n}',
      python: 'from collections import deque\n\ndef levelOrder(root) -> list[list[int]]:\n    if not root: return []\n    res = []\n    q = deque([root])\n    while q:\n        level = []\n        for _ in range(len(q)):\n            node = q.popleft()\n            level.append(node.val)\n            if node.left: q.append(node.left)\n            if node.right: q.append(node.right)\n        res.append(level)\n    return res',
      java: 'class Solution {\n    public java.util.List<java.util.List<Integer>> levelOrder(TreeNode root) {\n        java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();\n        if (root == null) return res;\n        java.util.Queue<TreeNode> q = new java.util.LinkedList<>();\n        q.offer(root);\n        while (!q.isEmpty()) {\n            int sz = q.size();\n            java.util.List<Integer> level = new java.util.ArrayList<>();\n            for (int i = 0; i < sz; i++) {\n                TreeNode node = q.poll();\n                level.add(node.val);\n                if (node.left != null) q.offer(node.left);\n                if (node.right != null) q.offer(node.right);\n            }\n            res.add(level);\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> levelOrder(TreeNode* root) {\n        if (!root) return {};\n        vector<vector<int>> res;\n        queue<TreeNode*> q;\n        q.push(root);\n        while (!q.empty()) {\n            int sz = q.size();\n            vector<int> level;\n            for (int i = 0; i < sz; i++) {\n                TreeNode* node = q.front(); q.pop();\n                level.push_back(node->val);\n                if (node->left) q.push(node->left);\n                if (node->right) q.push(node->right);\n            }\n            res.push_back(level);\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[3,9,20,null,null,15,7]', expectedOutput: '[[3],[9,20],[15,7]]' },
      { input: '[1]', expectedOutput: '[[1]]' },
      { input: '[]', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Lowest Common Ancestor of a Binary Tree',
    slug: 'lowest-common-ancestor-of-a-binary-tree',
    difficulty: 'Medium',
    category: 'Trees',
    description: 'Given a binary tree, find the lowest common ancestor (LCA) of two given nodes p and q in the tree. The lowest common ancestor is defined between two nodes p and q as the lowest node in T that has both p and q as descendants (where a node can be a descendant of itself).',
    examples: [
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 1', output: '3', explanation: 'LCA of 5 and 1 is 3.' },
      { input: 'root = [3,5,1,6,2,0,8,null,null,7,4], p = 5, q = 4', output: '5', explanation: 'LCA of 5 and 4 is 5 itself.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [2, 10^5].', '-10^9 <= Node.val <= 10^9', 'All Node.val are unique.', 'p != q and both p and q exist in the tree.'],
    hints: ['If root is null or root === p or root === q, return root.', 'Search left and right subtrees. If both return non-null, root is the LCA.'],
    starterCode: {
      javascript: 'function lowestCommonAncestor(root, p, q) {\n  if (!root || root === p || root === q) return root;\n  const left = lowestCommonAncestor(root.left, p, q);\n  const right = lowestCommonAncestor(root.right, p, q);\n  if (left && right) return root;\n  return left || right;\n}',
      python: 'def lowestCommonAncestor(root, p, q):\n    if not root or root == p or root == q: return root\n    left = lowestCommonAncestor(root.left, p, q)\n    right = lowestCommonAncestor(root.right, p, q)\n    if left and right: return root\n    return left or right',
      java: 'class Solution {\n    public TreeNode lowestCommonAncestor(TreeNode root, TreeNode p, TreeNode q) {\n        if (root == null || root == p || root == q) return root;\n        TreeNode left = lowestCommonAncestor(root.left, p, q);\n        TreeNode right = lowestCommonAncestor(root.right, p, q);\n        if (left != null && right != null) return root;\n        return left != null ? left : right;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    TreeNode* lowestCommonAncestor(TreeNode* root, TreeNode* p, TreeNode* q) {\n        if (!root || root == p || root == q) return root;\n        TreeNode* left = lowestCommonAncestor(root->left, p, q);\n        TreeNode* right = lowestCommonAncestor(root->right, p, q);\n        if (left && right) return root;\n        return left ? left : right;\n    }\n};'
    },
    testCases: [
      { input: '[3,5,1,6,2,0,8,null,null,7,4], 5, 1', expectedOutput: '3' },
      { input: '[3,5,1,6,2,0,8,null,null,7,4], 5, 4', expectedOutput: '5' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Construct Binary Tree from Preorder and Inorder Traversal',
    slug: 'construct-binary-tree-from-preorder-and-inorder-traversal',
    difficulty: 'Medium',
    category: 'Trees',
    description: 'Given two integer arrays preorder and inorder where preorder is the preorder traversal of a binary tree and inorder is the inorder traversal of the same tree, construct and return the binary tree.',
    examples: [
      { input: 'preorder = [3,9,20,15,7], inorder = [9,3,15,20,7]', output: '[3,9,20,null,null,15,7]', explanation: 'Reconstructed binary tree.' },
      { input: 'preorder = [-1], inorder = [-1]', output: '[-1]', explanation: 'Single root node.' }
    ],
    constraints: ['1 <= preorder.length <= 3000', 'inorder.length == preorder.length', '-3000 <= preorder[i], inorder[i] <= 3000', 'preorder and inorder consist of unique values.'],
    hints: ['preorder[0] is the root value.', 'Find root in inorder: elements to the left form the left subtree; elements to the right form the right subtree.'],
    starterCode: {
      javascript: 'function buildTree(preorder, inorder) {\n  const inMap = new Map();\n  inorder.forEach((val, i) => inMap.set(val, i));\n  let preIdx = 0;\n  function build(l, r) {\n    if (l > r) return null;\n    const rootVal = preorder[preIdx++];\n    const root = { val: rootVal, left: null, right: null };\n    const mid = inMap.get(rootVal);\n    root.left = build(l, mid - 1);\n    root.right = build(mid + 1, r);\n    return root;\n  }\n  return build(0, inorder.length - 1);\n}',
      python: 'def buildTree(preorder: list[int], inorder: list[int]):\n    in_map = {val: i for i, val in enumerate(inorder)}\n    pre_idx = 0\n    def build(l, r):\n        nonlocal pre_idx\n        if l > r: return None\n        val = preorder[pre_idx]\n        pre_idx += 1\n        root = TreeNode(val)\n        mid = in_map[val]\n        root.left = build(l, mid - 1)\n        root.right = build(mid + 1, r)\n        return root\n    return build(0, len(inorder) - 1)',
      java: 'class Solution {\n    private int preIdx = 0;\n    public TreeNode buildTree(int[] preorder, int[] inorder) {\n        java.util.Map<Integer, Integer> inMap = new java.util.HashMap<>();\n        for (int i = 0; i < inorder.length; i++) inMap.put(inorder[i], i);\n        return build(preorder, inMap, 0, inorder.length - 1);\n    }\n    private TreeNode build(int[] pre, java.util.Map<Integer, Integer> inMap, int l, int r) {\n        if (l > r) return null;\n        int val = pre[preIdx++];\n        TreeNode root = new TreeNode(val);\n        int mid = inMap.get(val);\n        root.left = build(pre, inMap, l, mid - 1);\n        root.right = build(pre, inMap, mid + 1, r);\n        return root;\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\n    int preIdx = 0;\n    unordered_map<int, int> inMap;\npublic:\n    TreeNode* buildTree(vector<int>& preorder, vector<int>& inorder) {\n        for (size_t i = 0; i < inorder.size(); i++) inMap[inorder[i]] = i;\n        return build(preorder, 0, inorder.size() - 1);\n    }\n    TreeNode* build(const vector<int>& pre, int l, int r) {\n        if (l > r) return nullptr;\n        int val = pre[preIdx++];\n        TreeNode* root = new TreeNode(val);\n        int mid = inMap[val];\n        root->left = build(pre, l, mid - 1);\n        root->right = build(pre, mid + 1, r);\n        return root;\n    }\n};'
    },
    testCases: [
      { input: '[3,9,20,15,7], [9,3,15,20,7]', expectedOutput: '[3,9,20,null,null,15,7]' },
      { input: '[-1], [-1]', expectedOutput: '[-1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Binary Tree Maximum Path Sum',
    slug: 'binary-tree-maximum-path-sum',
    difficulty: 'Hard',
    category: 'Trees',
    description: 'A path in a binary tree is a sequence of nodes where each pair of adjacent nodes in the sequence has an edge connecting them. A node can only appear in the sequence at most once. Given the root of a binary tree, return the maximum path sum of any non-empty path.',
    examples: [
      { input: 'root = [1,2,3]', output: '6', explanation: 'Path 2 -> 1 -> 3 has path sum 2 + 1 + 3 = 6.' },
      { input: 'root = [-10,9,20,null,null,15,7]', output: '42', explanation: 'Path 15 -> 20 -> 7 has path sum 15 + 20 + 7 = 42.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [1, 3 * 10^4].', '-1000 <= Node.val <= 1000'],
    hints: ['Compute max single branch sum from each node: max(0, dfs(node.left)) and max(0, dfs(node.right)).', 'Update global max path sum with node.val + leftMax + rightMax.'],
    starterCode: {
      javascript: 'function maxPathSum(root) {\n  let maxSum = -Infinity;\n  function maxGain(node) {\n    if (!node) return 0;\n    const leftGain = Math.max(0, maxGain(node.left));\n    const rightGain = Math.max(0, maxGain(node.right));\n    maxSum = Math.max(maxSum, node.val + leftGain + rightGain);\n    return node.val + Math.max(leftGain, rightGain);\n  }\n  maxGain(root);\n  return maxSum;\n}',
      python: 'def maxPathSum(root) -> int:\n    max_sum = float("-inf")\n    def max_gain(node):\n        nonlocal max_sum\n        if not node: return 0\n        left = max(0, max_gain(node.left))\n        right = max(0, max_gain(node.right))\n        max_sum = max(max_sum, node.val + left + right)\n        return node.val + max(left, right)\n    max_gain(root)\n    return max_sum',
      java: 'class Solution {\n    private int maxSum = Integer.MIN_VALUE;\n    public int maxPathSum(TreeNode root) {\n        maxGain(root);\n        return maxSum;\n    }\n    private int maxGain(TreeNode node) {\n        if (node == null) return 0;\n        int left = Math.max(0, maxGain(node.left));\n        int right = Math.max(0, maxGain(node.right));\n        maxSum = Math.max(maxSum, node.val + left + right);\n        return node.val + Math.max(left, right);\n    }\n}',
      cpp: '#include <algorithm>\nusing namespace std;\n\nclass Solution {\n    int maxSum = -1e9;\npublic:\n    int maxPathSum(TreeNode* root) {\n        maxGain(root);\n        return maxSum;\n    }\n    int maxGain(TreeNode* node) {\n        if (!node) return 0;\n        int left = max(0, maxGain(node->left));\n        int right = max(0, maxGain(node->right));\n        maxSum = max(maxSum, node->val + left + right);\n        return node->val + max(left, right);\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3]', expectedOutput: '6' },
      { input: '[-10,9,20,null,null,15,7]', expectedOutput: '42' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Serialize and Deserialize Binary Tree',
    slug: 'serialize-and-deserialize-binary-tree',
    difficulty: 'Hard',
    category: 'Trees',
    description: 'Design an algorithm to serialize and deserialize a binary tree. Serialization is the process of converting a data structure or tree into a sequence of bits or string, and deserialization reconstructs the original tree structure.',
    examples: [
      { input: 'root = [1,2,3,null,null,4,5]', output: '[1,2,3,null,null,4,5]', explanation: 'Tree preserved across serialize and deserialize.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-1000 <= Node.val <= 1000'],
    hints: ['Use preorder DFS with "#" or "null" representing null nodes.', 'Join values with commas during serialization, and read sequentially during deserialization.'],
    starterCode: {
      javascript: 'function serialize(root) {\n  const res = [];\n  function dfs(node) {\n    if (!node) { res.push("#"); return; }\n    res.push(node.val);\n    dfs(node.left);\n    dfs(node.right);\n  }\n  dfs(root);\n  return res.join(",");\n}\n\nfunction deserialize(data) {\n  const tokens = data.split(",");\n  let idx = 0;\n  function dfs() {\n    if (tokens[idx] === "#") { idx++; return null; }\n    const node = { val: parseInt(tokens[idx++]), left: null, right: null };\n    node.left = dfs();\n    node.right = dfs();\n    return node;\n  }\n  return dfs();\n}',
      python: 'class Codec:\n    def serialize(self, root) -> str:\n        res = []\n        def dfs(node):\n            if not node: res.append("#"); return\n            res.append(str(node.val))\n            dfs(node.left); dfs(node.right)\n        dfs(root)\n        return ",".join(res)\n    def deserialize(self, data: str):\n        tokens = data.split(",")\n        self.idx = 0\n        def dfs():\n            if tokens[self.idx] == "#":\n                self.idx += 1; return None\n            node = TreeNode(int(tokens[self.idx]))\n            self.idx += 1\n            node.left = dfs()\n            node.right = dfs()\n            return node\n        return dfs()',
      java: 'public class Codec {\n    public String serialize(TreeNode root) {\n        StringBuilder sb = new StringBuilder();\n        buildString(root, sb);\n        return sb.toString();\n    }\n    private void buildString(TreeNode node, StringBuilder sb) {\n        if (node == null) { sb.append("#,"); return; }\n        sb.append(node.val).append(",");\n        buildString(node.left, sb); buildString(node.right, sb);\n    }\n    public TreeNode deserialize(String data) {\n        java.util.Deque<String> nodes = new java.util.LinkedList<>();\n        nodes.addAll(java.util.Arrays.asList(data.split(",")));\n        return buildTree(nodes);\n    }\n    private TreeNode buildTree(java.util.Deque<String> nodes) {\n        String val = nodes.remove();\n        if (val.equals("#")) return null;\n        TreeNode node = new TreeNode(Integer.parseInt(val));\n        node.left = buildTree(nodes); node.right = buildTree(nodes);\n        return node;\n    }\n}',
      cpp: '#include <string>\n#include <sstream>\nusing namespace std;\n\nclass Codec {\npublic:\n    string serialize(TreeNode* root) {\n        if (!root) return "#,";\n        return to_string(root->val) + "," + serialize(root->left) + serialize(root->right);\n    }\n    TreeNode* deserialize(string data) {\n        stringstream ss(data);\n        return build(ss);\n    }\n    TreeNode* build(stringstream& ss) {\n        string val;\n        if (!getline(ss, val, \',\') || val == "#") return nullptr;\n        TreeNode* node = new TreeNode(stoi(val));\n        node->left = build(ss);\n        node->right = build(ss);\n        return node;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,null,null,4,5]', expectedOutput: '[1,2,3,null,null,4,5]' },
      { input: '[]', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Search in a Binary Search Tree',
    slug: 'search-in-a-binary-search-tree',
    difficulty: 'Easy',
    category: 'Binary Search Tree',
    description: 'You are given the root of a binary search tree (BST) and an integer val. Find the node in the BST that the node\'s value equals val and return the subtree rooted with that node. If such a node does not exist, return null.',
    examples: [
      { input: 'root = [4,2,7,1,3], val = 2', output: '[2,1,3]', explanation: 'Subtree rooted at 2.' },
      { input: 'root = [4,2,7,1,3], val = 5', output: '[]', explanation: '5 is not in the BST.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [1, 5000].', '1 <= Node.val <= 10^7', 'root is a valid binary search tree.'],
    hints: ['If val < root.val, search left subtree.', 'If val > root.val, search right subtree. If root.val === val, return root.'],
    starterCode: {
      javascript: 'function searchBST(root, val) {\n  if (!root || root.val === val) return root;\n  return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);\n}',
      python: 'def searchBST(root, val: int):\n    if not root or root.val == val: return root\n    return searchBST(root.left, val) if val < root.val else searchBST(root.right, val)',
      java: 'class Solution {\n    public TreeNode searchBST(TreeNode root, int val) {\n        if (root == null || root.val == val) return root;\n        return val < root.val ? searchBST(root.left, val) : searchBST(root.right, val);\n    }\n}',
      cpp: 'class Solution {\npublic:\n    TreeNode* searchBST(TreeNode* root, int val) {\n        if (!root || root->val == val) return root;\n        return val < root->val ? searchBST(root->left, val) : searchBST(root->right, val);\n    }\n};'
    },
    testCases: [
      { input: '[4,2,7,1,3], 2', expectedOutput: '[2,1,3]' },
      { input: '[4,2,7,1,3], 5', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Validate Binary Search Tree',
    slug: 'validate-binary-search-tree',
    difficulty: 'Medium',
    category: 'Binary Search Tree',
    description: 'Given the root of a binary tree, determine if it is a valid binary search tree (BST). A valid BST satisfies: left subtree contains only nodes with keys strictly less than node\'s key; right subtree contains only nodes with keys strictly greater than node\'s key.',
    examples: [
      { input: 'root = [2,1,3]', output: 'true', explanation: 'Valid BST.' },
      { input: 'root = [5,1,4,null,null,3,6]', output: 'false', explanation: 'The root node\'s value is 5 but its right child\'s value is 4.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [1, 10^4].', '-2^31 <= Node.val <= 2^31 - 1'],
    hints: ['Pass valid open interval (minVal, maxVal) down the recursion.', 'For left child, update upper bound maxVal = node.val; for right child, minVal = node.val.'],
    starterCode: {
      javascript: 'function isValidBST(root, min = -Infinity, max = Infinity) {\n  if (!root) return true;\n  if (root.val <= min || root.val >= max) return false;\n  return isValidBST(root.left, min, root.val) && isValidBST(root.right, root.val, max);\n}',
      python: 'def isValidBST(root, min_val=float("-inf"), max_val=float("inf")) -> bool:\n    if not root: return True\n    if not (min_val < root.val < max_val): return False\n    return isValidBST(root.left, min_val, root.val) and isValidBST(root.right, root.val, max_val)',
      java: 'class Solution {\n    public boolean isValidBST(TreeNode root) {\n        return validate(root, null, null);\n    }\n    private boolean validate(TreeNode node, Integer min, Integer max) {\n        if (node == null) return true;\n        if ((min != null && node.val <= min) || (max != null && node.val >= max)) return false;\n        return validate(node.left, min, node.val) && validate(node.right, node.val, max);\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool isValidBST(TreeNode* root) {\n        return validate(root, nullptr, nullptr);\n    }\n    bool validate(TreeNode* node, TreeNode* minNode, TreeNode* maxNode) {\n        if (!node) return true;\n        if ((minNode && node->val <= minNode->val) || (maxNode && node->val >= maxNode->val)) return false;\n        return validate(node->left, minNode, node) && validate(node->right, node, maxNode);\n    }\n};'
    },
    testCases: [
      { input: '[2,1,3]', expectedOutput: 'true' },
      { input: '[5,1,4,null,null,3,6]', expectedOutput: 'false' },
      { input: '[2,2,2]', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Kth Smallest Element in a BST',
    slug: 'kth-smallest-element-in-a-bst',
    difficulty: 'Medium',
    category: 'Binary Search Tree',
    description: 'Given the root of a binary search tree, and an integer k, return the kth smallest value (1-indexed) of all the values of the nodes in the tree.',
    examples: [
      { input: 'root = [3,1,4,null,2], k = 1', output: '1', explanation: '1st smallest value is 1.' },
      { input: 'root = [5,3,6,2,4,null,null,1], k = 3', output: '3', explanation: '3rd smallest is 3.' }
    ],
    constraints: ['The number of nodes in the tree is n.', '1 <= k <= n <= 10^4', '0 <= Node.val <= 10^4'],
    hints: ['Inorder traversal of a BST visits nodes in strictly increasing order.', 'Count visited nodes during inorder traversal; when count === k, return node.val.'],
    starterCode: {
      javascript: 'function kthSmallest(root, k) {\n  let count = 0, res = null;\n  function inorder(node) {\n    if (!node || res !== null) return;\n    inorder(node.left);\n    count++;\n    if (count === k) { res = node.val; return; }\n    inorder(node.right);\n  }\n  inorder(root);\n  return res;\n}',
      python: 'def kthSmallest(root, k: int) -> int:\n    stack = []\n    curr = root\n    while curr or stack:\n        while curr:\n            stack.append(curr)\n            curr = curr.left\n        curr = stack.pop()\n        k -= 1\n        if k == 0: return curr.val\n        curr = curr.right',
      java: 'class Solution {\n    private int count = 0, res = -1;\n    public int kthSmallest(TreeNode root, int k) {\n        inorder(root, k);\n        return res;\n    }\n    private void inorder(TreeNode node, int k) {\n        if (node == null || res != -1) return;\n        inorder(node.left, k);\n        if (++count == k) { res = node.val; return; }\n        inorder(node.right, k);\n    }\n}',
      cpp: '#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    int kthSmallest(TreeNode* root, int k) {\n        stack<TreeNode*> st;\n        TreeNode* curr = root;\n        while (curr || !st.empty()) {\n            while (curr) { st.push(curr); curr = curr->left; }\n            curr = st.top(); st.pop();\n            if (--k == 0) return curr->val;\n            curr = curr->right;\n        }\n        return -1;\n    }\n};'
    },
    testCases: [
      { input: '[3,1,4,null,2], 1', expectedOutput: '1' },
      { input: '[5,3,6,2,4,null,null,1], 3', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  }
];
