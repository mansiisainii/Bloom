const pool = require('../config/db');

// Get profile
exports.getProfile = async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM user_profile WHERE user_id = $1', [req.userId]);
    res.json(result.rows[0] || null);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Create/update profile
exports.upsertProfile = async (req, res) => {
  const { age, gender, weight_kg, height_cm, activity_level, goal, track_periods } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO user_profile (user_id, age, gender, weight_kg, height_cm, activity_level, goal, track_periods)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
       ON CONFLICT (user_id)
       DO UPDATE SET age=$2, gender=$3, weight_kg=$4, height_cm=$5, activity_level=$6, goal=$7, track_periods=$8
       RETURNING *`,
      [req.userId, age, gender, weight_kg, height_cm, activity_level, goal, track_periods]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};