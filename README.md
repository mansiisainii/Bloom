#Bloom🌸

**Bloom** is a full-stack personal wellness tracker built with the PERN stack (PostgreSQL, Express, React, Node.js). It brings together habit tracking, nutrition logging with AI-powered food recognition, a smart calendar, journaling, and lightweight social features — all in one clean, theme-able dashboard.

---

## ✨ Features

### 💧 Water Tracker
- Visual glass-by-glass hydration tracker
- Custom daily goals
- Streak tracking with a GitHub-style contribution heatmap
- Shareable/downloadable progress cards

### 🍲 Nutrition
- Snap a photo of your food — powered by **Google Gemini 2.5 Vision** — to auto-detect the dish and estimate calories & macros
- Manual confirm/edit before saving (AI detection isn't always perfect!)
- BMR/TDEE calculation (Mifflin-St Jeor equation) based on age, weight, height, and activity level
- Personalized daily calorie targets based on your goal (lose / maintain / gain)

### 📅 Calendar
- Custom month-grid calendar for important dates — exams, birthdays, appointments, and more
- Optional period/cycle tracking with predictive next-cycle estimates based on your logged history
- Category-based color coding

### ⏰ Alarms
- Daily alarms with custom labels (e.g. "Car wash", "Doctor's appointment")

### 📔 Journal
- Free-form journal entries with mood tagging
- Filter entries by mood
- Full edit/delete support

### 👥 Friends
- Search and connect with other Bloom users
- Send/accept/reject friend requests

### ⚙️ Settings
- Light/dark theme toggle with persisted preference
- Profile management

### 📊 Dashboard
- At-a-glance summary of today's water intake, calories, next event, and active alarms

---

## 🛠️ Tech Stack

**Frontend:** React (Vite), React Router, Tailwind CSS v4, Axios, date-fns, lucide-react, html-to-image

**Backend:** Node.js, Express, PostgreSQL (Neon), JWT authentication, bcrypt

**AI Integration:** Google Gemini 2.5 (Vision) for food recognition

**Deployment:** Vercel (frontend) + Render (backend) + Neon (database)

---

## 🚀 Getting Started

### Prerequisites
- Node.js (v18+)
- A [Neon](https://neon.tech) Postgres database (or any Postgres instance)
- A [Google Gemini API key](https://ai.google.dev/)

### 1. Clone the repo
```bash
git clone https://github.com/mansiisainii/bloom.git
cd bloom
```

### 2. Backend setup
```bash
cd server
npm install
```

Create a `.env` file in `server/`:
```
DATABASE_URL=your_postgres_connection_string
JWT_SECRET=your_random_secret_string
GEMINI_API_KEY=your_gemini_api_key
PORT=5000
CLIENT_URL=http://localhost:5173
```

Run the database schema (see `/server/schema.sql` or the SQL snippets in the setup docs) against your Postgres instance.

```bash
npm run dev
```

### 3. Frontend setup
```bash
cd ../client
npm install
```

Create a `.env` file in `client/`:
```
VITE_API_URL=http://localhost:5000/api
```

```bash
npm run dev
```

Visit `http://localhost:5173` 🌸

---

## 📁 Project Structure

```
bloom/
├── client/                 # React frontend
│   └── src/
│       ├── api/            # Axios API helpers per module
│       ├── components/     # Sidebar, Layout, ProtectedRoute, ProgressCard
│       ├── context/        # AuthContext
│       ├── pages/          # One page per feature module
│       └── utils/          # BMR/TDEE calculator
└── server/                 # Express backend
    ├── config/              # DB connection, Gemini client
    ├── controllers/         # Route logic per module
    ├── middleware/          # JWT auth middleware
    └── routes/               # Express routers per module
```

---

## 🗄️ API Overview

| Module | Base Route | Description |
|---|---|---|
| Auth | `/api/auth` | Signup, login |
| Water | `/api/water` | Daily log, goal, history, streak |
| Nutrition | `/api/nutrition` | Food detection (Gemini), logging |
| Profile | `/api/profile` | BMR/TDEE inputs, cycle-tracking preference |
| Events | `/api/events` | Calendar events & alarms (shared table) |
| Notes | `/api/notes` | Journal entries with mood tags |
| Friends | `/api/friends` | Search, requests, friend list |

All routes except `/api/auth` require a `Bearer` JWT token.

---

## 🎨 Design

Light and dark themes are built with Tailwind v4 CSS-variable tokens (`@theme` block), so the entire palette can be restyled by editing a handful of variables in `index.css`.

---

## 📌 Roadmap / Future Improvements

- Real push notifications for alarms and calendar reminders (Web Push + service worker)
- Shared/combined analytics view across water, nutrition, and mood
- Data export (CSV/PDF)

---

## 👩‍💻 Author

**Mansii** — [GitHub](https://github.com/mansiisainii)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).
