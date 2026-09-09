const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const optionalAuth = require('../middleware/optionalAuth');
const User = require('../models/User');

// ── Optional parsers ────────────────────────────────────────────────────────
let mammoth, PDFDocument;
try { mammoth     = require('mammoth'); } catch (e) {}
try { PDFDocument = require('pdfkit');  } catch (e) {}

// ── Multer storage ─────────────────────────────────────────────────────────
const uploadsDir = process.env.VERCEL
  ? '/tmp/uploads'
  : path.join(__dirname, '..', 'uploads');

try {
  if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
} catch (_) {}

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    try {
      if (!fs.existsSync(uploadsDir)) fs.mkdirSync(uploadsDir, { recursive: true });
    } catch (_) {}
    cb(null, uploadsDir);
  },
  filename: (req, file, cb) => {
    const safeName = (file.originalname || 'resume').replace(/[^a-zA-Z0-9.-]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /pdf|doc|docx/i.test(path.extname(file.originalname || ''));
    ok ? cb(null, true) : cb(new Error('Only PDF, DOC, DOCX files are allowed'));
  }
});

// ── Text extraction ────────────────────────────────────────────────────────
async function extractText(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if ((ext === '.doc' || ext === '.docx') && mammoth) {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        if (result?.value && result.value.trim()) return result.value;
      } catch (_) {
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        if (result?.value && result.value.trim()) return result.value;
      }
    }

    if (ext === '.pdf') {
      // 1. Primary: pdf2json (fast, serverless-friendly, handles all PDF versions)
      try {
        const PDFParser = require('pdf2json');
        const textFromPdf = await new Promise((resolve) => {
          const parser = new PDFParser(null, 1);
          parser.on('pdfParser_dataReady', () => {
            try {
              const raw = parser.getRawTextContent();
              resolve(raw ? raw.replace(/----------------Page \(\d+\) Break----------------/g, '\n').trim() : '');
            } catch (_) {
              resolve('');
            }
          });
          parser.on('pdfParser_dataError', (err) => {
            console.warn('[pdf2json error]:', err?.parserError || err);
            resolve('');
          });
          parser.loadPDF(filePath);
        });

        if (textFromPdf && textFromPdf.length > 20) {
          console.log(`[pdf2json] Successfully extracted ${textFromPdf.length} characters`);
          return textFromPdf;
        }
      } catch (e0) {
        console.warn('[pdf2json attempt failed]:', e0.message);
      }

      // 2. Secondary: pdf-parse
      try {
        const buffer = fs.readFileSync(filePath);
        const pdf = require('pdf-parse');
        if (typeof pdf === 'function') {
          const data = await pdf(buffer);
          if (data?.text && data.text.trim()) {
            console.log(`[pdf-parse v1] Extracted ${data.text.length} characters`);
            return data.text;
          }
        }
      } catch (e1) {}

      // 3. Fallback: readable text chunks extraction
      try {
        const buffer = fs.readFileSync(filePath);
        const raw = buffer.toString('binary');
        const chunks = raw.match(/[(]([A-Za-z0-9 ,.\-@:/+#()&%$!?'"]{3,})[)]/g) ||
                       raw.match(/[A-Za-z0-9 ,.\-@\n\r:/+#()&%$!?'"]{4,}/g) || [];
        const extracted = chunks.join(' ').replace(/\\/g, '').trim();
        if (extracted.length > 50) {
          console.log(`[Text chunk fallback] Extracted ${extracted.length} characters`);
          return extracted;
        }
      } catch (_) {}
    }

    // Default plain text read
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Text extraction error:', err.message);
    return '';
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// REAL-WORLD INDUSTRY-STANDARD RESUME & ATS EVALUATION ENGINE
// ══════════════════════════════════════════════════════════════════════════════

const ROLE_DICTIONARY = {
  'Full Stack Developer': {
    primary: ['react', 'node', 'express', 'mongodb', 'fullstack', 'full-stack', 'full stack', 'next.js', 'nextjs', 'typescript', 'sql', 'rest api'],
    secondary: ['redux', 'graphql', 'tailwind', 'docker', 'postgresql', 'aws', 'prisma', 'ci/cd', 'webpack', 'jwt'],
    benchmarks: ['react', 'node', 'javascript', 'typescript', 'mongodb', 'sql', 'rest api', 'git', 'docker', 'html', 'css']
  },
  'Frontend Developer': {
    primary: ['react', 'vue', 'angular', 'javascript', 'typescript', 'html', 'css', 'sass', 'tailwind', 'figma', 'ui/ux', 'next.js', 'nextjs'],
    secondary: ['redux', 'webpack', 'vite', 'responsive design', 'accessibility', 'a11y', 'jest', 'cypress', 'web performance'],
    benchmarks: ['react', 'javascript', 'typescript', 'html5', 'css3', 'responsive design', 'git', 'webpack', 'figma', 'rest api']
  },
  'Backend Developer': {
    primary: ['node', 'express', 'python', 'django', 'flask', 'fastapi', 'java', 'spring boot', 'golang', 'c#', '.net', 'microservices', 'rest api'],
    secondary: ['postgresql', 'mysql', 'mongodb', 'redis', 'kafka', 'rabbitmq', 'docker', 'kubernetes', 'aws', 'graphql', 'system design'],
    benchmarks: ['rest api', 'sql', 'microservices', 'docker', 'git', 'redis', 'database design', 'authentication', 'testing']
  },
  'AI / Machine Learning Engineer': {
    primary: ['machine learning', 'deep learning', 'pytorch', 'tensorflow', 'keras', 'nlp', 'computer vision', 'llm', 'genai', 'python', 'scikit-learn'],
    secondary: ['langchain', 'huggingface', 'transformers', 'pandas', 'numpy', 'scipy', 'rag', 'vector database', 'fine-tuning', 'mlops'],
    benchmarks: ['python', 'pytorch', 'tensorflow', 'machine learning', 'deep learning', 'scikit-learn', 'pandas', 'numpy', 'data modeling']
  },
  'Data Scientist': {
    primary: ['data science', 'python', 'r', 'pandas', 'numpy', 'statistics', 'exploratory data analysis', 'eda', 'predictive modeling', 'machine learning'],
    secondary: ['sql', 'tableau', 'power bi', 'matplotlib', 'seaborn', 'jupyter', 'hypothesis testing', 'a/b testing', 'bigquery'],
    benchmarks: ['python', 'sql', 'statistics', 'pandas', 'machine learning', 'data visualization', 'tableau', 'hypothesis testing']
  },
  'Data Engineer': {
    primary: ['data engineer', 'etl', 'data pipeline', 'apache spark', 'spark', 'kafka', 'airflow', 'snowflake', 'databricks', 'hadoop', 'bigquery'],
    secondary: ['sql', 'python', 'scala', 'dbt', 'data warehouse', 'data lake', 'aws glue', 'redshift', 'postgresql'],
    benchmarks: ['sql', 'python', 'etl', 'spark', 'kafka', 'airflow', 'snowflake', 'data pipeline', 'data warehouse']
  },
  'Cloud & DevOps Engineer': {
    primary: ['devops', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'aws', 'azure', 'gcp', 'jenkins', 'ansible', 'helm', 'cloudformation'],
    secondary: ['linux', 'bash', 'prometheus', 'grafana', 'gitops', 'argocd', 'security', 'monitoring', 'site reliability', 'sre'],
    benchmarks: ['docker', 'kubernetes', 'terraform', 'ci/cd', 'aws', 'linux', 'git', 'monitoring', 'infrastructure as code']
  },
  'Mobile Developer': {
    primary: ['react native', 'flutter', 'android', 'ios', 'swift', 'kotlin', 'mobile app', 'xcode', 'android studio'],
    secondary: ['dart', 'objective-c', 'app store', 'google play', 'push notifications', 'mobile ui', 'sqlite'],
    benchmarks: ['react native', 'flutter', 'swift', 'kotlin', 'mobile development', 'api integration', 'git']
  },
  'Cybersecurity Engineer': {
    primary: ['cybersecurity', 'information security', 'penetration testing', 'vulnerability', 'firewall', 'siem', 'soc', 'owasp', 'encryption'],
    secondary: ['wireshark', 'burp suite', 'metasploit', 'network security', 'incident response', 'cissp', 'ceh', 'zero trust'],
    benchmarks: ['network security', 'vulnerability assessment', 'incident response', 'firewalls', 'encryption', 'compliance']
  },
  'QA & Automation Engineer': {
    primary: ['qa', 'quality assurance', 'selenium', 'cypress', 'playwright', 'automation testing', 'test automation', 'unit testing', 'test cases'],
    secondary: ['jest', 'mocha', 'postman', 'api testing', 'load testing', 'jmeter', 'bug tracking', 'jira', 'ci/cd'],
    benchmarks: ['selenium', 'cypress', 'automation testing', 'test cases', 'api testing', 'postman', 'git', 'jira']
  },
  'UI/UX Designer': {
    primary: ['ui/ux', 'user experience', 'user interface', 'figma', 'wireframing', 'prototyping', 'user research', 'usability testing'],
    secondary: ['design systems', 'adobe xd', 'sketch', 'interaction design', 'information architecture', 'heuristic evaluation'],
    benchmarks: ['figma', 'wireframing', 'prototyping', 'user research', 'design systems', 'usability testing']
  },
  'Software Engineer': {
    primary: ['software engineer', 'data structures', 'algorithms', 'object-oriented', 'oop', 'system design', 'git', 'design patterns'],
    secondary: ['java', 'c++', 'python', 'c#', 'unit testing', 'code review', 'agile', 'scrum', 'sql', 'linux'],
    benchmarks: ['data structures', 'algorithms', 'git', 'oop', 'problem solving', 'unit testing', 'sql', 'agile']
  }
};

const ALL_TECH_SKILLS = [
  // Languages
  'javascript', 'typescript', 'python', 'java', 'c++', 'c#', 'golang', 'rust', 'ruby', 'php', 'swift', 'kotlin', 'sql', 'r', 'dart', 'scala', 'bash', 'shell',
  // Frontend
  'react', 'next.js', 'nextjs', 'vue', 'angular', 'svelte', 'html', 'html5', 'css', 'css3', 'sass', 'tailwind', 'bootstrap', 'material-ui', 'redux', 'zustand', 'webpack', 'vite',
  // Backend & APIs
  'node.js', 'node', 'express', 'nest.js', 'nestjs', 'django', 'flask', 'fastapi', 'spring boot', 'spring', 'asp.net', 'graphql', 'rest api', 'grpc', 'microservices', 'websockets',
  // Databases
  'mongodb', 'postgresql', 'postgres', 'mysql', 'sqlite', 'redis', 'elasticsearch', 'cassandra', 'dynamodb', 'oracle', 'firebase', 'supabase', 'prisma',
  // Cloud & DevOps
  'aws', 'azure', 'gcp', 'docker', 'kubernetes', 'terraform', 'ci/cd', 'jenkins', 'github actions', 'gitlab ci', 'linux', 'nginx', 'apache', 'ansible',
  // AI & Data
  'machine learning', 'deep learning', 'pytorch', 'tensorflow', 'keras', 'pandas', 'numpy', 'scikit-learn', 'nlp', 'computer vision', 'spark', 'kafka', 'airflow', 'snowflake', 'bigquery',
  // Testing & Tools
  'git', 'github', 'gitlab', 'jira', 'figma', 'postman', 'jest', 'cypress', 'playwright', 'selenium', 'agile', 'scrum'
];

const POWER_ACTION_VERBS = [
  'accelerated', 'achieved', 'architected', 'automated', 'built', 'centralized', 'championed', 'collaborated',
  'conceptualized', 'consolidated', 'constructed', 'decreased', 'delivered', 'deployed', 'designed', 'developed',
  'devised', 'doubled', 'eliminated', 'engineered', 'enhanced', 'established', 'executed', 'expanded', 'expedited',
  'formulated', 'generated', 'guided', 'implemented', 'improved', 'increased', 'initiated', 'innovated', 'integrated',
  'launched', 'led', 'managed', 'maximized', 'mentored', 'migrated', 'modernized', 'optimized', 'orchestrated',
  'overhauled', 'pioneered', 'reduced', 'refactored', 'resolved', 'restructured', 'revamped', 'scaled', 'slashed',
  'spearheaded', 'streamlined', 'strengthened', 'transformed', 'upgraded'
];

const WEAK_PASSIVE_PHRASES = [
  'responsible for', 'worked on', 'helped with', 'assisted in', 'handled', 'tasked with', 'participated in',
  'involved in', 'duties included', 'was part of', 'familiar with', 'did', 'attempted'
];

function smartAnalyzeResume(text, fileName) {
  const rawText = (text || '').trim();
  const lowText = rawText.toLowerCase();
  const lines   = rawText.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  const words   = rawText.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // ── 1. Candidate Info Extraction ───────────────────────────────────────────
  let candidateName = '';
  for (const line of lines.slice(0, 5)) {
    const clean = line.replace(/[^a-zA-Z\s]/g, '').trim();
    const isHeaderWord = /resume|curriculum|vitae|page|contact|email|profile|phone/i.test(clean);
    if (clean.length >= 3 && clean.length <= 35 && clean.split(/\s+/).length >= 2 && clean.split(/\s+/).length <= 4 && !isHeaderWord) {
      candidateName = clean.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
      break;
    }
  }
  if (!candidateName && fileName) {
    const cleanFileName = fileName.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ').replace(/resume|cv/gi, '').trim();
    if (cleanFileName.length >= 3) {
      candidateName = cleanFileName.split(/\s+/).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
    }
  }
  if (!candidateName) candidateName = 'Candidate';

  const emailMatch    = rawText.match(/[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}/);
  const phoneMatch    = rawText.match(/(\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}|\+?\d{10,14}/);
  const linkedinMatch = lowText.includes('linkedin.com') || lowText.includes('linkedin');
  const githubMatch   = lowText.includes('github.com') || lowText.includes('github');
  const portfolioMatch= /portfolio|website|vercel\.app|netlify\.app|\.dev|\.me|\.io/i.test(rawText);

  // ── 2. Role & Seniority Detection ──────────────────────────────────────────
  let detectedRole = 'Full Stack Developer';
  let highestRoleScore = 0;

  for (const [role, config] of Object.entries(ROLE_DICTIONARY)) {
    let roleScore = 0;
    config.primary.forEach(kw => {
      if (lowText.includes(kw)) roleScore += 3;
    });
    config.secondary.forEach(kw => {
      if (lowText.includes(kw)) roleScore += 1;
    });

    if (roleScore > highestRoleScore) {
      highestRoleScore = roleScore;
      detectedRole = role;
    }
  }

  // Detect Experience Level
  let experienceLevel = 'Mid-Level Professional (2-5 yrs)';
  const seniorSignals = /senior|lead|principal|architect|staff engineer|director|head of|manager|7\+|8\+|10\+/i.test(rawText);
  const fresherSignals = /fresher|intern|internship|student|entry level|graduate|b\.tech|b\.e|expected graduation|currently pursuing|bachelor of|final year/i.test(rawText);

  if (seniorSignals && !fresherSignals) {
    experienceLevel = 'Senior / Lead Specialist (5+ yrs)';
  } else if (fresherSignals && !seniorSignals) {
    experienceLevel = 'Early Career / Graduate (0-2 yrs)';
  }

  // ── 3. Skills Analysis ─────────────────────────────────────────────────────
  const foundKeywords = [];
  ALL_TECH_SKILLS.forEach(skill => {
    const escaped = skill.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    const regex = new RegExp(`(^|[^a-zA-Z0-9_#+])${escaped}([^a-zA-Z0-9_#+]|$)`, 'i');
    if (regex.test(rawText)) {
      foundKeywords.push(skill);
    }
  });

  const targetBenchmarks = ROLE_DICTIONARY[detectedRole]?.benchmarks || ROLE_DICTIONARY['Software Engineer'].benchmarks;
  const missingKeywords = targetBenchmarks.filter(bm => !foundKeywords.some(fk => fk.toLowerCase() === bm.toLowerCase()));

  // ── 4. Impact & Quantification ─────────────────────────────────────────────
  const metricMatches = rawText.match(/\b\d+(\.\d+)?%|\b\d+x\b|\$[\d,]+|\b\d+\s*\+?(\s*(users|clients|customers|requests|transactions|million|billion|thousand|k|qps|ms|stars))\b/gi) || [];
  const metricsCount = metricMatches.length;

  const foundPowerVerbs = [];
  POWER_ACTION_VERBS.forEach(verb => {
    const regex = new RegExp(`\\b${verb}\\b`, 'i');
    if (regex.test(rawText)) foundPowerVerbs.push(verb);
  });

  const foundWeakPhrases = [];
  WEAK_PASSIVE_PHRASES.forEach(phrase => {
    if (lowText.includes(phrase)) foundWeakPhrases.push(phrase);
  });

  // ── 5. Section Presence Analysis ───────────────────────────────────────────
  const hasSummary     = /summary|objective|profile|about me|professional summary/i.test(lowText);
  const hasExperience  = /experience|employment|work history|professional experience|internship/i.test(lowText);
  const hasEducation   = /education|academic|degree|university|college|bachelor|master|b\.tech|b\.e|b\.sc|m\.sc/i.test(lowText);
  const hasSkills      = /skills|technical skills|technologies|tech stack|tools|competencies/i.test(lowText);
  const hasProjects    = /project|personal projects|portfolio projects|academic projects/i.test(lowText);
  const hasCerts       = /certif|credential|license|aws certified|azure certified|google certified/i.test(lowText);

  // ── 6. Realistic ATS Scoring Formulation ───────────────────────────────────
  // A: Contact & Header (20 pts)
  let contactScore = 0;
  if (emailMatch)    contactScore += 6;
  if (phoneMatch)    contactScore += 5;
  if (linkedinMatch) contactScore += 5;
  if (githubMatch || portfolioMatch) contactScore += 4;

  // B: Core Sections (25 pts)
  let sectionScore = 0;
  if (hasExperience) sectionScore += 8;
  if (hasEducation)  sectionScore += 6;
  if (hasSkills)     sectionScore += 5;
  if (hasProjects)   sectionScore += 4;
  if (hasSummary)    sectionScore += 2;

  // C: Impact & Metrics (25 pts)
  let impactScore = 0;
  if (metricsCount >= 5)       impactScore += 15;
  else if (metricsCount >= 3)  impactScore += 11;
  else if (metricsCount >= 1)  impactScore += 6;

  if (foundPowerVerbs.length >= 8)      impactScore += 10;
  else if (foundPowerVerbs.length >= 4) impactScore += 7;
  else if (foundPowerVerbs.length >= 1) impactScore += 4;

  // D: Technical Skill Match (20 pts)
  let skillScore = 0;
  const matchRatio = Math.min(1, foundKeywords.length / 12);
  skillScore = Math.round(matchRatio * 20);

  // E: Length & Formatting Health (10 pts)
  let lengthScore = 0;
  if (wordCount >= 300 && wordCount <= 850) {
    lengthScore = 10;
  } else if (wordCount >= 180 && wordCount <= 1200) {
    lengthScore = 7;
  } else if (wordCount > 0) {
    lengthScore = 3;
  }

  // Penalties
  let penalty = 0;
  if (wordCount < 120) penalty += 25;
  if (!emailMatch && !phoneMatch) penalty += 15;
  if (foundWeakPhrases.length > 2) penalty += 4;

  let overallScore = Math.max(15, Math.min(98, contactScore + sectionScore + impactScore + skillScore + lengthScore - penalty));
  let atsScore     = Math.max(15, Math.min(99, Math.round((contactScore * 0.25 + sectionScore * 0.35 + skillScore * 0.25 + lengthScore * 0.15) * 1.05)));

  // ── 7. Dynamic Strengths ───────────────────────────────────────────────────
  const strengths = [];
  if (metricsCount >= 3) {
    strengths.push(`High quantitative impact: detected ${metricsCount} measurable outcomes and metrics (%, $, scale stats).`);
  }
  if (foundPowerVerbs.length >= 5) {
    strengths.push(`Strong active phrasing: utilizes ${foundPowerVerbs.length} high-impact power verbs (e.g., ${foundPowerVerbs.slice(0, 3).join(', ')}).`);
  }
  if (foundKeywords.length >= 8) {
    strengths.push(`Strong domain keyword density: matched ${foundKeywords.length} core technical competencies for ${detectedRole}.`);
  }
  if (linkedinMatch && githubMatch) {
    strengths.push('Complete professional footprint: includes both LinkedIn and GitHub profile links for recruiter evaluation.');
  } else if (githubMatch) {
    strengths.push('Code verification: GitHub repository link present, allowing engineering managers to inspect code quality.');
  } else if (linkedinMatch) {
    strengths.push('Professional networking: LinkedIn profile linked, aiding recruiter background checks.');
  }
  if (hasProjects) {
    strengths.push('Hands-on project validation: distinct projects showcase practical application of your tech stack.');
  }
  if (hasCerts) {
    strengths.push('Industry credentials: certifications included demonstrating verified domain competency.');
  }
  if (wordCount >= 350 && wordCount <= 800) {
    strengths.push(`Optimal document length (${wordCount} words): concise 1-2 page structure preferred by ATS parsers.`);
  }

  // ── 8. Real-World Actionable Improvements ──────────────────────────────────
  const improvements = [];
  if (metricsCount < 3) {
    improvements.push('Quantify accomplishments: Add numbers, percentages, and metrics to your bullet points (e.g., "Boosted API response time by 35%").');
  }
  if (missingKeywords.length > 0) {
    improvements.push(`Incorporate key ${detectedRole} requirements: Consider adding in-demand skills such as ${missingKeywords.slice(0, 3).join(', ')}.`);
  }
  if (foundWeakPhrases.length > 0) {
    improvements.push(`Replace passive phrasing (${foundWeakPhrases.slice(0, 2).map(p => `"${p}"`).join(', ')}) with power verbs like "Architected", "Spearheaded", or "Optimized".`);
  }
  if (!linkedinMatch) {
    improvements.push('Add LinkedIn URL: Over 85% of technical recruiters cross-reference LinkedIn during screening.');
  }
  if (!githubMatch && ['Full Stack Developer', 'Frontend Developer', 'Backend Developer', 'Software Engineer'].includes(detectedRole)) {
    improvements.push('Link your GitHub profile: Crucial for software engineers to prove coding consistency and open-source contributions.');
  }
  if (!hasSummary) {
    improvements.push(`Include a 2-3 line Professional Summary at the top tailored specifically for ${detectedRole} opportunities.`);
  }
  if (wordCount < 250) {
    improvements.push(`Expand resume content: At ${wordCount} words, your resume is brief. Aim for 400-750 words with detailed project scope and responsibilities.`);
  }
  if (wordCount > 1000) {
    improvements.push(`Condense word count: At ${wordCount} words, your resume may exceed 2 pages. Focus on high-impact recent contributions.`);
  }

  // ── 9. Bullet Point Rewrites (Google X-Y-Z Method) ──────────────────────────
  const bulletRewrites = [
    {
      before: `Worked on backend APIs using ${foundKeywords[0] || 'Node.js'} and updated the database.`,
      after: `Architected scalable RESTful microservices using ${foundKeywords[0] || 'Node.js'}, reducing query latency by 45% for 50,000+ active users.`
    },
    {
      before: `Responsible for building front-end components and fixing bugs.`,
      after: `Engineered responsive, modular UI components in ${foundKeywords.find(k => ['react', 'vue', 'angular'].includes(k)) || 'React'}, boosting page load speed by 30% and test coverage to 88%.`
    }
  ];

  // ── 10. ATS Section Breakdown ──────────────────────────────────────────────
  const sectionBreakdown = [
    { name: 'Contact & Links', status: (emailMatch && phoneMatch && (linkedinMatch || githubMatch)) ? 'pass' : 'warning', details: `${emailMatch ? 'Email ✓ ' : 'Email ✗ '}${phoneMatch ? 'Phone ✓ ' : 'Phone ✗ '}${linkedinMatch ? 'LinkedIn ✓ ' : ''}${githubMatch ? 'GitHub ✓ ' : ''}` },
    { name: 'Work Experience', status: hasExperience ? 'pass' : 'warning', details: hasExperience ? `${metricsCount} quantified metrics found` : 'No clear Experience header' },
    { name: 'Technical Skills', status: foundKeywords.length >= 6 ? 'pass' : 'warning', details: `${foundKeywords.length} skills matched for ${detectedRole}` },
    { name: 'Projects', status: hasProjects ? 'pass' : 'warning', details: hasProjects ? 'Projects section detected' : 'Add 2-3 featured projects' },
    { name: 'Education', status: hasEducation ? 'pass' : 'warning', details: hasEducation ? 'Degree & academic history found' : 'Education details missing' },
    { name: 'Professional Summary', status: hasSummary ? 'pass' : 'warning', details: hasSummary ? 'Summary present' : 'Recommend adding a targeted 3-line summary' }
  ];

  // ── 11. Tailored ATS Tips ──────────────────────────────────────────────────
  const atsTips = [
    `Target role optimization: Ensure "${detectedRole}" or your exact target job title appears verbatim in your headline and summary.`,
    'Single-column structure: ATS parsing software can misread multi-column grids or creative sidebars. Stick to standard clean vertical hierarchy.',
    'Standardize dates & headings: Use standard formats like "Jan 2022 - Present" and conventional headers ("Experience", "Skills", "Education").',
    'Action + Context + Impact: Format every work experience bullet with the formula: [Power Verb] + [What you built] + [Quantified Business Outcome].',
    'Plain text PDF formatting: Ensure text in your PDF is selectable (not flattened into an image) so ATS crawlers can parse every token.'
  ];

  // ── 12. Dynamic Executive Summary ──────────────────────────────────────────
  const scoreCategory = overallScore >= 85 ? 'Exceptional' : overallScore >= 72 ? 'Strong' : overallScore >= 55 ? 'Competitive' : 'Needs Optimization';
  const summary = `${candidateName ? candidateName + ' — ' : ''}${scoreCategory} ${detectedRole} profile (${experienceLevel}). `
    + `Your resume scored ${overallScore}/100 with an ATS Compatibility Rating of ${atsScore}%. `
    + `Extracted ${foundKeywords.length} matching technical competencies with ${metricsCount} quantified achievements across ${wordCount} words. `
    + (improvements.length > 0 ? `Key priority: ${improvements[0]}` : 'Strong candidate presentation ready for submission.');

  return {
    score: overallScore,
    atsScore,
    overallScore,
    candidateName,
    detectedRole,
    experienceLevel,
    wordCount,
    metricsCount,
    strengths: strengths.slice(0, 6),
    improvements: improvements.slice(0, 6),
    foundKeywords: foundKeywords.slice(0, 24),
    missingKeywords: missingKeywords.slice(0, 8),
    sectionBreakdown,
    bulletRewrites,
    atsTips,
    summary
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/resume/upload  — Upload + Smart AI analyze (works for guests & users)
// ══════════════════════════════════════════════════════════════════════════════
router.post('/upload', optionalAuth, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path || path.join(uploadsDir, req.file.filename);

  try {
    console.log('📄 Extracting text from:', req.file.originalname);
    const text = await extractText(filePath);
    const wordCount = text ? text.split(/\s+/).filter(Boolean).length : 0;
    console.log(`📝 Extracted ${wordCount} words from ${req.file.originalname}`);

    const analysis = smartAnalyzeResume(text, req.file.originalname);
    analysis.analyzedAt   = new Date();
    analysis.overallScore = analysis.score;
    console.log(`✅ Analysis complete — Candidate: "${analysis.candidateName}", Score: ${analysis.score}, Role: ${analysis.detectedRole}`);

    // Persist for logged-in users
    if (req.user?._id) {
      try {
        const user = await User.findById(req.user._id);
        if (user) {
          user.resume = user.resume || {};
          user.resume.uploaded     = true;
          user.resume.lastAnalyzed = new Date();
          user.resume.filename     = req.file.filename;
          user.resume.score        = analysis.score;
          user.resume.analysisData = analysis;
          await user.save();
        }
      } catch (dbErr) {
        console.error('DB save error:', dbErr.message);
      }
    }

    // Clean up temp file
    try { fs.unlinkSync(filePath); } catch (_) {}

    return res.json({ message: 'Resume analyzed successfully', analysis });

  } catch (error) {
    console.error('Resume analysis error:', error);
    try { if (fs.existsSync(filePath)) fs.unlinkSync(filePath); } catch (_) {}
    return res.status(500).json({ message: 'Failed to analyze resume: ' + error.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/resume/analysis  — Fetch last saved analysis (logged-in users)
// ══════════════════════════════════════════════════════════════════════════════
router.get('/analysis', optionalAuth, async (req, res) => {
  if (!req.user?._id) return res.status(404).json({ message: 'No previous analysis found.' });
  try {
    const user = await User.findById(req.user._id).select('resume');
    if (user?.resume?.analysisData) return res.json({ analysis: user.resume.analysisData });
    res.status(404).json({ message: 'No previous analysis found.' });
  } catch (error) {
    res.status(500).json({ message: 'Server error', error: error.message });
  }
});

// ══════════════════════════════════════════════════════════════════════════════
// GET /api/resume/report/pdf  — Download analysis as PDF
// ══════════════════════════════════════════════════════════════════════════════
router.get('/report/pdf', optionalAuth, async (req, res) => {
  if (!req.user?._id) return res.status(401).json({ message: 'Sign in to download PDF reports.' });
  try {
    const user = await User.findById(req.user._id).select('resume');
    if (!user?.resume?.analysisData) return res.status(404).json({ message: 'No analysis found.' });
    const analysis = user.resume.analysisData;

    if (!PDFDocument) return res.status(500).json({ message: 'PDF generation not available.' });

    const doc = new PDFDocument({ margin: 40 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Resume_Analysis_Report.pdf');
    doc.pipe(res);

    doc.fontSize(22).font('Helvetica-Bold').text('Resume Analysis & ATS Audit Report', { align: 'center' });
    doc.moveDown(0.4);
    doc.fontSize(11).font('Helvetica').text(`Candidate: ${analysis.candidateName || 'Candidate'}  |  Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    if (analysis.detectedRole) {
      doc.fontSize(11).text(`Target Domain: ${analysis.detectedRole} (${analysis.experienceLevel || 'Mid-Level'})`, { align: 'center' });
    }
    doc.moveDown(1.5);

    doc.fontSize(16).font('Helvetica-Bold').text('Executive Scores');
    doc.moveDown(0.3);
    doc.fontSize(28).font('Helvetica-Bold').fillColor('#4f46e5').text(`${analysis.score}/100`, { align: 'center' });
    doc.fillColor('#1e293b').fontSize(12).font('Helvetica').text(`ATS Compatibility Match: ${analysis.atsScore}%`, { align: 'center' });
    doc.moveDown(1.2);

    doc.fontSize(14).font('Helvetica-Bold').text('Executive Summary');
    doc.fontSize(10).font('Helvetica').text(analysis.summary || '');
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Key Strengths');
    doc.fontSize(10).font('Helvetica');
    (analysis.strengths || []).forEach((s, i) => doc.text(`• ${s}`));
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Actionable Improvements');
    doc.fontSize(10).font('Helvetica');
    (analysis.improvements || []).forEach((item, i) => doc.text(`• ${item}`));
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Detected Keywords');
    doc.fontSize(10).font('Helvetica').text((analysis.foundKeywords || []).join(', ') || 'None');
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('Missing Role Keywords');
    doc.fontSize(10).font('Helvetica').text((analysis.missingKeywords || []).join(', ') || 'None');
    doc.moveDown(1);

    doc.fontSize(14).font('Helvetica-Bold').text('ATS Optimization Tips');
    doc.fontSize(10).font('Helvetica');
    (analysis.atsTips || []).forEach((t, i) => doc.text(`${i + 1}. ${t}`));

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
});

module.exports = router;