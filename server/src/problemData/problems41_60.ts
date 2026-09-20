import { DSAProblemFull } from './types';

export const PROBLEMS_41_60: DSAProblemFull[] = [
  {
    title: 'Merge Sorted Array',
    slug: 'merge-sorted-array',
    difficulty: 'Easy',
    category: 'Sorting',
    description: 'You are given two integer arrays nums1 and nums2, sorted in non-decreasing order, and two integers m and n, representing the number of elements in nums1 and nums2 respectively. Merge nums1 and nums2 into a single array sorted in non-decreasing order in-place inside nums1.',
    examples: [
      { input: 'nums1 = [1,2,3,0,0,0], m = 3, nums2 = [2,5,6], n = 3', output: '[1,2,2,3,5,6]', explanation: 'Arrays merged in-place.' },
      { input: 'nums1 = [1], m = 1, nums2 = [], n = 0', output: '[1]', explanation: 'nums2 is empty.' }
    ],
    constraints: ['nums1.length == m + n', 'nums2.length == n', '0 <= m, n <= 200', '1 <= m + n <= 200', '-10^9 <= nums1[i], nums2[j] <= 10^9'],
    hints: ['Fill nums1 from the back (index m + n - 1) using three pointers.', 'Compare nums1[p1] and nums2[p2], placing the larger value at p and decrementing.'],
    starterCode: {
      javascript: 'function merge(nums1, m, nums2, n) {\n  let p1 = m - 1, p2 = n - 1, p = m + n - 1;\n  while (p2 >= 0) {\n    if (p1 >= 0 && nums1[p1] > nums2[p2]) {\n      nums1[p--] = nums1[p1--];\n    } else {\n      nums1[p--] = nums2[p2--];\n    }\n  }\n  return nums1;\n}',
      python: 'def merge(nums1: list[int], m: int, nums2: list[int], n: int) -> list[int]:\n    p1, p2, p = m - 1, n - 1, m + n - 1\n    while p2 >= 0:\n        if p1 >= 0 and nums1[p1] > nums2[p2]:\n            nums1[p] = nums1[p1]\n            p1 -= 1\n        else:\n            nums1[p] = nums2[p2]\n            p2 -= 1\n        p -= 1\n    return nums1',
      java: 'class Solution {\n    public void merge(int[] nums1, int m, int[] nums2, int n) {\n        int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n        while (p2 >= 0) {\n            if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n            else nums1[p--] = nums2[p2--];\n        }\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    void merge(vector<int>& nums1, int m, vector<int>& nums2, int n) {\n        int p1 = m - 1, p2 = n - 1, p = m + n - 1;\n        while (p2 >= 0) {\n            if (p1 >= 0 && nums1[p1] > nums2[p2]) nums1[p--] = nums1[p1--];\n            else nums1[p--] = nums2[p2--];\n        }\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,0,0,0], 3, [2,5,6], 3', expectedOutput: '[1,2,2,3,5,6]' },
      { input: '[1], 1, [], 0', expectedOutput: '[1]' },
      { input: '[0], 0, [1], 1', expectedOutput: '[1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Sort an Array (Merge Sort / Quick Sort)',
    slug: 'sort-an-array',
    difficulty: 'Medium',
    category: 'Sorting',
    description: 'Given an array of integers nums, sort the array in ascending order and return it. You must solve the problem without using any built-in functions in O(n log(n)) time complexity and with the smallest space complexity possible.',
    examples: [
      { input: 'nums = [5,2,3,1]', output: '[1,2,3,5]', explanation: 'Sorted in ascending order.' },
      { input: 'nums = [5,1,1,2,0,0]', output: '[0,0,1,1,2,5]', explanation: 'Handles duplicate values.' }
    ],
    constraints: ['1 <= nums.length <= 5 * 10^4', '-5 * 10^4 <= nums[i] <= 5 * 10^4'],
    hints: ['Implement Merge Sort (divide-and-conquer) or randomized 3-way Quick Sort.', 'Divide array recursively into two halves, sort each, and merge in O(n) time.'],
    starterCode: {
      javascript: 'function sortArray(nums) {\n  if (nums.length <= 1) return nums;\n  const mid = Math.floor(nums.length / 2);\n  const left = sortArray(nums.slice(0, mid));\n  const right = sortArray(nums.slice(mid));\n  const res = [];\n  let i = 0, j = 0;\n  while (i < left.length && j < right.length) {\n    if (left[i] <= right[j]) res.push(left[i++]);\n    else res.push(right[j++]);\n  }\n  return res.concat(left.slice(i)).concat(right.slice(j));\n}',
      python: 'def sortArray(nums: list[int]) -> list[int]:\n    if len(nums) <= 1: return nums\n    mid = len(nums) // 2\n    left = sortArray(nums[:mid])\n    right = sortArray(nums[mid:])\n    res, i, j = [], 0, 0\n    while i < len(left) and j < len(right):\n        if left[i] <= right[j]: res.append(left[i]); i += 1\n        else: res.append(right[j]); j += 1\n    res.extend(left[i:]); res.extend(right[j:])\n    return res',
      java: 'class Solution {\n    public int[] sortArray(int[] nums) {\n        mergeSort(nums, 0, nums.length - 1);\n        return nums;\n    }\n    private void mergeSort(int[] a, int l, int r) {\n        if (l >= r) return;\n        int m = l + (r - l) / 2;\n        mergeSort(a, l, m);\n        mergeSort(a, m + 1, r);\n        merge(a, l, m, r);\n    }\n    private void merge(int[] a, int l, int m, int r) {\n        int[] temp = new int[r - l + 1];\n        int i = l, j = m + 1, k = 0;\n        while (i <= m && j <= r) temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];\n        while (i <= m) temp[k++] = a[i++];\n        while (j <= r) temp[k++] = a[j++];\n        System.arraycopy(temp, 0, a, l, temp.length);\n    }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> sortArray(vector<int>& nums) {\n        mergeSort(nums, 0, (int)nums.size() - 1);\n        return nums;\n    }\n    void mergeSort(vector<int>& a, int l, int r) {\n        if (l >= r) return;\n        int m = l + (r - l) / 2;\n        mergeSort(a, l, m); mergeSort(a, m + 1, r);\n        vector<int> temp(r - l + 1);\n        int i = l, j = m + 1, k = 0;\n        while (i <= m && j <= r) temp[k++] = a[i] <= a[j] ? a[i++] : a[j++];\n        while (i <= m) temp[k++] = a[i++];\n        while (j <= r) temp[k++] = a[j++];\n        for (int p = 0; p < k; p++) a[l + p] = temp[p];\n    }\n};'
    },
    testCases: [
      { input: '[5,2,3,1]', expectedOutput: '[1,2,3,5]' },
      { input: '[5,1,1,2,0,0]', expectedOutput: '[0,0,1,1,2,5]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Kth Largest Element in an Array',
    slug: 'kth-largest-element-in-an-array',
    difficulty: 'Medium',
    category: 'Sorting',
    description: 'Given an integer array nums and an integer k, return the kth largest element in the array. Can be solved using QuickSelect in O(n) average time or a Min-Heap of size k in O(n log k) time.',
    examples: [
      { input: 'nums = [3,2,1,5,6,4], k = 2', output: '5', explanation: '2nd largest is 5.' },
      { input: 'nums = [3,2,3,1,2,4,5,5,6], k = 4', output: '4', explanation: '4th largest is 4.' }
    ],
    constraints: ['1 <= k <= nums.length <= 10^5', '-10^4 <= nums[i] <= 10^4'],
    hints: ['Use Quickselect partitioning around a random pivot.', 'If pivot index equals n - k, return nums[pivot].'],
    starterCode: {
      javascript: 'function findKthLargest(nums, k) {\n  const targetIdx = nums.length - k;\n  function quickSelect(l, r) {\n    const pivot = nums[r];\n    let p = l;\n    for (let i = l; i < r; i++) {\n      if (nums[i] <= pivot) {\n        [nums[p], nums[i]] = [nums[i], nums[p]];\n        p++;\n      }\n    }\n    [nums[p], nums[r]] = [nums[r], nums[p]];\n    if (p === targetIdx) return nums[p];\n    if (p < targetIdx) return quickSelect(p + 1, r);\n    return quickSelect(l, p - 1);\n  }\n  return quickSelect(0, nums.length - 1);\n}',
      python: 'import heapq\n\ndef findKthLargest(nums: list[int], k: int) -> int:\n    return heapq.nlargest(k, nums)[-1]',
      java: 'class Solution {\n    public int findKthLargest(int[] nums, int k) {\n        java.util.PriorityQueue<Integer> pq = new java.util.PriorityQueue<>();\n        for (int n : nums) {\n            pq.offer(n);\n            if (pq.size() > k) pq.poll();\n        }\n        return pq.peek();\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    int findKthLargest(vector<int>& nums, int k) {\n        priority_queue<int, vector<int>, greater<int>> pq;\n        for (int n : nums) {\n            pq.push(n);\n            if ((int)pq.size() > k) pq.pop();\n        }\n        return pq.top();\n    }\n};'
    },
    testCases: [
      { input: '[3,2,1,5,6,4], 2', expectedOutput: '5' },
      { input: '[3,2,3,1,2,4,5,5,6], 4', expectedOutput: '4' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Reverse Linked List',
    slug: 'reverse-linked-list',
    difficulty: 'Easy',
    category: 'Linked List',
    description: 'Given the head of a singly linked list, reverse the list, and return the reversed list.',
    examples: [
      { input: 'head = [1,2,3,4,5]', output: '[5,4,3,2,1]', explanation: 'Reversed singly linked list.' },
      { input: 'head = [1,2]', output: '[2,1]', explanation: 'Reversed 2-node list.' }
    ],
    constraints: ['The number of nodes in the list is the range [0, 5000].', '-5000 <= Node.val <= 5000'],
    hints: ['Maintain three pointers: prev (null), curr (head), and next (curr.next).', 'At each step, set curr.next = prev, shift prev = curr, curr = next.'],
    starterCode: {
      javascript: 'function reverseList(head) {\n  let prev = null, curr = head;\n  while (curr) {\n    const next = curr.next;\n    curr.next = prev;\n    prev = curr;\n    curr = next;\n  }\n  return prev;\n}',
      python: 'def reverseList(head):\n    prev, curr = None, head\n    while curr:\n        nxt = curr.next\n        curr.next = prev\n        prev = curr\n        curr = nxt\n    return prev',
      java: 'class Solution {\n    public ListNode reverseList(ListNode head) {\n        ListNode prev = null, curr = head;\n        while (curr != null) {\n            ListNode next = curr.next;\n            curr.next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseList(ListNode* head) {\n        ListNode* prev = nullptr;\n        ListNode* curr = head;\n        while (curr != nullptr) {\n            ListNode* next = curr->next;\n            curr->next = prev;\n            prev = curr;\n            curr = next;\n        }\n        return prev;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,4,5]', expectedOutput: '[5,4,3,2,1]' },
      { input: '[1,2]', expectedOutput: '[2,1]' },
      { input: '[]', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Merge Two Sorted Lists',
    slug: 'merge-two-sorted-lists',
    difficulty: 'Easy',
    category: 'Linked List',
    description: 'You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list. The list should be made by splicing together the nodes of the first two lists. Return the head of the merged linked list.',
    examples: [
      { input: 'list1 = [1,2,4], list2 = [1,3,4]', output: '[1,1,2,3,4,4]', explanation: 'Merged sorted linked list.' },
      { input: 'list1 = [], list2 = []', output: '[]', explanation: 'Both empty lists.' }
    ],
    constraints: ['The number of nodes in both lists is in the range [0, 50].', '-100 <= Node.val <= 100', 'Both list1 and list2 are sorted in non-decreasing order.'],
    hints: ['Create a dummy head node to simplify edge cases.', 'Compare list1.val and list2.val, attach the smaller node to tail, and advance.'],
    starterCode: {
      javascript: 'function mergeTwoLists(list1, list2) {\n  const dummy = { val: 0, next: null };\n  let tail = dummy;\n  while (list1 && list2) {\n    if (list1.val <= list2.val) {\n      tail.next = list1;\n      list1 = list1.next;\n    } else {\n      tail.next = list2;\n      list2 = list2.next;\n    }\n    tail = tail.next;\n  }\n  tail.next = list1 || list2;\n  return dummy.next;\n}',
      python: 'def mergeTwoLists(list1, list2):\n    dummy = ListNode(0)\n    tail = dummy\n    while list1 and list2:\n        if list1.val <= list2.val:\n            tail.next = list1\n            list1 = list1.next\n        else:\n            tail.next = list2\n            list2 = list2.next\n        tail = tail.next\n    tail.next = list1 or list2\n    return dummy.next',
      java: 'class Solution {\n    public ListNode mergeTwoLists(ListNode list1, ListNode list2) {\n        ListNode dummy = new ListNode(0);\n        ListNode tail = dummy;\n        while (list1 != null && list2 != null) {\n            if (list1.val <= list2.val) {\n                tail.next = list1; list1 = list1.next;\n            } else {\n                tail.next = list2; list2 = list2.next;\n            }\n            tail = tail.next;\n        }\n        tail.next = list1 != null ? list1 : list2;\n        return dummy.next;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* mergeTwoLists(ListNode* list1, ListNode* list2) {\n        ListNode dummy(0);\n        ListNode* tail = &dummy;\n        while (list1 && list2) {\n            if (list1->val <= list2->val) {\n                tail->next = list1; list1 = list1->next;\n            } else {\n                tail->next = list2; list2 = list2->next;\n            }\n            tail = tail->next;\n        }\n        tail->next = list1 ? list1 : list2;\n        return dummy.next;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,4], [1,3,4]', expectedOutput: '[1,1,2,3,4,4]' },
      { input: '[], []', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Linked List Cycle',
    slug: 'linked-list-cycle',
    difficulty: 'Easy',
    category: 'Linked List',
    description: 'Given head, the head of a linked list, determine if the linked list has a cycle in it. Solve using Floyd\'s Tortoise and Hare cycle-finding algorithm with O(1) space.',
    examples: [
      { input: 'head = [3,2,0,-4], pos = 1', output: 'true', explanation: 'Tail connects to the 1st node (0-indexed).' },
      { input: 'head = [1,2], pos = 0', output: 'true', explanation: 'Tail connects to node 0.' },
      { input: 'head = [1], pos = -1', output: 'false', explanation: 'No cycle.' }
    ],
    constraints: ['The number of nodes in the list is in the range [0, 10^4].', '-10^5 <= Node.val <= 10^5'],
    hints: ['Use two pointers: slow moves 1 step, fast moves 2 steps.', 'If fast encounters slow, there is a cycle. If fast reaches null, there is no cycle.'],
    starterCode: {
      javascript: 'function hasCycle(head) {\n  let slow = head, fast = head;\n  while (fast && fast.next) {\n    slow = slow.next;\n    fast = fast.next.next;\n    if (slow === fast) return true;\n  }\n  return false;\n}',
      python: 'def hasCycle(head) -> bool:\n    slow = fast = head\n    while fast and fast.next:\n        slow = slow.next\n        fast = fast.next.next\n        if slow == fast: return True\n    return False',
      java: 'public class Solution {\n    public boolean hasCycle(ListNode head) {\n        ListNode slow = head, fast = head;\n        while (fast != null && fast.next != null) {\n            slow = slow.next;\n            fast = fast.next.next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    bool hasCycle(ListNode *head) {\n        ListNode *slow = head, *fast = head;\n        while (fast && fast->next) {\n            slow = slow->next;\n            fast = fast->next->next;\n            if (slow == fast) return true;\n        }\n        return false;\n    }\n};'
    },
    testCases: [
      { input: '[3,2,0,-4], pos = 1', expectedOutput: 'true' },
      { input: '[1,2], pos = 0', expectedOutput: 'true' },
      { input: '[1], pos = -1', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Remove Nth Node From End of List',
    slug: 'remove-nth-node-from-end-of-list',
    difficulty: 'Medium',
    category: 'Linked List',
    description: 'Given the head of a linked list, remove the nth node from the end of the list and return its head in one pass.',
    examples: [
      { input: 'head = [1,2,3,4,5], n = 2', output: '[1,2,3,5]', explanation: 'Remove the 2nd node from end (node 4).' },
      { input: 'head = [1], n = 1', output: '[]', explanation: 'List becomes empty.' }
    ],
    constraints: ['The number of nodes in the list is sz.', '1 <= sz <= 30', '0 <= Node.val <= 100', '1 <= n <= sz'],
    hints: ['Advance fast pointer n steps forward first.', 'Then move both slow and fast together until fast reaches the end.'],
    starterCode: {
      javascript: 'function removeNthFromEnd(head, n) {\n  const dummy = { val: 0, next: head };\n  let fast = dummy, slow = dummy;\n  for (let i = 0; i < n; i++) fast = fast.next;\n  while (fast.next) {\n    slow = slow.next;\n    fast = fast.next;\n  }\n  slow.next = slow.next.next;\n  return dummy.next;\n}',
      python: 'def removeNthFromEnd(head, n: int):\n    dummy = ListNode(0, head)\n    slow = fast = dummy\n    for _ in range(n):\n        fast = fast.next\n    while fast.next:\n        slow = slow.next\n        fast = fast.next\n    slow.next = slow.next.next\n    return dummy.next',
      java: 'class Solution {\n    public ListNode removeNthFromEnd(ListNode head, int n) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode fast = dummy, slow = dummy;\n        for (int i = 0; i < n; i++) fast = fast.next;\n        while (fast.next != null) {\n            slow = slow.next; fast = fast.next;\n        }\n        slow.next = slow.next.next;\n        return dummy.next;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* removeNthFromEnd(ListNode* head, int n) {\n        ListNode dummy(0, head);\n        ListNode* fast = &dummy;\n        ListNode* slow = &dummy;\n        for (int i = 0; i < n; i++) fast = fast->next;\n        while (fast->next) {\n            slow = slow->next; fast = fast->next;\n        }\n        slow->next = slow->next->next;\n        return dummy.next;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,4,5], 2', expectedOutput: '[1,2,3,5]' },
      { input: '[1], 1', expectedOutput: '[]' },
      { input: '[1,2], 1', expectedOutput: '[1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Add Two Numbers',
    slug: 'add-two-numbers',
    difficulty: 'Medium',
    category: 'Linked List',
    description: 'You are given two non-empty linked lists representing two non-negative integers. The digits are stored in reverse order, and each of their nodes contains a single digit. Add the two numbers and return the sum as a linked list.',
    examples: [
      { input: 'l1 = [2,4,3], l2 = [5,6,4]', output: '[7,0,8]', explanation: '342 + 465 = 807.' },
      { input: 'l1 = [0], l2 = [0]', output: '[0]', explanation: '0 + 0 = 0.' }
    ],
    constraints: ['The number of nodes in each linked list is in the range [1, 100].', '0 <= Node.val <= 9', 'It is guaranteed that the list represents a number that does not have leading zeros.'],
    hints: ['Maintain carry = Math.floor(sum / 10).', 'Iterate while l1, l2, or carry exists, creating new nodes with sum % 10.'],
    starterCode: {
      javascript: 'function addTwoNumbers(l1, l2) {\n  const dummy = { val: 0, next: null };\n  let curr = dummy, carry = 0;\n  while (l1 || l2 || carry) {\n    const sum = (l1 ? l1.val : 0) + (l2 ? l2.val : 0) + carry;\n    carry = Math.floor(sum / 10);\n    curr.next = { val: sum % 10, next: null };\n    curr = curr.next;\n    if (l1) l1 = l1.next;\n    if (l2) l2 = l2.next;\n  }\n  return dummy.next;\n}',
      python: 'def addTwoNumbers(l1, l2):\n    dummy = ListNode(0)\n    curr = dummy\n    carry = 0\n    while l1 or l2 or carry:\n        s = (l1.val if l1 else 0) + (l2.val if l2 else 0) + carry\n        carry = s // 10\n        curr.next = ListNode(s % 10)\n        curr = curr.next\n        l1 = l1.next if l1 else None\n        l2 = l2.next if l2 else None\n    return dummy.next',
      java: 'class Solution {\n    public ListNode addTwoNumbers(ListNode l1, ListNode l2) {\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        int carry = 0;\n        while (l1 != null || l2 != null || carry != 0) {\n            int sum = (l1 != null ? l1.val : 0) + (l2 != null ? l2.val : 0) + carry;\n            carry = sum / 10;\n            curr.next = new ListNode(sum % 10);\n            curr = curr.next;\n            if (l1 != null) l1 = l1.next;\n            if (l2 != null) l2 = l2.next;\n        }\n        return dummy.next;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* addTwoNumbers(ListNode* l1, ListNode* l2) {\n        ListNode dummy(0);\n        ListNode* curr = &dummy;\n        int carry = 0;\n        while (l1 || l2 || carry) {\n            int sum = (l1 ? l1->val : 0) + (l2 ? l2->val : 0) + carry;\n            carry = sum / 10;\n            curr->next = new ListNode(sum % 10);\n            curr = curr->next;\n            if (l1) l1 = l1->next;\n            if (l2) l2 = l2->next;\n        }\n        return dummy.next;\n    }\n};'
    },
    testCases: [
      { input: '[2,4,3], [5,6,4]', expectedOutput: '[7,0,8]' },
      { input: '[0], [0]', expectedOutput: '[0]' },
      { input: '[9,9,9,9,9,9,9], [9,9,9,9]', expectedOutput: '[8,9,9,9,0,0,0,1]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Merge k Sorted Lists',
    slug: 'merge-k-sorted-lists',
    difficulty: 'Hard',
    category: 'Linked List',
    description: 'You are given an array of k linked-lists lists, each linked-list is sorted in ascending order. Merge all the linked-lists into one sorted linked-list and return it.',
    examples: [
      { input: 'lists = [[1,4,5],[1,3,4],[2,6]]', output: '[1,1,2,3,4,4,5,6]', explanation: 'All k lists merged in sorted order.' },
      { input: 'lists = []', output: '[]', explanation: 'Empty array of lists.' }
    ],
    constraints: ['k == lists.length', '0 <= k <= 10^4', '0 <= lists[i].length <= 500', '-10^4 <= lists[i][j] <= 10^4', 'lists[i] is sorted in ascending order.'],
    hints: ['Use a min-heap priority queue storing current heads of all k lists in O(N log k) time.', 'Alternatively, use divide-and-conquer to merge pairs of lists.'],
    starterCode: {
      javascript: 'function mergeKLists(lists) {\n  if (!lists.length) return null;\n  while (lists.length > 1) {\n    const merged = [];\n    for (let i = 0; i < lists.length; i += 2) {\n      const l1 = lists[i], l2 = i + 1 < lists.length ? lists[i + 1] : null;\n      merged.push(mergeTwo(l1, l2));\n    }\n    lists = merged;\n  }\n  return lists[0];\n  function mergeTwo(l1, l2) {\n    const dummy = { val: 0, next: null };\n    let tail = dummy;\n    while (l1 && l2) {\n      if (l1.val <= l2.val) { tail.next = l1; l1 = l1.next; }\n      else { tail.next = l2; l2 = l2.next; }\n      tail = tail.next;\n    }\n    tail.next = l1 || l2;\n    return dummy.next;\n  }\n}',
      python: 'import heapq\n\ndef mergeKLists(lists):\n    h = []\n    for i, node in enumerate(lists):\n        if node: heapq.heappush(h, (node.val, i, node))\n    dummy = ListNode(0)\n    curr = dummy\n    while h:\n        val, i, node = heapq.heappop(h)\n        curr.next = node\n        curr = curr.next\n        if node.next:\n            heapq.heappush(h, (node.next.val, i, node.next))\n    return dummy.next',
      java: 'class Solution {\n    public ListNode mergeKLists(ListNode[] lists) {\n        if (lists == null || lists.length == 0) return null;\n        java.util.PriorityQueue<ListNode> pq = new java.util.PriorityQueue<>((a, b) -> a.val - b.val);\n        for (ListNode node : lists) if (node != null) pq.offer(node);\n        ListNode dummy = new ListNode(0);\n        ListNode curr = dummy;\n        while (!pq.isEmpty()) {\n            ListNode minNode = pq.poll();\n            curr.next = minNode;\n            curr = curr.next;\n            if (minNode.next != null) pq.offer(minNode.next);\n        }\n        return dummy.next;\n    }\n}',
      cpp: '#include <vector>\n#include <queue>\nusing namespace std;\n\nclass Solution {\npublic:\n    ListNode* mergeKLists(vector<ListNode*>& lists) {\n        auto cmp = [](ListNode* a, ListNode* b) { return a->val > b->val; };\n        priority_queue<ListNode*, vector<ListNode*>, decltype(cmp)> pq(cmp);\n        for (auto node : lists) if (node) pq.push(node);\n        ListNode dummy(0);\n        ListNode* curr = &dummy;\n        while (!pq.empty()) {\n            ListNode* minNode = pq.top(); pq.pop();\n            curr->next = minNode;\n            curr = curr->next;\n            if (minNode->next) pq.push(minNode->next);\n        }\n        return dummy.next;\n    }\n};'
    },
    testCases: [
      { input: '[[1,4,5],[1,3,4],[2,6]]', expectedOutput: '[1,1,2,3,4,4,5,6]' },
      { input: '[]', expectedOutput: '[]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Reverse Nodes in k-Group',
    slug: 'reverse-nodes-in-k-group',
    difficulty: 'Hard',
    category: 'Linked List',
    description: 'Given the head of a linked list, reverse the nodes of the list k at a time, and return the modified list. k is a positive integer and is less than or equal to the length of the linked list. Nodes that are not a multiple of k should remain as is.',
    examples: [
      { input: 'head = [1,2,3,4,5], k = 2', output: '[2,1,4,3,5]', explanation: 'Reversed in pairs.' },
      { input: 'head = [1,2,3,4,5], k = 3', output: '[3,2,1,4,5]', explanation: 'First group of 3 reversed, remaining 2 untouched.' }
    ],
    constraints: ['The number of nodes in the list is n.', '1 <= k <= n <= 5000', '0 <= Node.val <= 1000'],
    hints: ['Count k nodes ahead. If fewer than k nodes remain, stop.', 'Reverse the sublist of k nodes and stitch back to groupPrev.'],
    starterCode: {
      javascript: 'function reverseKGroup(head, k) {\n  const dummy = { val: 0, next: head };\n  let groupPrev = dummy;\n  while (true) {\n    let kth = groupPrev;\n    for (let i = 0; i < k && kth; i++) kth = kth.next;\n    if (!kth) break;\n    const groupNext = kth.next;\n    let prev = groupNext, curr = groupPrev.next;\n    while (curr !== groupNext) {\n      const temp = curr.next;\n      curr.next = prev;\n      prev = curr;\n      curr = temp;\n    }\n    const temp = groupPrev.next;\n    groupPrev.next = kth;\n    groupPrev = temp;\n  }\n  return dummy.next;\n}',
      python: 'def reverseKGroup(head, k: int):\n    dummy = ListNode(0, head)\n    group_prev = dummy\n    while True:\n        kth = group_prev\n        for _ in range(k):\n            kth = kth.next\n            if not kth: return dummy.next\n        group_next = kth.next\n        prev, curr = group_next, group_prev.next\n        while curr != group_next:\n            tmp = curr.next\n            curr.next = prev\n            prev = curr\n            curr = tmp\n        tmp = group_prev.next\n        group_prev.next = kth\n        group_prev = tmp\n    return dummy.next',
      java: 'class Solution {\n    public ListNode reverseKGroup(ListNode head, int k) {\n        ListNode dummy = new ListNode(0, head);\n        ListNode groupPrev = dummy;\n        while (true) {\n            ListNode kth = groupPrev;\n            for (int i = 0; i < k && kth != null; i++) kth = kth.next;\n            if (kth == null) break;\n            ListNode groupNext = kth.next;\n            ListNode prev = groupNext, curr = groupPrev.next;\n            while (curr != groupNext) {\n                ListNode tmp = curr.next;\n                curr.next = prev;\n                prev = curr;\n                curr = tmp;\n            }\n            ListNode tmp = groupPrev.next;\n            groupPrev.next = kth;\n            groupPrev = tmp;\n        }\n        return dummy.next;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    ListNode* reverseKGroup(ListNode* head, int k) {\n        ListNode dummy(0, head);\n        ListNode* groupPrev = &dummy;\n        while (true) {\n            ListNode* kth = groupPrev;\n            for (int i = 0; i < k && kth; i++) kth = kth->next;\n            if (!kth) break;\n            ListNode* groupNext = kth->next;\n            ListNode *prev = groupNext, *curr = groupPrev->next;\n            while (curr != groupNext) {\n                ListNode* tmp = curr->next;\n                curr->next = prev;\n                prev = curr;\n                curr = tmp;\n            }\n            ListNode* tmp = groupPrev->next;\n            groupPrev->next = kth;\n            groupPrev = tmp;\n        }\n        return dummy.next;\n    }\n};'
    },
    testCases: [
      { input: '[1,2,3,4,5], 2', expectedOutput: '[2,1,4,3,5]' },
      { input: '[1,2,3,4,5], 3', expectedOutput: '[3,2,1,4,5]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Valid Parentheses',
    slug: 'valid-parentheses',
    difficulty: 'Easy',
    category: 'Stack',
    description: 'Given a string s containing just the characters \'(\', \')\', \'{\', \'}\', \'[\' and \']\', determine if the input string is valid.',
    examples: [
      { input: 's = "()"', output: 'true', explanation: 'Matching pair.' },
      { input: 's = "()[]{}"', output: 'true', explanation: 'All matching pairs.' },
      { input: 's = "(]"', output: 'false', explanation: 'Mismatched brackets.' }
    ],
    constraints: ['1 <= s.length <= 10^4', 's consists of parentheses only \'()[]{}\'.'],
    hints: ['Push expected closing brackets onto a stack when opening brackets are encountered.', 'When closing bracket appears, pop and verify equality.'],
    starterCode: {
      javascript: 'function isValid(s) {\n  const stack = [];\n  const pairs = { ")": "(", "}": "{", "]": "[" };\n  for (const c of s) {\n    if (c === "(" || c === "{" || c === "[") stack.push(c);\n    else if (!stack.length || stack.pop() !== pairs[c]) return false;\n  }\n  return stack.length === 0;\n}',
      python: 'def isValid(s: str) -> bool:\n    stack = []\n    pairs = {")": "(", "}": "{", "]": "["}\n    for c in s:\n        if c in pairs.values(): stack.append(c)\n        elif not stack or stack.pop() != pairs[c]: return False\n    return not stack',
      java: 'class Solution {\n    public boolean isValid(String s) {\n        java.util.Stack<Character> stack = new java.util.Stack<>();\n        for (char c : s.toCharArray()) {\n            if (c == \'(\') stack.push(\')\');\n            else if (c == \'{\') stack.push(\'}\');\n            else if (c == \'[\') stack.push(\']\');\n            else if (stack.isEmpty() || stack.pop() != c) return false;\n        }\n        return stack.isEmpty();\n    }\n}',
      cpp: '#include <string>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    bool isValid(string s) {\n        stack<char> st;\n        for (char c : s) {\n            if (c == \'(\') st.push(\')\');\n            else if (c == \'{\') st.push(\'}\');\n            else if (c == \'[\') st.push(\']\');\n            else if (st.empty() || st.top() != c) return false;\n            else st.pop();\n        }\n        return st.empty();\n    }\n};'
    },
    testCases: [
      { input: '"()"', expectedOutput: 'true' },
      { input: '"()[]{}"', expectedOutput: 'true' },
      { input: '"(]"', expectedOutput: 'false' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Min Stack',
    slug: 'min-stack',
    difficulty: 'Medium',
    category: 'Stack',
    description: 'Design a stack that supports push, pop, top, and retrieving the minimum element in constant time O(1).',
    examples: [
      { input: '["MinStack","push","push","push","getMin","pop","top","getMin"]\n[[],[-2],[0],[-3],[],[],[],[]]', output: '[null,null,null,null,-3,null,0,-2]', explanation: 'Min stack O(1) operations.' }
    ],
    constraints: ['-2^31 <= val <= 2^31 - 1', 'Methods pop, top and getMin operations will always be called on non-empty stacks.', 'At most 3 * 10^4 calls will be made to push, pop, top, and getMin.'],
    hints: ['Store pairs [val, minSoFar] in a single stack, or maintain a secondary minStack.'],
    starterCode: {
      javascript: 'class MinStack {\n  constructor() {\n    this.stack = [];\n  }\n  push(val) {\n    const min = !this.stack.length ? val : Math.min(val, this.getMin());\n    this.stack.push({ val, min });\n  }\n  pop() {\n    this.stack.pop();\n  }\n  top() {\n    return this.stack[this.stack.length - 1].val;\n  }\n  getMin() {\n    return this.stack[this.stack.length - 1].min;\n  }\n}',
      python: 'class MinStack:\n    def __init__(self):\n        self.stack = []\n    def push(self, val: int) -> None:\n        m = val if not self.stack else min(val, self.stack[-1][1])\n        self.stack.append((val, m))\n    def pop(self) -> None:\n        self.stack.pop()\n    def top(self) -> int:\n        return self.stack[-1][0]\n    def getMin(self) -> int:\n        return self.stack[-1][1]',
      java: 'class MinStack {\n    private java.util.Stack<int[]> stack = new java.util.Stack<>();\n    public void push(int val) {\n        int min = stack.isEmpty() ? val : Math.min(val, stack.peek()[1]);\n        stack.push(new int[]{val, min});\n    }\n    public void pop() { stack.pop(); }\n    public int top() { return stack.peek()[0]; }\n    public int getMin() { return stack.peek()[1]; }\n}',
      cpp: '#include <stack>\n#include <algorithm>\nusing namespace std;\n\nclass MinStack {\n    stack<pair<int, int>> st;\npublic:\n    void push(int val) {\n        int m = st.empty() ? val : min(val, st.top().second);\n        st.push({val, m});\n    }\n    void pop() { st.pop(); }\n    int top() { return st.top().first; }\n    int getMin() { return st.top().second; }\n};'
    },
    testCases: [
      { input: 'push(-2), push(0), push(-3), getMin(), pop(), top(), getMin()', expectedOutput: '[-3, 0, -2]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Daily Temperatures',
    slug: 'daily-temperatures',
    difficulty: 'Medium',
    category: 'Stack',
    description: 'Given an array of integers temperatures represents the daily temperatures, return an array answer such that answer[i] is the number of days you have to wait after the ith day to get a warmer temperature. If there is no future day for which this is possible, keep answer[i] == 0.',
    examples: [
      { input: 'temperatures = [73,74,75,71,69,72,76,73]', output: '[1,1,4,2,1,1,0,0]', explanation: 'Monotonic stack calculation.' },
      { input: 'temperatures = [30,40,50,60]', output: '[1,1,1,0]', explanation: 'Each next day is warmer.' }
    ],
    constraints: ['1 <= temperatures.length <= 10^5', '30 <= temperatures[i] <= 100'],
    hints: ['Use a monotonic decreasing stack storing indices.', 'Pop elements from the stack when a warmer day is encountered and calculate the index difference.'],
    starterCode: {
      javascript: 'function dailyTemperatures(temperatures) {\n  const res = new Array(temperatures.length).fill(0);\n  const stack = []; // indices\n  for (let i = 0; i < temperatures.length; i++) {\n    while (stack.length && temperatures[i] > temperatures[stack[stack.length - 1]]) {\n      const prevIdx = stack.pop();\n      res[prevIdx] = i - prevIdx;\n    }\n    stack.push(i);\n  }\n  return res;\n}',
      python: 'def dailyTemperatures(temperatures: list[int]) -> list[int]:\n    res = [0] * len(temperatures)\n    stack = []\n    for i, t in enumerate(temperatures):\n        while stack and t > temperatures[stack[-1]]:\n            prev = stack.pop()\n            res[prev] = i - prev\n        stack.append(i)\n    return res',
      java: 'class Solution {\n    public int[] dailyTemperatures(int[] temperatures) {\n        int[] res = new int[temperatures.length];\n        java.util.Stack<Integer> stack = new java.util.Stack<>();\n        for (int i = 0; i < temperatures.length; i++) {\n            while (!stack.isEmpty() && temperatures[i] > temperatures[stack.peek()]) {\n                int prev = stack.pop();\n                res[prev] = i - prev;\n            }\n            stack.push(i);\n        }\n        return res;\n    }\n}',
      cpp: '#include <vector>\n#include <stack>\nusing namespace std;\n\nclass Solution {\npublic:\n    vector<int> dailyTemperatures(vector<int>& temperatures) {\n        vector<int> res(temperatures.size(), 0);\n        stack<int> st;\n        for (size_t i = 0; i < temperatures.size(); i++) {\n            while (!st.empty() && temperatures[i] > temperatures[st.top()]) {\n                int prev = st.top(); st.pop();\n                res[prev] = i - prev;\n            }\n            st.push(i);\n        }\n        return res;\n    }\n};'
    },
    testCases: [
      { input: '[73,74,75,71,69,72,76,73]', expectedOutput: '[1,1,4,2,1,1,0,0]' },
      { input: '[30,40,50,60]', expectedOutput: '[1,1,1,0]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Largest Rectangle in Histogram',
    slug: 'largest-rectangle-in-histogram',
    difficulty: 'Hard',
    category: 'Stack',
    description: 'Given an array of integers heights representing the histogram\'s bar height where the width of each bar is 1, return the area of the largest rectangle in the histogram in O(n) time.',
    examples: [
      { input: 'heights = [2,1,5,6,2,3]', output: '10', explanation: 'The largest rectangle has area = 10 units (between bars 5 and 6).' },
      { input: 'heights = [2,4]', output: '4', explanation: 'Max rectangle area is 4.' }
    ],
    constraints: ['1 <= heights.length <= 10^5', '0 <= heights[i] <= 10^4'],
    hints: ['Maintain a monotonic increasing stack of indices.', 'When a smaller height is found, pop the stack and compute width = stack.isEmpty() ? i : i - stack.peek() - 1.'],
    starterCode: {
      javascript: 'function largestRectangleArea(heights) {\n  const stack = [];\n  let maxArea = 0;\n  heights.push(0);\n  for (let i = 0; i < heights.length; i++) {\n    while (stack.length && heights[i] < heights[stack[stack.length - 1]]) {\n      const h = heights[stack.pop()];\n      const w = stack.length === 0 ? i : i - stack[stack.length - 1] - 1;\n      maxArea = Math.max(maxArea, h * w);\n    }\n    stack.push(i);\n  }\n  return maxArea;\n}',
      python: 'def largestRectangleArea(heights: list[int]) -> int:\n    stack = []\n    max_area = 0\n    heights.append(0)\n    for i, h in enumerate(heights):\n        while stack and h < heights[stack[-1]]:\n            height = heights[stack.pop()]\n            width = i if not stack else i - stack[-1] - 1\n            max_area = max(max_area, height * width)\n        stack.append(i)\n    return max_area',
      java: 'class Solution {\n    public int largestRectangleArea(int[] heights) {\n        java.util.Stack<Integer> stack = new java.util.Stack<>();\n        int maxArea = 0, n = heights.length;\n        for (int i = 0; i <= n; i++) {\n            int h = i == n ? 0 : heights[i];\n            while (!stack.isEmpty() && h < heights[stack.peek()]) {\n                int height = heights[stack.pop()];\n                int width = stack.isEmpty() ? i : i - stack.peek() - 1;\n                maxArea = Math.max(maxArea, height * width);\n            }\n            stack.push(i);\n        }\n        return maxArea;\n    }\n}',
      cpp: '#include <vector>\n#include <stack>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int largestRectangleArea(vector<int>& heights) {\n        stack<int> st;\n        int maxArea = 0;\n        heights.push_back(0);\n        for (size_t i = 0; i < heights.size(); i++) {\n            while (!st.empty() && heights[i] < heights[st.top()]) {\n                int h = heights[st.top()]; st.pop();\n                int w = st.empty() ? i : i - st.top() - 1;\n                maxArea = max(maxArea, h * w);\n            }\n            st.push(i);\n        }\n        return maxArea;\n    }\n};'
    },
    testCases: [
      { input: '[2,1,5,6,2,3]', expectedOutput: '10' },
      { input: '[2,4]', expectedOutput: '4' },
      { input: '[1]', expectedOutput: '1' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Implement Queue using Stacks',
    slug: 'implement-queue-using-stacks',
    difficulty: 'Easy',
    category: 'Queue',
    description: 'Implement a first in first out (FIFO) queue using only two stacks. The implemented queue should support push, pop, peek, and empty in amortized O(1) time.',
    examples: [
      { input: '["MyQueue","push","push","peek","pop","empty"]\n[[],[1],[2],[],[],[]]', output: '[null,null,null,1,1,false]', explanation: 'Queue FIFO ordering using stacks.' }
    ],
    constraints: ['1 <= x <= 9', 'At most 100 calls will be made to push, pop, peek, and empty.'],
    hints: ['Maintain two stacks: inStack and outStack.', 'Push always to inStack; for pop/peek, if outStack is empty, pour all elements from inStack to outStack.'],
    starterCode: {
      javascript: 'class MyQueue {\n  constructor() {\n    this.inStack = [];\n    this.outStack = [];\n  }\n  push(x) {\n    this.inStack.push(x);\n  }\n  pop() {\n    this.peek();\n    return this.outStack.pop();\n  }\n  peek() {\n    if (!this.outStack.length) {\n      while (this.inStack.length) this.outStack.push(this.inStack.pop());\n    }\n    return this.outStack[this.outStack.length - 1];\n  }\n  empty() {\n    return !this.inStack.length && !this.outStack.length;\n  }\n}',
      python: 'class MyQueue:\n    def __init__(self):\n        self.in_stack = []\n        self.out_stack = []\n    def push(self, x: int) -> None:\n        self.in_stack.append(x)\n    def pop(self) -> int:\n        self.peek()\n        return self.out_stack.pop()\n    def peek(self) -> int:\n        if not self.out_stack:\n            while self.in_stack:\n                self.out_stack.append(self.in_stack.pop())\n        return self.out_stack[-1]\n    def empty(self) -> bool:\n        return not self.in_stack and not self.out_stack',
      java: 'class MyQueue {\n    private java.util.Stack<Integer> in = new java.util.Stack<>();\n    private java.util.Stack<Integer> out = new java.util.Stack<>();\n    public void push(int x) { in.push(x); }\n    public int pop() { peek(); return out.pop(); }\n    public int peek() {\n        if (out.isEmpty()) while (!in.isEmpty()) out.push(in.pop());\n        return out.peek();\n    }\n    public boolean empty() { return in.isEmpty() && out.isEmpty(); }\n}',
      cpp: '#include <stack>\nusing namespace std;\n\nclass MyQueue {\n    stack<int> inSt, outSt;\npublic:\n    void push(int x) { inSt.push(x); }\n    int pop() { int v = peek(); outSt.pop(); return v; }\n    int peek() {\n        if (outSt.empty()) {\n            while (!inSt.empty()) { outSt.push(inSt.top()); inSt.pop(); }\n        }\n        return outSt.top();\n    }\n    bool empty() { return inSt.empty() && outSt.empty(); }\n};'
    },
    testCases: [
      { input: 'push(1), push(2), peek(), pop(), empty()', expectedOutput: '[1, 1, false]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Number of Recent Calls',
    slug: 'number-of-recent-calls',
    difficulty: 'Easy',
    category: 'Queue',
    description: 'You have a RecentCounter class which counts the number of recent requests within a certain time frame [t - 3000, t].',
    examples: [
      { input: '["RecentCounter","ping","ping","ping","ping"]\n[[],[1],[100],[3001],[3002]]', output: '[null,1,2,3,3]', explanation: 'Recent requests within 3000ms.' }
    ],
    constraints: ['1 <= t <= 10^9', 'Each test case will call ping with strictly increasing values of t.', 'At most 10^4 calls will be made to ping.'],
    hints: ['Store incoming ping timestamps in a FIFO queue.', 'Pop timestamps from the front that are strictly less than t - 3000, then return queue.length.'],
    starterCode: {
      javascript: 'class RecentCounter {\n  constructor() {\n    this.queue = [];\n  }\n  ping(t) {\n    this.queue.push(t);\n    while (this.queue[0] < t - 3000) this.queue.shift();\n    return this.queue.length;\n  }\n}',
      python: 'from collections import deque\n\nclass RecentCounter:\n    def __init__(self):\n        self.q = deque()\n    def ping(self, t: int) -> int:\n        self.q.append(t)\n        while self.q[0] < t - 3000:\n            self.q.popleft()\n        return len(self.q)',
      java: 'class RecentCounter {\n    private java.util.Queue<Integer> q = new java.util.LinkedList<>();\n    public int ping(int t) {\n        q.offer(t);\n        while (q.peek() < t - 3000) q.poll();\n        return q.size();\n    }\n}',
      cpp: '#include <queue>\nusing namespace std;\n\nclass RecentCounter {\n    queue<int> q;\npublic:\n    int ping(int t) {\n        q.push(t);\n        while (q.front() < t - 3000) q.pop();\n        return q.size();\n    }\n};'
    },
    testCases: [
      { input: 'ping(1), ping(100), ping(3001), ping(3002)', expectedOutput: '[1, 2, 3, 3]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Design Circular Queue',
    slug: 'design-circular-queue',
    difficulty: 'Medium',
    category: 'Queue',
    description: 'Design your implementation of the circular queue. A circular queue is a linear data structure based on FIFO principle and the last position is connected back to the first position to make a circle.',
    examples: [
      { input: '["MyCircularQueue","enQueue","enQueue","enQueue","enQueue","Rear","isFull","deQueue","enQueue","Rear"]\n[[3],[1],[2],[3],[4],[],[],[],[4],[]]', output: '[null,true,true,true,false,3,true,true,true,4]', explanation: 'Circular queue bounded array operations.' }
    ],
    constraints: ['0 <= value <= 1000', '1 <= k <= 1000', 'At most 3000 calls will be made to enQueue, deQueue, Front, Rear, isEmpty, and isFull.'],
    hints: ['Use fixed-size array of size k with head, count pointers.', 'Calculate tail index using (head + count - 1) % k.'],
    starterCode: {
      javascript: 'class MyCircularQueue {\n  constructor(k) {\n    this.k = k;\n    this.arr = new Array(k);\n    this.head = 0;\n    this.count = 0;\n  }\n  enQueue(value) {\n    if (this.isFull()) return false;\n    this.arr[(this.head + this.count) % this.k] = value;\n    this.count++;\n    return true;\n  }\n  deQueue() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.k;\n    this.count--;\n    return true;\n  }\n  Front() {\n    return this.isEmpty() ? -1 : this.arr[this.head];\n  }\n  Rear() {\n    return this.isEmpty() ? -1 : this.arr[(this.head + this.count - 1) % this.k];\n  }\n  isEmpty() { return this.count === 0; }\n  isFull() { return this.count === this.k; }\n}',
      python: 'class MyCircularQueue:\n    def __init__(self, k: int):\n        self.k = k\n        self.arr = [0] * k\n        self.head = self.count = 0\n    def enQueue(self, value: int) -> bool:\n        if self.isFull(): return False\n        self.arr[(self.head + self.count) % self.k] = value\n        self.count += 1\n        return True\n    def deQueue(self) -> bool:\n        if self.isEmpty(): return False\n        self.head = (self.head + 1) % self.k\n        self.count -= 1\n        return True\n    def Front(self) -> int:\n        return -1 if self.isEmpty() else self.arr[self.head]\n    def Rear(self) -> int:\n        return -1 if self.isEmpty() else self.arr[(self.head + self.count - 1) % self.k]\n    def isEmpty(self) -> bool: return self.count == 0\n    def isFull(self) -> bool: return self.count == self.k',
      java: 'class MyCircularQueue {\n    private int[] data;\n    private int head = 0, count = 0, k;\n    public MyCircularQueue(int k) { this.k = k; data = new int[k]; }\n    public boolean enQueue(int value) {\n        if (isFull()) return false;\n        data[(head + count) % k] = value; count++; return true;\n    }\n    public boolean deQueue() {\n        if (isEmpty()) return false;\n        head = (head + 1) % k; count--; return true;\n    }\n    public int Front() { return isEmpty() ? -1 : data[head]; }\n    public int Rear() { return isEmpty() ? -1 : data[(head + count - 1) % k]; }\n    public boolean isEmpty() { return count == 0; }\n    public boolean isFull() { return count == k; }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass MyCircularQueue {\n    vector<int> data;\n    int head = 0, count = 0, k;\npublic:\n    MyCircularQueue(int k) : data(k), k(k) {}\n    bool enQueue(int value) {\n        if (isFull()) return false;\n        data[(head + count) % k] = value; count++; return true;\n    }\n    bool deQueue() {\n        if (isEmpty()) return false;\n        head = (head + 1) % k; count--; return true;\n    }\n    int Front() { return isEmpty() ? -1 : data[head]; }\n    int Rear() { return isEmpty() ? -1 : data[(head + count - 1) % k]; }\n    bool isEmpty() { return count == 0; }\n    bool isFull() { return count == k; }\n};'
    },
    testCases: [
      { input: 'enQueue(1), enQueue(2), enQueue(3), enQueue(4), Rear(), isFull(), deQueue(), enQueue(4), Rear()', expectedOutput: '[true, true, true, false, 3, true, true, true, 4]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Design Circular Deque',
    slug: 'design-circular-deque',
    difficulty: 'Medium',
    category: 'Deque',
    description: 'Design your implementation of the circular double-ended queue (deque). Implement insertFront, insertLast, deleteFront, deleteLast, getFront, getRear, isEmpty, isFull.',
    examples: [
      { input: '["MyCircularDeque","insertLast","insertLast","insertFront","insertFront","getRear","isFull","deleteLast","insertFront","getFront"]\n[[3],[1],[2],[3],[4],[],[],[],[4],[]]', output: '[null,true,true,true,false,2,true,true,true,4]', explanation: 'Circular deque operations.' }
    ],
    constraints: ['1 <= k <= 1000', '0 <= value <= 1000', 'At most 2000 calls will be made to methods.'],
    hints: ['Maintain head pointer and count.', 'insertFront decreases head using (head - 1 + k) % k.'],
    starterCode: {
      javascript: 'class MyCircularDeque {\n  constructor(k) {\n    this.k = k;\n    this.arr = new Array(k);\n    this.head = 0;\n    this.count = 0;\n  }\n  insertFront(value) {\n    if (this.isFull()) return false;\n    this.head = (this.head - 1 + this.k) % this.k;\n    this.arr[this.head] = value;\n    this.count++;\n    return true;\n  }\n  insertLast(value) {\n    if (this.isFull()) return false;\n    this.arr[(this.head + this.count) % this.k] = value;\n    this.count++;\n    return true;\n  }\n  deleteFront() {\n    if (this.isEmpty()) return false;\n    this.head = (this.head + 1) % this.k;\n    this.count--;\n    return true;\n  }\n  deleteLast() {\n    if (this.isEmpty()) return false;\n    this.count--;\n    return true;\n  }\n  getFront() { return this.isEmpty() ? -1 : this.arr[this.head]; }\n  getRear() { return this.isEmpty() ? -1 : this.arr[(this.head + this.count - 1) % this.k]; }\n  isEmpty() { return this.count === 0; }\n  isFull() { return this.count === this.k; }\n}',
      python: 'class MyCircularDeque:\n    def __init__(self, k: int):\n        self.k = k\n        self.arr = [0] * k\n        self.head = self.count = 0\n    def insertFront(self, value: int) -> bool:\n        if self.isFull(): return False\n        self.head = (self.head - 1 + self.k) % self.k\n        self.arr[self.head] = value\n        self.count += 1\n        return True\n    def insertLast(self, value: int) -> bool:\n        if self.isFull(): return False\n        self.arr[(self.head + self.count) % self.k] = value\n        self.count += 1\n        return True\n    def deleteFront(self) -> bool:\n        if self.isEmpty(): return False\n        self.head = (self.head + 1) % self.k\n        self.count -= 1\n        return True\n    def deleteLast(self) -> bool:\n        if self.isEmpty(): return False\n        self.count -= 1\n        return True\n    def getFront(self) -> int: return -1 if self.isEmpty() else self.arr[self.head]\n    def getRear(self) -> int: return -1 if self.isEmpty() else self.arr[(self.head + self.count - 1) % self.k]\n    def isEmpty(self) -> bool: return self.count == 0\n    def isFull(self) -> bool: return self.count == self.k',
      java: 'class MyCircularDeque {\n    private int[] data;\n    private int head = 0, count = 0, k;\n    public MyCircularDeque(int k) { this.k = k; data = new int[k]; }\n    public boolean insertFront(int value) {\n        if (isFull()) return false;\n        head = (head - 1 + k) % k; data[head] = value; count++; return true;\n    }\n    public boolean insertLast(int value) {\n        if (isFull()) return false;\n        data[(head + count) % k] = value; count++; return true;\n    }\n    public boolean deleteFront() {\n        if (isEmpty()) return false;\n        head = (head + 1) % k; count--; return true;\n    }\n    public boolean deleteLast() {\n        if (isEmpty()) return false;\n        count--; return true;\n    }\n    public int getFront() { return isEmpty() ? -1 : data[head]; }\n    public int getRear() { return isEmpty() ? -1 : data[(head + count - 1) % k]; }\n    public boolean isEmpty() { return count == 0; }\n    public boolean isFull() { return count == k; }\n}',
      cpp: '#include <vector>\nusing namespace std;\n\nclass MyCircularDeque {\n    vector<int> data;\n    int head = 0, count = 0, k;\npublic:\n    MyCircularDeque(int k) : data(k), k(k) {}\n    bool insertFront(int value) {\n        if (isFull()) return false;\n        head = (head - 1 + k) % k; data[head] = value; count++; return true;\n    }\n    bool insertLast(int value) {\n        if (isFull()) return false;\n        data[(head + count) % k] = value; count++; return true;\n    }\n    bool deleteFront() {\n        if (isEmpty()) return false;\n        head = (head + 1) % k; count--; return true;\n    }\n    bool deleteLast() {\n        if (isEmpty()) return false;\n        count--; return true;\n    }\n    int getFront() { return isEmpty() ? -1 : data[head]; }\n    int getRear() { return isEmpty() ? -1 : data[(head + count - 1) % k]; }\n    bool isEmpty() { return count == 0; }\n    bool isFull() { return count == k; }\n};'
    },
    testCases: [
      { input: 'insertLast(1), insertLast(2), insertFront(3), insertFront(4), getRear(), isFull(), deleteLast(), insertFront(4), getFront()', expectedOutput: '[true, true, true, false, 2, true, true, true, 4]' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Shortest Subarray with Sum at Least K',
    slug: 'shortest-subarray-with-sum-at-least-k',
    difficulty: 'Hard',
    category: 'Deque',
    description: 'Given an integer array nums and an integer k, return the length of the shortest non-empty subarray of nums with a sum of at least k. If there is no such subarray, return -1.',
    examples: [
      { input: 'nums = [1], k = 1', output: '1', explanation: 'Subarray [1] has sum 1 >= 1.' },
      { input: 'nums = [1,2], k = 4', output: '-1', explanation: 'Sum of whole array is 3 < 4.' },
      { input: 'nums = [2,-1,2], k = 3', output: '3', explanation: 'Subarray [2,-1,2] has sum 3.' }
    ],
    constraints: ['1 <= nums.length <= 10^5', '-10^5 <= nums[i] <= 10^5', '1 <= k <= 10^9'],
    hints: ['Compute prefix sums P where P[i] is sum of first i elements.', 'Maintain a monotonic increasing deque of indices of prefix sums.'],
    starterCode: {
      javascript: 'function shortestSubarray(nums, k) {\n  const n = nums.length;\n  const P = new Array(n + 1).fill(0);\n  for (let i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];\n  let minLen = Infinity;\n  const deque = [];\n  for (let y = 0; y <= n; y++) {\n    while (deque.length && P[y] <= P[deque[deque.length - 1]]) deque.pop();\n    while (deque.length && P[y] - P[deque[0]] >= k) {\n      minLen = Math.min(minLen, y - deque.shift());\n    }\n    deque.push(y);\n  }\n  return minLen <= n ? minLen : -1;\n}',
      python: 'from collections import deque\n\ndef shortestSubarray(nums: list[int], k: int) -> int:\n    n = len(nums)\n    P = [0] * (n + 1)\n    for i, x in enumerate(nums): P[i + 1] = P[i] + x\n    min_len = float("inf")\n    q = deque()\n    for y, py in enumerate(P):\n        while q and py <= P[q[-1]]: q.pop()\n        while q and py - P[q[0]] >= k:\n            min_len = min(min_len, y - q.popleft())\n        q.append(y)\n    return min_len if min_len <= n else -1',
      java: 'class Solution {\n    public int shortestSubarray(int[] nums, int k) {\n        int n = nums.length;\n        long[] P = new long[n + 1];\n        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];\n        int minLen = n + 1;\n        java.util.Deque<Integer> dq = new java.util.ArrayDeque<>();\n        for (int y = 0; y <= n; y++) {\n            while (!dq.isEmpty() && P[y] <= P[dq.peekLast()]) dq.pollLast();\n            while (!dq.isEmpty() && P[y] - P[dq.peekFirst()] >= k) {\n                minLen = Math.min(minLen, y - dq.pollFirst());\n            }\n            dq.offerLast(y);\n        }\n        return minLen <= n ? minLen : -1;\n    }\n}',
      cpp: '#include <vector>\n#include <deque>\n#include <algorithm>\nusing namespace std;\n\nclass Solution {\npublic:\n    int shortestSubarray(vector<int>& nums, int k) {\n        int n = nums.size();\n        vector<long long> P(n + 1, 0);\n        for (int i = 0; i < n; i++) P[i + 1] = P[i] + nums[i];\n        int minLen = n + 1;\n        deque<int> dq;\n        for (int y = 0; y <= n; y++) {\n            while (!dq.empty() && P[y] <= P[dq.back()]) dq.pop_back();\n            while (!dq.empty() && P[y] - P[dq.front()] >= k) {\n                minLen = min(minLen, y - dq.front());\n                dq.pop_front();\n            }\n            dq.push_back(y);\n        }\n        return minLen <= n ? minLen : -1;\n    }\n};'
    },
    testCases: [
      { input: '[1], 1', expectedOutput: '1' },
      { input: '[1,2], 4', expectedOutput: '-1' },
      { input: '[2,-1,2], 3', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  },
  {
    title: 'Fibonacci Number',
    slug: 'fibonacci-number',
    difficulty: 'Easy',
    category: 'Recursion',
    description: 'The Fibonacci numbers, commonly denoted F(n) form a sequence, called the Fibonacci sequence, such that each number is the sum of the two preceding ones, starting from 0 and 1. Given n, calculate F(n).',
    examples: [
      { input: 'n = 2', output: '1', explanation: 'F(2) = F(1) + F(0) = 1 + 0 = 1.' },
      { input: 'n = 3', output: '2', explanation: 'F(3) = F(2) + F(1) = 1 + 1 = 2.' },
      { input: 'n = 4', output: '3', explanation: 'F(4) = F(3) + F(2) = 2 + 1 = 3.' }
    ],
    constraints: ['0 <= n <= 30'],
    hints: ['Use iteration or memoization to calculate F(n) in O(n) time and O(1) space.', 'Maintain two variables a = 0 and b = 1.'],
    starterCode: {
      javascript: 'function fib(n) {\n  if (n < 2) return n;\n  let a = 0, b = 1;\n  for (let i = 2; i <= n; i++) {\n    const c = a + b;\n    a = b;\n    b = c;\n  }\n  return b;\n}',
      python: 'def fib(n: int) -> int:\n    if n < 2: return n\n    a, b = 0, 1\n    for _ in range(2, n + 1):\n        a, b = b, a + b\n    return b',
      java: 'class Solution {\n    public int fib(int n) {\n        if (n < 2) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n}',
      cpp: 'class Solution {\npublic:\n    int fib(int n) {\n        if (n < 2) return n;\n        int a = 0, b = 1;\n        for (int i = 2; i <= n; i++) {\n            int c = a + b;\n            a = b; b = c;\n        }\n        return b;\n    }\n};'
    },
    testCases: [
      { input: '2', expectedOutput: '1' },
      { input: '3', expectedOutput: '2' },
      { input: '4', expectedOutput: '3' }
    ],
    relatedSkillName: 'Data Structures & Algorithms (DSA)'
  }
];
