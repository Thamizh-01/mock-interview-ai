import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const Resume = () => {
  const [file, setFile] = useState(null);
  const [dragOver, setDragOver] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [analysis, setAnalysis] = useState(null);
  const [message, setMessage] = useState(null);
  const fileInputRef = useRef(null);

  useEffect(() => {
    loadPreviousAnalysis();
  }, []);

  const showMessage = (type, text) => {
    setMessage({ type, text });
    setTimeout(() => setMessage(null), 6000);
  };

  const loadPreviousAnalysis = async () => {
    try {
      const res = await api.get('/resume/analysis');
      if (res.data?.analysis) {
        setAnalysis(res.data.analysis);
      }
    } catch (err) {
      // No previous analysis — this is fine for guests/new users
    }
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    processFile(selectedFile);
  };

  const processFile = (selectedFile) => {
    if (!selectedFile) return;
    const validTypes = ['.pdf', '.doc', '.docx'];
    const ext = selectedFile.name.substring(selectedFile.name.lastIndexOf('.')).toLowerCase();
    if (validTypes.includes(ext) && selectedFile.size <= 5 * 1024 * 1024) {
      setFile(selectedFile);
      setAnalysis(null); // Clear previous result when new file picked
      showMessage('success', `✅ "${selectedFile.name}" selected. Click Analyze to continue.`);
    } else {
      showMessage('error', 'Please upload a PDF, DOC, or DOCX file under 5MB.');
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    const dropped = e.dataTransfer.files[0];
    processFile(dropped);
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    setDragOver(true);
  };

  const handleDragLeave = () => setDragOver(false);

  const analyzeResume = async () => {
    if (!file) {
      showMessage('error', 'Please select a resume file first.');
      return;
    }
    setAnalyzing(true);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      formData.append('analyze', 'true');

      const res = await api.post('/resume/upload', formData);

      if (res.data?.analysis) {
        setAnalysis(res.data.analysis);
        showMessage('success', '🎉 Resume analyzed successfully!');
        try {
          api.post('/progress/analyze-resume', {
            score: res.data.analysis.overallScore || res.data.analysis.score || 80,
            fileName: file.name
          }).catch(() => {});
        } catch (e) {}
      } else {
        showMessage('error', 'Analysis returned no data. Please try again.');
      }
    } catch (err) {
      console.error('Analysis failed:', err);
      const errMsg = err.response?.data?.message || 'Failed to analyze resume. Please try again.';
      showMessage('error', errMsg);
    } finally {
      setAnalyzing(false);
    }
  };

  const handleClearAndRetry = () => {
    setAnalysis(null);
    setFile(null);
    setMessage(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const downloadReport = async () => {
    if (!analysis) return;
    try {
      const response = await api.get('/resume/report/pdf', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'Resume_Analysis_Report.pdf');
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);
    } catch (err) {
      showMessage('error', 'PDF download failed. Please sign in to use this feature.');
    }
  };

  const getScoreColor = (score) => {
    if (score >= 75) return '#10b981';
    if (score >= 50) return '#f59e0b';
    return '#f43f5e';
  };

  const getScoreLabel = (score) => {
    if (score >= 80) return 'Excellent';
    if (score >= 65) return 'Good';
    if (score >= 45) return 'Fair';
    return 'Needs Work';
  };

  const scoreColor = analysis ? getScoreColor(analysis.score || 0) : '#6366f1';
  const atsColor = analysis ? getScoreColor(analysis.atsScore || 0) : '#6366f1';

  return (
    <div className="resume-page section">
      <div className="container">

        {/* Toast Message */}
        {message && (
          <div className={`resume-toast resume-toast-${message.type}`}>
            <span className="toast-icon">{message.type === 'success' ? '✓' : '✕'}</span>
            <span className="toast-text">{message.text}</span>
            <button className="toast-close" onClick={() => setMessage(null)}>×</button>
          </div>
        )}

        {/* Page Header */}
        <div className="resume-page-header">
          <div className="resume-header-badge">AI-Powered</div>
          <h1>Resume Analysis & ATS Scanner</h1>
          <p>Upload your resume for instant keyword detection, ATS compatibility scoring, and personalized improvement suggestions.</p>
        </div>

        {/* Upload Zone (shown when no analysis yet) */}
        {!analysis && (
          <div className="resume-upload-card card">
            <div
              className={`drop-zone ${dragOver ? 'drag-active' : ''} ${file ? 'file-selected' : ''}`}
              onDrop={handleDrop}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onClick={() => !file && fileInputRef.current?.click()}
            >
              <input
                type="file"
                ref={fileInputRef}
                accept=".pdf,.doc,.docx"
                onChange={handleFileChange}
                style={{ display: 'none' }}
              />

              {!file ? (
                <>
                  <div className="drop-icon">📄</div>
                  <h3 className="drop-title">Drop your resume here</h3>
                  <p className="drop-sub">or <span className="browse-link" onClick={() => fileInputRef.current?.click()}>browse files</span></p>
                  <p className="drop-types">Supported: PDF, DOC, DOCX &nbsp;·&nbsp; Max 5MB</p>
                </>
              ) : (
                <div className="file-ready-state">
                  <div className="file-icon-large">📋</div>
                  <div className="file-ready-info">
                    <span className="file-ready-name">{file.name}</span>
                    <span className="file-ready-size">{(file.size / 1024).toFixed(1)} KB</span>
                  </div>
                  <button
                    className="btn-remove-file"
                    onClick={(e) => { e.stopPropagation(); handleClearAndRetry(); }}
                  >
                    ✕ Remove
                  </button>
                </div>
              )}
            </div>

            <div className="upload-actions">
              <button
                className="btn-analyze"
                onClick={analyzeResume}
                disabled={!file || analyzing}
              >
                {analyzing ? (
                  <>
                    <span className="btn-spinner"></span>
                    Analyzing your resume...
                  </>
                ) : (
                  '🔍 Analyze Resume'
                )}
              </button>

              {!file && (
                <p className="upload-note">
                  📌 Sign-in is not required. Your resume is processed locally and never stored permanently.
                </p>
              )}
            </div>
          </div>
        )}

        {/* Analysis Results */}
        {analysis && (
          <div className="analysis-results-wrapper">

            {/* Result Header Actions */}
            <div className="result-nav-bar">
              <button className="btn-back-clean" onClick={handleClearAndRetry}>
                ← Analyze Another Resume
              </button>
              <div className="result-actions">
                <button className="btn-secondary" onClick={downloadReport}>
                  📥 Download PDF Report
                </button>
              </div>
            </div>

            {/* Candidate Profile Card */}
            <div className="candidate-profile-banner card">
              <div className="candidate-profile-details">
                <div className="candidate-avatar">👤</div>
                <div className="candidate-meta">
                  <h2 className="candidate-name">{analysis.candidateName || 'Candidate Profile'}</h2>
                  <div className="candidate-tags">
                    <span className="c-tag role-tag">🎯 {analysis.detectedRole || 'Software Professional'}</span>
                    {analysis.experienceLevel && (
                      <span className="c-tag level-tag">💼 {analysis.experienceLevel}</span>
                    )}
                    {analysis.wordCount > 0 && (
                      <span className="c-tag words-tag">📝 {analysis.wordCount} words</span>
                    )}
                    {analysis.metricsCount !== undefined && (
                      <span className="c-tag metrics-tag">📊 {analysis.metricsCount} quantified metrics</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Score Summary Hero */}
            <div className="score-hero card">
              <div className="score-hero-content">
                <div className="score-ring-group">
                  {/* Overall Score Gauge */}
                  <div className="score-ring-wrap">
                    <div className="score-gauge-box">
                      <svg viewBox="0 0 100 100" className="score-gauge-svg">
                        <circle cx="50" cy="50" r="42" className="gauge-bg" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          className="gauge-fill"
                          style={{
                            stroke: scoreColor,
                            strokeDasharray: 263.89,
                            strokeDashoffset: 263.89 - (263.89 * Math.min(100, Math.max(0, analysis.score || 0))) / 100
                          }}
                        />
                      </svg>
                      <div className="score-gauge-center">
                        <span className="gauge-score-value" style={{ color: scoreColor }}>
                          {analysis.score || 0}
                        </span>
                        <span className="gauge-score-max">/ 100</span>
                      </div>
                    </div>
                    <span className="ring-title">Overall Score</span>
                    <span className="ring-grade" style={{ color: scoreColor }}>
                      {getScoreLabel(analysis.score || 0)}
                    </span>
                  </div>

                  {/* ATS Score Gauge */}
                  <div className="score-ring-wrap">
                    <div className="score-gauge-box">
                      <svg viewBox="0 0 100 100" className="score-gauge-svg">
                        <circle cx="50" cy="50" r="42" className="gauge-bg" />
                        <circle
                          cx="50"
                          cy="50"
                          r="42"
                          className="gauge-fill"
                          style={{
                            stroke: atsColor,
                            strokeDasharray: 263.89,
                            strokeDashoffset: 263.89 - (263.89 * Math.min(100, Math.max(0, analysis.atsScore || 0))) / 100
                          }}
                        />
                      </svg>
                      <div className="score-gauge-center">
                        <span className="gauge-score-value" style={{ color: atsColor }}>
                          {analysis.atsScore || 0}%
                        </span>
                        <span className="gauge-score-max">ATS Match</span>
                      </div>
                    </div>
                    <span className="ring-title">ATS Score</span>
                    <span className="ring-grade" style={{ color: atsColor }}>
                      {getScoreLabel(analysis.atsScore || 0)}
                    </span>
                  </div>
                </div>

                {/* Keyword Stats Grid */}
                <div className="score-quick-stats">
                  <div className="quick-stat-pill">
                    <span className="qsp-num" style={{ color: '#10b981' }}>{(analysis.foundKeywords || []).length}</span>
                    <span className="qsp-lbl">Keywords Found</span>
                  </div>
                  <div className="quick-stat-pill">
                    <span className="qsp-num" style={{ color: '#f43f5e' }}>{(analysis.missingKeywords || []).length}</span>
                    <span className="qsp-lbl">Keywords Missing</span>
                  </div>
                  <div className="quick-stat-pill">
                    <span className="qsp-num" style={{ color: '#6366f1' }}>{(analysis.strengths || []).length}</span>
                    <span className="qsp-lbl">Strengths Found</span>
                  </div>
                  <div className="quick-stat-pill">
                    <span className="qsp-num" style={{ color: '#f59e0b' }}>{(analysis.improvements || []).length}</span>
                    <span className="qsp-lbl">Improvements</span>
                  </div>
                </div>
              </div>

              {/* Summary Callout */}
              <div className="analysis-summary-callout">
                <span className="callout-icon">💬</span>
                <p>{analysis.summary || 'Analysis complete. Review the detailed breakdown below.'}</p>
              </div>
            </div>

            {/* Section Breakdown Health Check */}
            {analysis.sectionBreakdown && analysis.sectionBreakdown.length > 0 && (
              <div className="result-section card section-breakdown-card">
                <div className="result-section-header">
                  <span className="section-icon">📋</span>
                  <h3>ATS Section Breakdown & Health</h3>
                </div>
                <div className="section-health-grid">
                  {analysis.sectionBreakdown.map((sec, i) => (
                    <div key={i} className={`health-item-card status-${sec.status}`}>
                      <div className="health-item-top">
                        <span className="health-item-name">{sec.name}</span>
                        <span className={`health-badge badge-${sec.status}`}>
                          {sec.status === 'pass' ? '✓ Passed' : '⚠ Optimize'}
                        </span>
                      </div>
                      <p className="health-item-details">{sec.details}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Two-column results grid */}
            <div className="results-two-col">

              {/* Strengths */}
              <div className="result-section card">
                <div className="result-section-header strengths-header">
                  <span className="section-icon">✅</span>
                  <h3>Key Strengths</h3>
                  <span className="section-count">{(analysis.strengths || []).length}</span>
                </div>
                <ul className="result-list strengths-list">
                  {(analysis.strengths || []).length > 0 ? (
                    analysis.strengths.map((s, i) => (
                      <li key={i}>
                        <span className="list-dot" style={{ background: '#10b981' }}></span>
                        {s}
                      </li>
                    ))
                  ) : (
                    <li className="list-empty">No distinct strengths detected. Try uploading a detailed resume.</li>
                  )}
                </ul>
              </div>

              {/* Improvements */}
              <div className="result-section card">
                <div className="result-section-header improvements-header">
                  <span className="section-icon">⚠️</span>
                  <h3>Actionable Improvements</h3>
                  <span className="section-count improvement-count">{(analysis.improvements || []).length}</span>
                </div>
                <ul className="result-list improvements-list">
                  {(analysis.improvements || []).length > 0 ? (
                    analysis.improvements.map((item, i) => (
                      <li key={i}>
                        <span className="list-dot" style={{ background: '#f59e0b' }}></span>
                        {item}
                      </li>
                    ))
                  ) : (
                    <li className="list-empty">Great — no critical improvements required!</li>
                  )}
                </ul>
              </div>
            </div>

            {/* Keyword Analysis */}
            <div className="result-section card keyword-section">
              <div className="result-section-header">
                <span className="section-icon">🔑</span>
                <h3>Technical Keyword Analysis</h3>
              </div>
              <div className="keyword-cols">
                <div className="keyword-group">
                  <h4 className="kw-group-title" style={{ color: '#10b981' }}>
                    ✓ Detected Competencies ({(analysis.foundKeywords || []).length})
                  </h4>
                  <div className="keyword-tags-wrap">
                    {(analysis.foundKeywords || []).length > 0 ? (
                      analysis.foundKeywords.map((k, i) => (
                        <span key={i} className="kw-tag kw-found">{k}</span>
                      ))
                    ) : (
                      <span className="kw-empty">None detected</span>
                    )}
                  </div>
                </div>
                <div className="keyword-group">
                  <h4 className="kw-group-title" style={{ color: '#f43f5e' }}>
                    ✗ Target Role Gaps ({(analysis.missingKeywords || []).length})
                  </h4>
                  <div className="keyword-tags-wrap">
                    {(analysis.missingKeywords || []).length > 0 ? (
                      analysis.missingKeywords.map((k, i) => (
                        <span key={i} className="kw-tag kw-missing">{k}</span>
                      ))
                    ) : (
                      <span className="kw-empty">No critical role keywords missing</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Bullet Point Rewrites (Google X-Y-Z Method) */}
            {analysis.bulletRewrites && analysis.bulletRewrites.length > 0 && (
              <div className="result-section card bullet-rewrites-section">
                <div className="result-section-header">
                  <span className="section-icon">✍️</span>
                  <h3>How to Upgrade Your Experience Bullets (Google X-Y-Z Method)</h3>
                </div>
                <p className="bullet-rewrite-sub">
                  Transform passive task descriptions into quantified accomplishment statements: <em>"Accomplished [X] as measured by [Y], by doing [Z]"</em>.
                </p>
                <div className="rewrites-grid">
                  {analysis.bulletRewrites.map((item, i) => (
                    <div key={i} className="rewrite-card">
                      <div className="rewrite-before">
                        <span className="rewrite-label label-before">❌ Weak Before</span>
                        <p>{item.before}</p>
                      </div>
                      <div className="rewrite-arrow">➔</div>
                      <div className="rewrite-after">
                        <span className="rewrite-label label-after">✅ High-Impact After</span>
                        <p>{item.after}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* ATS Tips */}
            <div className="result-section card ats-section">
              <div className="result-section-header">
                <span className="section-icon">🤖</span>
                <h3>ATS Compatibility & Formatting Tips</h3>
              </div>
              <div className="ats-tips-grid">
                {(analysis.atsTips || []).map((tip, i) => (
                  <div key={i} className="ats-tip-card">
                    <span className="ats-tip-num">{i + 1}</span>
                    <p>{tip}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="resume-result-cta">
              <button className="btn-primary" onClick={handleClearAndRetry}>
                📤 Upload & Analyze Another Resume
              </button>
              <button className="btn-secondary" onClick={downloadReport}>
                📥 Download Full PDF Report
              </button>
            </div>

          </div>
        )}
      </div>
    </div>
  );
};

export default Resume;