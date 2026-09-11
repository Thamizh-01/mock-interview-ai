const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const optionalAuth = require('../middleware/optionalAuth');

// ── Optional parsers ────────────────────────────────────────────────────────
let mammoth;
try { mammoth = require('mammoth'); } catch (e) {}

// ── Multer storage for interview resumes ────────────────────────────────────
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
    cb(null, `interview-${Date.now()}-${safeName}`);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    const ok = /pdf|doc|docx|txt/i.test(path.extname(file.originalname || ''));
    ok ? cb(null, true) : cb(new Error('Only PDF, DOC, DOCX, or TXT files are allowed'));
  }
});

// ── Text Extraction ─────────────────────────────────────────────────────────
async function extractTextFromFile(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  try {
    if (ext === '.txt') {
      return fs.readFileSync(filePath, 'utf-8');
    }

    if ((ext === '.doc' || ext === '.docx') && mammoth) {
      try {
        const result = await mammoth.extractRawText({ path: filePath });
        if (result?.value?.trim()) return result.value;
      } catch (_) {
        const buffer = fs.readFileSync(filePath);
        const result = await mammoth.extractRawText({ buffer });
        if (result?.value?.trim()) return result.value;
      }
    }

    if (ext === '.pdf') {
      try {
        const PDFParser = require('pdf2json');
        const textFromPdf = await new Promise((resolve) => {
          const parser = new PDFParser();
          parser.on('pdfParser_dataReady', (pdfData) => {
            try {
              let fullText = '';
              if (pdfData?.Pages && Array.isArray(pdfData.Pages)) {
                for (const page of pdfData.Pages) {
                  if (!page.Texts || !Array.isArray(page.Texts)) continue;
                  const sortedTexts = [...page.Texts].sort((a, b) => {
                    if (Math.abs(a.y - b.y) > 0.4) return a.y - b.y;
                    return a.x - b.x;
                  });
                  const pageLines = [];
                  let currentLine = [];
                  let lastY = -1;
                  for (const item of sortedTexts) {
                    try {
                      const decoded = decodeURIComponent(item.R.map(r => r.T).join(''));
                      if (lastY !== -1 && Math.abs(item.y - lastY) > 0.4) {
                        pageLines.push(currentLine.join(' '));
                        currentLine = [];
                      }
                      currentLine.push(decoded);
                      lastY = item.y;
                    } catch (_) {}
                  }
                  if (currentLine.length > 0) pageLines.push(currentLine.join(' '));
                  fullText += pageLines.join('\n') + '\n';
                }
              }
              if (!fullText.trim()) {
                fullText = (parser.getRawTextContent() || '').replace(/----------------Page \(\d+\) Break----------------/g, '\n');
              }
              resolve(fullText.trim());
            } catch (_) {
              resolve('');
            }
          });
          parser.on('pdfParser_dataError', () => resolve(''));
          parser.loadPDF(filePath);
        });
        if (textFromPdf && textFromPdf.length > 40) return textFromPdf;
      } catch (_) {}

      try {
        const pdfParse = require('pdf-parse');
        const buffer = fs.readFileSync(filePath);
        const parsed = await pdfParse(buffer);
        if (parsed?.text?.trim()) return parsed.text.trim();
      } catch (_) {}
    }
  } catch (err) {
    console.error('Text extraction failed:', err);
  }
  return '';
}

// ── Intelligent Resume Profiler ─────────────────────────────────────────────
function analyzeResumeProfile(rawText) {
  const text = rawText || '';
  const lines = text.split('\n').map(l => l.trim()).filter(Boolean);

  // 1. Candidate Name Detection
  let candidateName = 'Candidate';
  for (let i = 0; i < Math.min(5, lines.length); i++) {
    const line = lines[i];
    if (
      line.length > 2 &&
      line.length < 35 &&
      !/@|http|www|github|linkedin|phone|\+?\d{9,}/i.test(line) &&
      !/resume|curriculum|vitae|profile|summary|experience/i.test(line)
    ) {
      candidateName = line.replace(/[^a-zA-Z\s.'-]/g, '').trim();
      if (candidateName) break;
    }
  }
  if (!candidateName) candidateName = 'Candidate';

  // 2. Technical Skills Extractor
  const knownTech = [
    { name: 'React.js', regex: /\b(react|react\.js|reactjs|redux|next\.js|nextjs)\b/i },
    { name: 'Node.js', regex: /\b(node|node\.js|nodejs|express|express\.js)\b/i },
    { name: 'JavaScript', regex: /\b(javascript|es6|es2020|vanilla js)\b/i },
    { name: 'TypeScript', regex: /\b(typescript|ts)\b/i },
    { name: 'Python', regex: /\b(python|django|fastapi|flask|numpy|pandas)\b/i },
    { name: 'Java', regex: /\b(java|spring|spring boot|hibernate|maven)\b/i },
    { name: 'C++', regex: /\b(c\+\+|cpp|stl)\b/i },
    { name: 'Go / Golang', regex: /\b(golang|goroutines)\b/i },
    { name: 'PostgreSQL', regex: /\b(postgres|postgresql)\b/i },
    { name: 'MongoDB', regex: /\b(mongo|mongodb|mongoose)\b/i },
    { name: 'MySQL / SQL', regex: /\b(mysql|sql server|sqlite|rdbms)\b/i },
    { name: 'Redis', regex: /\b(redis|caching|memcached)\b/i },
    { name: 'Docker', regex: /\b(docker|containerization|docker-compose)\b/i },
    { name: 'Kubernetes', regex: /\b(kubernetes|k8s|helm)\b/i },
    { name: 'AWS Cloud', regex: /\b(aws|ec2|s3|lambda|cloudformation|dynamodb)\b/i },
    { name: 'Azure / GCP', regex: /\b(azure|gcp|google cloud)\b/i },
    { name: 'GraphQL', regex: /\b(graphql|apollo)\b/i },
    { name: 'REST APIs', regex: /\b(rest|restful|api design)\b/i },
    { name: 'CI/CD & DevOps', regex: /\b(ci\/cd|jenkins|github actions|gitlab ci)\b/i },
    { name: 'Machine Learning', regex: /\b(machine learning|deep learning|tensorflow|pytorch|scikit-learn)\b/i },
    { name: 'Cybersecurity', regex: /\b(cybersecurity|owasp|penetration testing|oauth|jwt|encryption)\b/i },
    { name: 'System Design', regex: /\b(microservices|system design|distributed systems|event-driven|kafka|rabbitmq)\b/i }
  ];

  const detectedSkills = knownTech
    .filter(tech => tech.regex.test(text))
    .map(tech => tech.name);

  if (detectedSkills.length === 0) {
    detectedSkills.push('Full Stack Development', 'Problem Solving', 'REST APIs', 'Git');
  }

  // 3. Experience Level & Projects Extraction
  let experienceLevel = 'Mid-Level';
  if (/senior|lead|principal|architect|staff engineer|8\+|7\+|10\+/i.test(text)) {
    experienceLevel = 'Senior';
  } else if (/intern|student|freshman|entry|junior|graduate|0-1|1-2/i.test(text)) {
    experienceLevel = 'Junior / Entry-Level';
  }

  // Extract project snippets
  const projects = [];
  const projectRegex = /(?:project|experience|work history|portfolio)[\s\S]*?(?:education|certifications|skills|$)/i;
  const projectSection = text.match(projectRegex);
  const searchArea = projectSection ? projectSection[0] : text;

  const projectLines = searchArea.split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 25 && /built|developed|designed|implemented|created|led|optimized|migrated|engineered|automated/i.test(l));

  for (let i = 0; i < Math.min(3, projectLines.length); i++) {
    projects.push(projectLines[i].replace(/^[-•*]\s*/, ''));
  }

  if (projects.length === 0) {
    projects.push("End-to-end full stack application with responsive UI, secure APIs, and database integration.");
  }

  // 4. Primary Domain Recommendation
  let primaryDomain = 'Full Stack Development';
  if (/machine learning|deep learning|data science|nlp|computer vision/i.test(text)) primaryDomain = 'Data Science & AI';
  else if (/cybersecurity|infosec|penetration testing|security analyst/i.test(text)) primaryDomain = 'Cybersecurity & InfoSec';
  else if (/devops|cloud architect|sre|kubernetes|terraform/i.test(text)) primaryDomain = 'DevOps & Cloud';
  else if (/backend|microservices|distributed|spring boot|fastapi/i.test(text)) primaryDomain = 'Backend Engineering';
  else if (/frontend|react|vue|css|ui\/ux|tailwind/i.test(text)) primaryDomain = 'Frontend Engineering';
  else if (/mobile|ios|android|flutter|react native/i.test(text)) primaryDomain = 'Mobile App Development';

  return {
    candidateName,
    primaryDomain,
    experienceLevel,
    skills: detectedSkills.slice(0, 12),
    projects,
  };
}

// ── Extract Candidate Signals (Technologies, Metrics, Claims) ───────────────
function extractCandidateSignals(text) {
  const t = text || '';
  const detectedTech = [];
  const knownTech = [
    'redis', 'kafka', 'rabbitmq', 'docker', 'kubernetes', 'aws', 'gcp', 'azure',
    'mongodb', 'postgresql', 'mysql', 'sql', 'node.js', 'node', 'express', 'react',
    'next.js', 'typescript', 'python', 'django', 'fastapi', 'flask', 'golang', 'go',
    'java', 'spring boot', 'graphql', 'rest', 'microservices', 'websockets', 's3',
    'dynamodb', 'elasticsearch', 'ci/cd', 'nginx', 'grpc'
  ];

  for (const tech of knownTech) {
    const reg = new RegExp(`\\b${tech.replace('.', '\\.')}\\b`, 'i');
    if (reg.test(t)) detectedTech.push(tech.charAt(0).toUpperCase() + tech.slice(1));
  }

  // Detect metrics (percentages, requests, latency, scale)
  const metricMatches = t.match(/\b(\d+(?:,\d+)?(?:\.\d+)?\s*(?:%|percent|k|req\/sec|requests\/minute|requests|ms|events\/sec|qps|users|servers|nodes|seconds|minutes|hours))\b/gi) || [];

  // Detect architecture keywords
  const archKeywords = [
    'cache-aside', 'caching', 'indexing', 'compound index', 'sharding', 'replication',
    'partitioning', 'async', 'concurrency', 'bottleneck', 'latency', 'idempotent',
    'transaction', 'deadlock', 'race condition', 'queue', 'event-driven', 'circuit breaker',
    'rate limiting', 'p99', 'throughput', 'load balancer', 'failover'
  ].filter(w => new RegExp(`\\b${w}\\b`, 'i').test(t));

  return {
    detectedTech: Array.from(new Set(detectedTech)),
    metrics: metricMatches.slice(0, 3),
    archKeywords
  };
}

// ── 1. Speech Delivery & Fluency Intelligence ───────────────────────────────
function analyzeSpeechPatterns(text = '', durationSeconds = 0) {
  const t = text || '';
  const words = t.trim().split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  const fillerPatterns = [
    { regex: /\bum\b/gi, word: 'um' },
    { regex: /\buh\b/gi, word: 'uh' },
    { regex: /\blike\b/gi, word: 'like' },
    { regex: /\byou know\b/gi, word: 'you know' },
    { regex: /\bbasically\b/gi, word: 'basically' },
    { regex: /\bliterally\b/gi, word: 'literally' },
    { regex: /\bactually\b/gi, word: 'actually' },
    { regex: /\bsort of\b/gi, word: 'sort of' },
    { regex: /\bkind of\b/gi, word: 'kind of' },
    { regex: /\bi mean\b/gi, word: 'i mean' },
    { regex: /\bright\b/gi, word: 'right' }
  ];

  const fillerCounts = {};
  let totalFillers = 0;

  for (const fp of fillerPatterns) {
    const matches = t.match(fp.regex);
    if (matches && matches.length > 0) {
      fillerCounts[fp.word] = (fillerCounts[fp.word] || 0) + matches.length;
      totalFillers += matches.length;
    }
  }

  const fillerList = Object.entries(fillerCounts)
    .map(([word, count]) => ({ word, count }))
    .sort((a, b) => b.count - a.count);

  let wpm = 135;
  if (durationSeconds > 0 && wordCount > 0) {
    wpm = Math.round((wordCount / durationSeconds) * 60);
  } else if (wordCount > 0) {
    wpm = 135;
  }

  let paceVerdict = 'optimal';
  let paceText = 'Optimal Pace (120 - 165 WPM)';
  if (wpm < 115) {
    paceVerdict = 'slow';
    paceText = 'Deliberate / Slow Pace (<115 WPM)';
  } else if (wpm > 170) {
    paceVerdict = 'fast';
    paceText = 'Fast / Rushing Pace (>170 WPM)';
  }

  let fillerVerdict = 'Clean & crisp delivery (0 filler words)';
  if (totalFillers === 0) {
    fillerVerdict = 'Clean & crisp delivery (0 filler words)';
  } else if (totalFillers <= 2) {
    fillerVerdict = `Minimal fillers (${totalFillers} detected)`;
  } else {
    fillerVerdict = `High filler density (${totalFillers} detected: ${fillerList.map(f => `"${f.word}" x${f.count}`).join(', ')})`;
  }

  return {
    wordCount,
    durationSeconds,
    wpm,
    paceVerdict,
    paceText,
    fillerCount: totalFillers,
    fillerList,
    fillerVerdict
  };
}

// ── 2. Job Description Matching & Skill Gap Analysis ────────────────────────
function analyzeJobDescription(jdText = '', profile = {}) {
  const jd = (jdText || '').trim();
  if (!jd || jd.length < 15) {
    return null;
  }

  const knownSkills = [
    'kubernetes', 'docker', 'aws', 'gcp', 'azure', 'kafka', 'redis', 'rabbitmq',
    'postgresql', 'mongodb', 'mysql', 'sql', 'dynamodb', 'elasticsearch',
    'microservices', 'distributed systems', 'system design', 'graphql', 'rest api', 'grpc',
    'react', 'next.js', 'typescript', 'javascript', 'node.js', 'python', 'golang', 'java',
    'spring boot', 'django', 'fastapi', 'caching', 'ci/cd', 'terraform',
    'unit testing', 'jest', 'cypress', 'web security', 'oauth', 'jwt', 'observability',
    'prometheus', 'grafana', 'datadog', 'agile', 'scrum'
  ];

  const detectedJdSkills = [];
  for (const skill of knownSkills) {
    const reg = new RegExp(`\\b${skill.replace('.', '\\.')}\\b`, 'i');
    if (reg.test(jd)) {
      detectedJdSkills.push(skill.charAt(0).toUpperCase() + skill.slice(1));
    }
  }

  const candidateSkillsLower = (profile?.skills || []).map(s => String(s).toLowerCase());
  const matchedSkills = [];
  const skillGaps = [];

  for (const js of detectedJdSkills) {
    const jsLower = js.toLowerCase();
    const isMatched = candidateSkillsLower.some(cs => cs.includes(jsLower) || jsLower.includes(cs));
    if (isMatched) {
      matchedSkills.push(js);
    } else {
      skillGaps.push(js);
    }
  }

  const totalEvaluated = matchedSkills.length + skillGaps.length;
  const alignmentScore = totalEvaluated > 0
    ? Math.round((matchedSkills.length / totalEvaluated) * 100)
    : 75;

  return {
    hasJd: true,
    detectedJdSkills,
    matchedSkills,
    skillGaps,
    alignmentScore,
    summary: skillGaps.length > 0
      ? `Identified ${skillGaps.length} target skill gap(s) not highlighted in resume: ${skillGaps.slice(0, 4).join(', ')}.`
      : `High profile match! Candidate resume aligns with all key JD requirements.`
  };
}

// ── 3. Behavioral STAR Method Heatmap Evaluator ──────────────────────────────
function analyzeStarComponents(text = '') {
  const t = (text || '').toLowerCase();

  const sitRegex = /\b(when i was|at my previous|our company|our team|we had a problem|we faced|client was|during my time|in one project|the situation was|there was an issue|system was struggling|legacy system|we experienced|an outage occurred)\b/i;
  const taskRegex = /\b(my task was|my role was|my responsibility|i was tasked|i was assigned|we needed to|the goal was|the objective was|i had to|we wanted to|our requirement was|i took ownership)\b/i;
  const actRegex = /\b(i designed|i built|i implemented|i created|i refactored|i migrated|i optimized|i introduced|i wrote|i investigated|i chose|we developed|we transitioned|i separated|i added|i spearheaded)\b/i;
  const resRegex = /\b(as a result|which led to|resulting in|we achieved|reduced by|improved by|increased by|decreased|saved|cut down|latency dropped|throughput increased|boosted|successfully launched|delivered)\b/i;
  const metricRegex = /\b(\d+(?:,\d+)?(?:\.\d+)?\s*(?:%|percent|x|ms|req\/sec|qps|k|million|users|hours|seconds|minutes))\b/i;

  const hasSituation = sitRegex.test(t);
  const hasTask = taskRegex.test(t);
  const hasAction = actRegex.test(t);
  const hasResult = resRegex.test(t);
  const hasMetric = metricRegex.test(t);

  const starScoreCount = [hasSituation, hasTask, hasAction, hasResult].filter(Boolean).length;
  const starScore = Math.round((starScoreCount / 4) * 100);

  let feedback = '';
  if (starScore === 100 && hasMetric) {
    feedback = 'Outstanding STAR structure with measurable outcome metrics!';
  } else if (!hasResult) {
    feedback = 'Missing concrete Result. Conclude your story with the measurable business or engineering outcome.';
  } else if (!hasMetric) {
    feedback = 'Good STAR narrative, but lacks quantifiable metrics ($O(N)$, % latency reduction, throughput).';
  } else if (!hasSituation || !hasTask) {
    feedback = 'Clarify the Situation and your specific Task/Ownership before detailing the actions taken.';
  } else {
    feedback = 'Solid structured response.';
  }

  return {
    hasSituation,
    hasTask,
    hasAction,
    hasResult,
    hasMetric,
    starScore,
    feedback
  };
}

// ── 4. "How a Staff Engineer Would Answer This" (AI Answer Rewriter) ────────
function generateStaffEngineerRewrite(candidateAnswer, questionObj = {}, signals = {}, profile = {}) {
  const topic = questionObj?.topic || 'System Architecture & Trade-offs';

  let executiveSummary = '';
  let architecturalTradeoff = '';
  let quantifiableImpact = '';
  let fullStaffAnswer = '';

  if (/cache|caching|redis/i.test(topic) || /cache/i.test(candidateAnswer)) {
    executiveSummary = `Adopted an asynchronous Cache-Aside pattern utilizing Redis with probabilistic early expiration (XFetch algorithm) to prevent thundering herd spikes during flash sales.`;
    architecturalTradeoff = `Evaluated Write-Through vs Cache-Aside. Chose Cache-Aside combined with event-driven invalidation via Kafka CDC to avoid slowing down write transactions while maintaining strong eventual consistency.`;
    quantifiableImpact = `Reduced p99 read latency from 340ms to 28ms, while absorbing 85% of query traffic away from the primary DB cluster, scaling smoothly to 22,000 QPS.`;
    fullStaffAnswer = `"In addressing high read latency under peak load, we implemented a Cache-Aside pattern backed by a Redis cluster with LRU memory eviction. Rather than standard fixed TTLs which risk cache stampedes when millions of users hit expiring keys simultaneously, we implemented probabilistic early expiration (the XFetch algorithm). On write operations, we avoided synchronous write-through overhead by decoupling invalidations via Debezium CDC into Kafka, maintaining eventual consistency under 80ms. This dropped primary PostgreSQL CPU load by 74% and improved p99 read latency from 340ms to 28ms under 22,000 QPS."`;
  } else if (/microservice|grpc|queue|kafka|backpressure|idempotent/i.test(topic) || /queue|kafka|event/i.test(candidateAnswer)) {
    executiveSummary = `Architected an event-driven decoupled pipeline using Kafka partitioned by tenant ID, guaranteeing in-order processing with idempotent consumer handlers.`;
    architecturalTradeoff = `Traded instantaneous read-your-writes synchronous REST consistency for asynchronous resilience and horizontal throughput, utilizing an Outbox pattern to prevent dual-write anomalies.`;
    quantifiableImpact = `Eliminated downstream worker crashes and handled 5x surges (up to 45,000 events/sec) with zero data loss and under 150ms consumer lag.`;
    fullStaffAnswer = `"To decouple order ingestion from downstream fulfillment, we migrated from synchronous REST calls to an event-driven architecture powered by Kafka. We partitioned topics by customer_id to ensure strict in-order processing per tenant while scaling out to 12 consumer partitions. To solve distributed dual-write inconsistency between our relational database and Kafka, we implemented the Transactional Outbox pattern with Debezium. Each consumer worker operates idempotently using Redis TTL deduplication keys, allowing us to safely replay events upon failure. This setup smoothly handled 45,000 events/second with consumer lag under 150ms."`;
  } else if (/database|index|query|sql|compound/i.test(topic) || /index|database|query/i.test(candidateAnswer)) {
    executiveSummary = `Analyzed PostgreSQL EXPLAIN ANALYZE telemetry, replacing unindexed sequential scans with composite B-Tree indexes matching our query predicate selectivity.`;
    architecturalTradeoff = `Accepted marginal write latency overhead (approx 4ms on inserts) in exchange for eliminating locking contention and dropping index scan times from seconds to sub-millisecond.`;
    quantifiableImpact = `Eliminated deadlocks, dropped peak CPU utilization from 94% to 26%, and lowered slowest query time from 4.2s to 12ms.`;
    fullStaffAnswer = `"When diagnosing query bottlenecks under peak traffic, EXPLAIN ANALYZE revealed sequential scans across our 15-million-row transactions table due to predicate mismatch. We engineered a compound B-Tree index following the equality-then-range rule (tenant_id, status, created_at DESC). We also tuned PostgreSQL autovacuum thresholds and introduced connection pooling via PgBouncer in transaction mode to eliminate connection starvation. This reduced our slowest query from 4.2 seconds down to 12 milliseconds and lowered database CPU from 94% to 26%."`;
  } else if (/disagree|leadership|star|trade-off/i.test(topic) || /team|disagree|lead/i.test(candidateAnswer)) {
    executiveSummary = `Navigated high-stakes architectural disagreement on microservices vs. modular monolith by drafting an objective RFC matrix and running load benchmarks.`;
    architecturalTradeoff = `Favored bounded modular monolith domains first over premature microservice distribution, deferring network serialization overhead until team boundaries strictly required it.`;
    quantifiableImpact = `Saved an estimated 6 weeks of distributed tracing/infrastructure setup, successfully shipping the MVP 2 weeks ahead of target launch with zero operational downtime.`;
    fullStaffAnswer = `"During our v2 architecture overhaul, our team lead advocated immediately splitting into 8 independent microservices, whereas I was concerned about operational overhead and distributed transaction complexity for our 4-person team. Rather than arguing in meetings, I drafted an RFC evaluating network latency, distributed failure modes, and CI/CD maintenance costs, and built a quick benchmark comparing RPC overhead versus in-process calls. We aligned on a modular monolith with strict domain boundaries that could be extracted into standalone services as team headcounts grew. This decision saved us roughly 6 weeks of Kubernetes setup and allowed us to launch on schedule."`;
  } else {
    executiveSummary = `Structured the response starting with high-level architectural invariants, deep-diving into the core algorithmic bottleneck, and closing with quantifiable production metrics.`;
    architecturalTradeoff = `Balanced engineering velocity and operational complexity by choosing battle-tested industry standards over unproven bleeding-edge abstractions.`;
    quantifiableImpact = `Achieved 99.95% system uptime SLA with documented failure recovery procedures and sub-50ms p95 latency.`;
    fullStaffAnswer = `"At an architectural level, the primary invariant we optimized for was deterministic latency and fault isolation. We designed the service with strict API contracts, enforced circuit breaking at network boundaries, and instrumented end-to-end OpenTelemetry distributed traces to isolate bottlenecks in real-time. By prioritizing horizontal scalability and graceful degradation over complex distributed state, we maintained 99.95% availability under varying traffic spikes."`;
  }

  return {
    executiveSummary,
    architecturalTradeoff,
    quantifiableImpact,
    fullStaffAnswer
  };
}

function getStageKey(index) {
  const keys = ['warmup', 'project_deepdive', 'failure_modes', 'system_scale', 'leadership_star'];
  return keys[index] || 'technical_deepdive';
}

// ── Opening Question ────────────────────────────────────────────────────────
function generateOpeningQuestion(profile, targetRole = '', timeLimitMinutes = 15, persona = 'staff') {
  const name = profile?.candidateName?.split(' ')[0] || 'there';
  const role = targetRole.trim() || profile?.primaryDomain || 'Software Engineer';
  const topSkill1 = profile?.skills?.[0] || 'Modern Web Technologies';
  const topSkill2 = profile?.skills?.[1] || 'System Architecture';
  const projectSnippet = profile?.projects?.[0] || 'your recent technical work';

  let interviewerReaction = `Welcome, ${name}! I'm excited to explore your technical background in our ${timeLimitMinutes}-minute session today.`;
  if (persona === 'bar_raiser') {
    interviewerReaction = `Welcome, ${name}. As a Principal Bar Raiser, I'll be assessing system design depth, production failure handling, and concrete operational metrics. Let's make the most of our ${timeLimitMinutes} minutes.`;
  } else if (persona === 'coach') {
    interviewerReaction = `Welcome, ${name}! I'm here as your interview coach today. We have ${timeLimitMinutes} minutes together, so take your time, structure your thoughts, and walk me through your technical story with confidence.`;
  }

  return {
    id: 'q-1',
    questionNumber: 1,
    isFinalQuestion: false,
    stage: 'warmup',
    stageName: 'Question 1: Architecture Introduction & Background',
    topic: 'Introduction & Core Project Walkthrough',
    question: `Hello ${name}! Welcome to your technical interview for the ${role} position. We have about ${timeLimitMinutes} minutes together today, and our questions will adapt dynamically based on your answers. To kick off, could you walk me through your background and give me an architectural overview of the most challenging project you've worked on recently?`,
    spokenText: `Hello ${name}! Welcome to your technical interview for the ${role} position. We have about ${timeLimitMinutes} minutes together today, and our questions will adapt dynamically based on your answers. To start, could you walk me through your background and give me an architectural overview of the most challenging project you've worked on recently?`,
    interviewerReaction,
    modelAnswer: `Candidate should introduce themselves clearly, state their key skills (${(profile?.skills || []).slice(0, 4).join(', ')}), and give a crisp, high-level walkthrough of their core project architecture and technical stack.`,
    keyPoints: [name.toLowerCase(), 'background', 'architecture', ...(profile?.skills || []).slice(0, 3).map(s => s.toLowerCase())]
  };
}

// ── Answer Evaluator ────────────────────────────────────────────────────────
function evaluateSpokenAnswer(candidateAnswer, questionObj = {}, profile = {}, durationSeconds = 0, persona = 'staff') {
  const answer = (candidateAnswer || '').trim();
  const wordCount = answer.split(/\s+/).filter(Boolean).length;
  const speechAnalysis = analyzeSpeechPatterns(answer, durationSeconds);
  const starAnalysis = analyzeStarComponents(answer);
  const signals = extractCandidateSignals(answer);
  const staffRewrite = generateStaffEngineerRewrite(answer, questionObj, signals, profile);

  if (wordCount < 5) {
    return {
      score: 35,
      wordCount,
      feedback: persona === 'coach'
        ? "That was very brief. Don't be afraid to take up space—walk through your architecture step-by-step!"
        : "Response was very brief. In an interview with a seasoned engineer, aim to provide concrete examples, technical mechanisms, and context.",
      verbalTransition: "Thank you. Let's move along to the next topic.",
      isPassed: false,
      missingTerms: (questionObj.keyPoints || []).slice(0, 3),
      strengths: ["Attempted to respond"],
      speechAnalysis,
      starAnalysis,
      staffRewrite,
      persona
    };
  }

  const answerLower = answer.toLowerCase();
  const matchedPoints = (questionObj.keyPoints || []).filter(k => 
    answerLower.includes(String(k).toLowerCase())
  );

  const keyTermScore = questionObj.keyPoints?.length 
    ? Math.round((matchedPoints.length / questionObj.keyPoints.length) * 50)
    : 30;

  let lengthScore = 30;
  if (wordCount >= 35 && wordCount <= 220) lengthScore = 45;
  else if (wordCount > 220) lengthScore = 38;
  else if (wordCount >= 15) lengthScore = 35;

  let totalScore = Math.min(98, Math.max(42, keyTermScore + lengthScore + (matchedPoints.length > 0 ? 10 : 0)));

  // Persona adjustments
  if (persona === 'bar_raiser') {
    if (!signals.metrics.length && wordCount < 60) totalScore = Math.max(38, totalScore - 12);
    else if (!signals.metrics.length) totalScore = Math.max(45, totalScore - 6);
  } else if (persona === 'coach') {
    totalScore = Math.min(99, totalScore + 5);
  }

  const missing = (questionObj.keyPoints || []).filter(k => !answerLower.includes(String(k).toLowerCase()));

  let feedback = '';
  if (persona === 'bar_raiser') {
    feedback = totalScore >= 78
      ? `Strong bar-raiser defense. Good technical depth (${matchedPoints.slice(0, 3).join(', ')}). Always ensure you explicitly state failure boundaries and p99 SLA guarantees.`
      : `High-bar flag: Answer lacked quantifiable production telemetry and clear trade-off analysis. In a Staff loop, avoid high-level summaries and detail exact failure mitigation.`;
  } else if (persona === 'coach') {
    feedback = totalScore >= 70
      ? `Great job! You touched on key concepts (${matchedPoints.slice(0, 3).join(', ')}). To take it to the next level, sprinkle in a concrete production metric!`
      : `Good start! You're on the right track. Try structuring your next answer using the STAR method, and mention specific tools like ${missing.slice(0, 2).join(' or ')}.`;
  } else {
    feedback = totalScore >= 75 
      ? `Strong articulation! You covered relevant technical details (${matchedPoints.slice(0, 3).join(', ')}).`
      : `Fair response. Consider elaborating on specific trade-offs, architecture patterns (${missing.slice(0, 2).join(', ')}), and measurable results.`;
  }

  return {
    score: totalScore,
    wordCount,
    isPassed: totalScore >= 60,
    matchedTerms: matchedPoints,
    missingTerms: missing.slice(0, 3),
    feedback,
    speechAnalysis,
    starAnalysis,
    staffRewrite,
    persona
  };
}

// ── Seasoned Fallback Interviewer Question Engine ───────────────────────────
function generateSeasonedFallbackQuestion({
  name,
  role,
  profile,
  signals,
  evaluation,
  candidateAnswer,
  currentQuestion,
  questionsAnswered,
  timeRemainingSeconds,
  timeLimitMinutes
}) {
  const { detectedTech, metrics, archKeywords } = signals;
  const answerLower = (candidateAnswer || '').toLowerCase();
  const primaryTech = detectedTech[0] || profile?.skills?.[0] || 'your core framework';
  const secondaryTech = detectedTech[1] || profile?.skills?.[1] || 'your database';
  const nextQNum = questionsAnswered + 1;

  let interviewerReaction = '';
  let questionText = '';
  let spokenText = '';
  let topic = '';
  let modelAnswer = '';
  let keyPoints = [];
  let stage = 'technical_deepdive';
  let stageName = `Question ${nextQNum}: Technical Deep-Dive`;
  let isFinalQuestion = false;

  if (questionsAnswered === 1) {
    // ── STAGE 2: Project Architecture Deep-Dive (Driven by candidate's answer) ──
    stage = 'project_deepdive';
    stageName = `Question 2: Project Architecture Deep-Dive (Driven by your response)`;

    if (detectedTech.some(t => /redis|cache|caching/i.test(t)) || /redis|cache|caching/i.test(answerLower)) {
      interviewerReaction = `I like that you highlighted using caching to solve your latency bottlenecks.`;
      questionText = `You mentioned introducing caching with ${primaryTech}. In high-throughput distributed systems, cache invalidation and thundering herd problems are notorious. How did you handle cache invalidation when underlying records changed, and what eviction policies or TTL strategies did you implement to ensure data consistency?`;
      spokenText = `You mentioned introducing caching with ${primaryTech} to reduce latency. In high-throughput systems, cache invalidation and stampedes are notorious. How did you handle cache invalidation when records changed, and what eviction or TTL policies did you configure?`;
      topic = 'Cache Invalidation & Thundering Herd';
      modelAnswer = 'Candidate should explain: 1) Cache invalidation pattern (cache-aside, write-through, or event-driven invalidation), 2) Mutex locking or probabilistic early expiration (XFetch) for cache stampedes, 3) TTL and eviction policies (LRU/LFU), 4) Graceful fallback when cache cluster is down.';
      keyPoints = ['cache invalidation', 'thundering herd', 'ttl', 'eviction', 'consistency'];
    } else if (detectedTech.some(t => /kafka|queue|rabbitmq|stream/i.test(t)) || /kafka|queue|rabbitmq|stream/i.test(answerLower)) {
      interviewerReaction = `Event-driven architectures and message queues are great for decoupling asynchronous workloads.`;
      questionText = `You highlighted using asynchronous event handling with ${primaryTech}. How did you handle consumer backpressure, partition key distribution, and deduplication to ensure exactly-once or idempotent processing when consumer worker nodes crashed?`;
      spokenText = `You mentioned using asynchronous messaging with ${primaryTech}. How did you handle consumer backpressure, partition distribution, and deduplication when worker nodes crashed?`;
      topic = 'Message Queue Backpressure & Idempotency';
      modelAnswer = 'Candidate should explain: 1) Partitioning strategy by entity ID, 2) Consumer offset management and commit timing, 3) Dead-letter queues (DLQ), 4) Idempotency keys in downstream databases.';
      keyPoints = ['backpressure', 'partitions', 'idempotent', 'dead letter queue', 'offsets'];
    } else if (detectedTech.some(t => /microservice|docker|kubernetes/i.test(t)) || /microservice|docker|kubernetes/i.test(answerLower)) {
      interviewerReaction = `Decomposing systems into microservices helps team velocity, but distributed boundaries introduce new operational trade-offs.`;
      questionText = `You mentioned structuring your backend into microservices. What communication protocol did you standardize on between services (synchronous REST/gRPC vs. asynchronous messaging), and how did you manage distributed transactions or data consistency across service boundaries?`;
      spokenText = `You mentioned structuring your backend into microservices. What communication protocol did you standardize on, and how did you manage distributed transactions and data consistency across service boundaries?`;
      topic = 'Microservices Communication & Data Consistency';
      modelAnswer = 'Candidate should explain: 1) Synchronous vs asynchronous trade-offs (gRPC vs Kafka), 2) Saga pattern or two-phase commit avoidance for distributed transactions, 3) Distributed tracing (OpenTelemetry/Jaeger), 4) API Gateway aggregation.';
      keyPoints = ['grpc', 'saga pattern', 'distributed tracing', 'consistency', 'api gateway'];
    } else if (detectedTech.some(t => /mongo|postgres|sql|database|db/i.test(t)) || /database|query|index|indexes|indexing/i.test(answerLower)) {
      interviewerReaction = `Database schema structure and indexing often dictate the performance ceiling of the entire application.`;
      questionText = `You discussed database optimization with ${primaryTech}. Could you explain your indexing strategy—specifically how you evaluated compound indexes versus single-column indexes—and how you diagnosed and eliminated slow queries or table scans under peak traffic?`;
      spokenText = `You discussed database optimization with ${primaryTech}. Could you explain your indexing strategy, and how you diagnosed and eliminated slow queries or table scans under peak traffic?`;
      topic = 'Database Indexing & Query Execution Plans';
      modelAnswer = 'Candidate should explain: 1) Compound index column ordering (equality first, range later), 2) EXPLAIN ANALYZE execution plan review, 3) Eliminating full table scans, 4) Connection pooling and read replicas.';
      keyPoints = ['compound index', 'explain plan', 'table scan', 'connection pool', 'indexing'];
    } else {
      interviewerReaction = `Thanks for that overview. In a senior-level interview, we need to dive into the concrete technical internals.`;
      questionText = `Walk me through the exact end-to-end data flow of that core project: from the moment an HTTP request hits your API gateway down to database persistence. What was the single biggest architectural bottleneck or race condition you personally diagnosed and solved?`;
      spokenText = `Walk me through the end-to-end data flow of that project: from client request to database write. What was the single biggest architectural bottleneck or race condition you personally solved?`;
      topic = 'End-to-End Data Flow & Bottlenecks';
      modelAnswer = 'Candidate should describe: 1) Request flow through Gateway, Controller, Service, and Repository layers, 2) Network latency and data serialization, 3) Specific bottleneck (e.g. database locks, unindexed queries, CPU-bound parsing) and their solution.';
      keyPoints = ['request lifecycle', 'bottleneck', 'race condition', 'database', 'optimization'];
    }
  } else if (questionsAnswered === 2) {
    // ── STAGE 3: Technical Edge Cases & Failure Modes ─────────────────────────
    stage = 'failure_modes';
    stageName = `Question 3: Technical Edge Cases & Failure Modes`;
    interviewerReaction = `That gives good clarity into the happy path of your architecture. Now let's test its resilience when infrastructure fails.`;
    questionText = `In distributed production systems, infrastructure fails constantly. Imagine during peak traffic, your primary database or caching tier suffers a 5-second network partition or connection pool starvation. How does your service detect and isolate this failure? What error responses does the client see, and how does your architecture prevent cascading failures across other microservices?`;
    spokenText = `In distributed production systems, infrastructure fails constantly. Imagine your primary database or caching tier suffers a 5-second network partition or connection starvation during peak traffic. How does your service isolate this failure, and how do you prevent cascading outages across downstream services?`;
    topic = 'Network Partition & Cascading Failure Mitigation';
    modelAnswer = 'Candidate should describe: 1) Circuit breaker pattern (e.g. Resilience4j, Polly), 2) Graceful degradation (serving cached stale data or fallback defaults), 3) Timeout and retry budgets with exponential backoff, 4) Connection pool health checks and alerting.';
    keyPoints = ['circuit breaker', 'graceful degradation', 'exponential backoff', 'connection pool', 'cascading failure'];
  } else if (questionsAnswered === 3) {
    // ── STAGE 4: Distributed Systems & 100x Scalability ───────────────────────
    stage = 'system_scale';
    stageName = `Question 4: Distributed Systems & 100x Scalability`;
    interviewerReaction = `Good explanation of failure boundaries. Now let's step up the volume to massive scale.`;
    questionText = `Suppose our platform experiences an explosive 50x surge in adoption next quarter, moving to 100,000 writes per second and millions of active global users. What is the very first bottleneck in your current architecture that will break, and how would you redesign the storage and caching tiers using sharding, read replicas, or event streaming to survive that load?`;
    spokenText = `Suppose our platform scales 50x next quarter to 100,000 writes per second across global regions. What is the very first bottleneck that will break, and how would you redesign the storage and caching tiers to survive that load?`;
    topic = 'System Scalability & Sharding at 100x';
    modelAnswer = 'Candidate should describe: 1) Sharding / horizontal partitioning strategy by tenant/user ID, 2) Read-write splitting with read replicas, 3) Asynchronous write buffer using Kafka/SQS, 4) Geo-distributed caching and CDNs for static assets.';
    keyPoints = ['sharding', 'read replicas', 'horizontal scaling', 'message queue', 'partitioning', 'latency'];
  } else if (questionsAnswered === 4) {
    // ── STAGE 5: Engineering Leadership, Trade-offs & STAR Behavioral ─────────
    stage = 'leadership_star';
    stageName = `Question 5: Engineering Leadership, Trade-offs & STAR Behavioral`;
    interviewerReaction = `Solid architectural intuition. High-level design is only half the battle; the other half is engineering leadership and execution under pressure.`;
    questionText = `In building and maintaining systems of this scale, tight deadlines and architectural trade-offs are inevitable. Can you share a real scenario from your past work where you and another senior engineer or team lead fundamentally disagreed on a technical choice or architectural compromise? How did you present your case with data or prototypes, and what was the outcome?`;
    spokenText = `Tell me about a time when you and a teammate or tech lead fundamentally disagreed on a technical choice or architectural trade-off. How did you resolve it and what was the outcome?`;
    topic = 'Technical Disagreements & Engineering Trade-offs (STAR)';
    modelAnswer = 'Candidate should follow STAR: 1) Situation (context of conflict), 2) Task (business goal), 3) Action (used benchmarks, written RFCs, objective trade-off matrices without ego), 4) Result (agreed consensus, successful delivery, lessons learned).';
    keyPoints = ['situation', 'task', 'action', 'result', 'trade-off', 'communication'];
  } else if (questionsAnswered === 5) {
    // ── STAGE 6: Resiliency, Idempotency & Disaster Recovery ─────────────────
    stage = 'resiliency_idempotency';
    stageName = `Question 6: Idempotency, Distributed Locks & Security`;
    interviewerReaction = `Great leadership perspective. Let's cover one critical aspect of distributed safety before we wrap up.`;
    questionText = `In high-scale distributed systems, network retries and duplicate events are inevitable. How did you design idempotency across your API endpoints and database layer to guarantee that duplicate requests never execute twice, and what distributed locking mechanisms or transactional outbox patterns did you employ?`;
    spokenText = `How did you design idempotency across your API and database layers to prevent duplicate executions during retries, and what distributed locking or transactional outbox patterns did you use?`;
    topic = 'Idempotency Keys & Distributed Locking';
    modelAnswer = 'Candidate should describe: 1) Unique idempotency keys with TTL in Redis, 2) Database unique constraints or upsert semantics, 3) Distributed lock expiration / Redlock, 4) Transactional outbox pattern for event emission.';
    keyPoints = ['idempotency key', 'distributed lock', 'unique constraint', 'outbox', 'retries'];
  } else {
    // Stage 7+: Wrap-up Reflection
    stage = 'wrapup_reflection';
    stageName = `Question ${nextQNum}: Final Reflection & Architecture Wrap-up 🏁`;
    isFinalQuestion = true;
    interviewerReaction = `You've provided comprehensive technical depth across our discussion today. Let's finish with a final forward-looking reflection.`;
    questionText = `Reflecting on everything we've explored—from your architecture and data flow to failure modes and scale—if you were tasked with redesigning that system from day one with the traffic patterns and lessons you know now, what is the single most critical architectural choice you would change, and what trade-offs would that introduce?`;
    spokenText = `Reflecting on everything we've explored today, if you were tasked with redesigning that system from scratch today, what is the single most critical architectural choice you would change, and why?`;
    topic = 'System Redesign & Architectural Reflection';
    modelAnswer = 'Candidate should demonstrate retrospective wisdom, evaluating trade-offs of early microservices vs modular monoliths, or event streaming vs synchronous calls.';
    keyPoints = ['trade-off', 'reflection', 'lessons learned', 'redesign'];
  }

  return {
    evaluation,
    interviewerReaction,
    nextQuestion: {
      id: `dyn-q-${nextQNum}`,
      questionNumber: nextQNum,
      isFinalQuestion,
      stage,
      stageName,
      topic,
      question: questionText,
      spokenText,
      interviewerReaction,
      modelAnswer,
      keyPoints
    },
    isCompleted: false,
    isFinalQuestion,
    questionsAnswered: nextQNum
  };
}

// ── Main Dynamic Question Coordinator ───────────────────────────────────────
async function generateDynamicNextQuestion({
  profile,
  history = [],
  currentQuestion = {},
  candidateAnswer = '',
  currentStageIndex = 0,
  targetRole = '',
  timeRemainingSeconds,
  elapsedSeconds = 0,
  timeLimitMinutes = 15,
  forceWrapUp = false,
  answerDurationSeconds = 0,
  persona = 'staff',
  jobDescription = '',
  jdAnalysis = null
}) {
  const name = profile?.candidateName?.split(' ')[0] || 'there';
  const role = targetRole || profile?.primaryDomain || 'Software Engineer';
  const signals = extractCandidateSignals(candidateAnswer);
  const evaluation = evaluateSpokenAnswer(candidateAnswer, currentQuestion, profile, answerDurationSeconds, persona);
  const questionsAnswered = (history || []).length + 1;
  const wordCount = (candidateAnswer || '').trim().split(/\s+/).filter(Boolean).length;

  // 1. Manual early wrap-up requested by user
  if (forceWrapUp) {
    return {
      evaluation,
      interviewerReaction: `Understood, ${name}. We've gathered thorough technical signal across your architecture, problem-solving, and execution. Let's conclude our interview here and proceed directly to your comprehensive performance scorecard.`,
      nextQuestion: null,
      isCompleted: true,
      questionsAnswered
    };
  }

  // 2. Previous question was already flagged as the final closing question
  if (currentQuestion?.isFinalQuestion) {
    return {
      evaluation,
      interviewerReaction: `Thank you for sharing that comprehensive reflection, ${name}. That officially concludes our interview session today. You've demonstrated great engineering depth. Let's move straight into your comprehensive debrief and performance scorecard.`,
      nextQuestion: null,
      isCompleted: true,
      questionsAnswered
    };
  }

  // 3. Time completely expired (timer <= 0)
  if (timeRemainingSeconds !== undefined && timeRemainingSeconds <= 0) {
    return {
      evaluation,
      interviewerReaction: `We've reached the end of our allotted ${timeLimitMinutes}-minute session, ${name}. Thank you for your rigorous technical answers today. Let's review your final debrief scorecard.`,
      nextQuestion: null,
      isCompleted: true,
      questionsAnswered
    };
  }

  // 4. Low remaining time (<= 120s) AND candidate has answered at least 3 questions
  if (timeRemainingSeconds !== undefined && timeRemainingSeconds <= 120 && questionsAnswered >= 3) {
    const finalQNum = questionsAnswered + 1;
    const finalQ = {
      id: `dyn-q-${finalQNum}`,
      questionNumber: finalQNum,
      isFinalQuestion: true,
      stage: 'wrapup_reflection',
      stageName: `Final Closing Question 🏁 (Pacing & Reflection)`,
      topic: 'Architectural Retrospective & Future Redesign',
      question: `Looking at our interview clock with only a couple minutes left, let's wrap up with one final reflection question. Reflecting on everything we've explored today—from your architecture and data flow to failure modes and scale—if you had the opportunity to rebuild that core system from scratch with today's knowledge, what is the single most critical architectural or tooling decision you would change, and what trade-offs would that introduce?`,
      spokenText: `Looking at our session clock with only a couple minutes left in our interview, let's wrap up with one final reflection question. If you had the opportunity to rebuild that core system from scratch today, what is the single most critical architectural decision you would change, and why?`,
      interviewerReaction: `Looking at our interview clock with only a couple minutes left in our session, let's wrap up with one final reflection question.`,
      modelAnswer: 'Candidate should reflect candidly on technical debt or design trade-offs (e.g., adopting event streaming earlier, stricter API contracts, or separating read and write workloads).',
      keyPoints: ['trade-off', 'reflection', 'lessons learned', 'redesign']
    };
    return {
      evaluation,
      interviewerReaction: finalQ.interviewerReaction,
      nextQuestion: finalQ,
      isCompleted: false,
      isFinalQuestion: true,
      questionsAnswered
    };
  }

  // 5. Target JD Skill Gap Probing (if JD has skill gaps candidate didn't mention)
  if (jdAnalysis?.skillGaps?.length > 0 && questionsAnswered === 2 && (!timeRemainingSeconds || timeRemainingSeconds > 120)) {
    const gapSkill = jdAnalysis.skillGaps[0];
    const gapQNum = questionsAnswered + 1;
    const gapQ = {
      id: `dyn-q-${gapQNum}`,
      questionNumber: gapQNum,
      isFinalQuestion: false,
      stage: 'jd_skill_gap_probe',
      stageName: `Question ${gapQNum}: Target JD Skill Gap Probe (${gapSkill}) 🎯`,
      topic: `JD Skill Gap: Production ${gapSkill}`,
      question: `Looking at the requirements for your target role, there is strong emphasis on ${gapSkill}, which isn't prominently highlighted in your recent projects. How would you design or utilize ${gapSkill} in a mission-critical system, and what common anti-patterns or production pitfalls would you avoid?`,
      spokenText: `Looking at your target job description, there is strong emphasis on ${gapSkill}. How would you architect or use ${gapSkill} in production, and what pitfalls would you avoid?`,
      interviewerReaction: `I notice your target job posting specifically requires experience with ${gapSkill}. Let's explore your understanding of that technology.`,
      modelAnswer: `Candidate should explain architectural role of ${gapSkill}, production deployment practices, and error handling or scaling trade-offs.`,
      keyPoints: [gapSkill.toLowerCase(), 'production', 'architecture', 'trade-offs']
    };
    return {
      evaluation,
      interviewerReaction: gapQ.interviewerReaction,
      nextQuestion: gapQ,
      isCompleted: false,
      isFinalQuestion: false,
      questionsAnswered
    };
  }

  // 6. Response was extremely brief / shallow (< 35 words) and time permits
  if (wordCount < 35 && questionsAnswered < 7 && (!timeRemainingSeconds || timeRemainingSeconds > 150)) {
    const lastTopic = currentQuestion.topic || 'your previous point';
    const probeQNum = questionsAnswered + 1;
    const probeQ = {
      id: `dyn-q-${probeQNum}`,
      questionNumber: probeQNum,
      isFinalQuestion: false,
      stage: 'clarification_probe',
      stageName: `Question ${probeQNum}: In-Depth Technical Probe (Clarification)`,
      topic: `Deep Dive on ${lastTopic}`,
      question: `That was fairly high-level. In a senior-level technical discussion, we need to understand the concrete engineering specifics. Could you walk me through the exact technical details—what data structures, network protocols, or database queries did you personally write, and what concrete latency, throughput, or error rate metrics did you measure?`,
      spokenText: `That was quite brief. Could you walk me through the exact technical details: what data structures or protocols did you write, and what concrete latency or error rate metrics did you measure?`,
      interviewerReaction: `That response was rather high-level. Let's dig deeper into the concrete engineering specifics before we move on.`,
      modelAnswer: 'Candidate should provide concrete technical depth, naming exact libraries, data structures, and quantifiable metrics.',
      keyPoints: ['specifics', 'metrics', 'internals', 'ownership']
    };
    return {
      evaluation,
      interviewerReaction: probeQ.interviewerReaction,
      nextQuestion: probeQ,
      isCompleted: false,
      isFinalQuestion: false,
      questionsAnswered
    };
  }

  // 7. Comprehensive signal reached (6+ questions answered with depth)
  if (questionsAnswered >= 6) {
    return {
      evaluation,
      interviewerReaction: `Thank you for sharing those insights, ${name}. We've completed our comprehensive technical conversation with deep signal across your architecture, failure handling, scalability, and engineering leadership. Let's move directly to your performance scorecard.`,
      nextQuestion: null,
      isCompleted: true,
      questionsAnswered
    };
  }

  // 8. Seasoned Principal Engineer adaptive progression
  return generateSeasonedFallbackQuestion({
    name,
    role,
    profile,
    signals,
    evaluation,
    candidateAnswer,
    currentQuestion,
    questionsAnswered,
    timeRemainingSeconds,
    timeLimitMinutes
  });
}

// ── API ROUTES ──────────────────────────────────────────────────────────────

/**
 * POST /api/interview/upload-resume
 * Accepts a resume file (PDF/DOCX/TXT) or text in body, parses candidate profile,
 * evaluates target JD alignment, and initializes an adaptive interview plan.
 */
router.post('/upload-resume', upload.single('resume'), async (req, res) => {
  try {
    let resumeText = req.body.resumeText || '';
    let fileName = 'Uploaded Resume';

    if (req.file) {
      fileName = req.file.originalname;
      resumeText = await extractTextFromFile(req.file.path);
      try { fs.unlinkSync(req.file.path); } catch (_) {}
    }

    if (!resumeText || resumeText.trim().length < 20) {
      return res.status(400).json({
        success: false,
        message: 'Could not extract text from resume. Please upload a clear PDF/DOCX or paste text directly.'
      });
    }

    const targetRole = req.body.targetRole || '';
    const timeLimitMinutes = parseInt(req.body.timeLimitMinutes, 10) || 15;
    const persona = req.body.persona || 'staff';
    const jobDescription = req.body.jobDescription || '';

    const profile = analyzeResumeProfile(resumeText);
    const jdAnalysis = analyzeJobDescription(jobDescription, profile);
    const openingQuestion = generateOpeningQuestion(profile, targetRole, timeLimitMinutes, persona);

    res.json({
      success: true,
      fileName,
      profile,
      timeLimitMinutes,
      totalTimeLimitSeconds: timeLimitMinutes * 60,
      currentQuestionIndex: 0,
      currentQuestion: openingQuestion,
      plan: [openingQuestion],
      persona,
      jobDescription,
      jdAnalysis
    });
  } catch (err) {
    console.error('Interview resume upload failed:', err);
    res.status(500).json({
      success: false,
      message: 'Failed to process resume for interview',
      error: err.message
    });
  }
});

/**
 * POST /api/interview/start-session
 * Initializes an interview from direct text profile or selected role with custom timing and persona.
 */
router.post('/start-session', async (req, res) => {
  try {
    const { targetRole, resumeText, candidateName, persona = 'staff', jobDescription = '' } = req.body;
    const timeLimitMinutes = parseInt(req.body.timeLimitMinutes, 10) || 15;
    const profile = analyzeResumeProfile(resumeText || '');
    if (candidateName) profile.candidateName = candidateName;
    if (targetRole) profile.primaryDomain = targetRole;

    const jdAnalysis = analyzeJobDescription(jobDescription, profile);
    const openingQuestion = generateOpeningQuestion(profile, targetRole, timeLimitMinutes, persona);

    res.json({
      success: true,
      profile,
      timeLimitMinutes,
      totalTimeLimitSeconds: timeLimitMinutes * 60,
      currentQuestionIndex: 0,
      currentQuestion: openingQuestion,
      plan: [openingQuestion],
      persona,
      jobDescription,
      jdAnalysis
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/interview/next-question
 * Evaluates candidate's answer with Speech Intelligence, STAR heatmap, and Staff rewrite,
 * and dynamically produces the next follow-up question.
 */
router.post('/next-question', async (req, res) => {
  try {
    const {
      candidateAnswer,
      currentQuestion,
      history,
      profile,
      currentStageIndex = 0,
      targetRole = '',
      timeRemainingSeconds,
      elapsedSeconds = 0,
      timeLimitMinutes = 15,
      forceWrapUp = false,
      answerDurationSeconds = 0,
      persona = 'staff',
      jobDescription = '',
      jdAnalysis = null
    } = req.body;

    if (!currentQuestion) {
      return res.status(400).json({ success: false, message: 'Missing currentQuestion' });
    }

    const result = await generateDynamicNextQuestion({
      profile,
      history,
      currentQuestion,
      candidateAnswer,
      currentStageIndex,
      targetRole,
      timeRemainingSeconds,
      elapsedSeconds,
      timeLimitMinutes,
      forceWrapUp,
      answerDurationSeconds,
      persona,
      jobDescription,
      jdAnalysis
    });

    res.json({
      success: true,
      ...result
    });
  } catch (err) {
    console.error('Failed to generate dynamic next question:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/interview/evaluate-response
 * Legacy & dual-compatible endpoint that evaluates and produces next question.
 */
router.post('/evaluate-response', async (req, res) => {
  try {
    const {
      candidateAnswer,
      questionObj,
      profile,
      currentIndex = 0,
      totalQuestions = 5,
      history = [],
      targetRole = '',
      answerDurationSeconds = 0,
      persona = 'staff'
    } = req.body;

    const currentQuestion = questionObj || {};
    const result = await generateDynamicNextQuestion({
      profile,
      history,
      currentQuestion,
      candidateAnswer,
      currentStageIndex: currentIndex,
      totalStages: totalQuestions,
      targetRole,
      answerDurationSeconds,
      persona
    });

    res.json({
      success: true,
      evaluation: result.evaluation,
      interviewerReaction: result.interviewerReaction,
      nextQuestion: result.nextQuestion,
      isCompleted: result.isCompleted,
      isLastQuestion: result.isCompleted,
      currentQuestionIndex: result.currentStageIndex,
      totalQuestions: result.totalStages
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/interview/debrief
 * Produces comprehensive post-interview score, Speech Delivery metrics, JD Gap Analysis,
 * 6-dimension scorecard, and personalized 7-day action items.
 */
router.post('/debrief', optionalAuth, async (req, res) => {
  try {
    const { profile, interviewHistory, totalTimeSeconds = 300, jobDescription = '', jdAnalysis = null, persona = 'staff' } = req.body;

    const history = Array.isArray(interviewHistory) ? interviewHistory : [];
    const totalCount = history.length || 1;

    // Aggregate speech metrics
    let totalFillers = 0;
    const fillerMap = {};
    let totalWpm = 0;
    let wpmSamples = 0;

    history.forEach(h => {
      const sa = h.evaluation?.speechAnalysis;
      if (sa) {
        totalFillers += (sa.fillerCount || 0);
        (sa.fillerList || []).forEach(f => {
          fillerMap[f.word] = (fillerMap[f.word] || 0) + f.count;
        });
        if (sa.wpm) {
          totalWpm += sa.wpm;
          wpmSamples += 1;
        }
      }
    });

    const avgWpm = wpmSamples > 0 ? Math.round(totalWpm / wpmSamples) : 135;
    const topFillers = Object.entries(fillerMap)
      .map(([word, count]) => ({ word, count }))
      .sort((a, b) => b.count - a.count);

    let speechPaceVerdict = 'Optimal (120-165 WPM)';
    if (avgWpm < 115) speechPaceVerdict = 'Deliberate / Slow Pace (<115 WPM)';
    else if (avgWpm > 170) speechPaceVerdict = 'Fast / Rushing Pace (>170 WPM)';

    const speechDelivery = {
      totalFillers,
      topFillers: topFillers.slice(0, 5),
      avgWpm,
      speechPaceVerdict,
      fluencyScore: Math.min(98, Math.max(50, 95 - (totalFillers * 4)))
    };

    // Calculate individual dimension scores
    const avgScore = Math.round(history.reduce((sum, h) => sum + (h.evaluation?.score || 60), 0) / totalCount);
    const avgWords = Math.round(history.reduce((sum, h) => sum + (h.evaluation?.wordCount || 50), 0) / totalCount);

    const technicalDepth = Math.min(95, Math.max(50, Math.round(avgScore * 0.95 + (avgWords > 60 ? 8 : -5))));
    const communicationScore = Math.min(98, Math.max(45, Math.round(speechDelivery.fluencyScore * 0.5 + (avgWords >= 45 && avgWords <= 200 ? 45 : 30))));
    const resumeAlignment = Math.min(95, Math.max(60, Math.round(avgScore * 0.9 + 10)));
    const problemSolving = Math.min(95, Math.max(50, Math.round(avgScore * 0.88 + 8)));
    const starBehavioral = Math.min(98, Math.max(50, Math.round(history.reduce((s, h) => s + (h.evaluation?.starAnalysis?.starScore || 70), 0) / totalCount)));
    const confidenceScore = Math.min(96, Math.max(55, Math.round((communicationScore + avgScore) / 2)));

    const computedJd = jdAnalysis || (jobDescription ? analyzeJobDescription(jobDescription, profile) : null);

    const overallReadiness = Math.round(
      (technicalDepth * 0.30) + 
      (communicationScore * 0.25) + 
      (resumeAlignment * 0.15) + 
      (problemSolving * 0.15) +
      (starBehavioral * 0.15)
    );

    const scorecard = {
      overallReadiness,
      dimensions: [
        { name: 'Technical Depth & Internals', score: technicalDepth, icon: '⚙️', description: 'Mastery of concepts, system architecture, and core tooling.' },
        { name: 'Fluency & Speech Delivery', score: communicationScore, icon: '🎙️', description: `${speechDelivery.totalFillers} fillers detected · ${speechDelivery.avgWpm} WPM · ${speechDelivery.speechPaceVerdict}` },
        { name: 'STAR Behavioral Structure', score: starBehavioral, icon: '🎯', description: 'Articulation of Situation, Task, Action, and measurable Results.' },
        { name: 'Resume & Project Alignment', score: resumeAlignment, icon: '📄', description: 'Authenticity and depth in explaining stated resume projects.' },
        { name: 'System Resilience & Edge Cases', score: problemSolving, icon: '💡', description: 'Handling failure modes, network partitions, and 100x scale.' },
        { name: 'Executive Poise & Delivery', score: confidenceScore, icon: '⭐', description: 'Structured delivery and confidence under interview pressure.' }
      ],
      strengths: [
        `Demonstrated working familiarity with ${profile?.skills?.slice(0, 3).join(', ') || 'core technologies'}.`,
        speechDelivery.totalFillers <= 2 ? 'Excellent fluency with minimal filler word usage.' : 'Active verbal participation throughout technical discussion.',
        'Able to navigate architectural trade-offs and failure scenarios.'
      ],
      recommendations: [
        speechDelivery.totalFillers > 2 ? `Reduce vocal fillers (${speechDelivery.topFillers.map(f => `"${f.word}"`).join(', ')}). Practice pausing silently instead of saying "like" or "um".` : 'Maintain steady vocal pacing and concise paragraph breaks.',
        'Always quantify results using the STAR method (e.g. "reduced latency by 35% under 15k QPS").',
        'In system design questions, proactively contrast at least two competing architectural patterns.'
      ],
      roadmap: [
        { day: 'Day 1-2', focus: 'System Architecture & Database Indexing Review' },
        { day: 'Day 3-4', focus: 'Draft 3 bulleted STAR stories with quantifiable metrics' },
        { day: 'Day 5-6', focus: 'Vocal fluency drill: practice 2-minute answers with zero filler words' },
        { day: 'Day 7', focus: 'Retake Voice AI Simulation for final placement polish' }
      ]
    };

    res.json({
      success: true,
      scorecard,
      profile,
      totalTimeSeconds,
      totalQuestions: totalCount,
      speechDelivery,
      jdAnalysis: computedJd,
      persona
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

/**
 * POST /api/interview/ask-interviewer
 * Closing Round: Candidate asks the interviewer questions about culture, on-call, tech stack,
 * and receives an authentic in-character response from the AI persona.
 */
router.post('/ask-interviewer', async (req, res) => {
  try {
    const { candidateQuestion, candidateProfile, targetRole, persona = 'staff', jobDescription = '' } = req.body;
    const q = (candidateQuestion || '').trim();
    if (!q) {
      return res.status(400).json({ success: false, message: 'Please provide a question to ask the interviewer.' });
    }

    const qLower = q.toLowerCase();
    let answer = '';
    let interviewerRole = 'Staff Principal Engineer & Hiring Lead';

    if (/culture|work life|balance|hours|burnout|environment|team culture/i.test(qLower)) {
      if (persona === 'coach') {
        answer = "Our engineering culture is deeply rooted in psychological safety, blameless post-mortems, and work-life harmony. We respect asynchronous communication, encourage focused deep-work blocks with 'No Meeting Wednesdays', and ensure our engineers have dedicated sprint time to learn and innovate.";
      } else if (persona === 'bar_raiser') {
        answer = "We maintain a high-ownership, high-velocity culture. We look for builders who treat production with extreme care. While we respect personal time and offer flexible PTO, when critical production systems require escalation, we rally together with blameless post-mortems and uncompromising engineering standards.";
      } else {
        answer = "Our culture balances high autonomy with rigorous technical standards. We favor written RFCs and data-backed decisions over top-down directives. Teams operate with 2-week sprints, flexible hybrid autonomy, and blameless retrospectives where engineers continuously improve our tooling.";
      }
    } else if (/on call|rotation|incident|pager|production issue|alert/i.test(qLower)) {
      answer = "Every team owns their microservices end-to-end (You Build It, You Run It). On-call rotates weekly among engineers with secondary shadow support. We have strict SLOs and if paging alerts exceed 2 per week, we immediately dedicate 20% of sprint capacity to eliminate operational toil and automate runbooks.";
    } else if (/tech stack|architecture|debt|tools|legacy|refactor/i.test(qLower)) {
      answer = `Our core stack is built on modern distributed microservices with containerization, Kafka event streaming, and managed database clusters. Like any growing organization, we manage tech debt proactively: 15-20% of every quarterly roadmap is strictly allocated to architectural refactoring, dependency upgrades, and performance tuning.`;
    } else if (/growth|career|promotion|staff|expectations|mentorship|ladder/i.test(qLower)) {
      answer = "We have clear engineering ladders from Senior to Staff and Principal. Progression is evaluated on technical impact, cross-team influence, and mentorship rather than tenure. Senior engineers are expected to lead architectural initiatives, guide junior engineers, and deliver robust multi-quarter systems.";
    } else {
      answer = `That is a great question. In our engineering organization, we focus on empowering engineers to own complex problems from design through production telemetry. For the ${targetRole || 'engineering'} role specifically, your initial 90 days would involve pairing on key architectural initiatives, shipping incremental features to production, and helping shape our reliability best practices.`;
    }

    res.json({
      success: true,
      candidateQuestion: q,
      answer,
      interviewerRole,
      persona
    });
  } catch (err) {
    console.error('Ask interviewer error:', err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;

