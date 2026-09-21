const pool = require('../config/db');

// Search users by email/name (to send request)
exports.searchUsers = async (req, res) => {
  const { q } = req.query;

  try {
    const result = await pool.query(
      `SELECT id, name, email FROM users
       WHERE (name ILIKE $1 OR email ILIKE $1) AND id != $2 LIMIT 10`,
      [`%${q}%`, req.userId]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Send friend request
exports.sendRequest = async (req, res) => {
  const { addressee_id } = req.body;

  try {
    const result = await pool.query(
      `INSERT INTO friendships (requester_id, addressee_id, status)
       VALUES ($1, $2, 'pending') RETURNING *`,
      [req.userId, addressee_id]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    if (err.code === '23505') return res.status(400).json({ message: 'Request already sent' });
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Accept/reject request
exports.respondRequest = async (req, res) => {
  const { status } = req.body; // 'accepted' or 'rejected'

  try {
    if (status === 'rejected') {
      await pool.query('DELETE FROM friendships WHERE id = $1 AND addressee_id = $2', [req.params.id, req.userId]);
      return res.json({ message: 'Rejected' });
    }

    const result = await pool.query(
      `UPDATE friendships SET status = 'accepted' WHERE id = $1 AND addressee_id = $2 RETURNING *`,
      [req.params.id, req.userId]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get friends list + pending requests
exports.getFriends = async (req, res) => {
  try {
    const friends = await pool.query(
      `SELECT f.id, u.id as friend_id, u.name, u.email
       FROM friendships f
       JOIN users u ON u.id = CASE WHEN f.requester_id = $1 THEN f.addressee_id ELSE f.requester_id END
       WHERE (f.requester_id = $1 OR f.addressee_id = $1) AND f.status = 'accepted'`,
      [req.userId]
    );

    const pendingReceived = await pool.query(
      `SELECT f.id, u.id as user_id, u.name, u.email
       FROM friendships f JOIN users u ON u.id = f.requester_id
       WHERE f.addressee_id = $1 AND f.status = 'pending'`,
      [req.userId]
    );

    res.json({ friends: friends.rows, pendingReceived: pendingReceived.rows });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};