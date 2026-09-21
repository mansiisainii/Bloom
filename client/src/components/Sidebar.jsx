import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Droplet, Soup, CalendarDays, AlarmClock, BookHeart, Users, Settings } from 'lucide-react';

const NAV_ITEMS = [
  { to: '/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
  { to: '/water', icon: Droplet, label: 'Water' },
  { to: '/nutrition', icon: Soup, label: 'Nutrition' },
  { to: '/calendar', icon: CalendarDays, label: 'Calendar' },
  { to: '/alarms', icon: AlarmClock, label: 'Alarms' },
  { to: '/notes', icon: BookHeart, label: 'Journal' },
  { to: '/friends', icon: Users, label: 'Friends' },
  { to: '/settings', icon: Settings, label: 'Settings' },
];

export default function Sidebar() {
  return (
    <aside className="w-56 bg-surface border-r border-border min-h-screen p-4 hidden sm:block">
      <p className="text-primary text-xl font-semibold mb-6 px-2">Bloom 🌸</p>
      <nav className="space-y-1">
        {NAV_ITEMS.map(({ to, icon: Icon, label }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
                isActive ? 'bg-primary text-white' : 'text-text hover:bg-primary-soft'
              }`
            }
          >
            <Icon size={18} />
            {label}
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}

export function MobileNav() {
  const NAV_ITEMS_MOBILE = [
    { to: '/dashboard', icon: LayoutDashboard },
    { to: '/water', icon: Droplet },
    { to: '/calendar', icon: CalendarDays },
    { to: '/notes', icon: BookHeart },
    { to: '/settings', icon: Settings },
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-surface border-t border-border flex justify-around py-2 sm:hidden z-10">
      {NAV_ITEMS_MOBILE.map(({ to, icon: Icon }) => (
        <NavLink
          key={to}
          to={to}
          className={({ isActive }) => `p-2 rounded-lg ${isActive ? 'text-primary' : 'text-text-muted'}`}
        >
          <Icon size={22} />
        </NavLink>
      ))}
    </nav>
  );
}