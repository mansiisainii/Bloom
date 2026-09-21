const express = require('express');
const cors = require('cors');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

app.use(cors({
  origin: [process.env.CLIENT_URL || 'http://localhost:5173'],
  credentials: true,
}));

// Routes
const authRoutes = require('./routes/authRoutes');
app.use('/api/auth', authRoutes);

const waterRoutes = require('./routes/waterRoutes');
app.use('/api/water', waterRoutes);

const nutritionRoutes = require('./routes/nutritionRoutes');
app.use('/api/nutrition', nutritionRoutes);

const profileRoutes = require('./routes/profileRoutes');
app.use('/api/profile', profileRoutes);

const eventRoutes = require('./routes/eventRoutes');
app.use('/api/events', eventRoutes);

const notesRoutes = require('./routes/notesRoutes');
app.use('/api/notes', notesRoutes);

const friendRoutes = require('./routes/friendRoutes');
app.use('/api/friends', friendRoutes);

app.get('/', (req, res) => {
  res.send('Bloom API running 🌸');
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));