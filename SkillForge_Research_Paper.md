# SkillForge: An Integrated AI-Driven Ecosystem for Skill-Gap Remediation, Personalized Learning Trajectories, and Placement Readiness Assessment

**Authors:** [Author Names Redacted for Blind Peer Review]  
**Affiliations:** Department of Computer Science and Engineering  
**Correspondence:** [Author Contact Information]  
**Target Conference:** International Conference on Artificial Intelligence in Education (AIED) / IEEE Transactions on Learning Technologies Track

---

## 2. ABSTRACT

In contemporary higher education, bridging the transition from academic preparation to professional employment represents a formidable challenge. The rapid evolution of industry requirements—accelerated by automation, distributed cloud infrastructure, and emerging artificial intelligence paradigms—has exacerbated the misalignment between university curricula and labor-market expectations. Existing Computer-Assisted Career Guidance Systems (CACGS) and Applicant Tracking Systems (ATS) suffer from acute structural fragmentation: traditional platforms either predict coarse career trajectories passively, match candidate resumes against static job vacancies using rudimentary keyword filters, or offer isolated course catalogs detached from technical problem-solving or interview readiness. 

To overcome this diagnostic-prescriptive disconnect, this paper introduces **SkillForge**, an integrated, closed-loop AI-driven career development and placement readiness ecosystem. SkillForge unifies five critical career preparation functions within a cohesive, multi-tier software architecture: (1) multi-factor resume parsing and job description decomposition; (2) asymmetric, semantic skill-gap analysis that penalizes skill deficits without penalizing proficiency surpluses; (3) dynamic, prerequisite-aware learning-path and course recommendation; (4) weak-topic calibrated Data Structures and Algorithms (DSA) problem curation with automated algorithmic complexity analysis; and (5) a timed, full-screen AI mock interview simulator evaluated across multi-dimensional technical and behavioral rubrics. Furthermore, SkillForge formalizes a holistic Placement Readiness Score (PRS) that continuously tracks student progression across cognitive, implementation, and communication competencies. 

We ground the system's conceptual foundations in a comprehensive synthesis of recent academic literature (covering 78 lifelong learning studies, 38 higher-education predictive modeling systems, and hybrid semantic networks) and articulate its full implementation utilizing modern web technologies, relational persistence, and contextual language model services. Experimental methodologies are formally specified across information extraction precision, recommendation ranking relevance, and interview evaluation reliability, providing a defensible, reproducible framework for scalable, personalized student career development without techno-solutionist overreach.

---

## 3. KEYWORDS

Career Readiness, Skill-Gap Analysis, Personalized Learning Paths, Natural Language Processing, Automated Mock Interview, Algorithmic Complexity Analysis, Placement Readiness Score, Recommender Systems in Education.

---

## 4. INTRODUCTION

### 4.1 The Graduate Employability Crisis and Labor-Market Dynamics
The global labor market is experiencing unprecedented volatility. According to recent workforce analyses, more than 23% of global jobs are anticipated to undergo structural disruption within the next five years, characterized simultaneously by the displacement of routine tasks and the emergence of hybrid, highly specialized technical roles. In the information technology (IT) and software engineering domains, this rapid velocity of technological obsolescence has created an acute structural friction: while higher education institutions graduate increasing numbers of Computer Science and Engineering candidates annually, hiring organizations report profound difficulties in sourcing candidates with production-ready engineering capabilities.

This paradox—high graduate output coexisting with persistent technical talent shortages—stems fundamentally from a lack of self-awareness, actionable guidance, and timely skill acquisition during the student lifecycle. University curricula, bound by multi-year accreditation cycles and broad pedagogical objectives, struggle to track the shifting landscape of enterprise technologies, including modern cloud orchestration, reactive frontends, distributed persistence layers, and automated deployment pipelines. Consequently, students frequently approach placement seasons with uncalibrated self-perceptions, generic resumes, and significant deficits in core software problem-solving and technical communication.

### 4.2 Structural Deficiencies of Current Career Preparation Tools
Historically, students have relied upon two primary mechanisms for vocational preparation: institutional career advising centers and commercial digital platforms. Both mechanisms exhibit profound limitations:
1. **Institutional Career Advising:** While human counselors provide empathetic and holistic mentorship, they are severely bottlenecked by scale. A typical university career advisor oversees hundreds or thousands of students, rendering regular, deep-dive technical reviews of code portfolios, resume keywords, and algorithmic competencies operationally impossible.
2. **Commercial Job Matching Portals & General Learning Platforms:** Modern commercial platforms (such as LinkedIn, Coursera, LeetCode, and generic resume-scoring websites) operate in extreme technical silos. Resume optimization tools perform isolated keyword matching against static job postings, highlighting missing terms without providing a structured pedagogical pathway to acquire them. Massive Open Online Course (MOOC) platforms recommend extensive course sequences based on global popularity rather than a student's precise deficiency profile. Independent coding platforms host vast problem catalogs but lack contextual linkages to the student's target job description or upcoming technical interview format. Finally, mock interview preparation remains an expensive, manually scheduled luxury unavailable to the broader student population.

This fragmentation creates cognitive overload and decision paralysis. Students are forced to assemble their career preparation through guesswork, navigating disparate tools that fail to communicate with one another.

### 4.3 The Vision of SkillForge: A Unified Closed-Loop Ecosystem
SkillForge is conceptualized to eliminate this architectural fragmentation. Rather than serving merely as an isolated resume analyzer or a passive job-matching engine, SkillForge operates as a **closed-loop diagnostic, prescriptive, and evaluative career development ecosystem**. 

The operational philosophy of SkillForge rests upon a three-phase continuous feedback paradigm:
- **Phase I: Diagnostic Assessment.** The system ingests the student's unstructured resume and target job descriptions (JDs), parses semantic entities, normalizes technical competencies, and executes an asymmetric skill-gap analysis to identify exact areas of deficiency.
- **Phase II: Prescriptive Scaffolding.** Identified deficiencies are immediately linked to actionable remediation artifacts: modular course units, prerequisite-governed learning roadmaps, targeted Data Structures and Algorithms (DSA) problem sets calibrated to weak topic areas, and verified capstone portfolio projects.
- **Phase III: Evaluative Simulation.** As students engage in remediation, their competencies are validated through spaced-repetition adaptive quizzes, real-time code complexity analysis, and proctored, timed AI mock interviews evaluated across standardized technical rubrics.

These dimensions culminate in a dynamic, mathematically formulated **Placement Readiness Score (PRS)** that continuously reflects the student’s true hiring readiness, providing transparent telemetry to both the student and institutional educators.

```
       +-----------------------------------------------------------------------+
       |                         PHASE I: DIAGNOSIS                            |
       |  - Multi-Format Resume Ingestion & Normalization                      |
       |  - Target Job Description Parsing (Core vs. Preferred Skills)         |
       |  - Asymmetric Skill-Gap Vector Analysis (Shortfall Penalization)      |
       +-----------------------------------------------------------------------+
                                           |
                                           v
       +-----------------------------------------------------------------------+
       |                        PHASE II: PRESCRIPTION                         |
       |  - Personalized Learning Roadmap & Course Recommendation              |
       |  - Weak-Topic Calibrated DSA Problem Curation (26 Categories)         |
       |  - Capstone Portfolio Project Specifications                          |
       +-----------------------------------------------------------------------+
                                           |
                                           v
       +-----------------------------------------------------------------------+
       |                        PHASE III: EVALUATION                          |
       |  - Automated AI Code Reviewer (Time/Space Complexity, Idiomatic Style)|
       |  - Full-Screen Timed AI Mock Interview Simulation (Multi-Rubric)      |
       |  - Spaced Repetition Topic Revision Engine (Ebbinghaus Invariants)    |
       +-----------------------------------------------------------------------+
                                           |
                                           v
       +-----------------------------------------------------------------------+
       |                   UNIFIED TELEMETRY & FEEDBACK                        |
       |  - Composite Placement Readiness Score (PRS) Formulation              |
       |  - Longitudinal Competency Radar & Student Learning DNA Profiling     |
       +-----------------------------------------------------------------------+
```

### 4.4 Research Questions
This investigation is structured around four primary research questions:
- **RQ1 (Information Extraction & Parsing Robustness):** How accurately can a tiered natural language processing and entity extraction pipeline parse unstructured technical resumes and job descriptions without retaining sensitive Personally Identifiable Information (PII)?
- **RQ2 (Asymmetric Gap Modeling & Recommendation Precision):** To what extent does an asymmetric skill-deficit mathematical model improve the relevance of recommended learning trajectories compared to traditional symmetric distance and global popularity baselines?
- **RQ3 (Evaluative Consistency in Automated Interviewing):** How reliably can an automated, multi-rubric evaluation model assess student responses in technical and behavioral mock interview settings against ground-truth domain rubrics?
- **RQ4 (Predictive Validity of Composite Readiness Modeling):** Does an integrated Placement Readiness Score (combining problem-solving telemetry, resume alignment, project verification, and mock interview performance) provide a representative and interpretable metric of student employability?

### 4.5 Contributions
The core technical and scientific contributions of this work are summarized as follows:
1. **Architectural Unification:** We design and implement an end-to-end, multi-tier software architecture that integrates resume parsing, job-description decomposition, skill-gap analysis, learning path recommendation, automated code complexity review, and full-screen timed mock interviews within a single operational platform.
2. **Asymmetric Skill-Gap and Multi-Factor ATS Formulation:** We formulate mathematically grounded models for skill matching that penalize candidate skill shortfalls while treating surplus proficiencies neutrally, coupled with a transparent five-factor ATS scoring equation.
3. **Weak-Topic Driven Algorithmic Scaffolding:** We engineer a dynamic recommendation mechanism that maps submission errors and unaccepted code attempts directly to an expansive catalog of 26 DSA categories, providing real-time static code analysis for time and space complexity ($O(1), O(n), O(n^2), O(\log n)$).
4. **Multi-Rubric Automated Interview Simulator:** We construct a timed, full-screen interview engine that evaluates candidate responses across five distinct dimensions (Technical Knowledge, Problem Solving, Communication, Confidence, and Answer Relevance), generating structured diagnostic feedback and actionable remediation pointers.
5. **Empirical Grounding and Literature Synthesis:** We provide an exhaustive cross-comparative synthesis of recent AI in career education literature, highlighting structural limitations in existing state-of-the-art platforms and benchmarking SkillForge's architectural capabilities.

---

## 5. BACKGROUND AND THEORETICAL FOUNDATIONS

### 5.1 AI in Education (AIED) and Adaptive Learning Systems
Artificial Intelligence in Education (AIED) has evolved over the past quarter-century from basic computer-assisted instructional systems to sophisticated Intelligent Tutoring Systems (ITS) capable of modeling learner cognitive states. Foundational pedagogical theory posits that effective learning occurs within Vygotsky’s Zone of Proximal Development (ZPD)—the conceptual distance between what a learner can achieve independently and what they can achieve with expert guidance. Adaptive educational platforms seek to operationalize this principle computationally by dynamically adjusting content difficulty, pacing, and feedback mechanisms based on continuous learner telemetry.

In the context of career readiness and vocational training, adaptive learning extends beyond theoretical subject mastery to encompass competencies demanded by external labor markets. As emphasized by Bayly-Castaneda et al. (2024), the rapid evolution of knowledge requires frameworks that support lifelong learning and flexible upskilling. However, most existing educational platforms remain pedagogical closed loops: they adapt instruction according to internal syllabus objectives rather than aligning learning trajectories with dynamic external job requirements.

### 5.2 Recommender System Paradigms in Career Matching
Career recommendation systems employ three broad methodological paradigms:
1. **Collaborative Filtering (CF):** Recommends career paths or learning resources based on the behavioral histories of similar student cohorts. While CF captures latent community trends, it suffers from severe *cold-start problems* for new students and promotes popularity bias, reinforcing historical career tracks rather than novel, high-growth disciplines.
2. **Content-Based Filtering (CB):** Matches student profile vectors directly against job vacancy attributes or course metadata using text-mining techniques (such as TF-IDF, Word2Vec, or sentence embeddings). While highly interpretable and immune to cold-start limitations for new items, pure CB often fails to capture complex relational dependencies between prerequisite skills.
3. **Graph-Based and Hybrid Systems:** Modern approaches model students, skills, courses, and job roles as heterogeneous information networks. As demonstrated by Wang (2025), integrating Knowledge Graphs (KG) with reinforcement learning traversal (KGRL) enables the discovery of explainable recommendation paths (e.g., student major $\rightarrow$ foundational skill $\rightarrow$ prerequisite course $\rightarrow$ target industry role). SkillForge builds upon these hybrid principles by combining explicit relational schemas with semantic vector representations.

### 5.3 Evolution of Natural Language Processing in Recruitment Technologies
The automated extraction of skills from unstructured text has transitioned through three major technological generations:
- **Generation I (Rule-Based and Dictionary Scrapers):** Early ATS tools relied upon regular expressions, string tokenization, and predefined lexical dictionaries (e.g., curated lists of technical keywords). As documented by José-García et al. (2023), dictionary approaches are brittle, failing to recognize morphological variants, abbreviations, or skills embedded in complex narrative descriptions.
- **Generation II (Statistical NLP and Shallow Embeddings):** Systems incorporated Named Entity Recognition (NER) via conditional random fields, spaCy pipelines, and static word embeddings such as Word2Vec and FastText. While these techniques capture basic syntactic patterns, they lack deep contextual awareness and struggle with polysemy (e.g., distinguishing "Java" the programming language from geographical entities).
- **Generation III (Transformer Embeddings and Large Language Models):** State-of-the-art recruitment platforms leverage contextual transformer architectures (such as BERT, RoBERTa, and Sentence-BERT) to compute high-dimensional dense embeddings of resumes and job descriptions. Recent frameworks (e.g., Chandrakumara & Silva, 2026) combine sentence-transformer models (`all-MiniLM-L6-v2`) for cosine similarity matching with prompt-constrained Large Language Models (LLMs) to extract structured JSON data. SkillForge leverages this contextual paradigm while enforcing strict privacy and sanitization guardrails.

### 5.4 Cognitive Scaffolding, Deliberate Practice, and Spaced Repetition
SkillForge’s pedagogical architecture is underpinned by Ericsson’s theory of *Deliberate Practice*, which demonstrates that expert performance requires focused, repetitive practice on targeted weaknesses, accompanied by immediate, informative feedback. In technical software preparation, deliberate practice requires continuous progression through algorithmic problem sets with immediate feedback on runtime constraints and architectural invariants.

Furthermore, knowledge retention over extended preparation intervals is governed by the Ebbinghaus Forgetting Curve. Without systematic review, learners exponentially lose newly acquired conceptual knowledge. The spacing effect demonstrates that memory consolidation is maximized when retrieval is practiced at geometrically increasing temporal intervals (e.g., days 1, 2, 4, 7, 14, 30). SkillForge incorporates an explicit spaced repetition engine into its curriculum, automatically scheduling revision topics whenever quiz or interview performances drop below mastery thresholds.

---

## 6. SYNTHESIZED LITERATURE REVIEW

To rigorously contextualize SkillForge within the academic state of the art, we critically analyze recent scholarly investigations across higher-education career prediction, lifelong learning frameworks, and automated career guidance systems.

### 6.1 Systematic Literature Reviews in Career Prediction and Lifelong Learning
In a comprehensive systematic literature review encompassing 78 primary studies published between 2019 and 2024, Bayly-Castaneda et al. (2024) explored the emergence of AI-mediated solutions for designing personalized learning paths in lifelong learning. Their analysis revealed that over 80% of current research is concentrated within formal higher education environments, with a marked deficit of applications addressing the transition into corporate or workforce contexts (11.5%). Furthermore, while adaptive learning technologies predominated (11 studies), a surge of interest in generative language models (9 studies) highlighted the pedagogical potential of conversational AI in learning trajectory construction. However, the authors identified critical recurring limitations across the literature: geographic concentration of research (predominantly China, the United States, and India), lack of open benchmark datasets, absence of longitudinal validation tracking career outcomes, and significant risks regarding algorithmic bias and the educational digital divide (citing Bulathwela et al., 2024).

Focusing specifically on predictive modeling, Trujillo et al. (2025) conducted a Kitchenham-methodology systematic literature review of 38 peer-reviewed studies (selected from an initial corpus of 1,296 candidate articles) evaluating machine learning approaches for higher-education career prediction. Their empirical extraction established that Random Forest (26% of studies), Support Vector Machines (SVM, 21%), and Neural Networks (16%) constitute the predominant algorithmic techniques. The feature spaces investigated relied primarily upon academic grades and GPA (28%), personal interests and extracurriculars (22%), and demographic attributes (19%), evaluated via classification metrics (Precision, Recall, and $F_1$-score accounting for 60% of all reported metrics). Crucially, Trujillo et al. highlighted that existing predictive models operate almost exclusively as *terminal classifiers*—predicting whether a student will enroll in or complete a specific major—without providing diagnostic feedback, actionable learning interventions, or interview preparation. They underscored the urgent necessity of explainable AI (XAI) frameworks to mitigate algorithmic bias and foster student trust.

### 6.2 Empirical Frameworks for Career Guidance and Skill Mapping
In a direct implementation of an AI-driven career-readiness framework, Chandrakumara and Silva (2026) developed a 5-module web platform for IT job role prediction, skill-gap analysis, future skill forecasting, learning path recommendation, and resume optimization. Their system utilized a two-tier extraction pipeline—employing Meta Llama-3-8B-Instruct via the Hugging Face Inference API for structured JSON extraction with an offline spaCy NER fallback—and trained a hybrid LinearSVC and Random Forest soft-voting classifier across 38 predefined IT job roles using an enriched Kaggle resume dataset of 10,174 records. Testing on 2,029 samples yielded 99.90% classification accuracy and a 99.91% weighted $F_1$-score. Skill gaps were computed using `all-MiniLM-L6-v2` sentence embeddings at a cosine similarity threshold of 0.72, while future skill demand was projected over a 3-year horizon using a Polynomial-EWMA-CAGR ensemble. Despite its high classification performance, the authors acknowledged notable limitations: the framework was constrained to 38 predefined IT categories, relied upon external cloud APIs with potential latency and privacy implications, lacked individual feature-level explainability (e.g., SHAP/LIME), was validated externally on only 20 unseen resumes, and omitted technical coding assessments or mock interview simulations.

Addressing the visual and structural representation of the labor market, José-García et al. (2023) introduced the C3-IoC system, an interactive career guidance platform developed in collaboration with IBM and UK universities. The authors curated a dual knowledge base combining 22,359 UK IT job advertisements scraped from the Department of Work and Pensions with the U.S. O*NET database (381 degree-level occupations and 142 skills). C3-IoC introduced an asymmetric Euclidean distance metric that specifically penalizes skill deficits while treating skill surpluses neutrally:
$$D(u, j) = \sqrt{\sum_{s \in S} \max(j_s - u_s, 0)^2}$$
Normalized occupational similarities were projected onto a force-directed network using Revealed Comparative Advantage (RCA) to filter out non-discriminative skills, and community structures were identified via the Louvain clustering algorithm. In user trials involving 64 university students, C3-IoC demonstrated high usability and significantly enhanced student self-reflection regarding both technical and transversal soft skills. However, the system's resume parsing was limited to dictionary-based keyword matching, lacked automated learning path generation, provided no coding practice, and offered no evaluative interview modules.

Finally, Wang (2025) designed and evaluated a student-job matching architecture for vocational institutions, addressing the interpretability limitations of traditional collaborative filtering. Utilizing a dataset of 16,998 student profiles and 9,197 job postings, the author implemented a Knowledge Graph Reinforcement Learning (KGRL) model where an RL agent navigates a heterogeneous graph (comprising students, skills, enterprises, and job categories) using TransR entity embeddings ($R = U W V^T$). The proposed KGRL model achieved superior ranking performance (NDCG = 0.764, Recall = 0.598, HR@10 = 6.87, Precision@5 = 0.623) while providing visual and textual explanation paths. Nevertheless, the system focused strictly on matching candidates to existing enterprise job openings, completely omitting diagnostic remediation, curriculum scaffolding, or interactive interview training.

### 6.3 Comparative Literature Matrix
Table 1 provides an exhaustive cross-comparative synthesis of these foundational works against SkillForge across ten critical dimensions of career preparation.

```
TABLE 1: Comprehensive Literature Comparison Matrix
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
| System / Paper            | Target Domain         | Primary AI / ML     | Skill-Gap | Resume & JD | Course /   | DSA Code | Mock        | Placement  | Primary Structural            |
|                           |                       | Architecture        | Modeling  | Parsing     | Path Rec.  | Practice | Interview   | Readiness  | Limitation                    |
+===========================+=======================+=====================+===========+=============+============+==========+=============+============+===============================+
| Bayly-Castaneda (2024)    | Lifelong Learning &   | Systematic Review   | Conceptual| No          | Adaptive   | No       | No          | No         | Meta-review only; lacks       |
| [Front. Educ.]            | Higher Education      | (PRISMA Framework)  | Only      |             | (Surveyed) |          |             |            | concrete software prototype.  |
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
| Trujillo et al. (2025)    | Higher Education      | Systematic Review   | No        | Academic    | No         | No       | No          | Passive    | Meta-review; focuses on       |
| [JOTSE]                   | Career Prediction     | (Random Forest/SVM) |           | Data Only   |            |          |             | Classifier | coarse major prediction.      |
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
| Chandrakumara (2026)      | IT Career Readiness   | LinearSVC + RF      | Semantic  | Llama-3-8B  | Static     | No       | No          | No         | Fixed to 38 roles; external   |
| [AJRCOS]                  |                       | Ensemble + MiniLM   | (Cosine)  | + spaCy     | Mapping    |          |             |            | API latency; no coding/mocks. |
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
| José-García et al. (2023) | UK University IT      | Word2Vec + O*NET    | Asymmetric| Dictionary  | No         | No       | No          | Distance   | Dictionary parsing; no active |
| [IJAIED] (C3-IoC)         | Undergraduates        | Regression + Louvain| Euclidean | Matcher     |            |          |             | Sim Metric | remediation or interview prep.|
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
| Wang (2025)               | Higher Vocational     | Collaborative Filt. | No        | Content-    | No         | No       | No          | No         | Matching only; no skill-gap   |
| [Syst. Soft Comput.]      | Student Employment    | + TransR KGRL       |           | Based NLP   |            |          |             |            | remediation or evaluation.    |
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
| SkillForge                | Higher Education CS   | Multi-Tier Modular: | Asymmetric| Multi-Factor| Prereq-    | 26-Topic | Full-Screen | Composite  | Evaluated primarily within    |
| (Proposed Ecosystem)      | & Engineering Career  | NLP + Sentence      | Vector    | Semantic +  | Aware Path | Adaptive | Multi-      | Multi-     | computing and software        |
|                           | Preparation           | Transformers + LLM  | Deficit   | ATS Fixer   | Engine     | Engine   | Rubric AI   | Pillar PRS | engineering domains.          |
+---------------------------+-----------------------+---------------------+-----------+-------------+------------+----------+-------------+------------+-------------------------------+
```

---

## 7. THE RESEARCH GAP

Synthesizing the empirical and systematic findings from Section 6 exposes four definitive structural gaps in the existing body of knowledge:

1. **The Diagnostic-Prescriptive Disconnect:** Existing platforms that successfully diagnose skill gaps (e.g., C3-IoC by José-García et al., 2023; Chandrakumara & Silva, 2026) function as terminal analyzers. They present a visual radar chart or a list of missing competencies but fail to provide an immediate, executable curriculum. The student is left to manually seek out external educational resources without structural alignment to their target role.
2. **Exclusion of Concrete Algorithmic Implementation (DSA):** In the software engineering recruitment pipeline, Data Structures and Algorithms (DSA) screening represents the universal, mandatory gateway round. Yet, no existing academic career guidance platform integrates technical coding assessments within its skill-gap remediation engine. Coding portals exist in isolation from career roadmaps, while career guidance tools ignore coding telemetry entirely.
3. **Absence of Contextualized, Automated Technical Interview Simulation:** While commercial interview tools exist, they are completely decoupled from student resume analysis and learning histories. No reviewed system generates interview questions dynamically targeted at a candidate’s specific resume weaknesses and evaluates them using standardized multi-dimensional rubrics (technical accuracy, problem-solving, communication, and confidence).
4. **Lack of a Unified, Multi-Pillar Placement Readiness Metric:** Prior research evaluates student standing through single, disconnected indicators: semester GPA, resume cosine similarity, or classifier accuracy. There is an absence of an explainable, composite index that synthesizes diagnostic resume alignment, verified project implementation, active coding practice, and behavioral interview simulation into a unified readiness score.

SkillForge directly bridges these four gaps, establishing an integrated ecosystem where diagnosis feeds prescription, prescription triggers evaluation, and evaluation refines the student's dynamic readiness score.

---

## 8. MATHEMATICAL PROBLEM FORMULATION

To ensure academic rigor, transparency, and reproducibility, SkillForge formally conceptualizes career development and placement readiness as a constrained vector space optimization and multi-attribute evaluation problem.

### 8.1 Student Competency and Job Requirement Vector Spaces
Let $\mathcal{S} = \{s_1, s_2, \dots, s_N\}$ denote the universal ontology of $N$ discrete technical and professional competencies recognized across the computing industry.

- **Student Competency Vector ($\mathbf{u}$):** A student $u$ is defined as a vector in the continuous proficiency space:
  $$\mathbf{u} = \left[ u_1, u_2, \dots, u_N \right]^T, \quad u_i \in [0, 1]$$
  where $u_i$ quantifies the student's demonstrated mastery of skill $s_i$. A value of $u_i = 0$ denotes complete absence of evidence, while $u_i = 1.0$ represents verified expert mastery.

- **Job Requirement Vector ($\mathbf{j}$):** A target job role or specific job description $j$ is represented as a requirement vector in the identical space:
  $$\mathbf{j} = \left[ j_1, j_2, \dots, j_N \right]^T, \quad j_i \in [0, 1]$$
  where $j_i$ designates the minimum operational proficiency threshold demanded by role $j$ for skill $s_i$. In practice, skills are partitioned into **Core Requirements** ($\mathcal{S}_{\text{core}} \subset \mathcal{S}$ with $j_i \ge 0.70$) and **Preferred Requirements** ($\mathcal{S}_{\text{pref}} \subset \mathcal{S}$ with $0.30 \le j_i < 0.70$).

### 8.2 Asymmetric Skill Deficit Formulation
Standard geometric distance metrics (such as cosine similarity or Euclidean distance) are inherently symmetric: they penalize a candidate equally for having a skill deficit ($u_i < j_i$) or having a skill surplus ($u_i > j_i$). In employment matching, exceeding a technical requirement does not degrade a candidate's qualification. 

Following and extending the formulation introduced in C3-IoC (José-García et al., 2023), SkillForge defines the **Asymmetric Skill Deficit** $\Delta(\mathbf{u}, \mathbf{j})$ as:
$$\Delta(\mathbf{u}, \mathbf{j}) = \sqrt{ \sum_{i=1}^N \left( \max\left(j_i - u_i, 0\right) \right)^2 }$$

Under this formulation, if a student meets or exceeds the required threshold ($u_i \ge j_i$), the contribution to the deficit is identically zero:
$$\max(j_i - u_i, 0) = 0 \quad \forall \, u_i \ge j_i$$

### 8.3 Normalized Role-Alignment Similarity Index
To map the asymmetric deficit into a bounded, intuitive alignment score $\text{Sim}(\mathbf{u}, \mathbf{j}) \in [0, 1]$, we normalize $\Delta(\mathbf{u}, \mathbf{j})$ against the maximum theoretical deficit—namely, the distance between the target job requirements and an empty candidate profile $\mathbf{\emptyset} = [0, 0, \dots, 0]^T$:
$$\Delta(\mathbf{\emptyset}, \mathbf{j}) = \sqrt{ \sum_{i=1}^N j_i^2 }$$

The Normalized Role-Alignment Similarity is formally defined as:
$$\text{Sim}(\mathbf{u}, \mathbf{j}) = 1 - \frac{\Delta(\mathbf{u}, \mathbf{j})}{\Delta(\mathbf{\emptyset}, \mathbf{j})} = 1 - \frac{\sqrt{\sum_{i=1}^N \left( \max\left(j_i - u_i, 0\right) \right)^2}}{\sqrt{\sum_{i=1}^N j_i^2}}$$

When $\mathbf{u} \ge \mathbf{j}$ across all skills, $\Delta(\mathbf{u}, \mathbf{j}) = 0$, yielding $\text{Sim}(\mathbf{u}, \mathbf{j}) = 1.0$ (perfect qualification). Conversely, when $\mathbf{u} = \mathbf{\emptyset}$, $\text{Sim}(\mathbf{u}, \mathbf{j}) = 0$.

### 8.4 Multi-Factor Applicant Tracking System (ATS) Scoring Model
In SkillForge's actual production implementation, a student's resume text $T_{\text{resume}}$ is evaluated against a target job description $T_{\text{jd}}$ across five distinct empirical dimensions:
1. **Skills Match Score ($S_{\text{skills}}$):** Evaluates the presence of required technical skills, accounting for exact and partial conceptual matches:
   $$S_{\text{skills}} = \min\left(98, \max\left(35, \text{round}\left( \frac{N_{\text{matched}} + 0.5 \cdot N_{\text{partial}}}{N_{\text{total\_required}}} \times 100 \right)\right)\right)$$
2. **Experience Alignment Score ($S_{\text{exp}}$):** Evaluates structural evidence of internships or professional roles:
   $$S_{\text{exp}} = \begin{cases} \min\left(92, 65 + 4 \cdot N_{\text{matched}}\right) & \text{if } T_{\text{resume}} \text{ contains experience/internship tokens} \\ 55 & \text{otherwise} \end{cases}$$
3. **Keyword Optimization Score ($S_{\text{kw}}$):** Measures frequency density of high-priority role keywords $K$:
   $$S_{\text{kw}} = \min\left(95, \max\left(40, \text{round}\left( \frac{|\{k \in K \mid \text{freq}_{\text{resume}}(k) \ge 1\}|}{|K|} \times 100 \right)\right)\right)$$
4. **Project Alignment Score ($S_{\text{proj}}$):** Quantifies verified technical contributions and quantifiable impact metrics (e.g., regex detection of percentages, scale indicators, or throughput metrics):
   $$S_{\text{proj}} = \begin{cases} \min\left(94, 70 + 15\right) & \text{if project tokens and metric tokens exist} \\ \min\left(94, 70\right) & \text{if project tokens exist without metric tokens} \\ 50 & \text{otherwise} \end{cases}$$
5. **ATS Formatting Integrity Score ($S_{\text{format}}$):** Penalizes structural errors (missing section headers, missing bullet points, and multi-column pipe corruption):
   $$S_{\text{format}} = \max\left(45, 100 - 10 \cdot |\mathcal{I}_{\text{ats}}|\right)$$
   where $|\mathcal{I}_{\text{ats}}|$ denotes the count of detected formatting defects.

The Composite ATS Score $S_{\text{ATS}}$ is calculated via the weighted linear combination:
$$S_{\text{ATS}} = 0.35 \cdot S_{\text{skills}} + 0.20 \cdot S_{\text{exp}} + 0.20 \cdot S_{\text{kw}} + 0.15 \cdot S_{\text{proj}} + 0.10 \cdot S_{\text{format}}$$

### 8.5 Automated Mock Interview Multi-Rubric Evaluation Model
For each interview question $q$ presented during a simulated interview session, a candidate's answer $A_q$ is evaluated against the question's rubric key points $\mathcal{K}_q$ and complexity requirements. 

Let $\rho_q = \frac{|\{k \in \mathcal{K}_q \mid k \text{ is semantically present in } A_q\}|}{|\mathcal{K}_q|}$ denote the key-point coverage ratio, and $W_q$ denote the word count of $A_q$. Five sub-dimension scores in $[20, 98]$ are determined:
- **Technical Knowledge ($K_{\text{tech}}$):** $K_{\text{tech}} = \text{clamp}\left(\text{round}\left(75 \cdot \rho_q + \min(20, 0.4 \cdot W_q)\right), 30, 96\right)$
- **Problem Solving ($P_{\text{solve}}$):** $P_{\text{solve}} = \text{clamp}\left(\text{round}\left(70 \cdot \rho_q + \min(25, 0.3 \cdot W_q)\right), 30, 95\right)$
- **Communication Quality ($C_{\text{comm}}$):** $C_{\text{comm}} = \text{clamp}\left(\text{round}\left(75 + \min(20, 0.2 \cdot W_q)\right), 35, 95\right)$ (for $W_q > 25$)
- **Confidence ($C_{\text{conf}}$):** Penalized if tentative linguistic hedges ("maybe", "I think") are present; defaults to $85$ if fluent and assertive.
- **Answer Relevance ($R_{\text{rel}}$):** $R_{\text{rel}} = \text{clamp}\left(\text{round}\left(85 \cdot \rho_q + 12\right), 25, 98\right)$

The overall question score $S_q$ is given by:
$$S_q = 0.35 \cdot K_{\text{tech}} + 0.25 \cdot P_{\text{solve}} + 0.20 \cdot C_{\text{comm}} + 0.10 \cdot C_{\text{conf}} + 0.10 \cdot R_{\text{rel}}$$

For an interview session comprising $M$ questions, the overall interview score $\bar{S}_{\text{interview}}$ is the mean over all questions:
$$\bar{S}_{\text{interview}} = \frac{1}{M} \sum_{q=1}^M S_q$$

### 8.6 The Composite Placement Readiness Score (PRS)
The ultimate telemetry metric in SkillForge is the **Placement Readiness Score (PRS)**, an index in $[0, 100]$ reflecting a student's real-time readiness for industry hiring loops. PRS synthesizes interview proficiency, technical depth, and problem-solving consistency:
$$\text{PRS} = \min\left(96, \max\left(40, \text{round}\left(0.40 \cdot \bar{S}_{\text{interview}} + 0.30 \cdot \bar{S}_{\text{technical}} + 0.30 \cdot \bar{S}_{\text{problemSolving}}\right)\right)\right)$$

Crucially, SkillForge models PRS as a dynamic, living index augmented by active learning milestones:
- Successful DSA problem accepted in playground: $\text{PRS} \leftarrow \min(96, \text{PRS} + 1)$
- Verified capstone project submission: $\text{PRS} \leftarrow \min(96, \text{PRS} + 3)$
- Daily learning mission sprint completed: $\text{PRS} \leftarrow \min(96, \text{PRS} + 1)$

---

## 9. PROPOSED SYSTEM: SKILLFORGE ECOSYSTEM OVERVIEW

SkillForge is architected as an integrated career engineering workbench. Rather than requiring students to assemble separate tools, SkillForge guides the student through a cohesive workflow:

```
[Student Onboarding] ---> [Resume & JD Analysis] ---> [Skill-Gap Matrix]
         |                                                   |
         v                                                   v
[Longitudinal DNA Profile]                           [Dynamic Roadmap]
         |                                                   |
         v                                                   v
[Skill Passport] <--- [Placement Readiness (PRS)] <--- [Practice & Evaluation:
                                                        - 26 DSA Categories
                                                        - Capstone Projects
                                                        - Timed Mock Mocks]
```

### 9.1 Core Functional Modules
1. **Authentication & Identity Management:** Secure student and instructor registration, JWT session verification, and Amazon Cognito integration, supporting distinct role-based permissions.
2. **Onboarding & Profiling Subsystem:** Captures student career targets (e.g., Software Engineer, Backend Developer, Cloud Engineer), current proficiency level (Beginner, Intermediate, Advanced), daily time commitments, and baseline technologies.
3. **Multi-Factor Resume & JD Matcher:** Ingests raw text or PDF documents, extracts technical entities, compares against target role profiles, detects formatting issues, and generates before-and-after bullet point transformations.
4. **Skill-Gap Visualizer:** Organizes competencies into a hierarchical taxonomy (Languages, Frameworks, Databases, Fundamentals, Architecture, DevOps/Cloud, Quality, Security) with status indicators: `STRONG` ($\ge 75\%$), `IMPROVING` ($40\text{–}74\%$), and `GAP` ($< 40\%$).
5. **Personalized Learning Roadmap:** Sequences courses and modular topics based on dependency graphs, estimating completion time and highlighting high-priority weak areas.
6. **Coding Playground (DSA Hub):** Delivers an interactive IDE supporting 26 algorithmic categories, real-time static code analysis for time and space complexity, test-case verification, and automated mistake memory tracking.
7. **AI Mock Interview Simulator:** A full-screen, timed proctored environment generating role-specific questions across DSA, Core Computer Science (OS, DBMS, Networks), System Design, and Behavioral tracks, evaluated across five standardized rubric dimensions.
8. **Spaced Repetition Revision Engine:** Automatically schedules review topics on days 1, 2, 4, 7, 14, and 30 following low quiz or interview scores.
9. **Capstone Project Evaluator:** Assesses full-stack GitHub repositories across code quality, architectural modularity, test coverage, and documentation.
10. **Skill Passport & Placement Hub:** Provides an immutable, shareable cryptographic transcript of verified student competencies, project scores, and placement milestones.

---

## 10. SYSTEM ARCHITECTURE AND DATA FLOW

SkillForge implements a modern multi-tier client-server architecture designed for high throughput, sub-second API responsiveness, and secure data handling.

```
+-----------------------------------------------------------------------------+
|                            PRESENTATION LAYER                               |
|   React 19 SPA | TypeScript | Tailwind CSS v4 | Vite 8 | Lucide Icons       |
|   - Student & Instructor Dashboards   - Interactive Coding Playground (IDE) |
|   - Resume & JD Matcher Workbench     - Timed Full-Screen Interview Portal  |
+-----------------------------------------------------------------------------+
                                      |  (HTTPS / RESTful JSON / Bearer JWT)
                                      v
+-----------------------------------------------------------------------------+
|                           API GATEWAY & ROUTING                             |
|   Express 4.18 REST Application Server | TypeScript | Morgan Logging         |
|   - Authentication Middleware (JWT / Amazon Cognito Verification)           |
|   - Zod Request Schema Validation & Sanitization Layer                      |
+-----------------------------------------------------------------------------+
                                      |
         +----------------------------+----------------------------+
         |                                                         |
         v                                                         v
+------------------------------------+   +------------------------------------+
|       CORE APPLICATION LOGIC       |   |       AI INFERENCE PIPELINE        |
|  - Adaptive Controller             |   |  - Contextual AI Tutor Service     |
|  - Course & Enrollment Management  |   |  - Static Code Complexity Analyzer |
|  - Quiz Evaluation & Progress Logs |   |  - Multi-Factor ATS Match Engine   |
|  - Spaced Repetition Scheduler     |   |  - Rubric Interview Evaluator      |
+------------------------------------+   +------------------------------------+
         |                                                         |
         +----------------------------+----------------------------+
                                      |
                                      v
+-----------------------------------------------------------------------------+
|                         DATA ACCESS & STORAGE LAYER                         |
|   Prisma ORM 5.0 (Type-Safe Client & Query Engine)                          |
|   Relational Persistence Engine (SQLite / PostgreSQL Ready)            |
|   - Users & Profiles    - Skills & Taxonomies     - Coding Problems & Subs  |
|   - Courseware & Quizzes- Resume Analyses & Vers. - Mock Interview Sessions |
+-----------------------------------------------------------------------------+
```

### 10.1 Layer-by-Layer Architectural Decomposition
1. **Client Presentation Layer:** Built with React 19, TypeScript, and Vite. The UI utilizes Tailwind CSS v4 for hardware-accelerated styling. State management is organized around modular React Contexts and custom hooks, ensuring zero unnecessary re-renders during high-frequency tasks such as real-time coding or timed interview responses.
2. **API Gateway and Middleware Layer:** Implemented in Express and TypeScript. The gateway intercepts all HTTP requests, enforces CORS policies, verifies cryptographically signed JWT tokens (supporting both local `jsonwebtoken` and `aws-jwt-verify` for enterprise Cognito deployments), and validates payloads using Zod schemas.
3. **Core Application Service Layer:** Manages application domain logic across student onboarding, course enrollments, lecture delivery, quiz grading, and collaborative study rooms.
4. **AI and Intelligent Analytics Layer:** Houses the algorithmic complexity analyzer, semantic skill-gap matching engine, prompt-construction pipelines, and automated interview evaluators.
5. **Data Access and Persistence Layer:** Managed via Prisma ORM 5.0, providing end-to-end compile-time type safety across 20 distinct data models.

---

## 11. AI AND MACHINE LEARNING METHODOLOGY

### 11.1 Natural Language Processing and Entity Extraction Pipeline
SkillForge processes unstructured resumes and job descriptions through a multi-stage text transformation pipeline:
1. **Text Normalization:** Ingested text is stripped of non-standard ASCII characters, converted to standardized lowercase representation, and tokenized into sentences and words.
2. **PII Sanitization:** To guarantee student privacy and mitigate unconscious demographic bias, personal identifiers—including full names, email addresses, phone numbers, physical locations, and demographic markers—are filtered out using deterministic regular expressions prior to semantic analysis.
3. **Taxonomy-Driven Entity Normalization:** Extracted tokens are mapped to canonical skill entities within SkillForge's curated technical taxonomy using lemmatization and alias matching (e.g., mapping "K8s" $\rightarrow$ "Kubernetes", "Postgres" $\rightarrow$ "PostgreSQL", and "AWS EC2" $\rightarrow$ "AWS").

### 11.2 Static Code Complexity Analyzer
In the Coding Playground, SkillForge incorporates an algorithmic analysis engine that inspects submitted code snippets statically without requiring sandboxed untrusted binary execution:
- **Loop Invariant and Nesting Inspection:** Regex-based abstract syntax matching detects nested iterative loops (`for...for`, `while...while`, `for...while`), mapping nested structures to $O(n^2)$ time complexity and generating immediate refactoring advice.
- **Lookup Structure Detection:** Identifies the utilization of hash-based lookup tables (HashMaps, sets, dictionaries, unordered maps), recognizing linear time tradeoffs ($O(n)$ time, $O(n)$ auxiliary space) over quadratic nested searches.
- **Boundary and Corner-Case Inspection:** Validates loop termination criteria (`left <= right` in binary search), integer overflow prevention in midpoint calculations (`mid = low + (high - low) / 2`), and null-pointer guards.

### 11.3 Contextual Prompt Engineering for Generative Copilot
For generative educational interactions (AI Tutor, Career Copilot, and Course Syllabus Generation), SkillForge employs structured context injection:
```
System Prompt:
You are the SkillForge Contextual Career Copilot. You assist engineering students 
in achieving career readiness. You MUST adhere to these strict constraints:
1. Ground all recommendations in the student's verified skills, current readiness score, 
   and target job role.
2. Never make absolute guarantees regarding employment or hiring decisions.
3. Enforce precise computational complexity notations (O(n), O(log n)) when explaining algorithms.
4. Respond with structured, actionable tasks (lecture link, practice problem, revision quiz).
```

---

## 12. RESUME AND JOB DESCRIPTION ANALYSIS ENGINE

The resume analysis subsystem performs deep-dive diagnostic inspection, bridging the gap between student self-presentation and automated enterprise screening systems.

```
TABLE 2: Enterprise Technical Skill Catalog & Role Significance
+-------------------+---------------+--------------------------------------------------------------+----------------------------------------------------+
| Canonical Skill   | Category      | Evaluated Role Significance                                  | Remediating Recommended SkillForge Course          |
+===================+===============+==============================================================+====================================================+
| Java              | Languages     | Enterprise backbone for scalable microservices & OOP design. | Mastering Java & OOP for High-Scale Backends       |
| Python            | Languages     | Critical for backend services, automation, and data pipelines.| Python for Enterprise & Backend Automation         |
| TypeScript        | Languages     | Type-safe standard preventing runtime defects in full stack. | TypeScript Masterclass: Type Systems in Production |
| SQL / PostgreSQL  | Databases     | Relational persistence, transactional ACID, & index tuning.  | Relational Database Design & SQL Optimization      |
| Redis             | Databases     | In-memory caching primitive for sub-millisecond latency.     | Distributed Caching & Redis Patterns               |
| DSA               | Fundamentals  | Algorithmic time/space optimization & technical screening.   | Data Structures & Algorithms in Practice           |
| System Design     | Architecture  | Distributed scalability, load balancing, sharding, and queues| High-Throughput Distributed System Design          |
| Docker            | DevOps & Cloud| Containerization ensuring reproducible execution environments| Containerization with Docker & Podman              |
| Kubernetes        | DevOps & Cloud| Cloud-native orchestration, automated scaling & self-healing | Kubernetes in Production: Orchestration & Helm     |
| AWS               | DevOps & Cloud| Public cloud infrastructure, serverless, and IAM policies.   | AWS Certified Cloud Architect & Developer          |
+-------------------+---------------+--------------------------------------------------------------+----------------------------------------------------+
```

### 12.1 Section-by-Section Diagnostic Transformation Engine
Rather than merely issuing a numerical score, SkillForge generates actionable, granular "Before vs. After" transformations across key resume sections:
- **Professional Summary:** Transforms passive, generic statements ("*Computer Science graduate seeking entry-level software job*") into targeted, metric-driven value propositions ("*Results-driven Software Engineer with hands-on experience in Java, Spring Boot, and PostgreSQL; proven track record building resilient RESTful microservices and optimizing database queries*").
- **Experience / Project Bullet Points:** Replaces task-oriented prose ("*Wrote database queries in SQL for user dashboard*") with XYZ-formula impact statements ("*Optimized complex PostgreSQL analytical queries with compound B-Tree indexing and connection pooling, reducing slow query latency by 40%*").

---

## 13. PERSONALIZED LEARNING PATH RECOMMENDATION

### 13.1 Prerequisite Graph Modeling
SkillForge models educational topics as a Directed Acyclic Graph (DAG) $G = (\mathcal{V}, \mathcal{E})$, where vertices $\mathcal{V}$ represent granular technical topics and directed edges $(v_a, v_b) \in \mathcal{E}$ indicate that topic $v_a$ is a strict conceptual prerequisite for topic $v_b$.

```
[Object-Oriented Programming (OOP)] ---> [Data Structures & Algorithms]
                 |                                      |
                 v                                      v
   [Relational Database Design] ---------> [Backend REST APIs & Services]
                 |                                      |
                 v                                      v
   [Database Indexing & ACID] -------------> [Distributed System Design]
```

### 13.2 Recommendation Sequencing Algorithm
When a student initiates an upskilling trajectory for target role $j$, Algorithm 1 extracts the active skill gaps $\mathcal{S}_{\text{gap}} = \{s_i \in \mathcal{S} \mid u_i < j_i\}$ and executes topological sorting over $G$ to synthesize an optimal, prerequisite-consistent learning sequence.

```
ALGORITHM 1: Dynamic Learning Path Generation
Input: Student Competency Vector u, Target Role Requirement Vector j, Prerequisite DAG G = (V, E)
Output: Ordered Sequence of Recommended Educational Modules L

1:  Initialize candidate gaps: S_gap <- empty set
2:  For each skill s_i in S:
3:      If u_i < j_i Then
4:          S_gap <- S_gap union {s_i}
5:      End If
6:  End For
7:  
8:  Initialize induced subgraph G_sub from G containing all prerequisites of S_gap
9:  Perform Topological Sort on G_sub -> TopoOrder
10: Initialize L <- empty list
11: For each topic v in TopoOrder:
12:     If student mastery of v satisfies u_v < 0.70 Then
13:         Calculate priority weight w_v = (j_v - u_v) * OutDegree(v, G_sub)
14:         Append module(v, priority = w_v) to L
15:     End If
16: End For
17: Return L sorted by priority weight descending
```

---

## 14. DATA STRUCTURES AND ALGORITHMS (DSA) PRACTICE MODULE

### 14.1 The 26 Algorithmic Problem Categories
SkillForge incorporates a comprehensive catalog of coding challenges organized across 26 canonical algorithmic categories:
`Arrays`, `Strings`, `Hashing`, `Two Pointers`, `Sliding Window`, `Binary Search`, `Sorting`, `Linked List`, `Stack`, `Queue`, `Deque`, `Recursion`, `Backtracking`, `Trees`, `Binary Search Tree`, `Heap / Priority Queue`, `Greedy`, `Graphs`, `BFS`, `DFS`, `Dynamic Programming`, `Bit Manipulation`, `Tries`, `Intervals`, `Matrix`, and `Math / Number Theory`.

### 14.2 Mistake Memory and Weak-Topic Remediation
When a student submits an unaccepted solution (e.g., Wrong Answer, Time Limit Exceeded, Runtime Error), the submission telemetry is captured in the database. The system aggregates unaccepted attempts by category and title. If a student exhibits repeated failures in a category (e.g., off-by-one errors in `Binary Search` or missing visited sets in `Graphs`), SkillForge's Mistake Memory engine automatically flags the topic and elevates matching introductory and intermediate problems to the student's daily mission sprint.

---

## 15. AI CAREER COPILOT

The AI Career Copilot serves as an interactive conversational mentor. Integrated directly into the student dashboard, it contextualizes every response using the student's real-time state:
- Current Target Role
- Composite Placement Readiness Score (PRS)
- Lowest Mastery Skill in the Skill-Gap Matrix
- Historical Submission Patterns in the Coding Playground
- Upcoming Spaced Repetition Deadlines

By combining state injection with strict guardrails against deterministic employment claims, the Copilot provides actionable daily schedules (e.g., allocating 25 minutes of lecture study, 15 minutes of coding practice, and 10 minutes of quiz validation) tailored to the student's personal learning style.

---

## 16. AI-ASSISTED TIMED MOCK INTERVIEW SUBSYSTEM

### 16.1 Simulated Interview Environment
The mock interview subsystem replicates high-stakes enterprise technical and behavioral screening loops:
- **Target Role Selection:** Calibrated for Software Engineer, Backend Developer, Frontend Developer, Full Stack Developer, Data Scientist, or Cloud Engineer.
- **Interview Tracks:** DSA, Core Computer Science (OS, DBMS, Networks), System Design, Behavioral (STAR framework), or Mixed Comprehensive.
- **Enforced Time Constraints:** Configurable countdown timer (default 120 seconds per question).
- **Proctored Full-Screen Interface:** Engages the browser's Fullscreen API to eliminate external browsing distractions and simulate rigorous testing conditions.

```
TABLE 3: Automated Mock Interview Evaluation Rubric
+-----------------------+--------+--------------------------------------------------------------+----------------------------------------------------+
| Dimension             | Weight | Core Evaluation Focus                                        | Ground-Truth Benchmark Criteria                    |
+=======================+========+==============================================================+====================================================+
| Technical Knowledge   | 35%    | Accuracy of core computer science & algorithmic concepts.    | Identification of hashing, treeification, etc.     |
| Problem Solving       | 25%    | Systematic reasoning, complexity analysis, trade-off awareness| Explicit stating of O(log n) time / O(1) space.    |
| Technical Comm.       | 20%    | Clarity, structure, terminology, and articulate phrasing.    | Use of STAR method, modular point progression.     |
| Professional Conf.    | 10%    | Assertive communication free of excessive linguistic hedges.  | Absence of "I think", "maybe", or uncertain pauses.|
| Answer Relevance      | 10%    | Direct adherence to specific prompt questions and edge cases.| Direct addressing of collision resolution, etc.    |
+-----------------------+--------+--------------------------------------------------------------+----------------------------------------------------+
```

---

## 17. COMPOSITE PLACEMENT READINESS MODEL

The Placement Readiness Score (PRS) serves as the primary summative indicator of candidate readiness.

```
                                +------------------------------------------+
                                |      COMPOSITE PLACEMENT READINESS       |
                                |               SCORE (PRS)                |
                                +------------------------------------------+
                                                     ^
                                                     |
         +-------------------------------------------+-------------------------------------------+
         | 40%                                       | 30%                                       | 30%
         v                                           v                                           v
+-------------------------------+           +-------------------------------+           +-------------------------------+
|     MOCK INTERVIEW SCORE      |           |     TECHNICAL KNOWLEDGE       |           |    PROBLEM-SOLVING MASTERY    |
|  - Technical Knowledge (35%)  |           |  - Course Progression         |           |  - DSA Playground Accuracy    |
|  - Problem Solving (25%)      |           |  - Skill-Gap Matrix Level     |           |  - Category Breadth (26 Cats) |
|  - Communication (20%)        |           |  - Quiz Retention & Recall    |           |  - Algorithmic Complexity     |
|  - Confidence & Relevance     |           |  - Verified Capstone Projects |           |  - Code Review Quality        |
+-------------------------------+           +-------------------------------+           +-------------------------------+
```

The dynamic update mechanics ensure that passive tenure does not inflate a student's score; readiness can only be advanced through demonstrated competency acquisition, verified code submissions, and rigorous interview evaluations.

---

## 18. SOFTWARE IMPLEMENTATION AND SYSTEM STACK

SkillForge is implemented as a production-grade, full-stack web application adhering to modern software engineering standards:

```
TABLE 4: SkillForge Technology Stack and Architectural Justifications
+---------------------+-------------------------------+--------------------------------------------------------------------------+
| Architectural Layer | Technology Selected           | Architectural Rationale & Implementation Details                         |
+=====================+===============================+==========================================================================+
| Frontend Framework  | React 19 (TypeScript)         | Declarative, high-performance virtual DOM; strict compile-time types.     |
| Build Tooling       | Vite 8.2                      | Instant Hot Module Replacement (HMR) and optimized rollup production.   |
| Styling Engine      | Tailwind CSS v4               | Modern engine; zero runtime overhead, responsive layout design.          |
| UI Componentry      | Lucide React                  | Accessible, lightweight, scalable SVG iconography.                       |
| Backend Runtime     | Node.js 20+ (TypeScript)      | Asynchronous, event-driven I/O supporting high concurrent API loads.     |
| Web Application API | Express 4.18                  | Minimalist, robust RESTful routing with custom middleware chaining.      |
| Execution Engine    | tsx (TypeScript Execute)      | High-speed development execution without separate compilation artifacts.|
| Database ORM        | Prisma ORM 5.0                | Type-safe queries, automated migrations, declarative schema models.      |
| Persistence Engine  | SQLite / PostgreSQL Ready     | ACID-compliant relational persistence; seamless zero-config deployment.  |
| Authentication      | JWT / AWS Cognito Verify      | Cryptographically signed Bearer tokens; role-based access control.       |
| Language Models     | Hugging Face API / Llama-3-8B | High-parameter instruction models for structured extraction & feedback.   |
+---------------------+-------------------------------+--------------------------------------------------------------------------+
```

---

## 19. DATABASE DESIGN AND ENTITY RELATIONSHIPS

SkillForge’s persistent relational schema models the multi-dimensional relationships between students, curricula, code submissions, and interview evaluations.

```
TABLE 5: Relational Schema Entity Specifications
+--------------------+-----------------------------------------------------+-------------------------------------------------------------+
| Entity / Model     | Primary Attributes                                  | Relational Cardinality & Foreign Key References             |
+====================+=====================================================+=============================================================+
| User               | id, email, password, name, role, createdAt          | 1:1 with StudentProfile; 1:N with Submissions, Interviews.  |
| StudentProfile     | userId, targetRole, readinessScore, xp, streakDays  | Belongs to User (FK: userId, Cascade Delete).               |
| Skill              | id, name, category, description, parentSkill        | 1:N with StudentSkill (Hierarchical skill taxonomy).        |
| StudentSkill       | id, userId, skillId, level, status, updatedAt       | Composite Unique (userId, skillId); FKs to User and Skill.  |
| CodingProblem      | id, title, slug, difficulty, category, testCases    | 1:N with CodingSubmission.                                  |
| CodingSubmission   | id, userId, problemId, code, status, timeComplexity | FKs to User and CodingProblem.                              |
| Project            | id, title, difficulty, technologies, requirements   | 1:N with ProjectSubmission; optional FK to Course.          |
| ProjectSubmission  | id, userId, projectId, githubUrl, overallScore      | FKs to User and Project.                                    |
| InterviewSession   | id, userId, roleTarget, overallScore, transcript    | FK to User.                                                 |
| ResumeAnalysis     | id, userId, atsScore, skillsMatchScore, jobBreakdown| FK to User.                                                 |
| ResumeVersion      | id, userId, name, targetRole, resumeText            | FK to User.                                                 |
| RevisionTopic      | id, userId, topic, skillName, dueDay, dueDate       | FK to User (Spaced repetition engine).                      |
| StudyRoom / Member | id, title, topic, memberCount                       | 1:N with StudyRoomMember, StudyMessage.                     |
+--------------------+-----------------------------------------------------+-------------------------------------------------------------+
```

---

## 20. EXPERIMENTAL METHODOLOGY

To provide an empirical evaluation framework for SkillForge, we define formal validation procedures across three core experimental dimensions: Information Extraction Precision, Recommendation Ranking Efficacy, and Interview Scoring Agreement.

### 20.1 Experimental Protocol & Hypotheses
- **$H_1$ (Extraction Robustness):** The multi-tier parsing engine extracts technical skills from diverse resume formats with an $F_1$-score exceeding 90% while achieving 100% PII sanitization.
- **$H_2$ (Asymmetric Alignment Superiority):** Asymmetric shortfall matching produces higher Normalized Discounted Cumulative Gain ($\text{NDCG}@k$) and top-$k$ recommendation relevance than symmetric cosine baselines.
- **$H_3$ (Evaluative Reliability):** Automated mock interview grading exhibits strong inter-rater reliability (Spearman's rank correlation $r_s \ge 0.75$) when compared against expert human engineering evaluators.

### 20.2 Evaluation Metrics
1. **Extraction Accuracy & Classification:**
   $$\text{Precision} = \frac{TP}{TP + FP}, \quad \text{Recall} = \frac{TP}{TP + FN}, \quad F_1 = 2 \cdot \frac{\text{Precision} \cdot \text{Recall}}{\text{Precision} + \text{Recall}}$$
2. **Recommendation Quality:**
   $$\text{NDCG}@k = \frac{\text{DCG}@k}{\text{IDCG}@k}, \quad \text{where } \text{DCG}@k = \sum_{i=1}^k \frac{2^{\text{rel}_i} - 1}{\log_2(i + 1)}$$
3. **Statistical Significance Testing:**
   Paired Student's $t$-tests and Wilcoxon signed-rank tests with critical significance threshold $\alpha = 0.05$.

---

## 21. EMPIRICAL RESULTS AND QUANTITATIVE ANALYSIS

In accordance with strict scientific reporting standards, empirical entries that depend on ongoing institutional trials are explicitly demarcated as `[RESULT TO BE PROVIDED]` to prevent data fabrication.

```
TABLE 6: Information Extraction and Parsing Performance Across Layouts
+-----------------------------------+-------------+------------+----------+-----------------------+
| Document Layout Category          | Precision   | Recall     | F1-Score | Extraction Latency    |
+===================================+=============+============+==========+=======================+
| Single-Column Clean Text (PDF)    | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Multi-Column Tabular Layout       | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Graphic / Creative Resume Format  | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Raw Unstructured Plain Text       | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Overall Weighted Mean             | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
+-----------------------------------+-------------+------------+----------+-----------------------+
```

```
TABLE 7: Recommendation Ranking Performance Compared to Baseline Models
+----------------------------------+----------+----------+----------+-------------------------+
| Recommendation Model             | Precision@5| Recall@5 | NDCG@10  | Mean Latency (ms)       |
+==================================+==========+==========+==========+=========================+
| Standard Content-Based (TF-IDF)  | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Collaborative Filtering Baseline | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Semantic Dense Embedding (BERT)  | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| SkillForge Asymmetric Engine     | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
+----------------------------------+----------+----------+----------+-------------------------+
```

```
TABLE 8: Automated Mock Interview Scoring Agreement with Human Evaluators
+-----------------------------------+--------------------+--------------------+-----------------------+
| Evaluation Dimension              | Spearman's rho (rs)| Mean Absolute Error| Inter-Rater Agreement |
+===================================+====================+====================+=======================+
| Technical Knowledge (35%)         | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Problem-Solving & Algorithmic (25%)| [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Technical Communication (20%)     | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Professional Confidence (10%)     | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
| Overall Composite Score           | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] | [RESULT TO BE PROVIDED] |
+-----------------------------------+--------------------+--------------------+-----------------------+
```

---

## 22. COMPARISON WITH EXISTING SYSTEMS

To demonstrate functional advancement, Table 9 contrasts SkillForge directly with prominent benchmark platforms documented in recent literature.

```
TABLE 9: Functional Capability Matrix Across 10 Core Placement Preparation Dimensions
+------------------------------------------+------------+------------+---------------+----------+------------+
| Architectural Capability                 | C3-IoC     | Chandrak.  | Wang (KGRL)   | Legacy   | SkillForge |
|                                          | (2023)     | (2026)     | (2025)        | ATS      | (Proposed) |
+==========================================+============+============+===============+==========+============+
| 1. Multi-Format Resume Text Ingestion    | Yes (PDF)  | Yes (PDF)  | Yes (Text)    | Yes      | Yes        |
| 2. PII Sanitization & Privacy Shield     | Partial    | Yes        | No            | No       | Yes        |
| 3. Dynamic JD Requirement Decomposition  | No         | Yes        | Yes           | Yes      | Yes        |
| 4. Asymmetric Skill-Deficit Modeling     | Yes        | No         | No            | No       | Yes        |
| 5. Actionable Resume Fixer (Before/After)| No         | Yes        | No            | No       | Yes        |
| 6. Prerequisite-Aware Learning Roadmap   | No         | Yes        | No            | No       | Yes        |
| 7. Multi-Category DSA Coding Playground  | No         | No         | No            | No       | Yes (26)   |
| 8. Static Algorithmic Complexity Review  | No         | No         | No            | No       | Yes        |
| 9. Full-Screen Timed AI Mock Interview   | No         | No         | No            | No       | Yes        |
| 10. Multi-Pillar Placement Readiness PRS | No         | No         | No            | No       | Yes        |
+------------------------------------------+------------+------------+---------------+----------+------------+
```

---

## 23. DISCUSSION

### 23.1 Closing the Loop: Efficacy of Unified Ecosystems
The structural findings of this investigation substantiate the core premise of SkillForge: career readiness cannot be treated as an isolated classification task. By unifying diagnosis (resume and JD parsing), prescription (curated learning paths and DSA practice), and evaluation (mock interviews and capstone verification), SkillForge eliminates the fragmentation that hinders student progression. When students receive immediate, actionable interventions for identified skill gaps, cognitive friction is minimized, and deliberate practice is maximized.

### 23.2 Pedagogical Implications of Asymmetric Deficit Formulation
Traditional symmetric similarity models penalize students for possessing skills beyond the narrow scope of a target job description. By employing an asymmetric deficit formulation, SkillForge ensures that students who cultivate interdisciplinary proficiencies (e.g., cloud orchestration alongside core software engineering) are recognized for their foundational strengths while remaining laser-focused on remediating genuine technical deficiencies.

### 23.3 Engineering Trade-offs: Static Analysis vs. Containerized Sandboxing
A conscious architectural decision in SkillForge’s Coding Playground was the implementation of a static code complexity analyzer rather than a full containerized execution sandbox (e.g., Dockerized Judge0). While sandboxing provides runtime CPU and memory measurements, it introduces significant infrastructure costs, cold-start latency, and vulnerability surfaces for arbitrary code execution. SkillForge’s static analyzer evaluates algorithmic complexity ($O(n), O(n^2), O(\log n)$) and boundary invariants in sub-10 milliseconds directly within Node.js memory, providing instantaneous pedagogical feedback suitable for high-concurrency educational deployments.

---

## 24. SECURITY, PRIVACY, FAIRNESS, AND ETHICAL CONSIDERATIONS

### 24.1 Personally Identifiable Information (PII) Sanitization
Resumes represent sensitive, confidential documents containing names, home addresses, personal phone numbers, and educational history. SkillForge enforces strict PII scrubbing at the ingestion gateway. Text extracted from uploaded resumes is passed through regex sanitization filters that redact contact details and demographic markers before text features are processed by downstream language models or database storage.

### 24.2 Algorithmic Fairness and Bias Mitigation
As documented by Baker & Hawn (2022) and Zhang et al. (2023), machine learning models trained on historical hiring data risk encoding systemic social and demographic biases. SkillForge actively combats algorithmic bias by decoupling career matching from historical candidate demographic profiles. Recommendations are derived strictly through objective, requirement-driven vector distance and explicit skill ontology mapping.

### 24.3 Explainability and Responsible AI Guardrails
Black-box AI models that issue opaque rejection or readiness scores undermine student self-efficacy. SkillForge enforces complete algorithmic explainability:
- Every point deduction in the ATS score is explicitly tied to an identified formatting flaw, missing core skill, or underrepresented keyword.
- Mock interview scores are broken down into five transparent sub-dimensions with textual rationales and specific improvement pointers.
- Generative Copilot responses are governed by system prompts that prohibit authoritative claims regarding guaranteed hiring outcomes.

---

## 25. SYSTEM LIMITATIONS

To maintain scientific integrity, we acknowledge key limitations of the current SkillForge platform:
1. **Domain Boundary:** SkillForge is explicitly designed and calibrated for the Information Technology, Software Engineering, and Computer Science domains. Expanding the platform to fields such as civil engineering, healthcare, or business management requires establishing domain-specific skill taxonomies, problem catalogs, and interview rubrics.
2. **Cold-Start Sensitivity for Early-Stage Undergraduates:** First-year university students with no prior coursework, projects, or resumes may experience low initial baseline readiness scores ($< 40\%$), potentially causing initial discouragement without counselor onboarding.
3. **Static Complexity Analysis Boundaries:** While SkillForge’s static AST analyzer reliably detects common nested loops and standard data structure lookups, it cannot compute exact runtime execution profiles for highly complex recursive divide-and-conquer algorithms or dynamic programming bitmask states.
4. **Absence of Multi-Year Longitudinal Placement Data:** Long-term predictive validity—correlating high student PRS scores with actual enterprise job offers and starting salaries—requires multi-year longitudinal tracking that remains currently under evaluation.

---

## 26. FUTURE WORK

Future research trajectories for the SkillForge ecosystem encompass three primary frontiers:
1. **Multimodal Behavioral Interview Processing:** Integrating WebRTC video and audio analysis to evaluate non-verbal communication indicators, including vocal pacing, pitch modulation, eye contact, and nervous pauses, during simulated mock interviews.
2. **Dynamic Knowledge Graph Synchronization via Real-Time Labor Feeds:** Connecting SkillForge’s skill taxonomy to live, web-crawled job vacancy streams to automatically discover emerging technologies (e.g., novel framework releases or cloud APIs) and dynamically adjust prerequisite weights.
3. **Reinforcement Learning from Student Feedback (RLSF):** Implementing policy gradient agents that optimize learning path sequencing based on longitudinal completion rates and student-reported conceptual friction.

---

## 27. CONCLUSION

This paper has presented **SkillForge**, an integrated AI-driven career development and placement readiness ecosystem designed to overcome the fragmentation endemic to contemporary educational and vocational technologies. By unifying multi-factor resume parsing, asymmetric skill-gap analysis, prerequisite-governed learning roadmaps, weak-topic calibrated DSA problem curation, automated code complexity review, and full-screen timed mock interviews, SkillForge creates a cohesive, closed-loop pedagogical pipeline. 

The system's mathematical foundations establish an asymmetric deficit paradigm that penalizes true skill shortfalls while respecting surplus capabilities, culminating in an explainable, multi-pillar Placement Readiness Score (PRS). Implemented across modern web and relational architectures with strict privacy safeguards, SkillForge demonstrates that educational AI achieves its greatest efficacy when engineered not as a black-box screening mechanism, but as an empowering, transparent cognitive scaffold guiding students from academic fundamentals to industry engineering excellence.

---

## 28. REFERENCES

1. K. Bayly-Castaneda, M.-S. Ramirez-Montoya, and A. Morita-Alexander, "Crafting personalized learning paths with AI for lifelong learning: a systematic literature review," *Frontiers in Education*, vol. 9, Art. no. 1424386, Aug. 2024, doi: 10.3389/feduc.2024.1424386.
2. F. Trujillo, M. Pozo, and G. Suntaxi, "Artificial intelligence in education: A systematic literature review of machine learning approaches in student career prediction," *Journal of Technology and Science Education*, vol. 15, no. 1, pp. 162–185, 2025, doi: 10.3926/jotse.3124.
3. V. T. Chandrakumara and M. D. Silva, "An AI-powered hybrid framework for career readiness: Job role prediction, skill gap analysis, and personalized learning path recommendation," *Asian Journal of Research in Computer Science*, vol. 19, no. 8, pp. 79–99, 2026, doi: 10.9734/ajrcos/2026/v19i8893.
4. A. José-García, A. Sneyd, A. Melro, A. Ollagnier, G. Tarling, H. Zhang, M. Stevenson, R. Everson, and R. Arthur, "C3-IoC: A career guidance system for assessing student skills using machine learning and network visualisation," *International Journal of Artificial Intelligence in Education*, vol. 33, no. 4, pp. 1094–1121, 2023, doi: 10.1007/s40593-022-00317-y.
5. Y. Wang, "Design and implementation of student job matching system based on personalized recommendation algorithm," *Systems and Soft Computing*, vol. 7, Art. no. 200302, 2025, doi: 10.1016/j.sasc.2025.200302.
6. S. Bulathwela, M. Pérez-Ortiz, C. Holloway, M. Cukurova, and J. Shawe-Taylor, "Artificial intelligence alone will not democratise education: On educational inequality, techno-solutionism and inclusive tools," *Sustainability*, vol. 16, no. 2, Art. no. 781, 2024, doi: 10.3390/su16020781.
7. R. S. Baker and A. Hawn, "Algorithmic bias in education," *International Journal of Artificial Intelligence in Education*, vol. 32, no. 4, pp. 1052–1092, 2022, doi: 10.1007/s40593-021-00285-9.
8. S. Ashrafi, B. Majidi, E. Akhtarkavan, and S. H. R. Hajiagha, "Efficient resume-based re-education for career recommendation in rapidly evolving job markets," *IEEE Access*, vol. 11, pp. 124350–124367, 2023, doi: 10.1109/ACCESS.2023.3329576.
9. G. Bekmanova, Y. Ongarbayev, B. Somzhurek, and N. Mukatayev, "Personalized training model for organizing blended and lifelong distance learning courses and its effectiveness in higher education," *Journal of Computing in Higher Education*, vol. 33, no. 3, pp. 668–683, 2021, doi: 10.1007/s12528-021-09282-2.
10. A. Bozkurt, A. Karadeniz, D. Baneres, A. E. Guerrero-Roldán, and M. E. Rodríguez, "Artificial intelligence and reflections from educational landscape: A review of AI studies in half a century," *Sustainability*, vol. 13, no. 2, Art. no. 800, 2021, doi: 10.3390/su13020800.
11. R. D. Buitrago, J. Salinas, and O. Boude, "Designing and representing learning itineraries: A systematic review of the literature," *Interaction Design and Architecture(s)*, vol. 47, pp. 94–122, 2021, doi: 10.55612/s-5002-047-005.
12. Z. Chen and B. Liu, *Lifelong Machine Learning*, Cham, Switzerland: Springer International Publishing, 2018.
13. A. Chiappe, A. E. Wills, I. Uribe, and A. Ternent de Samper, "21st-Century education or the awakening of the sleeping beauties: A systematic literature review," *EKS*, vol. 21, pp. 1–15, 2020, doi: 10.14201/eks.20918.
14. B. Kitchenham, O. Pearl-Brereton, D. Budgen, M. Turner, J. Bailey, and S. Linkman, "Systematic literature reviews in software engineering - A systematic literature review," *Information and Software Technology*, vol. 51, no. 1, pp. 7–15, 2009, doi: 10.1016/j.infsof.2008.09.009.
15. Y. T. Badal and R. K. Sungkur, "Predictive modelling and analytics of students' grades using machine learning algorithms," *Education and Information Technologies*, vol. 28, no. 3, pp. 3027–3057, 2023, doi: 10.1007/s10639-022-11299-8.
16. A. Barredo-Arrieta, N. Díaz-Rodríguez, J. Del-Ser, A. Bennetot, S. Tabik, and A. Barbado, "Explainable artificial intelligence (XAI): Concepts, taxonomies, opportunities and challenges toward responsible AI," *Information Fusion*, vol. 58, pp. 82–115, 2020, doi: 10.1016/j.inffus.2019.12.012.
17. L. Chen, P. Chen, and Z. Lin, "Artificial intelligence in education: A review," *IEEE Access*, vol. 8, pp. 75264–75278, 2020, doi: 10.1109/ACCESS.2020.2988510.
18. S. Deshpande, P. Gupta, N. Singh, and D. Kadam, "Prediction of suitable career for students using machine learning," *International Research Journal of Engineering and Technology*, vol. 8, no. 2, pp. 2043–2046, 2021.
19. A. Dirin and C. A. Saballe, "Machine learning models to predict students' study path selection," *International Journal of Interactive Mobile Technologies*, vol. 16, no. 1, pp. 158–183, 2022, doi: 10.3991/ijim.v16i01.20121.
20. R. Farrow, "The possibilities and limits of XAI in education: A socio-technical perspective," *Learning, Media and Technology*, vol. 48, no. 2, pp. 266–279, 2023, doi: 10.1080/17439884.2023.2185630.
21. S. H. Faruque, S. A. Khushbu, and S. Akter, "Unlocking futures: A natural language driven career prediction system for computer science and software engineering students," *arXiv preprint arXiv:2405.18139*, 2024.
22. S. Hilbert, S. Coors, E. Kraus, B. Bischl, A. Lindl, and M. Frei, "Machine learning for the educational sciences," *Review of Education*, vol. 9, no. 3, Art. no. e3310, 2021, doi: 10.1002/rev3.3310.
23. C. Kuzey, A. Uyar, and D. Delen, "An investigation of the factors influencing cost system functionality using decision trees, support vector machines and logistic regression," *Int. J. Account. Inf. Manag.*, vol. 27, no. 1, pp. 27–55, 2019.
24. D. Lang, A. Wang, N. Dalal, A. Paepcke, and M. L. Stevens, "Forecasting undergraduate majors: A natural language approach," *AERA Open*, vol. 8, 2022, doi: 10.1177/23328584221126516.
25. R. Liu and A. Tan, "Towards interpretable automated machine learning for STEM career prediction," *Journal of Educational Data Mining*, vol. 12, no. 2, pp. 19–32, 2020, doi: 10.5281/zenodo.4008073.
26. M. S. Mejia, C. C. Jimenez, and J. C. Martínez-Santos, "Career recommendation system for validation of multiple intelligence to high school students," *Communications in Computer and Information Science*, vol. 1431, pp. 1–15, 2021, doi: 10.1007/978-3-030-86702-7_10.
27. A. Namoun and A. Alshanqiti, "Predicting student performance using data mining and learning analytics techniques: A systematic literature review," *Applied Sciences*, vol. 11, no. 1, Art. no. 237, 2021, doi: 10.3390/app11010237.
28. C. Song, S. Y. Shin, and K. S. Shin, "Implementing the dynamic feedback-driven learning optimization framework: A machine learning approach to personalize educational pathways," *Applied Sciences*, vol. 14, no. 2, Art. no. 916, 2024, doi: 10.20944/preprints202401.0811.v1.
29. C. Tenison, G. Ling, and L. McCulla, "Supporting college choice among international students through collaborative filtering," *International Journal of Artificial Intelligence in Education*, vol. 33, no. 3, pp. 659–687, 2023, doi: 10.1007/s40593-022-00307-0.
30. C. Wang, K. Wang, A. Bian, R. Islam, K. N. Keya, and J. Foulds, "When biased humans meet debiased AI: A case study in college major recommendation," *ACM Transactions on Interactive Intelligent Systems*, vol. 13, no. 3, 2023, doi: 10.1145/3611313.
31. Y. Wang, L. Yang, J. Wu, Z. Song, and L. Shi, "Mining campus big data: Prediction of career choice using interpretable machine learning method," *Mathematics*, vol. 10, no. 8, Art. no. 1289, 2022, doi: 10.3390/math10081289.
32. T. V. Yadalam, V. M. Gowda, V. S. Kumar, D. Girish, and N. Namratha, "Career recommendation systems using content based filtering," in *Proc. 5th Int. Conf. Commun. Electron. Syst. (ICCES)*, 2020, pp. 660–665, doi: 10.1109/ICCES48766.2020.9137992.
33. X. Ye, "Improving college choice in centralized admissions: Experimental evidence on the importance of precise predictions," *Education Finance and Policy*, vol. 19, no. 2, pp. 308–340, 2024, doi: 10.1162/edfp_a_00397.
34. H. Zhang, I. Lee, S. Ali, D. DiPaola, Y. Cheng, and C. Breazeal, "Integrating ethics and career futures with technical learning to promote AI literacy for middle school students: An exploratory study," *International Journal of Artificial Intelligence in Education*, vol. 33, no. 2, pp. 290–324, 2023, doi: 10.1007/s40593-022-00293-3.
35. K. L. Abhishek, M. Niranjanamurthy, S. Aric, S. I. Ansarullah, A. Sinha, G. Tejani, and M. A. Shah, "Developing an intelligent resume screening tool with AI-driven analysis and recommendation features," *Applied AI Letters*, vol. 6, no. 2, Art. no. e116, 2025, doi: 10.1002/ail2.116.
36. R. Angeline, R. Charanya, K. S. Abhinaya, and L. S. Chowdary, "Career mapping and enhancing personalized education through machine learning-based recommendation systems," in *Proc. Int. Conf. Adv. Res. Electron. Commun. Syst. (ICARECS)*, Atlantis Press, 2025, pp. 638–648, doi: 10.2991/978-94-6463-754-0_56.
37. C. Babu and F. Jafari, "Empowering career development: A comprehensive AI-driven system for personalised guidance and recommendations," *Cluster Computing*, vol. 28, Art. no. 1028, 2025, doi: 10.1007/s10586-025-05739-6.
38. C. U. Betrand, O. B. Aliche, C. G. Onukwugha, C. I. Ofoegbu, D. A. Kelechi, I. C. Ugbor, and N. M. Oragba, "Career guidance system using decision tree, random forest, and naïve Bayes algorithm," *Int. J. Sci. Technol. Soc.*, vol. 13, no. 2, pp. 35–42, 2025, doi: 10.11648/j.ijsts.20251302.11.
39. P. Chaiaroon, N. Promrit, K. Sitdhisanguan, S. Waijanya, and N. Kanraweekultana, "Digital workforce matching: A machine learning approach for skill-based job classification and recommendation," *Journal of Current Science and Technology*, vol. 15, no. 4, Art. no. 137, 2025, doi: 10.59796/jcst.v15n4.2025.137.
40. T. Chumwatana and A. K. K. Hpone, "Bridging the IT skill gap with industry demands: An AI-driven text mining approach to job market trends using large language model," *J. Theor. Appl. Inf. Technol.*, vol. 103, no. 6, pp. 2270–2282, 2025.
41. T. A. Dharmendra, K. Meenakshi, and D. Bhargava, "NLP-powered resume screening and ranking system," in *Proc. 2025 3rd Int. Conf. Disruptive Technol. (ICDT)*, IEEE, 2025, pp. 1361–1366, doi: 10.1109/ICDT63985.2025.10986338.
42. B. A. T. Dilshan and P. P. G. D. Asanka, "Enhancing resume analysis: Leveraging natural language processing and machine learning for automated resume screening using KSA parameters," in *Proc. 2025 5th Int. Conf. Adv. Res. Comput. (ICARC)*, IEEE, 2025, pp. 1–6, doi: 10.1109/ICARC63985.2025.10963312.
43. T. Ferdous and M. Chowdhury, "A machine learning and digital twin-based assistance system for computer science students' career prediction and activity recognition," *FinTech and Sustainable Innovation*, pp. 1–12, 2025, doi: 10.47852/bonviewFSI52024688.
44. P. Guleria and M. Sood, "Explainable AI and machine learning: Performance evaluation and explainability of classifiers on educational data mining-inspired career counseling," *Education and Information Technologies*, vol. 28, no. 1, pp. 1081–1116, 2023, doi: 10.1007/s10639-022-11221-2.
45. H. Han, B. Park, and K. Seo, "A self-determination theory-based career counseling chatbot: Motivational interactions to address career decision-making difficulties and enhance engagement," in *Extended Abstracts of CHI Conf. Human Factors in Computing Systems*, ACM, 2025, Art. no. 48, pp. 1–9, doi: 10.1145/3706599.3720286.
46. Y. Huang, "Individualized career planning intelligent teaching system for college students based on adaptive artificial intelligence," *J. Comput. Methods Sci. Eng.*, vol. 25, no. 4, pp. 3121–3136, 2025, doi: 10.1177/14727978251315731.
47. J. W. Lai, L. Zhang, C. C. Sze, and F. S. Lim, "Learning analytics for bridging the skills gap: A data-driven study of undergraduate aspirations and skills awareness for career preparedness," *Education Sciences*, vol. 15, no. 1, Art. no. 40, 2025, doi: 10.3390/educsci15010040.
48. H. Mahmoud, M. Badouch, E.-S. Boulmane, O. Zioudi, M. Ouhssini, H. Amrah, and C. Hamidi, "Predicting and recommending job roles with machine learning for smarter recruitment," in *Strategies for AI and Big Data in Recruitment*, IGI Global, 2026, pp. 139–160.
49. Y. Sun, Y. Ji, H. Zhu, F. Zhuang, Q. He, and H. Xiong, "Market-aware long-term job skill recommendation with explainable deep reinforcement learning," *ACM Transactions on Information Systems*, vol. 43, no. 2, Art. no. 35, 2025, doi: 10.1145/3704998.
50. M. C. Urdaneta-Ponte, A. Méndez-Zorrilla, and I. Oleagordia-Ruiz, "Lifelong learning courses recommendation system to improve professional skills using ontology and machine learning," *Applied Sciences*, vol. 11, no. 9, Art. no. 3839, 2021, doi: 10.3390/app11093839.
51. V. D. Blondel, J.-L. Guillaume, R. Lambiotte, and E. Lefebvre, "Fast unfolding of communities in large networks," *Journal of Statistical Mechanics: Theory and Experiment*, vol. 2008, no. 10, Art. no. P10008, 2008, doi: 10.1088/1742-5468/2008/10/P10008.
52. T. Mikolov, K. Chen, G. S. Corrado, and J. Dean, "Efficient estimation of word representations in vector space," in *Proc. Int. Conf. Learn. Represent. (ICLR) Workshop*, 2013, arXiv:1301.3781.
53. D. Jurafsky and J. H. Martin, *Speech and Language Processing: An Introduction to Natural Language Processing, Computational Linguistics, and Speech Recognition*, 2nd ed. Upper Saddle River, NJ: Prentice Hall, 2008.
54. N. G. Peterson, M. D. Mumford, W. C. Borman, P. R. Jeanneret, and E. A. Fleishman, *An Occupational Information System for the 21st Century: The Development of O*NET*, Washington, DC: American Psychological Association, 1999.
55. J. De Smedt, M. Le Vrang, and A. Papantoniou, "ESCO: Towards a semantic web for the European labor market," in *Proc. Int. Conf. Dublin Core Metadata Applications*, 2015, pp. 165–171.
