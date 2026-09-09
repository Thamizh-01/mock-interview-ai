const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const ProgressStore = require('../services/progressStore');

// GET /api/progress - Fetch user progress
router.get('/', optionalAuth, async (req, res) => {
  try {
    const progress = await ProgressStore.getProgress(req.user);
    res.json({ progress });
  } catch (err) {
    console.error('Failed to get progress:', err);
    res.status(500).json({ error: 'Failed to retrieve progress' });
  }
});

// POST /api/progress/mark-reviewed - Record question practice
router.post('/mark-reviewed', optionalAuth, async (req, res) => {
  try {
    const { questionId, category, timeSpent = 1, score = null } = req.body;
    const result = await ProgressStore.recordQuestionReviewed({
      user: req.user,
      questionId,
      category,
      timeSpent,
      score
    });
    res.json({ message: 'Question marked as reviewed', progress: result.progress });
  } catch (err) {
    console.error('Failed to record question reviewed:', err);
    res.status(500).json({ error: 'Failed to record question progress' });
  }
});

// POST /api/progress/complete-interview - Record mock interview session
router.post('/complete-interview', optionalAuth, async (req, res) => {
  try {
    const { timeSpent = 15, score = 80, categories = [], ratings = {} } = req.body;
    const result = await ProgressStore.recordInterviewCompleted({
      user: req.user,
      timeSpent,
      score,
      categories,
      ratings
    });
    res.json({ message: 'Interview completed and saved', progress: result.progress });
  } catch (err) {
    console.error('Failed to record interview completion:', err);
    res.status(500).json({ error: 'Failed to record interview progress' });
  }
});

// POST /api/progress/complete-aptitude - Record aptitude quiz completion
router.post('/complete-aptitude', optionalAuth, async (req, res) => {
  try {
    const { topic, score = 0, totalQuestions = 10, timeSpent = 5 } = req.body;
    const result = await ProgressStore.recordAptitudeCompleted({
      user: req.user,
      topic,
      score,
      totalQuestions,
      timeSpent
    });
    res.json({ message: 'Aptitude progress recorded', progress: result.progress });
  } catch (err) {
    console.error('Failed to record aptitude progress:', err);
    res.status(500).json({ error: 'Failed to record aptitude progress' });
  }
});

// POST /api/progress/analyze-resume - Record resume analysis
router.post('/analyze-resume', optionalAuth, async (req, res) => {
  try {
    const { score = 85, fileName = 'Resume.pdf' } = req.body;
    const result = await ProgressStore.recordResumeAnalyzed({
      user: req.user,
      score,
      fileName
    });
    res.json({ message: 'Resume analysis recorded', progress: result.progress });
  } catch (err) {
    console.error('Failed to record resume progress:', err);
    res.status(500).json({ error: 'Failed to record resume progress' });
  }
});

// POST /api/progress/reset - Reset progress
router.post('/reset', optionalAuth, async (req, res) => {
  try {
    const emptyProgress = await ProgressStore.reset(req.user);
    res.json({ message: 'Progress reset successfully', progress: emptyProgress });
  } catch (err) {
    console.error('Failed to reset progress:', err);
    res.status(500).json({ error: 'Failed to reset progress' });
  }
});

module.exports = router;