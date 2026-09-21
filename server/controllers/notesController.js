const pool = require('../config/db');

// Create note
exports.createNote = async (req, res) => {
  const { content, mood } = req.body;

  try {
    const result = await pool.query(
      'INSERT INTO notes (user_id, content, mood) VALUES ($1, $2, $3) RETURNING *',
      [req.userId, content, mood]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all notes (newest first)
exports.getNotes = async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM notes WHERE user_id = $1 ORDER BY created_at DESC',
      [req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update note
exports.updateNote = async (req, res) => {
  const { content, mood } = req.body;

  try {
    const result = await pool.query(
      `UPDATE notes SET content = $1, mood = $2, updated_at = NOW()
       WHERE id = $3 AND user_id = $4 RETURNING *`,
      [content, mood, req.params.id, req.userId]
    );
    if (result.rows.length === 0) return res.status(404).json({ message: 'Note not found' });
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete note
exports.deleteNote = async (req, res) => {
  try {
    await pool.query('DELETE FROM notes WHERE id = $1 AND user_id = $2', [req.params.id, req.userId]);
    res.json({ message: 'Deleted' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};