import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../utils/api';

const topicCheatSheets = {
  profit: [
    'Net Markup & Discount: Net Profit% = Markup% - Discount% - (Markup × Discount)/100',
    'Successive Discounts: Single Equivalent Discount = d₁ + d₂ - (d₁ × d₂)/100',
    'Dishonest Dealer: Gain% = [Error / (True Value - Error)] × 100',
    'Two items sold at same SP with ±x%: Overall Result = Loss of (x/10)²%'
  ],
  speed: [
    'Train crossing platform: Time = (Train Length + Platform Length) / Speed',
    'Speed conversion: 1 km/h = 5/18 m/s',
    'Relative speed: Same direction = |s₁ - s₂|, Opposite direction = s₁ + s₂',
    'Boats: Downstream = u + v, Upstream = u - v'
  ],
  work: [
    'Combined 1-day work: 1/Total Days = 1/A + 1/B',
    'Pipes with leak: Net Filling Rate = 1/Fill - 1/Leak',
    'Efficiency & Time: Time is inversely proportional to Efficiency (E₁ × T₁ = E₂ × T₂)'
  ],
  percentage: [
    'Consumption reduction on price hike r%: Reduction% = [r / (100 + r)] × 100',
    'Two successive percentage changes: Net% = a + b + (ab)/100',
    'Venn Diagram: P(A ∪ B) = P(A) + P(B) - P(A ∩ B)'
  ],
  interest: [
    'Difference between CI & SI for 2 years: Diff = P × (R/100)²',
    'CI Doubling rule: If sum doubles in T years, it becomes 2ⁿ times in n × T years',
    'Semi-annual compounding: Rate = R/2, Periods = 2 × T'
  ],
  ratio: [
    'Mixture replacement: Remaining pure liquid = Initial × (1 - x / V)ⁿ',
    'Alligation rule: (Cheaper quantity) / (Dearer quantity) = (Dearer price - Mean) / (Mean - Cheaper price)'
  ],
  numbers: [
    'Trailing zeros in N!: Count = ⌊N/5⌋ + ⌊N/25⌋ + ⌊N/125⌋ + ...',
    'Unit digit cyclicity: Powers of 2, 3, 7, 8 cycle with frequency of 4'
  ],
  hcf: [
    'Product of two numbers = HCF × LCM',
    'Bells/Signals synchronizing: Next time = LCM of individual time intervals'
  ],
  average: [
    'Average = Sum of observations / Number of observations',
    'New average after addition = (Old Sum + New Item) / (N + 1)'
  ],
  geometry: [
    'Direct Common Tangent: L = √[d² - (r₁ - r₂)²]',
    'Right triangle inradius: r = (a + b - c) / 2'
  ],
  algebra: [
    'Sum of roots: α + β = -b/a, Product of roots: αβ = c/a',
    'Identity: a³ + b³ = (a + b)³ - 3ab(a + b)'
  ],
  trigonometry: [
    'Distance between two depression angles from height h: d = h(cot θ₁ - cot θ₂)',
    'Identity: sec² θ - tan² θ = 1'
  ],
  probability: [
    'P(At least one event occurs) = 1 - P(None of the events occur)',
    'Combinations formula: nCr = n! / [r! (n - r)!]'
  ],
  mensuration: [
    'Recasting solids: Volume remains conserved (Volume of initial = Volume of final)',
    'Cone curved surface area: A = π × r × √(r² + h²)'
  ]
};

const sectionDefinitions = [
  { id: '1', title: 'Section 1', subtitle: 'Foundation & Core Patterns (30 Questions)', icon: '📑' },
  { id: '2', title: 'Section 2', subtitle: 'Advanced Multi-Step Scenarios (30 Questions)', icon: '⚡' },
  { id: '3', title: 'Section 3', subtitle: 'High-Difficulty & Case Studies (30 Questions)', icon: '🏆' },
  { id: 'ai', title: '✨ AI Generator', subtitle: 'Dynamic On-Demand Set', icon: '🤖' }
];

const Aptitude = () => {
  const { topic } = useParams();
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [answers, setAnswers] = useState({});
  const [checkedQuestions, setCheckedQuestions] = useState({});
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinished] = useState(false);
  const [error, setError] = useState('');
  const [filterReview, setFilterReview] = useState('all');
  const [currentSection, setCurrentSection] = useState('1');
  const [isAiLoading, setIsAiLoading] = useState(false);
  const [aiSource, setAiSource] = useState(null);

  const topics = [
    { id: 'numbers', name: 'Number Systems', icon: '🔢', count: 90 },
    { id: 'hcf', name: 'HCF & LCM', icon: '📊', count: 90 },
    { id: 'speed', name: 'Time & Speed', icon: '⏱️', count: 90 },
    { id: 'work', name: 'Work & Time', icon: '🛠️', count: 90 },
    { id: 'ratio', name: 'Ratio & Proportion', icon: '📈', count: 90 },
    { id: 'percentage', name: 'Percentage', icon: '💯', count: 90 },
    { id: 'profit', name: 'Profit & Loss', icon: '💰', count: 90 },
    { id: 'interest', name: 'Simple & Compound Interest', icon: '📉', count: 90 },
    { id: 'average', name: 'Average', icon: '📊', count: 90 },
    { id: 'geometry', name: 'Geometry', icon: '📐', count: 90 },
    { id: 'algebra', name: 'Algebra', icon: '✖️', count: 90 },
    { id: 'trigonometry', name: 'Trigonometry', icon: '📐', count: 90 },
    { id: 'probability', name: 'Probability', icon: '🎲', count: 90 },
    { id: 'mensuration', name: 'Mensuration', icon: '📏', count: 90 }
  ];

  const topicName = topics.find(t => t.id === topic)?.name || topic;

  const loadQuestions = useCallback(async (targetSec = currentSection) => {
    setError('');
    if (targetSec === 'ai') {
      setIsAiLoading(true);
      try {
        const res = await api.post('/aptitude/generate-ai', { topic, count: 10 });
        setQuestions(res.data?.questions || []);
        setAiSource(res.data?.source || 'ai');
      } catch (err) {
        console.error('Failed to load AI questions:', err);
        setError('Failed to generate AI questions. Make sure server is running.');
      } finally {
        setIsAiLoading(false);
      }
      return;
    }

    try {
      const res = await api.get(`/aptitude/${topic}?section=${targetSec}`);
      setQuestions(res.data.questions || []);
      setAiSource(null);
    } catch (err) {
      console.error('Failed to load questions:', err);
      setError('Failed to load questions. Make sure server is running.');
    }
  }, [topic, currentSection]);

  const handleGoToTopics = () => {
    setCurrentSection('1');
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setCheckedQuestions({});
    setIsFinished(false);
    setFilterReview('all');
    navigate('/aptitude');
  };

  const handleSectionChange = (sectionId) => {
    if (sectionId === currentSection && !isFinished) return;
    setCurrentSection(sectionId);
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setCheckedQuestions({});
    setIsFinished(false);
    setFilterReview('all');
    loadQuestions(sectionId);
  };

  const handleGenerateNewAiQuestions = async () => {
    setIsAiLoading(true);
    setError('');
    try {
      const res = await api.post('/aptitude/generate-ai', { topic, count: 10 });
      if (res.data?.questions?.length > 0) {
        setQuestions(res.data.questions);
        setAiSource(res.data?.source || 'ai');
        setCurrentIndex(0);
        setScore(0);
        setAnswers({});
        setCheckedQuestions({});
        setIsFinished(false);
        setFilterReview('all');
      }
    } catch (err) {
      console.error('Failed to generate fresh AI questions:', err);
      setError('Failed to generate fresh AI questions.');
    } finally {
      setIsAiLoading(false);
    }
  };

  useEffect(() => {
    setCurrentSection('1');
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setCheckedQuestions({});
    setIsFinished(false);
    setFilterReview('all');

    if (topic) {
      loadQuestions('1');
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [topic]);

  const handleSelectOption = (opt) => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    const currentId = currentQ.id;

    // Locked once checked
    if (checkedQuestions[currentId]?.isChecked) return;

    setAnswers(prev => ({ ...prev, [currentId]: opt }));
  };

  const handleCheck = () => {
    const currentQ = questions[currentIndex];
    if (!currentQ) return;
    const currentId = currentQ.id;
    const userAns = answers[currentId];
    if (!userAns) return;

    if (!checkedQuestions[currentId]) {
      const isCorrect = userAns === currentQ.a;
      if (isCorrect) {
        setScore(prev => prev + 1);
      }
      setCheckedQuestions(prev => ({
        ...prev,
        [currentId]: { isChecked: true, isCorrect, userAnswer: userAns }
      }));

      // Report progress to server
      try {
        api.post('/progress/mark-reviewed', {
          questionId: currentId,
          category: `Aptitude: ${topic || 'General'}`,
          timeSpent: 1,
          score: isCorrect ? 100 : 0
        }).catch(() => {});
      } catch (e) {}
    }
  };

  const handleNext = useCallback(() => {
    setCurrentIndex(prev => {
      if (prev < questions.length - 1) {
        return prev + 1;
      } else {
        setIsFinished(true);
        try {
          api.post('/progress/complete-aptitude', {
            topic: topic || 'General',
            score: score,
            totalQuestions: questions.length,
            timeSpent: 5
          }).catch(() => {});
        } catch (e) {}
        return prev;
      }
    });
  }, [questions.length, topic, score]);

  const handlePrev = useCallback(() => {
    setCurrentIndex(prev => (prev > 0 ? prev - 1 : 0));
  }, []);

  // Keyboard navigation using laptop arrow keys (← and →)
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target?.tagName)) return;
      if (!topic || isFinished || questions.length === 0) return;

      if (e.key === 'ArrowRight') {
        e.preventDefault();
        handleNext();
      } else if (e.key === 'ArrowLeft') {
        e.preventDefault();
        handlePrev();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [handleNext, handlePrev, topic, isFinished, questions.length]);

  const handleReset = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setCheckedQuestions({});
    setIsFinished(false);
    setFilterReview('all');
  };

  const handleTopicSelect = (topicId) => {
    setCurrentSection('1');
    setCurrentIndex(0);
    setScore(0);
    setAnswers({});
    setCheckedQuestions({});
    setIsFinished(false);
    setFilterReview('all');
    navigate(`/aptitude/${topicId}`);
  };

  const currentSectionDef = sectionDefinitions.find(s => s.id === currentSection) || sectionDefinitions[0];

  const renderSectionSwitcher = () => (
    <div 
      style={{ 
        display: 'flex', 
        justifyContent: 'space-between', 
        alignItems: 'center', 
        flexWrap: 'wrap', 
        gap: '10px', 
        backgroundColor: '#ffffff', 
        padding: '12px 16px', 
        borderRadius: '12px', 
        border: '1.5px solid #e2e8f0', 
        marginBottom: '18px',
        boxShadow: '0 2px 6px rgba(0,0,0,0.03)'
      }}
    >
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', alignItems: 'center' }}>
        <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b', marginRight: '4px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
          Sections:
        </span>
        {sectionDefinitions.map(sec => {
          const isActive = currentSection === sec.id;
          const isAi = sec.id === 'ai';
          return (
            <button
              key={sec.id}
              type="button"
              onClick={() => handleSectionChange(sec.id)}
              style={{
                padding: '8px 16px',
                borderRadius: '8px',
                fontSize: '13px',
                fontWeight: '600',
                border: isActive ? (isAi ? '1.5px solid #7c3aed' : '1.5px solid #0284c7') : '1px solid #cbd5e1',
                backgroundColor: isActive 
                  ? (isAi ? '#7c3aed' : '#0284c7') 
                  : '#f8fafc',
                color: isActive ? '#ffffff' : '#334155',
                cursor: 'pointer',
                display: 'inline-flex',
                alignItems: 'center',
                gap: '6px',
                transition: 'all 0.15s ease',
                boxShadow: isActive ? (isAi ? '0 2px 6px rgba(124,58,237,0.25)' : '0 2px 6px rgba(2,132,199,0.25)') : 'none'
              }}
            >
              <span>{sec.icon}</span>
              <span>{sec.title}</span>
              {isAi && (
                <span style={{
                  fontSize: '10px',
                  backgroundColor: isActive ? '#ffffff' : '#7c3aed',
                  color: isActive ? '#7c3aed' : '#ffffff',
                  padding: '1px 6px',
                  borderRadius: '10px',
                  fontWeight: '700'
                }}>
                  AI
                </span>
              )}
            </button>
          );
        })}
      </div>

      {currentSection === 'ai' && (
        <button
          type="button"
          onClick={handleGenerateNewAiQuestions}
          disabled={isAiLoading}
          style={{
            padding: '8px 16px',
            borderRadius: '8px',
            fontSize: '13px',
            fontWeight: '600',
            backgroundColor: '#7c3aed',
            color: '#ffffff',
            border: 'none',
            cursor: isAiLoading ? 'wait' : 'pointer',
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            boxShadow: '0 2px 6px rgba(124,58,237,0.25)',
            transition: 'all 0.2s ease'
          }}
        >
          <span>{isAiLoading ? '⏳' : '⚡'}</span>
          <span>{isAiLoading ? 'Generating Fresh Set...' : 'Generate New AI Set'}</span>
        </button>
      )}
    </div>
  );

  // Topics list view
  if (!topic) {
    return (
      <div className="questions-page section">
        <div className="container">
          <h2 className="text-center mb-4">🎯 Aptitude Practice</h2>
          <p className="text-center text-muted mb-4">Select a topic to practice with multiple structured difficulty sections & AI question generator</p>
          <div className="category-grid">
            {topics.map(t => (
              <div key={t.id} className="category-card card" onClick={() => handleTopicSelect(t.id)}>
                <span className="domain-icon">{t.icon}</span>
                <h3>{t.name}</h3>
                <p>30 Questions &bull; 3 Sections + AI</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results view (Score Revealed and Recommendations Shown)
  if (isFinished) {
    const totalQ = questions.length;
    const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;
    const attemptedCount = Object.keys(checkedQuestions).length;
    const incorrectCount = attemptedCount - score;
    const unattemptedCount = Math.max(0, totalQ - attemptedCount);
    const accuracy = attemptedCount > 0 ? Math.round((score / attemptedCount) * 100) : 0;

    // Actionable improvement recommendations based on score bracket
    let performanceTier = {
      badge: 'Targeted Practice Needed 📚',
      badgeColor: '#ef4444',
      badgeBg: '#fee2e2',
      summary: 'You encountered difficulty on several question types. Strengthening core concepts will give you quick score jumps.',
      recommendations: [
        'Master the Fundamentals: Review the step-by-step explanations of missed questions below and record the formulas in a notebook.',
        'Break Down Multi-Step Word Problems: Identify given values (CP, MP, Distance, Speeds) before picking a formula.',
        'Retake This Topic: Practice this topic again until you consistently score above 75% before moving to advanced topics.'
      ]
    };

    if (percentage >= 80) {
      performanceTier = {
        badge: 'Top Performer 🏆',
        badgeColor: '#15803d',
        badgeBg: '#dcfce7',
        summary: 'Excellent grasp of aptitude concepts and problem-solving techniques! You are well-prepared for placement tests.',
        recommendations: [
          'Optimize Solving Speed: Strive to solve each multi-step problem in under 45-60 seconds using mental math.',
          'Challenge High-Difficulty Sections: Tackle complex topics like Combinatorics, Mixture Alligations, and Mensuration.',
          'Take Full-Length Mixed Mock Tests: Practice switching between quantitative, logical, and verbal topics under timed conditions.'
        ]
      };
    } else if (percentage >= 50) {
      performanceTier = {
        badge: 'Promising Foundation 📈',
        badgeColor: '#b45309',
        badgeBg: '#fef3c7',
        summary: 'Good conceptual baseline, but calculation traps or multi-step variations impacted your final score.',
        recommendations: [
          'Scrutinize Missed Problems: Carefully examine the step-by-step solutions below to identify where the reasoning slipped.',
          'Use Shortcut Conversions: Memorize percentage-to-fraction values (e.g., 25% = 1/4, 20% = 1/5, 12.5% = 1/8) to save calculation time.',
          'Watch Out for Trick Questions: Double-check whether the question asks for profit percentage, selling price, or cost price before finalizing.'
        ]
      };
    }

    const currentCheatSheet = topicCheatSheets[topic] || [];

    // Filter reviewed questions
    const filteredQuestions = questions.filter(q => {
      const qStatus = checkedQuestions[q.id];
      if (filterReview === 'correct') return qStatus?.isCorrect;
      if (filterReview === 'incorrect') return qStatus?.isChecked && !qStatus.isCorrect;
      if (filterReview === 'unattempted') return !qStatus?.isChecked;
      return true;
    });

    return (
      <div className="questions-page section">
        <div className="container" style={{ maxWidth: '920px' }}>
          {/* Section Navigation Tabs in Results */}
          {renderSectionSwitcher()}

          {/* Main Results Card */}
          <div 
            className="results-card" 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '36px 32px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)', 
              color: '#0f172a',
              marginBottom: '28px'
            }}
          >
            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
              <span 
                style={{ 
                  backgroundColor: performanceTier.badgeBg, 
                  color: performanceTier.badgeColor, 
                  padding: '6px 16px', 
                  borderRadius: '20px', 
                  fontSize: '14px', 
                  fontWeight: '700',
                  display: 'inline-block',
                  marginBottom: '12px'
                }}
              >
                {performanceTier.badge}
              </span>
              <h2 style={{ fontSize: '28px', color: '#0f172a', margin: '0 0 6px 0', fontWeight: '800' }}>
                Test Evaluation Report
              </h2>
              <p style={{ color: '#64748b', fontSize: '16px', margin: 0 }}>
                Topic: <strong>{topicName}</strong> &bull; <strong>{currentSectionDef.title} ({currentSectionDef.subtitle})</strong>
              </p>
            </div>

            {/* Score Ring & Metrics */}
            <div 
              style={{ 
                display: 'grid', 
                gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', 
                gap: '16px', 
                margin: '28px 0',
                alignItems: 'center'
              }}
            >
              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '38px', fontWeight: '800', color: performanceTier.badgeColor, lineHeight: 1 }}>
                  {percentage}%
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>
                  Overall Score
                </div>
              </div>

              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  backgroundColor: '#f0fdf4', 
                  borderRadius: '12px',
                  border: '1.5px solid #bbf7d0'
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#16a34a', lineHeight: 1 }}>
                  {score} / {totalQ}
                </div>
                <div style={{ color: '#16a34a', fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>
                  Correct Answers
                </div>
              </div>

              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  backgroundColor: '#fef2f2', 
                  borderRadius: '12px',
                  border: '1.5px solid #fecaca'
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#dc2626', lineHeight: 1 }}>
                  {incorrectCount}
                </div>
                <div style={{ color: '#dc2626', fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>
                  Incorrect Answers
                </div>
              </div>

              <div 
                style={{ 
                  textAlign: 'center', 
                  padding: '20px', 
                  backgroundColor: '#f8fafc', 
                  borderRadius: '12px',
                  border: '1.5px solid #e2e8f0'
                }}
              >
                <div style={{ fontSize: '32px', fontWeight: '800', color: '#0284c7', lineHeight: 1 }}>
                  {accuracy}%
                </div>
                <div style={{ color: '#64748b', fontSize: '13px', marginTop: '6px', fontWeight: '600' }}>
                  Attempt Accuracy
                </div>
              </div>
            </div>

            {/* Performance Suggestions Box */}
            <div 
              style={{ 
                backgroundColor: '#f8fafc', 
                border: '1.5px solid #e2e8f0', 
                borderRadius: '12px', 
                padding: '24px', 
                margin: '24px 0' 
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                <span style={{ fontSize: '20px' }}>💡</span>
                <h3 style={{ fontSize: '18px', margin: 0, color: '#0f172a', fontWeight: '700' }}>
                  Personalized Performance Improvement Suggestions
                </h3>
              </div>
              <p style={{ color: '#475569', fontSize: '15px', lineHeight: '1.6', marginBottom: '16px' }}>
                {performanceTier.summary}
              </p>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                {performanceTier.recommendations.map((rec, rIdx) => (
                  <div 
                    key={rIdx} 
                    style={{ 
                      display: 'flex', 
                      alignItems: 'flex-start', 
                      gap: '12px', 
                      backgroundColor: '#ffffff', 
                      padding: '12px 16px', 
                      borderRadius: '8px',
                      border: '1px solid #e2e8f0'
                    }}
                  >
                    <span 
                      style={{ 
                        backgroundColor: '#0284c7', 
                        color: '#ffffff', 
                        width: '22px', 
                        height: '22px', 
                        borderRadius: '50%', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '12px', 
                        fontWeight: 'bold', 
                        flexShrink: 0,
                        marginTop: '2px'
                      }}
                    >
                      {rIdx + 1}
                    </span>
                    <span style={{ fontSize: '14px', color: '#334155', lineHeight: '1.5' }}>
                      {rec}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Topic Key Formulas Cheat Sheet */}
            {currentCheatSheet.length > 0 && (
              <div 
                style={{ 
                  backgroundColor: '#eff6ff', 
                  border: '1.5px solid #bfdbfe', 
                  borderRadius: '12px', 
                  padding: '20px 24px', 
                  marginBottom: '24px' 
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '10px' }}>
                  <span style={{ fontSize: '18px' }}>⚡</span>
                  <h4 style={{ fontSize: '16px', margin: 0, color: '#1e40af', fontWeight: '700' }}>
                    Key Formula Takeaways for {topicName}
                  </h4>
                </div>
                <ul style={{ margin: '8px 0 0 18px', padding: 0, color: '#1e3a8a', fontSize: '14px', lineHeight: '1.8' }}>
                  {currentCheatSheet.map((formula, fIdx) => (
                    <li key={fIdx}>{formula}</li>
                  ))}
                </ul>
              </div>
            )}

            {/* Action Buttons */}
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center', marginTop: '28px', flexWrap: 'wrap' }}>
              <button 
                className="btn-primary" 
                onClick={handleReset}
                style={{ 
                  padding: '12px 24px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  borderRadius: '8px',
                  backgroundColor: '#0284c7',
                  border: 'none',
                  color: '#ffffff',
                  cursor: 'pointer'
                }}
              >
                🔄 Retake {currentSectionDef.title}
              </button>

              {currentSection === '1' && (
                <button 
                  onClick={() => handleSectionChange('2')}
                  style={{ 
                    padding: '12px 24px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    borderRadius: '8px',
                    backgroundColor: '#059669',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(5,150,105,0.25)'
                  }}
                >
                  Next: Section 2 (Advanced) →
                </button>
              )}

              {currentSection === '2' && (
                <button 
                  onClick={() => handleSectionChange('3')}
                  style={{ 
                    padding: '12px 24px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    borderRadius: '8px',
                    backgroundColor: '#d97706',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(217,119,6,0.25)'
                  }}
                >
                  Next: Section 3 (High Difficulty) →
                </button>
              )}

              {currentSection === '3' && (
                <button 
                  onClick={() => handleSectionChange('ai')}
                  style={{ 
                    padding: '12px 24px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    borderRadius: '8px',
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    color: '#ffffff',
                    cursor: 'pointer',
                    boxShadow: '0 2px 6px rgba(124,58,237,0.25)'
                  }}
                >
                  Next: ✨ Practice with AI Generator →
                </button>
              )}

              {currentSection === 'ai' && (
                <button 
                  onClick={handleGenerateNewAiQuestions}
                  disabled={isAiLoading}
                  style={{ 
                    padding: '12px 24px', 
                    fontSize: '15px', 
                    fontWeight: '600', 
                    borderRadius: '8px',
                    backgroundColor: '#7c3aed',
                    border: 'none',
                    color: '#ffffff',
                    cursor: isAiLoading ? 'wait' : 'pointer',
                    boxShadow: '0 2px 6px rgba(124,58,237,0.25)'
                  }}
                >
                  {isAiLoading ? '⏳ Generating...' : '⚡ Generate New AI Set'}
                </button>
              )}

              <button 
                className="btn-secondary" 
                onClick={handleGoToTopics}
                style={{ 
                  padding: '12px 24px', 
                  fontSize: '15px', 
                  fontWeight: '600', 
                  borderRadius: '8px',
                  backgroundColor: '#f1f5f9',
                  border: '1px solid #cbd5e1',
                  color: '#334155',
                  cursor: 'pointer'
                }}
              >
                Browse All Topics
              </button>
            </div>
          </div>

          {/* Question-by-Question Review with Step-by-Step Explanations */}
          <div 
            style={{ 
              background: '#ffffff', 
              borderRadius: '16px', 
              padding: '30px', 
              boxShadow: '0 4px 20px rgba(0,0,0,0.08)',
              color: '#0f172a'
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '20px' }}>
              <h3 style={{ fontSize: '20px', fontWeight: '700', margin: 0, color: '#0f172a' }}>
                Question-by-Question Review ({filteredQuestions.length})
              </h3>
              
              {/* Filter Tabs */}
              <div style={{ display: 'flex', gap: '8px' }}>
                {[
                  { id: 'all', label: `All (${totalQ})` },
                  { id: 'incorrect', label: `Incorrect (${incorrectCount})` },
                  { id: 'correct', label: `Correct (${score})` },
                  { id: 'unattempted', label: `Skipped (${unattemptedCount})` }
                ].map(tab => (
                  <button
                    key={tab.id}
                    onClick={() => setFilterReview(tab.id)}
                    style={{
                      padding: '6px 14px',
                      borderRadius: '6px',
                      fontSize: '13px',
                      fontWeight: '600',
                      border: '1px solid',
                      borderColor: filterReview === tab.id ? '#0284c7' : '#cbd5e1',
                      backgroundColor: filterReview === tab.id ? '#0284c7' : '#ffffff',
                      color: filterReview === tab.id ? '#ffffff' : '#475569',
                      cursor: 'pointer'
                    }}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Questions List */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
              {filteredQuestions.map((q, qIndex) => {
                const info = checkedQuestions[q.id];
                const isCorrect = info?.isCorrect;
                const wasChecked = info?.isChecked;
                const userAns = answers[q.id];

                let statusBadge = {
                  text: 'Skipped',
                  bg: '#f1f5f9',
                  color: '#64748b'
                };
                if (wasChecked) {
                  statusBadge = isCorrect
                    ? { text: 'Correct ✓', bg: '#dcfce7', color: '#15803d' }
                    : { text: 'Incorrect ✕', bg: '#fee2e2', color: '#dc2626' };
                }

                let cleanPrompt = q.q || '';
                cleanPrompt = cleanPrompt.replace(/^.*?question \d+:\s*/i, '');

                return (
                  <div 
                    key={q.id || qIndex} 
                    style={{ 
                      padding: '20px', 
                      borderRadius: '10px', 
                      border: '1.5px solid #e2e8f0', 
                      backgroundColor: '#ffffff' 
                    }}
                  >
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', gap: '12px', marginBottom: '10px' }}>
                      <span style={{ fontSize: '15px', fontWeight: '600', color: '#0369a1' }}>
                        Q. {questions.indexOf(q) + 1} {cleanPrompt}
                      </span>
                      <span 
                        style={{ 
                          backgroundColor: statusBadge.bg, 
                          color: statusBadge.color, 
                          padding: '3px 10px', 
                          borderRadius: '12px', 
                          fontSize: '12px', 
                          fontWeight: '700',
                          flexShrink: 0
                        }}
                      >
                        {statusBadge.text}
                      </span>
                    </div>

                    <div style={{ display: 'flex', gap: '24px', fontSize: '14px', marginBottom: '14px', flexWrap: 'wrap' }}>
                      <div>
                        <span style={{ color: '#64748b' }}>Your Choice: </span>
                        <strong style={{ color: wasChecked && !isCorrect ? '#dc2626' : '#0f172a' }}>
                          {userAns || 'Not attempted'}
                        </strong>
                      </div>
                      <div>
                        <span style={{ color: '#64748b' }}>Correct Answer: </span>
                        <strong style={{ color: '#16a34a' }}>
                          {q.a}
                        </strong>
                      </div>
                    </div>

                    {/* Step-by-Step Explanation Box */}
                    {q.explanation && (
                      <div 
                        style={{ 
                          backgroundColor: '#f8fafc', 
                          borderLeft: '4px solid #0284c7', 
                          padding: '14px 18px', 
                          borderRadius: '0 6px 6px 0',
                          color: '#334155',
                          fontSize: '14px',
                          lineHeight: '1.8',
                          whiteSpace: 'pre-line'
                        }}
                      >
                        <div style={{ fontWeight: '700', color: '#0284c7', marginBottom: '4px', fontSize: '13px' }}>
                          Step-by-step Solution:
                        </div>
                        {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
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
        <div className="container" style={{ maxWidth: '900px' }}>
          <div className="question-header" style={{ marginBottom: '14px' }}>
            <button className="btn-secondary" onClick={handleGoToTopics}>← Topics</button>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>{topicName}</h2>
              <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
                {currentSectionDef.title} &bull; {currentSectionDef.subtitle}
              </span>
            </div>
          </div>
          {renderSectionSwitcher()}
          <div style={{ textAlign: 'center', padding: '40px 20px', backgroundColor: '#ffffff', borderRadius: '12px', border: '1.5px solid #e2e8f0', marginTop: '12px' }}>
            <p style={{ color: '#64748b', fontSize: '15px' }}>{error || 'Loading questions...'}</p>
          </div>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentIndex];
  const currentId = currentQ?.id;
  const isChecked = !!checkedQuestions[currentId]?.isChecked;
  const userSelected = answers[currentId];
  const answeredCount = Object.keys(checkedQuestions).length;
  const progressPercent = Math.round(((currentIndex + 1) / questions.length) * 100);

  // Clean prompt without internal "Topic question X:" prefix if present
  let cleanPrompt = currentQ?.q || '';
  cleanPrompt = cleanPrompt.replace(/^.*?question \d+:\s*/i, '');

  return (
    <div className="question-area section">
      <div className="container" style={{ maxWidth: '900px' }}>
        {/* Question Header (Score is completely hidden here) */}
        <div className="question-header" style={{ marginBottom: '14px' }}>
          <button className="btn-secondary" onClick={handleGoToTopics}>← Topics</button>
          <div>
            <h2 style={{ margin: 0, fontSize: '24px' }}>{topicName}</h2>
            <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '600' }}>
              {currentSectionDef.title} &bull; {currentSectionDef.subtitle}
            </span>
          </div>
          <div className="question-stats" style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            <span style={{ fontSize: '14px', fontWeight: '500', color: '#64748b' }}>
              Question {currentIndex + 1} of {questions.length}
            </span>
            <span 
              style={{ 
                backgroundColor: '#e0f2fe', 
                color: '#0369a1', 
                padding: '4px 12px', 
                borderRadius: '16px', 
                fontSize: '13px', 
                fontWeight: '600' 
              }}
            >
              {answeredCount} Answered
            </span>
          </div>
        </div>

        {/* Section Switcher Tabs */}
        {renderSectionSwitcher()}

        {/* AI Dynamic Mode Indicator Pill */}
        {currentSection === 'ai' && (
          <div 
            style={{ 
              backgroundColor: '#f5f3ff', 
              border: '1px solid #ddd6fe', 
              borderRadius: '10px', 
              padding: '10px 16px', 
              marginBottom: '16px', 
              display: 'flex', 
              alignItems: 'center', 
              justifyContent: 'space-between',
              flexWrap: 'wrap',
              gap: '8px'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
              <span style={{ fontSize: '18px' }}>🤖</span>
              <span style={{ fontSize: '13px', color: '#6d28d9', fontWeight: '600' }}>
                AI Dynamic Practice: Fresh quantitative questions with dynamic numbers on every generation.
              </span>
            </div>
            <span style={{ fontSize: '12px', color: '#8b5cf6', backgroundColor: '#ffffff', padding: '3px 10px', borderRadius: '12px', fontWeight: '700' }}>
              {aiSource === 'gemini_ai' ? 'Powered by Gemini AI' : 'Procedural AI Engine'}
            </span>
          </div>
        )}

        {/* Progress Bar */}
        <div 
          style={{ 
            width: '100%', 
            height: '6px', 
            backgroundColor: '#e2e8f0', 
            borderRadius: '4px', 
            overflow: 'hidden', 
            marginBottom: '20px' 
          }}
        >
          <div 
            style={{ 
              width: `${progressPercent}%`, 
              height: '100%', 
              backgroundColor: currentSection === 'ai' ? '#7c3aed' : '#0284c7', 
              transition: 'width 0.3s ease' 
            }} 
          />
        </div>

        {isAiLoading ? (
          <div style={{ textAlign: 'center', padding: '48px 20px', backgroundColor: '#ffffff', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)', border: '1.5px solid #e2e8f0' }}>
            <div style={{ fontSize: '36px', marginBottom: '14px' }}>✨ 🤖</div>
            <h3 style={{ fontSize: '19px', color: '#0f172a', fontWeight: '700', marginBottom: '8px' }}>
              Generating Brand New AI Aptitude Questions...
            </h3>
            <p style={{ color: '#64748b', fontSize: '14px', maxWidth: '480px', margin: '0 auto', lineHeight: '1.6' }}>
              Synthesizing fresh quantitative scenarios with customized calculations, 4 unique options, and step-by-step mathematical solutions.
            </p>
          </div>
        ) : (
        
        <div className="question-content" style={{ background: '#ffffff', padding: '24px 28px', borderRadius: '12px', boxShadow: '0 2px 8px rgba(0,0,0,0.06)' }}>
          {/* Question Title */}
          <div style={{ marginBottom: '16px' }}>
            <h3 style={{ 
              fontSize: '17px', 
              color: '#0369a1', 
              fontWeight: '600', 
              lineHeight: '1.6', 
              margin: '0 0 10px 0' 
            }}>
              Q. {currentIndex + 1} {cleanPrompt}
            </h3>
          </div>
          
          {/* Options Grid (2 columns on desktop) */}
          <div 
            className="options-grid" 
            style={{ 
              display: 'grid', 
              gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
              gap: '12px', 
              margin: '22px 0 20px 0' 
            }}
          >
            {currentQ?.options?.map((opt, idx) => {
              const isSelected = userSelected === opt;
              const isCorrectOpt = opt === currentQ?.a;
              
              let cardBg = '#ffffff';
              let cardBorder = '1.5px solid #38bdf8';
              let textColor = '#334155';
              let badgeIcon = null;
              
              if (isChecked) {
                if (isCorrectOpt) {
                  // Correct option
                  textColor = '#16a34a';
                  badgeIcon = (
                    <span 
                      style={{ 
                        marginLeft: 'auto', 
                        backgroundColor: '#22c55e', 
                        color: '#ffffff', 
                        width: '20px', 
                        height: '20px', 
                        borderRadius: '4px', 
                        display: 'inline-flex', 
                        alignItems: 'center', 
                        justifyContent: 'center', 
                        fontSize: '12px',
                        fontWeight: 'bold',
                        boxShadow: '0 1px 2px rgba(0,0,0,0.1)'
                      }}
                    >
                      ✓
                    </span>
                  );
                }
                
                if (isSelected && !isCorrectOpt) {
                  // User's wrong selection
                  cardBg = '#e0f2fe';
                  textColor = '#e11d48';
                  badgeIcon = (
                    <span 
                      style={{ 
                        marginLeft: 'auto', 
                        color: '#ef4444', 
                        fontSize: '18px', 
                        fontWeight: 'bold',
                        lineHeight: 1
                      }}
                    >
                      ✕
                    </span>
                  );
                } else if (isSelected && isCorrectOpt) {
                  cardBg = '#e0f2fe';
                }
              } else if (isSelected) {
                cardBg = '#e0f2fe';
                cardBorder = '1.5px solid #0284c7';
              }

              return (
                <div 
                  key={idx}
                  onClick={() => handleSelectOption(opt)}
                  style={{
                    padding: '12px 16px',
                    border: cardBorder,
                    borderRadius: '8px',
                    backgroundColor: cardBg,
                    cursor: isChecked ? 'default' : 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '12px',
                    transition: 'all 0.15s ease-in-out',
                    fontWeight: (isSelected || (isChecked && isCorrectOpt)) ? '600' : '400',
                    userSelect: 'none'
                  }}
                >
                  <div 
                    style={{
                      width: '18px',
                      height: '18px',
                      borderRadius: '50%',
                      border: isSelected ? '5px solid #0284c7' : '2px solid #94a3b8',
                      backgroundColor: '#ffffff',
                      flexShrink: 0,
                      boxSizing: 'border-box'
                    }}
                  />
                  <span style={{ color: textColor, fontSize: '15px' }}>
                    {opt}
                  </span>
                  {badgeIcon}
                </div>
              );
            })}
          </div>
          
          {/* Action Check Button */}
          <div style={{ marginTop: '16px', marginBottom: '8px' }}>
            <button 
              type="button"
              className="btn-check" 
              onClick={handleCheck}
              disabled={!userSelected || isChecked}
              style={{
                backgroundColor: isChecked ? '#94a3b8' : '#0284c7',
                color: '#ffffff',
                border: 'none',
                borderRadius: '6px',
                padding: '9px 24px',
                fontSize: '15px',
                fontWeight: '600',
                cursor: (!userSelected || isChecked) ? 'not-allowed' : 'pointer',
                display: 'inline-block',
                boxShadow: '0 1px 2px rgba(0,0,0,0.06)',
                transition: 'background-color 0.2s'
              }}
            >
              Check
            </button>
          </div>
          
          {/* Step-by-Step Explanation Box */}
          {isChecked && (
            <div 
              className="explanation-box"
              style={{
                backgroundColor: '#f8fafc',
                borderLeft: '5px solid #0284c7',
                padding: '18px 22px',
                marginTop: '16px',
                marginBottom: '16px',
                borderRadius: '0 8px 8px 0',
                color: '#334155',
                fontSize: '15px',
                lineHeight: '1.9',
                whiteSpace: 'pre-line',
                fontFamily: 'inherit',
                boxShadow: '0 1px 3px rgba(0,0,0,0.03)'
              }}
            >
              {currentQ?.explanation || `Answer: ${currentQ?.a}`}
            </div>
          )}
        </div>
        )}
        
        {/* Navigation buttons */}
        <div 
          className="question-nav" 
          style={{ 
            display: 'flex', 
            justifyContent: 'space-between', 
            alignItems: 'center', 
            marginTop: '24px'
          }}
        >
          <button 
            type="button"
            className="btn-nav" 
            onClick={handlePrev} 
            disabled={currentIndex === 0}
            style={{
              padding: '10px 22px',
              borderRadius: '8px',
              backgroundColor: currentIndex === 0 ? '#f1f5f9' : '#ffffff',
              border: '1.5px solid #cbd5e1',
              color: currentIndex === 0 ? '#94a3b8' : '#334155',
              fontWeight: '600',
              fontSize: '14px',
              cursor: currentIndex === 0 ? 'not-allowed' : 'pointer',
              transition: 'all 0.15s ease'
            }}
          >
            Previous
          </button>

          <button 
            type="button"
            className="btn-nav btn-next" 
            onClick={handleNext}
            style={{
              padding: '10px 24px',
              borderRadius: '8px',
              backgroundColor: '#0284c7',
              border: 'none',
              color: '#ffffff',
              fontWeight: '600',
              fontSize: '14px',
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(2,132,199,0.25)',
              transition: 'all 0.15s ease'
            }}
          >
            {currentIndex === questions.length - 1 ? 'Finish & View Score' : 'Next'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Aptitude;