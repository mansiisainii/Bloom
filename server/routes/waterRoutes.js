const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getTodayLog, updateGlasses, updateGoal, getHistory, getStreak } = require('../controllers/waterController');

router.get('/today', auth, getTodayLog);
router.patch('/update', auth, updateGlasses);
router.patch('/goal', auth, updateGoal);
router.get('/history', auth, getHistory);
router.get('/streak', auth, getStreak);

module.exports = router;