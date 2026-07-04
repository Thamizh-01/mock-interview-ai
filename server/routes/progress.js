const express = require('express');
const router = express.Router();
const User = require('../models/User');

const inMemoryProgress = {
  questionsReviewed: 0,
  categoriesPracticed: [],
  mockInterviewsCompleted: 0,
  totalTimeSpent: 0,
  averageScore: 0
};

const inMemoryActivities = [];

router.get('/', async (req, res) => {
  res.json({ progress: inMemoryProgress });
});

router.post('/mark-reviewed', async (req, res) => {
  const { questionId, category, timeSpent = 0 } = req.body;
  inMemoryProgress.questionsReviewed += 1;
  if (category && !inMemoryProgress.categoriesPracticed.includes(category)) {
    inMemoryProgress.categoriesPracticed.push(category);
  }
  inMemoryProgress.totalTimeSpent += timeSpent;
  inMemoryActivities.push({
    type: 'question_reviewed',
    category,
    details: { questionId, timeSpent },
    date: new Date()
  });
  if (inMemoryActivities.length > 500) {
    inMemoryActivities.splice(0, inMemoryActivities.length - 500);
  }
  res.json({ message: 'Question marked as reviewed', progress: inMemoryProgress });
});

router.post('/complete-interview', async (req, res) => {
  const { timeSpent = 0, score = 0, categories = [] } = req.body;
  inMemoryProgress.mockInterviewsCompleted += 1;
  inMemoryProgress.totalTimeSpent += timeSpent;
  if (score > 0 && inMemoryProgress.mockInterviewsCompleted > 0) {
    const currentAvg = inMemoryProgress.averageScore;
    const total = inMemoryProgress.mockInterviewsCompleted;
    inMemoryProgress.averageScore = ((currentAvg * (total - 1)) + score) / total;
  }
  categories.forEach(cat => {
    if (!inMemoryProgress.categoriesPracticed.includes(cat)) {
      inMemoryProgress.categoriesPracticed.push(cat);
    }
  });
  inMemoryActivities.push({
    type: 'interview_completed',
    details: { timeSpent, score, categories },
    date: new Date()
  });
  if (inMemoryActivities.length > 500) {
    inMemoryActivities.splice(0, inMemoryActivities.length - 500);
  }
  res.json({ message: 'Interview completed', progress: inMemoryProgress });
});

router.post('/analyze-resume', async (req, res) => {
  res.json({ message: 'Resume analyzed', progress: inMemoryProgress });
});

router.post('/reset', async (req, res) => {
  inMemoryProgress.questionsReviewed = 0;
  inMemoryProgress.categoriesPracticed = [];
  inMemoryProgress.mockInterviewsCompleted = 0;
  inMemoryProgress.totalTimeSpent = 0;
  inMemoryProgress.averageScore = 0;
  inMemoryActivities.length = 0;
  res.json({ message: 'Progress reset successfully', progress: inMemoryProgress });
});

module.exports = router;