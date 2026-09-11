import React, { useState, useEffect, useRef } from 'react';
import api from '../utils/api';

const Simulator = () => {
  // ── 1. Voice AI Resume Interview State ─────────────────────────────────────
  const [resumeFile, setResumeFile] = useState(null);
  const [resumeText, setResumeText] = useState('');
  const [showTextPaste, setShowTextPaste] = useState(false);
  const [targetRole, setTargetRole] = useState('');
  const [isUploadingResume, setIsUploadingResume] = useState(false);
  const [candidateProfile, setCandidateProfile] = useState(null);
  const [currentQuestion, setCurrentQuestion] = useState(null);
  const [currentStageIndex, setCurrentStageIndex] = useState(0);
  const [totalStages, setTotalStages] = useState(5);
  const [interviewerReaction, setInterviewerReaction] = useState('');

  // Session Timing & Adaptive Flow State
  const [sessionDurationMinutes, setSessionDurationMinutes] = useState(15);
  const [customMinutesInput, setCustomMinutesInput] = useState('');
  const [isCustomDuration, setIsCustomDuration] = useState(false);
  const [isFinalQuestion, setIsFinalQuestion] = useState(false);

  // Interviewer Persona & Job Description Intelligence
  const [interviewerPersona, setInterviewerPersona] = useState('staff');
  const [jobDescription, setJobDescription] = useState('');
  const [showJdInput, setShowJdInput] = useState(false);
  const [jdAnalysis, setJdAnalysis] = useState(null);
  const [questionStartSeconds, setQuestionStartSeconds] = useState(0);

  // Active Voice Room State
  const [voiceActive, setVoiceActive] = useState(false);
  const [isAiSpeaking, setIsAiSpeaking] = useState(false);
  const [isRecordingSpeech, setIsRecordingSpeech] = useState(false);
  const [speechTranscript, setSpeechTranscript] = useState('');
  const [interviewHistory, setInterviewHistory] = useState([]);
  const [isEvaluating, setIsEvaluating] = useState(false);
  const [voiceTimer, setVoiceTimer] = useState(0);
  const [isVoiceMuted, setIsVoiceMuted] = useState(false);

  // Debrief & Closing Round State
  const [voiceDebrief, setVoiceDebrief] = useState(null);
  const [showVoiceDebrief, setShowVoiceDebrief] = useState(false);
  const [expandedAccordion, setExpandedAccordion] = useState({});
  const [expandedRewrite, setExpandedRewrite] = useState({});
  const [candidateQuestionInput, setCandidateQuestionInput] = useState('');
  const [candidateQnaHistory, setCandidateQnaHistory] = useState([]);
  const [isAskingInterviewer, setIsAskingInterviewer] = useState(false);

  // Audio & Speech Synthesis
  const [availableVoices, setAvailableVoices] = useState([]);
  const [voiceRate, setVoiceRate] = useState(1.0);
  const recognitionRef = useRef(null);
  const fileInputRef = useRef(null);

  // ── Effects ───────────────────────────────────────────────────────────────
  useEffect(() => {
    initSpeechVoices();

    return () => {
      if (typeof window !== 'undefined' && window.speechSynthesis) {
        window.speechSynthesis.cancel();
      }
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
    };
  }, []);

  // Voice room timer
  useEffect(() => {
    let interval;
    if (voiceActive && !showVoiceDebrief) {
      interval = setInterval(() => {
        setVoiceTimer(t => t + 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [voiceActive, showVoiceDebrief]);

  const initSpeechVoices = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      const updateVoices = () => {
        const voices = window.speechSynthesis.getVoices();
        if (voices && voices.length > 0) {
          setAvailableVoices(voices);
        }
      };
      updateVoices();
      window.speechSynthesis.onvoiceschanged = updateVoices;
    }
  };

  // ── Voice Synthesis (AI Speaks) ───────────────────────────────────────────
  const speakAi = (text, onEndCallback = null) => {
    if (isVoiceMuted || typeof window === 'undefined' || !window.speechSynthesis) {
      if (onEndCallback) setTimeout(onEndCallback, 500);
      return;
    }

    try {
      window.speechSynthesis.cancel();

      const utterance = new SpeechSynthesisUtterance(text);
      utterance.rate = voiceRate || 1.0;
      utterance.pitch = 1.0;

      if (availableVoices.length > 0) {
        const bestVoice = availableVoices.find(v => 
          (v.name.includes('Google') || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Jenny') || v.name.includes('David')) && v.lang.startsWith('en')
        ) || availableVoices.find(v => v.lang.startsWith('en')) || availableVoices[0];
        if (bestVoice) utterance.voice = bestVoice;
      }

      utterance.onstart = () => setIsAiSpeaking(true);
      utterance.onend = () => {
        setIsAiSpeaking(false);
        if (onEndCallback) onEndCallback();
      };
      utterance.onerror = () => setIsAiSpeaking(false);

      window.speechSynthesis.speak(utterance);
    } catch (err) {
      console.error('Speech synthesis error:', err);
      setIsAiSpeaking(false);
    }
  };

  const stopAiSpeech = () => {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      window.speechSynthesis.cancel();
      setIsAiSpeaking(false);
    }
  };

  // ── Web Speech Recognition (Candidate Speaks) ─────────────────────────────
  const toggleVoiceRecording = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Please use Chrome, Edge, or Safari, or type your answer in the box.');
      return;
    }

    if (isRecordingSpeech) {
      if (recognitionRef.current) {
        try { recognitionRef.current.stop(); } catch (_) {}
      }
      setIsRecordingSpeech(false);
    } else {
      try {
        stopAiSpeech();

        const recognition = new SpeechRecognition();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-US';

        recognition.onstart = () => setIsRecordingSpeech(true);

        recognition.onresult = (event) => {
          let full = '';
          for (let i = 0; i < event.results.length; i++) {
            full += event.results[i][0].transcript + ' ';
          }
          setSpeechTranscript(full.trim());
        };

        recognition.onerror = (e) => {
          console.warn('Speech recognition event:', e.error);
          setIsRecordingSpeech(false);
        };

        recognition.onend = () => setIsRecordingSpeech(false);

        recognitionRef.current = recognition;
        recognition.start();
      } catch (err) {
        console.error('Failed to start recognition:', err);
        setIsRecordingSpeech(false);
      }
    }
  };

  // ── Voice AI Interview Handlers ───────────────────────────────────────────
  const handleFileUpload = (e) => {
    const file = e.target.files?.[0];
    if (file) {
      setResumeFile(file);
    }
  };

  const handleStartVoiceInterview = async () => {
    if (!resumeFile && !resumeText.trim()) {
      alert('Please upload a resume file (PDF/DOCX) or paste your resume text to begin.');
      return;
    }

    setIsUploadingResume(true);
    try {
      let res;
      if (resumeFile) {
        const formData = new FormData();
        formData.append('resume', resumeFile);
        if (targetRole) formData.append('targetRole', targetRole);
        formData.append('timeLimitMinutes', sessionDurationMinutes);
        formData.append('persona', interviewerPersona);
        if (jobDescription) formData.append('jobDescription', jobDescription);
        res = await api.post('/interview/upload-resume', formData, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
      } else {
        res = await api.post('/interview/upload-resume', {
          resumeText,
          targetRole,
          timeLimitMinutes: sessionDurationMinutes,
          persona: interviewerPersona,
          jobDescription
        });
      }

      if (res.data?.success) {
        const q1 = res.data.currentQuestion;
        setCandidateProfile(res.data.profile);
        setJdAnalysis(res.data.jdAnalysis || null);
        setCurrentQuestion(q1);
        setCurrentStageIndex(0);
        setIsFinalQuestion(false);
        setTotalStages(res.data.totalQuestions || 5);
        setInterviewerReaction(q1?.interviewerReaction || '');
        setInterviewHistory([]);
        setSpeechTranscript('');
        setVoiceTimer(0);
        setQuestionStartSeconds(0);
        setCandidateQnaHistory([]);
        setVoiceActive(true);
        setShowVoiceDebrief(false);

        // Opening greeting from the Interviewer Persona
        setTimeout(() => {
          const openingSpeech = `${q1.interviewerReaction ? q1.interviewerReaction + ' ' : ''}${q1.spokenText || q1.question}`;
          speakAi(openingSpeech);
        }, 600);
      }
    } catch (err) {
      console.error('Failed to start interview:', err);
      alert(err.response?.data?.message || 'Failed to parse resume. Please check the file and try again.');
    } finally {
      setIsUploadingResume(false);
    }
  };

  const handleNextVoiceQuestion = async () => {
    if (isRecordingSpeech && recognitionRef.current) {
      try { recognitionRef.current.stop(); } catch (_) {}
      setIsRecordingSpeech(false);
    }

    const answer = speechTranscript.trim();
    if (!answer) {
      alert('Please speak or type your answer before submitting.');
      return;
    }

    setIsEvaluating(true);
    stopAiSpeech();

    const totalTimeLimitSeconds = sessionDurationMinutes * 60;
    const timeRemainingSeconds = Math.max(0, totalTimeLimitSeconds - voiceTimer);
    const answerDurationSeconds = Math.max(5, voiceTimer - questionStartSeconds);

    try {
      const res = await api.post('/interview/next-question', {
        candidateAnswer: answer,
        currentQuestion,
        history: interviewHistory,
        profile: candidateProfile,
        currentStageIndex,
        totalStages,
        targetRole,
        timeRemainingSeconds,
        elapsedSeconds: voiceTimer,
        timeLimitMinutes: sessionDurationMinutes,
        forceWrapUp: false,
        answerDurationSeconds,
        persona: interviewerPersona,
        jobDescription,
        jdAnalysis
      });

      const { evaluation, interviewerReaction: reaction, nextQuestion, isCompleted, isFinalQuestion: isFinal } = res.data;

      const historyItem = {
        questionObj: currentQuestion,
        candidateAnswer: answer,
        evaluation,
        interviewerReaction: reaction
      };

      const nextHistory = [...interviewHistory, historyItem];
      setInterviewHistory(nextHistory);
      setSpeechTranscript('');
      setInterviewerReaction(reaction || '');
      setIsFinalQuestion(!!isFinal);
      setQuestionStartSeconds(voiceTimer);

      if (isCompleted || !nextQuestion) {
        speakAi(reaction || "Thank you. That completes our technical discussion today.", () => {
          finishVoiceInterview(nextHistory);
        });
      } else {
        setCurrentQuestion(nextQuestion);
        setCurrentStageIndex(prev => prev + 1);

        const fullSpoken = `${reaction ? reaction + ' ... ' : ''}${nextQuestion.spokenText || nextQuestion.question}`;
        speakAi(fullSpoken);
      }
    } catch (err) {
      console.error('Failed to get dynamic next question:', err);
      alert('Error communicating with AI interviewer. Please try again.');
    } finally {
      setIsEvaluating(false);
    }
  };

  const handleWrapUpEarly = async () => {
    if (window.confirm('Are you ready to wrap up your technical discussion early and generate your scorecard debrief?')) {
      setIsEvaluating(true);
      stopAiSpeech();
      const answerDurationSeconds = Math.max(5, voiceTimer - questionStartSeconds);

      try {
        const res = await api.post('/interview/next-question', {
          candidateAnswer: speechTranscript.trim() || 'Candidate concluded interview.',
          currentQuestion,
          history: interviewHistory,
          profile: candidateProfile,
          currentStageIndex,
          targetRole,
          timeRemainingSeconds: 0,
          elapsedSeconds: voiceTimer,
          timeLimitMinutes: sessionDurationMinutes,
          forceWrapUp: true,
          answerDurationSeconds,
          persona: interviewerPersona,
          jobDescription,
          jdAnalysis
        });

        const historyItem = {
          questionObj: currentQuestion,
          candidateAnswer: speechTranscript.trim() || 'Candidate concluded interview early.',
          evaluation: res.data?.evaluation || {},
          interviewerReaction: res.data?.interviewerReaction
        };
        const nextHistory = [...interviewHistory, historyItem];
        setInterviewHistory(nextHistory);

        speakAi(res.data?.interviewerReaction || "Thank you. Concluding interview now.", () => {
          finishVoiceInterview(nextHistory);
        });
      } catch (_) {
        finishVoiceInterview(interviewHistory);
      } finally {
        setIsEvaluating(false);
      }
    }
  };

  const finishVoiceInterview = async (history) => {
    stopAiSpeech();
    try {
      const res = await api.post('/interview/debrief', {
        profile: candidateProfile,
        interviewHistory: history,
        totalTimeSeconds: voiceTimer,
        jobDescription,
        jdAnalysis,
        persona: interviewerPersona
      });

      setVoiceDebrief(res.data);
      setVoiceActive(false);
      setShowVoiceDebrief(true);

      // Record progress in dashboard
      try {
        await api.post('/progress/complete-interview', {
          timeSpent: Math.round(voiceTimer / 60) || 5,
          score: res.data.scorecard?.overallReadiness || 75,
          categories: [candidateProfile?.primaryDomain || 'Voice AI Mock Interview'],
          ratings: {}
        });
      } catch (_) {}
    } catch (err) {
      console.error('Failed to generate debrief:', err);
    }
  };

  const handleAskInterviewer = async (prefilledQ = '') => {
    const q = (prefilledQ || candidateQuestionInput).trim();
    if (!q) return;

    setIsAskingInterviewer(true);
    try {
      const res = await api.post('/interview/ask-interviewer', {
        candidateQuestion: q,
        candidateProfile,
        targetRole,
        persona: interviewerPersona,
        jobDescription
      });

      if (res.data?.success) {
        const qnaItem = {
          question: q,
          answer: res.data.answer,
          interviewerRole: res.data.interviewerRole,
          persona: res.data.persona
        };
        setCandidateQnaHistory(prev => [...prev, qnaItem]);
        setCandidateQuestionInput('');
        speakAi(res.data.answer);
      }
    } catch (err) {
      console.error('Ask interviewer failed:', err);
    } finally {
      setIsAskingInterviewer(false);
    }
  };

  const resetVoiceInterview = () => {
    stopAiSpeech();
    setVoiceActive(false);
    setShowVoiceDebrief(false);
    setCandidateProfile(null);
    setCurrentQuestion(null);
    setCurrentStageIndex(0);
    setInterviewerReaction('');
    setSpeechTranscript('');
    setInterviewHistory([]);
    setResumeFile(null);
    setResumeText('');
    setCandidateQnaHistory([]);
    setCandidateQuestionInput('');
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // ═════════════════════════════════════════════════════════════════════════════
  // RENDER 1: VOICE AI INTERVIEW - LIVE ROOM
  // ═════════════════════════════════════════════════════════════════════════════
  if (voiceActive && !showVoiceDebrief) {
    const currentQ = currentQuestion || {};
    const totalTimeLimitSeconds = sessionDurationMinutes * 60;
    const timeRemaining = Math.max(0, totalTimeLimitSeconds - voiceTimer);
    const isUrgent = timeRemaining < 60;
    const isWarning = timeRemaining < 180 && !isUrgent;

    return (
      <div className="simulator-active section">
        <div className="container voice-room-container">
          <div className="voice-room-card">
            {/* Top Bar */}
            <div className="voice-room-topbar">
              <div className="candidate-profile-chip">
                <div className="candidate-avatar-circle">
                  {candidateProfile?.candidateName?.[0] || 'C'}
                </div>
                <div>
                  <div style={{ fontWeight: '700', color: '#fff', fontSize: '0.95rem' }}>
                    {candidateProfile?.candidateName || 'Candidate'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8' }}>
                    {targetRole || candidateProfile?.primaryDomain || 'Technical Candidate'}
                  </div>
                </div>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flexWrap: 'wrap' }}>
                <span
                  style={{
                    background: interviewerPersona === 'bar_raiser' ? 'rgba(239, 68, 68, 0.18)' : interviewerPersona === 'coach' ? 'rgba(16, 185, 129, 0.18)' : 'rgba(99, 102, 241, 0.18)',
                    border: interviewerPersona === 'bar_raiser' ? '1px solid rgba(239, 68, 68, 0.4)' : interviewerPersona === 'coach' ? '1px solid rgba(16, 185, 129, 0.4)' : '1px solid rgba(99, 102, 241, 0.35)',
                    color: interviewerPersona === 'bar_raiser' ? '#fca5a5' : interviewerPersona === 'coach' ? '#86efac' : '#c7d2fe',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.82rem',
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem'
                  }}
                >
                  <span>{interviewerPersona === 'bar_raiser' ? '⚡ FAANG Bar Raiser' : interviewerPersona === 'coach' ? '🎓 Supportive Coach' : '💼 Staff Engineer'}</span>
                </span>

                <span
                  className="sim-progress-text"
                  style={{
                    background: isFinalQuestion ? 'rgba(239, 68, 68, 0.18)' : 'rgba(99, 102, 241, 0.15)',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    border: isFinalQuestion ? '1px solid rgba(239, 68, 68, 0.4)' : '1px solid rgba(99, 102, 241, 0.3)',
                    color: isFinalQuestion ? '#fca5a5' : '#c7d2fe',
                    fontWeight: '700',
                    fontSize: '0.85rem'
                  }}
                >
                  {isFinalQuestion ? '🏁 Final Closing Question' : `Question ${currentQ.questionNumber || currentStageIndex + 1} · Adaptive`}
                </span>

                <span
                  className={`timer-value-display ${isUrgent ? 'urgent-pulse' : ''}`}
                  title={`${formatTime(voiceTimer)} elapsed of ${sessionDurationMinutes} min session`}
                  style={{
                    display: 'inline-flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    background: isUrgent ? 'rgba(239, 68, 68, 0.2)' : isWarning ? 'rgba(245, 158, 11, 0.2)' : 'rgba(16, 185, 129, 0.15)',
                    border: isUrgent ? '1px solid rgba(239, 68, 68, 0.4)' : isWarning ? '1px solid rgba(245, 158, 11, 0.4)' : '1px solid rgba(16, 185, 129, 0.3)',
                    color: isUrgent ? '#f87171' : isWarning ? '#fbbf24' : '#34d399',
                    padding: '0.35rem 0.85rem',
                    borderRadius: '20px',
                    fontWeight: '700',
                    fontSize: '0.88rem'
                  }}
                >
                  <span>⏱️</span>
                  <span>{formatTime(timeRemaining)} left</span>
                </span>

                <button
                  type="button"
                  onClick={() => setIsVoiceMuted(!isVoiceMuted)}
                  style={{ background: 'none', border: 'none', color: isVoiceMuted ? '#f43f5e' : '#a5b4fc', fontSize: '1.2rem', cursor: 'pointer' }}
                  title={isVoiceMuted ? 'Unmute AI Voice' : 'Mute AI Voice'}
                >
                  {isVoiceMuted ? '🔇' : '🔊'}
                </button>
              </div>
            </div>

            {/* AI Avatar & Glowing Speaking Orb */}
            <div className="ai-avatar-center-stage">
              <div className="ai-orb-container">
                <div className={`ai-orb ${isAiSpeaking ? 'speaking' : ''}`}>
                  🤖
                </div>
                <div className="ai-orb-wave-ring"></div>
              </div>

              <div style={{ fontWeight: '700', fontSize: '1.1rem', color: isAiSpeaking ? '#818cf8' : '#94a3b8', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>{isAiSpeaking ? `${interviewerPersona === 'bar_raiser' ? 'Bar Raiser' : interviewerPersona === 'coach' ? 'Coach' : 'Staff Interviewer'} Speaking...` : isEvaluating ? 'Analyzing Answer & Formulating Probe...' : 'Listening to Candidate...'}</span>
              </div>

              {/* Sound wave bars */}
              <div className={`sound-waves-wrapper ${isAiSpeaking ? 'active' : ''}`}>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
                <span className="wave-bar"></span>
              </div>
            </div>

            {/* Targeted JD Skill Gap Banner */}
            {currentQ.stage === 'jd_skill_gap_probe' && (
              <div style={{
                background: 'rgba(245, 158, 11, 0.15)',
                border: '1px solid rgba(245, 158, 11, 0.4)',
                borderRadius: '12px',
                padding: '0.75rem 1.15rem',
                marginBottom: '1rem',
                color: '#fef08a',
                fontSize: '0.88rem',
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem'
              }}>
                <span style={{ fontSize: '1.2rem' }}>🎯</span>
                <div>
                  <strong>Target JD Skill Gap Probe:</strong> The interviewer is intentionally probing an unproven skill identified from your target job description.
                </div>
              </div>
            )}

            {/* Active Listening Interviewer Reaction Bubble */}
            {interviewerReaction && (
              <div style={{
                background: 'rgba(99, 102, 241, 0.12)',
                border: '1px solid rgba(99, 102, 241, 0.35)',
                borderRadius: '12px',
                padding: '0.85rem 1.15rem',
                marginBottom: '1rem',
                display: 'flex',
                gap: '0.75rem',
                alignItems: 'flex-start'
              }}>
                <span style={{ fontSize: '1.35rem' }}>💬</span>
                <div>
                  <div style={{ fontSize: '0.75rem', color: '#818cf8', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Interviewer Note (Active Listening)
                  </div>
                  <div style={{ fontSize: '0.95rem', color: '#f1f5f9', fontStyle: 'italic', marginTop: '0.2rem', lineHeight: '1.45' }}>
                    "{interviewerReaction}"
                  </div>
                </div>
              </div>
            )}

            {/* AI Question Speech Bubble */}
            <div className="ai-question-speech-bubble">
              <div className="ai-bubble-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', flexWrap: 'wrap' }}>
                  <span className="ai-stage-badge" style={{ background: isFinalQuestion ? 'rgba(239, 68, 68, 0.2)' : 'rgba(99, 102, 241, 0.2)', color: isFinalQuestion ? '#f87171' : '#818cf8', borderColor: isFinalQuestion ? 'rgba(239, 68, 68, 0.4)' : 'rgba(99, 102, 241, 0.35)' }}>
                    {currentQ.stageName || `Question ${currentQ.questionNumber || currentStageIndex + 1}`}
                  </span>
                  {currentQ.topic && (
                    <span style={{ fontSize: '0.78rem', background: 'rgba(255,255,255,0.06)', color: '#cbd5e1', padding: '0.2rem 0.6rem', borderRadius: '6px', border: '1px solid rgba(255,255,255,0.1)' }}>
                      🎯 {currentQ.topic}
                    </span>
                  )}
                </div>
                <button
                  type="button"
                  onClick={() => speakAi(currentQ.spokenText || currentQ.question)}
                  style={{ background: 'none', border: 'none', color: '#6366f1', cursor: 'pointer', fontSize: '0.85rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                >
                  <span>🔄</span> Replay Question
                </button>
              </div>
              <p className="ai-question-text">{currentQ.question}</p>
            </div>

            {/* Candidate Spoken Response Stage */}
            <div className="candidate-speech-stage">
              <div className="candidate-speech-header">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                  <span style={{ fontWeight: '700', color: '#e2e8f0', fontSize: '0.95rem' }}>
                    🎙️ Your Spoken Response:
                  </span>
                  <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
                    (Speak via microphone or type/edit below)
                  </span>
                </div>
                {isRecordingSpeech && (
                  <span className="recording-live-indicator">
                    <span className="recording-pulse-dot"></span>
                    Microphone Live & Listening...
                  </span>
                )}
              </div>

              {/* Real-Time Speech Delivery HUD */}
              {(() => {
                const words = speechTranscript.trim().split(/\s+/).filter(Boolean);
                const wordCount = words.length;
                const elapsed = Math.max(1, voiceTimer - questionStartSeconds);
                const liveWpm = elapsed > 4 && wordCount > 0 ? Math.round((wordCount / elapsed) * 60) : 0;
                const matches = speechTranscript.match(/\b(um|uh|like|you know|basically|literally|actually|sort of|kind of|i mean|right)\b/gi) || [];
                const liveFillers = Array.from(new Set(matches.map(m => m.toLowerCase())));

                return (
                  <div className="speech-delivery-hud">
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', flexWrap: 'wrap' }}>
                      <span style={{ color: '#94a3b8', fontWeight: '700' }}>🎙️ Live Delivery:</span>
                      <span className="hud-pill" style={{ background: 'rgba(255,255,255,0.06)', color: '#f1f5f9' }}>
                        {wordCount} words
                      </span>
                      {liveWpm > 0 && (
                        <span className={`hud-pill ${liveWpm >= 115 && liveWpm <= 165 ? 'optimal' : liveWpm < 115 ? 'warning' : 'danger'}`}>
                          ⚡ {liveWpm} WPM {liveWpm >= 115 && liveWpm <= 165 ? '(Optimal)' : liveWpm < 115 ? '(Slow)' : '(Rushing)'}
                        </span>
                      )}
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {matches.length === 0 ? (
                        <span className="hud-pill optimal">
                          ✨ Clean Delivery (0 fillers)
                        </span>
                      ) : (
                        <span className={`hud-pill ${matches.length <= 2 ? 'warning' : 'danger'}`}>
                          ⚠️ {matches.length} Filler{matches.length > 1 ? 's' : ''}: {liveFillers.slice(0, 3).map(f => `"${f}"`).join(', ')}
                        </span>
                      )}
                    </div>
                  </div>
                );
              })()}

              <textarea
                className="transcript-stream-display"
                value={speechTranscript}
                onChange={(e) => setSpeechTranscript(e.target.value)}
                placeholder='Click "🎙️ Speak Answer" below to talk aloud, or type your response here directly...'
                rows={4}
                style={{
                  width: '100%',
                  boxSizing: 'border-box',
                  fontFamily: 'inherit',
                  resize: 'vertical',
                  outline: 'none'
                }}
              />

              {/* Controls Bar */}
              <div className="voice-controls-bar">
                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className={`btn-record-large ${isRecordingSpeech ? 'recording' : 'idle'}`}
                    onClick={toggleVoiceRecording}
                  >
                    <span>{isRecordingSpeech ? '⏹ Stop Recording' : '🎙️ Speak Answer'}</span>
                  </button>

                  <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>
                    {speechTranscript ? `${speechTranscript.split(/\s+/).filter(Boolean).length} words spoken` : ''}
                  </span>
                </div>

                <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                  <button
                    type="button"
                    className="btn-primary"
                    onClick={handleNextVoiceQuestion}
                    disabled={isEvaluating || !speechTranscript.trim()}
                    style={{ padding: '0.8rem 1.6rem', fontSize: '0.95rem' }}
                  >
                    {isEvaluating
                      ? 'Interviewer Formulating Follow-up...'
                      : isFinalQuestion || timeRemaining <= 0
                      ? 'Submit & Complete Interview 🎉'
                      : 'Submit Response →'}
                  </button>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '1.5rem', marginTop: '1.25rem', flexWrap: 'wrap' }}>
              {interviewHistory.length >= 2 && (
                <button
                  type="button"
                  onClick={handleWrapUpEarly}
                  disabled={isEvaluating}
                  style={{
                    background: 'rgba(99, 102, 241, 0.12)',
                    border: '1px solid rgba(99, 102, 241, 0.3)',
                    color: '#a5b4fc',
                    fontSize: '0.85rem',
                    padding: '0.4rem 0.9rem',
                    borderRadius: '8px',
                    cursor: 'pointer',
                    fontWeight: '600'
                  }}
                >
                  🏁 Finish & View Scorecard Early
                </button>
              )}
              <button
                type="button"
                onClick={resetVoiceInterview}
                style={{ background: 'none', border: 'none', color: '#64748b', fontSize: '0.85rem', cursor: 'pointer' }}
              >
                ✕ Exit Interview Session
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // RENDER 2: VOICE AI INTERVIEW - COMPREHENSIVE DEBRIEF
  // ═════════════════════════════════════════════════════════════════════════════
  if (showVoiceDebrief && voiceDebrief) {
    const scorecard = voiceDebrief.scorecard || {};
    const overall = scorecard.overallReadiness || 80;

    return (
      <div className="simulator-page section">
        <div className="container" style={{ maxWidth: '920px' }}>
          <div className="debrief-hero-card">
            <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎉</div>
            <h2 className="debrief-title">Voice AI Interview Complete!</h2>
            <p className="debrief-subtitle">
              Comprehensive candidate readiness assessment tailored to <strong>{candidateProfile?.candidateName || 'Candidate'}</strong> for <strong>{candidateProfile?.primaryDomain}</strong>.
            </p>

            {/* Scorecard Stats Grid */}
            <div className="scorecard-grid">
              <div className="scorecard-stat-card">
                <div className="scorecard-stat-num highlight">{overall}%</div>
                <div className="scorecard-stat-label">Readiness Score</div>
              </div>
              <div className="scorecard-stat-card">
                <div className="scorecard-stat-num">{formatTime(voiceDebrief.totalTimeSeconds || voiceTimer)}</div>
                <div className="scorecard-stat-label">Interview Duration</div>
              </div>
              <div className="scorecard-stat-card">
                <div className="scorecard-stat-num" style={{ color: '#10b981' }}>
                  {interviewHistory.length}
                </div>
                <div className="scorecard-stat-label">Questions Evaluated</div>
              </div>
              <div className="scorecard-stat-card">
                <div className="scorecard-stat-num" style={{ color: '#38bdf8' }}>
                  {candidateProfile?.experienceLevel || 'Mid-Level'}
                </div>
                <div className="scorecard-stat-label">Assessed Level</div>
              </div>
            </div>

            {/* 5/6-Dimension Competency Scorecard */}
            <div className="debrief-scorecard-grid">
              {(scorecard.dimensions || []).map((dim, i) => (
                <div key={i} className="dimension-card">
                  <div className="dimension-header">
                    <div className="dimension-title">{dim.icon} {dim.name}</div>
                    <div className="dimension-score-badge">{dim.score}%</div>
                  </div>
                  <div className="sim-progress-track" style={{ height: '6px', margin: '0.4rem 0' }}>
                    <div className="sim-progress-fill" style={{ width: `${dim.score}%`, background: dim.score >= 75 ? '#10b981' : dim.score >= 60 ? '#f59e0b' : '#f43f5e' }} />
                  </div>
                  <div className="dimension-desc">{dim.description}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Speech Delivery & Fluency Intelligence Card */}
          {voiceDebrief.speechDelivery && (
            <div className="recommendations-box" style={{ marginTop: '1.5rem', background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(99, 102, 241, 0.25)' }}>
              <div className="recommendations-title" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '0.5rem' }}>
                <span style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎙️</span> Speech Delivery & Vocal Fluency Intelligence
                </span>
                <span style={{ fontSize: '0.82rem', background: 'rgba(99, 102, 241, 0.2)', color: '#a5b4fc', padding: '0.2rem 0.65rem', borderRadius: '14px', border: '1px solid rgba(99, 102, 241, 0.35)' }}>
                  Fluency Score: {voiceDebrief.speechDelivery.fluencyScore}%
                </span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginTop: '1rem', marginBottom: '1rem' }}>
                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Speaking Pace</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: '#38bdf8', marginTop: '0.2rem' }}>
                    {voiceDebrief.speechDelivery.avgWpm} WPM
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    {voiceDebrief.speechDelivery.speechPaceVerdict}
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Filler Words Detected</div>
                  <div style={{ fontSize: '1.25rem', fontWeight: '800', color: voiceDebrief.speechDelivery.totalFillers <= 2 ? '#34d399' : '#fbbf24', marginTop: '0.2rem' }}>
                    {voiceDebrief.speechDelivery.totalFillers} total
                  </div>
                  <div style={{ display: 'flex', gap: '0.35rem', flexWrap: 'wrap', marginTop: '0.35rem' }}>
                    {(voiceDebrief.speechDelivery.topFillers || []).length > 0 ? (
                      voiceDebrief.speechDelivery.topFillers.map((f, i) => (
                        <span key={i} className="hud-pill warning" style={{ fontSize: '0.72rem', padding: '0.1rem 0.45rem' }}>
                          "{f.word}" x{f.count}
                        </span>
                      ))
                    ) : (
                      <span style={{ fontSize: '0.78rem', color: '#34d399' }}>✓ 0 fillers used</span>
                    )}
                  </div>
                </div>

                <div style={{ background: 'rgba(30, 41, 59, 0.5)', padding: '0.85rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.06)' }}>
                  <div style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', fontWeight: '700' }}>Interviewer Persona</div>
                  <div style={{ fontSize: '1.1rem', fontWeight: '800', color: '#f8fafc', marginTop: '0.2rem' }}>
                    {interviewerPersona === 'bar_raiser' ? '⚡ FAANG Bar Raiser' : interviewerPersona === 'coach' ? '🎓 Supportive Coach' : '💼 Staff Engineer'}
                  </div>
                  <div style={{ fontSize: '0.78rem', color: '#cbd5e1', marginTop: '0.2rem' }}>
                    {interviewerPersona === 'bar_raiser' ? 'Strict scaling & metrics bar' : interviewerPersona === 'coach' ? 'Confidence & flow focused' : 'Standard industry engineering bar'}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Job Description Matching & Skill Gap Analysis Card */}
          {voiceDebrief.jdAnalysis && (
            <div className="jd-gap-card">
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                <div style={{ fontWeight: '800', fontSize: '1.05rem', color: '#f8fafc', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span>🎯</span> Target Job Description Gap Analysis
                </div>
                <span style={{ background: 'rgba(56, 189, 248, 0.15)', border: '1px solid rgba(56, 189, 248, 0.35)', color: '#38bdf8', padding: '0.25rem 0.75rem', borderRadius: '20px', fontWeight: '800', fontSize: '0.82rem' }}>
                  {voiceDebrief.jdAnalysis.alignmentScore}% JD Alignment Match
                </span>
              </div>

              <p style={{ margin: '0 0 0.85rem 0', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                {voiceDebrief.jdAnalysis.summary}
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
                <div>
                  <span style={{ fontSize: '0.78rem', color: '#94a3b8', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                    Matched Skills from Your Profile:
                  </span>
                  <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                    {(voiceDebrief.jdAnalysis.matchedSkills || []).map((s, idx) => (
                      <span key={idx} className="skill-chip matched">✓ {s}</span>
                    ))}
                  </div>
                </div>

                {(voiceDebrief.jdAnalysis.skillGaps || []).length > 0 && (
                  <div>
                    <span style={{ fontSize: '0.78rem', color: '#fbbf24', fontWeight: '700', textTransform: 'uppercase', display: 'block', marginBottom: '0.3rem' }}>
                      Target Skills Probed as Gaps:
                    </span>
                    <div style={{ display: 'flex', gap: '0.4rem', flexWrap: 'wrap' }}>
                      {voiceDebrief.jdAnalysis.skillGaps.map((s, idx) => (
                        <span key={idx} className="skill-chip gap">⚠️ {s}</span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Key Strengths & Recommendations */}
          <div className="recommendations-box" style={{ marginTop: '1.5rem' }}>
            <div className="recommendations-title">
              <span>💡</span> Interviewer Feedback & Key Recommendations
            </div>
            <div className="recommendations-list">
              {(scorecard.recommendations || []).map((rec, i) => (
                <div key={i} className="recommendation-item">
                  <span>📐</span>
                  <div>{rec}</div>
                </div>
              ))}
            </div>
          </div>

          {/* 7-Day Personalized Revision Roadmap */}
          {scorecard.roadmap && (
            <div className="roadmap-timeline-box">
              <div style={{ fontWeight: '800', color: '#f8fafc', fontSize: '1.05rem', marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span>🚀</span> 7-Day Targeted Placement Roadmap
              </div>
              {scorecard.roadmap.map((step, idx) => (
                <div key={idx} className="roadmap-step">
                  <span className="roadmap-day-pill">{step.day}</span>
                  <div style={{ color: '#cbd5e1', fontSize: '0.92rem' }}>{step.focus}</div>
                </div>
              ))}
            </div>
          )}

          {/* Spoken Transcript Review */}
          <div className="review-section-title" style={{ marginTop: '2.5rem' }}>
            <span>Question-by-Question Spoken Transcript, STAR Evaluation & Staff Rewrites ({interviewHistory.length})</span>
          </div>

          <div className="review-accordion-list">
            {interviewHistory.map((item, idx) => {
              const isExpanded = !!expandedAccordion[idx];
              const ev = item.evaluation || {};
              const sa = ev.speechAnalysis;
              const star = ev.starAnalysis;
              const staff = ev.staffRewrite;

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
                          {item.questionObj?.stageName}
                        </div>
                        <div className="review-q-title">{item.questionObj?.question}</div>
                      </div>
                    </div>
                    <div className="review-header-right">
                      <span className="status-badge mastered" style={{ background: ev.score >= 75 ? 'rgba(16, 185, 129, 0.2)' : 'rgba(245, 158, 11, 0.2)', color: ev.score >= 75 ? '#10b981' : '#f59e0b' }}>
                        Score: {ev.score}%
                      </span>
                      <span style={{ color: '#94a3b8', fontSize: '0.9rem' }}>{isExpanded ? '▲' : '▼'}</span>
                    </div>
                  </div>

                  {isExpanded && (
                    <div className="review-accordion-body">
                      {/* Candidate Spoken Response */}
                      <div className="answer-card user">
                        <div className="answer-card-header">
                          <span>🎙️ What You Spoke</span>
                          <span style={{ fontSize: '0.75rem', color: '#94a3b8' }}>
                            ({ev.wordCount || 0} words{sa ? ` · ${sa.wpm} WPM · ${sa.fillerCount} fillers` : ''})
                          </span>
                        </div>
                        <div className="answer-text-content">{item.candidateAnswer}</div>
                      </div>

                      {/* STAR Method Heatmap */}
                      {star && (
                        <div className="star-heatmap-card">
                          <div className="star-badge-row">
                            <span className="star-tag-label">STAR Breakdown:</span>
                            <span className={`star-pill ${star.hasSituation ? 'present' : 'missing'}`}>
                              {star.hasSituation ? '✓ Situation' : '✗ Situation'}
                            </span>
                            <span className={`star-pill ${star.hasTask ? 'present' : 'missing'}`}>
                              {star.hasTask ? '✓ Task' : '✗ Task'}
                            </span>
                            <span className={`star-pill ${star.hasAction ? 'present' : 'missing'}`}>
                              {star.hasAction ? '✓ Action' : '✗ Action'}
                            </span>
                            <span className={`star-pill ${star.hasResult ? 'present' : 'missing'}`}>
                              {star.hasResult ? '✓ Result' : '✗ Result'}
                            </span>
                            <span className={`star-pill ${star.hasMetric ? 'metric-present' : 'metric-missing'}`}>
                              {star.hasMetric ? '📊 Metrics Included' : '⚠️ Missing Metrics'}
                            </span>
                          </div>
                          <div className="star-feedback-note">{star.feedback}</div>
                        </div>
                      )}

                      {/* AI Feedback */}
                      <div style={{ background: 'rgba(30, 41, 59, 0.5)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: '12px', padding: '1rem', marginBottom: '1rem' }}>
                        <div style={{ fontWeight: '700', color: '#38bdf8', fontSize: '0.85rem', marginBottom: '0.35rem' }}>
                          🤖 AI Feedback ({interviewerPersona === 'bar_raiser' ? 'FAANG Bar Raiser' : interviewerPersona === 'coach' ? 'Coach' : 'Staff Engineer'}):
                        </div>
                        <p style={{ margin: 0, fontSize: '0.9rem', color: '#cbd5e1' }}>{ev.feedback}</p>
                      </div>

                      {/* "How a Staff Engineer Would Answer This" (AI Answer Rewriter) */}
                      {staff && (
                        <div className="staff-rewrite-card">
                          <div
                            className="staff-rewrite-header"
                            onClick={() => setExpandedRewrite(prev => ({ ...prev, [idx]: !prev[idx] }))}
                          >
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
                              <span style={{ fontSize: '1.2rem' }}>👔</span>
                              <span style={{ fontWeight: '800', color: '#f8fafc', fontSize: '0.92rem' }}>
                                How a Staff / Principal Engineer Would Answer This
                              </span>
                              <span className="staff-pill-badge">Staff+ Model</span>
                            </div>
                            <span style={{ color: '#818cf8', fontSize: '0.82rem', fontWeight: '700' }}>
                              {expandedRewrite[idx] ? 'Hide Comparison ▲' : 'View Side-by-Side Comparison ▼'}
                            </span>
                          </div>

                          {expandedRewrite[idx] && (
                            <div className="staff-rewrite-body">
                              <div className="staff-metric-callout">
                                <strong style={{ color: '#818cf8' }}>⚡ Key Architectural Trade-off: </strong>
                                {staff.architecturalTradeoff}
                              </div>
                              <div className="staff-metric-callout impact">
                                <strong style={{ color: '#34d399' }}>📈 Quantifiable Production Impact: </strong>
                                {staff.quantifiableImpact}
                              </div>
                              <div className="staff-full-answer-box">
                                <div style={{ fontSize: '0.78rem', color: '#818cf8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.4rem' }}>
                                  Executive-Level Spoken Answer:
                                </div>
                                <p style={{ margin: 0, color: '#f1f5f9', fontStyle: 'italic', lineHeight: '1.6', fontSize: '0.9rem' }}>
                                  {staff.fullStaffAnswer}
                                </p>
                              </div>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Model Answer Key */}
                      <div className="answer-card model" style={{ marginTop: '1rem' }}>
                        <div className="answer-card-header">
                          <span>✓ Essential Knowledge Points</span>
                        </div>
                        <div className="answer-text-content">{item.questionObj?.modelAnswer}</div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>

          {/* Candidate Q&A Closing Round ("Ask the Interviewer") */}
          <div className="ask-interviewer-card">
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', marginBottom: '0.5rem' }}>
              <span style={{ fontSize: '1.5rem' }}>💬</span>
              <h3 style={{ margin: 0, fontSize: '1.25rem', fontWeight: '800', color: '#f8fafc' }}>
                Closing Round: Ask the Interviewer
              </h3>
            </div>
            <p style={{ fontSize: '0.88rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: '1.5' }}>
              In real senior engineering interviews, hiring leads assess the questions you ask. Ask about on-call rotation, technical debt, or team culture to receive an authentic, in-character response from our Principal Lead.
            </p>

            <div className="ask-quick-prompts">
              {[
                "What does the on-call rotation and incident triage look like?",
                "How does the team handle technical debt and refactoring?",
                "What is the engineering culture and work-life balance like?",
                "What are the expectations for career growth to Staff engineer?"
              ].map((prompt, pIdx) => (
                <button
                  key={pIdx}
                  type="button"
                  className="ask-prompt-pill"
                  onClick={() => handleAskInterviewer(prompt)}
                  disabled={isAskingInterviewer}
                >
                  {prompt}
                </button>
              ))}
            </div>

            <div style={{ display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
              <input
                type="text"
                className="form-input"
                style={{ flex: 1 }}
                placeholder="Type your own question for the interviewer (e.g. How are design RFCs reviewed?)..."
                value={candidateQuestionInput}
                onChange={(e) => setCandidateQuestionInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleAskInterviewer()}
              />
              <button
                type="button"
                className="btn-primary"
                onClick={() => handleAskInterviewer()}
                disabled={isAskingInterviewer || !candidateQuestionInput.trim()}
                style={{ padding: '0.75rem 1.4rem', whiteSpace: 'nowrap' }}
              >
                {isAskingInterviewer ? 'Interviewer Formulating...' : 'Ask Interviewer →'}
              </button>
            </div>

            {/* Q&A Responses List */}
            {candidateQnaHistory.map((qna, qIdx) => (
              <div key={qIdx} className="interviewer-reply-bubble">
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.4rem' }}>
                  <div style={{ fontWeight: '700', color: '#cbd5e1', fontSize: '0.9rem' }}>
                    Candidate Asked: "{qna.question}"
                  </div>
                  <button
                    type="button"
                    onClick={() => speakAi(qna.answer)}
                    style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.8rem', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '0.3rem' }}
                  >
                    🔊 Hear AI Answer
                  </button>
                </div>
                <div style={{ fontSize: '0.78rem', color: '#38bdf8', fontWeight: '800', textTransform: 'uppercase', marginBottom: '0.3rem' }}>
                  {qna.interviewerRole || 'Staff Principal Engineer'} Response:
                </div>
                <p style={{ margin: 0, color: '#f1f5f9', lineHeight: '1.6', fontSize: '0.92rem' }}>
                  {qna.answer}
                </p>
              </div>
            ))}
          </div>

          <div className="debrief-action-buttons" style={{ marginTop: '2rem' }}>
            <button className="btn-primary" onClick={handleStartVoiceInterview}>
              🔄 Retake Voice AI Interview
            </button>
            <button className="btn-secondary" onClick={resetVoiceInterview}>
              📄 Upload Different Resume
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ═════════════════════════════════════════════════════════════════════════════
  // RENDER 3: VOICE AI INTERVIEW - SETUP & RESUME UPLOAD
  // ═════════════════════════════════════════════════════════════════════════════
  return (
    <div className="simulator-page section">
      <div className="container">
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <span className="hero-pill-badge" style={{ display: 'inline-block', marginBottom: '0.75rem' }}>
            Next-Gen Conversational Interviewer
          </span>
          <h1 className="mb-2" style={{ fontSize: '2.4rem', fontWeight: '800' }}>
            Real-Time AI Voice Mock Interview
          </h1>
          <p className="text-muted" style={{ maxWidth: '680px', margin: '0 auto', fontSize: '1.05rem' }}>
            Upload your resume and be interviewed in real time. The AI analyzes your projects and skills, speaks questions aloud, and listens to you speaking back with instant coaching.
          </p>
        </div>

        <div className="resume-interview-setup-card">
          {/* Resume Upload Dropzone */}
          <div
            className="interview-dropzone"
            onClick={() => fileInputRef.current?.click()}
          >
            <input
              ref={fileInputRef}
              type="file"
              accept=".pdf,.doc,.docx,.txt"
              onChange={handleFileUpload}
              style={{ display: 'none' }}
            />
            <span className="dropzone-icon">📄</span>
            <div className="dropzone-title">
              {resumeFile ? resumeFile.name : 'Upload Your Resume to Begin'}
            </div>
            <div className="dropzone-subtitle">
              {resumeFile ? `${(resumeFile.size / 1024).toFixed(1)} KB · Click to replace file` : 'Supports PDF, Word (DOC/DOCX), or TXT (Max 10MB)'}
            </div>

            {resumeFile && (
              <div className="file-selected-badge">
                <span>✓ Resume Ready for AI Analysis</span>
              </div>
            )}
          </div>

          {/* Paste Text Option Toggle */}
          <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
            <button
              type="button"
              onClick={() => setShowTextPaste(!showTextPaste)}
              style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.88rem', fontWeight: '600' }}
            >
              {showTextPaste ? 'Hide Paste Box ▲' : 'Or paste your resume text / portfolio summary directly ▼'}
            </button>
          </div>

          {showTextPaste && (
            <div className="form-group mb-4">
              <textarea
                className="user-answer-input"
                rows={6}
                placeholder="Paste your resume text here (experience, skills, projects)..."
                value={resumeText}
                onChange={(e) => setResumeText(e.target.value)}
              />
            </div>
          )}

          {/* Target Job Role (Optional) */}
          <div className="form-group mb-4">
            <label style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '0.4rem' }}>
              Target Job Role / Title (Optional)
            </label>
            <input
              type="text"
              className="form-input"
              placeholder="e.g. Full Stack Developer, Backend Engineer, Data Scientist, DevOps Specialist"
              value={targetRole}
              onChange={(e) => setTargetRole(e.target.value)}
            />
            <span style={{ fontSize: '0.8rem', color: '#94a3b8' }}>
              Leave blank to let AI automatically detect your ideal role from your resume.
            </span>
          </div>

          {/* Interviewer Persona & Strictness Level */}
          <div className="form-group mb-4">
            <label style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🎭</span> Interviewer Persona & Strictness Level
            </label>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '0.75rem' }}>
              {[
                {
                  id: 'coach',
                  icon: '🎓',
                  title: 'Supportive Coach',
                  badge: 'Gentle & Encouraging',
                  desc: 'Encouraging tone, constructive nudges & confidence boosting. Ideal for practice.'
                },
                {
                  id: 'staff',
                  icon: '💼',
                  title: 'Standard Staff Engineer',
                  badge: 'Industry Standard',
                  desc: 'Pragmatic, direct, tests trade-offs, architecture patterns and clean execution.'
                },
                {
                  id: 'bar_raiser',
                  icon: '⚡',
                  title: 'FAANG Bar Raiser',
                  badge: 'Strict & Ruthless',
                  desc: 'High-bar scrutiny. Demands metrics, aggressively attacks failure modes and scale.'
                }
              ].map(p => (
                <div
                  key={p.id}
                  className={`persona-card ${interviewerPersona === p.id ? 'active' : ''}`}
                  onClick={() => setInterviewerPersona(p.id)}
                >
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem' }}>
                      <span style={{ fontSize: '1.25rem' }}>{p.icon}</span>
                      <span style={{ fontWeight: '700', fontSize: '0.92rem', color: interviewerPersona === p.id ? '#818cf8' : '#e2e8f0' }}>
                        {p.title}
                      </span>
                    </div>
                  </div>
                  <span style={{ fontSize: '0.72rem', color: interviewerPersona === p.id ? '#c7d2fe' : '#94a3b8', display: 'inline-block', marginBottom: '0.35rem', fontWeight: '600' }}>
                    {p.badge}
                  </span>
                  <p style={{ margin: 0, fontSize: '0.78rem', color: '#94a3b8', lineHeight: '1.4' }}>
                    {p.desc}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Target Job Description & Skills (Optional) */}
          <div className="form-group mb-4" style={{
            background: 'rgba(15, 23, 42, 0.5)',
            padding: '1rem 1.25rem',
            borderRadius: '14px',
            border: '1px solid rgba(255, 255, 255, 0.08)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: showJdInput ? '0.6rem' : 0 }}>
              <label style={{ fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.95rem' }}>
                <span>🎯</span> Target Job Description & Gap Analysis (Optional)
              </label>
              <button
                type="button"
                onClick={() => setShowJdInput(!showJdInput)}
                style={{ background: 'none', border: 'none', color: '#818cf8', cursor: 'pointer', fontSize: '0.84rem', fontWeight: '600' }}
              >
                {showJdInput ? 'Hide JD Box ▲' : '+ Paste Target Job Description ▼'}
              </button>
            </div>

            {showJdInput && (
              <div style={{ marginTop: '0.5rem' }}>
                <textarea
                  className="user-answer-input"
                  rows={4}
                  placeholder="Paste the target job description or company requirements here (e.g. Kubernetes, Kafka, Terraform, Distributed Systems)..."
                  value={jobDescription}
                  onChange={(e) => setJobDescription(e.target.value)}
                  style={{ minHeight: '100px', fontSize: '0.9rem' }}
                />
                <span style={{ fontSize: '0.8rem', color: '#94a3b8', display: 'block', marginTop: '0.4rem' }}>
                  💡 The AI interviewer will analyze this JD against your resume, calculate a Match Score, and intentionally probe unproven skill gaps.
                </span>
              </div>
            )}
          </div>

          {/* Interview Session Duration & Timing */}
          <div className="form-group mb-4" style={{
            background: 'rgba(15, 23, 42, 0.55)',
            padding: '1.25rem',
            borderRadius: '16px',
            border: '1px solid rgba(99, 102, 241, 0.25)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.5rem', flexWrap: 'wrap', gap: '0.5rem' }}>
              <label style={{ fontWeight: '700', color: '#f8fafc', margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '1rem' }}>
                <span>⏱️</span> Interview Duration: <strong style={{ color: '#818cf8' }}>{sessionDurationMinutes} Minutes</strong>
              </label>
              <span style={{ fontSize: '0.76rem', color: '#818cf8', background: 'rgba(99, 102, 241, 0.15)', padding: '0.2rem 0.6rem', borderRadius: '12px', border: '1px solid rgba(99, 102, 241, 0.3)' }}>
                Adaptive Question Volume
              </span>
            </div>

            <p style={{ fontSize: '0.84rem', color: '#94a3b8', margin: '0 0 1rem 0', lineHeight: '1.45' }}>
              Choose your session length. The AI interviewer adapts the question volume, probing depth, and follow-ups dynamically based on how thoroughly you answer.
            </p>

            <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
              {[
                { mins: 5, label: '⚡ 5 Mins (Speed Screen)' },
                { mins: 10, label: '🎯 10 Mins (Standard)' },
                { mins: 15, label: '⭐ 15 Mins (Recommended)' },
                { mins: 20, label: '🔬 20 Mins (Deep Dive)' },
                { mins: 30, label: '🏆 30 Mins (Full Loop)' }
              ].map(opt => (
                <button
                  key={opt.mins}
                  type="button"
                  className={`btn-option-pill ${sessionDurationMinutes === opt.mins && !isCustomDuration ? 'active' : ''}`}
                  onClick={() => {
                    setSessionDurationMinutes(opt.mins);
                    setIsCustomDuration(false);
                  }}
                  style={{ padding: '0.45rem 0.95rem', fontSize: '0.86rem' }}
                >
                  {opt.label}
                </button>
              ))}

              <div style={{ display: 'inline-flex', alignItems: 'center', gap: '0.4rem', marginLeft: 'auto' }}>
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>Custom:</span>
                <input
                  type="number"
                  min="3"
                  max="60"
                  value={customMinutesInput}
                  onChange={(e) => {
                    const val = e.target.value;
                    setCustomMinutesInput(val);
                    const num = parseInt(val, 10);
                    if (num >= 3 && num <= 60) {
                      setSessionDurationMinutes(num);
                      setIsCustomDuration(true);
                    }
                  }}
                  placeholder="Mins"
                  style={{
                    width: '65px',
                    padding: '0.35rem 0.5rem',
                    borderRadius: '8px',
                    background: 'rgba(30, 41, 59, 0.7)',
                    border: isCustomDuration ? '1px solid #818cf8' : '1px solid rgba(255,255,255,0.15)',
                    color: '#fff',
                    fontSize: '0.85rem',
                    textAlign: 'center'
                  }}
                />
                <span style={{ fontSize: '0.82rem', color: '#94a3b8' }}>min</span>
              </div>
            </div>
          </div>

          {/* Voice & Pacing Settings */}
          <div className="form-group mb-4" style={{ background: 'rgba(15, 23, 42, 0.5)', padding: '1rem 1.25rem', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.08)' }}>
            <label style={{ fontWeight: '700', color: '#f8fafc', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <span>🔊</span> AI Interviewer Voice & Pacing
            </label>

            <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
              <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                <span style={{ fontSize: '0.85rem', color: '#cbd5e1' }}>Pacing:</span>
                {[0.9, 1.0, 1.15].map(rate => (
                  <button
                    key={rate}
                    type="button"
                    className={`btn-option-pill ${voiceRate === rate ? 'active' : ''}`}
                    onClick={() => setVoiceRate(rate)}
                    style={{ padding: '0.25rem 0.75rem', fontSize: '0.82rem' }}
                  >
                    {rate === 1.0 ? 'Normal (1.0x)' : `${rate}x`}
                  </button>
                ))}
              </div>

              <button
                type="button"
                onClick={() => speakAi('Hello! I am your AI interviewer. I look forward to hearing about your technical background.')}
                style={{ background: 'rgba(99, 102, 241, 0.18)', border: '1px solid rgba(99, 102, 241, 0.35)', color: '#a5b4fc', padding: '0.35rem 0.85rem', borderRadius: '8px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: '600' }}
              >
                🔊 Test AI Voice
              </button>
            </div>
          </div>

          {/* Start Button */}
          <button
            className="btn-primary"
            style={{ width: '100%', padding: '1.15rem', fontSize: '1.1rem', fontWeight: '800', borderRadius: '14px', letterSpacing: '0.02em' }}
            onClick={handleStartVoiceInterview}
            disabled={isUploadingResume}
          >
            {isUploadingResume ? 'Analyzing Resume & Preparing AI Voice Room...' : 'Start Real-Time Voice Interview 🚀'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Simulator;