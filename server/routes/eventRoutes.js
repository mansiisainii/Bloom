const express = require('express');
const router = express.Router();
const auth = require('../middleware/authMiddleware');
const { createEvent, getEvents, updateEvent, deleteEvent, getUpcoming } = require('../controllers/eventController');

router.post('/', auth, createEvent);
router.get('/', auth, getEvents);
router.get('/upcoming', auth, getUpcoming);
router.put('/:id', auth, updateEvent);
router.delete('/:id', auth, deleteEvent);

module.exports = router;