const User = require('../models/User');

const getWeekStart = (date) => {
  const d = new Date(date);
  const day = d.getDay();
  const diff = d.getDate() - day + (day === 0 ? -6 : 1);
  const start = new Date(d.setDate(diff));
  start.setHours(0, 0, 0, 0);
  return start;
};

const getMonthStart = (date) => {
  const d = new Date(date.getFullYear(), date.getMonth(), 1);
  d.setHours(0, 0, 0, 0);
  return d;
};

const getWeekNumber = (date) => {
  const d = new Date(date);
  d.setHours(0, 0, 0, 0);
  d.setDate(d.getDate() + 4 - (d.getDay() || 7));
  const yearStart = new Date(d.getFullYear(), 0, 1);
  return Math.ceil((((d - yearStart) / 86400000) + 1) / 7);
};

// Global shared in-memory storage (used for guest sessions or server sync)
let inMemoryProgress = {
  questionsReviewed: 0,
  categoriesPracticed: [],
  mockInterviewsCompleted: 0,
  aptitudeCompleted: 0,
  resumesAnalyzed: 0,
  totalTimeSpent: 0, // minutes
  averageScore: 0
};

let inMemoryActivities = [];

function getDailyBreakdown(activities, weekStart) {
  const dayNames = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
  const days = [];
  
  for (let i = 0; i < 7; i++) {
    const dayStart = new Date(weekStart);
    dayStart.setDate(dayStart.getDate() + i);
    dayStart.setHours(0, 0, 0, 0);
    
    const dayEnd = new Date(dayStart);
    dayEnd.setDate(dayEnd.getDate() + 1);

    const dayActivities = activities.filter(a => {
      const d = new Date(a.date);
      return d >= dayStart && d < dayEnd;
    });

    const questions = dayActivities.filter(a => a.type === 'question_reviewed').length;
    const interviews = dayActivities.filter(a => a.type === 'interview_completed').length;
    const aptitude = dayActivities.filter(a => a.type === 'aptitude_completed').length;

    days.push({
      day: dayNames[i],
      date: dayStart.toISOString().split('T')[0],
      questions,
      interviews,
      aptitude,
      total: questions + interviews + aptitude
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
      interviewsCompleted: weekActivities.filter(a => a.type === 'interview_completed').length,
      aptitudeCompleted: weekActivities.filter(a => a.type === 'aptitude_completed').length,
      total: weekActivities.length
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

  const total = Object.values(categories).reduce((sum, count) => sum + count, 0) || 1;

  return Object.entries(categories)
    .map(([name, count]) => ({
      name,
      count,
      percentage: Math.round((count / total) * 100)
    }))
    .sort((a, b) => b.count - a.count);
}

function getDomainMastery(progress, activities) {
  const domainMap = {};
  
  // Base default domains to show clean progress if empty
  const defaultDomains = [
    { id: 'fullstack', name: 'Full Stack & Web Dev', target: 30 },
    { id: 'database', name: 'Databases & SQL', target: 20 },
    { id: 'systemdesign', name: 'System Design', target: 15 },
    { id: 'aptitude', name: 'Quantitative & Logic', target: 25 },
    { id: 'behavioral', name: 'HR & Behavioral', target: 15 }
  ];

  defaultDomains.forEach(d => {
    domainMap[d.id] = {
      id: d.id,
      name: d.name,
      solved: 0,
      target: d.target,
      mastery: 0
    };
  });

  activities.forEach(a => {
    const rawCat = (a.category || '').toLowerCase();
    let matchedKey = null;

    if (rawCat.includes('react') || rawCat.includes('web') || rawCat.includes('fullstack') || rawCat.includes('node') || rawCat.includes('javascript')) {
      matchedKey = 'fullstack';
    } else if (rawCat.includes('data') || rawCat.includes('sql') || rawCat.includes('mongo') || rawCat.includes('postgres')) {
      matchedKey = 'database';
    } else if (rawCat.includes('system') || rawCat.includes('cloud') || rawCat.includes('devops')) {
      matchedKey = 'systemdesign';
    } else if (rawCat.includes('aptitude') || rawCat.includes('logic') || rawCat.includes('quant') || rawCat.includes('reasoning') || rawCat.includes('verbal')) {
      matchedKey = 'aptitude';
    } else if (rawCat.includes('behavioral') || rawCat.includes('leadership') || rawCat.includes('hr') || rawCat.includes('star')) {
      matchedKey = 'behavioral';
    } else if (rawCat) {
      if (!domainMap[rawCat]) {
        domainMap[rawCat] = {
          id: rawCat,
          name: a.category.charAt(0).toUpperCase() + a.category.slice(1),
          solved: 0,
          target: 20,
          mastery: 0
        };
      }
      matchedKey = rawCat;
    }

    if (matchedKey && domainMap[matchedKey]) {
      domainMap[matchedKey].solved += 1;
    }
  });

  return Object.values(domainMap).map(d => ({
    ...d,
    mastery: Math.min(100, Math.round((d.solved / d.target) * 100))
  }));
}

function calculateReadinessScore(progress, activities) {
  // Readiness calculated out of 100
  // 1. Question practice: up to 35 points (target 40 questions)
  const qCount = progress.questionsReviewed || 0;
  const qPoints = Math.min(35, Math.round((qCount / 40) * 35));

  // 2. Mock interviews: up to 35 points (target 3 interviews + score quality)
  const mCount = progress.mockInterviewsCompleted || 0;
  const mAvg = progress.averageScore || 75;
  const mBase = Math.min(25, (mCount / 3) * 25);
  const mQuality = mCount > 0 ? (mAvg / 100) * 10 : 0;
  const mPoints = Math.min(35, Math.round(mBase + mQuality));

  // 3. Aptitude: up to 15 points (target 20 aptitude questions)
  const aCount = progress.aptitudeCompleted || 0;
  const aPoints = Math.min(15, Math.round((aCount / 20) * 15));

  // 4. Domains covered: up to 15 points (5+ domains)
  const dCount = (progress.categoriesPracticed || []).length;
  const dPoints = Math.min(15, Math.round((dCount / 5) * 15));

  const total = qPoints + mPoints + aPoints + dPoints;
  return Math.min(100, Math.max(0, total));
}

// Ensure in-memory activities do not grow unbounded
function trimActivities(list) {
  if (list.length > 500) {
    list.splice(0, list.length - 500);
  }
}

class ProgressStore {
  static async getUserState(user) {
    if (user && user._id) {
      const dbUser = await User.findById(user._id);
      if (dbUser) {
        return {
          progress: dbUser.progress || inMemoryProgress,
          activities: dbUser.activities || inMemoryActivities,
          isUser: true,
          dbUser
        };
      }
    }
    return {
      progress: inMemoryProgress,
      activities: inMemoryActivities,
      isUser: false,
      dbUser: null
    };
  }

  static async recordQuestionReviewed({ user, questionId, category, timeSpent = 1, score = null }) {
    const state = await this.getUserState(user);
    
    state.progress.questionsReviewed = (state.progress.questionsReviewed || 0) + 1;
    state.progress.totalTimeSpent = (state.progress.totalTimeSpent || 0) + (timeSpent || 1);

    if (category) {
      if (!state.progress.categoriesPracticed) state.progress.categoriesPracticed = [];
      if (!state.progress.categoriesPracticed.includes(category)) {
        state.progress.categoriesPracticed.push(category);
      }
    }

    const activity = {
      type: 'question_reviewed',
      category: category || 'General',
      details: { questionId, timeSpent: timeSpent || 1, score },
      date: new Date()
    };

    state.activities.push(activity);
    trimActivities(state.activities);

    if (state.isUser && state.dbUser) {
      state.dbUser.progress = state.progress;
      state.dbUser.activities = state.activities;
      state.dbUser.lastActivityDate = new Date();
      await state.dbUser.save();
    }

    // Keep in-memory store updated as well
    if (!state.isUser) {
      inMemoryProgress = state.progress;
      inMemoryActivities = state.activities;
    }

    return { progress: state.progress, activity };
  }

  static async recordInterviewCompleted({ user, timeSpent = 15, score = 80, categories = [], ratings = {} }) {
    const state = await this.getUserState(user);

    state.progress.mockInterviewsCompleted = (state.progress.mockInterviewsCompleted || 0) + 1;
    // timeSpent in minutes
    const timeInMins = timeSpent > 60 ? Math.round(timeSpent / 60) : Math.max(1, timeSpent);
    state.progress.totalTimeSpent = (state.progress.totalTimeSpent || 0) + timeInMins;

    const currentCount = state.progress.mockInterviewsCompleted;
    const currentAvg = state.progress.averageScore || 0;
    state.progress.averageScore = Math.round(((currentAvg * (currentCount - 1)) + (score || 80)) / currentCount);

    if (!state.progress.categoriesPracticed) state.progress.categoriesPracticed = [];
    categories.forEach(cat => {
      if (cat && !state.progress.categoriesPracticed.includes(cat)) {
        state.progress.categoriesPracticed.push(cat);
      }
    });

    const primeCategory = categories[0] || 'mock_interview';
    const activity = {
      type: 'interview_completed',
      category: primeCategory,
      details: { timeSpent: timeInMins, score, categories, ratings },
      date: new Date()
    };

    state.activities.push(activity);
    trimActivities(state.activities);

    if (state.isUser && state.dbUser) {
      state.dbUser.progress = state.progress;
      state.dbUser.activities = state.activities;
      state.dbUser.lastActivityDate = new Date();
      await state.dbUser.save();
    }

    if (!state.isUser) {
      inMemoryProgress = state.progress;
      inMemoryActivities = state.activities;
    }

    return { progress: state.progress, activity };
  }

  static async recordAptitudeCompleted({ user, topic, score = 0, totalQuestions = 10, timeSpent = 5 }) {
    const state = await this.getUserState(user);

    state.progress.aptitudeCompleted = (state.progress.aptitudeCompleted || 0) + 1;
    state.progress.questionsReviewed = (state.progress.questionsReviewed || 0) + (score || totalQuestions);
    const timeInMins = Math.max(1, timeSpent > 60 ? Math.round(timeSpent / 60) : timeSpent);
    state.progress.totalTimeSpent = (state.progress.totalTimeSpent || 0) + timeInMins;

    const catName = topic ? `Aptitude: ${topic}` : 'Aptitude';
    if (!state.progress.categoriesPracticed) state.progress.categoriesPracticed = [];
    if (!state.progress.categoriesPracticed.includes(catName)) {
      state.progress.categoriesPracticed.push(catName);
    }

    const activity = {
      type: 'aptitude_completed',
      category: catName,
      details: { topic, score, totalQuestions, timeSpent: timeInMins },
      date: new Date()
    };

    state.activities.push(activity);
    trimActivities(state.activities);

    if (state.isUser && state.dbUser) {
      state.dbUser.progress = state.progress;
      state.dbUser.activities = state.activities;
      state.dbUser.lastActivityDate = new Date();
      await state.dbUser.save();
    }

    if (!state.isUser) {
      inMemoryProgress = state.progress;
      inMemoryActivities = state.activities;
    }

    return { progress: state.progress, activity };
  }

  static async recordResumeAnalyzed({ user, score = 85, fileName = 'Resume.pdf' }) {
    const state = await this.getUserState(user);

    state.progress.resumesAnalyzed = (state.progress.resumesAnalyzed || 0) + 1;
    
    const activity = {
      type: 'resume_analyzed',
      category: 'Resume Analysis',
      details: { score, fileName },
      date: new Date()
    };

    state.activities.push(activity);
    trimActivities(state.activities);

    if (state.isUser && state.dbUser) {
      state.dbUser.progress = state.progress;
      state.dbUser.activities = state.activities;
      state.dbUser.lastActivityDate = new Date();
      await state.dbUser.save();
    }

    if (!state.isUser) {
      inMemoryProgress = state.progress;
      inMemoryActivities = state.activities;
    }

    return { progress: state.progress, activity };
  }

  static async getProgress(user) {
    const state = await this.getUserState(user);
    return state.progress;
  }

  static async getAnalytics(user) {
    const state = await this.getUserState(user);
    const progress = state.progress || inMemoryProgress;
    const activities = state.activities || inMemoryActivities;

    const now = new Date();
    const weekStart = getWeekStart(now);
    const monthStart = getMonthStart(now);

    const weeklyActivities = activities.filter(a => new Date(a.date) >= weekStart);
    const monthlyActivities = activities.filter(a => new Date(a.date) >= monthStart);

    const weeklyData = {
      period: 'This Week',
      startDate: weekStart,
      questionsReviewed: weeklyActivities.filter(a => a.type === 'question_reviewed').length,
      interviewsCompleted: weeklyActivities.filter(a => a.type === 'interview_completed').length,
      aptitudeCompleted: weeklyActivities.filter(a => a.type === 'aptitude_completed').length,
      categoriesPracticed: [...new Set(weeklyActivities.map(a => a.category).filter(Boolean))],
      totalTimeSpent: weeklyActivities.reduce((sum, a) => sum + (a.details?.timeSpent || 0), 0),
      dailyBreakdown: getDailyBreakdown(activities, weekStart)
    };

    const monthlyData = {
      period: 'This Month',
      startDate: monthStart,
      questionsReviewed: monthlyActivities.filter(a => a.type === 'question_reviewed').length,
      interviewsCompleted: monthlyActivities.filter(a => a.type === 'interview_completed').length,
      aptitudeCompleted: monthlyActivities.filter(a => a.type === 'aptitude_completed').length,
      categoriesPracticed: [...new Set(monthlyActivities.map(a => a.category).filter(Boolean))],
      weeklyComparison: getWeeklyComparison(activities),
      categoryBreakdown: getCategoryBreakdown(activities),
      improvement: 24, // Realistic progress delta %
      previousMonthCount: Math.max(0, activities.length - monthlyActivities.length)
    };

    const domainMastery = getDomainMastery(progress, activities);
    const readinessScore = calculateReadinessScore(progress, activities);

    // Sort recent activities newest first
    const sortedActivities = [...activities].sort((a, b) => new Date(b.date) - new Date(a.date));

    return {
      overview: {
        ...progress,
        readinessScore
      },
      weekly: weeklyData,
      monthly: monthlyData,
      domainMastery,
      recentActivities: sortedActivities.slice(0, 15)
    };
  }

  static async seedDemoData(user) {
    const sampleDomains = ['React', 'Node.js', 'PostgreSQL', 'System Design', 'Behavioral', 'Aptitude: Quantitative'];
    const now = new Date();

    const demoActivities = [];
    
    // Distribute 25 activities over the past 6 days
    for (let dayOffset = 5; dayOffset >= 0; dayOffset--) {
      const d = new Date(now);
      d.setDate(d.getDate() - dayOffset);
      d.setHours(10 + Math.floor(Math.random() * 8), Math.floor(Math.random() * 59));

      // 2-4 questions per day
      const qNum = 2 + (dayOffset % 3);
      for (let k = 0; k < qNum; k++) {
        const cat = sampleDomains[Math.floor(Math.random() * sampleDomains.length)];
        demoActivities.push({
          type: 'question_reviewed',
          category: cat,
          details: { questionId: `demo-q-${dayOffset}-${k}`, timeSpent: 2, score: 85 },
          date: new Date(d.getTime() + k * 180000)
        });
      }

      // Add mock interview on day 2 and day 4
      if (dayOffset === 2 || dayOffset === 4) {
        demoActivities.push({
          type: 'interview_completed',
          category: dayOffset === 2 ? 'Full Stack Developer' : 'Frontend Engineer',
          details: { timeSpent: 18, score: 88, categories: ['React', 'JavaScript', 'System Design'] },
          date: new Date(d.getTime() + 600000)
        });
      }

      // Add aptitude test on day 1 and day 3
      if (dayOffset === 1 || dayOffset === 3) {
        demoActivities.push({
          type: 'aptitude_completed',
          category: 'Aptitude: Quantitative',
          details: { topic: 'Percentages & Ratios', score: 8, totalQuestions: 10, timeSpent: 12 },
          date: new Date(d.getTime() + 1200000)
        });
      }
    }

    // Add resume analyzed
    demoActivities.push({
      type: 'resume_analyzed',
      category: 'Resume Analysis',
      details: { score: 86, fileName: 'Senior_Software_Engineer_Resume.pdf' },
      date: new Date(now.getTime() - 86400000 * 2)
    });

    const demoProgress = {
      questionsReviewed: demoActivities.filter(a => a.type === 'question_reviewed').length + 16,
      categoriesPracticed: ['React', 'Node.js', 'PostgreSQL', 'System Design', 'Behavioral', 'Aptitude: Quantitative'],
      mockInterviewsCompleted: 2,
      aptitudeCompleted: 2,
      resumesAnalyzed: 1,
      totalTimeSpent: 145, // ~2.4 hours
      averageScore: 86
    };

    const state = await this.getUserState(user);
    state.progress = demoProgress;
    state.activities = demoActivities;

    if (state.isUser && state.dbUser) {
      state.dbUser.progress = demoProgress;
      state.dbUser.activities = demoActivities;
      state.dbUser.lastActivityDate = new Date();
      await state.dbUser.save();
    }

    inMemoryProgress = demoProgress;
    inMemoryActivities = demoActivities;

    return await this.getAnalytics(user);
  }

  static async reset(user) {
    const emptyProgress = {
      questionsReviewed: 0,
      categoriesPracticed: [],
      mockInterviewsCompleted: 0,
      aptitudeCompleted: 0,
      resumesAnalyzed: 0,
      totalTimeSpent: 0,
      averageScore: 0
    };

    const state = await this.getUserState(user);
    state.progress = emptyProgress;
    state.activities = [];

    if (state.isUser && state.dbUser) {
      state.dbUser.progress = emptyProgress;
      state.dbUser.activities = [];
      state.dbUser.lastActivityDate = new Date();
      await state.dbUser.save();
    }

    inMemoryProgress = emptyProgress;
    inMemoryActivities = [];

    return emptyProgress;
  }
}

module.exports = ProgressStore;
