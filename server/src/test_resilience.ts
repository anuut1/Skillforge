import assert from 'assert';
import { resumeAnalysisService } from './services/aiServices';

console.log('--- RUNNING SKILLFORGE RESILIENCE & AI VALIDATION SUITE ---');

const sampleResume = `
  Jane Doe
  jane.doe@example.com | github.com/janedoe
  
  SKILLS:
  Java, Python, SQL, REST APIs, Git, Data Structures
  
  EXPERIENCE:
  Software Intern - TechCorp
  - Built 5+ RESTful API endpoints in Java and Spring Boot.
  - Optimized relational SQL queries and reduced response latency by 25%.
`;

const sampleJD = `
  Seeking a Software Engineer with proficiency in Java, SQL, and Git.
  Preferred: AWS, Docker, and Microservices architecture.
`;

const analysis1 = resumeAnalysisService.analyze(sampleResume, 'Software Engineer', sampleJD);
console.log('Analysis 1 Scores:', {
  atsScore: analysis1.atsScore,
  skillsMatchScore: analysis1.skillsMatchScore,
  matchingCount: analysis1.matchingSkills.length
});

assert(analysis1.atsScore >= 0 && analysis1.atsScore <= 100, 'ATS score should be 0-100');
assert(analysis1.skillsMatchScore >= 35, 'Skills match score should be within valid bounds');
assert(analysis1.matchingSkills.length > 0, 'Matching skills should be detected');
assert(analysis1.fixerSuggestions.length > 0, 'Fixer suggestions should be populated');
console.log('✔ Test 1 Passed: Resume vs JD Analysis and Scoring');

const analysis2 = resumeAnalysisService.analyze('', 'Software Engineer');
assert(analysis2 !== undefined, 'Fallback object should be created');
assert(analysis2.atsScore !== undefined, 'Fallback ATS score should exist');
console.log('✔ Test 2 Passed: Graceful fallback on empty resume');

assert(typeof analysis1.fixerSuggestions[0].before === 'string', 'Fixer before must be string');
assert(typeof analysis1.fixerSuggestions[0].after === 'string', 'Fixer after must be string');
console.log('✔ Test 3 Passed: Fixer suggestion data structure integrity');

console.log('--- ALL 3 VALIDATION TESTS PASSED SUCCESSFULLY ---');
