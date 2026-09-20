export interface DSAProblemFull {
  title: string;
  slug: string;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  category: string;
  description: string;
  examples: { input: string; output: string; explanation?: string }[];
  constraints: string[];
  hints: string[];
  starterCode?: {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
  };
  referenceSolution?: {
    javascript?: string;
    python?: string;
    java?: string;
    cpp?: string;
  };
  testCases: { input: string; expectedOutput: string }[];
  relatedSkillName: string;
}
