import { isBedrockConfigured, invokeBedrockJson } from '../lib/bedrock';
import { resumeAnalysisService, DetailedResumeAnalysis } from './aiServices';

export async function analyzeResumeWithBedrockOrFallback(
  resumeText: string,
  targetRole: string,
  jobDescription?: string
): Promise<DetailedResumeAnalysis> {
  if (!isBedrockConfigured()) {
    // Graceful fallback to rich heuristic engine
    return resumeAnalysisService.analyze(resumeText, targetRole, jobDescription);
  }

  const systemPrompt = `You are an expert AWS-certified technical recruiter and ATS parsing architect.
Your task is to analyze a candidate resume against a target role and optional job description.
Return your evaluation strictly in the following JSON format conforming to RFC 8259:
{
  "targetRole": string,
  "jobTitle": string,
  "companyName": string,
  "atsScore": number (0-100),
  "skillsMatchScore": number (0-100),
  "experienceMatchScore": number (0-100),
  "keywordMatchScore": number (0-100),
  "projectMatchScore": number (0-100),
  "atsFormattingScore": number (0-100),
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
  "fixerSuggestions": [{"id": string, "section": string, "title": string, "before": string, "after": string, "status": "pending"}]
}`;

  const userPrompt = `Target Role: ${targetRole}\n\nJob Description:\n${jobDescription || 'N/A'}\n\nCandidate Resume:\n${resumeText}`;

  try {
    const bedrockResult = await invokeBedrockJson<DetailedResumeAnalysis>(systemPrompt, userPrompt);
    return bedrockResult;
  } catch (error) {
    console.warn('[Bedrock] Bedrock invocation failed or model unavailable, falling back to local analyzer:', error);
    return resumeAnalysisService.analyze(resumeText, targetRole, jobDescription);
  }
}
