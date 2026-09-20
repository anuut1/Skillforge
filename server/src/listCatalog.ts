import { DSA_PROBLEMS_CATALOG } from './data/dsaCatalog';

console.log(`Total problems in catalog: ${DSA_PROBLEMS_CATALOG.length}`);
DSA_PROBLEMS_CATALOG.forEach((p, idx) => {
  console.log(`${idx + 1}. [${p.slug}] "${p.title}" | ${p.category} | ${p.difficulty} | contentReady=${p.contentReady}`);
});
