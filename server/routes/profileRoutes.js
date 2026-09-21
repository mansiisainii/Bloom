const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getProfile, upsertProfile } = require('../controllers/profileController');

router.get('/', auth, getProfile);
router.put('/', auth, upsertProfile);

module.exports = router;