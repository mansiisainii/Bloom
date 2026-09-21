import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { getTodayWater, getWaterStreak } from '../api/water';
import { getTodayNutrition } from '../api/nutrition';
import { getUpcomingEvents } from '../api/events';
import { getEvents } from '../api/events';
import { Droplet, Soup, CalendarDays, AlarmClock, LogOut } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [water, setWater] = useState(null);
  const [streak, setStreak] = useState(0);
  const [calories, setCalories] = useState(0);
  const [upcoming, setUpcoming] = useState([]);
  const [todayAlarms, setTodayAlarms] = useState([]);

  useEffect(() => {
    getTodayWater().then((res) => setWater(res.data));
    getWaterStreak().then((res) => setStreak(res.data.streak));
    getTodayNutrition().then((res) => setCalories(res.data.totalCalories));
    getUpcomingEvents().then((res) => setUpcoming(res.data.slice(0, 3)));
    getEvents('alarm').then((res) => setTodayAlarms(res.data.slice(0, 3)));
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <div className="bg-bg min-h-screen p-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-primary text-2xl font-semibold">Good day, {user?.name} 🌸</h1>
        <button onClick={handleLogout} className="text-danger text-sm flex items-center gap-1">
          <LogOut size={14} /> Logout
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {/* Water card */}
        <Link to="/water" className="bg-surface border border-border rounded-xl p-4 hover:border-primary transition-colors">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Droplet size={18} /> <span className="text-sm text-text-muted">Water</span>
          </div>
          <p className="text-text text-xl font-semibold">{water ? `${water.glasses}/${water.goal}` : '—'}</p>
          <p className="text-text-muted text-xs">{streak} day streak</p>
        </Link>

        {/* Nutrition card */}
        <Link to="/nutrition" className="bg-surface border border-border rounded-xl p-4 hover:border-primary transition-colors">
          <div className="flex items-center gap-2 text-primary mb-2">
            <Soup size={18} /> <span className="text-sm text-text-muted">Calories</span>
          </div>
          <p className="text-text text-xl font-semibold">{calories} kcal</p>
          <p className="text-text-muted text-xs">today</p>
        </Link>

        {/* Next event card */}
        <Link to="/calendar" className="bg-surface border border-border rounded-xl p-4 hover:border-primary transition-colors">
          <div className="flex items-center gap-2 text-primary mb-2">
            <CalendarDays size={18} /> <span className="text-sm text-text-muted">Next Event</span>
          </div>
          <p className="text-text text-sm font-medium">{upcoming[0]?.title || 'Nothing upcoming'}</p>
          <p className="text-text-muted text-xs">{upcoming[0]?.event_date || ''}</p>
        </Link>

        {/* Alarms card */}
        <Link to="/alarms" className="bg-surface border border-border rounded-xl p-4 hover:border-primary transition-colors">
          <div className="flex items-center gap-2 text-primary mb-2">
            <AlarmClock size={18} /> <span className="text-sm text-text-muted">Alarms</span>
          </div>
          <p className="text-text text-xl font-semibold">{todayAlarms.length}</p>
          <p className="text-text-muted text-xs">active</p>
        </Link>
      </div>

      {/* Upcoming events list */}
      {upcoming.length > 0 && (
        <div className="bg-surface border border-border rounded-xl p-6 max-w-md">
          <p className="text-text font-medium mb-3">Upcoming this week</p>
          <div className="space-y-2">
            {upcoming.map((e) => (
              <div key={e.id} className="flex justify-between text-sm">
                <span className="text-text">{e.title}</span>
                <span className="text-text-muted">{e.event_date}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}