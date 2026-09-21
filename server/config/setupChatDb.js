const pool = require('./db');

const setupChatDb = async () => {
  try {
    const createTableQuery = `
      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        sender_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        receiver_id INTEGER NOT NULL REFERENCES users(id) ON DELETE CASCADE,
        content TEXT,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `;
    
    await pool.query(createTableQuery);
    console.log('✅ Messages table created or already exists.');
  } catch (err) {
    console.error('❌ Error creating messages table:', err);
  } finally {
    pool.end();
  }
};

setupChatDb();
