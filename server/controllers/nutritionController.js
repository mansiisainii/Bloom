const pool = require('../config/db');
const { detectFood } = require('../config/gemini');

// Detect food from uploaded image
exports.detectFromImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: 'No image uploaded' });
    }

    const base64Image = req.file.buffer.toString('base64');
    const detected = await detectFood(base64Image, req.file.mimetype);

    if (detected.error) {
      return res.status(400).json({ message: detected.error });
    }

    res.json(detected); // frontend confirms before saving
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to detect food' });
  }
};

// Save confirmed food log
exports.addLog = async (req, res) => {
  const { food_name, calories, protein, carbs, fat } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO nutrition_logs (user_id, food_name, calories, protein, carbs, fat)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [req.userId, food_name, calories, protein, carbs, fat]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get today's logs + total calories
exports.getTodayLogs = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM nutrition_logs WHERE user_id = $1 AND log_date = CURRENT_DATE ORDER BY created_at DESC',
      [req.userId]
    );
    const totalCalories = result.rows.reduce((sum, row) => sum + row.calories, 0);
    res.json({ logs: result.rows, totalCalories });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a log
exports.deleteLog = async (req, res) => {
  try {
    await pool.query('DELETE FROM nutrition_logs WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};