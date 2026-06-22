export interface ExtractedSkills {
  languages: string[];
  frameworks: string[];
  databases: string[];
  cloud: string[];
  tools: string[];
  softSkills: string[];
}

export interface ResumeAnalysisResult {
  id: string;
  timestamp: number;
  fileName: string;
  fileSize: string;
  rawText: string;
  atsScore: number;
  grade: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical';
  summary: string;
  strengths: string[];
  weaknesses: string[];
  skills: ExtractedSkills;
  suggestions: string[];
  recruiterFeedback: string;
  checklist: { id: string; text: string; done: boolean }[];
  interviewQuestions: {
    id: string;
    category: 'Technical' | 'Behavioral' | 'Project-based' | 'HR';
    question: string;
    guideline: string;
  }[];
  roadmap: {
    step: number;
    title: string;
    desc: string;
    status: 'completed' | 'in-progress' | 'upcoming';
  }[];
}

export interface JobMatchResult {
  matchScore: number;
  matchingSkills: string[];
  missingSkills: string[];
  gapAnalysis: string;
  improvements: string[];
}

// Skill dictionaries
const SKILL_DICT = {
  languages: [
    'JavaScript', 'TypeScript', 'Python', 'Java', 'C++', 'C#', 'Rust', 'Go', 
    'Golang', 'Ruby', 'PHP', 'Swift', 'Kotlin', 'SQL', 'HTML', 'CSS', 'Bash', 
    'Shell', 'R', 'Scala', 'Dart', 'TypeScript', 'HTML5', 'CSS3'
  ],
  frameworks: [
    'React', 'Angular', 'Vue', 'Next.js', 'Nuxt.js', 'Svelte', 'Express', 
    'Node.js', 'Django', 'Flask', 'FastAPI', 'Spring Boot', 'Laravel', 
    'NestJS', 'Tailwind CSS', 'Bootstrap', 'Redux', 'GraphQL', 'jQuery', 
    'Ruby on Rails', 'ASP.NET', 'Koa', 'Gatsby', 'SvelteKit'
  ],
  databases: [
    'PostgreSQL', 'Postgres', 'MongoDB', 'MySQL', 'Redis', 'Cassandra', 
    'DynamoDB', 'SQLite', 'Oracle', 'Neo4j', 'MariaDB', 'Firebase', 'Supabase'
  ],
  cloud: [
    'AWS', 'Azure', 'GCP', 'Google Cloud', 'Docker', 'Kubernetes', 'Terraform', 
    'Serverless', 'Lambda', 'Heroku', 'Vercel', 'Netlify', 'CI/CD', 'Ansible', 
    'Jenkins', 'AWS Lambda', 'Amazon EC2', 'Amazon S3'
  ],
  tools: [
    'Git', 'GitHub', 'GitLab', 'Webpack', 'Vite', 'Postman', 'Jira', 'Figma', 
    'npm', 'yarn', 'pnpm', 'Linux', 'VS Code', 'Docker Compose', 'Trello', 'Sentry'
  ],
  softSkills: [
    'Communication', 'Leadership', 'Teamwork', 'Agile', 'Scrum', 'Problem Solving', 
    'Collaboration', 'Critical Thinking', 'Time Management', 'Project Management', 
    'Mentoring', 'Public Speaking', 'Adaptability', 'Creativity', 'Active Listening'
  ]
};

// Help helper to count regex matches safely
function countOccurrences(text: string, words: string[]): string[] {
  const textLower = text.toLowerCase();
  const matched: string[] = [];
  
  words.forEach(word => {
    // Escape special regex chars
    const escaped = word.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
    // Boundary check, but allow letters/hashes (like C++)
    let regexStr = `\\b${escaped}\\b`;
    if (word.includes('+') || word.includes('#') || word.includes('.')) {
      regexStr = `(?<=^|[^a-zA-Z0-9])${escaped}(?=$|[^a-zA-Z0-9])`;
    }
    
    const regex = new RegExp(regexStr, 'gi');
    if (regex.test(textLower)) {
      matched.push(word);
    }
  });
  
  return matched;
}

// Action Verbs
const ACTION_VERBS = [
  'created', 'designed', 'implemented', 'optimized', 'managed', 'led', 
  'developed', 'architected', 'spearheaded', 'automated', 'improved', 
  'increased', 'reduced', 'coordinated', 'launched', 'delivered', 
  'streamlined', 'facilitated', 'engineered', 'analyzed'
];

export function analyzeResume(
  fileName: string,
  fileSize: number,
  text: string,
  targetRole: string = 'Software Engineer'
): ResumeAnalysisResult {
  const wordCount = text.split(/\s+/).filter(Boolean).length;
  
  // 1. Extract Skills
  const languages = countOccurrences(text, SKILL_DICT.languages);
  const frameworks = countOccurrences(text, SKILL_DICT.frameworks);
  const databases = countOccurrences(text, SKILL_DICT.databases);
  const cloud = countOccurrences(text, SKILL_DICT.cloud);
  const tools = countOccurrences(text, SKILL_DICT.tools);
  const softSkills = countOccurrences(text, SKILL_DICT.softSkills);
  
  const totalSkillsCount = 
    languages.length + frameworks.length + databases.length + 
    cloud.length + tools.length + softSkills.length;

  // 2. Formatting Check
  const hasEmail = /[\w.-]+@[\w.-]+\.\w+/.test(text);
  const hasPhone = /(\+?\d{1,4}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}/.test(text);
  const hasLinkedIn = /linkedin\.com\/in\//i.test(text);
  const hasGitHub = /github\.com\//i.test(text);
  
  const hasEducation = /education|university|college|degree|bachelor|master|phd/i.test(text);
  const hasExperience = /experience|employment|work history|career|history/i.test(text);
  const hasProjects = /projects|personal projects|key projects/i.test(text);
  const hasSkillsSection = /skills|technical skills|technologies|expertise/i.test(text);

  // 3. Action verb density
  const foundVerbs = countOccurrences(text, ACTION_VERBS);
  
  // Calculate scoring
  let score = 0;
  
  // Base structure & contacts (Max 25 pts)
  if (hasEmail) score += 5;
  if (hasPhone) score += 5;
  if (hasLinkedIn || hasGitHub) score += 5;
  if (hasEducation && hasExperience) score += 5;
  if (hasProjects && hasSkillsSection) score += 5;

  // Skills Score (Max 35 pts)
  // Optimal is 15+ distinct skills matching the dictionary
  const skillsScore = Math.min(35, Math.round((totalSkillsCount / 16) * 35));
  score += skillsScore;

  // Formatting & Length (Max 20 pts)
  // Optimal length is between 300 and 700 words
  if (wordCount >= 300 && wordCount <= 750) {
    score += 20;
  } else if (wordCount > 150 && wordCount < 1000) {
    score += 10;
  } else {
    score += 5;
  }

  // Impact and Action verbs (Max 20 pts)
  // Needs 6+ action verbs
  const verbScore = Math.min(20, Math.round((foundVerbs.length / 6) * 20));
  score += verbScore;

  // Enforce bounding [0, 100]
  score = Math.max(10, Math.min(100, score));

  // Determine Grade
  let grade: 'Excellent' | 'Good' | 'Needs Improvement' | 'Critical' = 'Needs Improvement';
  if (score >= 85) grade = 'Excellent';
  else if (score >= 70) grade = 'Good';
  else if (score >= 45) grade = 'Needs Improvement';
  else grade = 'Critical';

  // Format File Size
  const sizeKb = (fileSize / 1024).toFixed(1) + ' KB';

  // Generate Strengths & Weaknesses
  const strengths: string[] = [];
  const weaknesses: string[] = [];
  const suggestions: string[] = [];
  const checklist = [
    { id: 'chk_email', text: 'Include standard contact email address', done: hasEmail },
    { id: 'chk_phone', text: 'Provide a valid contact phone number', done: hasPhone },
    { id: 'chk_portfolio', text: 'Link professional links (GitHub or LinkedIn)', done: (hasLinkedIn || hasGitHub) },
    { id: 'chk_sections', text: 'Incorporate clear section headings (Education, Experience, Projects, Skills)', done: (hasEducation && hasExperience && hasProjects && hasSkillsSection) },
    { id: 'chk_verbs', text: 'Use at least 5 strong action/impact verbs', done: foundVerbs.length >= 5 },
    { id: 'chk_length', text: 'Keep total word count in the 300-750 sweet spot', done: (wordCount >= 300 && wordCount <= 750) },
    { id: 'chk_skills', text: 'Include at least 15 technical and professional skills', done: totalSkillsCount >= 15 }
  ];

  if (hasEmail && hasPhone && (hasLinkedIn || hasGitHub)) {
    strengths.push('Excellent contact information coverage, enabling recruiters to easily reach out.');
  } else {
    weaknesses.push('Incomplete contact details. Crucial details like a phone number, email, or GitHub portfolio link are missing.');
    suggestions.push('Ensure your phone number, email address, and professional links (LinkedIn/GitHub) are located clearly at the very top of your resume.');
  }

  if (totalSkillsCount >= 15) {
    strengths.push(`Rich skill profiling. Found a healthy density of ${totalSkillsCount} key technical capabilities.`);
  } else {
    weaknesses.push('Under-indexed skill section. The resume doesn\'t list enough core tech keywords for ATS search algorithms.');
    suggestions.push('Expand your Technical Skills matrix to include specific programming languages, frameworks, databases, and tools you have worked with.');
  }

  if (foundVerbs.length >= 5) {
    strengths.push('Strong narrative action orientation. Active verbs like ' + foundVerbs.slice(0, 3).join(', ') + ' help illustrate impact.');
  } else {
    weaknesses.push('Passive phrasing detected. Sentences use passive terms instead of powerful action-oriented results.');
    suggestions.push('Rewrite bullet points using impact verbs (e.g., "Led", "Designed", "Engineered", "Optimized") at the start of each line.');
  }

  if (wordCount >= 300 && wordCount <= 750) {
    strengths.push(`Ideal resume density (${wordCount} words). This conforms closely to standard recruiter readability norms.`);
  } else if (wordCount < 200) {
    weaknesses.push(`Too short (${wordCount} words). The resume lacks detail and descriptive impact of your responsibilities.`);
    suggestions.push('Add more details regarding your contributions, technology stacks used, and outcomes achieved in your projects.');
  } else {
    weaknesses.push(`Overly verbose (${wordCount} words). Long resumes can overwhelm automated ATS filters and human reviewers alike.`);
    suggestions.push('Consolidate experience bullets, trim conversational words, and aim for a clean, high-impact 1-page layout.');
  }

  // Add default suggestions if list is thin
  if (suggestions.length === 0) {
    suggestions.push('Quantify project results. Add metrics (e.g., "reduced latency by 30%", "boosted conversions by 15%") to prove your accomplishments.');
    suggestions.push('Incorporate cloud infrastructure tools like Docker or AWS to align better with modern deployment requirements.');
  }

  // Summary builder
  const summary = `Candidate's resume matches a ${grade} profile for a ${targetRole} position. It contains a total of ${totalSkillsCount} identified skills spanning ${languages.length} programming languages and ${frameworks.length} frameworks. The document length stands at ${wordCount} words. Key strengths include ${strengths.length > 0 ? strengths[0].toLowerCase().replace(/\.$/, '') : 'basic structure'}, but improvements can be made in areas such as ${weaknesses.length > 0 ? weaknesses[0].toLowerCase().replace(/\.$/, '') : 'quantifying accomplishments'}.`;

  // Recruiter feedback
  const recruiterFeedback = `As a technical recruiter reviewing this profile for a ${targetRole} role, here is my takeaway: The resume shows a ${grade.toLowerCase()} foundation. ${
    score >= 80 
      ? 'The structural formatting is clean, the technical vocabulary is modern, and the narrative demonstrates concrete contributions. This candidate will highly likely pass initial ATS screening.'
      : score >= 60
      ? 'The overall capabilities are there, but the presentation is holding the candidate back. We need to see more quantitative results. Instead of just listing what technologies were used, explain *how* they drove business value.'
      : 'The resume is missing major layout markers and tech keywords. It needs an immediate overhaul. Re-structure into standard single-column sections, expand the technology stack tags, and ensure professional links are clickable.'
  } Focus on adding modern cloud & testing skills if missing.`;

  // Interview Prep Questions
  const interviewQuestions = [
    {
      id: 'q_tech_1',
      category: 'Technical' as const,
      question: `Given your experience with ${languages[0] || 'your core language'}, how do you handle asynchronous programming, memory leaks, and performance optimization in production?`,
      guideline: `Describe a specific scenario in your projects where you used ${languages[0] || 'JavaScript/Python'} to improve speed, handle async loops, or debug a performance bottleneck. Explain the tools you used (e.g., Chrome DevTools, profilers).`
    },
    {
      id: 'q_tech_2',
      category: 'Technical' as const,
      question: `Your resume lists ${frameworks[0] || 'your framework'} and ${databases[0] || 'your database'}. How do you design schema structures, optimize queries, and implement state/caching between these layers?`,
      guideline: `Discuss data flow between the frontend and the database. Highlight index usage, normalization/denormalization trade-offs, and state management/cache policies.`
    },
    {
      id: 'q_proj_1',
      category: 'Project-based' as const,
      question: `Walk me through the architecture of your most challenging project. What were the key engineering trade-offs you made, and what would you change in hindsight?`,
      guideline: `Use the STAR method. Detail the architecture, why you chose specific tools, the limitations of your design, and how you managed features under time or technical constraints.`
    },
    {
      id: 'q_beh_1',
      category: 'Behavioral' as const,
      question: `Describe a time when you encountered a major technical roadblock or disagreement in a team project. How did you resolve it, and what did you learn?`,
      guideline: `Show collaborative leadership. Explain how you researched options, presented data-driven arguments, reached consensus, and focused on delivery rather than personal ego.`
    },
    {
      id: 'q_hr_1',
      category: 'HR' as const,
      question: `Why are you interested in this role, and how does your experience in ${languages.slice(0, 3).join(', ') || 'software engineering'} prepare you to make an impact on our product engineering team?`,
      guideline: `Align your personal learning goals with the company's product roadmap. Emphasize your adaptability, proactive coding habits, and eagerness to contribute from day one.`
    }
  ];

  // Career Roadmap
  const roadmap = [
    {
      step: 1,
      title: 'Fix formatting & metadata',
      desc: hasEmail && hasPhone ? 'Verify links and email formatting.' : 'Add active email, phone, and professional GitHub/LinkedIn links.',
      status: (hasEmail && hasPhone ? 'completed' as const : 'in-progress' as const)
    },
    {
      step: 2,
      title: 'Boost Technical Stack Density',
      desc: totalSkillsCount >= 15 ? 'Refine technology grouping.' : 'Add missing skills to technical section to pass automatic ATS filters.',
      status: (totalSkillsCount >= 15 ? 'completed' as const : 'in-progress' as const)
    },
    {
      step: 3,
      title: 'Quantify Experience Bullet Points',
      desc: 'Inject at least 3 metric-driven outcomes (e.g. "% improvement", "hours saved", "users reached") across project details.',
      status: 'upcoming' as const
    },
    {
      step: 4,
      title: 'Build Skill-Gap Projects',
      desc: `Build a project using ${cloud[0] || 'AWS/Docker'} and ${databases[0] || 'PostgreSQL'} to solidify backend deployment experience.`,
      status: 'upcoming' as const
    },
    {
      step: 5,
      title: 'Tailor Resume to Target Job Descriptions',
      desc: `Run the Job Matching module on Resume Forge for target roles and refine matches to reach a >80% matching rating.`,
      status: 'upcoming' as const
    }
  ];

  return {
    id: Math.random().toString(36).substr(2, 9),
    timestamp: Date.now(),
    fileName,
    fileSize: sizeKb,
    rawText: text,
    atsScore: score,
    grade,
    summary,
    strengths,
    weaknesses,
    skills: {
      languages,
      frameworks,
      databases,
      cloud,
      tools,
      softSkills
    },
    suggestions,
    recruiterFeedback,
    checklist,
    interviewQuestions,
    roadmap
  };
}

export function matchJobDescription(
  resumeSkills: ExtractedSkills,
  jobDescriptionText: string
): JobMatchResult {
  
  // Extract all dictionary skills present in the Job Description
  const jdLanguages = countOccurrences(jobDescriptionText, SKILL_DICT.languages);
  const jdFrameworks = countOccurrences(jobDescriptionText, SKILL_DICT.frameworks);
  const jdDatabases = countOccurrences(jobDescriptionText, SKILL_DICT.databases);
  const jdCloud = countOccurrences(jobDescriptionText, SKILL_DICT.cloud);
  const jdTools = countOccurrences(jobDescriptionText, SKILL_DICT.tools);
  const jdSoftSkills = countOccurrences(jobDescriptionText, SKILL_DICT.softSkills);
  
  const jdAllSkills = [
    ...jdLanguages, ...jdFrameworks, ...jdDatabases, 
    ...jdCloud, ...jdTools, ...jdSoftSkills
  ];
  
  const resumeAllSkills = [
    ...resumeSkills.languages, ...resumeSkills.frameworks, ...resumeSkills.databases,
    ...resumeSkills.cloud, ...resumeSkills.tools, ...resumeSkills.softSkills
  ];

  // If JD has no identifiable skills in our dictionary, extract custom keywords from it
  // Let's also do a simple keyword search for common tech titles/skills
  let targetJdSkills = Array.from(new Set(jdAllSkills));
  if (targetJdSkills.length === 0) {
    // Basic fallback: extract capitalized words as potential custom skills
    const customMatches = jobDescriptionText.match(/[A-Z][a-zA-Z0-9+#.]+/g) || [];
    const uniqueCustom = Array.from(new Set(customMatches))
      .filter(w => w.length > 2 && w.length < 15 && !['The', 'Job', 'We', 'Our', 'You', 'For', 'And', 'But', 'Requirements', 'Preferred', 'Qualifications'].includes(w));
    targetJdSkills = uniqueCustom.slice(0, 10);
  }

  // Calculate Matches and Misses
  const matchingSkills: string[] = [];
  const missingSkills: string[] = [];
  
  const resumeLowerSet = new Set(resumeAllSkills.map(s => s.toLowerCase()));
  
  targetJdSkills.forEach(skill => {
    if (resumeLowerSet.has(skill.toLowerCase())) {
      matchingSkills.push(skill);
    } else {
      missingSkills.push(skill);
    }
  });

  // Calculate Match Score
  let matchScore = 0;
  if (targetJdSkills.length > 0) {
    // Weighted scoring: match count / total required count
    matchScore = Math.round((matchingSkills.length / targetJdSkills.length) * 100);
  } else {
    // If JD is extremely short, base score on overall skill counts in resume
    matchScore = Math.min(80, Math.round((resumeAllSkills.length / 10) * 80));
  }

  // Ensure score isn't zero if some keywords match or text is long
  if (matchScore === 0 && jobDescriptionText.trim().length > 100) {
    matchScore = 30; // base score for generic match
  }
  matchScore = Math.max(10, Math.min(100, matchScore));

  // Build Gap Analysis
  let gapAnalysis = '';
  const improvements: string[] = [];

  if (missingSkills.length > 0) {
    gapAnalysis = `The job description highlights requirements for several technical skills that were not detected in your resume, most notably: ${missingSkills.slice(0, 4).join(', ')}. This creates a semantic skill gap that automated search filters may flag.`;
    
    missingSkills.slice(0, 4).forEach(skill => {
      improvements.push(`Incorporate "${skill}" into your project descriptions or skills matrix if you have prior exposure to it.`);
    });
  } else {
    gapAnalysis = 'Outstanding skill alignment! Your resume covers all key technologies identified in the job posting. Your profile will rank highly in automated search queries.';
  }

  if (matchingSkills.length > 0) {
    gapAnalysis += ` However, you have successfully matched critical technologies like ${matchingSkills.slice(0, 3).join(', ')}.`;
  }

  // Standard formatting improvements
  improvements.push('Tailor your resume summary to match the job title mentioned in the description.');
  improvements.push('Add context in your experience descriptions demonstrating how you applied the matching skills to resolve similar challenges.');

  return {
    matchScore,
    matchingSkills,
    missingSkills,
    gapAnalysis,
    improvements
  };
}
