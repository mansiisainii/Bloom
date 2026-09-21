const pool = require('../config/db');

// Create event/alarm
exports.createEvent = async (req, res) => {
  const { title, event_type, category, event_date, event_time, is_recurring, recurrence_days, label } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO events (user_id, title, event_type, category, event_date, event_time, is_recurring, recurrence_days, label)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9) RETURNING *`,
      [req.userId, title, event_type, category, event_date, event_time, is_recurring || false, recurrence_days, label]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all events (optionally filter by type)
exports.getEvents = async (req, res) => {
  const { type } = req.query;

  try {
    let query = 'SELECT * FROM events WHERE user_id = $1';
    const params = [req.userId];

    if (type) {
      query += ' AND event_type = $2';
      params.push(type);
    }

    query += ' ORDER BY event_date ASC, event_time ASC';

    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update event
exports.updateEvent = async (req, res) => {
  const { title, category, event_date, event_time, is_recurring, recurrence_days, label } = req.body;

  try {
    const result = await pool.query(
      `UPDATE events SET title=$1, category=$2, event_date=$3, event_time=$4, is_recurring=$5, recurrence_days=$6, label=$7
       WHERE id=$8 AND user_id=$9 RETURNING *`,
      [title, category, event_date, event_time, is_recurring, recurrence_days, label, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Event not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete event
exports.deleteEvent = async (req, res) => {
  try {
    await pool.query('DELETE FROM events WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get upcoming events (next 7 days) — for dashboard/notifications
exports.getUpcoming = async (req, res) => {
  try {
    const result = await pool.query(
      `SELECT * FROM events WHERE user_id = $1 AND event_date BETWEEN CURRENT_DATE AND CURRENT_DATE + INTERVAL '7 days'
       ORDER BY event_date ASC`,
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};