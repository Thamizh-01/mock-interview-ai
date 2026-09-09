import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const Simulator = () => {
  // Setup state
  const [categories, setCategories] = useState([]);
  const [selectedCats, setSelectedCats] = useState(['behavioral', 'webdev', 'coding']);
  const [numQuestions, setNumQuestions] = useState(5);
  const [mode, setMode] = useState('practice'); // 'practice' | 'exam'
  const [examTimeLimit, setExamTimeLimit] = useState(120); // 2 mins per question for exam

  // Active session state
  const [isActive, setIsActive] = useState(false);
  const [allQuestions, setAllQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [timer, setTimer] = useState(0); // seconds elapsed in practice, or countdown in exam
  const [isPaused, setIsPaused] = useState(false);

  // User responses & evaluations
  const [userAnswers, setUserAnswers] = useState({}); // { [qIndex]: string }
  const [ratings, setRatings] = useState({}); // { [qIndex]: 'mastered' | 'progress' | 'practice' }
  const [analyses, setAnalyses] = useState({}); // { [qIndex]: analysisResult }
  const [analyzing, setAnalyzing] = useState(false);

  // Framework & Helper state
  const [showFramework, setShowFramework] = useState(false);

  // Speech Recognition state
  const [isRecording, setIsRecording] = useState(false);
  const recognitionRef = useRef(null);

  // Modals & Debrief state
  const [showAnswerModal, setShowAnswerModal] = useState(false);
  const [showDebrief, setShowDebrief] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState({});

  useEffect(() => {
    loadCategories();
  }, []);

  // Timer effect
  useEffect(() => {
    let interval;
    if (isActive && !isPaused && !showDebrief) {
      interval = setInterval(() => {
        setTimer(t => {
          if (mode === 'exam') {
            if (t <= 1) {
              handleNextExamQuestion();
              return examTimeLimit;
            }
            return t - 1;
          }
          return t + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isActive, isPaused, mode, showDebrief, currentIndex]);

  // Clean up speech recognition on unmount
  useEffect(() => {
    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.stop();
        } catch (e) {}
      }
    };
  }, []);

  const loadCategories = async () => {
    try {
      const res = await api.get('/questions');
      if (res.data?.categories) {
        setCategories(res.data.categories.map(c => c.name));
      }
    } catch (err) {
      console.error('Failed to load categories:', err);
    }
  };

  const handleCategoryChange = (cat) => {
    setSelectedCats(prev =>
      prev.includes(cat)
        ? prev.filter(c => c !== cat)
        : [...prev, cat]
    );
  };

  const handleSelectAllCategories = () => {
    if (selectedCats.length === categories.length) {
      setSelectedCats([]);
    } else {
      setSelectedCats([...categories]);
    }
  };

  const startSimulator = async (customQuestions = null) => {
    if (!customQuestions && selectedCats.length === 0) {
      alert('Please select at least one category');
      return;
    }

    let questionsToUse = [];

    if (customQuestions && customQuestions.length > 0) {
      questionsToUse = customQuestions;
    } else {
      const allFetched = [];
      const perCat = Math.max(1, Math.ceil(numQuestions / selectedCats.length));
      for (const cat of selectedCats) {
        try {
          const res = await api.get(`/questions/${cat}/random?count=${perCat}`);
          if (res.data?.questions) {
            allFetched.push(...res.data.questions.map(q => ({ ...q, category: cat })));
          }
        } catch (err) {
          console.error(`Failed to load ${cat}:`, err);
        }
      }
      questionsToUse = allFetched.sort(() => 0.5 - Math.random()).slice(0, numQuestions);
    }

    if (questionsToUse.length === 0) {
      alert('No questions found for the selected categories.');
      return;
    }

    setAllQuestions(questionsToUse);
    setCurrentIndex(0);
    setUserAnswers({});
    setRatings({});
    setAnalyses({});
    setIsActive(true);
    setShowDebrief(false);
    setShowAnswerModal(false);
    setShowFramework(false);
    setIsPaused(false);
    setTimer(mode === 'exam' ? examTimeLimit : 0);
  };

  // Web Speech Recognition Handler
  const toggleSpeechRecognition = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Google Chrome, Microsoft Edge, or Safari, or type your answer directly in the box.');
      return;
    }

    if (isRecording) {
      if (recognitionRef.current) {
        recognitionRef.current.stop();
      }
      setIsRecording(false);
    } else {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => {
          setIsRecording(true);
        };

        recognition.onresult = (event) => {
          let currentTranscript = '';
          for (let i = 0; i < event.results.length; i++) {
            currentTranscript += event.results[i][0].transcript + ' ';
          }
          setUserAnswers(prev => ({
            ...prev,
            [currentIndex]: currentTranscript.trim()
          }));
        };

        recognition.onerror = (event) => {
          console.error('Speech recognition error:', event.error);
          setIsRecording(false);
        };

        recognition.onend = () => {
          setIsRecording(false);
        };

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Failed to start speech recognition:', err);
        setIsRecording(false);
      }
    }
  };

  const handleTextAnswerChange = (val) => {
    setUserAnswers(prev => ({
      ...prev,
      [currentIndex]: val
    }));
  };

  // Analyze answer via NLP backend
  const evaluateCurrentAnswer = async () => {
    const currentQ = allQuestions[currentIndex];
    const currentAns = userAnswers[currentIndex] || '';

    if (!currentAns.trim()) {
      setShowAnswerModal(true);
      return;
    }

    setAnalyzing(true);
    try {
      const res = await api.post('/questions/analyze', {
        userAnswer: currentAns,
        correctAnswer: currentQ.a,
        question: currentQ.q
      });
      setAnalyses(prev => ({
        ...prev,
        [currentIndex]: res.data
      }));

      // Automatically suggest initial rating based on score
      if (!ratings[currentIndex]) {
        if (res.data.score >= 75) {
          setRatings(prev => ({ ...prev, [currentIndex]: 'mastered' }));
        } else if (res.data.score >= 45) {
          setRatings(prev => ({ ...prev, [currentIndex]: 'progress' }));
        } else {
          setRatings(prev => ({ ...prev, [currentIndex]: 'practice' }));
        }
      }
    } catch (err) {
      console.error('Failed to analyze answer:', err);
    } finally {
      setAnalyzing(false);
      setShowAnswerModal(true);
    }
  };

  const handleSetRating = (rating) => {
    setRatings(prev => ({
      ...prev,
      [currentIndex]: rating
    }));
  };

  const handleNextQuestion = () => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
    setShowAnswerModal(false);
    setShowFramework(false);

    if (currentIndex < allQuestions.length - 1) {
      setCurrentIndex(prev => prev + 1);
      if (mode === 'exam') {
        setTimer(examTimeLimit);
      }
    } else {
      completeInterview();
    }
  };

  const handleNextExamQuestion = () => {
    handleNextQuestion();
  };

  // eslint-disable-next-line no-unused-vars
  const handleExitToDomainSelection = () => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }
    setIsActive(false);
    setShowDebrief(false);
    setShowAnswerModal(false);
    setShowFramework(false);
  };

  const handlePrevQuestion = () => {
    if (currentIndex > 0) {
      setShowAnswerModal(false);
      setShowFramework(false);
      setCurrentIndex(prev => prev - 1);
    }
  };

  const completeInterview = async () => {
    if (isRecording && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch (e) {}
      setIsRecording(false);
    }

    try {
      const totalQuestions = allQuestions.length || 5;
      const goodCount = Object.values(ratings).filter(r => r === 'good').length;
      const computedScore = Math.max(60, Math.round(((goodCount + 1) / (totalQuestions + 1)) * 100));

      await api.post('/progress/complete-interview', {
        timeSpent: timer,
        score: computedScore,
        categories: selectedCats.length > 0 ? selectedCats : ['Mock Interview'],
        ratings
      });
    } catch (err) {
      console.error('Failed to update progress:', err);
    }

    setIsActive(false);
    setShowDebrief(true);
  };

  const restartWithWeakQuestions = () => {
    const weakQuestions = allQuestions.filter((_, idx) => ratings[idx] === 'practice');
    if (weakQuestions.length === 0) {
      alert('Great job! You have no questions marked as "Needs Practice".');
      return;
    }
    setMode('practice');
    startSimulator(weakQuestions);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const getDisplayName = (name) => {
    const names = {
      webdev: 'Web Development', datascience: 'Data Science', devops: 'DevOps',
      mobile: 'Mobile', database: 'Database', systemdesign: 'System Design',
      coding: 'Coding', behavioral: 'Behavioral', leadership: 'Leadership', situational: 'Situational'
    };
    return names[name] || name;
  };

  const isBehavioralType = (cat) => {
    return ['behavioral', 'leadership', 'situational'].includes(cat?.toLowerCase());
  };

  const getPitfallsForCategory = (cat) => {
    if (isBehavioralType(cat)) {
      return "Avoid speaking in generic 'we' statements without specifying what YOU personally did. Avoid blaming past managers or colleagues, and never claim you've never made a mistake or felt stress.";
    }
    return "Avoid jumping straight to an implementation without clarifying assumptions, constraints, and edge cases. Never ignore time & space complexity ($O(N)$) or trade-offs.";
  };

  // Helper calculation for debrief
  const totalAttempted = allQuestions.length;
  const masteredCount = Object.values(ratings).filter(r => r === 'mastered').length;
  const progressCount = Object.values(ratings).filter(r => r === 'progress').length;
  const practiceCount = Object.values(ratings).filter(r => r === 'practice').length;
  const unratedCount = totalAttempted - (masteredCount + progressCount + practiceCount);

  const readinessScore = totalAttempted > 0
    ? Math.round(((masteredCount * 100) + (progressCount * 60) + (practiceCount * 20)) / totalAttempted)
    : 0;

  const currentQ = allQuestions[currentIndex];
  const currentAnswer = userAnswers[currentIndex] || '';
  const currentAnalysis = analyses[currentIndex];
  const currentRating = ratings[currentIndex];

  /* -------------------------------------------------------------
     RENDER: 1. SETUP SCREEN
     ------------------------------------------------------------- */
  if (!isActive && !showDebrief) {
    return (
      <div className="simulator-page section">
        <div className="container">
          <h2 className="text-center mb-2">Mock Interview Simulator</h2>
          <p className="text-center text-muted mb-4">
            Practice real interview dialogue, master answering frameworks, and test your recall under pressure.
          </p>

          <div className="simulator-setup card" style={{ maxWidth: '780px', margin: '0 auto' }}>
            {/* Simulation Mode Selection */}
            <div className="mode-selection-container">
              <label style={{ fontSize: '1rem', fontWeight: '700', color: '#f8fafc', display: 'block', marginBottom: '0.4rem' }}>
                Select Simulation Mode
              </label>
              <div className="mode-grid">
                <div
                  className={`mode-card ${mode === 'practice' ? 'active' : ''}`}
                  onClick={() => setMode('practice')}
                >
                  <span className="mode-badge-rec">Recommended</span>
                  <div className="mode-icon">🎯</div>
                  <div className="mode-title">Practice & Learn Mode</div>
                  <div className="mode-desc">
                    Active recall practice with framework assistance, voice/text scratchpad, instant model answer comparison, and self-rating.
                  </div>
                  <div className="mode-features">
                    <div className="mode-feature-item">✓ STAR & Technical Framework Hints</div>
                    <div className="mode-feature-item">✓ Voice Speech-to-Text & Instant Comparison</div>
                    <div className="mode-feature-item">✓ Concept Checklist & Mastery Rating</div>
                  </div>
                </div>

                <div
                  className={`mode-card ${mode === 'exam' ? 'active' : ''}`}
                  onClick={() => setMode('exam')}
                >
                  <div className="mode-icon">⚡</div>
                  <div className="mode-title">Mock Exam Mode</div>
                  <div className="mode-desc">
                    Strict timed pressure simulation. Answers are hidden until interview completion to mimic a genuine pressure interview.
                  </div>
                  <div className="mode-features">
                    <div className="mode-feature-item">⏱️ Countdown Timer per Question</div>
                    <div className="mode-feature-item">🔒 Answers Locked Until Debrief</div>
                    <div className="mode-feature-item">📊 Full Post-Interview Performance Report</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Exam Time Limit Setting if Exam Mode */}
            {mode === 'exam' && (
              <div className="form-group mb-4" style={{ background: 'rgba(245, 158, 11, 0.08)', padding: '1rem', borderRadius: '12px', border: '1px solid rgba(245, 158, 11, 0.25)' }}>
                <label style={{ color: '#fbbf24', fontWeight: '600' }}>Time Limit Per Question</label>
                <div className="quick-options">
                  {[60, 90, 120, 180].map(seconds => (
                    <button
                      key={seconds}
                      type="button"
                      className={`btn-option-pill ${examTimeLimit === seconds ? 'active' : ''}`}
                      onClick={() => setExamTimeLimit(seconds)}
                    >
                      {seconds / 60} {seconds / 60 === 1 ? 'min' : 'mins'}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Category Selection */}
            <div className="form-group mb-4">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem' }}>
                <label style={{ fontWeight: '700', color: '#f8fafc', margin: 0 }}>
                  Select Categories ({selectedCats.length} selected)
                </label>
                <button
                  type="button"
                  onClick={handleSelectAllCategories}
                  style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '600' }}
                >
                  {selectedCats.length === categories.length ? 'Deselect All' : 'Select All'}
                </button>
              </div>

              <div className="cat-chip-grid">
                {categories.map(cat => {
                  const isSelected = selectedCats.includes(cat);
                  return (
                    <div
                      key={cat}
                      className={`cat-chip ${isSelected ? 'selected' : ''}`}
                      onClick={() => handleCategoryChange(cat)}
                    >
                      <span>{isSelected ? '✓' : '+'}</span>
                      <span>{getDisplayName(cat)}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Number of Questions */}
            <div className="form-group mb-4">
              <label style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem', display: 'block' }}>
                Number of Questions
              </label>
              <div className="quick-options">
                {[3, 5, 10, 15, 20].map(count => (
                  <button
                    key={count}
                    type="button"
                    className={`btn-option-pill ${numQuestions === count ? 'active' : ''}`}
                    onClick={() => setNumQuestions(count)}
                  >
                    {count} Questions
                  </button>
                ))}
              </div>
            </div>

            <button
              className="btn-primary"
              style={{ width: '100%', padding: '1rem', fontSize: '1.05rem', fontWeight: '700', borderRadius: '12px' }}
              onClick={() => startSimulator()}
            >
              Start {mode === 'practice' ? 'Practice Session' : 'Timed Mock Interview'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: 2. POST-INTERVIEW COMPREHENSIVE DEBRIEF
     ------------------------------------------------------------- */
  if (showDebrief) {
    return (
      <div className="simulator-page section">
        <div className="container">
          <div className="debrief-container">
            <div style={{ marginBottom: '1.25rem' }}>
              <button
                type="button"
                className="btn-back-domain"
                onClick={handleExitToDomainSelection}
              >
                ← Back to Domain Selection
              </button>
            </div>

            {/* Debrief Hero Card */}
            <div className="debrief-hero-card">
              <div style={{ fontSize: '2.8rem', marginBottom: '0.5rem' }}>🎉</div>
              <h2 className="debrief-title">Interview Session Complete!</h2>
              <p className="debrief-subtitle">
                Here is your comprehensive performance breakdown, mastery metrics, and personalized revision recommendations.
              </p>

              {/* Scorecard Stats Grid */}
              <div className="scorecard-grid">
                <div className="scorecard-stat-card">
                  <div className="scorecard-stat-num highlight">{readinessScore}%</div>
                  <div className="scorecard-stat-label">Readiness Score</div>
                </div>
                <div className="scorecard-stat-card">
                  <div className="scorecard-stat-num">{formatTime(timer)}</div>
                  <div className="scorecard-stat-label">Total Time</div>
                </div>
                <div className="scorecard-stat-card">
                  <div className="scorecard-stat-num">
                    {totalAttempted > 0 ? formatTime(Math.round(timer / totalAttempted)) : '00:00'}
                  </div>
                  <div className="scorecard-stat-label">Avg / Question</div>
                </div>
                <div className="scorecard-stat-card">
                  <div className="scorecard-stat-num" style={{ color: '#10b981' }}>
                    {masteredCount}/{totalAttempted}
                  </div>
                  <div className="scorecard-stat-label">Mastered</div>
                </div>
              </div>

              {/* Mastery Distribution Bar */}
              <div className="mastery-stacked-bar-container">
                <div className="mastery-bar-labels">
                  <span>Mastery Distribution</span>
                  <span>{masteredCount} Mastered · {progressCount} In Progress · {practiceCount} Needs Practice</span>
                </div>
                <div className="mastery-stacked-bar">
                  <div
                    className="bar-segment mastered"
                    style={{ width: `${totalAttempted > 0 ? (masteredCount / totalAttempted) * 100 : 0}%` }}
                  />
                  <div
                    className="bar-segment progress"
                    style={{ width: `${totalAttempted > 0 ? (progressCount / totalAttempted) * 100 : 0}%` }}
                  />
                  <div
                    className="bar-segment practice"
                    style={{ width: `${totalAttempted > 0 ? (practiceCount / totalAttempted) * 100 : 0}%` }}
                  />
                </div>
                <div className="mastery-legend">
                  <div className="legend-item">
                    <span className="legend-dot mastered"></span>
                    <span>Mastered ({masteredCount})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot progress"></span>
                    <span>In Progress ({progressCount})</span>
                  </div>
                  <div className="legend-item">
                    <span className="legend-dot practice"></span>
                    <span>Needs Practice ({practiceCount})</span>
                  </div>
                  {unratedCount > 0 && (
                    <div className="legend-item" style={{ color: '#64748b' }}>
                      <span>Unrated ({unratedCount})</span>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Personalized Recommendations Box */}
            <div className="recommendations-box">
              <div className="recommendations-title">
                <span>💡</span> Key Takeaways & Revision Plan
              </div>
              <div className="recommendations-list">
                {practiceCount > 0 && (
                  <div className="recommendation-item">
                    <span>🔴</span>
                    <div>
                      <strong>Targeted Practice Needed:</strong> You have {practiceCount} question{practiceCount > 1 ? 's' : ''} marked as "Needs Practice". Use the <em>"Practice Weak Questions"</em> button below to review and master these concepts.
                    </div>
                  </div>
                )}
                <div className="recommendation-item">
                  <span>📐</span>
                  <div>
                    <strong>Structure Your Narrative:</strong> For behavioral questions, remember to follow the <strong>STAR method</strong> (Situation, Task, Action, Result). Always quantify your results (e.g., "reduced latency by 35%" or "delivered 2 weeks ahead of schedule").
                  </div>
                </div>
                <div className="recommendation-item">
                  <span>⚙️</span>
                  <div>
                    <strong>State Complexity Proactively:</strong> In technical and system design responses, proactively state time and space complexity ($O(N)$) before the interviewer has to ask.
                  </div>
                </div>
              </div>
            </div>

            {/* Question-by-Question Deep Dive Accordion */}
            <div className="review-section-title">
              <span>Question-by-Question Review ({allQuestions.length})</span>
            </div>

            <div className="review-accordion-list">
              {allQuestions.map((q, idx) => {
                const userAns = userAnswers[idx];
                const rating = ratings[idx];
                const analysis = analyses[idx];
                const isExpanded = !!expandedAccordion[idx];

                return (
                  <div key={idx} className="review-accordion-item">
                    <div
                      className="review-accordion-header"
                      onClick={() => setExpandedAccordion(prev => ({ ...prev, [idx]: !prev[idx] }))}
                    >
                      <div className="review-header-left">
                        <span className="q-index-pill">{idx + 1}</span>
                        <div>
                          <div style={{ fontSize: '0.75rem', color: '#38bdf8', textTransform: 'uppercase', fontWeight: '700' }}>
                            {getDisplayName(q.category)}
                          </div>
                          <div className="review-q-title">{q.q}</div>
                        </div>
                      </div>
                      <div className="review-header-right">
                        {rating === 'mastered' && <span className="status-badge mastered">✓ Mastered</span>}
                        {rating === 'progress' && <span className="status-badge progress">⚡ In Progress</span>}
                        {rating === 'practice' && <span className="status-badge practice">⚠ Needs Practice</span>}
                        {!rating && <span className="status-badge unrated">Unrated</span>}
                        <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{isExpanded ? '▲' : '▼'}</span>
                      </div>
                    </div>

                    {isExpanded && (
                      <div className="review-accordion-body">
                        {/* User Answer */}
                        <div className="answer-card user">
                          <div className="answer-card-header">
                            <span>✍️ Your Response</span>
                            {userAns ? (
                              <span style={{ fontSize: '0.75rem', color: '#64748b' }}>
                                ({userAns.split(/\s+/).filter(Boolean).length} words)
                              </span>
                            ) : null}
                          </div>
                          <div className="answer-text-content" style={{ fontStyle: userAns ? 'normal' : 'italic', color: userAns ? '#f1f5f9' : '#94a3b8' }}>
                            {userAns || 'No response recorded for this question.'}
                          </div>
                        </div>

                        {/* Model Answer */}
                        <div className="answer-card model">
                          <div className="answer-card-header">
                            <span>✓ Recommended Model Answer</span>
                          </div>
                          <div className="answer-text-content">{q.a}</div>
                        </div>

                        {/* NLP Analysis if exists */}
                        {analysis && (
                          <div style={{ background: 'rgba(30, 41, 59, 0.4)', padding: '0.85rem', borderRadius: '10px', fontSize: '0.85rem' }}>
                            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', marginBottom: '0.4rem' }}>
                              <span style={{ color: '#10b981', fontWeight: '700' }}>Coverage Score: {analysis.score}%</span>
                              <span style={{ color: '#94a3b8' }}>Grade: {analysis.grade}</span>
                            </div>
                            {analysis.missingPoints?.length > 0 && (
                              <div style={{ color: '#fda4af', fontSize: '0.8rem' }}>
                                Missing key terms: {analysis.missingPoints.join(', ')}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Action Buttons */}
            <div className="debrief-action-buttons">
              <button
                className="btn-primary"
                onClick={() => startSimulator()}
              >
                🔄 Retake Full Interview
              </button>

              {practiceCount > 0 && (
                <button
                  className="btn-secondary"
                  style={{ borderColor: '#ef4444', color: '#fca5a5' }}
                  onClick={restartWithWeakQuestions}
                >
                  🎯 Practice Weak Questions Only ({practiceCount})
                </button>
              )}

              <button
                className="btn-secondary"
                onClick={handleExitToDomainSelection}
              >
                ← Back to Domain Selection
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  /* -------------------------------------------------------------
     RENDER: 3. ACTIVE INTERVIEW SCREEN
     ------------------------------------------------------------- */
  return (
    <div className="simulator-active section">
      <div className="container" style={{ maxWidth: '820px' }}>
        {/* Status Header Bar */}
        <div className="sim-header-bar">
          <div className="sim-header-left">
            <button
              type="button"
              className="btn-back-domain"
              onClick={handleExitToDomainSelection}
              title="Return to Domain Selection"
            >
              ← Back to Domain Selection
            </button>
            <span className={`sim-mode-tag ${mode === 'exam' ? 'exam' : ''}`}>
              {mode === 'practice' ? '🎯 Practice Mode' : '⚡ Exam Mode'}
            </span>
            <span className="sim-progress-text">
              Question {currentIndex + 1} of {allQuestions.length}
            </span>
          </div>

          <div className="sim-timer-container">
            <span className={`timer-value-display ${mode === 'exam' && timer < 30 ? 'warning' : ''}`}>
              {formatTime(timer)}
            </span>
            {mode === 'practice' && (
              <button
                className="btn-timer-icon"
                onClick={() => setIsPaused(!isPaused)}
              >
                {isPaused ? '▶ Resume' : '⏸ Pause'}
              </button>
            )}
          </div>
        </div>

        {/* Progress Fill Bar */}
        <div className="sim-progress-track">
          <div
            className="sim-progress-fill"
            style={{ width: `${((currentIndex + 1) / allQuestions.length) * 100}%` }}
          />
        </div>

        {/* Main Question Card */}
        <div className="sim-question-card">
          <div className="sim-cat-pill">
            <span>🏷️</span>
            <span>{getDisplayName(currentQ?.category)}</span>
          </div>

          <h3 className="sim-question-title">{currentQ?.q}</h3>

          {/* Framework Guidance Toggle (In Practice Mode) */}
          {mode === 'practice' && (
            <div>
              <button
                type="button"
                className="framework-helper-toggle"
                onClick={() => setShowFramework(prev => !prev)}
              >
                <span>💡</span>
                <span>
                  {showFramework
                    ? 'Hide Framework Guide'
                    : isBehavioralType(currentQ?.category)
                    ? 'How to Answer: STAR Method Guide'
                    : 'How to Answer: Engineering Framework Guide'}
                </span>
                <span>{showFramework ? '▲' : '▼'}</span>
              </button>

              {showFramework && (
                <div className="framework-card">
                  <div className="framework-header">
                    <span>
                      {isBehavioralType(currentQ?.category)
                        ? '★ The STAR Answering Technique (Proven Framework)'
                        : '⚙️ 4-Step Engineering Interview Framework'}
                    </span>
                  </div>

                  {isBehavioralType(currentQ?.category) ? (
                    <div className="framework-steps-grid">
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>S</span> Situation</div>
                        <div className="framework-step-desc">
                          Set the context. What was the project, team, or challenge you were facing?
                        </div>
                      </div>
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>T</span> Task</div>
                        <div className="framework-step-desc">
                          What was your specific responsibility or goal in this situation?
                        </div>
                      </div>
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>A</span> Action</div>
                        <div className="framework-step-desc">
                          What specific steps did YOU take? Emphasize your technical skills and leadership.
                        </div>
                      </div>
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>R</span> Result</div>
                        <div className="framework-step-desc">
                          What was the quantifiable outcome? Mention metrics, performance gains, or lessons.
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="framework-steps-grid">
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>1</span> Clarify</div>
                        <div className="framework-step-desc">
                          Ask about constraints, input ranges, assumptions, and edge cases.
                        </div>
                      </div>
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>2</span> Approach</div>
                        <div className="framework-step-desc">
                          Explain high-level architecture & data structures before writing code.
                        </div>
                      </div>
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>3</span> Complexity</div>
                        <div className="framework-step-desc">
                          Proactively state Time $O(N)$ and Space $O(1)$ Big-O complexity.
                        </div>
                      </div>
                      <div className="framework-step-col">
                        <div className="framework-step-title"><span>4</span> Trade-offs</div>
                        <div className="framework-step-desc">
                          Explain why you picked this solution over alternatives.
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              )}
            </div>
          )}

          {/* Active Response Scratchpad & Speech-to-Text */}
          <div className="sim-response-section">
            <div className="response-header">
              <div className="response-header-left">
                <span className="response-label">Your Response Practice</span>
                <button
                  type="button"
                  className={`btn-mic ${isRecording ? 'recording' : ''}`}
                  onClick={toggleSpeechRecognition}
                  title="Practice speaking your answer aloud"
                >
                  <span>{isRecording ? '⏹' : '🎙️'}</span>
                  <span>{isRecording ? 'Stop Recording' : 'Speak Answer'}</span>
                </button>
              </div>

              <span className="word-count-badge">
                {currentAnswer ? currentAnswer.split(/\s+/).filter(Boolean).length : 0} words
              </span>
            </div>

            {isRecording && (
              <div className="recording-status-banner">
                <span className="pulse-dot"></span>
                <span>Listening to your microphone... speak your answer clearly.</span>
              </div>
            )}

            <textarea
              className="response-textarea"
              placeholder={
                mode === 'practice'
                  ? 'Type your bullet points or click "Speak Answer" to practice articulating aloud before revealing the solution...'
                  : 'Type your answer or speak aloud. Your response will be saved and evaluated at the end...'
              }
              value={currentAnswer}
              onChange={(e) => handleTextAnswerChange(e.target.value)}
            />
          </div>

          {/* Controls Bar */}
          <div className="sim-controls-bar">
            <div className="sim-controls-left">
              {currentIndex > 0 && (
                <button
                  className="btn-secondary"
                  onClick={handlePrevQuestion}
                >
                  ← Previous
                </button>
              )}
            </div>

            <div className="sim-controls-right">
              {mode === 'practice' && (
                <button
                  className="btn-secondary"
                  style={{ borderColor: '#6366f1', color: '#a5b4fc' }}
                  onClick={evaluateCurrentAnswer}
                  disabled={analyzing}
                >
                  {analyzing ? 'Analyzing...' : '🔍 Reveal & Compare Answer'}
                </button>
              )}

              <button
                className="btn-primary"
                onClick={handleNextQuestion}
              >
                {currentIndex === allQuestions.length - 1 ? 'Finish & View Debrief' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* -------------------------------------------------------------
          RENDER: 4. LEARNING & MODEL ANSWER COMPARISON MODAL
          ------------------------------------------------------------- */}
      {showAnswerModal && (
        <div className="modal-overlay" onClick={() => setShowAnswerModal(false)}>
          <div className="modal-content modal-learning" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h3>
                <span style={{
                  display: 'inline-flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  width: '26px',
                  height: '26px',
                  borderRadius: '50%',
                  backgroundColor: 'rgba(16, 185, 129, 0.2)',
                  color: '#10b981',
                  fontSize: '13px'
                }}>✓</span>
                Answer & Learning Breakdown
              </h3>
              <button
                className="modal-close"
                onClick={() => setShowAnswerModal(false)}
                aria-label="Close"
              >
                ×
              </button>
            </div>

            <div className="modal-body">
              {/* If user answered, show NLP Analysis Summary */}
              {currentAnswer.trim() && currentAnalysis && (
                <div className="analysis-summary-banner">
                  <div className="analysis-score-container">
                    <div className={`score-circle ${currentAnalysis.score < 60 ? 'needs-work' : ''}`}>
                      {currentAnalysis.score}%
                    </div>
                    <div className="score-meta">
                      <h4>Coverage Grade: {currentAnalysis.grade}</h4>
                      <p>{currentAnalysis.feedback}</p>
                    </div>
                  </div>

                  {currentAnalysis.matchedTerms > 0 && (
                    <div style={{ fontSize: '0.85rem', color: '#94a3b8' }}>
                      Key Terms Matched: <strong style={{ color: '#10b981' }}>{currentAnalysis.matchedTerms}</strong> of {currentAnalysis.totalTerms}
                    </div>
                  )}
                </div>
              )}

              {/* Matched & Missing Concepts Chips */}
              {currentAnalysis && (
                <div className="concepts-pills-row">
                  <div className="concepts-label">Concept Coverage Checklist:</div>
                  <div className="concept-chips-container">
                    {currentAnalysis.matchedConcepts > 0 && (
                      <span className="concept-chip-item matched">
                        ✓ Core Concepts Hit ({currentAnalysis.matchedConcepts})
                      </span>
                    )}
                    {currentAnalysis.missingPoints?.map((pt, i) => (
                      <span key={i} className="concept-chip-item missing">
                        ⚠ Missing: {pt}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {/* Side-by-Side or Comparative View */}
              <div className="answers-compare-grid">
                {currentAnswer.trim() && (
                  <div className="answer-card user">
                    <div className="answer-card-header">
                      <span>✍️ What You Answered</span>
                    </div>
                    <div className="answer-text-content">{currentAnswer}</div>
                  </div>
                )}

                <div className="answer-card model">
                  <div className="answer-card-header">
                    <span>✓ Recommended Model Answer</span>
                  </div>
                  <div className="answer-text-content">{currentQ?.a}</div>
                </div>
              </div>

              {/* Common Pitfalls / "What NOT to Say" */}
              <div className="pitfalls-box">
                <div className="pitfalls-title">
                  <span>⚠️</span> Interviewer's Alert: What NOT to Say
                </div>
                <p className="pitfalls-text">
                  {getPitfallsForCategory(currentQ?.category)}
                </p>
              </div>

              {/* Self-Rating / Metacognition Check */}
              <div className="self-rating-section">
                <div className="self-rating-label">
                  <span>🎯</span> Rate Your Mastery for This Question:
                </div>
                <div className="rating-buttons-group">
                  <button
                    type="button"
                    className={`btn-rating rate-practice ${currentRating === 'practice' ? 'selected' : ''}`}
                    onClick={() => handleSetRating('practice')}
                  >
                    <span>🔴</span> Needs Practice
                  </button>
                  <button
                    type="button"
                    className={`btn-rating rate-progress ${currentRating === 'progress' ? 'selected' : ''}`}
                    onClick={() => handleSetRating('progress')}
                  >
                    <span>🟡</span> Getting There
                  </button>
                  <button
                    type="button"
                    className={`btn-rating rate-mastered ${currentRating === 'mastered' ? 'selected' : ''}`}
                    onClick={() => handleSetRating('mastered')}
                  >
                    <span>🟢</span> Mastered
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="btn-secondary"
                onClick={() => setShowAnswerModal(false)}
              >
                Back to Question
              </button>
              <button
                className="btn-primary"
                onClick={handleNextQuestion}
              >
                {currentIndex === allQuestions.length - 1 ? 'Finish Interview' : 'Next Question →'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Simulator;