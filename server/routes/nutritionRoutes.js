const express = require('express');
const router = express.Router();
const multer = require('multer');
const auth = require('../middleware/authMiddleware');
const { detectFromImage, addLog, getTodayLogs, deleteLog } = require('../controllers/nutritionController');

const upload = multer({ storage: multer.memoryStorage(), limits: { fileSize: 5 * 1024 * 1024 } });

router.post('/detect', auth, upload.single('image'), detectFromImage);
router.post('/log', auth, addLog);
router.get('/today', auth, getTodayLogs);
router.delete('/log/:id', auth, deleteLog);

module.exports = router;