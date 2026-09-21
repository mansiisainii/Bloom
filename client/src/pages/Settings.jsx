import { useState, useEffect } from 'react';
import { Sun, Moon, Settings as SettingsIcon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export default function Settings() {
  const [isDark, setIsDark] = useState(false);
  const { user } = useAuth();

  useEffect(() => {
    const saved = localStorage.getItem('theme');
    const dark = saved === 'dark';
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  const toggleTheme = () => {
    const newDark = !isDark;
    setIsDark(newDark);
    document.documentElement.classList.toggle('dark', newDark);
    localStorage.setItem('theme', newDark ? 'dark' : 'light');
  };

  return (
    <div className="bg-bg min-h-screen p-8">
      <h1 className="text-primary text-2xl font-semibold mb-6 flex items-center gap-2">
        <SettingsIcon size={24} /> Settings
      </h1>

      <div className="bg-surface border border-border rounded-xl p-6 max-w-md space-y-4">
        <div>
          <p className="text-text-muted text-xs mb-1">Name</p>
          <p className="text-text">{user?.name}</p>
        </div>
        <div>
          <p className="text-text-muted text-xs mb-1">Email</p>
          <p className="text-text">{user?.email}</p>
        </div>

        <div className="flex items-center justify-between pt-2 border-t border-border">
          <p className="text-text">Dark mode</p>
          <button
            onClick={toggleTheme}
            className="w-14 h-8 rounded-full bg-primary-soft relative transition-colors flex items-center px-1"
          >
            <div
              className={`w-6 h-6 rounded-full bg-primary flex items-center justify-center text-white transition-transform ${
                isDark ? 'translate-x-6' : 'translate-x-0'
              }`}
            >
              {isDark ? <Moon size={12} /> : <Sun size={12} />}
            </div>
          </button>
        </div>
      </div>
    </div>
  );
}