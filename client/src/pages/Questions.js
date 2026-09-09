import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Questions = () => {
  const [domains, setDomains] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selectedDomain, setSelectedDomain] = useState(null);
  const [selectedSubtype, setSelectedSubtype] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState(null);
  const [score, setScore] = useState(0);
  const [attendedCount, setAttendedCount] = useState(0);
  const [analysisResult, setAnalysisResult] = useState(null);
  const [questionResults, setQuestionResults] = useState([]);
  const [showDetailedReport, setShowDetailedReport] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadDomainsAndCategories();
  }, []);

  const loadDomainsAndCategories = async () => {
    setLoading(true);
    try {
      const res = await api.get('/questions');
      if (res.data.domains && Array.isArray(res.data.domains)) {
        setDomains(res.data.domains);
      }
      if (res.data.categories && Array.isArray(res.data.categories)) {
        setCategories(res.data.categories);
      }
      setError(null);
    } catch (err) {
      console.error('Failed to load domains:', err);
      setError('Unable to load question domains. Please refresh or try again later.');
    } finally {
      setLoading(false);
    }
  };

  // Level 1: Domain Selection
  const handleSelectDomain = (domain) => {
    setSelectedDomain(domain);
    setSelectedSubtype(null);
    setQuestions([]);
    setAnswers({});
    setError(null);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Level 2: Technology Sub-type Selection
  const handleSelectSubtype = async (subtype) => {
    if (!selectedDomain) return;
    setLoading(true);
    try {
      const res = await api.get(`/questions/${selectedDomain.id}/${subtype.id}`);
      const loadedQuestions = res.data.questions || [];
      setQuestions(loadedQuestions);
      setSelectedSubtype(subtype);
      setCurrentIndex(0);
      setShowAnswer(false);
      setSubmitted(false);
      setIsFinished(false);
      setScore(0);
      setAttendedCount(0);
      setAnswers({});
      setAnalysisResult(null);
      setQuestionResults([]);
      setShowDetailedReport(false);
      setError(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch (err) {
      console.error('Failed to load subtype questions:', err);
      setError(`Unable to load questions for ${subtype.name}. Please try again.`);
    } finally {
      setLoading(false);
    }
  };

  // Backward-compatible direct category loading
  const handleLoadLegacyCategory = async (categoryName) => {
    setLoading(true);
    try {
      const res = await api.get(`/questions/${categoryName}`);
      const loadedQuestions = res.data.questions || [];
      setQuestions(loadedQuestions);
      setSelectedDomain({ id: categoryName, name: categoryName.toUpperCase(), subtypes: [] });
      setSelectedSubtype({ id: categoryName, name: categoryName.toUpperCase(), count: loadedQuestions.length });
      setCurrentIndex(0);
      setShowAnswer(false);
      setSubmitted(false);
      setIsFinished(false);
      setScore(0);
      setAttendedCount(0);
      setAnswers({});
      setAnalysisResult(null);
      setQuestionResults([]);
      setShowDetailedReport(false);
      setError(null);
    } catch (err) {
      console.error('Failed to load category:', err);
      setError('Unable to load questions for this category.');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkReviewed = async () => {
    try {
      const questionId = questions[currentIndex]?.id || `q-${currentIndex}`;
      await api.post('/progress/mark-reviewed', {
        questionId: questionId,
        category: selectedSubtype?.id || selectedDomain?.id
      });
    } catch (err) {
      console.error('Failed to mark reviewed:', err);
    }
  };

  const handleSubmitAnswer = async () => {
    const qObj = questions[currentIndex];
    const userAnswer = answers[qObj?.id];
    const correctAnswer = qObj?.a;
    const question = qObj?.q;

    if (!userAnswer?.trim() || !correctAnswer) return;

    setSubmitting(true);
    try {
      const res = await api.post('/questions/analyze', {
        userAnswer,
        correctAnswer,
        question
      });

      const result = res.data;
      
      setQuestionResults(prev => [...prev, {
        question,
        userAnswer,
        correctAnswer,
        result
      }]);
      
      setAnalysisResult(result);
      setSubmitted(true);

      const hasCorrect = result.matchedTerms > 0 || result.score >= 50;
      if (hasCorrect) {
        setScore(prev => prev + 1);
      }
      setAttendedCount(prev => prev + 1);

      await handleMarkReviewed();
    } catch (err) {
      console.error('Failed to analyze answer:', err);
      setSubmitted(true);
    } finally {
      setSubmitting(false);
    }
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSubmitted(false);
      setAnalysisResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSubmitted(false);
      setAnalysisResult(null);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  const handleJumpToQuestion = (index) => {
    setCurrentIndex(index);
    setShowAnswer(false);
    setSubmitted(false);
    setAnalysisResult(null);
  };

  const handleFinish = () => {
    setIsFinished(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleRestart = () => {
    if (selectedDomain && selectedSubtype) {
      handleSelectSubtype(selectedSubtype);
    } else {
      setIsFinished(false);
    }
  };

  const handleBackToSubtypes = () => {
    setSelectedSubtype(null);
    setQuestions([]);
    setIsFinished(false);
    setScore(0);
    setAttendedCount(0);
    setAnswers({});
    setShowDetailedReport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleBackToDomains = () => {
    setSelectedDomain(null);
    setSelectedSubtype(null);
    setQuestions([]);
    setIsFinished(false);
    setScore(0);
    setAttendedCount(0);
    setAnswers({});
    setShowDetailedReport(false);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const getScoreColor = () => {
    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    if (percentage >= 80) return '#10b981';
    if (percentage >= 60) return '#f59e0b';
    return '#f43f5e';
  };

  const getScoreMessage = () => {
    const percentage = questions.length > 0 ? (score / questions.length) * 100 : 0;
    if (percentage >= 80) return 'Outstanding! You showed strong mastery of core concepts!';
    if (percentage >= 60) return 'Solid performance! Continue reviewing model answers!';
    return 'Keep practicing! Review the model answers to master key terminology.';
  };

  const getGradeColor = (grade) => {
    if (grade === 'Excellent') return '#10b981';
    if (grade === 'Good') return '#6366f1';
    if (grade === 'Partial') return '#f59e0b';
    return '#f43f5e';
  };

  // -------------------------------------------------------------
  // LEVEL 1: ALL DOMAINS SELECTION VIEW
  // -------------------------------------------------------------
  if (!selectedDomain) {
    const filteredDomains = (domains || []).filter(d => 
      d.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.description?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      d.subtypes?.some(s => s.name.toLowerCase().includes(searchQuery.toLowerCase()))
    );

    return (
      <div className="questions-page section">
        <div className="container">
          <div className="questions-hero-header">
            <div className="hero-pill-badge">Domain Interview Hub</div>
            <h1 className="hero-heading">Master Tech Interview Questions</h1>
            <p className="hero-subtext">
              Select an interview domain below to explore specialized technology stacks. Each technology features <strong>30 authentic, high-yield interview questions</strong> with model answers and instant AI evaluation.
            </p>

            <div className="search-filter-bar">
              <span className="search-icon">🔍</span>
              <input 
                type="text"
                placeholder="Search domains or technologies (e.g. Full Stack, React, Docker, Node, SQL)..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="domain-search-input"
              />
              {searchQuery && (
                <button className="clear-search-btn" onClick={() => setSearchQuery('')}>✕</button>
              )}
            </div>
          </div>

          {error && (
            <div className="alert alert-danger text-center mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="domain-grid">
              {filteredDomains.map(domain => {
                const totalQuestions = domain.subtypes?.reduce((acc, s) => acc + (s.count || 30), 0) || 0;
                return (
                  <div 
                    key={domain.id} 
                    className="domain-card-premium card"
                    onClick={() => handleSelectDomain(domain)}
                  >
                    <div className="domain-card-top">
                      <div className="domain-icon-wrapper">
                        <span className="domain-card-icon">{domain.icon || '💼'}</span>
                      </div>
                      {domain.badge && (
                        <span className="domain-badge">{domain.badge}</span>
                      )}
                    </div>

                    <h3 className="domain-card-title">{domain.name}</h3>
                    <p className="domain-card-description">{domain.description}</p>

                    <div className="domain-tech-chips">
                      {(domain.subtypes || []).map(sub => (
                        <span key={sub.id} className="tech-chip">
                          <span className="tech-chip-icon">{sub.icon}</span>
                          <span className="tech-chip-text">{sub.name}</span>
                        </span>
                      ))}
                    </div>

                    <div className="domain-card-footer">
                      <span className="domain-q-count">
                        <strong>{domain.subtypes?.length || 0} Technologies</strong> • {totalQuestions} Questions
                      </span>
                      <span className="domain-explore-btn">
                        Explore →
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Legacy fallback if domains are empty */}
          {domains.length === 0 && categories.length > 0 && (
            <div className="legacy-categories-section mt-5">
              <h3 className="text-center mb-3">All Question Categories</h3>
              <div className="category-grid">
                {categories.map(cat => (
                  <div 
                    key={cat.name} 
                    className="category-card card"
                    onClick={() => handleLoadLegacyCategory(cat.name)}
                  >
                    <h3>{cat.displayName}</h3>
                    <p>{cat.count} questions</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LEVEL 2: TECHNOLOGY SUB-TYPE SELECTION VIEW
  // (e.g. Full Stack -> React, Node, Vite, Express, Next.js, Architecture)
  // -------------------------------------------------------------
  if (selectedDomain && !selectedSubtype) {
    const totalQuestions = selectedDomain.subtypes?.reduce((acc, s) => acc + (s.count || 30), 0) || 0;

    return (
      <div className="questions-page section">
        <div className="container">
          {/* Breadcrumb Navigation */}
          <div className="domain-nav-banner">
            <button className="btn-back-clean" onClick={handleBackToDomains}>
              ← Back to All Domains
            </button>
            <div className="breadcrumb-pill">
              <span>Domains</span>
              <span className="breadcrumb-arrow">›</span>
              <span className="breadcrumb-active">{selectedDomain.name}</span>
            </div>
          </div>

          {/* Domain Hero Banner */}
          <div className="domain-hero-banner">
            <div className="domain-hero-icon">{selectedDomain.icon}</div>
            <div className="domain-hero-info">
              <h2>{selectedDomain.name}</h2>
              <p>{selectedDomain.description}</p>
              <div className="domain-hero-stats">
                <span className="stat-tag">⚡ {selectedDomain.subtypes?.length || 0} Specialized Stacks</span>
                <span className="stat-tag">🎯 {totalQuestions} Curated Questions</span>
                <span className="stat-tag">✨ 30 Questions Per Technology</span>
              </div>
            </div>
          </div>

          <div className="subtype-intro-bar">
            <h3>Select a Technology to Start 30 Questions Practice</h3>
            <p className="text-muted">Click on any technology to practice authentic interview questions with instant evaluation.</p>
          </div>

          {error && (
            <div className="alert alert-danger text-center mb-4">
              {error}
            </div>
          )}

          {loading ? (
            <div className="loading-spinner"></div>
          ) : (
            <div className="subtype-grid">
              {(selectedDomain.subtypes || []).map(subtype => (
                <div 
                  key={subtype.id} 
                  className="subtype-card card"
                  onClick={() => handleSelectSubtype(subtype)}
                >
                  <div className="subtype-card-header">
                    <div className="subtype-icon-circle">
                      <span>{subtype.icon || '🚀'}</span>
                    </div>
                    <span className="subtype-q-badge">{subtype.count || 30} Questions</span>
                  </div>

                  <h3 className="subtype-title">{subtype.name}</h3>
                  <p className="subtype-description">{subtype.description}</p>

                  <div className="subtype-card-action">
                    <span className="btn-start-subtype">
                      Practice {subtype.name} ({subtype.count || 30} Questions) →
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // RESULTS REPORT VIEW
  // -------------------------------------------------------------
  if (isFinished && !showDetailedReport) {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    return (
      <div className="results-page section">
        <div className="container">
          <div className="results-card">
            <div className="results-header">
              <span className="results-icon-badge">{selectedSubtype?.icon || '🎉'}</span>
              <h2>Practice Complete!</h2>
              <p className="results-subtitle">
                {selectedDomain?.name} › <strong>{selectedSubtype?.name}</strong>
              </p>
            </div>
            
            <div className="score-display">
              <div className="score-circle-large" style={{ borderColor: getScoreColor() }}>
                <span className="score-percentage" style={{ color: getScoreColor() }}>{percentage}%</span>
              </div>
              <p className="score-message">{getScoreMessage()}</p>
            </div>

            <div className="score-details">
              <div className="score-stat">
                <span className="stat-value" style={{ color: '#10b981' }}>{score}</span>
                <span className="stat-label">Proficient</span>
              </div>
              <div className="score-stat">
                <span className="stat-value" style={{ color: '#6366f1' }}>{questions.length}</span>
                <span className="stat-label">Total Questions</span>
              </div>
              <div className="score-stat">
                <span className="stat-value" style={{ color: '#f59e0b' }}>{attendedCount}</span>
                <span className="stat-label">Attended</span>
              </div>
              <div className="score-stat">
                <span className="stat-value" style={{ color: '#94a3b8' }}>{questions.length - attendedCount}</span>
                <span className="stat-label">Skipped</span>
              </div>
            </div>

            <div className="results-actions">
              <button className="btn-primary" onClick={() => setShowDetailedReport(true)}>
                📋 View Detailed Report
              </button>
              <button className="btn-secondary" onClick={handleRestart}>
                🔄 Retry This Technology
              </button>
              <button className="btn-secondary" onClick={handleBackToSubtypes}>
                ← Choose Another {selectedDomain?.name} Tech
              </button>
              <button className="btn-secondary" onClick={handleBackToDomains}>
                ← All Domains
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // DETAILED REPORT VIEW
  // -------------------------------------------------------------
  if (isFinished && showDetailedReport) {
    return (
      <div className="detailed-report section">
        <div className="container">
          <div className="report-header">
            <button className="btn-back-clean" onClick={() => setShowDetailedReport(false)}>
              ← Back to Results Summary
            </button>
            <h2>Detailed Evaluation Report</h2>
            <p className="text-muted">{selectedDomain?.name} › {selectedSubtype?.name}</p>
          </div>
          
          <div className="report-summary">
            <div className="summary-stat">
              <span className="stat-value">{score}/{questions.length}</span>
              <span className="stat-label">Correct</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{attendedCount}</span>
              <span className="stat-label">Attended</span>
            </div>
            <div className="summary-stat">
              <span className="stat-value">{questions.length - attendedCount}</span>
              <span className="stat-label">Skipped</span>
            </div>
          </div>

          <div className="question-reviews">
            {questionResults.map((qr, index) => (
              <div key={index} className="review-card">
                <div className="review-question">
                  <span className="review-number">Q{index + 1}</span>
                  <p>{qr.question}</p>
                </div>
                <div className="review-answer">
                  <div className="your-answer">
                    <h4>Your Answer:</h4>
                    <p>{qr.userAnswer}</p>
                  </div>
                  <div className="correct-answer">
                    <h4>Suggested / Model Answer:</h4>
                    <p>{qr.correctAnswer}</p>
                  </div>
                </div>
                {qr.result && (
                  <div className="review-feedback">
                    <div className="feedback-header" style={{ background: `linear-gradient(135deg, ${getGradeColor(qr.result.grade)} 0%, ${getGradeColor(qr.result.grade)}dd 100%)` }}>
                      <span className="feedback-grade">{qr.result.grade}</span>
                      <span className="feedback-score">{qr.result.score}%</span>
                    </div>
                    <div className="feedback-body">
                      <p className="feedback-text">{qr.result.feedback}</p>
                      {qr.result.missingPoints?.length > 0 && (
                        <div className="missing-points">
                          <p className="missing-title">Key technical concepts to include:</p>
                          <ul>
                            {qr.result.missingPoints.map((point, i) => (
                              <li key={i}>{point}</li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="report-actions">
            <button className="btn-primary" onClick={handleRestart}>
              Try Again
            </button>
            <button className="btn-secondary" onClick={handleBackToSubtypes}>
              Choose Another Technology
            </button>
            <button className="btn-secondary" onClick={handleBackToDomains}>
              All Domains
            </button>
          </div>
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // LEVEL 3: ACTIVE 30 QUESTIONS PRACTICE SESSION
  // -------------------------------------------------------------
  const currentQ = questions[currentIndex] || {};
  const currentAnswer = answers[currentQ?.id] || '';
  const progressPercent = questions.length > 0 ? ((currentIndex + 1) / questions.length) * 100 : 0;

  return (
    <div className="question-area section">
      <div className="container">
        {/* Navigation Breadcrumb Bar */}
        <div className="practice-nav-bar">
          <div className="nav-bar-left">
            <button 
              className="btn-back-clean" 
              onClick={handleBackToSubtypes}
              title="Back to technology list"
            >
              ← Back to {selectedDomain?.name} Technologies
            </button>
            <button 
              className="btn-text-dim" 
              onClick={handleBackToDomains}
              title="Return to domain selection"
            >
              All Domains
            </button>
          </div>

          <div className="breadcrumb-badge">
            <span className="domain-tag">{selectedDomain?.name}</span>
            <span className="sep">›</span>
            <span className="subtype-tag">{selectedSubtype?.icon} {selectedSubtype?.name}</span>
          </div>
        </div>

        {/* Question Header & Counters */}
        <div className="question-header">
          <div className="question-title-group">
            <h2 id="category-title">
              {selectedSubtype?.icon} {selectedSubtype?.name} Interview
            </h2>
            <span className="q-pill-badge">30 Questions Practice</span>
          </div>

          <div className="question-stats">
            <span id="question-counter" className="counter-chip">
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span className="attended-counter counter-chip">
              Attended: {attendedCount}
            </span>
            <span className="score-counter counter-chip">
              Score: {score}
            </span>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar-container">
          <div 
            className="progress-bar-fill" 
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        {/* Quick Question Selector Strip (1 to 30) */}
        <div className="question-selector-strip">
          {questions.map((q, idx) => {
            const hasAnswer = Boolean(answers[q.id]?.trim());
            const isCurrent = idx === currentIndex;
            return (
              <button
                key={q.id || idx}
                className={`q-strip-btn ${isCurrent ? 'active' : ''} ${hasAnswer ? 'answered' : ''}`}
                onClick={() => handleJumpToQuestion(idx)}
                title={`Question ${idx + 1}`}
              >
                {idx + 1}
              </button>
            );
          })}
        </div>
        
        {/* Question Box & Answer Area */}
        <div className="question-content" style={{ animation: 'fadeInUp 0.3s ease' }}>
          <div className="interview-section">
            <div className="interview-question-box">
              <div className="question-box-header">
                <span className="question-badge">Question {currentIndex + 1} of {questions.length}</span>
                <span className="tech-badge">{selectedSubtype?.name}</span>
              </div>
              <p className="question-prompt">{currentQ?.q}</p>
            </div>
            
            <div className="answer-input-wrapper">
              <label className="answer-label">
                <span className="label-dot"></span>
                Your Answer / Explanation:
              </label>
              <textarea
                className="user-answer-input"
                placeholder="Type your technical answer here (key concepts, architecture, syntax, trade-offs)..."
                value={currentAnswer}
                onChange={(e) => {
                  setAnswers({
                    ...answers,
                    [currentQ?.id]: e.target.value
                  });
                  setSubmitted(false);
                  setAnalysisResult(null);
                }}
                rows={6}
                disabled={submitted}
              />
            </div>
            
            <div className="answer-actions">
              <button 
                className={`btn-submit-answer ${submitted ? 'submitted' : ''}`}
                onClick={handleSubmitAnswer}
                disabled={submitting || !currentAnswer.trim() || submitted}
              >
                {submitting ? 'Analyzing Answer...' : submitted ? 'Answer Submitted ✓' : 'Submit & Analyze'}
              </button>
              
              <button 
                className={`answer-toggle-btn ${showAnswer ? 'active' : ''}`}
                onClick={() => {
                  const nextShow = !showAnswer;
                  setShowAnswer(nextShow);
                  if (nextShow) {
                    handleMarkReviewed();
                  }
                }}
                style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}
              >
                <span style={{ fontSize: '16px' }}>{showAnswer ? '🙈' : '💡'}</span>
                <span>{showAnswer ? 'Hide Model Answer' : 'Show Model Answer'}</span>
              </button>
            </div>

            {/* Analysis Result Banner if submitted */}
            {analysisResult && (
              <div className="live-analysis-card">
                <div className="live-analysis-header" style={{ borderColor: getGradeColor(analysisResult.grade) }}>
                  <span className="live-grade" style={{ color: getGradeColor(analysisResult.grade) }}>
                    Rating: {analysisResult.grade} ({analysisResult.score}%)
                  </span>
                  <span className="live-terms">
                    Matched Keywords: {analysisResult.matchedTerms}/{analysisResult.totalTerms}
                  </span>
                </div>
                <p className="live-feedback">{analysisResult.feedback}</p>
                {analysisResult.missingPoints?.length > 0 && (
                  <div className="live-missing">
                    <span>Key concepts to consider: </span>
                    <em>{analysisResult.missingPoints.join(', ')}</em>
                  </div>
                )}
              </div>
            )}
            
            {/* Model Answer Reveal Box */}
            {showAnswer && (
              <div className="correct-answer-box">
                <div className="correct-answer-header">
                  <span className="header-icon">💡</span>
                  <h4>Suggested / Model Answer</h4>
                </div>
                <div className="correct-answer-content">
                  <p>{currentQ?.a}</p>
                </div>
              </div>
            )}
          </div>
        </div>
        
        {/* Navigation Footer */}
        <div className="question-nav">
          <button 
            className="btn-nav" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
          >
            ← Previous Question
          </button>
          <button 
            className="btn-finish" 
            onClick={handleFinish}
          >
            🏁 Finish Practice & View Report
          </button>
          <button 
            className="btn-nav btn-next" 
            onClick={handleNext}
          >
            {currentIndex === questions.length - 1 ? 'Finish →' : 'Next Question →'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Questions;