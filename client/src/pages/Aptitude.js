import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const Aptitude = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [showAnswer, setShowAnswer] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState('');

  const topics = [
    { id: 'numbers', name: 'Number Systems', icon: '🔢', count: 30 },
    { id: 'hcf', name: 'HCF & LCM', icon: '📊', count: 30 },
    { id: 'speed', name: 'Time & Speed', icon: '⏱️', count: 30 },
    { id: 'work', name: 'Work & Time', icon: '🛠️', count: 30 },
    { id: 'ratio', name: 'Ratio & Proportion', icon: '📈', count: 30 },
    { id: 'percentage', name: 'Percentage', icon: '💯', count: 30 },
    { id: 'profit', name: 'Profit & Loss', icon: '💰', count: 30 },
    { id: 'interest', name: 'Simple & Compound Interest', icon: '📉', count: 30 },
    { id: 'average', name: 'Average', icon: '📊', count: 30 },
    { id: 'geometry', name: 'Geometry', icon: '📐', count: 30 },
    { id: 'algebra', name: 'Algebra', icon: '✖️', count: 30 },
    { id: 'trigonometry', name: 'Trigonometry', icon: '📐', count: 30 },
    { id: 'probability', name: 'Probability', icon: '🎲', count: 30 },
    { id: 'mensuration', name: 'Mensuration', icon: '📏', count: 30 }
  ];

  const loadQuestions = useCallback(async () => {
    try {
      const res = await api.get(`/aptitude/${topic}`);
      setQuestions(res.data.questions);
      setError('');
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError('Failed to load questions. Make sure server is running.');
    }
  }, [topic]);

  useEffect(() => {
    if (topic) {
      loadQuestions();
    }
  }, [topic, loadQuestions]);

  const handleAnswerChange = (e) => {
    const value = e.target.value;
    setAnswers({ ...answers, [questions[currentIndex]?.id]: value });
    setSubmitted(false);
  };

  const handleSubmitAnswer = () => {
    const userAnswer = answers[questions[currentIndex]?.id];
    if (!userAnswer?.trim()) return;
    
    setSubmitted(true);
    
    const correctAnswer = questions[currentIndex]?.a;
    const userAns = userAnswer.toLowerCase().trim();
    const corrAns = correctAnswer.toLowerCase().trim();
    
    const userNum = parseFloat(userAns.replace(/[^\d.-]/g, ''));
    const correctNum = parseFloat(corrAns.replace(/[^\d.-]/g, ''));
    
    const isNumericMatch = !isNaN(userNum) && !isNaN(correctNum) && Math.abs(userNum - correctNum) < 0.01;
    const isTextMatch = userAns.includes(corrAns) || corrAns.includes(userAns);
    const isCorrect = isNumericMatch || isTextMatch;
    
    if (isCorrect) setScore(prev => prev + 1);

    setTimeout(() => {
      if (currentIndex < questions.length - 1) handleNext();
      else setIsFinished(true);
    }, 500);
  };

  const handleNext = () => {
    if (currentIndex < questions.length - 1) {
      setCurrentIndex(currentIndex + 1);
      setShowAnswer(false);
      setSubmitted(false);
    } else {
      setIsFinished(true);
    }
  };

  const handlePrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1);
      setShowAnswer(false);
      setSubmitted(false);
    }
  };

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setShowAnswer(false);
    setSubmitted(false);
    setIsFinished(false);
  };

  const handleTopicSelect = (topicId) => {
    navigate(`/aptitude/${topicId}`);
  };

  // Topics list view
  if (!topic) {
    return (
      <div className="questions-page section">
        <div className="container">
          <h2 className="text-center mb-4">🎯 Aptitude Practice</h2>
          <p className="text-center text-muted mb-4">Select a topic to practice (30 questions each)</p>
          <div className="category-grid">
            {topics.map(t => (
              <div key={t.id} className="category-card card" onClick={() => handleTopicSelect(t.id)}>
                <span className="domain-icon">{t.icon}</span>
                <h3>{t.name}</h3>
                <p>{t.count} questions</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results view
  if (isFinished) {
    const percentage = questions.length > 0 ? Math.round((score / questions.length) * 100) : 0;
    const topicName = topics.find(t => t.id === topic)?.name || topic;
    return (
      <div className="questions-page section">
        <div className="container">
          <div className="results-card">
            <h2>Test Complete!</h2>
            <p className="results-subtitle">{topicName}</p>
            <div className="score-display">
              <div className="score-circle-large" style={{ borderColor: percentage >= 80 ? '#10b981' : percentage >= 60 ? '#f59e0b' : '#f43f5e' }}>
                <span className="score-percentage">{percentage}%</span>
              </div>
              <p className="score-message">{percentage >= 80 ? 'Excellent!' : percentage >= 60 ? 'Good job!' : 'Keep practicing!'}</p>
            </div>
            <div className="score-details">
              <div className="score-stat"><span className="stat-value">{score}</span><span className="stat-label">Correct</span></div>
              <div className="score-stat"><span className="stat-value">{questions.length}</span><span className="stat-label">Total</span></div>
            </div>
            <div className="results-actions">
              <button className="btn-primary" onClick={handleReset}>Try Again</button>
              <button className="btn-secondary" onClick={() => navigate('/aptitude')}>All Topics</button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // Loading state
  if (!questions.length) {
    return (
      <div className="questions-page section">
        <div className="container">
          <h2>Aptitude - {topics.find(t => t.id === topic)?.name || topic}</h2>
          <p>{error || 'Loading questions...'}</p>
        </div>
      </div>
    );
  }

  // Question view
  const topicName = topics.find(t => t.id === topic)?.name || topic;
  return (
    <div className="question-area section">
      <div className="container">
        <div className="question-header">
          <button className="btn-secondary" onClick={() => navigate('/aptitude')}>← Topics</button>
          <h2>{topicName}</h2>
          <div className="question-stats">
            <span>Question {currentIndex + 1} of {questions.length}</span>
            <span className="attended-counter">Score: {score}</span>
          </div>
        </div>
        
        <div className="question-content">
          <div className="interview-question-box">
            <span className="question-badge">Question</span>
            <p className="question-prompt">{questions[currentIndex]?.q}</p>
          </div>
          
          {questions[currentIndex]?.companies && (
            <div className="company-info" style={{ marginTop: '0.5rem', marginBottom: '1rem' }}>
              <small style={{ color: '#64748b' }}>Previously asked in: {questions[currentIndex].companies.join(', ')}</small>
            </div>
          )}
          
          <div className="answer-input-wrapper">
            <input type="text" className="user-answer-input" placeholder="Enter your answer..."
              value={answers[questions[currentIndex]?.id] || ''} onChange={handleAnswerChange} disabled={submitted} />
          </div>
          
          <div className="answer-actions">
            <button className={`btn-submit-answer ${submitted ? 'submitted' : ''}`} onClick={handleSubmitAnswer}
              disabled={submitted || !answers[questions[currentIndex]?.id]?.trim()}>
              {submitted ? 'Submitted ✓' : 'Submit Answer'}
            </button>
            <button className="answer-toggle-btn" onClick={() => setShowAnswer(!showAnswer)}>
              {showAnswer ? 'Hide Answer' : 'Show Answer'}
            </button>
          </div>
          
          {showAnswer && (
            <div className="correct-answer-box">
              <div className="correct-answer-header"><span className="header-icon">✓</span><h4>Answer</h4></div>
              <div className="correct-answer-content"><p>{questions[currentIndex]?.a}</p></div>
            </div>
          )}
        </div>
        
        <div className="question-nav">
          <button className="btn-nav" onClick={handlePrev} disabled={currentIndex === 0}>← Previous</button>
          <button className="btn-nav btn-next" onClick={handleNext}>{currentIndex === questions.length - 1 ? 'Finish →' : 'Next →'}</button>
        </div>
      </div>
    </div>
  );
};

export default Aptitude;