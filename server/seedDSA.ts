import prisma from './src/lib/prisma';
import { DSA_PROBLEMS_CATALOG } from './src/data/dsaCatalog';

async function seedCatalog() {
  const readyProblems = DSA_PROBLEMS_CATALOG.filter(p => p.contentReady === true);
  console.log(`Starting seeding of ${readyProblems.length} verified DSA problems (prisma/seed.ts is primary source of truth)...`);
  let count = 0;
  for (const prob of readyProblems) {
    await prisma.codingProblem.upsert({
      where: { slug: prob.slug },
      update: {
        title: prob.title,
        difficulty: prob.difficulty,
        category: prob.category,
        description: prob.description,
        examples: prob.examples,
        constraints: prob.constraints,
        hints: prob.hints,
        starterCode: prob.starterCode,
        testCases: prob.testCases,
        relatedSkillName: prob.relatedSkillName
      },
      create: {
        title: prob.title,
        slug: prob.slug,
        difficulty: prob.difficulty,
        category: prob.category,
        description: prob.description,
        examples: prob.examples,
        constraints: prob.constraints,
        hints: prob.hints,
        starterCode: prob.starterCode,
        testCases: prob.testCases,
        relatedSkillName: prob.relatedSkillName
      }
    });
    count++;
  }
  console.log(`Successfully seeded ${count} verified DSA problems into the database!`);
  await prisma.$disconnect();
}

seedCatalog().catch(e => {
  console.error('Failed to seed DSA problems:', e);
  process.exit(1);
});
