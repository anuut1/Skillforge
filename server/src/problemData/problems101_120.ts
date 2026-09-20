import { DSAProblemFull } from './types';

export const PROBLEMS_101_120: DSAProblemFull[] = [
  {
    title: 'House Robber',
    slug: 'house-robber',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: 'You are a professional robber planning to rob houses along a street. Each house has a certain amount of money stashed. Adjacent houses have security systems connected, and it will automatically contact the police if two adjacent houses were broken into on the same night. Return the maximum amount of money you can rob tonight without alerting the police.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: '4', explanation: 'Rob house 1 (money = 1) and house 3 (money = 3). Total amount = 1 + 3 = 4.' },
      { input: 'nums = [2,7,9,3,1]', output: '12', explanation: 'Rob house 1 (2), house 3 (9), and house 5 (1). Total = 12.' }
    ],
    constraints: ['1 <= nums.length <= 100', '0 <= nums[i] <= 400'],
    hints: ['dp[i] = max(dp[i-1], dp[i-2] + nums[i]).', 'Maintain robPrev and robCurrent in O(1) space.'],
    starterCode: {
      javascript: 'function rob(nums) {\n  let rob1 = 0, rob2 = 0;\n  for (const n of nums) {\n    const newRob = Math.max(rob1 + n, rob2);\n    rob1 = rob2;\n    rob2 = newRob;\n  }\n  return rob2;\n}',
      python: 'def rob(nums: list[int]) -> int:\n    rob1 = rob2 = 0\n    for n in nums:\n        new_rob = max(rob1 + n, rob2)\n        rob1 = rob2\n        rob2 = new_rob\n    return rob2',
      java: 'class Solution {\n    public int rob(int[] nums) {\n        int rob1 = 0, rob2 = 0;\n        for (int n : nums) {\n            int newRob = Math.max(rob1 + n, rob2);\n            rob1 = rob2;\n            rob2 = newRob;\n        }\n        return rob2;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int rob(vector<int>& nums) {\n        int rob1 = 0, rob2 = 0;\n        for (int n : nums) {\n            int newRob = max(rob1 + n, rob2);\n            rob1 = rob2;\n            rob2 = newRob;\n        }\n        return rob2;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: '4' },
      { input: '[2,7,9,3,1]', expectedOutput: '12' },
      { input: '[0]', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Coin Change',
    slug: 'coin-change',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: 'You are given an integer array coins representing coins of different denominations and an integer amount representing a total amount of money. Return the fewest number of coins that you need to make up that amount. If that amount of money cannot be made up by any combination of the coins, return -1.',
    examples: [
      { input: 'coins = [1,2,5], amount = 11', output: '3', explanation: '11 = 5 + 5 + 1.' },
      { input: 'coins = [2], amount = 3', output: '-1', explanation: 'Cannot make 3 using only 2.' },
      { input: 'coins = [1], amount = 0', output: '0', explanation: '0 coins for 0 amount.' }
    ],
    constraints: ['1 <= coins.length <= 12', '1 <= coins[i] <= 2^31 - 1', '0 <= amount <= 10^4'],
    hints: ['Initialize dp array of size amount + 1 with amount + 1 (infinity), and dp[0] = 0.', 'For each coin, iterate a from coin to amount: dp[a] = min(dp[a], 1 + dp[a - coin]).'],
    starterCode: {
      javascript: 'function coinChange(coins, amount) {\n  const dp = new Array(amount + 1).fill(Infinity);\n  dp[0] = 0;\n  for (let a = 1; a <= amount; a++) {\n    for (const c of coins) {\n      if (a >= c) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n    }\n  }\n  return dp[amount] === Infinity ? -1 : dp[amount];\n}',
      python: 'def coinChange(coins: list[int], amount: int) -> int:\n    dp = [float("inf")] * (amount + 1)\n    dp[0] = 0\n    for a in range(1, amount + 1):\n        for c in coins:\n            if a >= c: dp[a] = min(dp[a], 1 + dp[a - c])\n    return dp[amount] if dp[amount] != float("inf") else -1',
      java: 'class Solution {\n    public int coinChange(int[] coins, int amount) {\n        int[] dp = new int[amount + 1];\n        java.util.Arrays.fill(dp, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (a >= c) dp[a] = Math.min(dp[a], 1 + dp[a - c]);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int coinChange(vector<int>& coins, int amount) {\n        vector<int> dp(amount + 1, amount + 1);\n        dp[0] = 0;\n        for (int a = 1; a <= amount; a++) {\n            for (int c : coins) {\n                if (a >= c) dp[a] = min(dp[a], 1 + dp[a - c]);\n            }\n        }\n        return dp[amount] > amount ? -1 : dp[amount];\n    }\n};'
    },
    testCases: [
      { input: '[1,2,5], 11', expectedOutput: '3' },
      { input: '[2], 3', expectedOutput: '-1' },
      { input: '[1], 0', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Longest Increasing Subsequence',
    slug: 'longest-increasing-subsequence',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: 'Given an integer array nums, return the length of the longest strictly increasing subsequence in O(n log n) time using patience sorting / binary search.',
    examples: [
      { input: 'nums = [10,9,2,5,3,7,101,18]', output: '4', explanation: 'LIS is [2,3,7,101], therefore the length is 4.' },
      { input: 'nums = [0,1,0,3,2,3]', output: '4', explanation: 'LIS is [0,1,2,3].' }
    ],
    constraints: ['1 <= nums.length <= 2500', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Maintain tails array where tails[i] stores smallest tail of all increasing subsequences of length i + 1.', 'For each num, binary search in tails to find insert position.'],
    starterCode: {
      javascript: 'function lengthOfLIS(nums) {\n  const tails = [];\n  for (const x of nums) {\n    let l = 0, r = tails.length;\n    while (l < r) {\n      const mid = Math.floor((l + r) / 2);\n      if (tails[mid] < x) l = mid + 1;\n      else r = mid;\n    }\n    tails[l] = x;\n  }\n  return tails.length;\n}',
      python: 'import bisect\n\ndef lengthOfLIS(nums: list[int]) -> int:\n    tails = []\n    for x in nums:\n        idx = bisect.bisect_left(tails, x)\n        if idx == len(tails): tails.append(x)\n        else: tails[idx] = x\n    return len(tails)',
      java: 'class Solution {\n    public int lengthOfLIS(int[] nums) {\n        int[] tails = new int[nums.length];\n        int size = 0;\n        for (int x : nums) {\n            int l = 0, r = size;\n            while (l < r) {\n                int mid = (l + r) / 2;\n                if (tails[mid] < x) l = mid + 1;\n                else r = mid;\n            }\n            tails[l] = x;\n            if (l == size) size++;\n        }\n        return size;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLIS(vector<int>& nums) {\n        vector<int> tails;\n        for (int x : nums) {\n            auto it = lower_bound(tails.begin(), tails.end(), x);\n            if (it == tails.end()) tails.push_back(x);\n            else *it = x;\n        }\n        return tails.size();\n    }\n};'
    },
    testCases: [
      { input: '[10,9,2,5,3,7,101,18]', expectedOutput: '4' },
      { input: '[0,1,0,3,2,3]', expectedOutput: '4' },
      { input: '[7,7,7,7,7,7,7]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Unique Paths',
    slug: 'unique-paths',
    difficulty: 'Medium',
    category: 'Dynamic Programming',
    description: 'There is a robot on an m x n grid. The robot is initially located at the top-left corner (i.e., grid[0][0]) and tries to move to the bottom-right corner (i.e., grid[m - 1][n - 1]). The robot can only move either down or right at any point in time. Given the two integers m and n, return the number of possible unique paths.',
    examples: [
      { input: 'm = 3, n = 7', output: '28', explanation: '28 unique paths.' },
      { input: 'm = 3, n = 2', output: '3', explanation: 'Right->Down->Down, Down->Down->Right, Down->Right->Down.' }
    ],
    constraints: ['1 <= m, n <= 100'],
    hints: ['dp[r][c] = dp[r-1][c] + dp[r][c-1].', 'Can optimize space to a 1D array of size n filled with 1s.'],
    starterCode: {
      javascript: 'function uniquePaths(m, n) {\n  const row = new Array(n).fill(1);\n  for (let i = 1; i < m; i++) {\n    for (let j = 1; j < n; j++) {\n      row[j] += row[j - 1];\n    }\n  }\n  return row[n - 1];\n}',
      python: 'def uniquePaths(m: int, n: int) -> int:\n    row = [1] * n\n    for _ in range(1, m):\n        for j in range(1, n):\n            row[j] += row[j - 1]\n    return row[-1]',
      java: 'class Solution {\n    public int uniquePaths(int m, int n) {\n        int[] row = new int[n];\n        java.util.Arrays.fill(row, 1);\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) {\n                row[j] += row[j - 1];\n            }\n        }\n        return row[n - 1];\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int uniquePaths(int m, int n) {\n        vector<int> row(n, 1);\n        for (int i = 1; i < m; i++) {\n            for (int j = 1; j < n; j++) {\n                row[j] += row[j - 1];\n            }\n        }\n        return row[n - 1];\n    }\n};'
    },
    testCases: [
      { input: '3, 7', expectedOutput: '28' },
      { input: '3, 2', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Edit Distance',
    slug: 'edit-distance',
    difficulty: 'Hard',
    category: 'Dynamic Programming',
    description: 'Given two strings word1 and word2, return the minimum number of operations required to convert word1 to word2. You have three operations permitted: Insert a character, Delete a character, Replace a character.',
    examples: [
      { input: 'word1 = "horse", word2 = "ros"', output: '3', explanation: 'horse -> rorse (replace \'h\' with \'r\') -> rose (remove \'r\') -> ros (remove \'e\').' },
      { input: 'word1 = "intention", word2 = "execution"', output: '5', explanation: 'Minimum 5 operations.' }
    ],
    constraints: ['0 <= word1.length, word2.length <= 500', 'word1 and word2 consist of lowercase English letters.'],
    hints: ['Use 2D DP where dp[i][j] is edit distance between word1[0..i] and word2[0..j].', 'If word1[i-1] == word2[j-1], dp[i][j] = dp[i-1][j-1]. Otherwise 1 + min(insert dp[i][j-1], delete dp[i-1][j], replace dp[i-1][j-1]).'],
    starterCode: {
      javascript: 'function minDistance(word1, word2) {\n  const m = word1.length, n = word2.length;\n  const dp = Array.from({ length: m + 1 }, () => new Array(n + 1).fill(0));\n  for (let i = 0; i <= m; i++) dp[i][0] = i;\n  for (let j = 0; j <= n; j++) dp[0][j] = j;\n  for (let i = 1; i <= m; i++) {\n    for (let j = 1; j <= n; j++) {\n      if (word1[i - 1] === word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n      else dp[i][j] = 1 + Math.min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]);\n    }\n  }\n  return dp[m][n];\n}',
      python: 'def minDistance(word1: str, word2: str) -> int:\n    m, n = len(word1), len(word2)\n    dp = [[0] * (n + 1) for _ in range(m + 1)]\n    for i in range(m + 1): dp[i][0] = i\n    for j in range(n + 1): dp[0][j] = j\n    for i in range(1, m + 1):\n        for j in range(1, n + 1):\n            if word1[i - 1] == word2[j - 1]: dp[i][j] = dp[i - 1][j - 1]\n            else: dp[i][j] = 1 + min(dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1])\n    return dp[m][n]',
      java: 'class Solution {\n    public int minDistance(String word1, String word2) {\n        int m = word1.length(), n = word2.length;\n        int[][] dp = new int[m + 1][n + 1];\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (word1.charAt(i - 1) == word2.charAt(j - 1)) dp[i][j] = dp[i - 1][j - 1];\n                else dp[i][j] = 1 + Math.min(dp[i - 1][j], Math.min(dp[i][j - 1], dp[i - 1][j - 1]));\n            }\n        }\n        return dp[m][n];\n    }\n}',
      cpp: '#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int minDistance(string word1, string word2) {\n        int m = word1.size(), n = word2.size();\n        vector<vector<int>> dp(m + 1, vector<int>(n + 1, 0));\n        for (int i = 0; i <= m; i++) dp[i][0] = i;\n        for (int j = 0; j <= n; j++) dp[0][j] = j;\n        for (int i = 1; i <= m; i++) {\n            for (int j = 1; j <= n; j++) {\n                if (word1[i - 1] == word2[j - 1]) dp[i][j] = dp[i - 1][j - 1];\n                else dp[i][j] = 1 + min({dp[i - 1][j], dp[i][j - 1], dp[i - 1][j - 1]});\n            }\n        }\n        return dp[m][n];\n    }\n};'
    },
    testCases: [
      { input: '"horse", "ros"', expectedOutput: '3' },
      { input: '"intention", "execution"', expectedOutput: '5' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Single Number',
    slug: 'single-number',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    description: 'Given a non-empty array of integers nums, every element appears twice except for one. Find that single one. You must implement a solution with a linear runtime complexity and use only constant extra space.',
    examples: [
      { input: 'nums = [2,2,1]', output: '1', explanation: '2 XOR 2 = 0, 0 XOR 1 = 1.' },
      { input: 'nums = [4,1,2,1,2]', output: '4', explanation: '4 appears once.' }
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-3 * 10^4 <= nums[i] <= 3 * 10^4', 'Each element in the array appears twice except for one element which appears only once.'],
    hints: ['XOR operation satisfies x ^ x = 0 and x ^ 0 = x.', 'XOR all elements in the array; the result is the single number.'],
    starterCode: {
      javascript: 'function singleNumber(nums) {\n  return nums.reduce((acc, val) => acc ^ val, 0);\n}',
      python: 'from functools import reduce\nimport operator\n\ndef singleNumber(nums: list[int]) -> int:\n    return reduce(operator.xor, nums)',
      java: 'class Solution {\n    public int singleNumber(int[] nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int singleNumber(vector<int>& nums) {\n        int res = 0;\n        for (int n : nums) res ^= n;\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[2,2,1]', expectedOutput: '1' },
      { input: '[4,1,2,1,2]', expectedOutput: '4' },
      { input: '[1]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Number of 1 Bits (Hamming Weight)',
    slug: 'number-of-1-bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    description: 'Write a function that takes the binary representation of an unsigned integer and returns the number of \'1\' bits it has (also known as the Hamming weight).',
    examples: [
      { input: 'n = 11 (binary 00000000000000000000000000001011)', output: '3', explanation: 'Total 3 set bits.' },
      { input: 'n = 128 (binary 00000000000000000000000010000000)', output: '1', explanation: 'Total 1 set bit.' }
    ],
    constraints: ['The input must be a binary string of length 32 or positive 32-bit integer.'],
    hints: ['Brian Kernighan\'s algorithm: n = n & (n - 1) drops the lowest set bit in each iteration.'],
    starterCode: {
      javascript: 'function hammingWeight(n) {\n  let count = 0;\n  while (n !== 0) {\n    n = n & (n - 1);\n    count++;\n  }\n  return count;\n}',
      python: 'def hammingWeight(n: int) -> int:\n    count = 0\n    while n:\n        n &= (n - 1)\n        count += 1\n    return count',
      java: 'public class Solution {\n    public int hammingWeight(int n) {\n        int count = 0;\n        while (n != 0) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int hammingWeight(uint32_t n) {\n        int count = 0;\n        while (n) {\n            n &= (n - 1);\n            count++;\n        }\n        return count;\n    }\n};'
    },
    testCases: [
      { input: '11', expectedOutput: '3' },
      { input: '128', expectedOutput: '1' },
      { input: '2147483645', expectedOutput: '30' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Counting Bits',
    slug: 'counting-bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    description: 'Given an integer n, return an array ans of length n + 1 such that for each i (0 <= i <= n), ans[i] is the number of 1\'s in the binary representation of i in O(n) time.',
    examples: [
      { input: 'n = 2', output: '[0,1,1]', explanation: '0: 0, 1: 1, 2: 10.' },
      { input: 'n = 5', output: '[0,1,1,2,1,2]', explanation: '0: 0, 1: 1, 2: 10, 3: 11, 4: 100, 5: 101.' }
    ],
    constraints: ['0 <= n <= 10^5'],
    hints: ['Notice that ans[i] = ans[i >> 1] + (i & 1).', 'Use DP bit relation to populate answers sequentially.'],
    starterCode: {
      javascript: 'function countBits(n) {\n  const ans = new Array(n + 1).fill(0);\n  for (let i = 1; i <= n; i++) {\n    ans[i] = ans[i >> 1] + (i & 1);\n  }\n  return ans;\n}',
      python: 'def countBits(n: int) -> list[int]:\n    ans = [0] * (n + 1)\n    for i in range(1, n + 1):\n        ans[i] = ans[i >> 1] + (i & 1)\n    return ans',
      java: 'class Solution {\n    public int[] countBits(int n) {\n        int[] ans = new int[n + 1];\n        for (int i = 1; i <= n; i++) {\n            ans[i] = ans[i >> 1] + (i & 1);\n        }\n        return ans;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> countBits(int n) {\n        vector<int> ans(n + 1, 0);\n        for (int i = 1; i <= n; i++) {\n            ans[i] = ans[i >> 1] + (i & 1);\n        }\n        return ans;\n    }\n};'
    },
    testCases: [
      { input: '2', expectedOutput: '[0,1,1]' },
      { input: '5', expectedOutput: '[0,1,1,2,1,2]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Reverse Bits',
    slug: 'reverse-bits',
    difficulty: 'Easy',
    category: 'Bit Manipulation',
    description: 'Reverse bits of a given 32 bits unsigned integer.',
    examples: [
      { input: 'n = 00000010100101000001111010011100', output: '964176192 (00111001011110000010100101000000)', explanation: 'Bits reversed.' }
    ],
    constraints: ['The input must be a binary string of length 32 or 32-bit unsigned integer.'],
    hints: ['Loop 32 times: shift res left by 1 and OR with (n & 1), then shift n right by 1.'],
    starterCode: {
      javascript: 'function reverseBits(n) {\n  let res = 0;\n  for (let i = 0; i < 32; i++) {\n    res = (res << 1) | (n & 1);\n    n >>>= 1;\n  }\n  return res >>> 0;\n}',
      python: 'def reverseBits(n: int) -> int:\n    res = 0\n    for _ in range(32):\n        res = (res << 1) | (n & 1)\n        n >>= 1\n    return res',
      java: 'public class Solution {\n    public int reverseBits(int n) {\n        int res = 0;\n        for (int i = 0; i < 32; i++) {\n            res = (res << 1) | (n & 1);\n            n >>>= 1;\n        }\n        return res;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    uint32_t reverseBits(uint32_t n) {\n        uint32_t res = 0;\n        for (int i = 0; i < 32; i++) {\n            res = (res << 1) | (n & 1);\n            n >>= 1;\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '43261596', expectedOutput: '964176192' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Implement Trie (Prefix Tree)',
    slug: 'implement-trie-prefix-tree',
    difficulty: 'Medium',
    category: 'Tries',
    description: 'A trie (pronounced as "try") or prefix tree is a tree data structure used to efficiently store and retrieve keys in a dataset of strings. Implement the Trie class with insert, search, and startsWith methods.',
    examples: [
      { input: '["Trie","insert","search","search","startsWith","insert","search"]\n[[],["apple"],["apple"],["app"],["app"],["app"],["app"]]', output: '[null,null,true,false,true,null,true]', explanation: 'Trie operations.' }
    ],
    constraints: ['1 <= word.length, prefix.length <= 2000', 'word and prefix consist only of lowercase English letters.', 'At most 3 * 10^4 calls in total will be made to insert, search, and startsWith.'],
    hints: ['Each node has children: Map or array of size 26 and boolean isEnd.', 'Traverse node by node for characters.'],
    starterCode: {
      javascript: 'class TrieNode {\n  constructor() {\n    this.children = {};\n    this.isEnd = false;\n  }\n}\n\nclass Trie {\n  constructor() {\n    this.root = new TrieNode();\n  }\n  insert(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node.children[c]) node.children[c] = new TrieNode();\n      node = node.children[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node.children[c]) return false;\n      node = node.children[c];\n    }\n    return node.isEnd;\n  }\n  startsWith(prefix) {\n    let node = this.root;\n    for (const c of prefix) {\n      if (!node.children[c]) return false;\n      node = node.children[c];\n    }\n    return true;\n  }\n}',
      python: 'class TrieNode:\n    def __init__(self):\n        self.children = {}\n        self.is_end = False\n\nclass Trie:\n    def __init__(self):\n        self.root = TrieNode()\n    def insert(self, word: str) -> None:\n        node = self.root\n        for c in word:\n            if c not in node.children: node.children[c] = TrieNode()\n            node = node.children[c]\n        node.is_end = True\n    def search(self, word: str) -> bool:\n        node = self.root\n        for c in word:\n            if c not in node.children: return False\n            node = node.children[c]\n        return node.is_end\n    def startsWith(self, prefix: str) -> bool:\n        node = self.root\n        for c in prefix:\n            if c not in node.children: return False\n            node = node.children[c]\n        return True',
      java: 'class Trie {\n    class Node {\n        Node[] next = new Node[26];\n        boolean isEnd = false;\n    }\n    private Node root = new Node();\n    public void insert(String word) {\n        Node node = root;\n        for (char c : word.toCharArray()) {\n            if (node.next[c - \'a\'] == null) node.next[c - \'a\'] = new Node();\n            node = node.next[c - \'a\'];\n        }\n        node.isEnd = true;\n    }\n    public boolean search(String word) {\n        Node node = root;\n        for (char c : word.toCharArray()) {\n            if (node.next[c - \'a\'] == null) return false;\n            node = node.next[c - \'a\'];\n        }\n        return node.isEnd;\n    }\n    public boolean startsWith(String prefix) {\n        Node node = root;\n        for (char c : prefix.toCharArray()) {\n            if (node.next[c - \'a\'] == null) return false;\n            node = node.next[c - \'a\'];\n        }\n        return true;\n    }\n}',
      cpp: '#include <string>\nusing namespace std;\n\nclass Trie {\n    struct Node {\n        Node* next[26] = {};\n        bool isEnd = false;\n    };\n    Node* root = new Node();\npublic:\n    void insert(string word) {\n        Node* node = root;\n        for (char c : word) {\n            if (!node->next[c - \'a\']) node->next[c - \'a\'] = new Node();\n            node = node->next[c - \'a\'];\n        }\n        node->isEnd = true;\n    }\n    bool search(string word) {\n        Node* node = root;\n        for (char c : word) {\n            if (!node->next[c - \'a\']) return false;\n            node = node->next[c - \'a\'];\n        }\n        return node->isEnd;\n    }\n    bool startsWith(string prefix) {\n        Node* node = root;\n        for (char c : prefix) {\n            if (!node->next[c - \'a\']) return false;\n            node = node->next[c - \'a\'];\n        }\n        return true;\n    }\n};'
    },
    testCases: [
      { input: 'insert("apple"), search("apple"), search("app"), startsWith("app"), insert("app"), search("app")', expectedOutput: '[true, false, true, true]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Design Add and Search Words Data Structure',
    slug: 'design-add-and-search-words-data-structure',
    difficulty: 'Medium',
    category: 'Tries',
    description: 'Design a data structure that supports adding new words and finding if a string matches any previously added string. Word may contain dots \'.\' where dots can be matched with any letter.',
    examples: [
      { input: '["WordDictionary","addWord","addWord","addWord","search","search","search","search"]\n[[],["bad"],["dad"],["mad"],["pad"],["bad"],[".ad"],["b.."]]', output: '[null,null,null,null,false,true,true,true]', explanation: 'Wildcard dot matching.' }
    ],
    constraints: ['1 <= word.length <= 25', 'word in addWord consists of lowercase English letters.', 'word in search consist of \'.\' or lowercase English letters.'],
    hints: ['Store words in a standard Trie.', 'In search, if character is \'.\', branch recursively into all existing children nodes.'],
    starterCode: {
      javascript: 'class WordDictionary {\n  constructor() {\n    this.root = {};\n  }\n  addWord(word) {\n    let node = this.root;\n    for (const c of word) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.isEnd = true;\n  }\n  search(word) {\n    function dfs(node, idx) {\n      if (!node) return false;\n      if (idx === word.length) return !!node.isEnd;\n      const c = word[idx];\n      if (c === ".") {\n        for (const key in node) {\n          if (key !== "isEnd" && dfs(node[key], idx + 1)) return true;\n        }\n        return false;\n      }\n      return dfs(node[c], idx + 1);\n    }\n    return dfs(this.root, 0);\n  }\n}',
      python: 'class WordDictionary:\n    def __init__(self):\n        self.root = {}\n    def addWord(self, word: str) -> None:\n        node = self.root\n        for c in word:\n            node = node.setdefault(c, {})\n        node["#"] = True\n    def search(self, word: str) -> bool:\n        def dfs(node, idx):\n            if idx == len(word): return "#" in node\n            c = word[idx]\n            if c == ".":\n                return any(dfs(node[k], idx + 1) for k in node if k != "#")\n            return c in node and dfs(node[c], idx + 1)\n        return dfs(self.root, 0)',
      java: 'class WordDictionary {\n    class Node {\n        Node[] next = new Node[26];\n        boolean isEnd = false;\n    }\n    private Node root = new Node();\n    public void addWord(String word) {\n        Node node = root;\n        for (char c : word.toCharArray()) {\n            if (node.next[c - \'a\'] == null) node.next[c - \'a\'] = new Node();\n            node = node.next[c - \'a\'];\n        }\n        node.isEnd = true;\n    }\n    public boolean search(String word) {\n        return match(word.toCharArray(), 0, root);\n    }\n    private boolean match(char[] chs, int k, Node node) {\n        if (k == chs.length) return node.isEnd;\n        if (chs[k] == \'.\') {\n            for (int i = 0; i < 26; i++) {\n                if (node.next[i] != null && match(chs, k + 1, node.next[i])) return true;\n            }\n        } else {\n            return node.next[chs[k] - \'a\'] != null && match(chs, k + 1, node.next[chs[k] - \'a\']);\n        }\n        return false;\n    }\n}',
      cpp: '#include <string>\nusing namespace std;\n\nclass WordDictionary {\n    struct Node {\n        Node* next[26] = {};\n        bool isEnd = false;\n    };\n    Node* root = new Node();\npublic:\n    void addWord(string word) {\n        Node* node = root;\n        for (char c : word) {\n            if (!node->next[c - \'a\']) node->next[c - \'a\'] = new Node();\n            node = node->next[c - \'a\'];\n        }\n        node->isEnd = true;\n    }\n    bool search(string word) {\n        return match(word, 0, root);\n    }\n    bool match(const string& w, int k, Node* node) {\n        if (!node) return false;\n        if (k == (int)w.size()) return node->isEnd;\n        if (w[k] == \'.\') {\n            for (int i = 0; i < 26; i++) {\n                if (node->next[i] && match(w, k + 1, node->next[i])) return true;\n            }\n            return false;\n        }\n        return match(w, k + 1, node->next[w[k] - \'a\']);\n    }\n};'
    },
    testCases: [
      { input: 'addWord("bad"), addWord("dad"), search("pad"), search("bad"), search(".ad"), search("b..")', expectedOutput: '[false, true, true, true]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Word Search II',
    slug: 'word-search-ii',
    difficulty: 'Hard',
    category: 'Tries',
    description: 'Given an m x n board of characters and a list of strings words, return all words on the board. Each word must be constructed from letters of sequentially adjacent cells.',
    examples: [
      { input: 'board = [["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], words = ["oath","pea","eat","rain"]', output: '["eat","oath"]', explanation: 'Found oath and eat on board.' },
      { input: 'board = [["a","b"],["c","d"]], words = ["abcb"]', output: '[]', explanation: 'Cannot reuse cell.' }
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 12', '1 <= words.length <= 3 * 10^4', '1 <= words[i].length <= 10'],
    hints: ['Build a Trie containing all dictionary words.', 'Perform backtracking DFS on the board guided by Trie prefix traversal to prune invalid paths early.'],
    starterCode: {
      javascript: 'function findWords(board, words) {\n  const root = {};\n  for (const w of words) {\n    let node = root;\n    for (const c of w) {\n      if (!node[c]) node[c] = {};\n      node = node[c];\n    }\n    node.word = w;\n  }\n  const res = new Set(), m = board.length, n = board[0].length;\n  function dfs(r, c, node) {\n    if (r < 0 || r >= m || c < 0 || c >= n || !node[board[r][c]]) return;\n    const ch = board[r][c];\n    const nextNode = node[ch];\n    if (nextNode.word) res.add(nextNode.word);\n    board[r][c] = "#";\n    dfs(r + 1, c, nextNode);\n    dfs(r - 1, c, nextNode);\n    dfs(r, c + 1, nextNode);\n    dfs(r, c - 1, nextNode);\n    board[r][c] = ch;\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) dfs(r, c, root);\n  }\n  return Array.from(res);\n}',
      python: 'def findWords(board: list[list[str]], words: list[str]) -> list[str]:\n    root = {}\n    for w in words:\n        node = root\n        for c in w: node = node.setdefault(c, {})\n        node["$"] = w\n    res, m, n = set(), len(board), len(board[0])\n    def dfs(r, c, node):\n        if not (0 <= r < m and 0 <= c < n) or board[r][c] not in node: return\n        ch = board[r][c]\n        next_node = node[ch]\n        if "$" in next_node: res.add(next_node["$"])\n        board[r][c] = "#"\n        for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n            dfs(r+dr, c+dc, next_node)\n        board[r][c] = ch\n    for r in range(m):\n        for c in range(n): dfs(r, c, root)\n    return list(res)',
      java: 'class Solution {\n    class Node { Node[] next = new Node[26]; String word; }\n    public java.util.List<String> findWords(char[][] board, String[] words) {\n        Node root = new Node();\n        for (String w : words) {\n            Node node = root;\n            for (char c : w.toCharArray()) {\n                if (node.next[c - \'a\'] == null) node.next[c - \'a\'] = new Node();\n                node = node.next[c - \'a\'];\n            }\n            node.word = w;\n        }\n        java.util.List<String> res = new java.util.ArrayList<>();\n        for (int r = 0; r < board.length; r++) {\n            for (int c = 0; c < board[0].length; c++) dfs(board, r, c, root, res);\n        }\n        return res;\n    }\n    private void dfs(char[][] b, int r, int c, Node node, java.util.List<String> res) {\n        if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] == \'#\' || node.next[b[r][c] - \'a\'] == null) return;\n        char ch = b[r][c];\n        Node next = node.next[ch - \'a\'];\n        if (next.word != null) { res.add(next.word); next.word = null; }\n        b[r][c] = \'#\';\n        dfs(b, r + 1, c, next, res); dfs(b, r - 1, c, next, res);\n        dfs(b, r, c + 1, next, res); dfs(b, r, c - 1, next, res);\n        b[r][c] = ch;\n    }\n}',
      cpp: '#include <vector>\n#include <string>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\n    struct Node { Node* next[26] = {}; string word = ""; };\n    Node* root = new Node();\npublic:\n    vector<string> findWords(vector<vector<char>>& board, vector<string>& words) {\n        for (const string& w : words) {\n            Node* node = root;\n            for (char c : w) {\n                if (!node->next[c - \'a\']) node->next[c - \'a\'] = new Node();\n                node = node->next[c - \'a\'];\n            }\n            node->word = w;\n        }\n        unordered_set<string> res;\n        for (size_t r = 0; r < board.size(); r++)\n            for (size_t c = 0; c < board[0].size(); c++) dfs(board, r, c, root, res);\n        return vector<string>(res.begin(), res.end());\n    }\n    void dfs(vector<vector<char>>& b, int r, int c, Node* node, unordered_set<string>& res) {\n        if (r < 0 || r >= (int)b.size() || c < 0 || c >= (int)b[0].size() || b[r][c] == \'#\' || !node->next[b[r][c] - \'a\']) return;\n        char ch = b[r][c];\n        Node* next = node->next[ch - \'a\'];\n        if (!next->word.empty()) res.insert(next->word);\n        b[r][c] = \'#\';\n        dfs(b, r + 1, c, next, res); dfs(b, r - 1, c, next, res);\n        dfs(b, r, c + 1, next, res); dfs(b, r, c - 1, next, res);\n        b[r][c] = ch;\n    }\n};'
    },
    testCases: [
      { input: '[["o","a","a","n"],["e","t","a","e"],["i","h","k","r"],["i","f","l","v"]], ["oath","pea","eat","rain"]', expectedOutput: '["eat","oath"]' },
      { input: '[["a","b"],["c","d"]], ["abcb"]', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Merge Intervals',
    slug: 'merge-intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    description: 'Given an array of intervals where intervals[i] = [starti, endi], merge all overlapping intervals, and return an array of the non-overlapping intervals that cover all the intervals in the input.',
    examples: [
      { input: 'intervals = [[1,3],[2,6],[8,10],[15,18]]', output: '[[1,6],[8,10],[15,18]]', explanation: 'Since intervals [1,3] and [2,6] overlap, merge them into [1,6].' },
      { input: 'intervals = [[1,4],[4,5]]', output: '[[1,5]]', explanation: 'Intervals [1,4] and [4,5] are considered overlapping.' }
    ],
    constraints: ['1 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^4'],
    hints: ['Sort intervals by start time ascending.', 'Compare current interval start with last merged interval end; merge if start <= end.'],
    starterCode: {
      javascript: 'function merge(intervals) {\n  if (!intervals.length) return [];\n  intervals.sort((a, b) => a[0] - b[0]);\n  const res = [intervals[0]];\n  for (let i = 1; i < intervals.length; i++) {\n    const last = res[res.length - 1];\n    if (intervals[i][0] <= last[1]) {\n      last[1] = Math.max(last[1], intervals[i][1]);\n    } else {\n      res.push(intervals[i]);\n    }\n  }\n  return res;\n}',
      python: 'def merge(intervals: list[list[int]]) -> list[list[int]]:\n    if not intervals: return []\n    intervals.sort(key=lambda x: x[0])\n    res = [intervals[0]]\n    for cur in intervals[1:]:\n        if cur[0] <= res[-1][1]:\n            res[-1][1] = max(res[-1][1], cur[1])\n        else:\n            res.append(cur)\n    return res',
      java: 'class Solution {\n    public int[][] merge(int[][] intervals) {\n        if (intervals.length == 0) return new int[0][0];\n        java.util.Arrays.sort(intervals, (a, b) -> a[0] - b[0]);\n        java.util.List<int[]> res = new java.util.ArrayList<>();\n        int[] cur = intervals[0];\n        res.add(cur);\n        for (int[] interval : intervals) {\n            if (interval[0] <= cur[1]) {\n                cur[1] = Math.max(cur[1], interval[1]);\n            } else {\n                cur = interval;\n                res.add(cur);\n            }\n        }\n        return res.toArray(new int[res.size()][]);\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> merge(vector<vector<int>>& intervals) {\n        if (intervals.empty()) return {};\n        sort(intervals.begin(), intervals.end());\n        vector<vector<int>> res = {intervals[0]};\n        for (size_t i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] <= res.back()[1]) {\n                res.back()[1] = max(res.back()[1], intervals[i][1]);\n            } else {\n                res.push_back(intervals[i]);\n            }\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[[1,3],[2,6],[8,10],[15,18]]', expectedOutput: '[[1,6],[8,10],[15,18]]' },
      { input: '[[1,4],[4,5]]', expectedOutput: '[[1,5]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Insert Interval',
    slug: 'insert-interval',
    difficulty: 'Medium',
    category: 'Intervals',
    description: 'You are given an array of non-overlapping intervals intervals where intervals[i] = [starti, endi] sorted in ascending order by starti. You are also given an interval newInterval = [start, end]. Insert newInterval into intervals such that intervals is still sorted and non-overlapping.',
    examples: [
      { input: 'intervals = [[1,3],[6,9]], newInterval = [2,5]', output: '[[1,5],[6,9]]', explanation: 'Intervals merged with [2,5].' },
      { input: 'intervals = [[1,2],[3,5],[6,7],[8,10],[12,16]], newInterval = [4,8]', output: '[[1,2],[3,10],[12,16]]', explanation: 'Merged overlapping range [3,10].' }
    ],
    constraints: ['0 <= intervals.length <= 10^4', 'intervals[i].length == 2', '0 <= starti <= endi <= 10^5', 'intervals is sorted by starti in ascending order.'],
    hints: ['Append all intervals that end before newInterval begins.', 'Merge all overlapping intervals with newInterval: newInterval = [min(start), max(end)].', 'Append all remaining intervals that begin after newInterval ends.'],
    starterCode: {
      javascript: 'function insert(intervals, newInterval) {\n  const res = [];\n  let i = 0, n = intervals.length;\n  while (i < n && intervals[i][1] < newInterval[0]) res.push(intervals[i++]);\n  while (i < n && intervals[i][0] <= newInterval[1]) {\n    newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n    newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n    i++;\n  }\n  res.push(newInterval);\n  while (i < n) res.push(intervals[i++]);\n  return res;\n}',
      python: 'def insert(intervals: list[list[int]], newInterval: list[int]) -> list[list[int]]:\n    res = []\n    i, n = 0, len(intervals)\n    while i < n and intervals[i][1] < newInterval[0]:\n        res.append(intervals[i]); i += 1\n    while i < n and intervals[i][0] <= newInterval[1]:\n        newInterval = [min(newInterval[0], intervals[i][0]), max(newInterval[1], intervals[i][1])]\n        i += 1\n    res.append(newInterval)\n    while i < n: res.append(intervals[i]); i += 1\n    return res',
      java: 'class Solution {\n    public int[][] insert(int[][] intervals, int[] newInterval) {\n        java.util.List<int[]> res = new java.util.ArrayList<>();\n        int i = 0, n = intervals.length;\n        while (i < n && intervals[i][1] < newInterval[0]) res.add(intervals[i++]);\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = Math.min(newInterval[0], intervals[i][0]);\n            newInterval[1] = Math.max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        res.add(newInterval);\n        while (i < n) res.add(intervals[i++]);\n        return res.toArray(new int[res.size()][]);\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> insert(vector<vector<int>>& intervals, vector<int>& newInterval) {\n        vector<vector<int>> res;\n        size_t i = 0, n = intervals.size();\n        while (i < n && intervals[i][1] < newInterval[0]) res.push_back(intervals[i++]);\n        while (i < n && intervals[i][0] <= newInterval[1]) {\n            newInterval[0] = min(newInterval[0], intervals[i][0]);\n            newInterval[1] = max(newInterval[1], intervals[i][1]);\n            i++;\n        }\n        res.push_back(newInterval);\n        while (i < n) res.push_back(intervals[i++]);\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[[1,3],[6,9]], [2,5]', expectedOutput: '[[1,5],[6,9]]' },
      { input: '[[1,2],[3,5],[6,7],[8,10],[12,16]], [4,8]', expectedOutput: '[[1,2],[3,10],[12,16]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Non-overlapping Intervals',
    slug: 'non-overlapping-intervals',
    difficulty: 'Medium',
    category: 'Intervals',
    description: 'Given an array of intervals intervals where intervals[i] = [starti, endi], return the minimum number of intervals you need to remove to make the rest of the intervals non-overlapping.',
    examples: [
      { input: 'intervals = [[1,2],[2,3],[3,4],[1,3]]', output: '1', explanation: '[1,3] can be removed and the rest of the intervals are non-overlapping.' },
      { input: 'intervals = [[1,2],[1,2],[1,2]]', output: '2', explanation: 'Need to remove two [1,2].' }
    ],
    constraints: ['1 <= intervals.length <= 10^5', 'intervals[i].length == 2', '-5 * 10^4 <= starti < endi <= 5 * 10^4'],
    hints: ['Sort intervals by end time ascending.', 'Greedily keep the interval with earliest finish time to maximize room for subsequent intervals.'],
    starterCode: {
      javascript: 'function eraseOverlapIntervals(intervals) {\n  if (!intervals.length) return 0;\n  intervals.sort((a, b) => a[1] - b[1]);\n  let count = 0, prevEnd = intervals[0][1];\n  for (let i = 1; i < intervals.length; i++) {\n    if (intervals[i][0] < prevEnd) {\n      count++;\n    } else {\n      prevEnd = intervals[i][1];\n    }\n  }\n  return count;\n}',
      python: 'def eraseOverlapIntervals(intervals: list[list[int]]) -> int:\n    if not intervals: return 0\n    intervals.sort(key=lambda x: x[1])\n    count = 0\n    prev_end = intervals[0][1]\n    for i in range(1, len(intervals)):\n        if intervals[i][0] < prev_end: count += 1\n        else: prev_end = intervals[i][1]\n    return count',
      java: 'class Solution {\n    public int eraseOverlapIntervals(int[][] intervals) {\n        if (intervals.length == 0) return 0;\n        java.util.Arrays.sort(intervals, (a, b) -> Integer.compare(a[1], b[1]));\n        int count = 0, prevEnd = intervals[0][1];\n        for (int i = 1; i < intervals.length; i++) {\n            if (intervals[i][0] < prevEnd) count++;\n            else prevEnd = intervals[i][1];\n        }\n        return count;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int eraseOverlapIntervals(vector<vector<int>>& intervals) {\n        if (intervals.empty()) return 0;\n        sort(intervals.begin(), intervals.end(), [](const vector<int>& a, const vector<int>& b) {\n            return a[1] < b[1];\n        });\n        int count = 0, prevEnd = intervals[0][1];\n        for (size_t i = 1; i < intervals.size(); i++) {\n            if (intervals[i][0] < prevEnd) count++;\n            else prevEnd = intervals[i][1];\n        }\n        return count;\n    }\n};'
    },
    testCases: [
      { input: '[[1,2],[2,3],[3,4],[1,3]]', expectedOutput: '1' },
      { input: '[[1,2],[1,2],[1,2]]', expectedOutput: '2' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Set Matrix Zeroes',
    slug: 'set-matrix-zeroes',
    difficulty: 'Medium',
    category: 'Matrix',
    description: 'Given an m x n integer matrix matrix, if an element is 0, set its entire row and column to 0\'s. Solve in-place using O(1) constant auxiliary space.',
    examples: [
      { input: 'matrix = [[1,1,1],[1,0,1],[1,1,1]]', output: '[[1,0,1],[0,0,0],[1,0,1]]', explanation: 'Row 1 and col 1 set to 0.' },
      { input: 'matrix = [[0,1,2,0],[3,4,5,2],[1,3,1,5]]', output: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]', explanation: 'Matrix zeroes applied.' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[0].length', '1 <= m, n <= 200', '-2^31 <= matrix[i][j] <= 2^31 - 1'],
    hints: ['Use the first row and first column of the matrix itself as flag markers.', 'Track first row and first col zero status in two boolean variables.'],
    starterCode: {
      javascript: 'function setZeroes(matrix) {\n  const m = matrix.length, n = matrix[0].length;\n  let rowZero = false, colZero = false;\n  for (let r = 0; r < m; r++) if (matrix[r][0] === 0) colZero = true;\n  for (let c = 0; c < n; c++) if (matrix[0][c] === 0) rowZero = true;\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][c] === 0) {\n        matrix[r][0] = 0;\n        matrix[0][c] = 0;\n      }\n    }\n  }\n  for (let r = 1; r < m; r++) {\n    for (let c = 1; c < n; c++) {\n      if (matrix[r][0] === 0 || matrix[0][c] === 0) matrix[r][c] = 0;\n    }\n  }\n  if (colZero) for (let r = 0; r < m; r++) matrix[r][0] = 0;\n  if (rowZero) for (let c = 0; c < n; c++) matrix[0][c] = 0;\n  return matrix;\n}',
      python: 'def setZeroes(matrix: list[list[int]]) -> None:\n    m, n = len(matrix), len(matrix[0])\n    row_zero = any(matrix[0][c] == 0 for c in range(n))\n    col_zero = any(matrix[r][0] == 0 for r in range(m))\n    for r in range(1, m):\n        for c in range(1, n):\n            if matrix[r][c] == 0:\n                matrix[r][0] = matrix[0][c] = 0\n    for r in range(1, m):\n        for c in range(1, n):\n            if matrix[r][0] == 0 or matrix[0][c] == 0: matrix[r][c] = 0\n    if col_zero:\n        for r in range(m): matrix[r][0] = 0\n    if row_zero:\n        for c in range(n): matrix[0][c] = 0',
      java: 'class Solution {\n    public void setZeroes(int[][] matrix) {\n        int m = matrix.length, n = matrix[0].length;\n        boolean row0 = false, col0 = false;\n        for (int r = 0; r < m; r++) if (matrix[r][0] == 0) col0 = true;\n        for (int c = 0; c < n; c++) if (matrix[0][c] == 0) row0 = true;\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                if (matrix[r][c] == 0) { matrix[r][0] = 0; matrix[0][c] = 0; }\n            }\n        }\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;\n            }\n        }\n        if (col0) for (int r = 0; r < m; r++) matrix[r][0] = 0;\n        if (row0) for (int c = 0; c < n; c++) matrix[0][c] = 0;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void setZeroes(vector<vector<int>>& matrix) {\n        int m = matrix.size(), n = matrix[0].size();\n        bool row0 = false, col0 = false;\n        for (int r = 0; r < m; r++) if (matrix[r][0] == 0) col0 = true;\n        for (int c = 0; c < n; c++) if (matrix[0][c] == 0) row0 = true;\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                if (matrix[r][c] == 0) { matrix[r][0] = 0; matrix[0][c] = 0; }\n            }\n        }\n        for (int r = 1; r < m; r++) {\n            for (int c = 1; c < n; c++) {\n                if (matrix[r][0] == 0 || matrix[0][c] == 0) matrix[r][c] = 0;\n            }\n        }\n        if (col0) for (int r = 0; r < m; r++) matrix[r][0] = 0;\n        if (row0) for (int c = 0; c < n; c++) matrix[0][c] = 0;\n    }\n};'
    },
    testCases: [
      { input: '[[1,1,1],[1,0,1],[1,1,1]]', expectedOutput: '[[1,0,1],[0,0,0],[1,0,1]]' },
      { input: '[[0,1,2,0],[3,4,5,2],[1,3,1,5]]', expectedOutput: '[[0,0,0,0],[0,4,5,0],[0,3,1,0]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Spiral Matrix',
    slug: 'spiral-matrix',
    difficulty: 'Medium',
    category: 'Matrix',
    description: 'Given an m x n matrix, return all elements of the matrix in spiral order.',
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[1,2,3,6,9,8,7,4,5]', explanation: 'Clockwise spiral traversal.' },
      { input: 'matrix = [[1,2,3,4],[5,6,7,8],[9,10,11,12]]', output: '[1,2,3,4,8,12,11,10,9,5,6,7]', explanation: '3x4 spiral order.' }
    ],
    constraints: ['m == matrix.length', 'n == matrix[i].length', '1 <= m, n <= 10', '-100 <= matrix[i][j] <= 100'],
    hints: ['Maintain four boundaries: top, bottom, left, right.', 'Traverse right, down, left, up, adjusting boundaries inward after each direction.'],
    starterCode: {
      javascript: 'function spiralOrder(matrix) {\n  if (!matrix.length) return [];\n  const res = [];\n  let top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n  while (top <= bottom && left <= right) {\n    for (let c = left; c <= right; c++) res.push(matrix[top][c]);\n    top++;\n    for (let r = top; r <= bottom; r++) res.push(matrix[r][right]);\n    right--;\n    if (top <= bottom) {\n      for (let c = right; c >= left; c--) res.push(matrix[bottom][c]);\n      bottom--;\n    }\n    if (left <= right) {\n      for (let r = bottom; r >= top; r--) res.push(matrix[r][left]);\n      left++;\n    }\n  }\n  return res;\n}',
      python: 'def spiralOrder(matrix: list[list[int]]) -> list[int]:\n    res = []\n    if not matrix: return res\n    top, bottom, left, right = 0, len(matrix) - 1, 0, len(matrix[0]) - 1\n    while top <= bottom and left <= right:\n        for c in range(left, right + 1): res.append(matrix[top][c])\n        top += 1\n        for r in range(top, bottom + 1): res.append(matrix[r][right])\n        right -= 1\n        if top <= bottom:\n            for c in range(right, left - 1, -1): res.append(matrix[bottom][c])\n            bottom -= 1\n        if left <= right:\n            for r in range(bottom, top - 1, -1): res.append(matrix[r][left])\n            left += 1\n    return res',
      java: 'class Solution {\n    public java.util.List<Integer> spiralOrder(int[][] matrix) {\n        java.util.List<Integer> res = new java.util.ArrayList<>();\n        if (matrix.length == 0) return res;\n        int top = 0, bottom = matrix.length - 1, left = 0, right = matrix[0].length - 1;\n        while (top <= bottom && left <= right) {\n            for (int c = left; c <= right; c++) res.add(matrix[top][c]);\n            top++;\n            for (int r = top; r <= bottom; r++) res.add(matrix[r][right]);\n            right--;\n            if (top <= bottom) {\n                for (int c = right; c >= left; c--) res.add(matrix[bottom][c]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int r = bottom; r >= top; r--) res.add(matrix[r][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> spiralOrder(vector<vector<int>>& matrix) {\n        if (matrix.empty()) return {};\n        vector<int> res;\n        int top = 0, bottom = matrix.size() - 1, left = 0, right = matrix[0].size() - 1;\n        while (top <= bottom && left <= right) {\n            for (int c = left; c <= right; c++) res.push_back(matrix[top][c]);\n            top++;\n            for (int r = top; r <= bottom; r++) res.push_back(matrix[r][right]);\n            right--;\n            if (top <= bottom) {\n                for (int c = right; c >= left; c--) res.push_back(matrix[bottom][c]);\n                bottom--;\n            }\n            if (left <= right) {\n                for (int r = bottom; r >= top; r--) res.push_back(matrix[r][left]);\n                left++;\n            }\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[1,2,3,6,9,8,7,4,5]' },
      { input: '[[1,2,3,4],[5,6,7,8],[9,10,11,12]]', expectedOutput: '[1,2,3,4,8,12,11,10,9,5,6,7]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Rotate Image',
    slug: 'rotate-image',
    difficulty: 'Medium',
    category: 'Matrix',
    description: 'You are given an n x n 2D matrix representing an image, rotate the image by 90 degrees (clockwise). You have to rotate the image in-place, which means you have to modify the input 2D matrix directly.',
    examples: [
      { input: 'matrix = [[1,2,3],[4,5,6],[7,8,9]]', output: '[[7,4,1],[8,5,2],[9,6,3]]', explanation: '90 degree clockwise rotation.' },
      { input: 'matrix = [[5,1,9,11],[2,4,8,10],[13,3,6,7],[15,14,12,16]]', output: '[[15,13,2,5],[14,3,4,1],[12,6,8,9],[16,7,10,11]]', explanation: '4x4 matrix rotated.' }
    ],
    constraints: ['n == matrix.length == matrix[i].length', '1 <= n <= 20', '-1000 <= matrix[i][j] <= 1000'],
    hints: ['Transpose the matrix along its main diagonal (swap matrix[i][j] and matrix[j][i]).', 'Reverse each row of the matrix.'],
    starterCode: {
      javascript: 'function rotate(matrix) {\n  const n = matrix.length;\n  for (let i = 0; i < n; i++) {\n    for (let j = i + 1; j < n; j++) {\n      const temp = matrix[i][j];\n      matrix[i][j] = matrix[j][i];\n      matrix[j][i] = temp;\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    matrix[i].reverse();\n  }\n  return matrix;\n}',
      python: 'def rotate(matrix: list[list[int]]) -> None:\n    n = len(matrix)\n    for i in range(n):\n        for j in range(i + 1, n):\n            matrix[i][j], matrix[j][i] = matrix[j][i], matrix[i][j]\n    for row in matrix: row.reverse()',
      java: 'class Solution {\n    public void rotate(int[][] matrix) {\n        int n = matrix.length;\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) {\n                int t = matrix[i][j]; matrix[i][j] = matrix[j][i]; matrix[j][i] = t;\n            }\n        }\n        for (int i = 0; i < n; i++) {\n            for (int j = 0; j < n / 2; j++) {\n                int t = matrix[i][j]; matrix[i][j] = matrix[i][n - 1 - j]; matrix[i][n - 1 - j] = t;\n            }\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    void rotate(vector<vector<int>>& matrix) {\n        int n = matrix.size();\n        for (int i = 0; i < n; i++) {\n            for (int j = i + 1; j < n; j++) swap(matrix[i][j], matrix[j][i]);\n        }\n        for (int i = 0; i < n; i++) reverse(matrix[i].begin(), matrix[i].end());\n    }\n};'
    },
    testCases: [
      { input: '[[1,2,3],[4,5,6],[7,8,9]]', expectedOutput: '[[7,4,1],[8,5,2],[9,6,3]]' },
      { input: '[[1]]', expectedOutput: '[[1]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Count Primes (Sieve of Eratosthenes)',
    slug: 'count-primes',
    difficulty: 'Medium',
    category: 'Math / Number Theory',
    description: 'Given an integer n, return the number of prime numbers that are strictly less than n. Use the Sieve of Eratosthenes in O(n log log n) time.',
    examples: [
      { input: 'n = 10', output: '4', explanation: 'There are 4 prime numbers less than 10: 2, 3, 5, 7.' },
      { input: 'n = 0', output: '0', explanation: 'No primes.' },
      { input: 'n = 1', output: '0', explanation: 'No primes.' }
    ],
    constraints: ['0 <= n <= 5 * 10^6'],
    hints: ['Initialize boolean array isPrime of size n with true.', 'Start at 2, for each prime p, mark all multiples p*p, p*(p+1), ... as false.'],
    starterCode: {
      javascript: 'function countPrimes(n) {\n  if (n <= 2) return 0;\n  const isPrime = new Uint8Array(n).fill(1);\n  isPrime[0] = isPrime[1] = 0;\n  for (let p = 2; p * p < n; p++) {\n    if (isPrime[p]) {\n      for (let i = p * p; i < n; i += p) isPrime[i] = 0;\n    }\n  }\n  return isPrime.reduce((acc, val) => acc + val, 0);\n}',
      python: 'def countPrimes(n: int) -> int:\n    if n <= 2: return 0\n    is_prime = bytearray([1]) * n\n    is_prime[0] = is_prime[1] = 0\n    for p in range(2, int(n**0.5) + 1):\n        if is_prime[p]:\n            is_prime[p*p:n:p] = bytearray([0]) * len(is_prime[p*p:n:p])\n    return sum(is_prime)',
      java: 'class Solution {\n    public int countPrimes(int n) {\n        if (n <= 2) return 0;\n        boolean[] isPrime = new boolean[n];\n        java.util.Arrays.fill(isPrime, true);\n        for (int p = 2; p * p < n; p++) {\n            if (isPrime[p]) {\n                for (int i = p * p; i < n; i += p) isPrime[i] = false;\n            }\n        }\n        int count = 0;\n        for (int i = 2; i < n; i++) if (isPrime[i]) count++;\n        return count;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countPrimes(int n) {\n        if (n <= 2) return 0;\n        vector<bool> isPrime(n, true);\n        for (int p = 2; p * p < n; p++) {\n            if (isPrime[p]) {\n                for (int i = p * p; i < n; i += p) isPrime[i] = false;\n            }\n        }\n        int count = 0;\n        for (int i = 2; i < n; i++) if (isPrime[i]) count++;\n        return count;\n    }\n};'
    },
    testCases: [
      { input: '10', expectedOutput: '4' },
      { input: '0', expectedOutput: '0' },
      { input: '1', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Multiply Strings',
    slug: 'multiply-strings',
    difficulty: 'Medium',
    category: 'Math / Number Theory',
    description: 'Given two non-negative integers num1 and num2 represented as strings, return the product of num1 and num2, also represented as a string. Note: You must not use any built-in BigInteger library or convert the inputs to integer directly.',
    examples: [
      { input: 'num1 = "2", num2 = "3"', output: '"6"', explanation: '2 * 3 = 6.' },
      { input: 'num1 = "123", num2 = "456"', output: '"56088"', explanation: '123 * 456 = 56088.' }
    ],
    constraints: ['1 <= num1.length, num2.length <= 200', 'num1 and num2 consist of digits only.', 'Both num1 and num2 do not contain any leading zero, except the number 0 itself.'],
    hints: ['The product of two numbers of lengths m and n has at most m + n digits.', 'Digit i from num1 and digit j from num2 contribute to indices i + j and i + j + 1.'],
    starterCode: {
      javascript: 'function multiply(num1, num2) {\n  if (num1 === "0" || num2 === "0") return "0";\n  const m = num1.length, n = num2.length;\n  const pos = new Array(m + n).fill(0);\n  for (let i = m - 1; i >= 0; i--) {\n    for (let j = n - 1; j >= 0; j--) {\n      const mul = parseInt(num1[i]) * parseInt(num2[j]);\n      const p1 = i + j, p2 = i + j + 1;\n      const sum = mul + pos[p2];\n      pos[p2] = sum % 10;\n      pos[p1] += Math.floor(sum / 10);\n    }\n  }\n  while (pos.length > 1 && pos[0] === 0) pos.shift();\n  return pos.join("");\n}',
      python: 'def multiply(num1: str, num2: str) -> str:\n    if num1 == "0" or num2 == "0": return "0"\n    m, n = len(num1), len(num2)\n    pos = [0] * (m + n)\n    for i in range(m - 1, -1, -1):\n        for j in range(n - 1, -1, -1):\n            mul = int(num1[i]) * int(num2[j])\n            p1, p2 = i + j, i + j + 1\n            s = mul + pos[p2]\n            pos[p2] = s % 10\n            pos[p1] += s // 10\n    start = 0\n    while start < len(pos) - 1 and pos[start] == 0: start += 1\n    return "".join(map(str, pos[start:]))',
      java: 'class Solution {\n    public String multiply(String num1, String num2) {\n        if (num1.equals("0") || num2.equals("0")) return "0";\n        int m = num1.length(), n = num2.length;\n        int[] pos = new int[m + n];\n        for (int i = m - 1; i >= 0; i--) {\n            for (int j = n - 1; j >= 0; j--) {\n                int mul = (num1.charAt(i) - \'0\') * (num2.charAt(j) - \'0\');\n                int p1 = i + j, p2 = i + j + 1;\n                int sum = mul + pos[p2];\n                pos[p2] = sum % 10;\n                pos[p1] += sum / 10;\n            }\n        }\n        StringBuilder sb = new StringBuilder();\n        for (int p : pos) if (!(sb.length() == 0 && p == 0)) sb.append(p);\n        return sb.length() == 0 ? "0" : sb.toString();\n    }\n}',
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    string multiply(string num1, string num2) {\n        if (num1 == "0" || num2 == "0") return "0";\n        int m = num1.size(), n = num2.size();\n        vector<int> pos(m + n, 0);\n        for (int i = m - 1; i >= 0; i--) {\n            for (int j = n - 1; j >= 0; j--) {\n                int mul = (num1[i] - \'0\') * (num2[j] - \'0\');\n                int p1 = i + j, p2 = i + j + 1;\n                int sum = mul + pos[p2];\n                pos[p2] = sum % 10;\n                pos[p1] += sum / 10;\n            }\n        }\n        string res = "";\n        for (int p : pos) if (!(res.empty() && p == 0)) res += to_string(p);\n        return res.empty() ? "0" : res;\n    }\n};'
    },
    testCases: [
      { input: '"2", "3"', expectedOutput: '"6"' },
      { input: '"123", "456"', expectedOutput: '"56088"' },
      { input: '"0", "0"', expectedOutput: '"0"' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  }
];
