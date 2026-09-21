const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon needs this
});

pool.connect()
  .then(() => console.log('✅ Connected to Postgres (Neon)'))
  .catch((err) => console.error('❌ DB connection error:', err));

module.exports = pool;