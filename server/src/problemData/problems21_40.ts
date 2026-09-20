import { DSAProblemFull } from './types';

export const PROBLEMS_21_40: DSAProblemFull[] = [
  {
    title: 'Isomorphic Strings',
    slug: 'isomorphic-strings',
    difficulty: 'Easy',
    category: 'Hashing',
    description: 'Given two strings s and t, determine if they are isomorphic. Two strings s and t are isomorphic if the characters in s can be replaced to get t, preserving character order and establishing a bijective mapping.',
    examples: [
      { input: 's = "egg", t = "add"', output: 'true', explanation: 'e->a, g->d bijective mapping.' },
      { input: 's = "foo", t = "bar"', output: 'false', explanation: 'o cannot map to both a and r.' }
    ],
    constraints: ['1 <= s.length <= 5 * 10^4', 't.length == s.length', 's and t consist of any valid ASCII character.'],
    hints: ['Track mapping from s to t and t to s simultaneously.', 'If a character from s is already mapped to a different character in t, return false.'],
    starterCode: {
      javascript: 'function isIsomorphic(s, t) {\n  const mapS = new Map(), mapT = new Map();\n  for (let i = 0; i < s.length; i++) {\n    const c1 = s[i], c2 = t[i];\n    if (mapS.has(c1) && mapS.get(c1) !== c2) return false;\n    if (mapT.has(c2) && mapT.get(c2) !== c1) return false;\n    mapS.set(c1, c2);\n    mapT.set(c2, c1);\n  }\n  return true;\n}',
      python: 'def isIsomorphic(s: str, t: str) -> bool:\n    return len(set(s)) == len(set(t)) == len(set(zip(s, t)))',
      java: 'class Solution {\n    public boolean isIsomorphic(String s, String t) {\n        int[] m1 = new int[256], m2 = new int[256];\n        for (int i = 0; i < s.length(); i++) {\n            if (m1[s.charAt(i)] != m2[t.charAt(i)]) return false;\n            m1[s.charAt(i)] = i + 1;\n            m2[t.charAt(i)] = i + 1;\n        }\n        return true;\n    }\n}',
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isIsomorphic(string s, string t) {\n        vector<int> m1(256, 0), m2(256, 0);\n        for (size_t i = 0; i < s.length(); i++) {\n            if (m1[(unsigned char)s[i]] != m2[(unsigned char)t[i]]) return false;\n            m1[(unsigned char)s[i]] = i + 1;\n            m2[(unsigned char)t[i]] = i + 1;\n        }\n        return true;\n    }\n};'
    },
    testCases: [
      { input: '"egg", "add"', expectedOutput: 'true' },
      { input: '"foo", "bar"', expectedOutput: 'false' },
      { input: '"paper", "title"', expectedOutput: 'true' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Design HashMap',
    slug: 'design-hashmap',
    difficulty: 'Easy',
    category: 'Hashing',
    description: 'Design a HashMap without using any built-in hash table libraries. Implement MyHashMap with put(key, value), get(key), and remove(key).',
    examples: [
      { input: '["MyHashMap","put","put","get","get","put","get","remove","get"]\n[[],[1,1],[2,2],[1],[3],[2,1],[2],[2],[2]]', output: '[null,null,null,1,-1,null,1,null,-1]', explanation: 'Standard hash map key-value storage.' }
    ],
    constraints: ['0 <= key, value <= 10^6', 'At most 10^4 calls will be made to put, get, and remove.'],
    hints: ['Use an array of size 1000 with linked lists or vectors to handle collisions.', 'Calculate bucket index using key % bucket_size.'],
    starterCode: {
      javascript: 'class MyHashMap {\n  constructor() {\n    this.size = 1000;\n    this.buckets = Array.from({ length: this.size }, () => []);\n  }\n  put(key, value) {\n    const b = this.buckets[key % this.size];\n    const item = b.find(p => p[0] === key);\n    if (item) item[1] = value;\n    else b.push([key, value]);\n  }\n  get(key) {\n    const b = this.buckets[key % this.size];\n    const item = b.find(p => p[0] === key);\n    return item ? item[1] : -1;\n  }\n  remove(key) {\n    const b = this.buckets[key % this.size];\n    const idx = b.findIndex(p => p[0] === key);\n    if (idx !== -1) b.splice(idx, 1);\n  }\n}',
      python: 'class MyHashMap:\n    def __init__(self):\n        self.size = 1000\n        self.table = [[] for _ in range(self.size)]\n    def put(self, key: int, value: int) -> None:\n        bucket = self.table[key % self.size]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                bucket[i] = (key, value)\n                return\n        bucket.append((key, value))\n    def get(self, key: int) -> int:\n        bucket = self.table[key % self.size]\n        for k, v in bucket:\n            if k == key: return v\n        return -1\n    def remove(self, key: int) -> None:\n        bucket = self.table[key % self.size]\n        for i, (k, v) in enumerate(bucket):\n            if k == key:\n                del bucket[i]\n                return',
      java: 'class MyHashMap {\n    private int[] data;\n    public MyHashMap() {\n        data = new int[1000001];\n        java.util.Arrays.fill(data, -1);\n    }\n    public void put(int key, int value) { data[key] = value; }\n    public int get(int key) { return data[key]; }\n    public void remove(int key) { data[key] = -1; }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass MyHashMap {\n    vector<int> data;\npublic:\n    MyHashMap() : data(1000001, -1) {}\n    void put(int key, int value) { data[key] = value; }\n    int get(int key) { return data[key]; }\n    void remove(int key) { data[key] = -1; }\n};'
    },
    testCases: [
      { input: 'put(1,1), put(2,2), get(1), get(3)', expectedOutput: '[1, -1]' },
      { input: 'put(2,1), get(2), remove(2), get(2)', expectedOutput: '[1, -1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Longest Consecutive Sequence',
    slug: 'longest-consecutive-sequence',
    difficulty: 'Medium',
    category: 'Hashing',
    description: 'Given an unsorted array of integers nums, return the length of the longest consecutive elements sequence. You must write an algorithm that runs in O(n) time.',
    examples: [
      { input: 'nums = [100,4,200,1,3,2]', output: '4', explanation: 'The longest consecutive elements sequence is [1, 2, 3, 4]. Its length is 4.' },
      { input: 'nums = [0,3,7,2,5,8,4,6,0,1]', output: '9', explanation: 'Longest sequence length is 9.' }
    ],
    constraints: ['0 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: ['Store all numbers in a HashSet for O(1) membership checks.', 'Only begin expanding a sequence if num - 1 is NOT in the set (i.e. num is a sequence start).'],
    starterCode: {
      javascript: 'function longestConsecutive(nums) {\n  const set = new Set(nums);\n  let maxLen = 0;\n  for (const num of set) {\n    if (!set.has(num - 1)) {\n      let cur = num, len = 1;\n      while (set.has(cur + 1)) { cur++; len++; }\n      maxLen = Math.max(maxLen, len);\n    }\n  }\n  return maxLen;\n}',
      python: 'def longestConsecutive(nums: list[int]) -> int:\n    num_set = set(nums)\n    max_len = 0\n    for n in num_set:\n        if n - 1 not in num_set:\n            cur = n\n            cur_len = 1\n            while cur + 1 in num_set:\n                cur += 1\n                cur_len += 1\n            max_len = max(max_len, cur_len)\n    return max_len',
      java: 'class Solution {\n    public int longestConsecutive(int[] nums) {\n        java.util.Set<Integer> set = new java.util.HashSet<>();\n        for (int n : nums) set.add(n);\n        int maxLen = 0;\n        for (int n : set) {\n            if (!set.contains(n - 1)) {\n                int cur = n, len = 1;\n                while (set.contains(cur + 1)) { cur++; len++; }\n                maxLen = Math.max(maxLen, len);\n            }\n        }\n        return maxLen;\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_set>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int longestConsecutive(vector<int>& nums) {\n        unordered_set<int> s(nums.begin(), nums.end());\n        int maxLen = 0;\n        for (int n : s) {\n            if (!s.count(n - 1)) {\n                int cur = n, len = 1;\n                while (s.count(cur + 1)) { cur++; len++; }\n                maxLen = max(maxLen, len);\n            }\n        }\n        return maxLen;\n    }\n};'
    },
    testCases: [
      { input: '[100,4,200,1,3,2]', expectedOutput: '4' },
      { input: '[0,3,7,2,5,8,4,6,0,1]', expectedOutput: '9' },
      { input: '[]', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Insert Delete GetRandom O(1)',
    slug: 'insert-delete-getrandom-o1',
    difficulty: 'Medium',
    category: 'Hashing',
    description: 'Implement the RandomizedSet class. Must support insert(val), remove(val), and getRandom() each in average O(1) time complexity.',
    examples: [
      { input: '["RandomizedSet","insert","remove","insert","getRandom","remove","insert","getRandom"]\n[[],[1],[2],[2],[],[1],[2],[]]', output: '[null,true,false,true,2,true,false,2]', explanation: 'RandomizedSet O(1) operations.' }
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'At most 2 * 10^5 calls will be made to insert, remove, and getRandom.'],
    hints: ['Combine a dynamic Array (for O(1) random index access) and a HashMap (for O(1) index lookup).', 'To remove in O(1), swap the element to remove with the last element of the array, pop the array, and update indices.'],
    starterCode: {
      javascript: 'class RandomizedSet {\n  constructor() {\n    this.list = [];\n    this.map = new Map();\n  }\n  insert(val) {\n    if (this.map.has(val)) return false;\n    this.map.set(val, this.list.length);\n    this.list.push(val);\n    return true;\n  }\n  remove(val) {\n    if (!this.map.has(val)) return false;\n    const idx = this.map.get(val);\n    const lastVal = this.list[this.list.length - 1];\n    this.list[idx] = lastVal;\n    this.map.set(lastVal, idx);\n    this.list.pop();\n    this.map.delete(val);\n    return true;\n  }\n  getRandom() {\n    return this.list[Math.floor(Math.random() * this.list.length)];\n  }\n}',
      python: 'import random\n\nclass RandomizedSet:\n    def __init__(self):\n        self.nums = []\n        self.pos = {}\n    def insert(self, val: int) -> bool:\n        if val in self.pos: return False\n        self.pos[val] = len(self.nums)\n        self.nums.append(val)\n        return True\n    def remove(self, val: int) -> bool:\n        if val not in self.pos: return False\n        idx, last = self.pos[val], self.nums[-1]\n        self.nums[idx] = last\n        self.pos[last] = idx\n        self.nums.pop()\n        del self.pos[val]\n        return True\n    def getRandom(self) -> int:\n        return random.choice(self.nums)',
      java: 'class RandomizedSet {\n    private java.util.ArrayList<Integer> nums = new java.util.ArrayList<>();\n    private java.util.HashMap<Integer, Integer> map = new java.util.HashMap<>();\n    private java.util.Random rand = new java.util.Random();\n    public boolean insert(int val) {\n        if (map.containsKey(val)) return false;\n        map.put(val, nums.size());\n        nums.add(val);\n        return true;\n    }\n    public boolean remove(int val) {\n        if (!map.containsKey(val)) return false;\n        int idx = map.get(val);\n        int last = nums.get(nums.size() - 1);\n        nums.set(idx, last);\n        map.put(last, idx);\n        nums.remove(nums.size() - 1);\n        map.remove(val);\n        return true;\n    }\n    public int getRandom() { return nums.get(rand.nextInt(nums.size())); }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\n#include <cstdlib>\nusing namespace std;\n\nclass RandomizedSet {\n    vector<int> nums;\n    unordered_map<int, int> pos;\npublic:\n    bool insert(int val) {\n        if (pos.count(val)) return false;\n        pos[val] = nums.size();\n        nums.push_back(val);\n        return true;\n    }\n    bool remove(int val) {\n        if (!pos.count(val)) return false;\n        int idx = pos[val], last = nums.back();\n        nums[idx] = last;\n        pos[last] = idx;\n        nums.pop_back();\n        pos.erase(val);\n        return true;\n    }\n    int getRandom() { return nums[rand() % nums.size()]; }\n};'
    },
    testCases: [
      { input: 'insert(1), remove(2), insert(2)', expectedOutput: '[true, false, true]' },
      { input: 'insert(1), remove(1)', expectedOutput: '[true, true]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Max Points on a Line',
    slug: 'max-points-on-a-line',
    difficulty: 'Hard',
    category: 'Hashing',
    description: 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane, return the maximum number of points that lie on the same straight line.',
    examples: [
      { input: 'points = [[1,1],[2,2],[3,3]]', output: '3', explanation: 'All three points lie on the line y = x.' },
      { input: 'points = [[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]', output: '4', explanation: '4 points lie on the same line.' }
    ],
    constraints: ['1 <= points.length <= 300', 'points[i].length == 2', '-10^4 <= xi, yi <= 10^4'],
    hints: ['For each point i, calculate slopes (dy/dx in reduced fraction form using GCD) to all other points j.', 'Find the maximum frequency of slope from point i.'],
    starterCode: {
      javascript: 'function maxPoints(points) {\n  if (points.length <= 2) return points.length;\n  let maxPts = 0;\n  const gcd = (a, b) => (b === 0 ? a : gcd(b, a % b));\n  for (let i = 0; i < points.length; i++) {\n    const slopes = new Map();\n    let curMax = 0;\n    for (let j = i + 1; j < points.length; j++) {\n      let dx = points[j][0] - points[i][0];\n      let dy = points[j][1] - points[i][1];\n      const g = gcd(dx, dy);\n      dx /= g; dy /= g;\n      const key = `${dx}/${dy}`;\n      slopes.set(key, (slopes.get(key) || 0) + 1);\n      curMax = Math.max(curMax, slopes.get(key));\n    }\n    maxPts = Math.max(maxPts, curMax + 1);\n  }\n  return maxPts;\n}',
      python: 'import math\nfrom collections import defaultdict\n\ndef maxPoints(points: list[list[int]]) -> int:\n    if len(points) <= 2: return len(points)\n    max_pts = 0\n    for i in range(len(points)):\n        slopes = defaultdict(int)\n        cur_max = 0\n        for j in range(i + 1, len(points)):\n            dx = points[j][0] - points[i][0]\n            dy = points[j][1] - points[i][1]\n            g = math.gcd(dx, dy)\n            slope = (dx // g, dy // g)\n            slopes[slope] += 1\n            cur_max = max(cur_max, slopes[slope])\n        max_pts = max(max_pts, cur_max + 1)\n    return max_pts',
      java: 'class Solution {\n    public int maxPoints(int[][] points) {\n        if (points.length <= 2) return points.length;\n        int maxPts = 0;\n        for (int i = 0; i < points.length; i++) {\n            java.util.Map<String, Integer> map = new java.util.HashMap<>();\n            int curMax = 0;\n            for (int j = i + 1; j < points.length; j++) {\n                int dx = points[j][0] - points[i][0];\n                int dy = points[j][1] - points[i][1];\n                int g = gcd(dx, dy);\n                dx /= g; dy /= g;\n                String key = dx + \"/\" + dy;\n                map.put(key, map.getOrDefault(key, 0) + 1);\n                curMax = Math.max(curMax, map.get(key));\n            }\n            maxPts = Math.max(maxPts, curMax + 1);\n        }\n        return maxPts;\n    }\n    private int gcd(int a, int b) { return b == 0 ? a : gcd(b, a % b); }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\n#include <numeric>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxPoints(vector<vector<int>>& points) {\n        if (points.size() <= 2) return points.size();\n        int maxPts = 0;\n        for (size_t i = 0; i < points.size(); i++) {\n            unordered_map<string, int> map;\n            int curMax = 0;\n            for (size_t j = i + 1; j < points.size(); j++) {\n                int dx = points[j][0] - points[i][0];\n                int dy = points[j][1] - points[i][1];\n                int g = std::gcd(dx, dy);\n                dx /= g; dy /= g;\n                string key = to_string(dx) + \"/\" + to_string(dy);\n                curMax = max(curMax, ++map[key]);\n            }\n            maxPts = max(maxPts, curMax + 1);\n        }\n        return maxPts;\n    }\n};'
    },
    testCases: [
      { input: '[[1,1],[2,2],[3,3]]', expectedOutput: '3' },
      { input: '[[1,1],[3,2],[5,3],[4,1],[2,3],[1,4]]', expectedOutput: '4' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Two Sum II - Input Array Is Sorted',
    slug: 'two-sum-ii-input-array-is-sorted',
    difficulty: 'Easy',
    category: 'Two Pointers',
    description: 'Given a 1-indexed array of integers numbers that is already sorted in non-decreasing order, find two numbers such that they add up to a specific target number. Return their 1-indexed positions [index1, index2].',
    examples: [
      { input: 'numbers = [2,7,11,15], target = 9', output: '[1,2]', explanation: 'The sum of 2 and 7 is 9. Therefore index1 = 1, index2 = 2.' },
      { input: 'numbers = [2,3,4], target = 6', output: '[1,3]', explanation: 'The sum of 2 and 4 is 6.' }
    ],
    constraints: ['2 <= numbers.length <= 3 * 10^4', '-1000 <= numbers[i] <= 1000', 'numbers is sorted in non-decreasing order.'],
    hints: ['Use two pointers: left at start (0) and right at end (n-1).', 'If sum < target increment left; if sum > target decrement right.'],
    starterCode: {
      javascript: 'function twoSum(numbers, target) {\n  let l = 0, r = numbers.length - 1;\n  while (l < r) {\n    const sum = numbers[l] + numbers[r];\n    if (sum === target) return [l + 1, r + 1];\n    if (sum < target) l++;\n    else r--;\n  }\n  return [];\n}',
      python: 'def twoSum(numbers: list[int], target: int) -> list[int]:\n    l, r = 0, len(numbers) - 1\n    while l < r:\n        s = numbers[l] + numbers[r]\n        if s == target: return [l + 1, r + 1]\n        elif s < target: l += 1\n        else: r -= 1\n    return []',
      java: 'class Solution {\n    public int[] twoSum(int[] numbers, int target) {\n        int l = 0, r = numbers.length - 1;\n        while (l < r) {\n            int sum = numbers[l] + numbers[r];\n            if (sum == target) return new int[]{l + 1, r + 1};\n            if (sum < target) l++;\n            else r--;\n        }\n        return new int[0];\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& numbers, int target) {\n        int l = 0, r = numbers.size() - 1;\n        while (l < r) {\n            int sum = numbers[l] + numbers[r];\n            if (sum == target) return {l + 1, r + 1};\n            if (sum < target) l++;\n            else r--;\n        }\n        return {};\n    }\n};'
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[1,2]' },
      { input: '[2,3,4], 6', expectedOutput: '[1,3]' },
      { input: '[-1,0], -1', expectedOutput: '[1,2]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Remove Duplicates from Sorted Array',
    slug: 'remove-duplicates-from-sorted-array',
    difficulty: 'Easy',
    category: 'Two Pointers',
    description: 'Given an integer array nums sorted in non-decreasing order, remove the duplicates in-place such that each unique element appears only once. Return the number of unique elements k.',
    examples: [
      { input: 'nums = [1,1,2]', output: '2', explanation: 'k = 2, with first two elements being [1, 2].' },
      { input: 'nums = [0,0,1,1,1,2,2,3,3,4]', output: '5', explanation: 'k = 5, with elements [0, 1, 2, 3, 4].' }
    ],
    constraints: ['1 <= nums.length <= 3 * 10^4', '-100 <= nums[i] <= 100', 'nums is sorted in non-decreasing order.'],
    hints: ['Maintain slow pointer insertPos where unique elements are placed.', 'Scan with fast pointer and only copy when nums[fast] != nums[insertPos].'],
    starterCode: {
      javascript: 'function removeDuplicates(nums) {\n  if (!nums.length) return 0;\n  let k = 1;\n  for (let i = 1; i < nums.length; i++) {\n    if (nums[i] !== nums[i - 1]) {\n      nums[k++] = nums[i];\n    }\n  }\n  return k;\n}',
      python: 'def removeDuplicates(nums: list[int]) -> int:\n    if not nums: return 0\n    k = 1\n    for i in range(1, len(nums)):\n        if nums[i] != nums[i - 1]:\n            nums[k] = nums[i]\n            k += 1\n    return k',
      java: 'class Solution {\n    public int removeDuplicates(int[] nums) {\n        if (nums.length == 0) return 0;\n        int k = 1;\n        for (int i = 1; i < nums.length; i++) {\n            if (nums[i] != nums[i - 1]) nums[k++] = nums[i];\n        }\n        return k;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int removeDuplicates(vector<int>& nums) {\n        if (nums.empty()) return 0;\n        int k = 1;\n        for (size_t i = 1; i < nums.size(); i++) {\n            if (nums[i] != nums[i - 1]) nums[k++] = nums[i];\n        }\n        return k;\n    }\n};'
    },
    testCases: [
      { input: '[1,1,2]', expectedOutput: '2' },
      { input: '[0,0,1,1,1,2,2,3,3,4]', expectedOutput: '5' },
      { input: '[1]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Container With Most Water',
    slug: 'container-with-most-water',
    difficulty: 'Medium',
    category: 'Two Pointers',
    description: 'You are given an integer array height of length n. Find two lines that together with the x-axis form a container, such that the container contains the most water. Return the maximum amount of water a container can store.',
    examples: [
      { input: 'height = [1,8,6,2,5,4,8,3,7]', output: '49', explanation: 'Max water between indices 1 and 8: min(8, 7) * (8 - 1) = 49.' },
      { input: 'height = [1,1]', output: '1', explanation: 'Max water is min(1, 1) * 1 = 1.' }
    ],
    constraints: ['n == height.length', '2 <= n <= 10^5', '0 <= height[i] <= 10^4'],
    hints: ['Use two pointers at the two ends.', 'The area is limited by the shorter line: always shift the pointer pointing to the shorter line inward.'],
    starterCode: {
      javascript: 'function maxArea(height) {\n  let l = 0, r = height.length - 1, maxW = 0;\n  while (l < r) {\n    const area = Math.min(height[l], height[r]) * (r - l);\n    maxW = Math.max(maxW, area);\n    if (height[l] < height[r]) l++;\n    else r--;\n  }\n  return maxW;\n}',
      python: 'def maxArea(height: list[int]) -> int:\n    l, r = 0, len(height) - 1\n    max_w = 0\n    while l < r:\n        area = min(height[l], height[r]) * (r - l)\n        max_w = max(max_w, area)\n        if height[l] < height[r]: l += 1\n        else: r -= 1\n    return max_w',
      java: 'class Solution {\n    public int maxArea(int[] height) {\n        int l = 0, r = height.length - 1, maxW = 0;\n        while (l < r) {\n            int area = Math.min(height[l], height[r]) * (r - l);\n            maxW = Math.max(maxW, area);\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxW;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxArea(vector<int>& height) {\n        int l = 0, r = height.size() - 1, maxW = 0;\n        while (l < r) {\n            int area = min(height[l], height[r]) * (r - l);\n            maxW = max(maxW, area);\n            if (height[l] < height[r]) l++;\n            else r--;\n        }\n        return maxW;\n    }\n};'
    },
    testCases: [
      { input: '[1,8,6,2,5,4,8,3,7]', expectedOutput: '49' },
      { input: '[1,1]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Sort Colors (Dutch National Flag)',
    slug: 'sort-colors',
    difficulty: 'Medium',
    category: 'Two Pointers',
    description: 'Given an array nums with n objects colored red, white, or blue (represented as 0, 1, and 2), sort them in-place so that objects of the same color are adjacent, with the colors in the order red, white, and blue (0, 1, 2).',
    examples: [
      { input: 'nums = [2,0,2,1,1,0]', output: '[0,0,1,1,2,2]', explanation: 'Sorted in-place in 0, 1, 2 order.' },
      { input: 'nums = [2,0,1]', output: '[0,1,2]', explanation: 'Sorted array.' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 300', 'nums[i] is either 0, 1, or 2.'],
    hints: ['Dutch National Flag 3-way partitioning algorithm.', 'Maintain low, mid, high pointers. If nums[mid] == 0 swap with low; if 2 swap with high.'],
    starterCode: {
      javascript: 'function sortColors(nums) {\n  let low = 0, mid = 0, high = nums.length - 1;\n  while (mid <= high) {\n    if (nums[mid] === 0) {\n      [nums[low], nums[mid]] = [nums[mid], nums[low]];\n      low++; mid++;\n    } else if (nums[mid] === 1) {\n      mid++;\n    } else {\n      [nums[mid], nums[high]] = [nums[high], nums[mid]];\n      high--;\n    }\n  }\n  return nums;\n}',
      python: 'def sortColors(nums: list[int]) -> list[int]:\n    low, mid, high = 0, 0, len(nums) - 1\n    while mid <= high:\n        if nums[mid] == 0:\n            nums[low], nums[mid] = nums[mid], nums[low]\n            low += 1; mid += 1\n        elif nums[mid] == 1:\n            mid += 1\n        else:\n            nums[mid], nums[high] = nums[high], nums[mid]\n            high -= 1\n    return nums',
      java: 'class Solution {\n    public void sortColors(int[] nums) {\n        int low = 0, mid = 0, high = nums.length - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) {\n                int t = nums[low]; nums[low++] = nums[mid]; nums[mid++] = t;\n            } else if (nums[mid] == 1) {\n                mid++;\n            } else {\n                int t = nums[mid]; nums[mid] = nums[high]; nums[high--] = t;\n            }\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    void sortColors(vector<int>& nums) {\n        int low = 0, mid = 0, high = nums.size() - 1;\n        while (mid <= high) {\n            if (nums[mid] == 0) swap(nums[low++], nums[mid++]);\n            else if (nums[mid] == 1) mid++;\n            else swap(nums[mid], nums[high--]);\n        }\n    }\n};'
    },
    testCases: [
      { input: '[2,0,2,1,1,0]', expectedOutput: '[0,0,1,1,2,2]' },
      { input: '[2,0,1]', expectedOutput: '[0,1,2]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Trapping Rain Water II',
    slug: 'trapping-rain-water-ii',
    difficulty: 'Hard',
    category: 'Two Pointers',
    description: 'Given an m x n integer matrix heightMap representing the height of each unit cell in a 2D elevation map, return the volume of water it can trap after raining.',
    examples: [
      { input: 'heightMap = [[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]', output: '4', explanation: 'Total 4 units of trapped water.' },
      { input: 'heightMap = [[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]]', output: '10', explanation: 'Total 10 units trapped.' }
    ],
    constraints: ['m == heightMap.length', 'n == heightMap[i].length', '1 <= m, n <= 200', '0 <= heightMap[i][j] <= 2 * 10^4'],
    hints: ['Use a min-heap priority queue initialized with all border cells.', 'Pop the lowest boundary cell and explore all 4 neighbors, updating water = max(0, boundary - neighbor_height).'],
    starterCode: {
      javascript: 'function trapRainWater(heightMap) {\n  if (!heightMap.length || !heightMap[0].length) return 0;\n  const m = heightMap.length, n = heightMap[0].length;\n  const visited = Array.from({ length: m }, () => new Array(n).fill(false));\n  const minHeap = []; // [h, r, c]\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (r === 0 || r === m - 1 || c === 0 || c === n - 1) {\n        minHeap.push([heightMap[r][c], r, c]);\n        visited[r][c] = true;\n      }\n    }\n  }\n  minHeap.sort((a, b) => a[0] - b[0]);\n  let water = 0, dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  while (minHeap.length > 0) {\n    const [h, r, c] = minHeap.shift();\n    for (const [dr, dc] of dirs) {\n      const nr = r + dr, nc = c + dc;\n      if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {\n        visited[nr][nc] = true;\n        water += Math.max(0, h - heightMap[nr][nc]);\n        minHeap.push([Math.max(h, heightMap[nr][nc]), nr, nc]);\n        minHeap.sort((a, b) => a[0] - b[0]);\n      }\n    }\n  }\n  return water;\n}',
      python: 'import heapq\n\ndef trapRainWater(heightMap: list[list[int]]) -> int:\n    if not heightMap or not heightMap[0]: return 0\n    m, n = len(heightMap), len(heightMap[0])\n    visited = [[False] * n for _ in range(m)]\n    heap = []\n    for r in range(m):\n        for c in range(n):\n            if r in (0, m - 1) or c in (0, n - 1):\n                heapq.heappush(heap, (heightMap[r][c], r, c))\n                visited[r][c] = True\n    water = 0\n    while heap:\n        h, r, c = heapq.heappop(heap)\n        for dr, dc in [(0, 1), (0, -1), (1, 0), (-1, 0)]:\n            nr, nc = r + dr, c + dc\n            if 0 <= nr < m and 0 <= nc < n and not visited[nr][nc]:\n                visited[nr][nc] = True\n                water += max(0, h - heightMap[nr][nc])\n                heapq.heappush(heap, (max(h, heightMap[nr][nc]), nr, nc))\n    return water',
      java: 'class Solution {\n    public int trapRainWater(int[][] heightMap) {\n        if (heightMap.length == 0 || heightMap[0].length == 0) return 0;\n        int m = heightMap.length, n = heightMap[0].length;\n        boolean[][] visited = new boolean[m][n];\n        java.util.PriorityQueue<int[]> pq = new java.util.PriorityQueue<>((a, b) -> a[0] - b[0]);\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (r == 0 || r == m - 1 || c == 0 || c == n - 1) {\n                    pq.offer(new int[]{heightMap[r][c], r, c});\n                    visited[r][c] = true;\n                }\n            }\n        }\n        int water = 0;\n        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n        while (!pq.isEmpty()) {\n            int[] cell = pq.poll();\n            for (int[] d : dirs) {\n                int nr = cell[1] + d[0], nc = cell[2] + d[1];\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {\n                    visited[nr][nc] = true;\n                    water += Math.max(0, cell[0] - heightMap[nr][nc]);\n                    pq.offer(new int[]{Math.max(cell[0], heightMap[nr][nc]), nr, nc});\n                }\n            }\n        }\n        return water;\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trapRainWater(vector<vector<int>>& heightMap) {\n        if (heightMap.empty() || heightMap[0].empty()) return 0;\n        int m = heightMap.size(), n = heightMap[0].size();\n        vector<vector<bool>> visited(m, vector<bool>(n, false));\n        priority_queue<vector<int>, vector<vector<int>>, greater<vector<int>>> pq;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (r == 0 || r == m - 1 || c == 0 || c == n - 1) {\n                    pq.push({heightMap[r][c], r, c});\n                    visited[r][c] = true;\n                }\n            }\n        }\n        int water = 0;\n        int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};\n        while (!pq.empty()) {\n            auto cell = pq.top(); pq.pop();\n            for (auto& d : dirs) {\n                int nr = cell[1] + d[0], nc = cell[2] + d[1];\n                if (nr >= 0 && nr < m && nc >= 0 && nc < n && !visited[nr][nc]) {\n                    visited[nr][nc] = true;\n                    water += max(0, cell[0] - heightMap[nr][nc]);\n                    pq.push({max(cell[0], heightMap[nr][nc]), nr, nc});\n                }\n            }\n        }\n        return water;\n    }\n};'
    },
    testCases: [
      { input: '[[1,4,3,1,3,2],[3,2,1,3,2,4],[2,3,3,2,3,1]]', expectedOutput: '4' },
      { input: '[[3,3,3,3,3],[3,2,2,2,3],[3,2,1,2,3],[3,2,2,2,3],[3,3,3,3,3]]', expectedOutput: '10' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Maximum Average Subarray I',
    slug: 'maximum-average-subarray-i',
    difficulty: 'Easy',
    category: 'Sliding Window',
    description: 'You are given an integer array nums consisting of n elements, and an integer k. Find a contiguous subarray whose length is equal to k that has the maximum average value and return this value.',
    examples: [
      { input: 'nums = [1,12,-5,-6,50,3], k = 4', output: '12.75', explanation: 'Maximum average is (12 - 5 - 6 + 50) / 4 = 51 / 4 = 12.75.' },
      { input: 'nums = [5], k = 1', output: '5.0', explanation: 'Average of single element.' }
    ],
    constraints: ['n == nums.length', '1 <= k <= n <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Compute the sum of the first k elements.', 'Slide the window of length k by adding nums[i] and subtracting nums[i - k].'],
    starterCode: {
      javascript: 'function findMaxAverage(nums, k) {\n  let curSum = 0;\n  for (let i = 0; i < k; i++) curSum += nums[i];\n  let maxSum = curSum;\n  for (let i = k; i < nums.length; i++) {\n    curSum += nums[i] - nums[i - k];\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum / k;\n}',
      python: 'def findMaxAverage(nums: list[int], k: int) -> float:\n    cur_sum = sum(nums[:k])\n    max_sum = cur_sum\n    for i in range(k, len(nums)):\n        cur_sum += nums[i] - nums[i - k]\n        max_sum = max(max_sum, cur_sum)\n    return max_sum / k',
      java: 'class Solution {\n    public double findMaxAverage(int[] nums, int k) {\n        long curSum = 0;\n        for (int i = 0; i < k; i++) curSum += nums[i];\n        long maxSum = curSum;\n        for (int i = k; i < nums.length; i++) {\n            curSum += nums[i] - nums[i - k];\n            maxSum = Math.max(maxSum, curSum);\n        }\n        return (double) maxSum / k;\n    }\n}',
      cpp: '#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMaxAverage(vector<int>& nums, int k) {\n        double curSum = 0;\n        for (int i = 0; i < k; i++) curSum += nums[i];\n        double maxSum = curSum;\n        for (size_t i = k; i < nums.size(); i++) {\n            curSum += nums[i] - nums[i - k];\n            maxSum = max(maxSum, curSum);\n        }\n        return maxSum / k;\n    }\n};'
    },
    testCases: [
      { input: '[1,12,-5,-6,50,3], 4', expectedOutput: '12.75' },
      { input: '[5], 1', expectedOutput: '5' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Longest Repeating Character Replacement',
    slug: 'longest-repeating-character-replacement',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'You are given a string s and an integer k. You can choose any character of the string and change it to any other uppercase English character at most k times. Return the length of the longest substring containing the same letter you can get after performing the above operations.',
    examples: [
      { input: 's = "ABAB", k = 2', output: '4', explanation: 'Replace the two "A"s with "B"s or vice versa.' },
      { input: 's = "AABABBA", k = 1', output: '4', explanation: 'Replace the middle "A" with "B" to get "AABBBBA".' }
    ],
    constraints: ['1 <= s.length <= 10^5', 's consists of only uppercase English letters.', '0 <= k <= s.length'],
    hints: ['Window validity check: (window length) - (max frequency of any single character) <= k.', 'If invalid, shift left pointer.'],
    starterCode: {
      javascript: 'function characterReplacement(s, k) {\n  const count = new Array(26).fill(0);\n  let left = 0, maxCount = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    maxCount = Math.max(maxCount, ++count[s.charCodeAt(right) - 65]);\n    while ((right - left + 1) - maxCount > k) {\n      count[s.charCodeAt(left) - 65]--;\n      left++;\n    }\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}',
      python: 'def characterReplacement(s: str, k: int) -> int:\n    count = {}\n    left = max_count = max_len = 0\n    for right, char in enumerate(s):\n        count[char] = count.get(char, 0) + 1\n        max_count = max(max_count, count[char])\n        while (right - left + 1) - max_count > k:\n            count[s[left]] -= 1\n            left += 1\n        max_len = max(max_len, right - left + 1)\n    return max_len',
      java: 'class Solution {\n    public int characterReplacement(String s, int k) {\n        int[] count = new int[26];\n        int left = 0, maxCount = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            maxCount = Math.max(maxCount, ++count[s.charAt(right) - \'A\']);\n            while ((right - left + 1) - maxCount > k) {\n                count[s.charAt(left++) - \'A\']--;\n            }\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}',
      cpp: '#include <string>\n#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int characterReplacement(string s, int k) {\n        vector<int> count(26, 0);\n        int left = 0, maxCount = 0, maxLen = 0;\n        for (int right = 0; right < (int)s.length(); right++) {\n            maxCount = max(maxCount, ++count[s[right] - \'A\']);\n            while ((right - left + 1) - maxCount > k) {\n                count[s[left++] - \'A\']--;\n            }\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};'
    },
    testCases: [
      { input: '"ABAB", 2', expectedOutput: '4' },
      { input: '"AABABBA", 1', expectedOutput: '4' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Permutation in String',
    slug: 'permutation-in-string',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given two strings s1 and s2, return true if s2 contains a permutation of s1, or false otherwise. In other words, return true if one of s1\'s permutations is the substring of s2.',
    examples: [
      { input: 's1 = "ab", s2 = "eidbaooo"', output: 'true', explanation: 's2 contains one permutation of s1 ("ba").' },
      { input: 's1 = "ab", s2 = "eidboaoo"', output: 'false', explanation: 's2 does not contain any permutation of s1.' }
    ],
    constraints: ['1 <= s1.length, s2.length <= 10^4', 's1 and s2 consist of lowercase English letters.'],
    hints: ['Count frequency of characters in s1.', 'Maintain a fixed sliding window of size len(s1) across s2 and check if frequency counts match.'],
    starterCode: {
      javascript: 'function checkInclusion(s1, s2) {\n  if (s1.length > s2.length) return false;\n  const c1 = new Array(26).fill(0), c2 = new Array(26).fill(0);\n  for (let i = 0; i < s1.length; i++) {\n    c1[s1.charCodeAt(i) - 97]++;\n    c2[s2.charCodeAt(i) - 97]++;\n  }\n  const match = () => c1.every((v, i) => v === c2[i]);\n  if (match()) return true;\n  for (let i = s1.length; i < s2.length; i++) {\n    c2[s2.charCodeAt(i) - 97]++;\n    c2[s2.charCodeAt(i - s1.length) - 97]--;\n    if (match()) return true;\n  }\n  return false;\n}',
      python: 'def checkInclusion(s1: str, s2: str) -> bool:\n    if len(s1) > len(s2): return False\n    c1, c2 = [0] * 26, [0] * 26\n    for i in range(len(s1)):\n        c1[ord(s1[i]) - 97] += 1\n        c2[ord(s2[i]) - 97] += 1\n    if c1 == c2: return True\n    for i in range(len(s1), len(s2)):\n        c2[ord(s2[i]) - 97] += 1\n        c2[ord(s2[i - len(s1)]) - 97] -= 1\n        if c1 == c2: return True\n    return False',
      java: 'class Solution {\n    public boolean checkInclusion(String s1, String s2) {\n        if (s1.length() > s2.length()) return false;\n        int[] c1 = new int[26], c2 = new int[26];\n        for (int i = 0; i < s1.length(); i++) {\n            c1[s1.charAt(i) - \'a\']++;\n            c2[s2.charAt(i) - \'a\']++;\n        }\n        if (java.util.Arrays.equals(c1, c2)) return true;\n        for (int i = s1.length(); i < s2.length(); i++) {\n            c2[s2.charAt(i) - \'a\']++;\n            c2[s2.charAt(i - s1.length()) - \'a\']--;\n            if (java.util.Arrays.equals(c1, c2)) return true;\n        }\n        return false;\n    }\n}',
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool checkInclusion(string s1, string s2) {\n        if (s1.length() > s2.length()) return false;\n        vector<int> c1(26, 0), c2(26, 0);\n        for (size_t i = 0; i < s1.length(); i++) {\n            c1[s1[i] - \'a\']++;\n            c2[s2[i] - \'a\']++;\n        }\n        if (c1 == c2) return true;\n        for (size_t i = s1.length(); i < s2.length(); i++) {\n            c2[s2[i] - \'a\']++;\n            c2[s2[i - s1.length()] - \'a\']--;\n            if (c1 == c2) return true;\n        }\n        return false;\n    }\n};'
    },
    testCases: [
      { input: '"ab", "eidbaooo"', expectedOutput: 'true' },
      { input: '"ab", "eidboaoo"', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Sliding Window Maximum',
    slug: 'sliding-window-maximum',
    difficulty: 'Hard',
    category: 'Sliding Window',
    description: 'You are given an array of integers nums, there is a sliding window of size k which is moving from the very left of the array to the very right. You can only see the k numbers in the window. Each time the sliding window moves right by one position. Return the max sliding window.',
    examples: [
      { input: 'nums = [1,3,-1,-3,5,3,6,7], k = 3', output: '[3,3,5,5,6,7]', explanation: 'Sliding window maximums for k=3.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Single element window.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', '1 <= k <= nums.length'],
    hints: ['Use a monotonic double-ended queue (deque) storing indices of elements.', 'Maintain elements in decreasing order in the deque. The front of the deque is always the maximum of the current window.'],
    starterCode: {
      javascript: 'function maxSlidingWindow(nums, k) {\n  const deque = [];\n  const res = [];\n  for (let i = 0; i < nums.length; i++) {\n    if (deque.length && deque[0] < i - k + 1) deque.shift();\n    while (deque.length && nums[deque[deque.length - 1]] < nums[i]) deque.pop();\n    deque.push(i);\n    if (i >= k - 1) res.push(nums[deque[0]]);\n  }\n  return res;\n}',
      python: 'from collections import deque\n\ndef maxSlidingWindow(nums: list[int], k: int) -> list[int]:\n    q = deque()\n    res = []\n    for i, n in enumerate(nums):\n        if q and q[0] < i - k + 1: q.popleft()\n        while q and nums[q[-1]] < n: q.pop()\n        q.append(i)\n        if i >= k - 1: res.append(nums[q[0]])\n    return res',
      java: 'class Solution {\n    public int[] maxSlidingWindow(int[] nums, int k) {\n        int n = nums.length;\n        int[] res = new int[n - k + 1];\n        java.util.Deque<Integer> dq = new java.util.ArrayDeque<>();\n        for (int i = 0; i < n; i++) {\n            if (!dq.isEmpty() && dq.peekFirst() < i - k + 1) dq.pollFirst();\n            while (!dq.isEmpty() && nums[dq.peekLast()] < nums[i]) dq.pollLast();\n            dq.offerLast(i);\n            if (i >= k - 1) res[i - k + 1] = nums[dq.peekFirst()];\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <deque>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> maxSlidingWindow(vector<int>& nums, int k) {\n        deque<int> dq;\n        vector<int> res;\n        for (int i = 0; i < (int)nums.size(); i++) {\n            if (!dq.empty() && dq.front() < i - k + 1) dq.pop_front();\n            while (!dq.empty() && nums[dq.back()] < nums[i]) dq.pop_back();\n            dq.push_back(i);\n            if (i >= k - 1) res.push_back(nums[dq.front()]);\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[1,3,-1,-3,5,3,6,7], 3', expectedOutput: '[3,3,5,5,6,7]' },
      { input: '[1], 1', expectedOutput: '[1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Binary Search',
    slug: 'binary-search',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: 'Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums. If target exists, then return its index. Otherwise, return -1.',
    examples: [
      { input: 'nums = [-1,0,3,5,9,12], target = 9', output: '4', explanation: '9 exists in nums and its index is 4.' },
      { input: 'nums = [-1,0,3,5,9,12], target = 2', output: '-1', explanation: '2 does not exist in nums so return -1.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 < nums[i], target < 10^4', 'All integers in nums are unique and sorted in ascending order.'],
    hints: ['Set left = 0, right = nums.length - 1.', 'Calculate mid = left + Math.floor((right - left) / 2) to prevent 32-bit integer overflow.'],
    starterCode: {
      javascript: 'function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return -1;\n}',
      python: 'def search(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return -1',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return -1;\n    }\n};'
    },
    testCases: [
      { input: '[-1,0,3,5,9,12], 9', expectedOutput: '4' },
      { input: '[-1,0,3,5,9,12], 2', expectedOutput: '-1' },
      { input: '[5], 5', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Search Insert Position',
    slug: 'search-insert-position',
    difficulty: 'Easy',
    category: 'Binary Search',
    description: 'Given a sorted array of distinct integers and a target value, return the index if the target is found. If not, return the index where it would be if it were inserted in order. Solve in O(log n) time.',
    examples: [
      { input: 'nums = [1,3,5,6], target = 5', output: '2', explanation: '5 is found at index 2.' },
      { input: 'nums = [1,3,5,6], target = 2', output: '1', explanation: '2 would be inserted at index 1.' },
      { input: 'nums = [1,3,5,6], target = 7', output: '4', explanation: '7 would be inserted at index 4.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-10^4 <= nums[i], target <= 10^4', 'nums contains distinct values sorted in ascending order.'],
    hints: ['Run binary search; if element is not found, left pointer points to the correct insertion point.'],
    starterCode: {
      javascript: 'function searchInsert(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[mid] < target) l = mid + 1;\n    else r = mid - 1;\n  }\n  return l;\n}',
      python: 'def searchInsert(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        elif nums[mid] < target: l = mid + 1\n        else: r = mid - 1\n    return l',
      java: 'class Solution {\n    public int searchInsert(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return l;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int searchInsert(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[mid] < target) l = mid + 1;\n            else r = mid - 1;\n        }\n        return l;\n    }\n};'
    },
    testCases: [
      { input: '[1,3,5,6], 5', expectedOutput: '2' },
      { input: '[1,3,5,6], 2', expectedOutput: '1' },
      { input: '[1,3,5,6], 7', expectedOutput: '4' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Find Peak Element',
    slug: 'find-peak-element',
    difficulty: 'Medium',
    category: 'Binary Search',
    description: 'A peak element is an element that is strictly greater than its neighbors. Given a 0-indexed integer array nums, find a peak element, and return its index. If the array contains multiple peaks, return the index to any of the peaks. Solve in O(log n) time.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: '2', explanation: '3 is a peak element and its index is 2.' },
      { input: 'nums = [1,2,1,3,5,6,4]', output: '5', explanation: 'Your function can return index 1 or 5.' }
    ],
    constraints: ['1 <= nums.length <= 1000', '-2^31 <= nums[i] <= 2^31 - 1', 'nums[i] != nums[i + 1] for all valid i.'],
    hints: ['If nums[mid] < nums[mid + 1], there must be a peak on the right side.', 'Otherwise, a peak exists on the left side (including mid).'],
    starterCode: {
      javascript: 'function findPeakElement(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] < nums[mid + 1]) l = mid + 1;\n    else r = mid;\n  }\n  return l;\n}',
      python: 'def findPeakElement(nums: list[int]) -> int:\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] < nums[mid + 1]: l = mid + 1\n        else: r = mid\n    return l',
      java: 'class Solution {\n    public int findPeakElement(int[] nums) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] < nums[mid + 1]) l = mid + 1;\n            else r = mid;\n        }\n        return l;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findPeakElement(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] < nums[mid + 1]) l = mid + 1;\n            else r = mid;\n        }\n        return l;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: '2' },
      { input: '[1,2,1,3,5,6,4]', expectedOutput: '5' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Search in Rotated Sorted Array',
    slug: 'search-in-rotated-sorted-array',
    difficulty: 'Medium',
    category: 'Binary Search',
    description: 'There is an integer array nums sorted in ascending order (with distinct values). Prior to being passed to your function, nums is possibly rotated at an unknown pivot index k. Given target, return the index of target if it is in nums, or -1 if it is not in nums. Solve in O(log n) time.',
    examples: [
      { input: 'nums = [4,5,6,7,0,1,2], target = 0', output: '4', explanation: '0 is found at index 4.' },
      { input: 'nums = [4,5,6,7,0,1,2], target = 3', output: '-1', explanation: '3 is not present in nums.' }
    ],
    constraints: ['1 <= nums.length <= 5000', '-10^4 <= nums[i], target <= 10^4', 'All values of nums are unique.'],
    hints: ['One half of the rotated array is always sorted.', 'Determine whether left half [l..mid] or right half [mid..r] is sorted, and check if target falls within the sorted range.'],
    starterCode: {
      javascript: 'function search(nums, target) {\n  let l = 0, r = nums.length - 1;\n  while (l <= r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] === target) return mid;\n    if (nums[l] <= nums[mid]) {\n      if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n      else l = mid + 1;\n    } else {\n      if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n      else r = mid - 1;\n    }\n  }\n  return -1;\n}',
      python: 'def search(nums: list[int], target: int) -> int:\n    l, r = 0, len(nums) - 1\n    while l <= r:\n        mid = (l + r) // 2\n        if nums[mid] == target: return mid\n        if nums[l] <= nums[mid]:\n            if nums[l] <= target < nums[mid]: r = mid - 1\n            else: l = mid + 1\n        else:\n            if nums[mid] < target <= nums[r]: l = mid + 1\n            else: r = mid - 1\n    return -1',
      java: 'class Solution {\n    public int search(int[] nums, int target) {\n        int l = 0, r = nums.length - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int search(vector<int>& nums, int target) {\n        int l = 0, r = nums.size() - 1;\n        while (l <= r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] == target) return mid;\n            if (nums[l] <= nums[mid]) {\n                if (nums[l] <= target && target < nums[mid]) r = mid - 1;\n                else l = mid + 1;\n            } else {\n                if (nums[mid] < target && target <= nums[r]) l = mid + 1;\n                else r = mid - 1;\n            }\n        }\n        return -1;\n    }\n};'
    },
    testCases: [
      { input: '[4,5,6,7,0,1,2], 0', expectedOutput: '4' },
      { input: '[4,5,6,7,0,1,2], 3', expectedOutput: '-1' },
      { input: '[1], 0', expectedOutput: '-1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Find Minimum in Rotated Sorted Array',
    slug: 'find-minimum-in-rotated-sorted-array',
    difficulty: 'Medium',
    category: 'Binary Search',
    description: 'Suppose an array of length n sorted in ascending order is rotated between 1 and n times. Given the sorted rotated array nums of unique elements, return the minimum element of this array in O(log n) time.',
    examples: [
      { input: 'nums = [3,4,5,1,2]', output: '1', explanation: 'The original array was [1,2,3,4,5] rotated 3 times.' },
      { input: 'nums = [4,5,6,7,0,1,2]', output: '0', explanation: 'Minimum is 0.' }
    ],
    constraints: ['n == nums.length', '1 <= n <= 5000', '-5000 <= nums[i] <= 5000', 'All the integers of nums are unique.'],
    hints: ['Compare nums[mid] with nums[r].', 'If nums[mid] > nums[r], the minimum must be in the right half (l = mid + 1). Otherwise, it is in the left half (r = mid).'],
    starterCode: {
      javascript: 'function findMin(nums) {\n  let l = 0, r = nums.length - 1;\n  while (l < r) {\n    const mid = Math.floor((l + r) / 2);\n    if (nums[mid] > nums[r]) l = mid + 1;\n    else r = mid;\n  }\n  return nums[l];\n}',
      python: 'def findMin(nums: list[int]) -> int:\n    l, r = 0, len(nums) - 1\n    while l < r:\n        mid = (l + r) // 2\n        if nums[mid] > nums[r]: l = mid + 1\n        else: r = mid\n    return nums[l]',
      java: 'class Solution {\n    public int findMin(int[] nums) {\n        int l = 0, r = nums.length - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] > nums[r]) l = mid + 1;\n            else r = mid;\n        }\n        return nums[l];\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findMin(vector<int>& nums) {\n        int l = 0, r = nums.size() - 1;\n        while (l < r) {\n            int mid = l + (r - l) / 2;\n            if (nums[mid] > nums[r]) l = mid + 1;\n            else r = mid;\n        }\n        return nums[l];\n    }\n};'
    },
    testCases: [
      { input: '[3,4,5,1,2]', expectedOutput: '1' },
      { input: '[4,5,6,7,0,1,2]', expectedOutput: '0' },
      { input: '[11,13,15,17]', expectedOutput: '11' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Median of Two Sorted Arrays',
    slug: 'median-of-two-sorted-arrays',
    difficulty: 'Hard',
    category: 'Binary Search',
    description: 'Given two sorted arrays nums1 and nums2 of size m and n respectively, return the median of the two sorted arrays in O(log (m+n)) time.',
    examples: [
      { input: 'nums1 = [1,3], nums2 = [2]', output: '2.0', explanation: 'merged array = [1,2,3] and median is 2.' },
      { input: 'nums1 = [1,2], nums2 = [3,4]', output: '2.5', explanation: 'merged array = [1,2,3,4] and median is (2 + 3) / 2 = 2.5.' }
    ],
    constraints: ['nums1.length == m', 'nums2.length == n', '0 <= m <= 1000', '0 <= n <= 1000', '1 <= m + n <= 2000', '-10^6 <= nums1[i], nums2[i] <= 10^6'],
    hints: ['Binary search on the smaller array to partition both arrays into equal left and right halves.', 'Ensure maxLeft1 <= minRight2 and maxLeft2 <= minRight1.'],
    starterCode: {
      javascript: 'function findMedianSortedArrays(nums1, nums2) {\n  if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n  const m = nums1.length, n = nums2.length;\n  let l = 0, r = m;\n  while (l <= r) {\n    const p1 = Math.floor((l + r) / 2);\n    const p2 = Math.floor((m + n + 1) / 2) - p1;\n    const maxL1 = p1 === 0 ? -Infinity : nums1[p1 - 1];\n    const minR1 = p1 === m ? Infinity : nums1[p1];\n    const maxL2 = p2 === 0 ? -Infinity : nums2[p2 - 1];\n    const minR2 = p2 === n ? Infinity : nums2[p2];\n    if (maxL1 <= minR2 && maxL2 <= minR1) {\n      if ((m + n) % 2 === 1) return Math.max(maxL1, maxL2);\n      return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2;\n    } else if (maxL1 > minR2) r = p1 - 1;\n    else l = p1 + 1;\n  }\n  return 0;\n}',
      python: 'def findMedianSortedArrays(nums1: list[int], nums2: list[int]) -> float:\n    if len(nums1) > len(nums2): return findMedianSortedArrays(nums2, nums1)\n    m, n = len(nums1), len(nums2)\n    l, r = 0, m\n    while l <= r:\n        p1 = (l + r) // 2\n        p2 = (m + n + 1) // 2 - p1\n        max_l1 = float("-inf") if p1 == 0 else nums1[p1 - 1]\n        min_r1 = float("inf") if p1 == m else nums1[p1]\n        max_l2 = float("-inf") if p2 == 0 else nums2[p2 - 1]\n        min_r2 = float("inf") if p2 == n else nums2[p2]\n        if max_l1 <= min_r2 and max_l2 <= min_r1:\n            if (m + n) % 2 == 1: return float(max(max_l1, max_l2))\n            return (max(max_l1, max_l2) + min(min_r1, min_r2)) / 2.0\n        elif max_l1 > min_r2: r = p1 - 1\n        else: l = p1 + 1\n    return 0.0',
      java: 'class Solution {\n    public double findMedianSortedArrays(int[] nums1, int[] nums2) {\n        if (nums1.length > nums2.length) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.length, n = nums2.length;\n        int l = 0, r = m;\n        while (l <= r) {\n            int p1 = (l + r) / 2;\n            int p2 = (m + n + 1) / 2 - p1;\n            int maxL1 = p1 == 0 ? Integer.MIN_VALUE : nums1[p1 - 1];\n            int minR1 = p1 == m ? Integer.MAX_VALUE : nums1[p1];\n            int maxL2 = p2 == 0 ? Integer.MIN_VALUE : nums2[p2 - 1];\n            int minR2 = p2 == n ? Integer.MAX_VALUE : nums2[p2];\n            if (maxL1 <= minR2 && maxL2 <= minR1) {\n                if ((m + n) % 2 == 1) return Math.max(maxL1, maxL2);\n                return (Math.max(maxL1, maxL2) + Math.min(minR1, minR2)) / 2.0;\n            } else if (maxL1 > minR2) r = p1 - 1;\n            else l = p1 + 1;\n        }\n        return 0.0;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    double findMedianSortedArrays(vector<int>& nums1, vector<int>& nums2) {\n        if (nums1.size() > nums2.size()) return findMedianSortedArrays(nums2, nums1);\n        int m = nums1.size(), n = nums2.size();\n        int l = 0, r = m;\n        while (l <= r) {\n            int p1 = (l + r) / 2;\n            int p2 = (m + n + 1) / 2 - p1;\n            int maxL1 = p1 == 0 ? -1e9 : nums1[p1 - 1];\n            int minR1 = p1 == m ? 1e9 : nums1[p1];\n            int maxL2 = p2 == 0 ? -1e9 : nums2[p2 - 1];\n            int minR2 = p2 == n ? 1e9 : nums2[p2];\n            if (maxL1 <= minR2 && maxL2 <= minR1) {\n                if ((m + n) % 2 == 1) return max(maxL1, maxL2);\n                return (max(maxL1, maxL2) + min(minR1, minR2)) / 2.0;\n            } else if (maxL1 > minR2) r = p1 - 1;\n            else l = p1 + 1;\n        }\n        return 0.0;\n    }\n};'
    },
    testCases: [
      { input: '[1,3], [2]', expectedOutput: '2.0' },
      { input: '[1,2], [3,4]', expectedOutput: '2.5' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  }
];
