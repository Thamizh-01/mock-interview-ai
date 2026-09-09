const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const optionalAuth = require('../middleware/optionalAuth');
const User = require('../models/User');

// ── Optional parsers ────────────────────────────────────────────────────────
let mammoth, PDFDocument;
try { mammoth     = require('mammoth');  } catch (e) {}
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
      const result = await mammoth.extractRawText({ path: filePath });
      if (result && result.value) return result.value;
    }
    if (ext === '.pdf') {
      const buffer = fs.readFileSync(filePath);
      // Try standard pdf-parse
      try {
        const pdf = require('pdf-parse');
        if (typeof pdf === 'function') {
          const data = await pdf(buffer);
          if (data && data.text && data.text.trim()) return data.text;
        } else if (pdf && pdf.PDFParse) {
          const parser = new pdf.PDFParse({});
          const data = await parser.load({ data: new Uint8Array(buffer) });
          if (data && data.text && data.text.trim()) return data.text;
        }
      } catch (pdfErr) {
        console.warn('pdf-parse standard attempt:', pdfErr.message);
      }

      // Try pdf-parse v2 class if present
      try {
        const { PDFParse } = require('pdf-parse');
        if (PDFParse) {
          const parser = new PDFParse({});
          const data = await parser.load({ data: new Uint8Array(buffer) });
          if (data && data.text && data.text.trim()) return data.text;
        }
      } catch (_) {}

      // Fallback: read raw bytes and extract readable ASCII chunks
      const raw = buffer.toString('binary');
      const chunks = raw.match(/[A-Za-z0-9 ,.\-@\n\r:\/+#()&%$!?'"]{4,}/g) || [];
      const extracted = chunks.join(' ').trim();
      if (extracted.length > 30) return extracted;
    }
    return fs.readFileSync(filePath, 'utf8');
  } catch (err) {
    console.error('Text extraction error:', err.message);
    return '';
  }
}

// ══════════════════════════════════════════════════════════════════════════════
// SMART AI-LIKE RESUME ANALYZER
// ══════════════════════════════════════════════════════════════════════════════
function smartAnalyzeResume(text, fileName) {
  const t   = text || '';
  const low = t.toLowerCase();
  const words = t.split(/\s+/).filter(Boolean);
  const wordCount = words.length;

  // ── 1. Detect Role / Domain ──────────────────────────────────────────────
  const roleSignals = {
    'Full Stack Developer':     ['react','node','express','mongodb','fullstack','full-stack','full stack','nextjs','vue','angular'],
    'Frontend Developer':       ['react','html','css','javascript','typescript','webpack','sass','tailwind','figma','ui'],
    'Backend Developer':        ['node','express','django','flask','spring','java','golang','api','microservices','rest'],
    'Data Scientist':           ['python','machine learning','tensorflow','pytorch','pandas','numpy','data science','ml','nlp'],
    'Data Engineer':            ['spark','hadoop','kafka','airflow','etl','pipeline','bigquery','snowflake','dbt'],
    'DevOps Engineer':          ['docker','kubernetes','terraform','ci/cd','jenkins','ansible','aws','azure','gcp'],
    'Mobile Developer':         ['android','ios','swift','kotlin','react native','flutter','xcode'],
    'Database Administrator':   ['sql','postgresql','mysql','oracle','mongodb','dba','database','indexing','query'],
    'Security Engineer':        ['security','penetration','firewall','vulnerability','siem','cissp','owasp'],
    'Product Manager':          ['product','roadmap','stakeholder','sprint','agile','kpi','user story'],
    'Software Engineer':        ['software','algorithm','data structure','system design','oop','git','code review'],
  };

  let detectedRole = 'Software Engineer';
  let maxMatches = 0;
  for (const [role, signals] of Object.entries(roleSignals)) {
    const matches = signals.filter(s => low.includes(s)).length;
    if (matches > maxMatches) { maxMatches = matches; detectedRole = role; }
  }

  // ── 2. Contact Info Detection ────────────────────────────────────────────
  const hasEmail    = /[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}/i.test(t);
  const hasPhone    = /(\+?[\d][\d\s\-().]{7,}\d)/.test(t);
  const hasLinkedin = /linkedin\.com\//i.test(t) || /linkedin/i.test(t);
  const hasGithub   = /github\.com\//i.test(t) || /github/i.test(t);
  const hasPortfolio= /portfolio|website|netlify|vercel|\.io|\.dev|\.me/i.test(t);

  // ── 3. Section Detection ─────────────────────────────────────────────────
  const hasSummary     = /summary|objective|profile|about me|overview/i.test(t);
  const hasExperience  = /experience|employment|work history|professional|internship/i.test(t);
  const hasEducation   = /education|university|college|degree|bachelor|master|diploma|b\.e|b\.tech|m\.tech/i.test(t);
  const hasSkills      = /skills|technologies|tech stack|competencies|expertise/i.test(t);
  const hasProjects    = /project|portfolio|github|built|developed|created|implemented/i.test(t);
  const hasCertifications = /certif|aws certified|google certified|microsoft certified|credential/i.test(t);
  const hasAchievements   = /achiev|award|honor|recognition|won|winner|rank|scholarship/i.test(t);

  // ── 4. Quality Signals ───────────────────────────────────────────────────
  const hasMetrics     = /\d+%|\d+x|\d+\+|\$[\d]+|[\d]+ (users|clients|projects|team|million|thousand)/i.test(t);
  const hasActionVerbs = /\b(developed|designed|implemented|built|created|led|managed|optimized|improved|delivered|deployed|architected|scaled|reduced|increased|launched|collaborated|mentored|automated|migrated|integrated)\b/i.test(t);
  const isTooShort     = wordCount < 150;
  const isTooLong      = wordCount > 1200;

  // ── 5. Keyword Analysis ──────────────────────────────────────────────────
  const ALL_TECH = [
    // Languages
    'javascript','typescript','python','java','c++','c#','ruby','php','golang','rust','swift','kotlin','scala',
    // Frontend
    'react','angular','vue','nextjs','html','css','sass','tailwind','webpack','vite','redux',
    // Backend
    'node','express','django','flask','spring','fastapi','graphql','rest api','microservices',
    // Databases
    'sql','mysql','postgresql','mongodb','redis','elasticsearch','firebase','dynamodb','cassandra',
    // Cloud & DevOps
    'aws','azure','gcp','docker','kubernetes','terraform','jenkins','github actions','ci/cd','linux',
    // Tools
    'git','jira','figma','postman','vs code','intellij',
    // AI/ML
    'machine learning','tensorflow','pytorch','pandas','numpy','scikit-learn','nlp','computer vision',
    // Soft
    'agile','scrum','leadership','communication','teamwork','problem solving','analytical'
  ];

  const foundKeywords   = ALL_TECH.filter(k => low.includes(k));
  const kwByRole = {
    'Full Stack Developer':   ['react','node','express','mongodb','sql','rest api','git','docker'],
    'Frontend Developer':     ['react','typescript','css','webpack','figma','accessibility','testing'],
    'Backend Developer':      ['rest api','microservices','sql','docker','redis','message queue','authentication'],
    'Data Scientist':         ['machine learning','python','pandas','tensorflow','statistics','sql','visualization'],
    'DevOps Engineer':        ['docker','kubernetes','terraform','ci/cd','monitoring','linux','scripting'],
    'Software Engineer':      ['data structures','algorithms','oop','design patterns','git','testing','rest api'],
  };
  const roleKeywords     = kwByRole[detectedRole] || kwByRole['Software Engineer'];
  const missingKeywords  = roleKeywords.filter(k => !low.includes(k)).slice(0, 8);

  // ── 6. Scoring ───────────────────────────────────────────────────────────
  let score    = 0;
  let atsScore = 0;

  // Contact info (20 pts)
  if (hasEmail)    { score += 8;  atsScore += 8;  }
  if (hasPhone)    { score += 6;  atsScore += 6;  }
  if (hasLinkedin) { score += 4;  atsScore += 4;  }
  if (hasGithub)   { score += 2;  atsScore += 2;  }

  // Sections (30 pts)
  if (hasSummary)    { score += 5;  atsScore += 4;  }
  if (hasExperience) { score += 8;  atsScore += 10; }
  if (hasEducation)  { score += 6;  atsScore += 6;  }
  if (hasSkills)     { score += 6;  atsScore += 8;  }
  if (hasProjects)   { score += 5;  atsScore += 4;  }

  // Keywords (20 pts)
  const kwScore = Math.min(20, Math.round((foundKeywords.length / 15) * 20));
  score    += kwScore;
  atsScore += Math.min(20, kwScore + 2);

  // Quality (15 pts)
  if (hasMetrics)     { score += 7;  }
  if (hasActionVerbs) { score += 5;  }
  if (hasCertifications) { score += 3; atsScore += 3; }
  if (hasAchievements)   { score += 3; }

  // Word count (15 pts)
  if (!isTooShort && !isTooLong) { score += 10; atsScore += 5; }
  else if (wordCount >= 80)      { score += 5;  atsScore += 2; }

  score    = Math.min(100, Math.max(10, score));
  atsScore = Math.min(100, Math.max(10, atsScore));

  // ── 7. Strengths ─────────────────────────────────────────────────────────
  const strengths = [];
  if (hasEmail && hasPhone)       strengths.push('Complete contact information with email and phone number');
  else if (hasEmail)              strengths.push('Professional email address is present');
  if (hasLinkedin)                strengths.push('LinkedIn profile included — great for recruiter outreach');
  if (hasGithub)                  strengths.push('GitHub profile linked — demonstrates active coding practice');
  if (hasExperience)              strengths.push('Work experience section is well-structured and present');
  if (hasEducation)               strengths.push('Educational background is clearly stated');
  if (hasSkills)                  strengths.push('Dedicated skills section makes keyword scanning easy for ATS');
  if (hasProjects)                strengths.push('Project section demonstrates hands-on practical experience');
  if (hasMetrics)                 strengths.push('Quantified achievements strengthen credibility (numbers detected)');
  if (hasActionVerbs)             strengths.push('Strong action verbs used to describe responsibilities');
  if (foundKeywords.length >= 10) strengths.push(`Good technical keyword density — ${foundKeywords.length} relevant keywords detected`);
  if (hasCertifications)          strengths.push('Certifications show commitment to continuous learning');
  if (!isTooShort && !isTooLong)  strengths.push(`Ideal resume length (${wordCount} words) — concise yet detailed`);
  if (detectedRole !== 'Software Engineer') strengths.push(`Resume aligns well with ${detectedRole} positions`);

  // ── 8. Improvements ──────────────────────────────────────────────────────
  const improvements = [];
  if (!hasEmail)     improvements.push('Add a professional email address at the top of your resume');
  if (!hasPhone)     improvements.push('Include a phone number so recruiters can contact you directly');
  if (!hasLinkedin)  improvements.push('Add your LinkedIn profile URL — 87% of recruiters use it to screen candidates');
  if (!hasGithub && ['Full Stack Developer','Frontend Developer','Backend Developer','Software Engineer','DevOps Engineer'].includes(detectedRole))
                     improvements.push('Add your GitHub profile to showcase your code and projects');
  if (!hasSummary)   improvements.push('Add a 2-3 sentence professional summary tailored to your target role');
  if (!hasMetrics)   improvements.push('Quantify your achievements (e.g. "Reduced load time by 40%", "Led a team of 5")');
  if (!hasProjects)  improvements.push('Add a Projects section with links to GitHub repos or live demos');
  if (isTooShort)    improvements.push(`Resume is too short (${wordCount} words) — add more detail to experience and projects`);
  if (isTooLong)     improvements.push(`Resume is long (${wordCount} words) — condense to 1-2 pages for best results`);
  if (missingKeywords.length > 3) improvements.push(`Add missing role-specific keywords: ${missingKeywords.slice(0,4).join(', ')}`);
  if (!hasActionVerbs) improvements.push('Use strong action verbs: Developed, Implemented, Optimized, Designed, Led, Deployed');
  if (!hasCertifications && ['Data Scientist','DevOps Engineer','Cloud','Security'].some(r => detectedRole.includes(r)))
                     improvements.push('Consider adding relevant certifications (AWS, GCP, Azure) to stand out');

  // ── 9. ATS Tips tailored to detected role ────────────────────────────────
  const atsTips = [
    'Use standard section headings: "Experience", "Education", "Skills" — avoid creative names like "My Journey"',
    `Include role-specific keywords from job postings for ${detectedRole} positions`,
    'Keep formatting clean — no tables, columns, text boxes, headers, or footers (ATS can\'t read them)',
    'Save your resume as a plain PDF or .docx — avoid image-based PDFs',
    'Name your file professionally: FirstName_LastName_Resume.pdf',
    'Avoid using abbreviations without spelling them out first (e.g. "ML (Machine Learning)")',
    'Tailor your resume for each application by matching keywords from the job description'
  ];

  // ── 10. Summary ──────────────────────────────────────────────────────────
  const grade = score >= 80 ? 'excellent' : score >= 65 ? 'good' : score >= 45 ? 'fair' : 'needs improvement';
  const summary = `Your resume scored ${score}/100 with ${atsScore}% ATS compatibility — ${grade} overall. `
    + `Detected ${foundKeywords.length} relevant keywords for a ${detectedRole} profile. `
    + (strengths.length > improvements.length
        ? `Strong foundation with ${strengths.length} positive signals. Minor refinements will make it exceptional.`
        : `Focus on ${improvements.slice(0, 2).map(i => i.split(' ').slice(0, 4).join(' ')).join(' and ')} to significantly boost your score.`);

  return {
    score,
    atsScore,
    overallScore: score,
    detectedRole,
    strengths:        strengths.slice(0, 6),
    improvements:     improvements.slice(0, 6),
    foundKeywords:    foundKeywords.slice(0, 20),
    missingKeywords:  missingKeywords.slice(0, 8),
    atsTips,
    summary
  };
}

// ══════════════════════════════════════════════════════════════════════════════
// POST /api/resume/upload  — Upload + Smart AI analyze (works for guests)
// ══════════════════════════════════════════════════════════════════════════════
router.post('/upload', optionalAuth, upload.single('resume'), async (req, res) => {
  if (!req.file) {
    return res.status(400).json({ message: 'No file uploaded' });
  }

  const filePath = req.file.path || path.join(uploadsDir, req.file.filename);

  try {
    console.log('📄 Extracting text from:', req.file.originalname);
    const text = await extractText(filePath);
    console.log(`📝 Extracted ${text ? text.split(/\s+/).length : 0} words`);

    const analysis = smartAnalyzeResume(text, req.file.originalname);
    analysis.analyzedAt   = new Date();
    analysis.overallScore = analysis.score;
    console.log(`✅ Analysis complete — Score: ${analysis.score}, Role: ${analysis.detectedRole}`);

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

    const doc = new PDFDocument();
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', 'attachment; filename=Resume_Analysis_Report.pdf');
    doc.pipe(res);

    doc.fontSize(24).font('Helvetica-Bold').text('Resume Analysis Report', { align: 'center' });
    doc.moveDown(0.5);
    doc.fontSize(12).font('Helvetica').text(`Generated: ${new Date().toLocaleDateString()}`, { align: 'center' });
    if (analysis.detectedRole) doc.fontSize(12).text(`Detected Role: ${analysis.detectedRole}`, { align: 'center' });
    doc.moveDown(2);

    doc.fontSize(18).font('Helvetica-Bold').text('Overall Score');
    doc.fontSize(36).text(`${analysis.score}/100`, { align: 'center' });
    doc.fontSize(14).text(`ATS Compatibility: ${analysis.atsScore}%`, { align: 'center' });
    doc.moveDown(1.5);

    doc.fontSize(16).font('Helvetica-Bold').text('Summary');
    doc.fontSize(12).font('Helvetica').text(analysis.summary || '');
    doc.moveDown(1.5);

    doc.fontSize(16).font('Helvetica-Bold').text('Strengths');
    doc.fontSize(12).font('Helvetica');
    (analysis.strengths || []).forEach((s, i) => doc.text(`${i + 1}. ${s}`));
    doc.moveDown(1);

    doc.fontSize(16).font('Helvetica-Bold').text('Areas for Improvement');
    doc.fontSize(12).font('Helvetica');
    (analysis.improvements || []).forEach((item, i) => doc.text(`${i + 1}. ${item}`));
    doc.moveDown(1);

    doc.fontSize(16).font('Helvetica-Bold').text('Keywords Found');
    doc.fontSize(12).font('Helvetica').text((analysis.foundKeywords || []).join(', ') || 'None');
    doc.moveDown(1);

    doc.fontSize(16).font('Helvetica-Bold').text('Missing Keywords');
    doc.fontSize(12).font('Helvetica').text((analysis.missingKeywords || []).join(', ') || 'None');
    doc.moveDown(1);

    doc.fontSize(16).font('Helvetica-Bold').text('ATS Tips');
    doc.fontSize(12).font('Helvetica');
    (analysis.atsTips || []).forEach((t, i) => doc.text(`${i + 1}. ${t}`));

    doc.end();
  } catch (error) {
    console.error('PDF generation error:', error);
    res.status(500).json({ message: 'Error generating PDF', error: error.message });
  }
});

module.exports = router;