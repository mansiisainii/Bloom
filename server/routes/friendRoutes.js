const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { searchUsers, sendRequest, respondRequest, getFriends } = require('../controllers/friendController');

router.get('/search', auth, searchUsers);
router.post('/request', auth, sendRequest);
router.put('/request/:id', auth, respondRequest);
router.get('/', auth, getFriends);

module.exports = router;