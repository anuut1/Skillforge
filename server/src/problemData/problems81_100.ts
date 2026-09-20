import { DSAProblemFull } from './types';

export const PROBLEMS_81_100: DSAProblemFull[] = [
  {
    title: 'Delete Node in a BST',
    slug: 'delete-node-in-a-bst',
    difficulty: 'Medium',
    category: 'Binary Search Tree',
    description: 'Given a root node reference of a BST and a key, delete the node with the given key in the BST. Return the root node reference (possibly updated) of the BST.',
    examples: [
      { input: 'root = [5,3,6,2,4,null,7], key = 3', output: '[5,4,6,2,null,null,7]', explanation: 'Node 3 is deleted and replaced with its in-order successor 4.' },
      { input: 'root = [5,3,6,2,4,null,7], key = 0', output: '[5,3,6,2,4,null,7]', explanation: 'Key 0 is not in tree.' }
    ],
    constraints: ['The number of nodes in the tree is in the range [0, 10^4].', '-10^5 <= Node.val, key <= 10^5', 'Each node has a unique value.'],
    hints: ['If key < root.val, delete from root.left; if key > root.val, delete from root.right.', 'When deleting a node with two children, replace its value with its in-order successor (min value in right subtree) and delete that successor.'],
    starterCode: {
      javascript: 'function deleteNode(root, key) {\n  if (!root) return null;\n  if (key < root.val) root.left = deleteNode(root.left, key);\n  else if (key > root.val) root.right = deleteNode(root.right, key);\n  else {\n    if (!root.left) return root.right;\n    if (!root.right) return root.left;\n    let succ = root.right;\n    while (succ.left) succ = succ.left;\n    root.val = succ.val;\n    root.right = deleteNode(root.right, succ.val);\n  }\n  return root;\n}',
      python: 'def deleteNode(root, key: int):\n    if not root: return None\n    if key < root.val: root.left = deleteNode(root.left, key)\n    elif key > root.val: root.right = deleteNode(root.right, key)\n    else:\n        if not root.left: return root.right\n        if not root.right: return root.left\n        succ = root.right\n        while succ.left: succ = succ.left\n        root.val = succ.val\n        root.right = deleteNode(root.right, succ.val)\n    return root',
      java: 'class Solution {\n    public TreeNode deleteNode(TreeNode root, int key) {\n        if (root == null) return null;\n        if (key < root.val) root.left = deleteNode(root.left, key);\n        else if (key > root.val) root.right = deleteNode(root.right, key);\n        else {\n            if (root.left == null) return root.right;\n            if (root.right == null) return root.left;\n            TreeNode succ = root.right;\n            while (succ.left != null) succ = succ.left;\n            root.val = succ.val;\n            root.right = deleteNode(root.right, succ.val);\n        }\n        return root;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    TreeNode* deleteNode(TreeNode* root, int key) {\n        if (!root) return nullptr;\n        if (key < root->val) root->left = deleteNode(root->left, key);\n        else if (key > root->val) root->right = deleteNode(root->right, key);\n        else {\n            if (!root->left) return root->right;\n            if (!root->right) return root->left;\n            TreeNode* succ = root->right;\n            while (succ->left) succ = succ->left;\n            root->val = succ->val;\n            root->right = deleteNode(root->right, succ->val);\n        }\n        return root;\n    }\n};'
    },
    testCases: [
      { input: '[5,3,6,2,4,null,7], 3', expectedOutput: '[5,4,6,2,null,null,7]' },
      { input: '[5,3,6,2,4,null,7], 0', expectedOutput: '[5,3,6,2,4,null,7]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Last Stone Weight',
    slug: 'last-stone-weight',
    difficulty: 'Easy',
    category: 'Heap / Priority Queue',
    description: 'You are given an array of integers stones where stones[i] is the weight of the ith stone. We are playing a game with the stones. On each turn, we choose the heaviest two stones and smash them together. Return the weight of the last remaining stone. If there are no stones left, return 0.',
    examples: [
      { input: 'stones = [2,7,4,1,8,1]', output: '1', explanation: 'After smashing pairs 8&7 -> 1, 4&2 -> 2, 2&1 -> 1, 1&1 -> 0, remaining stone is 1.' },
      { input: 'stones = [1]', output: '1', explanation: 'Only one stone.' }
    ],
    constraints: ['1 <= stones.length <= 30', '1 <= stones[i] <= 1000'],
    hints: ['Use a Max-Heap Priority Queue.', 'Pop top 2 elements, if y > x push y - x back until at most 1 element remains.'],
    starterCode: {
      javascript: 'function lastStoneWeight(stones) {\n  stones.sort((a, b) => b - a);\n  while (stones.length > 1) {\n    const y = stones.shift();\n    const x = stones.shift();\n    if (y !== x) {\n      stones.push(y - x);\n      stones.sort((a, b) => b - a);\n    }\n  }\n  return stones.length ? stones[0] : 0;\n}',
      python: 'import heapq\n\ndef lastStoneWeight(stones: list[int]) -> int:\n    heap = [-s for s in stones]\n    heapq.heapify(heap)\n    while len(heap) > 1:\n        y = -heapq.heappop(heap)\n        x = -heapq.heappop(heap)\n        if y != x:\n            heapq.heappush(heap, -(y - x))\n    return -heap[0] if heap else 0',
      java: 'class Solution {\n    public int lastStoneWeight(int[] stones) {\n        java.util.PriorityQueue<Integer> pq = new java.util.PriorityQueue<>((a, b) -> b - a);\n        for (int s : stones) pq.offer(s);\n        while (pq.size() > 1) {\n            int y = pq.poll(), x = pq.poll();\n            if (y != x) pq.offer(y - x);\n        }\n        return pq.isEmpty() ? 0 : pq.peek();\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lastStoneWeight(vector<int>& stones) {\n        priority_queue<int> pq(stones.begin(), stones.end());\n        while (pq.size() > 1) {\n            int y = pq.top(); pq.pop();\n            int x = pq.top(); pq.pop();\n            if (y != x) pq.push(y - x);\n        }\n        return pq.empty() ? 0 : pq.top();\n    }\n};'
    },
    testCases: [
      { input: '[2,7,4,1,8,1]', expectedOutput: '1' },
      { input: '[1]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Top K Frequent Elements',
    slug: 'top-k-frequent-elements',
    difficulty: 'Medium',
    category: 'Heap / Priority Queue',
    description: 'Given an integer array nums and an integer k, return the k most frequent elements. You may return the answer in any order. Solve in O(n log k) time or O(n) using Bucket Sort.',
    examples: [
      { input: 'nums = [1,1,1,2,2,3], k = 2', output: '[1,2]', explanation: '1 has freq 3, 2 has freq 2.' },
      { input: 'nums = [1], k = 1', output: '[1]', explanation: 'Single element.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4', 'k is in the range [1, the number of unique elements in the array].'],
    hints: ['Count element frequencies in a Map.', 'Use bucket sort with buckets indexed by frequency from 0 to n.'],
    starterCode: {
      javascript: 'function topKFrequent(nums, k) {\n  const map = new Map();\n  for (const n of nums) map.set(n, (map.get(n) || 0) + 1);\n  const buckets = Array.from({ length: nums.length + 1 }, () => []);\n  for (const [num, freq] of map.entries()) buckets[freq].push(num);\n  const res = [];\n  for (let i = buckets.length - 1; i >= 0 && res.length < k; i--) {\n    if (buckets[i].length) res.push(...buckets[i]);\n  }\n  return res.slice(0, k);\n}',
      python: 'from collections import Counter\n\ndef topKFrequent(nums: list[int], k: int) -> list[int]:\n    count = Counter(nums)\n    return [item for item, freq in count.most_common(k)]',
      java: 'class Solution {\n    public int[] topKFrequent(int[] nums, int k) {\n        java.util.Map<Integer, Integer> count = new java.util.HashMap<>();\n        for (int n : nums) count.put(n, count.getOrDefault(n, 0) + 1);\n        java.util.List<Integer>[] buckets = new java.util.List[nums.length + 1];\n        for (int key : count.keySet()) {\n            int freq = count.get(key);\n            if (buckets[freq] == null) buckets[freq] = new java.util.ArrayList<>();\n            buckets[freq].add(key);\n        }\n        int[] res = new int[k];\n        int idx = 0;\n        for (int i = buckets.length - 1; i >= 0 && idx < k; i--) {\n            if (buckets[i] != null) for (int n : buckets[i]) if (idx < k) res[idx++] = n;\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> topKFrequent(vector<int>& nums, int k) {\n        unordered_map<int, int> count;\n        for (int n : nums) count[n]++;\n        vector<vector<int>> buckets(nums.size() + 1);\n        for (auto& p : count) buckets[p.second].push_back(p.first);\n        vector<int> res;\n        for (int i = buckets.size() - 1; i >= 0 && (int)res.size() < k; i--) {\n            for (int n : buckets[i]) {\n                res.push_back(n);\n                if ((int)res.size() == k) break;\n            }\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[1,1,1,2,2,3], 2', expectedOutput: '[1,2]' },
      { input: '[1], 1', expectedOutput: '[1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'K Closest Points to Origin',
    slug: 'k-closest-points-to-origin',
    difficulty: 'Medium',
    category: 'Heap / Priority Queue',
    description: 'Given an array of points where points[i] = [xi, yi] represents a point on the X-Y plane and an integer k, return the k closest points to the origin (0, 0). The distance between two points is the Euclidean distance.',
    examples: [
      { input: 'points = [[1,3],[-2,2]], k = 1', output: '[[-2,2]]', explanation: 'Distance (-2,2) is sqrt(8) < sqrt(10).' },
      { input: 'points = [[3,3],[5,-1],[-2,4]], k = 2', output: '[[3,3],[-2,4]]', explanation: 'Two closest points.' }
    ],
    constraints: ['1 <= k <= points.length <= 10^4', '-10^4 <= xi, yi <= 10^4'],
    hints: ['Distance metric can be compared using squared distance x^2 + y^2 to avoid floating point square roots.', 'Use a Max-Heap of size k.'],
    starterCode: {
      javascript: 'function kClosest(points, k) {\n  return points\n    .sort((a, b) => (a[0]**2 + a[1]**2) - (b[0]**2 + b[1]**2))\n    .slice(0, k);\n}',
      python: 'def kClosest(points: list[list[int]], k: int) -> list[list[int]]:\n    points.sort(key=lambda p: p[0]**2 + p[1]**2)\n    return points[:k]',
      java: 'class Solution {\n    public int[][] kClosest(int[][] points, int k) {\n        java.util.Arrays.sort(points, (a, b) -> (a[0]*a[0] + a[1]*a[1]) - (b[0]*b[0] + b[1]*b[1]));\n        return java.util.Arrays.copyOfRange(points, 0, k);\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> kClosest(vector<vector<int>>& points, int k) {\n        nth_element(points.begin(), points.begin() + k, points.end(), [](const vector<int>& a, const vector<int>& b) {\n            return (a[0]*a[0] + a[1]*a[1]) < (b[0]*b[0] + b[1]*b[1]);\n        });\n        return vector<vector<int>>(points.begin(), points.begin() + k);\n    }\n};'
    },
    testCases: [
      { input: '[[1,3],[-2,2]], 1', expectedOutput: '[[-2,2]]' },
      { input: '[[3,3],[5,-1],[-2,4]], 2', expectedOutput: '[[3,3],[-2,4]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Find Median from Data Stream',
    slug: 'find-median-from-data-stream',
    difficulty: 'Hard',
    category: 'Heap / Priority Queue',
    description: 'The median is the middle value in an ordered integer list. Implement the MedianFinder class supporting addNum(num) and findMedian() in O(log n) and O(1) time respectively.',
    examples: [
      { input: '["MedianFinder","addNum","addNum","findMedian","addNum","findMedian"]\n[[],[1],[2],[],[3],[]]', output: '[null,null,null,1.5,null,2.0]', explanation: 'Median from data stream.' }
    ],
    constraints: ['-10^5 <= num <= 10^5', 'There will be at least one element in the data structure before calling findMedian.', 'At most 5 * 10^4 calls will be made to addNum and findMedian.'],
    hints: ['Maintain two heaps: maxHeap for lower half of numbers, minHeap for upper half.', 'Balance sizes such that maxHeap has either equal or 1 more element than minHeap.'],
    starterCode: {
      javascript: 'class MedianFinder {\n  constructor() {\n    this.arr = [];\n  }\n  addNum(num) {\n    let l = 0, r = this.arr.length;\n    while (l < r) {\n      const mid = Math.floor((l + r) / 2);\n      if (this.arr[mid] < num) l = mid + 1;\n      else r = mid;\n    }\n    this.arr.splice(l, 0, num);\n  }\n  findMedian() {\n    const n = this.arr.length;\n    if (n % 2 === 1) return this.arr[Math.floor(n / 2)];\n    return (this.arr[n / 2 - 1] + this.arr[n / 2]) / 2;\n  }\n}',
      python: 'import heapq\n\nclass MedianFinder:\n    def __init__(self):\n        self.small = [] # max-heap\n        self.large = [] # min-heap\n    def addNum(self, num: int) -> None:\n        heapq.heappush(self.small, -num)\n        heapq.heappush(self.large, -heapq.heappop(self.small))\n        if len(self.large) > len(self.small):\n            heapq.heappush(self.small, -heapq.heappop(self.large))\n    def findMedian(self) -> float:\n        if len(self.small) > len(self.large):\n            return float(-self.small[0])\n        return (-self.small[0] + self.large[0]) / 2.0',
      java: 'class MedianFinder {\n    private java.util.PriorityQueue<Integer> small = new java.util.PriorityQueue<>((a, b) -> b - a);\n    private java.util.PriorityQueue<Integer> large = new java.util.PriorityQueue<>();\n    public void addNum(int num) {\n        small.offer(num);\n        large.offer(small.poll());\n        if (large.size() > small.size()) small.offer(large.poll());\n    }\n    public double findMedian() {\n        if (small.size() > large.size()) return small.peek();\n        return (small.peek() + large.peek()) / 2.0;\n    }\n}',
      cpp: '#include <queue>\nusing namespace std;\n\nclass MedianFinder {\n    priority_queue<int> small;\n    priority_queue<int, vector<int>, greater<int>> large;\npublic:\n    void addNum(int num) {\n        small.push(num);\n        large.push(small.top()); small.pop();\n        if (large.size() > small.size()) { small.push(large.top()); large.pop(); }\n    }\n    double findMedian() {\n        if (small.size() > large.size()) return small.top();\n        return (small.top() + large.top()) / 2.0;\n    }\n};'
    },
    testCases: [
      { input: 'addNum(1), addNum(2), findMedian(), addNum(3), findMedian()', expectedOutput: '[1.5, 2.0]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Assign Cookies',
    slug: 'assign-cookies',
    difficulty: 'Easy',
    category: 'Greedy',
    description: 'Assume you are an awesome parent and want to give your children some cookies. But, you should give each child at most one cookie. Each child i has a greed factor g[i], which is the minimum size of a cookie that the child will be content with; and each cookie j has a size s[j]. If s[j] >= g[i], we can assign the cookie j to the child i. Maximize the number of content children and output the maximum number.',
    examples: [
      { input: 'g = [1,2,3], s = [1,1]', output: '1', explanation: 'Only child with greed 1 is content.' },
      { input: 'g = [1,2], s = [1,2,3]', output: '2', explanation: 'Both children are content.' }
    ],
    constraints: ['1 <= g.length <= 3 * 10^4', '0 <= s.length <= 3 * 10^4', '1 <= g[i], s[j] <= 2^31 - 1'],
    hints: ['Sort both g (greed) and s (cookies) in ascending order.', 'Greedily satisfy the least greedy child with the smallest sufficient cookie.'],
    starterCode: {
      javascript: 'function findContentChildren(g, s) {\n  g.sort((a, b) => a - b);\n  s.sort((a, b) => a - b);\n  let i = 0, j = 0;\n  while (i < g.length && j < s.length) {\n    if (s[j] >= g[i]) i++;\n    j++;\n  }\n  return i;\n}',
      python: 'def findContentChildren(g: list[int], s: list[int]) -> int:\n    g.sort(); s.sort()\n    i = j = 0\n    while i < len(g) and j < len(s):\n        if s[j] >= g[i]: i += 1\n        j += 1\n    return i',
      java: 'class Solution {\n    public int findContentChildren(int[] g, int[] s) {\n        java.util.Arrays.sort(g); java.util.Arrays.sort(s);\n        int i = 0, j = 0;\n        while (i < g.length && j < s.length) {\n            if (s[j] >= g[i]) i++;\n            j++;\n        }\n        return i;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findContentChildren(vector<int>& g, vector<int>& s) {\n        sort(g.begin(), g.end()); sort(s.begin(), s.end());\n        size_t i = 0, j = 0;\n        while (i < g.size() && j < s.size()) {\n            if (s[j] >= g[i]) i++;\n            j++;\n        }\n        return i;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3], [1,1]', expectedOutput: '1' },
      { input: '[1,2], [1,2,3]', expectedOutput: '2' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Jump Game',
    slug: 'jump-game',
    difficulty: 'Medium',
    category: 'Greedy',
    description: 'You are given an integer array nums. You are initially positioned at the array\'s first index, and each element in the array represents your maximum jump length at that position. Return true if you can reach the last index, or false otherwise.',
    examples: [
      { input: 'nums = [2,3,1,1,4]', output: 'true', explanation: 'Jump 1 step from index 0 to 1, then 3 steps to the last index.' },
      { input: 'nums = [3,2,1,0,4]', output: 'false', explanation: 'Always arrive at index 3 with 0 max jump.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '0 <= nums[i] <= 10^5'],
    hints: ['Maintain maxReach = max(maxReach, i + nums[i]).', 'If index i exceeds maxReach, return false. If maxReach >= nums.length - 1, return true.'],
    starterCode: {
      javascript: 'function canJump(nums) {\n  let maxReach = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (i > maxReach) return false;\n    maxReach = Math.max(maxReach, i + nums[i]);\n  }\n  return true;\n}',
      python: 'def canJump(nums: list[int]) -> bool:\n    max_reach = 0\n    for i, n in enumerate(nums):\n        if i > max_reach: return False\n        max_reach = max(max_reach, i + n)\n    return True',
      java: 'class Solution {\n    public boolean canJump(int[] nums) {\n        int maxReach = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (i > maxReach) return false;\n            maxReach = Math.max(maxReach, i + nums[i]);\n        }\n        return true;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canJump(vector<int>& nums) {\n        int maxReach = 0;\n        for (size_t i = 0; i < nums.size(); i++) {\n            if ((int)i > maxReach) return false;\n            maxReach = max(maxReach, (int)i + nums[i]);\n        }\n        return true;\n    }\n};'
    },
    testCases: [
      { input: '[2,3,1,1,4]', expectedOutput: 'true' },
      { input: '[3,2,1,0,4]', expectedOutput: 'false' },
      { input: '[0]', expectedOutput: 'true' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Gas Station',
    slug: 'gas-station',
    difficulty: 'Medium',
    category: 'Greedy',
    description: 'There are n gas stations along a circular route, where the amount of gas at the ith station is gas[i]. You have a car with an unlimited gas tank and it costs cost[i] of gas to travel from the ith station to its next (i + 1)th station. Return the starting gas station\'s index if you can travel around the circuit once in the clockwise direction, otherwise return -1.',
    examples: [
      { input: 'gas = [1,2,3,4,5], cost = [3,4,5,1,2]', output: '3', explanation: 'Start at station 3 (index 3).' },
      { input: 'gas = [2,3,4], cost = [3,4,3]', output: '-1', explanation: 'Total gas is less than total cost.' }
    ],
    constraints: ['n == gas.length == cost.length', '1 <= n <= 10^5', '0 <= gas[i], cost[i] <= 10^4'],
    hints: ['If sum(gas) < sum(cost), impossible to complete circuit.', 'Track current tank balance. Whenever tank < 0, reset tank to 0 and set start = i + 1.'],
    starterCode: {
      javascript: 'function canCompleteCircuit(gas, cost) {\n  let total = 0, tank = 0, start = 0;\n  for (let i = 0; i < gas.length; i++) {\n    const diff = gas[i] - cost[i];\n    total += diff;\n    tank += diff;\n    if (tank < 0) {\n      start = i + 1;\n      tank = 0;\n    }\n  }\n  return total >= 0 ? start : -1;\n}',
      python: 'def canCompleteCircuit(gas: list[int], cost: list[int]) -> int:\n    if sum(gas) < sum(cost): return -1\n    tank = start = 0\n    for i in range(len(gas)):\n        tank += gas[i] - cost[i]\n        if tank < 0:\n            start = i + 1\n            tank = 0\n    return start',
      java: 'class Solution {\n    public int canCompleteCircuit(int[] gas, int[] cost) {\n        int total = 0, tank = 0, start = 0;\n        for (int i = 0; i < gas.length; i++) {\n            int diff = gas[i] - cost[i];\n            total += diff; tank += diff;\n            if (tank < 0) { start = i + 1; tank = 0; }\n        }\n        return total >= 0 ? start : -1;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int canCompleteCircuit(vector<int>& gas, vector<int>& cost) {\n        int total = 0, tank = 0, start = 0;\n        for (size_t i = 0; i < gas.size(); i++) {\n            int diff = gas[i] - cost[i];\n            total += diff; tank += diff;\n            if (tank < 0) { start = i + 1; tank = 0; }\n        }\n        return total >= 0 ? start : -1;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,4,5], [3,4,5,1,2]', expectedOutput: '3' },
      { input: '[2,3,4], [3,4,3]', expectedOutput: '-1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Candy',
    slug: 'candy',
    difficulty: 'Hard',
    category: 'Greedy',
    description: 'There are n children standing in a line. Each child is assigned a rating value given in the integer array ratings. You are giving candies to these children subjected to: each child must have at least one candy; children with a higher rating get more candies than their neighbors. Return the minimum number of candies you need to have to distribute the candies to the children.',
    examples: [
      { input: 'ratings = [1,0,2]', output: '5', explanation: 'Candies: [2, 1, 2].' },
      { input: 'ratings = [1,2,2]', output: '4', explanation: 'Candies: [1, 2, 1].' }
    ],
    constraints: ['n == ratings.length', '1 <= n <= 2 * 10^4', '0 <= ratings[i] <= 2 * 10^4'],
    hints: ['Initialize candies array with 1.', 'Pass left-to-right: if ratings[i] > ratings[i-1], candies[i] = candies[i-1] + 1.', 'Pass right-to-left: if ratings[i] > ratings[i+1], candies[i] = max(candies[i], candies[i+1] + 1).'],
    starterCode: {
      javascript: 'function candy(ratings) {\n  const n = ratings.length;\n  const candies = new Array(n).fill(1);\n  for (let i = 1; i < n; i++) {\n    if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n  }\n  for (let i = n - 2; i >= 0; i--) {\n    if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n  }\n  return candies.reduce((a, b) => a + b, 0);\n}',
      python: 'def candy(ratings: list[int]) -> int:\n    n = len(ratings)\n    candies = [1] * n\n    for i in range(1, n):\n        if ratings[i] > ratings[i - 1]: candies[i] = candies[i - 1] + 1\n    for i in range(n - 2, -1, -1):\n        if ratings[i] > ratings[i + 1]: candies[i] = max(candies[i], candies[i + 1] + 1)\n    return sum(candies)',
      java: 'class Solution {\n    public int candy(int[] ratings) {\n        int n = ratings.length;\n        int[] candies = new int[n];\n        java.util.Arrays.fill(candies, 1);\n        for (int i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n        for (int i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) candies[i] = Math.max(candies[i], candies[i + 1] + 1);\n        int sum = 0;\n        for (int c : candies) sum += c;\n        return sum;\n    }\n}',
      cpp: '#include <vector>\n#include <numeric>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int candy(vector<int>& ratings) {\n        int n = ratings.size();\n        vector<int> candies(n, 1);\n        for (int i = 1; i < n; i++) if (ratings[i] > ratings[i - 1]) candies[i] = candies[i - 1] + 1;\n        for (int i = n - 2; i >= 0; i--) if (ratings[i] > ratings[i + 1]) candies[i] = max(candies[i], candies[i + 1] + 1);\n        return accumulate(candies.begin(), candies.end(), 0);\n    }\n};'
    },
    testCases: [
      { input: '[1,0,2]', expectedOutput: '5' },
      { input: '[1,2,2]', expectedOutput: '4' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Find Center of Star Graph',
    slug: 'find-center-of-star-graph',
    difficulty: 'Easy',
    category: 'Graphs',
    description: 'There is an undirected star graph consisting of n nodes labeled from 1 to n. A star graph is a graph where there is one center node and exactly n - 1 edges that connect the center node with every other node. Given 2D integer array edges, return the center of the star graph.',
    examples: [
      { input: 'edges = [[1,2],[2,3],[4,2]]', output: '2', explanation: 'Node 2 is connected to all other nodes.' },
      { input: 'edges = [[1,2],[5,1],[1,3],[1,4]]', output: '1', explanation: 'Node 1 is the center.' }
    ],
    constraints: ['3 <= n <= 10^5', 'edges.length == n - 1', 'edges[i].length == 2', '1 <= ui, vi <= n', 'edges represents a valid star graph.'],
    hints: ['The center node must appear in both edge 0 and edge 1.', 'Compare edges[0][0] and edges[0][1] with edges[1][0] and edges[1][1].'],
    starterCode: {
      javascript: 'function findCenter(edges) {\n  return (edges[0][0] === edges[1][0] || edges[0][0] === edges[1][1]) ? edges[0][0] : edges[0][1];\n}',
      python: 'def findCenter(edges: list[list[int]]) -> int:\n    return edges[0][0] if edges[0][0] in edges[1] else edges[0][1]',
      java: 'class Solution {\n    public int findCenter(int[][] edges) {\n        return (edges[0][0] == edges[1][0] || edges[0][0] == edges[1][1]) ? edges[0][0] : edges[0][1];\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findCenter(vector<vector<int>>& edges) {\n        return (edges[0][0] == edges[1][0] || edges[0][0] == edges[1][1]) ? edges[0][0] : edges[0][1];\n    }\n};'
    },
    testCases: [
      { input: '[[1,2],[2,3],[4,2]]', expectedOutput: '2' },
      { input: '[[1,2],[5,1],[1,3],[1,4]]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Course Schedule (Cycle Detection)',
    slug: 'course-schedule',
    difficulty: 'Medium',
    category: 'Graphs',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. You are given an array prerequisites where prerequisites[i] = [ai, bi] indicates that you must take course bi first if you want to take course ai. Return true if you can finish all courses. Otherwise, return false.',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: 'true', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 2, prerequisites = [[1,0],[0,1]]', output: 'false', explanation: 'Circular dependency detected.' }
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= 5000', 'prerequisites[i].length == 2', '0 <= ai, bi < numCourses', 'All prerequisites pairs are unique.'],
    hints: ['Use Kahn\'s algorithm (BFS with in-degrees) or DFS with 3-color states (0=unvisited, 1=visiting, 2=visited).', 'If processed in-degree zero count === numCourses, no cycle exists.'],
    starterCode: {
      javascript: 'function canFinish(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n  let visitedCount = 0;\n  while (queue.length) {\n    const node = queue.shift();\n    visitedCount++;\n    for (const next of adj[node]) {\n      if (--inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return visitedCount === numCourses;\n}',
      python: 'from collections import deque\n\ndef canFinish(numCourses: int, prerequisites: list[list[int]]) -> bool:\n    in_degree = [0] * numCourses\n    adj = [[] for _ in range(numCourses)]\n    for course, pre in prerequisites:\n        adj[pre].append(course)\n        in_degree[course] += 1\n    q = deque([i for i in range(numCourses) if in_degree[i] == 0])\n    visited = 0\n    while q:\n        node = q.popleft()\n        visited += 1\n        for nxt in adj[node]:\n            in_degree[nxt] -= 1\n            if in_degree[nxt] == 0: q.append(nxt)\n    return visited == numCourses',
      java: 'class Solution {\n    public boolean canFinish(int numCourses, int[][] prerequisites) {\n        int[] inDegree = new int[numCourses];\n        java.util.List<Integer>[] adj = new java.util.List[numCourses];\n        for (int i = 0; i < numCourses; i++) adj[i] = new java.util.ArrayList<>();\n        for (int[] p : prerequisites) {\n            adj[p[1]].add(p[0]);\n            inDegree[p[0]]++;\n        }\n        java.util.Queue<Integer> q = new java.util.LinkedList<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);\n        int visited = 0;\n        while (!q.isEmpty()) {\n            int node = q.poll(); visited++;\n            for (int next : adj[node]) if (--inDegree[next] == 0) q.offer(next);\n        }\n        return visited == numCourses;\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool canFinish(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<int> inDegree(numCourses, 0);\n        vector<vector<int>> adj(numCourses);\n        for (auto& p : prerequisites) {\n            adj[p[1]].push_back(p[0]);\n            inDegree[p[0]]++;\n        }\n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);\n        int visited = 0;\n        while (!q.empty()) {\n            int node = q.front(); q.pop(); visited++;\n            for (int next : adj[node]) if (--inDegree[next] == 0) q.push(next);\n        }\n        return visited == numCourses;\n    }\n};'
    },
    testCases: [
      { input: '2, [[1,0]]', expectedOutput: 'true' },
      { input: '2, [[1,0],[0,1]]', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Course Schedule II',
    slug: 'course-schedule-ii',
    difficulty: 'Medium',
    category: 'Graphs',
    description: 'There are a total of numCourses courses you have to take, labeled from 0 to numCourses - 1. Return the ordering of courses you should take to finish all courses (Topological Sort). If it is impossible to finish all courses, return an empty array.',
    examples: [
      { input: 'numCourses = 2, prerequisites = [[1,0]]', output: '[0,1]', explanation: 'Take course 0 then course 1.' },
      { input: 'numCourses = 4, prerequisites = [[1,0],[2,0],[3,1],[3,2]]', output: '[0,2,1,3]', explanation: '[0,1,2,3] is also valid.' }
    ],
    constraints: ['1 <= numCourses <= 2000', '0 <= prerequisites.length <= numCourses * (numCourses - 1)'],
    hints: ['Run Kahn\'s Algorithm with in-degrees.', 'Record the popped nodes in topological order. If order.length != numCourses, return [].'],
    starterCode: {
      javascript: 'function findOrder(numCourses, prerequisites) {\n  const inDegree = new Array(numCourses).fill(0);\n  const adj = Array.from({ length: numCourses }, () => []);\n  for (const [course, pre] of prerequisites) {\n    adj[pre].push(course);\n    inDegree[course]++;\n  }\n  const queue = [], order = [];\n  for (let i = 0; i < numCourses; i++) if (inDegree[i] === 0) queue.push(i);\n  while (queue.length) {\n    const node = queue.shift();\n    order.push(node);\n    for (const next of adj[node]) {\n      if (--inDegree[next] === 0) queue.push(next);\n    }\n  }\n  return order.length === numCourses ? order : [];\n}',
      python: 'from collections import deque\n\ndef findOrder(numCourses: int, prerequisites: list[list[int]]) -> list[int]:\n    in_degree = [0] * numCourses\n    adj = [[] for _ in range(numCourses)]\n    for course, pre in prerequisites:\n        adj[pre].append(course)\n        in_degree[course] += 1\n    q = deque([i for i in range(numCourses) if in_degree[i] == 0])\n    order = []\n    while q:\n        node = q.popleft()\n        order.append(node)\n        for nxt in adj[node]:\n            in_degree[nxt] -= 1\n            if in_degree[nxt] == 0: q.append(nxt)\n    return order if len(order) == numCourses else []',
      java: 'class Solution {\n    public int[] findOrder(int numCourses, int[][] prerequisites) {\n        int[] inDegree = new int[numCourses];\n        java.util.List<Integer>[] adj = new java.util.List[numCourses];\n        for (int i = 0; i < numCourses; i++) adj[i] = new java.util.ArrayList<>();\n        for (int[] p : prerequisites) {\n            adj[p[1]].add(p[0]);\n            inDegree[p[0]]++;\n        }\n        java.util.Queue<Integer> q = new java.util.LinkedList<>();\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.offer(i);\n        int[] order = new int[numCourses];\n        int idx = 0;\n        while (!q.isEmpty()) {\n            int node = q.poll();\n            order[idx++] = node;\n            for (int next : adj[node]) if (--inDegree[next] == 0) q.offer(next);\n        }\n        return idx == numCourses ? order : new int[0];\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> findOrder(int numCourses, vector<vector<int>>& prerequisites) {\n        vector<int> inDegree(numCourses, 0);\n        vector<vector<int>> adj(numCourses);\n        for (auto& p : prerequisites) {\n            adj[p[1]].push_back(p[0]);\n            inDegree[p[0]]++;\n        }\n        queue<int> q;\n        for (int i = 0; i < numCourses; i++) if (inDegree[i] == 0) q.push(i);\n        vector<int> order;\n        while (!q.empty()) {\n            int node = q.front(); q.pop();\n            order.push_back(node);\n            for (int next : adj[node]) if (--inDegree[next] == 0) q.push(next);\n        }\n        return (int)order.size() == numCourses ? order : vector<int>();\n    }\n};'
    },
    testCases: [
      { input: '2, [[1,0]]', expectedOutput: '[0,1]' },
      { input: '4, [[1,0],[2,0],[3,1],[3,2]]', expectedOutput: '[0,1,2,3]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Number of Connected Components in an Undirected Graph',
    slug: 'number-of-connected-components',
    difficulty: 'Medium',
    category: 'Graphs',
    description: 'You have a graph of n nodes. You are given an integer n and an array edges where edges[i] = [ai, bi] indicates that there is an edge between ai and bi in the graph. Return the number of connected components in the graph.',
    examples: [
      { input: 'n = 5, edges = [[0,1],[1,2],[3,4]]', output: '2', explanation: 'Components are {0,1,2} and {3,4}.' },
      { input: 'n = 5, edges = [[0,1],[1,2],[2,3],[3,4]]', output: '1', explanation: 'All nodes connected in one component.' }
    ],
    constraints: ['1 <= n <= 2000', '1 <= edges.length <= 5000', 'edges[i].length == 2', '0 <= ai <= bi < n'],
    hints: ['Use Disjoint Set Union (Union-Find) with path compression.', 'Initialize components count = n, decrement on each successful union.'],
    starterCode: {
      javascript: 'function countComponents(n, edges) {\n  const parent = Array.from({ length: n }, (_, i) => i);\n  let count = n;\n  function find(i) {\n    if (parent[i] === i) return i;\n    return parent[i] = find(parent[i]);\n  }\n  for (const [u, v] of edges) {\n    const rU = find(u), rV = find(v);\n    if (rU !== rV) {\n      parent[rU] = rV;\n      count--;\n    }\n  }\n  return count;\n}',
      python: 'def countComponents(n: int, edges: list[list[int]]) -> int:\n    parent = list(range(n))\n    def find(i):\n        if parent[i] != i:\n            parent[i] = find(parent[i])\n        return parent[i]\n    count = n\n    for u, v in edges:\n        r_u, r_v = find(u), find(v)\n        if r_u != r_v:\n            parent[r_u] = r_v\n            count -= 1\n    return count',
      java: 'class Solution {\n    public int countComponents(int n, int[][] edges) {\n        int[] parent = new int[n];\n        for (int i = 0; i < n; i++) parent[i] = i;\n        int count = n;\n        for (int[] e : edges) {\n            int rU = find(parent, e[0]), rV = find(parent, e[1]);\n            if (rU != rV) { parent[rU] = rV; count--; }\n        }\n        return count;\n    }\n    private int find(int[] parent, int i) {\n        if (parent[i] == i) return i;\n        return parent[i] = find(parent, parent[i]);\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int countComponents(int n, vector<vector<int>>& edges) {\n        vector<int> parent(n);\n        for (int i = 0; i < n; i++) parent[i] = i;\n        auto find = [&](auto& self, int i) -> int {\n            return parent[i] == i ? i : parent[i] = self(self, parent[i]);\n        };\n        int count = n;\n        for (auto& e : edges) {\n            int rU = find(find, e[0]), rV = find(find, e[1]);\n            if (rU != rV) { parent[rU] = rV; count--; }\n        }\n        return count;\n    }\n};'
    },
    testCases: [
      { input: '5, [[0,1],[1,2],[3,4]]', expectedOutput: '2' },
      { input: '5, [[0,1],[1,2],[2,3],[3,4]]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Alien Dictionary',
    slug: 'alien-dictionary',
    difficulty: 'Hard',
    category: 'Graphs',
    description: 'There is a new alien language that uses the English alphabet. However, the order among letters is unknown to you. You are given a list of strings words from the alien language\'s dictionary, where the strings are claimed to be sorted lexicographically by the rules of this new language. Return a string of the unique letters in the new alien language sorted in lexicographically increasing order. If the order is invalid, return "".',
    examples: [
      { input: 'words = ["wrt","wrf","er","ett","rftt"]', output: '"wertf"', explanation: 'Topological order of alien characters.' },
      { input: 'words = ["z","x"]', output: '"zx"', explanation: 'z comes before x.' },
      { input: 'words = ["z","x","z"]', output: '""', explanation: 'Cycle detected, invalid order.' }
    ],
    constraints: ['1 <= words.length <= 100', '1 <= words[i].length <= 100', 'words[i] consists of only lowercase English letters.'],
    hints: ['Compare adjacent words to extract directed character precedence edges u -> v.', 'Check invalid prefix condition: if word2 is prefix of word1 but shorter, return "".', 'Apply Kahn\'s topological sort; if output length != number of unique characters, return "".'],
    starterCode: {
      javascript: 'function alienOrder(words) {\n  const adj = new Map(), inDegree = new Map();\n  for (const w of words) for (const c of w) { adj.set(c, new Set()); inDegree.set(c, 0); }\n  for (let i = 0; i < words.length - 1; i++) {\n    const w1 = words[i], w2 = words[i + 1];\n    if (w1.length > w2.length && w1.startsWith(w2)) return "";\n    for (let j = 0; j < Math.min(w1.length, w2.length); j++) {\n      if (w1[j] !== w2[j]) {\n        if (!adj.get(w1[j]).has(w2[j])) {\n          adj.get(w1[j]).add(w2[j]);\n          inDegree.set(w2[j], inDegree.get(w2[j]) + 1);\n        }\n        break;\n      }\n    }\n  }\n  const queue = [];\n  for (const [c, deg] of inDegree.entries()) if (deg === 0) queue.push(c);\n  let res = "";\n  while (queue.length) {\n    const c = queue.shift();\n    res += c;\n    for (const next of adj.get(c)) {\n      inDegree.set(next, inDegree.get(next) - 1);\n      if (inDegree.get(next) === 0) queue.push(next);\n    }\n  }\n  return res.length === inDegree.size ? res : "";\n}',
      python: 'from collections import deque, defaultdict\n\ndef alienOrder(words: list[str]) -> str:\n    adj = {c: set() for w in words for c in w}\n    in_degree = {c: 0 for c in adj}\n    for i in range(len(words) - 1):\n        w1, w2 = words[i], words[i + 1]\n        if len(w1) > len(w2) and w1.startswith(w2): return ""\n        for c1, c2 in zip(w1, w2):\n            if c1 != c2:\n                if c2 not in adj[c1]:\n                    adj[c1].add(c2)\n                    in_degree[c2] += 1\n                break\n    q = deque([c for c, deg in in_degree.items() if deg == 0])\n    res = []\n    while q:\n        c = q.popleft()\n        res.append(c)\n        for nxt in adj[c]:\n            in_degree[nxt] -= 1\n            if in_degree[nxt] == 0: q.append(nxt)\n    return "".join(res) if len(res) == len(in_degree) else ""',
      java: 'class Solution {\n    public String alienOrder(String[] words) {\n        java.util.Map<Character, java.util.Set<Character>> adj = new java.util.HashMap<>();\n        java.util.Map<Character, Integer> inDegree = new java.util.HashMap<>();\n        for (String w : words) for (char c : w.toCharArray()) { adj.putIfAbsent(c, new java.util.HashSet<>()); inDegree.putIfAbsent(c, 0); }\n        for (int i = 0; i < words.length - 1; i++) {\n            String w1 = words[i], w2 = words[i + 1];\n            if (w1.length() > w2.length() && w1.startsWith(w2)) return "";\n            for (int j = 0; j < Math.min(w1.length(), w2.length()); j++) {\n                if (w1.charAt(j) != w2.charAt(j)) {\n                    char c1 = w1.charAt(j), c2 = w2.charAt(j);\n                    if (!adj.get(c1).contains(c2)) {\n                        adj.get(c1).add(c2);\n                        inDegree.put(c2, inDegree.get(c2) + 1);\n                    }\n                    break;\n                }\n            }\n        }\n        java.util.Queue<Character> q = new java.util.LinkedList<>();\n        for (char c : inDegree.keySet()) if (inDegree.get(c) == 0) q.offer(c);\n        StringBuilder sb = new StringBuilder();\n        while (!q.isEmpty()) {\n            char c = q.poll(); sb.append(c);\n            for (char next : adj.get(c)) {\n                inDegree.put(next, inDegree.get(next) - 1);\n                if (inDegree.get(next) == 0) q.offer(next);\n            }\n        }\n        return sb.length() == inDegree.size() ? sb.toString() : "";\n    }\n}',
      cpp: '#include <vector>\n#include <string>\n#include <unordered_map>\n#include <unordered_set>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    string alienOrder(vector<string>& words) {\n        unordered_map<char, unordered_set<char>> adj;\n        unordered_map<char, int> inDegree;\n        for (auto& w : words) for (char c : w) { adj[c]; inDegree[c] = 0; }\n        for (size_t i = 0; i < words.size() - 1; i++) {\n            string w1 = words[i], w2 = words[i + 1];\n            if (w1.size() > w2.size() && w1.find(w2) == 0) return "";\n            for (size_t j = 0; j < min(w1.size(), w2.size()); j++) {\n                if (w1[j] != w2[j]) {\n                    if (!adj[w1[j]].count(w2[j])) {\n                        adj[w1[j]].insert(w2[j]);\n                        inDegree[w2[j]]++;\n                    }\n                    break;\n                }\n            }\n        }\n        queue<char> q;\n        for (auto& p : inDegree) if (p.second == 0) q.push(p.first);\n        string res = "";\n        while (!q.empty()) {\n            char c = q.front(); q.pop(); res += c;\n            for (char next : adj[c]) {\n                if (--inDegree[next] == 0) q.push(next);\n            }\n        }\n        return res.size() == inDegree.size() ? res : "";\n    }\n};'
    },
    testCases: [
      { input: '["wrt","wrf","er","ett","rftt"]', expectedOutput: '"wertf"' },
      { input: '["z","x"]', expectedOutput: '"zx"' },
      { input: '["z","x","z"]', expectedOutput: '""' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Rotting Oranges',
    slug: 'rotting-oranges',
    difficulty: 'Medium',
    category: 'BFS',
    description: 'You are given an m x n grid where each cell can have one of three values: 0 empty cell, 1 fresh orange, 2 rotten orange. Every minute, any fresh orange that is 4-directionally adjacent to a rotten orange becomes rotten. Return the minimum number of minutes that must elapse until no cell has a fresh orange. If this is impossible, return -1.',
    examples: [
      { input: 'grid = [[2,1,1],[1,1,0],[0,1,1]]', output: '4', explanation: 'All oranges rotten in 4 minutes.' },
      { input: 'grid = [[2,1,1],[0,1,1],[1,0,1]]', output: '-1', explanation: 'Bottom left fresh orange cannot be reached.' },
      { input: 'grid = [[0,2]]', output: '0', explanation: 'No fresh oranges initially.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 10', 'grid[i][j] is 0, 1, or 2.'],
    hints: ['Multi-source BFS: enqueue all rotten oranges (val === 2) at time 0 and count fresh oranges.', 'Process level by level; decrement fresh count when infecting neighbors.'],
    starterCode: {
      javascript: 'function orangesRotting(grid) {\n  const m = grid.length, n = grid[0].length;\n  const queue = [];\n  let fresh = 0;\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 2) queue.push([r, c]);\n      else if (grid[r][c] === 1) fresh++;\n    }\n  }\n  if (fresh === 0) return 0;\n  let minutes = 0;\n  const dirs = [[0,1],[0,-1],[1,0],[-1,0]];\n  while (queue.length && fresh > 0) {\n    const sz = queue.length;\n    for (let i = 0; i < sz; i++) {\n      const [r, c] = queue.shift();\n      for (const [dr, dc] of dirs) {\n        const nr = r + dr, nc = c + dc;\n        if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] === 1) {\n          grid[nr][nc] = 2;\n          fresh--;\n          queue.push([nr, nc]);\n        }\n      }\n    }\n    minutes++;\n  }\n  return fresh === 0 ? minutes : -1;\n}',
      python: 'from collections import deque\n\ndef orangesRotting(grid: list[list[int]]) -> int:\n    m, n = len(grid), len(grid[0])\n    q = deque()\n    fresh = 0\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 2: q.append((r, c))\n            elif grid[r][c] == 1: fresh += 1\n    if fresh == 0: return 0\n    minutes = 0\n    while q and fresh > 0:\n        for _ in range(len(q)):\n            r, c = q.popleft()\n            for dr, dc in [(0,1),(0,-1),(1,0),(-1,0)]:\n                nr, nc = r + dr, c + dc\n                if 0 <= nr < m and 0 <= nc < n and grid[nr][nc] == 1:\n                    grid[nr][nc] = 2\n                    fresh -= 1\n                    q.append((nr, nc))\n        minutes += 1\n    return minutes if fresh == 0 else -1',
      java: 'class Solution {\n    public int orangesRotting(int[][] grid) {\n        int m = grid.length, n = grid[0].length;\n        java.util.Queue<int[]> q = new java.util.LinkedList<>();\n        int fresh = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) q.offer(new int[]{r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        }\n        if (fresh == 0) return 0;\n        int minutes = 0;\n        int[][] dirs = {{0,1},{0,-1},{1,0},{-1,0}};\n        while (!q.isEmpty() && fresh > 0) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                int[] cell = q.poll();\n                for (int[] d : dirs) {\n                    int nr = cell[0] + d[0], nc = cell[1] + d[1];\n                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2; fresh--; q.offer(new int[]{nr, nc});\n                    }\n                }\n            }\n            minutes++;\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int orangesRotting(vector<vector<int>>& grid) {\n        int m = grid.size(), n = grid[0].size();\n        queue<pair<int, int>> q;\n        int fresh = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 2) q.push({r, c});\n                else if (grid[r][c] == 1) fresh++;\n            }\n        }\n        if (fresh == 0) return 0;\n        int minutes = 0;\n        int dirs[4][2] = {{0,1},{0,-1},{1,0},{-1,0}};\n        while (!q.empty() && fresh > 0) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                auto [r, c] = q.front(); q.pop();\n                for (auto& d : dirs) {\n                    int nr = r + d[0], nc = c + d[1];\n                    if (nr >= 0 && nr < m && nc >= 0 && nc < n && grid[nr][nc] == 1) {\n                        grid[nr][nc] = 2; fresh--; q.push({nr, nc});\n                    }\n                }\n            }\n            minutes++;\n        }\n        return fresh == 0 ? minutes : -1;\n    }\n};'
    },
    testCases: [
      { input: '[[2,1,1],[1,1,0],[0,1,1]]', expectedOutput: '4' },
      { input: '[[2,1,1],[0,1,1],[1,0,1]]', expectedOutput: '-1' },
      { input: '[[0,2]]', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Word Ladder',
    slug: 'word-ladder',
    difficulty: 'Hard',
    category: 'BFS',
    description: 'A transformation sequence from word beginWord to word endWord using a dictionary wordList is a sequence of words beginWord -> s1 -> s2 -> ... -> sk such that every adjacent pair of words differs by a single letter. Return the number of words in the shortest transformation sequence from beginWord to endWord, or 0 if no such sequence exists.',
    examples: [
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log","cog"]', output: '5', explanation: 'One shortest transformation sequence is "hit" -> "hot" -> "dot" -> "dog" -> "cog", which is 5 words long.' },
      { input: 'beginWord = "hit", endWord = "cog", wordList = ["hot","dot","dog","lot","log"]', output: '0', explanation: 'The endWord "cog" is not in wordList.' }
    ],
    constraints: ['1 <= beginWord.length <= 10', 'endWord.length == beginWord.length', '1 <= wordList.length <= 5000', 'wordList[i].length == beginWord.length', 'beginWord, endWord, and wordList[i] consist of lowercase English letters.'],
    hints: ['Store wordList in a HashSet for O(1) word validation.', 'Use BFS: mutate each character from \'a\' to \'z\'. If mutated word is in set, enqueue and delete from set.'],
    starterCode: {
      javascript: 'function ladderLength(beginWord, endWord, wordList) {\n  const wordSet = new Set(wordList);\n  if (!wordSet.has(endWord)) return 0;\n  const queue = [[beginWord, 1]];\n  while (queue.length) {\n    const [word, level] = queue.shift();\n    if (word === endWord) return level;\n    for (let i = 0; i < word.length; i++) {\n      for (let c = 97; c <= 122; c++) {\n        const next = word.slice(0, i) + String.fromCharCode(c) + word.slice(i + 1);\n        if (wordSet.has(next)) {\n          wordSet.delete(next);\n          queue.push([next, level + 1]);\n        }\n      }\n    }\n  }\n  return 0;\n}',
      python: 'from collections import deque\n\ndef ladderLength(beginWord: str, endWord: str, wordList: list[str]) -> int:\n    word_set = set(wordList)\n    if endWord not in word_set: return 0\n    q = deque([(beginWord, 1)])\n    while q:\n        word, level = q.popleft()\n        if word == endWord: return level\n        for i in range(len(word)):\n            for c in "abcdefghijklmnopqrstuvwxyz":\n                nxt = word[:i] + c + word[i+1:]\n                if nxt in word_set:\n                    word_set.remove(nxt)\n                    q.append((nxt, level + 1))\n    return 0',
      java: 'class Solution {\n    public int ladderLength(String beginWord, String endWord, java.util.List<String> wordList) {\n        java.util.Set<String> wordSet = new java.util.HashSet<>(wordList);\n        if (!wordSet.contains(endWord)) return 0;\n        java.util.Queue<String> q = new java.util.LinkedList<>();\n        q.offer(beginWord);\n        int level = 1;\n        while (!q.isEmpty()) {\n            int sz = q.size();\n            for (int i = 0; i < sz; i++) {\n                String word = q.poll();\n                if (word.equals(endWord)) return level;\n                char[] chs = word.toCharArray();\n                for (int j = 0; j < chs.length; j++) {\n                    char orig = chs[j];\n                    for (char c = \'a\'; c <= \'z\'; c++) {\n                        chs[j] = c;\n                        String next = String.valueOf(chs);\n                        if (wordSet.remove(next)) q.offer(next);\n                    }\n                    chs[j] = orig;\n                }\n            }\n            level++;\n        }\n        return 0;\n    }\n}',
      cpp: '#include <string>\n#include <vector>\n#include <unordered_set>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int ladderLength(string beginWord, string endWord, vector<string>& wordList) {\n        unordered_set<string> wordSet(wordList.begin(), wordList.end());\n        if (!wordSet.count(endWord)) return 0;\n        queue<pair<string, int>> q;\n        q.push({beginWord, 1});\n        while (!q.empty()) {\n            auto [word, level] = q.front(); q.pop();\n            if (word == endWord) return level;\n            for (size_t i = 0; i < word.size(); i++) {\n                char orig = word[i];\n                for (char c = \'a\'; c <= \'z\'; c++) {\n                    word[i] = c;\n                    if (wordSet.count(word)) {\n                        wordSet.erase(word);\n                        q.push({word, level + 1});\n                    }\n                }\n                word[i] = orig;\n            }\n        }\n        return 0;\n    }\n};'
    },
    testCases: [
      { input: '"hit", "cog", ["hot","dot","dog","lot","log","cog"]', expectedOutput: '5' },
      { input: '"hit", "cog", ["hot","dot","dog","lot","log"]', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Number of Islands',
    slug: 'number-of-islands',
    difficulty: 'Medium',
    category: 'DFS',
    description: 'Given an m x n 2D binary grid grid which represents a map of \'1\'s (land) and \'0\'s (water), return the number of islands. An island is surrounded by water and is formed by connecting adjacent lands horizontally or vertically.',
    examples: [
      { input: 'grid = [["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', output: '1', explanation: 'Single connected island.' },
      { input: 'grid = [["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', output: '3', explanation: '3 separate islands.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 300', 'grid[i][j] is \'0\' or \'1\'.'],
    hints: ['Iterate through grid; when grid[r][c] === \'1\', increment count and run DFS sink to convert all connected land to \'0\'.'],
    starterCode: {
      javascript: 'function numIslands(grid) {\n  if (!grid.length) return 0;\n  const m = grid.length, n = grid[0].length;\n  let count = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== "1") return;\n    grid[r][c] = "0";\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === "1") {\n        count++;\n        dfs(r, c);\n      }\n    }\n  }\n  return count;\n}',
      python: 'def numIslands(grid: list[list[str]]) -> int:\n    if not grid: return 0\n    m, n = len(grid), len(grid[0])\n    count = 0\n    def dfs(r, c):\n        if not (0 <= r < m and 0 <= c < n) or grid[r][c] != "1": return\n        grid[r][c] = "0"\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == "1":\n                count += 1\n                dfs(r, c)\n    return count',
      java: 'class Solution {\n    public int numIslands(char[][] grid) {\n        if (grid.length == 0) return 0;\n        int m = grid.length, n = grid[0].length, count = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == \'1\') {\n                    count++;\n                    dfs(grid, r, c);\n                }\n            }\n        }\n        return count;\n    }\n    private void dfs(char[][] g, int r, int c) {\n        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != \'1\') return;\n        g[r][c] = \'0\';\n        dfs(g, r + 1, c); dfs(g, r - 1, c); dfs(g, r, c + 1); dfs(g, r, c - 1);\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    int numIslands(vector<vector<char>>& grid) {\n        if (grid.empty()) return 0;\n        int m = grid.size(), n = grid[0].size(), count = 0;\n        auto dfs = [&](auto& self, int r, int c) -> void {\n            if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != \'1\') return;\n            grid[r][c] = \'0\';\n            self(self, r + 1, c); self(self, r - 1, c); self(self, r, c + 1); self(self, r, c - 1);\n        };\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                if (grid[r][c] == \'1\') { count++; dfs(dfs, r, c); }\n        return count;\n    }\n};'
    },
    testCases: [
      { input: '[["1","1","1","1","0"],["1","1","0","1","0"],["1","1","0","0","0"],["0","0","0","0","0"]]', expectedOutput: '1' },
      { input: '[["1","1","0","0","0"],["1","1","0","0","0"],["0","0","1","0","0"],["0","0","0","1","1"]]', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Max Area of Island',
    slug: 'max-area-of-island',
    difficulty: 'Medium',
    category: 'DFS',
    description: 'You are given an m x n binary matrix grid. An island is a group of 1\'s (representing land) connected 4-directionally. The area of an island is the number of cells with a value 1 in the island. Return the maximum area of an island in grid. If there is no island, return 0.',
    examples: [
      { input: 'grid = [[0,0,1,0,0,0,0,1,0,0,0,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,1,1,0,1,0,0,0,0,0,0,0,0],[0,1,0,0,1,1,0,0,1,0,1,0,0],[0,1,0,0,1,1,0,0,1,1,1,0,0],[0,0,0,0,0,0,0,0,0,0,1,0,0],[0,0,0,0,0,0,0,1,1,1,0,0,0],[0,0,0,0,0,0,0,1,1,0,0,0,0]]', output: '6', explanation: 'The maximum area is 6.' },
      { input: 'grid = [[0,0,0,0,0,0,0,0]]', output: '0', explanation: 'No island exists.' }
    ],
    constraints: ['m == grid.length', 'n == grid[i].length', '1 <= m, n <= 50', 'grid[i][j] is either 0 or 1.'],
    hints: ['Run DFS for each land cell (val === 1), returning 1 + sum of DFS on 4 neighbors.', 'Track maxArea across all islands.'],
    starterCode: {
      javascript: 'function maxAreaOfIsland(grid) {\n  const m = grid.length, n = grid[0].length;\n  let maxArea = 0;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] !== 1) return 0;\n    grid[r][c] = 0;\n    return 1 + dfs(r + 1, c) + dfs(r - 1, c) + dfs(r, c + 1) + dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (grid[r][c] === 1) maxArea = Math.max(maxArea, dfs(r, c));\n    }\n  }\n  return maxArea;\n}',
      python: 'def maxAreaOfIsland(grid: list[list[int]]) -> int:\n    m, n = len(grid), len(grid[0])\n    max_area = 0\n    def dfs(r, c):\n        if not (0 <= r < m and 0 <= c < n) or grid[r][c] != 1: return 0\n        grid[r][c] = 0\n        return 1 + dfs(r+1, c) + dfs(r-1, c) + dfs(r, c+1) + dfs(r, c-1)\n    for r in range(m):\n        for c in range(n):\n            if grid[r][c] == 1:\n                max_area = max(max_area, dfs(r, c))\n    return max_area',
      java: 'class Solution {\n    public int maxAreaOfIsland(int[][] grid) {\n        int m = grid.length, n = grid[0].length, maxArea = 0;\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (grid[r][c] == 1) maxArea = Math.max(maxArea, dfs(grid, r, c));\n            }\n        }\n        return maxArea;\n    }\n    private int dfs(int[][] g, int r, int c) {\n        if (r < 0 || r >= g.length || c < 0 || c >= g[0].length || g[r][c] != 1) return 0;\n        g[r][c] = 0;\n        return 1 + dfs(g, r + 1, c) + dfs(g, r - 1, c) + dfs(g, r, c + 1) + dfs(g, r, c - 1);\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxAreaOfIsland(vector<vector<int>>& grid) {\n        int m = grid.size(), n = grid[0].size(), maxArea = 0;\n        auto dfs = [&](auto& self, int r, int c) -> int {\n            if (r < 0 || r >= m || c < 0 || c >= n || grid[r][c] != 1) return 0;\n            grid[r][c] = 0;\n            return 1 + self(self, r + 1, c) + self(self, r - 1, c) + self(self, r, c + 1) + self(self, r, c - 1);\n        };\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                if (grid[r][c] == 1) maxArea = max(maxArea, dfs(dfs, r, c));\n        return maxArea;\n    }\n};'
    },
    testCases: [
      { input: '[[0,1,1],[1,1,0]]', expectedOutput: '4' },
      { input: '[[0,0],[0,0]]', expectedOutput: '0' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Surrounded Regions',
    slug: 'surrounded-regions',
    difficulty: 'Medium',
    category: 'DFS',
    description: 'Given an m x n matrix board containing \'X\' and \'O\', capture all regions that are 4-directionally surrounded by \'X\'. A region is captured by flipping all \'O\'s into \'X\'s in that surrounded region.',
    examples: [
      { input: 'board = [["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', output: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]', explanation: 'Internal O region captured, border O preserved.' },
      { input: 'board = [["X"]]', output: '[["X"]]', explanation: 'Single X.' }
    ],
    constraints: ['m == board.length', 'n == board[i].length', '1 <= m, n <= 200', 'board[i][j] is \'X\' or \'O\'.'],
    hints: ['Any \'O\' on the border or connected to the border cannot be captured.', 'DFS from all border \'O\'s and mark them as safe (\'S\').', 'Flip remaining \'O\'s to \'X\', then restore \'S\' back to \'O\'.'],
    starterCode: {
      javascript: 'function solve(board) {\n  if (!board.length) return;\n  const m = board.length, n = board[0].length;\n  function dfs(r, c) {\n    if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] !== "O") return;\n    board[r][c] = "S";\n    dfs(r + 1, c); dfs(r - 1, c); dfs(r, c + 1); dfs(r, c - 1);\n  }\n  for (let r = 0; r < m; r++) {\n    if (board[r][0] === "O") dfs(r, 0);\n    if (board[r][n - 1] === "O") dfs(r, n - 1);\n  }\n  for (let c = 0; c < n; c++) {\n    if (board[0][c] === "O") dfs(0, c);\n    if (board[m - 1][c] === "O") dfs(m - 1, c);\n  }\n  for (let r = 0; r < m; r++) {\n    for (let c = 0; c < n; c++) {\n      if (board[r][c] === "O") board[r][c] = "X";\n      else if (board[r][c] === "S") board[r][c] = "O";\n    }\n  }\n  return board;\n}',
      python: 'def solve(board: list[list[str]]) -> None:\n    if not board: return\n    m, n = len(board), len(board[0])\n    def dfs(r, c):\n        if not (0 <= r < m and 0 <= c < n) or board[r][c] != "O": return\n        board[r][c] = "S"\n        dfs(r+1, c); dfs(r-1, c); dfs(r, c+1); dfs(r, c-1)\n    for r in range(m):\n        if board[r][0] == "O": dfs(r, 0)\n        if board[r][n-1] == "O": dfs(r, n-1)\n    for c in range(n):\n        if board[0][c] == "O": dfs(0, c)\n        if board[m-1][c] == "O": dfs(m-1, c)\n    for r in range(m):\n        for c in range(n):\n            if board[r][c] == "O": board[r][c] = "X"\n            elif board[r][c] == "S": board[r][c] = "O"',
      java: 'class Solution {\n    public void solve(char[][] board) {\n        if (board.length == 0) return;\n        int m = board.length, n = board[0].length;\n        for (int r = 0; r < m; r++) {\n            if (board[r][0] == \'O\') dfs(board, r, 0);\n            if (board[r][n - 1] == \'O\') dfs(board, r, n - 1);\n        }\n        for (int c = 0; c < n; c++) {\n            if (board[0][c] == \'O\') dfs(board, 0, c);\n            if (board[m - 1][c] == \'O\') dfs(board, m - 1, c);\n        }\n        for (int r = 0; r < m; r++) {\n            for (int c = 0; c < n; c++) {\n                if (board[r][c] == \'O\') board[r][c] = \'X\';\n                else if (board[r][c] == \'S\') board[r][c] = \'O\';\n            }\n        }\n    }\n    private void dfs(char[][] b, int r, int c) {\n        if (r < 0 || r >= b.length || c < 0 || c >= b[0].length || b[r][c] != \'O\') return;\n        b[r][c] = \'S\';\n        dfs(b, r + 1, c); dfs(b, r - 1, c); dfs(b, r, c + 1); dfs(b, r, c - 1);\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void solve(vector<vector<char>>& board) {\n        if (board.empty()) return;\n        int m = board.size(), n = board[0].size();\n        auto dfs = [&](auto& self, int r, int c) -> void {\n            if (r < 0 || r >= m || c < 0 || c >= n || board[r][c] != \'O\') return;\n            board[r][c] = \'S\';\n            self(self, r + 1, c); self(self, r - 1, c); self(self, r, c + 1); self(self, r, c - 1);\n        };\n        for (int r = 0; r < m; r++) {\n            if (board[r][0] == \'O\') dfs(dfs, r, 0);\n            if (board[r][n - 1] == \'O\') dfs(dfs, r, n - 1);\n        }\n        for (int c = 0; c < n; c++) {\n            if (board[0][c] == \'O\') dfs(dfs, 0, c);\n            if (board[m - 1][c] == \'O\') dfs(dfs, m - 1, c);\n        }\n        for (int r = 0; r < m; r++)\n            for (int c = 0; c < n; c++)\n                if (board[r][c] == \'O\') board[r][c] = \'X\';\n                else if (board[r][c] == \'S\') board[r][c] = \'O\';\n    }\n};'
    },
    testCases: [
      { input: '[["X","X","X","X"],["X","O","O","X"],["X","X","O","X"],["X","O","X","X"]]', expectedOutput: '[["X","X","X","X"],["X","X","X","X"],["X","X","X","X"],["X","O","X","X"]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Climbing Stairs',
    slug: 'climbing-stairs',
    difficulty: 'Easy',
    category: 'Dynamic Programming',
    description: 'You are climbing a staircase. It takes n steps to reach the top. Each time you can either climb 1 or 2 steps. In how many distinct ways can you climb to the top?',
    examples: [
      { input: 'n = 2', output: '2', explanation: '1+1 or 2 steps.' },
      { input: 'n = 3', output: '3', explanation: '1+1+1, 1+2, or 2+1 steps.' }
    ],
    constraints: ['1 <= n <= 45'],
    hints: ['dp[i] = dp[i-1] + dp[i-2] (Fibonacci recurrence).', 'Optimize space to O(1) using two rolling variables.'],
    starterCode: {
      javascript: 'function climbStairs(n) {\n  if (n <= 2) return n;\n  let prev2 = 1, prev1 = 2;\n  for (let i = 3; i <= n; i++) {\n    const cur = prev1 + prev2;\n    prev2 = prev1;\n    prev1 = cur;\n  }\n  return prev1;\n}',
      python: 'def climbStairs(n: int) -> int:\n    if n <= 2: return n\n    a, b = 1, 2\n    for _ in range(3, n + 1):\n        a, b = b, a + b\n    return b',
      java: 'class Solution {\n    public int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int climbStairs(int n) {\n        if (n <= 2) return n;\n        int a = 1, b = 2;\n        for (int i = 3; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};'
    },
    testCases: [
      { input: '2', expectedOutput: '2' },
      { input: '3', expectedOutput: '3' },
      { input: '5', expectedOutput: '8' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  }
];
