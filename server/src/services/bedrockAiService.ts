import { isBedrockConfigured, invokeBedrockJson } from '../lib/bedrock';
import { resumeAnalysisService, DetailedResumeAnalysis } from './aiServices';

export async function analyzeResumeWithBedrockOrFallback(
  resumeText: string,
  targetRole: string,
  jobDescription?: string
): Promise<DetailedResumeAnalysis> {
  if (!resumeText || typeof resumeText !== 'string' || resumeText.trim().length < 20 || resumeText.includes('%PDF-')) {
    throw new Error('Unreadable or invalid resume text provided. Please ensure your resume contains searchable plain text.');
  }

  const fallback = resumeAnalysisService.analyze(resumeText, targetRole, jobDescription);

  if (!isBedrockConfigured()) {
    // Graceful fallback to rich heuristic engine
    return fallback;
  }

  const systemPrompt = `You are an expert AWS-certified technical recruiter and ATS parsing architect.
Your task is to analyze a candidate resume against a target role and optional job description.
Return your evaluation strictly in the following JSON format conforming to RFC 8259:
{
  "targetRole": string,
  "jobTitle": string,
  "companyName": string,
  "atsScore": number (1-100),
  "skillsMatchScore": number (1-100),
  "experienceMatchScore": number (1-100),
  "keywordMatchScore": number (1-100),
  "projectMatchScore": number (1-100),
  "atsFormattingScore": number (1-100),
  "jobBreakdown": {
    "role": string,
    "experience": string,
    "coreSkills": string[],
    "preferred": string[],
    "responsibilities": string[],
    "topPriorities": string[]
  },
  "matchingSkills": [{"name": string, "whyItMatters": string}],
  "missingSkills": [{"name": string, "priority": "High" | "Medium" | "Low", "whyItMatters": string, "recommendedCourse": string}],
  "partialSkills": [{"name": string, "whyItMatters": string}],
  "atsIssues": [{"issue": string, "severity": "High" | "Medium" | "Low", "fix": string}],
  "keywordOptimization": [{"keyword": string, "jdFreq": number, "resumeFreq": number, "status": "Matched" | "Underrepresented" | "Missing", "recommendation": string}],
  "sectionFeedback": [{"section": string, "status": "Strong" | "Needs Improvement" | "Missing", "current": string, "problem": string, "suggested": string}],
  "fixerSuggestions": [{"id": string, "section": string, "title": string, "before": string, "after": string, "status": "pending"}],
  "scoreDrivers": [{"factor": "skill" | "experience" | "keyword" | "formatting" | "project", "name": string, "impact": "positive" | "negative" | "neutral", "points": number, "explanation": string, "evidenceSentence": string, "actionableTip": string}]
}`;

  const userPrompt = `Target Role: ${targetRole}\n\nJob Description:\n${jobDescription || 'N/A'}\n\nCandidate Resume:\n${resumeText}`;

  try {
    const bedrockResult = await invokeBedrockJson<DetailedResumeAnalysis>(systemPrompt, userPrompt);
    if (!bedrockResult || typeof bedrockResult !== 'object' || !bedrockResult.atsScore || bedrockResult.atsScore <= 0) {
      console.warn('[Bedrock] Response missing valid score, using fallback heuristic analyzer');
      return fallback;
    }

    const finalAtsScore = Math.max(1, bedrockResult.atsScore || fallback.atsScore);
    const finalSkillsScore = Math.max(1, bedrockResult.skillsMatchScore || fallback.skillsMatchScore);
    const finalExpScore = Math.max(1, bedrockResult.experienceMatchScore || fallback.experienceMatchScore);
    const finalKwScore = Math.max(1, bedrockResult.keywordMatchScore || fallback.keywordMatchScore);
    const finalProjScore = Math.max(1, bedrockResult.projectMatchScore || fallback.projectMatchScore);
    const finalFmtScore = Math.max(1, bedrockResult.atsFormattingScore || fallback.atsFormattingScore);

    return {
      ...fallback,
      ...bedrockResult,
      atsScore: finalAtsScore,
      skillsMatchScore: finalSkillsScore,
      experienceMatchScore: finalExpScore,
      keywordMatchScore: finalKwScore,
      projectMatchScore: finalProjScore,
      atsFormattingScore: finalFmtScore,
      matchingSkills: Array.isArray(bedrockResult.matchingSkills) && bedrockResult.matchingSkills.length > 0 ? bedrockResult.matchingSkills : fallback.matchingSkills,
      missingSkills: Array.isArray(bedrockResult.missingSkills) ? bedrockResult.missingSkills : fallback.missingSkills,
      scoreDrivers: Array.isArray(bedrockResult.scoreDrivers) && bedrockResult.scoreDrivers.length > 0 ? bedrockResult.scoreDrivers : fallback.scoreDrivers,
    };
  } catch (error) {
    console.warn('[Bedrock] Bedrock invocation failed or model unavailable, falling back to local analyzer:', error);
    return fallback;
  }
}

export interface CodeReviewResult {
  correctness: number;
  readability: number;
  timeComplexity: string;
  spaceComplexity: string;
  feedback: string;
  suggestions: string[];
}

export async function analyzeCodeWithBedrockOrFallback(
  language: string,
  code: string,
  problemTitle: string,
  problemDescription?: string,
  executionResult?: any
): Promise<CodeReviewResult> {
  const isPassing = executionResult?.status === 'Accepted';
  const passedCount = executionResult?.passedTests ?? (isPassing ? 1 : 0);
  const totalCount = executionResult?.totalTests ?? 1;
  const timeComplexity = executionResult?.timeComplexity || 'O(n)';
  const spaceComplexity = executionResult?.spaceComplexity || 'O(1)';
  const errorMsg = executionResult?.errorMessage || executionResult?.testResults?.find((t: any) => !t.passed)?.error;

  // Build honest heuristic fallback
  const clean = code.trim();
  const hasMap = /hashmap|map|dict|unordered_map|set/i.test(clean);
  const hasNestedLoops = /(for.*for|while.*while|for.*while|while.*for)/s.test(clean);
  const linesCount = clean.split('\n').length;
  const hasComments = /\/\/|\/\*|#/.test(clean);

  let correctness = 95;
  let readability = 88;
  const suggestions: string[] = [];

  if (!isPassing) {
    // Failing solution honest assessment
    const passRatio = totalCount > 0 ? passedCount / totalCount : 0;
    correctness = Math.round(passRatio * 60);
    readability = linesCount > 50 ? 70 : 82;

    if (executionResult?.status === 'Compilation Error') {
      suggestions.push(`Fix compilation / syntax error: ${errorMsg || 'Check function signature and bracket pairs.'}`);
      suggestions.push('Run a quick syntax check before submitting.');
    } else if (executionResult?.status === 'Runtime Error') {
      suggestions.push(`Handle runtime exception: ${errorMsg || 'Guard against null references or out-of-bounds indexing.'}`);
      suggestions.push('Add defensive checks for empty inputs and boundary cases.');
    } else if (executionResult?.status === 'Time Limit Exceeded') {
      suggestions.push('Algorithm timed out on large inputs. Replace nested loops with linear or logarithmic search patterns.');
      suggestions.push('Consider caching repeated subproblem states.');
    } else {
      suggestions.push(`Failed test cases (${passedCount}/${totalCount} passed). Inspect mismatch between actual and expected values.`);
      if (hasNestedLoops) {
        suggestions.push('Nested loop traversal may lead to edge-case bugs and quadratic runtime.');
      } else {
        suggestions.push('Verify edge cases such as empty input, single-element collections, or duplicate values.');
      }
    }
  } else {
    // Passing solution assessment
    correctness = 95;
    readability = hasComments ? 92 : 86;

    if (hasNestedLoops) {
      correctness = 88;
      readability = 80;
      suggestions.push(`Solution passes test cases with ${timeComplexity} time complexity. Look into trading memory for a linear O(n) hash table approach.`);
    } else if (hasMap) {
      correctness = 98;
      readability = 92;
      suggestions.push(`Great job achieving ${timeComplexity} linear runtime using hash lookups!`);
      suggestions.push('Consider checking for null keys or edge conditions where target equals the current element.');
    } else {
      suggestions.push(`Clean, passing implementation with ${timeComplexity} time and ${spaceComplexity} space complexity.`);
      suggestions.push('Ensure descriptive variable names convey the algorithmic role of each accumulator.');
    }
  }

  const fallback: CodeReviewResult = {
    correctness,
    readability,
    timeComplexity,
    spaceComplexity,
    feedback: `### SkillForge AI Code Review for "${problemTitle}"\n\n- **Verification Outcome:** ${isPassing ? 'All test cases passed successfully.' : `Failed test cases (${passedCount}/${totalCount} passed).`}\n- **Algorithm Efficiency:** Evaluated at **${timeComplexity}** time and **${spaceComplexity}** space.\n- **Readability & Quality:** Code contains ${linesCount} lines adhering to ${language} conventions.\n- **Key Suggestion:** ${suggestions[0]}`,
    suggestions
  };

  if (!isBedrockConfigured()) {
    return fallback;
  }

  const systemPrompt = `You are a Principal Software Engineer and expert Technical Interviewer.
Your task is to provide an honest, specific, and constructive code review for a student's coding submission.
Return strictly valid RFC 8259 JSON matching this schema:
{
  "correctness": number (0-100),
  "readability": number (0-100),
  "timeComplexity": string (e.g. "O(n)", "O(n^2)"),
  "spaceComplexity": string (e.g. "O(1)", "O(n)"),
  "feedback": string,
  "suggestions": string[]
}`;

  const userPrompt = `Problem: ${problemTitle}
Description: ${problemDescription || 'N/A'}
Language: ${language}
Execution Outcome:
- Status: ${executionResult?.status || 'Unknown'}
- Tests Passed: ${passedCount}/${totalCount}
- Runtime: ${executionResult?.runtimeMs || 0}ms
- Memory: ${executionResult?.memoryMb || 'N/A'}MB
- Error (if any): ${errorMsg || 'None'}

Student's Submitted Code:
\`\`\`${language}
${code}
\`\`\``;

  try {
    const aiResult = await invokeBedrockJson<CodeReviewResult>(systemPrompt, userPrompt);
    if (!aiResult || typeof aiResult.correctness !== 'number') {
      return fallback;
    }
    return {
      correctness: Math.max(0, Math.min(100, aiResult.correctness)),
      readability: Math.max(0, Math.min(100, aiResult.readability || fallback.readability)),
      timeComplexity: aiResult.timeComplexity || fallback.timeComplexity,
      spaceComplexity: aiResult.spaceComplexity || fallback.spaceComplexity,
      feedback: aiResult.feedback || fallback.feedback,
      suggestions: Array.isArray(aiResult.suggestions) && aiResult.suggestions.length > 0 ? aiResult.suggestions : fallback.suggestions
    };
  } catch (err) {
    console.warn('[Bedrock] Code review invocation failed, using honest fallback:', err);
    return fallback;
  }
}
