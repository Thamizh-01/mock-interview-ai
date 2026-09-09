const express = require('express');
const router = express.Router();
const optionalAuth = require('../middleware/optionalAuth');
const ProgressStore = require('../services/progressStore');

// GET /api/analytics - Get complete dashboard analytics
router.get('/', optionalAuth, async (req, res) => {
  try {
    const analytics = await ProgressStore.getAnalytics(req.user);
    res.json(analytics);
  } catch (err) {
    console.error('Failed to get analytics:', err);
    res.status(500).json({ error: 'Failed to retrieve analytics data' });
  }
});

// POST /api/analytics/seed-demo - Populate demo data for interactive preview
router.post('/seed-demo', optionalAuth, async (req, res) => {
  try {
    const analytics = await ProgressStore.seedDemoData(req.user);
    res.json({ message: 'Demo data seeded successfully', analytics });
  } catch (err) {
    console.error('Failed to seed demo data:', err);
    res.status(500).json({ error: 'Failed to seed demo data' });
  }
});

// GET /api/analytics/history - Historical activities
router.get('/history', optionalAuth, async (req, res) => {
  try {
    const { period = 'month' } = req.query;
    const analytics = await ProgressStore.getAnalytics(req.user);
    const now = new Date();
    let startDate;

    if (period === 'week') {
      startDate = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    } else if (period === 'month') {
      startDate = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    } else if (period === 'year') {
      startDate = new Date(now.getFullYear(), 0, 1);
    } else {
      startDate = new Date(0);
    }

    const filtered = (analytics.recentActivities || []).filter(
      a => new Date(a.date) >= startDate
    );

    res.json({ activities: filtered });
  } catch (err) {
    console.error('Failed to retrieve history:', err);
    res.status(500).json({ error: 'Failed to retrieve history' });
  }
});

module.exports = router;