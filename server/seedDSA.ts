import prisma from './src/lib/prisma';
import { DSA_PROBLEMS_CATALOG } from './src/data/dsaCatalog';

async function seedCatalog() {
  console.log(`Starting seeding of ${DSA_PROBLEMS_CATALOG.length} DSA problems...`);
  let count = 0;
  for (const prob of DSA_PROBLEMS_CATALOG) {
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
  console.log(`Successfully seeded ${count} DSA problems into the database!`);
  await prisma.$disconnect();
}

seedCatalog().catch(e => {
  console.error('Failed to seed DSA problems:', e);
  process.exit(1);
});
