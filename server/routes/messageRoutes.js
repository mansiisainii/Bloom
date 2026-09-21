const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { getMessages, sendMessage } = require('../controllers/messageController');

router.get('/:friendId', auth, getMessages);
router.post('/:friendId', auth, sendMessage);

module.exports = router;
