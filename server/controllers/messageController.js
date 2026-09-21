const pool = require('../config/db');

exports.getMessages = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.userId; // Extracted from auth middleware

  try {
    const result = await pool.query(
      `SELECT * FROM messages 
       WHERE (sender_id = $1 AND receiver_id = $2) 
          OR (sender_id = $2 AND receiver_id = $1)
       ORDER BY created_at ASC`,
      [userId, friendId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error fetching messages' });
  }
};

exports.sendMessage = async (req, res) => {
  const { friendId } = req.params;
  const userId = req.userId;
  const { content, image_url } = req.body;

  if (!content && !image_url) {
    return res.status(400).json({ message: 'Message must have content or image' });
  }

  try {
    // Basic check to see if they are actually friends
    const checkFriendship = await pool.query(
      `SELECT * FROM friendships 
       WHERE ((requester_id = $1 AND addressee_id = $2) OR (requester_id = $2 AND addressee_id = $1)) 
         AND status = 'accepted'`,
      [userId, friendId]
    );

    if (checkFriendship.rows.length === 0) {
      return res.status(403).json({ message: 'You are not friends with this user' });
    }

    const result = await pool.query(
      `INSERT INTO messages (sender_id, receiver_id, content, image_url) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [userId, friendId, content, image_url]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Error sending message' });
  }
};
