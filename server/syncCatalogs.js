const fs = require('fs');
const path = require('path');

const goodProblems = {
  'two-sum': {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays & HashMaps',
    description: 'Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`. You may assume each input has exactly one solution, and you may not use the same element twice.',
    examples: JSON.stringify([
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ]),
    constraints: JSON.stringify([
      '2 <= nums.length <= 10^4',
      '-10^9 <= nums[i] <= 10^9',
      'Only one valid answer exists.'
    ]),
    hints: JSON.stringify([
      'A brute force solution using two nested loops is O(n^2).',
      'Can you use a HashMap to look up target - current_num in O(1) time?'
    ]),
    starterCode: JSON.stringify({
      javascript: 'function twoSum(nums, target) {\n  // Write your code here\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) {\n      return [map.get(complement), i];\n    }\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    # Write your code here\n    seen = {}\n    for i, num in enumerate(nums):\n        comp = target - num\n        if comp in seen:\n            return [seen[comp], i]\n        seen[num] = i\n    return []',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int comp = target - nums[i];\n            if (map.containsKey(comp)) {\n                return new int[] { map.get(comp), i };\n            }\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int comp = target - nums[i];\n            if (map.find(comp) != map.end()) return {map[comp], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};'
    }),
    testCases: JSON.stringify([
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' }
    ]),
    relatedSkillName: 'Data Structures & Algorithms (DSA)',
    contentReady: true
  },
  'binary-search': {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: 'Given an array of integers `nums` which is sorted in ascending order, and an integer `target`, write a function to search `target` in `nums`. If `target` exists, then return its index. Otherwise, return -1. You must write an algorithm with `O(log n)` runtime complexity.',
    examples: JSON.stringify([
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1' }
    ]),
    constraints: JSON.stringify([
      '1 <= nums.length <= 10^4',
      '-10^4 < nums[i], target < 10^4',
      'All the integers in nums are unique and sorted in ascending order.'
    ]),
    hints: JSON.stringify([
      'Maintain left and right pointers.',
      'Beware of integer overflow: calculate mid as left + (right - left) / 2.'
    ]),
    starterCode: JSON.stringify({
      javascript: 'function search(nums, target) {\n  let left = 0, right = nums.length - 1;\n  while (left <= right) {\n    const mid = Math.floor(left + (right - left) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) left = mid + 1;\n    else right = mid - 1;\n  }\n  return -1;\n}',
      python: 'def search(nums: list[int], target: int) -> int:\n    left, right = 0, len(nums) - 1\n    while left <= right:\n        mid = left + (right - left) // 2\n        if nums[mid] == target:\n            return mid\n        elif nums[mid] < target:\n            left = mid + 1\n        else:\n            right = mid - 1\n    return -1',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        int left = 0, right = nums.length - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int left = 0, right = nums.size() - 1;\n        while (left <= right) {\n            int mid = left + (right - left) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) left = mid + 1;\n            else right = mid - 1;\n        }\n        return -1;\n    }\n};'
    }),
    testCases: JSON.stringify([
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' }
    ]),
    relatedSkillName: 'Data Structures & Algorithms (DSA)',
    contentReady: true
  },
  'longest-substring-without-repeating-characters': {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given a string `s`, find the length of the longest substring without repeating characters.',
    examples: JSON.stringify([
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ]),
    constraints: JSON.stringify([
      '0 <= s.length <= 5 * 10^4',
      's consists of English letters, digits, symbols and spaces.'
    ]),
    hints: JSON.stringify([
      'Use the sliding window technique with two pointers [left, right].',
      'Keep track of the last seen index of each character with a hash map.'
    ]),
    starterCode: JSON.stringify({
      javascript: 'function lengthOfLongestSubstring(s) {\n  let maxLength = 0, left = 0;\n  const charMap = new Map();\n  for (let right = 0; right < s.length; right++) {\n    if (charMap.has(s[right]) && charMap.get(s[right]) >= left) {\n      left = charMap.get(s[right]) + 1;\n    }\n    charMap.set(s[right], right);\n    maxLength = Math.max(maxLength, right - left + 1);\n  }\n  return maxLength;\n}',
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    max_len = 0\n    left = 0\n    seen = {}\n    for right, char in enumerate(s):\n        if char in seen and seen[char] >= left:\n            left = seen[char] + 1\n        seen[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        int maxLen = 0, left = 0;\n        java.util.Map<Character, Integer> map = new java.util.HashMap<>();\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c) && map.get(c) >= left) {\n                left = map.get(c) + 1;\n            }\n            map.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}',
      cpp: '#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        int maxLen = 0, left = 0;\n        unordered_map<char, int> map;\n        for (int right = 0; right < s.length(); right++) {\n            if (map.count(s[right]) && map[s[right]] >= left) {\n                left = map[s[right]] + 1;\n            }\n            map[s[right]] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};'
    }),
    testCases: JSON.stringify([
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' }
    ]),
    relatedSkillName: 'Data Structures & Algorithms (DSA)',
    contentReady: true
  }
};

const clientCatalogPath = path.resolve(__dirname, '../client/src/data/dsaCatalog.ts');
const serverCatalogPath = path.resolve(__dirname, './src/data/dsaCatalog.ts');

const currentRaw = fs.readFileSync(clientCatalogPath, 'utf8');

// Match categories array
const categoriesMatch = currentRaw.match(/export const DSA_CATEGORIES: string\[\] = (\[[\s\S]*?\]);/);
const categoriesStr = categoriesMatch ? categoriesMatch[1] : '[]';

// Match catalog array
const catalogMatch = currentRaw.match(/export const DSA_PROBLEMS_CATALOG: DSAProblemItem\[\] = (\[[\s\S]*?\]);/);
const catalogJson = JSON.parse(catalogMatch[1]);

const updatedCatalog = catalogJson.map(item => {
  if (goodProblems[item.slug]) {
    return {
      ...item,
      ...goodProblems[item.slug]
    };
  }
  return {
    ...item,
    contentReady: false
  };
});

const fileHeader = `export interface DSAProblemItem {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: string;
  constraints: string;
  hints: string;
  starterCode: string;
  testCases: string;
  relatedSkillName: string;
  contentReady: boolean;
}

export const DSA_CATEGORIES: string[] = ${categoriesStr};

export const DSA_PROBLEMS_CATALOG: DSAProblemItem[] = ${JSON.stringify(updatedCatalog, null, 2)};
`;

fs.writeFileSync(clientCatalogPath, fileHeader, 'utf8');
fs.writeFileSync(serverCatalogPath, fileHeader, 'utf8');

console.log('Successfully synced client/src/data/dsaCatalog.ts and server/src/data/dsaCatalog.ts');
