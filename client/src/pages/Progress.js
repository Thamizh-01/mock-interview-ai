import React, { useState, useEffect } from 'react';
import api from '../utils/api';

const Progress = () => {
  const [progress, setProgress] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetting, setResetting] = useState(false);

  useEffect(() => {
    loadProgress();
  }, []);

  const loadProgress = async () => {
    try {
      const res = await api.get('/progress');
      setProgress(res.data.progress);
    } catch (err) {
      console.error('Failed to load progress:', err);
      setProgress({
        questionsReviewed: 0,
        categoriesPracticed: [],
        mockInterviewsCompleted: 0
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setShowResetModal(true);
  };

  const confirmReset = async () => {
    setResetting(true);
    try {
      await api.post('/progress/reset');
      setProgress({
        questionsReviewed: 0,
        categoriesPracticed: [],
        mockInterviewsCompleted: 0
      });
    } catch (err) {
      console.error('Failed to reset progress:', err);
    } finally {
      setResetting(false);
      setShowResetModal(false);
    }
  };

  const getDisplayName = (name) => {
    const names = {
      webdev: 'Web Development', datascience: 'Data Science', devops: 'DevOps',
      mobile: 'Mobile', database: 'Database', systemdesign: 'System Design',
      coding: 'Coding', behavioral: 'Behavioral', leadership: 'Leadership', situational: 'Situational'
    };
    return names[name] || name;
  };

  if (loading) {
    return (
      <div className="progress-page section">
        <div className="container text-center">
          <div className="loading-spinner"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="progress-page section">
      <div className="container">
        <h2 className="text-center mb-4">Your Progress</h2>
        
        <div className="progress-stats">
          <div className="stat-card card">
            <h3>{progress?.questionsReviewed || 0}</h3>
            <p>Questions Reviewed</p>
          </div>
          <div className="stat-card card">
            <h3>{progress?.mockInterviewsCompleted || 0}</h3>
            <p>Mock Interviews</p>
          </div>
          <div className="stat-card card">
            <h3>{progress?.aptitudeCompleted || 0}</h3>
            <p>Aptitude Quizzes</p>
          </div>
          <div className="stat-card card">
            <h3>{progress?.categoriesPracticed?.length || 0}</h3>
            <p>Domains Covered</p>
          </div>
        </div>

        {progress?.categoriesPracticed?.length > 0 && (
          <div className="categories-practiced mt-4">
            <h3 className="text-center mb-3">Domains Practiced</h3>
            <div className="practiced-tags">
              {progress.categoriesPracticed.map((cat, i) => (
                <span key={i} className="practice-tag">{getDisplayName(cat)}</span>
              ))}
            </div>
          </div>
        )}

        <div className="progress-actions mt-4 text-center">
          <button className="btn-secondary" onClick={handleReset}>Reset Progress</button>
        </div>

        {/* Custom Confirmation Modal */}
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
            onClick={() => !resetting && setShowResetModal(false)}
          >
            <div 
              style={{
                backgroundColor: '#ffffff',
                borderRadius: '16px',
                maxWidth: '440px',
                width: '100%',
                padding: '28px',
                boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2)',
                textAlign: 'center'
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
                Reset All Progress?
              </h3>
              <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.6', margin: '0 0 24px 0' }}>
                Are you sure you want to reset your practice progress? All reviewed questions and stats will be cleared.
              </p>
              <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
                <button
                  type="button"
                  onClick={() => setShowResetModal(false)}
                  disabled={resetting}
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
                  onClick={confirmReset}
                  disabled={resetting}
                  style={{
                    flex: 1,
                    padding: '11px 18px',
                    borderRadius: '10px',
                    border: 'none',
                    backgroundColor: '#ef4444',
                    color: '#ffffff',
                    fontWeight: '600',
                    fontSize: '14px',
                    cursor: resetting ? 'wait' : 'pointer',
                    boxShadow: '0 4px 12px rgba(239, 68, 68, 0.25)'
                  }}
                >
                  {resetting ? 'Resetting...' : 'Yes, Reset'}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Progress;