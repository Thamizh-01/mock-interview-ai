import React, { useState, useEffect, useCallback } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import api from '../utils/api';
import { useAuth } from '../context/AuthContext';

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [activeTab, setActiveTab] = useState('overview');
  const [notification, setNotification] = useState(null);
  const [showResetModal, setShowResetModal] = useState(false);

  const showNotification = (msg, type = 'success') => {
    setNotification({ msg, type });
    setTimeout(() => setNotification(null), 4000);
  };

  const loadAnalytics = useCallback(async (isSilent = false) => {
    if (!isSilent) setLoading(true);
    else setRefreshing(true);

    try {
      const res = await api.get('/analytics');
      if (res.data) {
        setAnalytics(res.data);
        localStorage.setItem('mockpro_analytics_cache', JSON.stringify(res.data));
      }
    } catch (err) {
      console.error('Failed to load analytics from server:', err);
      // Fallback to cache if available
      const cached = localStorage.getItem('mockpro_analytics_cache');
      if (cached) {
        try {
          setAnalytics(JSON.parse(cached));
        } catch (e) {}
      }
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    // Initial cache load for instant responsiveness
    const cached = localStorage.getItem('mockpro_analytics_cache');
    if (cached) {
      try {
        setAnalytics(JSON.parse(cached));
        setLoading(false);
      } catch (e) {}
    }
    loadAnalytics();
  }, [loadAnalytics]);

  const handleSeedDemoData = async () => {
    setRefreshing(true);
    try {
      const res = await api.post('/analytics/seed-demo');
      if (res.data?.analytics) {
        setAnalytics(res.data.analytics);
        localStorage.setItem('mockpro_analytics_cache', JSON.stringify(res.data.analytics));
        showNotification('⚡ Demo practice data loaded successfully!');
      }
    } catch (err) {
      console.error('Failed to load demo data:', err);
      showNotification('Could not seed demo data. Please try again.', 'error');
    } finally {
      setRefreshing(false);
    }
  };

  const handleResetProgress = () => {
    setShowResetModal(true);
  };

  const confirmResetProgress = async () => {
    setRefreshing(true);
    try {
      await api.post('/progress/reset');
      localStorage.removeItem('mockpro_analytics_cache');
      await loadAnalytics();
      showNotification('Progress reset successfully.');
    } catch (err) {
      console.error('Failed to reset progress:', err);
      showNotification('Failed to reset progress.', 'error');
    } finally {
      setRefreshing(false);
      setShowResetModal(false);
    }
  };

  const formatTime = (minutes) => {
    if (!minutes || minutes <= 0) return '0m';
    if (minutes < 60) return `${minutes}m`;
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`;
  };

  const formatRelativeDate = (dateStr) => {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 2) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays} days ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getDisplayName = (name) => {
    if (!name) return 'General';
    const names = {
      webdev: 'Web Development', fullstack: 'Full Stack Development',
      datascience: 'Data Science', devops: 'DevOps & Cloud',
      mobile: 'Mobile Development', database: 'Databases & SQL',
      systemdesign: 'System Design', coding: 'Data Structures & Algorithms',
      behavioral: 'Behavioral & Leadership', situational: 'Situational Judgment',
      aptitude: 'Quantitative Aptitude'
    };
    return names[name.toLowerCase()] || name;
  };

  const overview = analytics?.overview || {};
  const weekly = analytics?.weekly || {};
  const monthly = analytics?.monthly || {};
  const domainMastery = analytics?.domainMastery || [];
  const recentActivities = analytics?.recentActivities || [];
  const readinessScore = overview.readinessScore ?? 0;

  // Calculate readiness color
  const getReadinessBadgeClass = (score) => {
    if (score >= 75) return 'readiness-high';
    if (score >= 40) return 'readiness-mid';
    return 'readiness-low';
  };

  if (loading && !analytics) {
    return (
      <div className="dashboard-page section">
        <div className="container text-center" style={{ minHeight: '60vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
          <div className="loading-spinner"></div>
          <p style={{ marginTop: '16px', color: '#94a3b8' }}>Loading your performance analytics...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard-page section">
      <div className="container">

        {/* Notification Toast */}
        {notification && (
          <div className={`dashboard-toast ${notification.type}`}>
            <span>{notification.msg}</span>
          </div>
        )}

        {/* Hero Welcome Header */}
        <div className="dashboard-hero-card">
          <div className="hero-left">
            <div className="hero-user-info">
              <span className="welcome-tag">Candidate Performance Hub</span>
              <h1>
                Welcome back, <span className="highlight-text">{user?.name || 'Interview Candidate'}</span>!
              </h1>
              <p className="hero-subtext">
                Track your domain mastery, mock interview readiness, and progress across all interview phases.
              </p>
            </div>

            <div className="hero-metrics-strip">
              <div className="hero-pill">
                <span className="pill-icon">📝</span>
                <div className="pill-content">
                  <span className="pill-val">{overview.questionsReviewed || 0}</span>
                  <span className="pill-lbl">Questions Solved</span>
                </div>
              </div>

              <div className="hero-pill">
                <span className="pill-icon">🎯</span>
                <div className="pill-content">
                  <span className="pill-val">{overview.mockInterviewsCompleted || 0}</span>
                  <span className="pill-lbl">Mock Interviews</span>
                </div>
              </div>

              <div className="hero-pill">
                <span className="pill-icon">🧠</span>
                <div className="pill-content">
                  <span className="pill-val">{overview.aptitudeCompleted || 0}</span>
                  <span className="pill-lbl">Aptitude Quizzes</span>
                </div>
              </div>

              <div className="hero-pill">
                <span className="pill-icon">⏱️</span>
                <div className="pill-content">
                  <span className="pill-val">{formatTime(overview.totalTimeSpent || 0)}</span>
                  <span className="pill-lbl">Total Time</span>
                </div>
              </div>
            </div>
          </div>

          {/* Readiness Score Radial Gauge */}
          <div className="hero-right">
            <div className={`readiness-card ${getReadinessBadgeClass(readinessScore)}`}>
              <div className="readiness-ring">
                <svg viewBox="0 0 36 36" className="circular-chart">
                  <path
                    className="circle-bg"
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <path
                    className="circle"
                    strokeDasharray={`${readinessScore}, 100`}
                    d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                  />
                  <text x="18" y="20.35" className="percentage">{readinessScore}%</text>
                </svg>
              </div>
              <div className="readiness-label">
                <span className="readiness-title">Interview Readiness</span>
                <span className="readiness-desc">
                  {readinessScore >= 80 ? '🌟 Highly Prepared' :
                   readinessScore >= 50 ? '⚡ Strong Momentum' : '🌱 Starting Out'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Dashboard Top Action Controls */}
        <div className="dashboard-controls-bar">
          <div className="dashboard-tabs-pill">
            <button
              className={`dash-tab-btn ${activeTab === 'overview' ? 'active' : ''}`}
              onClick={() => setActiveTab('overview')}
            >
              📊 Overview
            </button>
            <button
              className={`dash-tab-btn ${activeTab === 'weekly' ? 'active' : ''}`}
              onClick={() => setActiveTab('weekly')}
            >
              📅 Weekly Breakdown
            </button>
            <button
              className={`dash-tab-btn ${activeTab === 'monthly' ? 'active' : ''}`}
              onClick={() => setActiveTab('monthly')}
            >
              📈 Monthly Trends
            </button>
          </div>

          <div className="dashboard-actions">
            <button
              className="btn-action-outline btn-demo"
              onClick={handleSeedDemoData}
              disabled={refreshing}
              title="Populate realistic practice stats to explore the dashboard features"
            >
              {refreshing ? 'Loading...' : '⚡ Load Demo Data'}
            </button>
            <button
              className="btn-action-outline"
              onClick={() => loadAnalytics(true)}
              disabled={refreshing}
              title="Refresh latest stats"
            >
              🔄 Refresh
            </button>
            <button
              className="btn-action-danger"
              onClick={handleResetProgress}
              disabled={refreshing}
              title="Reset all stats"
            >
              🗑️ Reset
            </button>
          </div>
        </div>

        {/* ========================================================
            TAB 1: OVERVIEW
           ======================================================== */}
        {activeTab === 'overview' && (
          <div className="tab-content overview-tab-content">
            
            {/* 4 KPI Cards */}
            <div className="kpi-grid">
              <div className="kpi-card card">
                <div className="kpi-top">
                  <span className="kpi-icon-box q-box">📝</span>
                  <span className="kpi-badge">
                    {monthly.improvement > 0 ? `+${monthly.improvement}% this month` : 'All time'}
                  </span>
                </div>
                <div className="kpi-val">{overview.questionsReviewed || 0}</div>
                <div className="kpi-label">Questions Mastered</div>
                <div className="kpi-footer">
                  <span>{(overview.categoriesPracticed || []).length} domains practiced</span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-top">
                  <span className="kpi-icon-box sim-box">🎯</span>
                  <span className="kpi-badge score-badge">
                    {overview.averageScore > 0 ? `${overview.averageScore}% Avg Score` : 'Target: 85%'}
                  </span>
                </div>
                <div className="kpi-val">{overview.mockInterviewsCompleted || 0}</div>
                <div className="kpi-label">Mock Interviews</div>
                <div className="kpi-footer">
                  <span>Full simulation sessions completed</span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-top">
                  <span className="kpi-icon-box apt-box">🧠</span>
                  <span className="kpi-badge">Speed & Accuracy</span>
                </div>
                <div className="kpi-val">{overview.aptitudeCompleted || 0}</div>
                <div className="kpi-label">Aptitude Quizzes</div>
                <div className="kpi-footer">
                  <span>Quant, reasoning & logic tests</span>
                </div>
              </div>

              <div className="kpi-card card">
                <div className="kpi-top">
                  <span className="kpi-icon-box time-box">⏳</span>
                  <span className="kpi-badge">Time Invested</span>
                </div>
                <div className="kpi-val">{formatTime(overview.totalTimeSpent || 0)}</div>
                <div className="kpi-label">Study Duration</div>
                <div className="kpi-footer">
                  <span>Focused interview prep time</span>
                </div>
              </div>
            </div>

            {/* Middle Section: Domain Mastery & Quick Launch */}
            <div className="dashboard-split-grid">
              
              {/* Domain Mastery Column */}
              <div className="domain-mastery-panel card">
                <div className="panel-header">
                  <div>
                    <h3>🎯 Domain Mastery</h3>
                    <p className="panel-subtitle">Proficiency calculated across all practice questions</p>
                  </div>
                  <Link to="/questions" className="link-pill">
                    Practice More →
                  </Link>
                </div>

                <div className="domain-bars-list">
                  {domainMastery.map((dm) => (
                    <div
                      key={dm.id}
                      className="domain-bar-item"
                      onClick={() => navigate('/questions')}
                      title={`Click to practice ${dm.name}`}
                    >
                      <div className="domain-bar-label-row">
                        <span className="domain-name">{dm.name}</span>
                        <span className="domain-fraction">
                          <strong>{dm.solved}</strong> / {dm.target} questions ({dm.mastery}%)
                        </span>
                      </div>
                      <div className="domain-progress-track">
                        <div
                          className="domain-progress-fill"
                          style={{
                            width: `${Math.min(100, Math.max(dm.mastery, 4))}%`,
                            background: dm.mastery >= 70
                              ? 'linear-gradient(90deg, #10b981 0%, #059669 100%)'
                              : dm.mastery >= 35
                              ? 'linear-gradient(90deg, #6366f1 0%, #8b5cf6 100%)'
                              : 'linear-gradient(90deg, #3b82f6 0%, #60a5fa 100%)'
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Launch Cards Column */}
              <div className="quick-launch-panel card">
                <div className="panel-header">
                  <h3>⚡ Continue Practicing</h3>
                  <span className="panel-subtitle">Jump directly into a learning module</span>
                </div>

                <div className="quick-launch-grid">
                  <Link to="/questions" className="launch-card launch-questions">
                    <div className="launch-icon">📚</div>
                    <div className="launch-info">
                      <h4>Technical Questions</h4>
                      <p>30 curated questions for React, Node, DevOps, SQL & 10+ domains</p>
                    </div>
                    <span className="launch-arrow">→</span>
                  </Link>

                  <Link to="/simulator" className="launch-card launch-simulator">
                    <div className="launch-icon">🎙️</div>
                    <div className="launch-info">
                      <h4>Mock Interview Simulator</h4>
                      <p>Full voice-enabled interview with real-time feedback & evaluation</p>
                    </div>
                    <span className="launch-arrow">→</span>
                  </Link>

                  <Link to="/aptitude" className="launch-card launch-aptitude">
                    <div className="launch-icon">📐</div>
                    <div className="launch-info">
                      <h4>Quantitative Aptitude</h4>
                      <p>Formulas, shortcuts, cheat-sheets and timed practice tests</p>
                    </div>
                    <span className="launch-arrow">→</span>
                  </Link>

                  <Link to="/resume" className="launch-card launch-resume">
                    <div className="launch-icon">📄</div>
                    <div className="launch-info">
                      <h4>Resume ATS Review</h4>
                      <p>Analyze keywords, formatting and recruiter score in seconds</p>
                    </div>
                    <span className="launch-arrow">→</span>
                  </Link>
                </div>
              </div>

            </div>

            {/* Recent Activity Timeline Feed */}
            <div className="recent-activity-panel card">
              <div className="panel-header">
                <div>
                  <h3>🕒 Recent Activity Feed</h3>
                  <p className="panel-subtitle">Live log of your practice sessions and milestones</p>
                </div>
                {recentActivities.length > 0 && (
                  <span className="activity-count-badge">{recentActivities.length} items</span>
                )}
              </div>

              {recentActivities.length === 0 ? (
                <div className="empty-activity-box">
                  <span className="empty-icon">🌱</span>
                  <h4>No practice activity recorded yet</h4>
                  <p>Solve questions, run a mock interview, or load demo data to view your live stats.</p>
                  <div className="empty-actions">
                    <button className="btn-primary" onClick={handleSeedDemoData}>
                      ⚡ Load Demo Activity
                    </button>
                    <Link to="/questions" className="btn-secondary">
                      Go to Questions
                    </Link>
                  </div>
                </div>
              ) : (
                <div className="activity-timeline">
                  {recentActivities.slice(0, 10).map((act, i) => (
                    <div key={i} className="timeline-item">
                      <div className="timeline-icon-col">
                        <span className={`timeline-dot-icon ${act.type}`}>
                          {act.type === 'question_reviewed' ? '📝' :
                           act.type === 'interview_completed' ? '🎯' :
                           act.type === 'aptitude_completed' ? '🧠' : '📄'}
                        </span>
                        {i < Math.min(recentActivities.length - 1, 9) && <div className="timeline-line" />}
                      </div>

                      <div className="timeline-details">
                        <div className="timeline-main-row">
                          <span className="timeline-title">
                            {act.type === 'question_reviewed' ? 'Practiced Interview Question' :
                             act.type === 'interview_completed' ? 'Completed Mock Interview Session' :
                             act.type === 'aptitude_completed' ? 'Completed Aptitude Test' :
                             'Resume Analyzed'}
                          </span>
                          <span className="timeline-timestamp">{formatRelativeDate(act.date)}</span>
                        </div>

                        <div className="timeline-meta-row">
                          {act.category && (
                            <span className="timeline-category-tag">{getDisplayName(act.category)}</span>
                          )}

                          {act.details?.score !== undefined && act.details?.score !== null && (
                            <span className="timeline-score-badge">
                              Score: {act.details.score}%
                            </span>
                          )}

                          {act.details?.timeSpent ? (
                            <span className="timeline-time-badge">
                              ⏱️ {act.details.timeSpent}m
                            </span>
                          ) : null}

                          {act.details?.fileName && (
                            <span className="timeline-file-badge">
                              📎 {act.details.fileName}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

          </div>
        )}

        {/* ========================================================
            TAB 2: WEEKLY BREAKDOWN
           ======================================================== */}
        {activeTab === 'weekly' && (
          <div className="tab-content weekly-tab-content">
            <div className="period-banner card">
              <div className="banner-left">
                <h3>This Week's Prep Momentum</h3>
                <p className="text-muted">
                  Week of {new Date(weekly.startDate || Date.now()).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}
                </p>
              </div>
              <div className="banner-right">
                <span className="banner-stat-chip">
                  <strong>{weekly.questionsReviewed || 0}</strong> Questions
                </span>
                <span className="banner-stat-chip">
                  <strong>{weekly.interviewsCompleted || 0}</strong> Interviews
                </span>
                <span className="banner-stat-chip">
                  <strong>{formatTime(weekly.totalTimeSpent || 0)}</strong> Study Time
                </span>
              </div>
            </div>

            {/* Daily Breakdown Interactive Bar Chart */}
            <div className="chart-card card">
              <div className="chart-header">
                <div>
                  <h3>Daily Activity (Monday - Sunday)</h3>
                  <p className="panel-subtitle">Total exercises completed each day</p>
                </div>
                <div className="chart-legend">
                  <span className="legend-item"><span className="legend-dot q-dot"></span> Questions</span>
                  <span className="legend-item"><span className="legend-dot sim-dot"></span> Interviews</span>
                  <span className="legend-item"><span className="legend-dot apt-dot"></span> Aptitude</span>
                </div>
              </div>

              <div className="visual-chart-container">
                {weekly.dailyBreakdown?.map((day, idx) => {
                  const total = day.total || 0;
                  const maxVal = Math.max(...(weekly.dailyBreakdown.map(d => d.total || 0)), 8);
                  const heightPercent = Math.max(8, (total / maxVal) * 100);

                  return (
                    <div key={idx} className="chart-column">
                      <div className="chart-bar-slot">
                        <span className="bar-total-val">{total > 0 ? total : ''}</span>
                        <div
                          className="chart-bar-fill-stacked"
                          style={{ height: `${heightPercent}%` }}
                        >
                          {day.questions > 0 && (
                            <div
                              className="bar-slice q-slice"
                              style={{ flex: day.questions }}
                              title={`${day.questions} questions reviewed`}
                            />
                          )}
                          {day.interviews > 0 && (
                            <div
                              className="bar-slice sim-slice"
                              style={{ flex: day.interviews * 2 }}
                              title={`${day.interviews} mock interviews completed`}
                            />
                          )}
                          {day.aptitude > 0 && (
                            <div
                              className="bar-slice apt-slice"
                              style={{ flex: day.aptitude }}
                              title={`${day.aptitude} aptitude sessions`}
                            />
                          )}
                        </div>
                      </div>
                      <span className="chart-day-label">{day.day}</span>
                      <span className="chart-date-sub">{day.date ? day.date.slice(5) : ''}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Weekly Categories Practiced */}
            {weekly.categoriesPracticed?.length > 0 && (
              <div className="card mt-4">
                <h3 className="mb-3">Categories Covered This Week</h3>
                <div className="domain-tags">
                  {weekly.categoriesPracticed.map((cat, i) => (
                    <span key={i} className="domain-tag">{getDisplayName(cat)}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ========================================================
            TAB 3: MONTHLY TRENDS
           ======================================================== */}
        {activeTab === 'monthly' && (
          <div className="tab-content monthly-tab-content">
            <div className="period-banner card">
              <div className="banner-left">
                <h3>Monthly Growth & Performance</h3>
                <p className="text-muted">
                  {new Date(monthly.startDate || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                </p>
              </div>
              <div className="banner-right">
                <div className="growth-badge">
                  <span className="growth-val">+{monthly.improvement || 24}%</span>
                  <span className="growth-lbl">Activity vs Previous Month</span>
                </div>
              </div>
            </div>

            <div className="monthly-stats-row">
              <div className="card monthly-stat-box">
                <span className="m-stat-val">{monthly.questionsReviewed || 0}</span>
                <span className="m-stat-lbl">Questions Mastered This Month</span>
              </div>
              <div className="card monthly-stat-box">
                <span className="m-stat-val">{monthly.interviewsCompleted || 0}</span>
                <span className="m-stat-lbl">Interviews Completed</span>
              </div>
              <div className="card monthly-stat-box">
                <span className="m-stat-val">{overview.averageScore || 85}%</span>
                <span className="m-stat-lbl">Average Performance Score</span>
              </div>
            </div>

            {/* Weekly Progression Bars */}
            <div className="card mt-4">
              <h3 className="mb-3">4-Week Progression</h3>
              <div className="weekly-comparison-list">
                {monthly.weeklyComparison?.map((w, i) => {
                  const maxWeekly = Math.max(...(monthly.weeklyComparison.map(wk => wk.total || wk.questionsReviewed || 0)), 15);
                  const total = w.total || (w.questionsReviewed + w.interviewsCompleted);
                  const fillWidth = Math.min(100, Math.max(6, (total / maxWeekly) * 100));

                  return (
                    <div key={i} className="comp-row">
                      <span className="comp-name">{w.week}</span>
                      <div className="comp-track">
                        <div
                          className="comp-fill"
                          style={{ width: `${fillWidth}%` }}
                        />
                      </div>
                      <span className="comp-val">
                        <strong>{total}</strong> exercises
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Category Breakdown */}
            {monthly.categoryBreakdown?.length > 0 && (
              <div className="card mt-4">
                <h3 className="mb-3">Domain Distribution</h3>
                <div className="category-dist-list">
                  {monthly.categoryBreakdown.map((cat, i) => (
                    <div key={i} className="cat-dist-row">
                      <div className="cat-dist-info">
                        <span className="cat-name">{getDisplayName(cat.name)}</span>
                        <span className="cat-count">{cat.count} activities ({cat.percentage}%)</span>
                      </div>
                      <div className="cat-dist-track">
                        <div
                          className="cat-dist-fill"
                          style={{ width: `${cat.percentage}%` }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

      {/* Custom In-App Confirmation Modal */}
      {showResetModal && (
        <div 
          style={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(15, 23, 42, 0.65)',
            backdropFilter: 'blur(4px)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 9999,
            padding: '20px'
          }}
          onClick={() => !refreshing && setShowResetModal(false)}
        >
          <div 
            style={{
              backgroundColor: '#ffffff',
              borderRadius: '16px',
              maxWidth: '440px',
              width: '100%',
              padding: '28px',
              boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
              textAlign: 'center',
              position: 'relative'
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <div 
              style={{
                width: '54px',
                height: '54px',
                borderRadius: '50%',
                backgroundColor: '#fee2e2',
                color: '#ef4444',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '26px',
                margin: '0 auto 16px auto'
              }}
            >
              🗑️
            </div>

            <h3 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 8px 0' }}>
              Reset All Progress Data?
            </h3>

            <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 24px 0' }}>
              Are you sure you want to reset your interview history, practice scores, and metrics? This action is permanent and cannot be undone.
            </p>

            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button
                type="button"
                onClick={() => setShowResetModal(false)}
                disabled={refreshing}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: '1.5px solid #cbd5e1',
                  backgroundColor: '#ffffff',
                  color: '#475569',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: 'pointer'
                }}
              >
                Cancel
              </button>

              <button
                type="button"
                onClick={confirmResetProgress}
                disabled={refreshing}
                style={{
                  flex: 1,
                  padding: '11px 18px',
                  borderRadius: '10px',
                  border: 'none',
                  backgroundColor: '#ef4444',
                  color: '#ffffff',
                  fontWeight: '600',
                  fontSize: '14px',
                  cursor: refreshing ? 'wait' : 'pointer',
                  boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                }}
              >
                {refreshing ? 'Resetting...' : 'Yes, Reset All'}
              </button>
            </div>
          </div>
        </div>
      )}

      </div>
    </div>
  );
};

export default Dashboard;