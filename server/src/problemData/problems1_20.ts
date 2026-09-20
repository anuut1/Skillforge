import { DSAProblemFull } from './types';

export const PROBLEMS_1_20: DSAProblemFull[] = [
  {
    title: 'Two Sum',
    slug: 'two-sum',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer target, return indices of the two numbers such that they add up to target. You may assume that each input would have exactly one solution, and you may not use the same element twice.',
    examples: [
      { input: 'nums = [2,7,11,15], target = 9', output: '[0,1]', explanation: 'Because nums[0] + nums[1] == 9, we return [0, 1].' },
      { input: 'nums = [3,2,4], target = 6', output: '[1,2]', explanation: 'Because nums[1] + nums[2] == 6, we return [1, 2].' }
    ],
    constraints: ['2 <= nums.length <= 10^4', '-10^9 <= nums[i] <= 10^9', 'Only one valid answer exists.'],
    hints: ['A brute force solution using two nested loops is O(n^2).', 'Can you use a HashMap to look up target - current_num in O(1) time?'],
    starterCode: {
      javascript: 'function twoSum(nums, target) {\n  const map = new Map();\n  for (let i = 0; i < nums.length; i++) {\n    const complement = target - nums[i];\n    if (map.has(complement)) return [map.get(complement), i];\n    map.set(nums[i], i);\n  }\n  return [];\n}',
      python: 'def twoSum(nums: list[int], target: int) -> list[int]:\n    seen = {}\n    for i, num in enumerate(nums):\n        diff = target - num\n        if diff in seen:\n            return [seen[diff], i]\n        seen[num] = i\n    return []',
      java: 'class Solution {\n    public int[] twoSum(int[] nums, int target) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        for (int i = 0; i < nums.length; i++) {\n            int diff = target - nums[i];\n            if (map.containsKey(diff)) return new int[]{map.get(diff), i};\n            map.put(nums[i], i);\n        }\n        return new int[0];\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> twoSum(vector<int>& nums, int target) {\n        unordered_map<int, int> map;\n        for (int i = 0; i < nums.size(); i++) {\n            int diff = target - nums[i];\n            if (map.count(diff)) return {map[diff], i};\n            map[nums[i]] = i;\n        }\n        return {};\n    }\n};'
    },
    testCases: [
      { input: '[2,7,11,15], 9', expectedOutput: '[0,1]' },
      { input: '[3,2,4], 6', expectedOutput: '[1,2]' },
      { input: '[3,3], 6', expectedOutput: '[0,1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Best Time to Buy and Sell Stock',
    slug: 'best-time-to-buy-and-sell-stock',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'You are given an array prices where prices[i] is the price of a given stock on the ith day. You want to maximize your profit by choosing a single day to buy one stock and choosing a different day in the future to sell that stock. Return the maximum profit you can achieve.',
    examples: [
      { input: 'prices = [7,1,5,3,6,4]', output: '5', explanation: 'Buy on day 2 (price = 1) and sell on day 5 (price = 6), profit = 6-1 = 5.' },
      { input: 'prices = [7,6,4,3,1]', output: '0', explanation: 'In this case, no transactions are done and max profit = 0.' }
    ],
    constraints: ['1 <= prices.length <= 10^5', '0 <= prices[i] <= 10^4'],
    hints: ['Track the minimum buying price seen so far as you iterate.', 'At each day, calculate the profit if sold today: price - min_price, and update max_profit.'],
    starterCode: {
      javascript: 'function maxProfit(prices) {\n  let minPrice = Infinity;\n  let maxProfit = 0;\n  for (let price of prices) {\n    if (price < minPrice) minPrice = price;\n    else if (price - minPrice > maxProfit) maxProfit = price - minPrice;\n  }\n  return maxProfit;\n}',
      python: 'def maxProfit(prices: list[int]) -> int:\n    min_price = float("inf")\n    max_profit = 0\n    for price in prices:\n        if price < min_price:\n            min_price = price\n        elif price - min_price > max_profit:\n            max_profit = price - min_price\n    return max_profit',
      java: 'class Solution {\n    public int maxProfit(int[] prices) {\n        int minPrice = Integer.MAX_VALUE;\n        int maxProfit = 0;\n        for (int p : prices) {\n            if (p < minPrice) minPrice = p;\n            else if (p - minPrice > maxProfit) maxProfit = p - minPrice;\n        }\n        return maxProfit;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProfit(vector<int>& prices) {\n        int minPrice = 1e9, maxProfit = 0;\n        for (int p : prices) {\n            minPrice = min(minPrice, p);\n            maxProfit = max(maxProfit, p - minPrice);\n        }\n        return maxProfit;\n    }\n};'
    },
    testCases: [
      { input: '[7,1,5,3,6,4]', expectedOutput: '5' },
      { input: '[7,6,4,3,1]', expectedOutput: '0' },
      { input: '[2,4,1]', expectedOutput: '2' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Maximum Subarray',
    slug: 'maximum-subarray',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an integer array nums, find the subarray with the largest sum, and return its sum. Solve using Kadane\'s Algorithm in O(n) time.',
    examples: [
      { input: 'nums = [-2,1,-3,4,-1,2,1,-5,4]', output: '6', explanation: 'The subarray [4,-1,2,1] has the largest sum 6.' },
      { input: 'nums = [1]', output: '1', explanation: 'The subarray [1] has the largest sum 1.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Kadane\'s algorithm: maintain current_sum = max(num, current_sum + num).', 'Track max_sum = max(max_sum, current_sum) across the array.'],
    starterCode: {
      javascript: 'function maxSubArray(nums) {\n  let curSum = nums[0], maxSum = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    curSum = Math.max(nums[i], curSum + nums[i]);\n    maxSum = Math.max(maxSum, curSum);\n  }\n  return maxSum;\n}',
      python: 'def maxSubArray(nums: list[int]) -> int:\n    cur_sum = max_sum = nums[0]\n    for num in nums[1:]:\n        cur_sum = max(num, cur_sum + num)\n        max_sum = max(max_sum, cur_sum)\n    return max_sum',
      java: 'class Solution {\n    public int maxSubArray(int[] nums) {\n        int curSum = nums[0], maxSum = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            curSum = Math.max(nums[i], curSum + nums[i]);\n            maxSum = Math.max(maxSum, curSum);\n        }\n        return maxSum;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxSubArray(vector<int>& nums) {\n        int curSum = nums[0], maxSum = nums[0];\n        for (size_t i = 1; i < nums.size(); i++) {\n            curSum = max(nums[i], curSum + nums[i]);\n            maxSum = max(maxSum, curSum);\n        }\n        return maxSum;\n    }\n};'
    },
    testCases: [
      { input: '[-2,1,-3,4,-1,2,1,-5,4]', expectedOutput: '6' },
      { input: '[1]', expectedOutput: '1' },
      { input: '[5,4,-1,7,8]', expectedOutput: '23' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Move Zeroes',
    slug: 'move-zeroes',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an integer array nums, move all 0\'s to the end of it while maintaining the relative order of the non-zero elements. Note that you must do this in-place without making a copy of the array.',
    examples: [
      { input: 'nums = [0,1,0,3,12]', output: '[1,3,12,0,0]', explanation: 'All zeroes moved to end.' },
      { input: 'nums = [0]', output: '[0]', explanation: 'Array contains only zero.' }
    ],
    constraints: ['1 <= nums.length <= 10^4', '-2^31 <= nums[i] <= 2^31 - 1'],
    hints: ['Use a two-pointer approach where insertPos tracks the index for the next non-zero element.', 'Iterate through the array, shift non-zeroes forward, then fill remaining slots with 0.'],
    starterCode: {
      javascript: 'function moveZeroes(nums) {\n  let insertPos = 0;\n  for (let i = 0; i < nums.length; i++) {\n    if (nums[i] !== 0) {\n      let temp = nums[insertPos];\n      nums[insertPos] = nums[i];\n      nums[i] = temp;\n      insertPos++;\n    }\n  }\n  return nums;\n}',
      python: 'def moveZeroes(nums: list[int]) -> list[int]:\n    insert_pos = 0\n    for i in range(len(nums)):\n        if nums[i] != 0:\n            nums[insert_pos], nums[i] = nums[i], nums[insert_pos]\n            insert_pos += 1\n    return nums',
      java: 'class Solution {\n    public void moveZeroes(int[] nums) {\n        int insertPos = 0;\n        for (int i = 0; i < nums.length; i++) {\n            if (nums[i] != 0) {\n                int temp = nums[insertPos];\n                nums[insertPos] = nums[i];\n                nums[i] = temp;\n                insertPos++;\n            }\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    void moveZeroes(vector<int>& nums) {\n        int insertPos = 0;\n        for (size_t i = 0; i < nums.size(); i++) {\n            if (nums[i] != 0) swap(nums[insertPos++], nums[i]);\n        }\n    }\n};'
    },
    testCases: [
      { input: '[0,1,0,3,12]', expectedOutput: '[1,3,12,0,0]' },
      { input: '[0]', expectedOutput: '[0]' },
      { input: '[1,2,3]', expectedOutput: '[1,2,3]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Contains Duplicate',
    slug: 'contains-duplicate',
    difficulty: 'Easy',
    category: 'Arrays',
    description: 'Given an integer array nums, return true if any value appears at least twice in the array, and return false if every element is distinct.',
    examples: [
      { input: 'nums = [1,2,3,1]', output: 'true', explanation: 'Element 1 appears at index 0 and 3.' },
      { input: 'nums = [1,2,3,4]', output: 'false', explanation: 'All elements are distinct.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^9 <= nums[i] <= 10^9'],
    hints: ['A Set or Hash Table stores seen elements in O(1) average lookup time.', 'If an element is already in the set, return true immediately.'],
    starterCode: {
      javascript: 'function containsDuplicate(nums) {\n  const seen = new Set();\n  for (const num of nums) {\n    if (seen.has(num)) return true;\n    seen.add(num);\n  }\n  return false;\n}',
      python: 'def containsDuplicate(nums: list[int]) -> bool:\n    return len(nums) != len(set(nums))',
      java: 'class Solution {\n    public boolean containsDuplicate(int[] nums) {\n        java.util.Set<Integer> seen = new java.util.HashSet<>();\n        for (int n : nums) {\n            if (!seen.add(n)) return true;\n        }\n        return false;\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool containsDuplicate(vector<int>& nums) {\n        unordered_set<int> seen;\n        for (int n : nums) {\n            if (seen.count(n)) return true;\n            seen.insert(n);\n        }\n        return false;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,1]', expectedOutput: 'true' },
      { input: '[1,2,3,4]', expectedOutput: 'false' },
      { input: '[1,1,1,3,3,4,3,2,4,2]', expectedOutput: 'true' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: '3Sum',
    slug: 'three-sum',
    difficulty: 'Medium',
    category: 'Arrays',
    description: 'Given an integer array nums, return all the triplets [nums[i], nums[j], nums[k]] such that i != j, i != k, and j != k, and nums[i] + nums[j] + nums[k] == 0. Notice that the solution set must not contain duplicate triplets.',
    examples: [
      { input: 'nums = [-1,0,1,2,-1,-4]', output: '[[-1,-1,2],[-1,0,1]]', explanation: 'Triplets summing to 0.' },
      { input: 'nums = [0,1,1]', output: '[]', explanation: 'No triplet sums to 0.' }
    ],
    constraints: ['3 <= nums.length <= 3000', '-10^5 <= nums[i] <= 10^5'],
    hints: ['Sort the array first to make two-pointer searching easy.', 'Fix one element nums[i], and use two pointers (left and right) for the remaining pair.'],
    starterCode: {
      javascript: 'function threeSum(nums) {\n  nums.sort((a, b) => a - b);\n  const res = [];\n  for (let i = 0; i < nums.length - 2; i++) {\n    if (i > 0 && nums[i] === nums[i - 1]) continue;\n    let l = i + 1, r = nums.length - 1;\n    while (l < r) {\n      const sum = nums[i] + nums[l] + nums[r];\n      if (sum === 0) {\n        res.push([nums[i], nums[l], nums[r]]);\n        while (l < r && nums[l] === nums[l + 1]) l++;\n        while (l < r && nums[r] === nums[r - 1]) r--;\n        l++; r--;\n      } else if (sum < 0) l++;\n      else r--;\n    }\n  }\n  return res;\n}',
      python: 'def threeSum(nums: list[int]) -> list[list[int]]:\n    nums.sort()\n    res = []\n    for i in range(len(nums) - 2):\n        if i > 0 and nums[i] == nums[i - 1]: continue\n        l, r = i + 1, len(nums) - 1\n        while l < r:\n            s = nums[i] + nums[l] + nums[r]\n            if s == 0:\n                res.append([nums[i], nums[l], nums[r]])\n                while l < r and nums[l] == nums[l + 1]: l += 1\n                while l < r and nums[r] == nums[r - 1]: r -= 1\n                l += 1; r -= 1\n            elif s < 0: l += 1\n            else: r -= 1\n    return res',
      java: 'class Solution {\n    public java.util.List<java.util.List<Integer>> threeSum(int[] nums) {\n        java.util.Arrays.sort(nums);\n        java.util.List<java.util.List<Integer>> res = new java.util.ArrayList<>();\n        for (int i = 0; i < nums.length - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.length - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.add(java.util.Arrays.asList(nums[i], nums[l], nums[r]));\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<int>> threeSum(vector<int>& nums) {\n        sort(nums.begin(), nums.end());\n        vector<vector<int>> res;\n        for (int i = 0; i < (int)nums.size() - 2; i++) {\n            if (i > 0 && nums[i] == nums[i - 1]) continue;\n            int l = i + 1, r = nums.size() - 1;\n            while (l < r) {\n                int sum = nums[i] + nums[l] + nums[r];\n                if (sum == 0) {\n                    res.push_back({nums[i], nums[l], nums[r]});\n                    while (l < r && nums[l] == nums[l + 1]) l++;\n                    while (l < r && nums[r] == nums[r - 1]) r--;\n                    l++; r--;\n                } else if (sum < 0) l++;\n                else r--;\n            }\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[-1,0,1,2,-1,-4]', expectedOutput: '[[-1,-1,2],[-1,0,1]]' },
      { input: '[0,1,1]', expectedOutput: '[]' },
      { input: '[0,0,0]', expectedOutput: '[[0,0,0]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Product of Array Except Self',
    slug: 'product-of-array-except-self',
    difficulty: 'Medium',
    category: 'Arrays',
    description: 'Given an integer array nums, return an array answer such that answer[i] is equal to the product of all the elements of nums except nums[i]. Solve without division and in O(n) time.',
    examples: [
      { input: 'nums = [1,2,3,4]', output: '[24,12,8,6]', explanation: 'Product except self for each element.' },
      { input: 'nums = [-1,1,0,-3,3]', output: '[0,0,9,0,0]', explanation: 'Handles zero correctly.' }
    ],
    constraints: ['2 <= nums.length <= 10^5', '-30 <= nums[i] <= 30', 'The product of any prefix or suffix is guaranteed to fit in a 32-bit integer.'],
    hints: ['Compute prefix products in a first pass from left to right.', 'Maintain a running suffix product in a second pass from right to left.'],
    starterCode: {
      javascript: 'function productExceptSelf(nums) {\n  const n = nums.length;\n  const res = new Array(n).fill(1);\n  let prefix = 1;\n  for (let i = 0; i < n; i++) {\n    res[i] = prefix;\n    prefix *= nums[i];\n  }\n  let suffix = 1;\n  for (let i = n - 1; i >= 0; i--) {\n    res[i] *= suffix;\n    suffix *= nums[i];\n  }\n  return res;\n}',
      python: 'def productExceptSelf(nums: list[int]) -> list[int]:\n    n = len(nums)\n    res = [1] * n\n    prefix = 1\n    for i in range(n):\n        res[i] = prefix\n        prefix *= nums[i]\n    suffix = 1\n    for i in range(n - 1, -1, -1):\n        res[i] *= suffix\n        suffix *= nums[i]\n    return res',
      java: 'class Solution {\n    public int[] productExceptSelf(int[] nums) {\n        int n = nums.length;\n        int[] res = new int[n];\n        int prefix = 1;\n        for (int i = 0; i < n; i++) {\n            res[i] = prefix;\n            prefix *= nums[i];\n        }\n        int suffix = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= suffix;\n            suffix *= nums[i];\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> productExceptSelf(vector<int>& nums) {\n        int n = nums.size();\n        vector<int> res(n, 1);\n        int prefix = 1;\n        for (int i = 0; i < n; i++) {\n            res[i] = prefix;\n            prefix *= nums[i];\n        }\n        int suffix = 1;\n        for (int i = n - 1; i >= 0; i--) {\n            res[i] *= suffix;\n            suffix *= nums[i];\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,4]', expectedOutput: '[24,12,8,6]' },
      { input: '[-1,1,0,-3,3]', expectedOutput: '[0,0,9,0,0]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Subarray Sum Equals K',
    slug: 'subarray-sum-equals-k',
    difficulty: 'Medium',
    category: 'Arrays',
    description: 'Given an array of integers nums and an integer k, return the total number of subarrays whose sum equals to k.',
    examples: [
      { input: 'nums = [1,1,1], k = 2', output: '2', explanation: 'Subarrays [1,1] from index 0..1 and 1..2 sum to 2.' },
      { input: 'nums = [1,2,3], k = 3', output: '2', explanation: 'Subarrays [1,2] and [3] sum to 3.' }
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-1000 <= nums[i] <= 1000', '-10^7 <= k <= 10^7'],
    hints: ['Use a prefix sum with a HashMap to track frequency of prefix sums.', 'If current_prefix_sum - k exists in the map, add its count to the answer.'],
    starterCode: {
      javascript: 'function subarraySum(nums, k) {\n  const map = new Map([[0, 1]]);\n  let sum = 0, count = 0;\n  for (const n of nums) {\n    sum += n;\n    if (map.has(sum - k)) count += map.get(sum - k);\n    map.set(sum, (map.get(sum) || 0) + 1);\n  }\n  return count;\n}',
      python: 'def subarraySum(nums: list[int], k: int) -> int:\n    counts = {0: 1}\n    cur_sum = count = 0\n    for n in nums:\n        cur_sum += n\n        if cur_sum - k in counts:\n            count += counts[cur_sum - k]\n        counts[cur_sum] = counts.get(cur_sum, 0) + 1\n    return count',
      java: 'class Solution {\n    public int subarraySum(int[] nums, int k) {\n        java.util.Map<Integer, Integer> map = new java.util.HashMap<>();\n        map.put(0, 1);\n        int sum = 0, count = 0;\n        for (int n : nums) {\n            sum += n;\n            count += map.getOrDefault(sum - k, 0);\n            map.put(sum, map.getOrDefault(sum, 0) + 1);\n        }\n        return count;\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    int subarraySum(vector<int>& nums, int k) {\n        unordered_map<int, int> map;\n        map[0] = 1;\n        int sum = 0, count = 0;\n        for (int n : nums) {\n            sum += n;\n            if (map.count(sum - k)) count += map[sum - k];\n            map[sum]++;\n        }\n        return count;\n    }\n};'
    },
    testCases: [
      { input: '[1,1,1], 2', expectedOutput: '2' },
      { input: '[1,2,3], 3', expectedOutput: '2' },
      { input: '[1,-1,0], 0', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Rotate Array',
    slug: 'rotate-array',
    difficulty: 'Medium',
    category: 'Arrays',
    description: 'Given an integer array nums, rotate the array to the right by k steps, where k is non-negative. Do it in-place in O(1) extra space.',
    examples: [
      { input: 'nums = [1,2,3,4,5,6,7], k = 3', output: '[5,6,7,1,2,3,4]', explanation: 'Rotate 3 steps to the right.' },
      { input: 'nums = [-1,-100,3,99], k = 2', output: '[3,99,-1,-100]', explanation: 'Rotate 2 steps to the right.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1', '0 <= k <= 10^5'],
    hints: ['Reverse the entire array first.', 'Reverse the first k elements, then reverse the remaining n-k elements.'],
    starterCode: {
      javascript: 'function rotate(nums, k) {\n  k %= nums.length;\n  const reverse = (l, r) => {\n    while (l < r) {\n      [nums[l], nums[r]] = [nums[r], nums[l]];\n      l++; r--;\n    }\n  };\n  reverse(0, nums.length - 1);\n  reverse(0, k - 1);\n  reverse(k, nums.length - 1);\n  return nums;\n}',
      python: 'def rotate(nums: list[int], k: int) -> list[int]:\n    n = len(nums)\n    k %= n\n    nums[:] = nums[-k:] + nums[:-k]\n    return nums',
      java: 'class Solution {\n    public void rotate(int[] nums, int k) {\n        k %= nums.length;\n        reverse(nums, 0, nums.length - 1);\n        reverse(nums, 0, k - 1);\n        reverse(nums, k, nums.length - 1);\n    }\n    private void reverse(int[] nums, int l, int r) {\n        while (l < r) {\n            int temp = nums[l];\n            nums[l++] = nums[r];\n            nums[r--] = temp;\n        }\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    void rotate(vector<int>& nums, int k) {\n        k %= nums.size();\n        reverse(nums.begin(), nums.end());\n        reverse(nums.begin(), nums.begin() + k);\n        reverse(nums.begin() + k, nums.end());\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,4,5,6,7], 3', expectedOutput: '[5,6,7,1,2,3,4]' },
      { input: '[-1,-100,3,99], 2', expectedOutput: '[3,99,-1,-100]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Trapping Rain Water',
    slug: 'trapping-rain-water',
    difficulty: 'Hard',
    category: 'Arrays',
    description: 'Given n non-negative integers representing an elevation map where the width of each bar is 1, compute how much water it can trap after raining.',
    examples: [
      { input: 'height = [0,1,0,2,1,0,1,3,2,1,2,1]', output: '6', explanation: '6 units of rain water are trapped.' },
      { input: 'height = [4,2,0,3,2,5]', output: '9', explanation: '9 units of rain water are trapped.' }
    ],
    constraints: ['n == height.length', '1 <= n <= 2 * 10^4', '0 <= height[i] <= 10^5'],
    hints: ['Use two pointers left and right, maintaining leftMax and rightMax.', 'Water trapped at the lower bound is bounded by min(leftMax, rightMax) - height[i].'],
    starterCode: {
      javascript: 'function trap(height) {\n  let l = 0, r = height.length - 1;\n  let leftMax = 0, rightMax = 0, water = 0;\n  while (l < r) {\n    if (height[l] < height[r]) {\n      if (height[l] >= leftMax) leftMax = height[l];\n      else water += leftMax - height[l];\n      l++;\n    } else {\n      if (height[r] >= rightMax) rightMax = height[r];\n      else water += rightMax - height[r];\n      r--;\n    }\n  }\n  return water;\n}',
      python: 'def trap(height: list[int]) -> int:\n    l, r = 0, len(height) - 1\n    left_max = right_max = water = 0\n    while l < r:\n        if height[l] < height[r]:\n            if height[l] >= left_max: left_max = height[l]\n            else: water += left_max - height[l]\n            l += 1\n        else:\n            if height[r] >= right_max: right_max = height[r]\n            else: water += right_max - height[r]\n            r -= 1\n    return water',
      java: 'class Solution {\n    public int trap(int[] height) {\n        int l = 0, r = height.length - 1;\n        int leftMax = 0, rightMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= leftMax) leftMax = height[l];\n                else water += leftMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rightMax) rightMax = height[r];\n                else water += rightMax - height[r];\n                r--;\n            }\n        }\n        return water;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int trap(vector<int>& height) {\n        int l = 0, r = height.size() - 1;\n        int leftMax = 0, rightMax = 0, water = 0;\n        while (l < r) {\n            if (height[l] < height[r]) {\n                if (height[l] >= leftMax) leftMax = height[l];\n                else water += leftMax - height[l];\n                l++;\n            } else {\n                if (height[r] >= rightMax) rightMax = height[r];\n                else water += rightMax - height[r];\n                r--;\n            }\n        }\n        return water;\n    }\n};'
    },
    testCases: [
      { input: '[0,1,0,2,1,0,1,3,2,1,2,1]', expectedOutput: '6' },
      { input: '[4,2,0,3,2,5]', expectedOutput: '9' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'First Missing Positive',
    slug: 'first-missing-positive',
    difficulty: 'Hard',
    category: 'Arrays',
    description: 'Given an unsorted integer array nums. Return the smallest positive integer that is not present in nums. Must be solved in O(n) time and O(1) auxiliary space.',
    examples: [
      { input: 'nums = [1,2,0]', output: '3', explanation: 'Numbers 1 and 2 are present, 3 is the smallest missing positive.' },
      { input: 'nums = [3,4,-1,1]', output: '2', explanation: '1 is present, 2 is missing.' },
      { input: 'nums = [7,8,9,11,12]', output: '1', explanation: '1 is the smallest missing positive integer.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-2^31 <= nums[i] <= 2^31 - 1'],
    hints: ['Place each number x in its correct index x-1 if 1 <= x <= n using cyclic sort.', 'Iterate through the array; the first index i where nums[i] != i + 1 gives answer i + 1.'],
    starterCode: {
      javascript: 'function firstMissingPositive(nums) {\n  const n = nums.length;\n  for (let i = 0; i < n; i++) {\n    while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] !== nums[i]) {\n      const target = nums[i] - 1;\n      [nums[i], nums[target]] = [nums[target], nums[i]];\n    }\n  }\n  for (let i = 0; i < n; i++) {\n    if (nums[i] !== i + 1) return i + 1;\n  }\n  return n + 1;\n}',
      python: 'def firstMissingPositive(nums: list[int]) -> int:\n    n = len(nums)\n    for i in range(n):\n        while 1 <= nums[i] <= n and nums[nums[i] - 1] != nums[i]:\n            target = nums[i] - 1\n            nums[i], nums[target] = nums[target], nums[i]\n    for i in range(n):\n        if nums[i] != i + 1:\n            return i + 1\n    return n + 1',
      java: 'class Solution {\n    public int firstMissingPositive(int[] nums) {\n        int n = nums.length;\n        for (int i = 0; i < n; i++) {\n            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {\n                int target = nums[i] - 1;\n                int temp = nums[i];\n                nums[i] = nums[target];\n                nums[target] = temp;\n            }\n        }\n        for (int i = 0; i < n; i++) {\n            if (nums[i] != i + 1) return i + 1;\n        }\n        return n + 1;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int firstMissingPositive(vector<int>& nums) {\n        int n = nums.size();\n        for (int i = 0; i < n; i++) {\n            while (nums[i] > 0 && nums[i] <= n && nums[nums[i] - 1] != nums[i]) {\n                swap(nums[i], nums[nums[i] - 1]);\n            }\n        }\n        for (int i = 0; i < n; i++) {\n            if (nums[i] != i + 1) return i + 1;\n        }\n        return n + 1;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,0]', expectedOutput: '3' },
      { input: '[3,4,-1,1]', expectedOutput: '2' },
      { input: '[7,8,9,11,12]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Maximum Product Subarray',
    slug: 'maximum-product-subarray',
    difficulty: 'Hard',
    category: 'Arrays',
    description: 'Given an integer array nums, find a subarray that has the largest product, and return the product.',
    examples: [
      { input: 'nums = [2,3,-2,4]', output: '6', explanation: '[2,3] has the largest product 6.' },
      { input: 'nums = [-2,0,-1]', output: '0', explanation: 'The result cannot be 2, because [-2,-1] is not a subarray.' }
    ],
    constraints: ['1 <= nums.length <= 2 * 10^4', '-10 <= nums[i] <= 10'],
    hints: ['Track both the maximum and minimum product at each step because multiplying by a negative number can turn a minimum into a maximum.', 'Update max_prod and min_prod dynamically as you traverse.'],
    starterCode: {
      javascript: 'function maxProduct(nums) {\n  let maxP = nums[0], minP = nums[0], res = nums[0];\n  for (let i = 1; i < nums.length; i++) {\n    const num = nums[i];\n    if (num < 0) [maxP, minP] = [minP, maxP];\n    maxP = Math.max(num, maxP * num);\n    minP = Math.min(num, minP * num);\n    res = Math.max(res, maxP);\n  }\n  return res;\n}',
      python: 'def maxProduct(nums: list[int]) -> int:\n    max_p = min_p = res = nums[0]\n    for num in nums[1:]:\n        if num < 0:\n            max_p, min_p = min_p, max_p\n        max_p = max(num, max_p * num)\n        min_p = min(num, min_p * num)\n        res = max(res, max_p)\n    return res',
      java: 'class Solution {\n    public int maxProduct(int[] nums) {\n        int maxP = nums[0], minP = nums[0], res = nums[0];\n        for (int i = 1; i < nums.length; i++) {\n            int num = nums[i];\n            if (num < 0) {\n                int t = maxP; maxP = minP; minP = t;\n            }\n            maxP = Math.max(num, maxP * num);\n            minP = Math.min(num, minP * num);\n            res = Math.max(res, maxP);\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int maxProduct(vector<int>& nums) {\n        int maxP = nums[0], minP = nums[0], res = nums[0];\n        for (size_t i = 1; i < nums.size(); i++) {\n            int num = nums[i];\n            if (num < 0) swap(maxP, minP);\n            maxP = max(num, maxP * num);\n            minP = min(num, minP * num);\n            res = max(res, maxP);\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[2,3,-2,4]', expectedOutput: '6' },
      { input: '[-2,0,-1]', expectedOutput: '0' },
      { input: '[-2,3,-4]', expectedOutput: '24' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Valid Anagram',
    slug: 'valid-anagram',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'Given two strings s and t, return true if t is an anagram of s, and false otherwise. An Anagram is a word or phrase formed by rearranging the letters of a different word or phrase.',
    examples: [
      { input: 's = "anagram", t = "nagaram"', output: 'true', explanation: 'Both strings have the exact same character frequencies.' },
      { input: 's = "rat", t = "car"', output: 'false', explanation: 'Different characters.' }
    ],
    constraints: ['1 <= s.length, t.length <= 5 * 10^4', 's and t consist of lowercase English letters.'],
    hints: ['Check lengths first; if they differ, return false.', 'Count character frequencies with an array of size 26 or a hash map.'],
    starterCode: {
      javascript: 'function isAnagram(s, t) {\n  if (s.length !== t.length) return false;\n  const count = new Array(26).fill(0);\n  for (let i = 0; i < s.length; i++) {\n    count[s.charCodeAt(i) - 97]++;\n    count[t.charCodeAt(i) - 97]--;\n  }\n  return count.every(c => c === 0);\n}',
      python: 'def isAnagram(s: str, t: str) -> bool:\n    if len(s) != len(t): return False\n    count = [0] * 26\n    for c1, c2 in zip(s, t):\n        count[ord(c1) - ord("a")] += 1\n        count[ord(c2) - ord("a")] -= 1\n    return all(c == 0 for c in count)',
      java: 'class Solution {\n    public boolean isAnagram(String s, String t) {\n        if (s.length() != t.length()) return false;\n        int[] count = new int[26];\n        for (int i = 0; i < s.length(); i++) {\n            count[s.charAt(i) - \'a\']++;\n            count[t.charAt(i) - \'a\']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n}',
      cpp: '#include <string>\n#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isAnagram(string s, string t) {\n        if (s.length() != t.length()) return false;\n        vector<int> count(26, 0);\n        for (size_t i = 0; i < s.length(); i++) {\n            count[s[i] - \'a\']++;\n            count[t[i] - \'a\']--;\n        }\n        for (int c : count) if (c != 0) return false;\n        return true;\n    }\n};'
    },
    testCases: [
      { input: '"anagram", "nagaram"', expectedOutput: 'true' },
      { input: '"rat", "car"', expectedOutput: 'false' },
      { input: '"a", "ab"', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Valid Palindrome',
    slug: 'valid-palindrome',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'A phrase is a palindrome if, after converting all uppercase letters into lowercase letters and removing all non-alphanumeric characters, it reads the same forward and backward. Given a string s, return true if it is a palindrome.',
    examples: [
      { input: 's = "A man, a plan, a canal: Panama"', output: 'true', explanation: '"amanaplanacanalpanama" is a palindrome.' },
      { input: 's = "race a car"', output: 'false', explanation: '"raceacar" is not a palindrome.' }
    ],
    constraints: ['1 <= s.length <= 2 * 10^5', 's consists only of printable ASCII characters.'],
    hints: ['Use two pointers, one at the beginning and one at the end.', 'Skip non-alphanumeric characters and compare lowercase versions.'],
    starterCode: {
      javascript: 'function isPalindrome(s) {\n  const clean = s.toLowerCase().replace(/[^a-z0-9]/g, "");\n  let l = 0, r = clean.length - 1;\n  while (l < r) {\n    if (clean[l++] !== clean[r--]) return false;\n  }\n  return true;\n}',
      python: 'def isPalindrome(s: str) -> bool:\n    clean = [c.lower() for c in s if c.isalnum()]\n    return clean == clean[::-1]',
      java: 'class Solution {\n    public boolean isPalindrome(String s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !Character.isLetterOrDigit(s.charAt(l))) l++;\n            while (l < r && !Character.isLetterOrDigit(s.charAt(r))) r--;\n            if (Character.toLowerCase(s.charAt(l++)) != Character.toLowerCase(s.charAt(r--))) return false;\n        }\n        return true;\n    }\n}',
      cpp: '#include <string>\n#include <cctype>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isPalindrome(string s) {\n        int l = 0, r = s.length() - 1;\n        while (l < r) {\n            while (l < r && !isalnum(s[l])) l++;\n            while (l < r && !isalnum(s[r])) r--;\n            if (tolower(s[l++]) != tolower(s[r--])) return false;\n        }\n        return true;\n    }\n};'
    },
    testCases: [
      { input: '"A man, a plan, a canal: Panama"', expectedOutput: 'true' },
      { input: '"race a car"', expectedOutput: 'false' },
      { input: '" "', expectedOutput: 'true' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Longest Common Prefix',
    slug: 'longest-common-prefix',
    difficulty: 'Easy',
    category: 'Strings',
    description: 'Write a function to find the longest common prefix string amongst an array of strings. If there is no common prefix, return an empty string "".',
    examples: [
      { input: 'strs = ["flower","flow","flight"]', output: '"fl"', explanation: '"fl" is the longest common prefix.' },
      { input: 'strs = ["dog","racecar","car"]', output: '""', explanation: 'There is no common prefix among the input strings.' }
    ],
    constraints: ['1 <= strs.length <= 200', '0 <= strs[i].length <= 200', 'strs[i] consists of only lowercase English letters.'],
    hints: ['Sort the array or compare character by character vertically across all strings.', 'Stop at the first mismatch.'],
    starterCode: {
      javascript: 'function longestCommonPrefix(strs) {\n  if (!strs.length) return "";\n  let prefix = strs[0];\n  for (let i = 1; i < strs.length; i++) {\n    while (!strs[i].startsWith(prefix)) {\n      prefix = prefix.slice(0, -1);\n      if (!prefix) return "";\n    }\n  }\n  return prefix;\n}',
      python: 'def longestCommonPrefix(strs: list[str]) -> str:\n    if not strs: return ""\n    prefix = strs[0]\n    for s in strs[1:]:\n        while not s.startswith(prefix):\n            prefix = prefix[:-1]\n            if not prefix: return ""\n    return prefix',
      java: 'class Solution {\n    public String longestCommonPrefix(String[] strs) {\n        if (strs.length == 0) return "";\n        String prefix = strs[0];\n        for (int i = 1; i < strs.length; i++) {\n            while (!strs[i].startsWith(prefix)) {\n                prefix = prefix.substring(0, prefix.length() - 1);\n                if (prefix.isEmpty()) return "";\n            }\n        }\n        return prefix;\n    }\n}',
      cpp: '#include <vector>\n#include <string>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestCommonPrefix(vector<string>& strs) {\n        if (strs.empty()) return "";\n        string prefix = strs[0];\n        for (size_t i = 1; i < strs.size(); i++) {\n            while (strs[i].find(prefix) != 0) {\n                prefix = prefix.substr(0, prefix.length() - 1);\n                if (prefix.empty()) return "";\n            }\n        }\n        return prefix;\n    }\n};'
    },
    testCases: [
      { input: '["flower","flow","flight"]', expectedOutput: '"fl"' },
      { input: '["dog","racecar","car"]', expectedOutput: '""' },
      { input: '["interspecies","interstellar","interstate"]', expectedOutput: '"inters"' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Longest Substring Without Repeating Characters',
    slug: 'longest-substring-without-repeating-characters',
    difficulty: 'Medium',
    category: 'Sliding Window',
    description: 'Given a string s, find the length of the longest substring without repeating characters.',
    examples: [
      { input: 's = "abcabcbb"', output: '3', explanation: 'The answer is "abc", with the length of 3.' },
      { input: 's = "bbbbb"', output: '1', explanation: 'The answer is "b", with the length of 1.' }
    ],
    constraints: ['0 <= s.length <= 5 * 10^4', 's consists of English letters, digits, symbols and spaces.'],
    hints: ['Use sliding window with two pointers left and right.', 'Store the last seen index of each character in a map.'],
    starterCode: {
      javascript: 'function lengthOfLongestSubstring(s) {\n  const map = new Map();\n  let left = 0, maxLen = 0;\n  for (let right = 0; right < s.length; right++) {\n    if (map.has(s[right])) left = Math.max(left, map.get(s[right]) + 1);\n    map.set(s[right], right);\n    maxLen = Math.max(maxLen, right - left + 1);\n  }\n  return maxLen;\n}',
      python: 'def lengthOfLongestSubstring(s: str) -> int:\n    seen = {}\n    left = max_len = 0\n    for right, char in enumerate(s):\n        if char in seen:\n            left = max(left, seen[char] + 1)\n        seen[char] = right\n        max_len = max(max_len, right - left + 1)\n    return max_len',
      java: 'class Solution {\n    public int lengthOfLongestSubstring(String s) {\n        java.util.Map<Character, Integer> map = new java.util.HashMap<>();\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < s.length(); right++) {\n            char c = s.charAt(right);\n            if (map.containsKey(c)) left = Math.max(left, map.get(c) + 1);\n            map.put(c, right);\n            maxLen = Math.max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n}',
      cpp: '#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int lengthOfLongestSubstring(string s) {\n        unordered_map<char, int> map;\n        int left = 0, maxLen = 0;\n        for (int right = 0; right < (int)s.length(); right++) {\n            if (map.count(s[right])) left = max(left, map[s[right]] + 1);\n            map[s[right]] = right;\n            maxLen = max(maxLen, right - left + 1);\n        }\n        return maxLen;\n    }\n};'
    },
    testCases: [
      { input: '"abcabcbb"', expectedOutput: '3' },
      { input: '"bbbbb"', expectedOutput: '1' },
      { input: '"pwwkew"', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Group Anagrams',
    slug: 'group-anagrams',
    difficulty: 'Medium',
    category: 'Strings',
    description: 'Given an array of strings strs, group the anagrams together. You can return the answer in any order.',
    examples: [
      { input: 'strs = ["eat","tea","tan","ate","nat","bat"]', output: '[["bat"],["nat","tan"],["ate","eat","tea"]]', explanation: 'Anagrams grouped together.' },
      { input: 'strs = [""]', output: '[[""]]', explanation: 'Empty string group.' }
    ],
    constraints: ['1 <= strs.length <= 10^4', '0 <= strs[i].length <= 100', 'strs[i] consists of lowercase English letters.'],
    hints: ['Sort each word or use character counts as a hash map key.', 'Group all words sharing the identical key into lists.'],
    starterCode: {
      javascript: 'function groupAnagrams(strs) {\n  const map = new Map();\n  for (const s of strs) {\n    const key = s.split("").sort().join("");\n    if (!map.has(key)) map.set(key, []);\n    map.get(key).push(s);\n  }\n  return Array.from(map.values());\n}',
      python: 'from collections import defaultdict\n\ndef groupAnagrams(strs: list[str]) -> list[list[str]]:\n    groups = defaultdict(list)\n    for s in strs:\n        groups["".join(sorted(s))].append(s)\n    return list(groups.values())',
      java: 'class Solution {\n    public java.util.List<java.util.List<String>> groupAnagrams(String[] strs) {\n        java.util.Map<String, java.util.List<String>> map = new java.util.HashMap<>();\n        for (String s : strs) {\n            char[] ca = s.toCharArray();\n            java.util.Arrays.sort(ca);\n            String key = String.valueOf(ca);\n            map.computeIfAbsent(key, k -> new java.util.ArrayList<>()).add(s);\n        }\n        return new java.util.ArrayList<>(map.values());\n    }\n}',
      cpp: '#include <vector>\n#include <string>\n#include <unordered_map>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<vector<string>> groupAnagrams(vector<string>& strs) {\n        unordered_map<string, vector<string>> map;\n        for (const string& s : strs) {\n            string key = s;\n            sort(key.begin(), key.end());\n            map[key].push_back(s);\n        }\n        vector<vector<string>> res;\n        for (auto& pair : map) res.push_back(pair.second);\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '["eat","tea","tan","ate","nat","bat"]', expectedOutput: '[["bat"],["nat","tan"],["ate","eat","tea"]]' },
      { input: '[""]', expectedOutput: '[[""]]' },
      { input: '["a"]', expectedOutput: '[["a"]]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Longest Palindromic Substring',
    slug: 'longest-palindromic-substring',
    difficulty: 'Medium',
    category: 'Strings',
    description: 'Given a string s, return the longest palindromic substring in s.',
    examples: [
      { input: 's = "babad"', output: '"bab"', explanation: '"aba" is also a valid answer.' },
      { input: 's = "cbbd"', output: '"bb"', explanation: '"bb" is the longest palindrome.' }
    ],
    constraints: ['1 <= s.length <= 1000', 's consist of only digits and English letters.'],
    hints: ['Expand around center for all 2n-1 potential centers (odd and even length palindromes).', 'Track start and max length of the best palindrome found.'],
    starterCode: {
      javascript: 'function longestPalindrome(s) {\n  if (s.length < 2) return s;\n  let start = 0, maxLen = 1;\n  function expand(l, r) {\n    while (l >= 0 && r < s.length && s[l] === s[r]) {\n      if (r - l + 1 > maxLen) {\n        start = l;\n        maxLen = r - l + 1;\n      }\n      l--; r++;\n    }\n  }\n  for (let i = 0; i < s.length; i++) {\n    expand(i, i);\n    expand(i, i + 1);\n  }\n  return s.substring(start, start + maxLen);\n}',
      python: 'def longestPalindrome(s: str) -> str:\n    if len(s) < 2: return s\n    start, max_len = 0, 1\n    def expand(l, r):\n        nonlocal start, max_len\n        while l >= 0 and r < len(s) and s[l] == s[r]:\n            if r - l + 1 > max_len:\n                start, max_len = l, r - l + 1\n            l -= 1; r += 1\n    for i in range(len(s)):\n        expand(i, i)\n        expand(i, i + 1)\n    return s[start:start + max_len]',
      java: 'class Solution {\n    public String longestPalindrome(String s) {\n        if (s == null || s.length() < 2) return s;\n        int start = 0, end = 0;\n        for (int i = 0; i < s.length(); i++) {\n            int len1 = expand(s, i, i);\n            int len2 = expand(s, i, i + 1);\n            int len = Math.max(len1, len2);\n            if (len > end - start + 1) {\n                start = i - (len - 1) / 2;\n                end = i + len / 2;\n            }\n        }\n        return s.substring(start, end + 1);\n    }\n    private int expand(String s, int l, int r) {\n        while (l >= 0 && r < s.length() && s.charAt(l) == s.charAt(r)) { l--; r++; }\n        return r - l - 1;\n    }\n}',
      cpp: '#include <string>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    string longestPalindrome(string s) {\n        if (s.length() < 2) return s;\n        int start = 0, maxLen = 1;\n        auto expand = [&](int l, int r) {\n            while (l >= 0 && r < (int)s.length() && s[l] == s[r]) {\n                if (r - l + 1 > maxLen) { start = l; maxLen = r - l + 1; }\n                l--; r++;\n            }\n        };\n        for (int i = 0; i < (int)s.length(); i++) {\n            expand(i, i);\n            expand(i, i + 1);\n        }\n        return s.substr(start, maxLen);\n    }\n};'
    },
    testCases: [
      { input: '"babad"', expectedOutput: '"bab"' },
      { input: '"cbbd"', expectedOutput: '"bb"' },
      { input: '"a"', expectedOutput: '"a"' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Minimum Window Substring',
    slug: 'minimum-window-substring',
    difficulty: 'Hard',
    category: 'Strings',
    description: 'Given two strings s and t of lengths m and n respectively, return the minimum window substring of s such that every character in t (including duplicates) is included in the window. If there is no such substring, return the empty string "".',
    examples: [
      { input: 's = "ADOBECODEBANC", t = "ABC"', output: '"BANC"', explanation: 'Minimum window containing A, B, and C.' },
      { input: 's = "a", t = "a"', output: '"a"', explanation: 'Exact single character match.' }
    ],
    constraints: ['m == s.length', 'n == t.length', '1 <= m, n <= 10^5', 's and t consist of uppercase and lowercase English letters.'],
    hints: ['Use sliding window with two frequency maps or counter.', 'Expand right until all characters of t are matched, then shrink left to find minimal valid window.'],
    starterCode: {
      javascript: 'function minWindow(s, t) {\n  if (!s || !t) return "";\n  const map = {};\n  for (let c of t) map[c] = (map[c] || 0) + 1;\n  let left = 0, right = 0, required = Object.keys(map).length;\n  let formed = 0, windowCounts = {};\n  let ans = [-1, 0, 0];\n  while (right < s.length) {\n    let c = s[right];\n    windowCounts[c] = (windowCounts[c] || 0) + 1;\n    if (map[c] && windowCounts[c] === map[c]) formed++;\n    while (left <= right && formed === required) {\n      c = s[left];\n      if (ans[0] === -1 || (right - left + 1) < ans[0]) ans = [right - left + 1, left, right];\n      windowCounts[c]--;\n      if (map[c] && windowCounts[c] < map[c]) formed--;\n      left++;\n    }\n    right++;\n  }\n  return ans[0] === -1 ? "" : s.substring(ans[1], ans[2] + 1);\n}',
      python: 'from collections import Counter\n\ndef minWindow(s: str, t: str) -> str:\n    if not s or not t: return ""\n    target = Counter(t)\n    required = len(target)\n    left = right = formed = 0\n    window = {}\n    ans = float("inf"), None, None\n    while right < len(s):\n        c = s[right]\n        window[c] = window.get(c, 0) + 1\n        if c in target and window[c] == target[c]: formed += 1\n        while left <= right and formed == required:\n            if right - left + 1 < ans[0]:\n                ans = (right - left + 1, left, right)\n            c = s[left]\n            window[c] -= 1\n            if c in target and window[c] < target[c]: formed -= 1\n            left += 1\n        right += 1\n    return "" if ans[0] == float("inf") else s[ans[1]:ans[2] + 1]',
      java: 'class Solution {\n    public String minWindow(String s, String t) {\n        if (s.length() == 0 || t.length() == 0) return "";\n        java.util.Map<Character, Integer> dictT = new java.util.HashMap<>();\n        for (char c : t.toCharArray()) dictT.put(c, dictT.getOrDefault(c, 0) + 1);\n        int required = dictT.size(), formed = 0;\n        java.util.Map<Character, Integer> window = new java.util.HashMap<>();\n        int[] ans = {-1, 0, 0};\n        int l = 0, r = 0;\n        while (r < s.length()) {\n            char c = s.charAt(r);\n            window.put(c, window.getOrDefault(c, 0) + 1);\n            if (dictT.containsKey(c) && window.get(c).intValue() == dictT.get(c).intValue()) formed++;\n            while (l <= r && formed == required) {\n                if (ans[0] == -1 || r - l + 1 < ans[0]) { ans[0] = r - l + 1; ans[1] = l; ans[2] = r; }\n                char leftChar = s.charAt(l);\n                window.put(leftChar, window.get(leftChar) - 1);\n                if (dictT.containsKey(leftChar) && window.get(leftChar).intValue() < dictT.get(leftChar).intValue()) formed--;\n                l++;\n            }\n            r++;\n        }\n        return ans[0] == -1 ? "" : s.substring(ans[1], ans[2] + 1);\n    }\n}',
      cpp: '#include <string>\n#include <unordered_map>\nusing namespace std;\n\nclass Solution {\npublic:\n    string minWindow(string s, string t) {\n        if (s.empty() || t.empty()) return "";\n        unordered_map<char, int> target;\n        for (char c : t) target[c]++;\n        int required = target.size(), formed = 0;\n        unordered_map<char, int> window;\n        int minLen = 1e9, start = 0;\n        int l = 0, r = 0;\n        while (r < (int)s.length()) {\n            char c = s[r];\n            window[c]++;\n            if (target.count(c) && window[c] == target[c]) formed++;\n            while (l <= r && formed == required) {\n                if (r - l + 1 < minLen) { minLen = r - l + 1; start = l; }\n                char leftC = s[l];\n                window[leftC]--;\n                if (target.count(leftC) && window[leftC] < target[leftC]) formed--;\n                l++;\n            }\n            r++;\n        }\n        return minLen == 1e9 ? "" : s.substr(start, minLen);\n    }\n};'
    },
    testCases: [
      { input: '"ADOBECODEBANC", "ABC"', expectedOutput: '"BANC"' },
      { input: '"a", "a"', expectedOutput: '"a"' },
      { input: '"a", "aa"', expectedOutput: '""' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Intersection of Two Arrays',
    slug: 'intersection-of-two-arrays',
    difficulty: 'Easy',
    category: 'Hashing',
    description: 'Given two integer arrays nums1 and nums2, return an array of their intersection. Each element in the result must be unique and you may return the result in any order.',
    examples: [
      { input: 'nums1 = [1,2,2,1], nums2 = [2,2]', output: '[2]', explanation: '2 is the only common element.' },
      { input: 'nums1 = [4,9,5], nums2 = [9,4,9,8,4]', output: '[9,4]', explanation: '[4,9] is also accepted.' }
    ],
    constraints: ['1 <= nums1.length, nums2.length <= 1000', '0 <= nums1[i], nums2[i] <= 1000'],
    hints: ['Convert nums1 to a HashSet for O(1) membership checks.', 'Iterate through nums2, collect unique elements present in the set.'],
    starterCode: {
      javascript: 'function intersection(nums1, nums2) {\n  const set1 = new Set(nums1);\n  const res = new Set();\n  for (const n of nums2) {\n    if (set1.has(n)) res.add(n);\n  }\n  return Array.from(res);\n}',
      python: 'def intersection(nums1: list[int], nums2: list[int]) -> list[int]:\n    return list(set(nums1) & set(nums2))',
      java: 'class Solution {\n    public int[] intersection(int[] nums1, int[] nums2) {\n        java.util.Set<Integer> set1 = new java.util.HashSet<>();\n        for (int n : nums1) set1.add(n);\n        java.util.Set<Integer> res = new java.util.HashSet<>();\n        for (int n : nums2) if (set1.contains(n)) res.add(n);\n        return res.stream().mapToInt(Integer::intValue).toArray();\n    }\n}',
      cpp: '#include <vector>\n#include <unordered_set>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> intersection(vector<int>& nums1, vector<int>& nums2) {\n        unordered_set<int> set1(nums1.begin(), nums1.end());\n        unordered_set<int> resSet;\n        for (int n : nums2) if (set1.count(n)) resSet.insert(n);\n        return vector<int>(resSet.begin(), resSet.end());\n    }\n};'
    },
    testCases: [
      { input: '[1,2,2,1], [2,2]', expectedOutput: '[2]' },
      { input: '[4,9,5], [9,4,9,8,4]', expectedOutput: '[4,9]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  }
];
