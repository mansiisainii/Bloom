const pool = require('../config/db');

// Get today's water log (creates one if doesn't exist)
exports.getTodayLog = async (req, res) => {
  try {
    let result = await pool.query(
      'SELECT * FROM water_logs WHERE user_id = $1 AND log_date = CURRENT_DATE',
      [req.userId]
    );

    if (result.rows.length === 0) {
      result = await pool.query(
        'INSERT INTO water_logs (user_id) VALUES ($1) RETURNING *',
        [req.userId]
      );
    }

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update glasses count (+1 or -1)
exports.updateGlasses = async (req, res) => {
  const { change } = req.body;

  try {
    const current = await pool.query(
      'SELECT * FROM water_logs WHERE user_id = $1 AND log_date = CURRENT_DATE',
      [req.userId]
    );

    if (current.rows.length === 0) {
      return res.status(404).json({ message: 'No log found for today' });
    }

    const newGlasses = Math.max(0, current.rows[0].glasses + change);

    const result = await pool.query(
      'UPDATE water_logs SET glasses = $1 WHERE user_id = $2 AND log_date = CURRENT_DATE RETURNING *',
      [newGlasses, req.userId]
    );

    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update daily goal
exports.updateGoal = async (req, res) => {
  const { goal } = req.body;

  try {
    const result = await pool.query(
      'UPDATE water_logs SET goal = $1 WHERE user_id = $2 AND log_date = CURRENT_DATE RETURNING *',
      [goal, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get history (for the contribution heatmap later)
exports.getHistory = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT log_date, glasses, goal FROM water_logs WHERE user_id = $1 ORDER BY log_date DESC LIMIT 90',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get current streak (consecutive days goal was met)
exports.getStreak = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT log_date FROM water_logs WHERE user_id = $1 AND glasses >= goal ORDER BY log_date DESC',
      [req.userId]
    );

    let streak = 0;
    let expectedDate = new Date();

    for (const row of result.rows) {
      const logDate = new Date(row.log_date);
      const diffDays = Math.floor((expectedDate - logDate) / (1000 * 60 * 60 * 24));

      if (diffDays <= 1) {
        streak++;
        expectedDate = logDate;
      } else break;
    }

    res.json({ streak });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};