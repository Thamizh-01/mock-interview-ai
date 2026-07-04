const express = require('express');
const router = express.Router();

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  return new Date(d.setDate(diff));
};

const getMonthStart = (date) => {
  return new Date(date.getFullYear(), date.getMonth(), 1);
};

const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

const inMemoryProgress = {
  questionsReviewed: 0,
  categoriesPracticed: [],
  mockInterviewsCompleted: 0,
  totalTimeSpent: 0,
  averageScore: 0
};

const inMemoryActivities = [];

router.get('/', async (req, res) => {
  const now = new Date();
  const weekStart = getWeekStart(now);
  const monthStart = getMonthStart(now);

  const weeklyActivities = inMemoryActivities.filter(a => new Date(a.date) >= weekStart);

  const weeklyData = {
    period: 'This Week',
    startDate: weekStart,
    questionsReviewed: weeklyActivities.filter(a => a.type === 'question_reviewed').length,
    interviewsCompleted: weeklyActivities.filter(a => a.type === 'interview_completed').length,
    categoriesPracticed: [...new Set(weeklyActivities.map(a => a.category).filter(Boolean))],
    totalTimeSpent: weeklyActivities.reduce((sum, a) => sum + (a.details?.timeSpent || 0), 0),
    dailyBreakdown: getDailyBreakdown(weeklyActivities, weekStart)
  };

  const lastMonthStart = new Date(monthStart);
  lastMonthStart.setMonth(lastMonthStart.getMonth() - 1);

  const monthlyData = {
    period: 'This Month',
    startDate: monthStart,
    questionsReviewed: inMemoryActivities.length,
    interviewsCompleted: inMemoryActivities.filter(a => a.type === 'interview_completed').length,
    categoriesPracticed: [...new Set(inMemoryActivities.map(a => a.category).filter(Boolean))],
    weeklyComparison: getWeeklyComparison(inMemoryActivities),
    categoryBreakdown: getCategoryBreakdown(inMemoryActivities)
  };

  monthlyData.improvement = 0;
  monthlyData.previousMonthCount = 0;

  res.json({
    overview: inMemoryProgress,
    weekly: weeklyData,
    monthly: monthlyData,
    recentActivities: inMemoryActivities.slice(-10).reverse()
  });
});

function getDailyBreakdown(activities, weekStart) {
  const days = [];
  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(weekStart);
    dayStart.setDate(dayStart.getDate() + i);
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayActivities = activities.filter(a => {
      const d = new Date(a.date);
      return d >= dayStart && d < dayEnd;
    });

    days.push({
      day: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][i],
      date: dayStart.toISOString().split('T')[0],
      questions: dayActivities.filter(a => a.type === 'question_reviewed').length,
      interviews: dayActivities.filter(a => a.type === 'interview_completed').length
    });
  }
  return days;
}

function getWeeklyComparison(activities) {
  const weeks = [];
  const now = new Date();

  for (let i = 3; i >= 0; i--) {
    const weekStart = getWeekStart(new Date(now));
    weekStart.setDate(weekStart.getDate() - (i * 7));
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);

    const weekActivities = activities.filter(a => {
      const d = new Date(a.date);
      return d >= weekStart && d < weekEnd;
    });

    weeks.push({
      week: `Week ${getWeekNumber(weekStart)}`,
      questionsReviewed: weekActivities.filter(a => a.type === 'question_reviewed').length,
      interviewsCompleted: weekActivities.filter(a => a.type === 'interview_completed').length
    });
  }

  return weeks;
}

function getCategoryBreakdown(activities) {
  const categories = {};
  activities.forEach(a => {
    if (a.category) {
      categories[a.category] = (categories[a.category] || 0) + 1;
    }
  });

  return Object.entries(categories)
    .map(([name, count]) => ({ name, count }))
    .sort((a, b) => b.count - a.count);
}

router.get('/history', async (req, res) => {
  const { period = 'month' } = req.query;
  const now = new Date();
  let startDate;

  if (period === 'week') {
    startDate = getWeekStart(new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000));
  } else if (period === 'month') {
    startDate = getMonthStart(new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000));
  } else if (period === 'year') {
    startDate = new Date(now.getFullYear(), 0, 1);
  } else {
    startDate = new Date(0);
  }

  const filteredActivities = inMemoryActivities.filter(a => new Date(a.date) >= startDate);

  res.json({ activities: filteredActivities.reverse() });
});

module.exports = router;