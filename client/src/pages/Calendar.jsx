import { useState, useEffect } from 'react';
import {
  startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  addDays, format, isSameMonth, isSameDay, addMonths, subMonths,
} from 'date-fns';
import { getEvents, createEvent, deleteEvent, predictNextPeriod } from '../api/events';
import api from '../api/axios';
import { CalendarDays } from 'lucide-react';

export default function Calendar() {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [events, setEvents] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', category: 'other', event_time: '' });
  const [trackPeriods, setTrackPeriods] = useState(false);
  const [prediction, setPrediction] = useState(null);

  const fetchEvents = async () => {
    const res = await getEvents('calendar');
    setEvents(res.data);
  };

  useEffect(() => {
    fetchEvents();
    api.get('/profile').then((res) => {
      if (res.data?.track_periods) {
        setTrackPeriods(true);
        predictNextPeriod().then((r) => setPrediction(r.data));
      }
    });
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createEvent({
      ...form,
      event_type: 'calendar',
      event_date: format(selectedDate, 'yyyy-MM-dd'),
    });
    setForm({ title: '', category: 'other', event_time: '' });
    setShowForm(false);
    fetchEvents();
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchEvents();
  };

  const CATEGORIES = trackPeriods
    ? ['period', 'exam', 'birthday', 'appointment', 'other']
    : ['exam', 'birthday', 'appointment', 'other'];

  // Build grid days
  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const gridStart = startOfWeek(monthStart);
  const gridEnd = endOfWeek(monthEnd);

  const days = [];
  let day = gridStart;
  while (day <= gridEnd) {
    days.push(day);
    day = addDays(day, 1);
  }

  const eventsForDay = (d) => events.filter((e) => isSameDay(new Date(e.event_date), d));
  const selectedDayEvents = eventsForDay(selectedDate);

  return (
    <div className="bg-bg min-h-screen p-8">
      <h1 className="text-primary text-2xl font-semibold mb-6 flex items-center gap-2">
        <CalendarDays size={24} /> Calendar
      </h1>

      {trackPeriods && prediction?.predicted_date && (
        <div className="bg-primary-soft rounded-lg p-3 mb-4 max-w-md text-sm text-text">
          Predicted next period: <strong>{format(new Date(prediction.predicted_date), 'MMM d')}</strong>
          <span className="text-text-muted"> (based on {prediction.based_on_cycle}-day cycle)</span>
        </div>
      )}
      
      <div className="flex gap-6 flex-wrap">
        {/* Calendar grid */}
        <div className="bg-surface border border-border rounded-xl p-6 max-w-md w-full">
          <div className="flex items-center justify-between mb-4">
            <button onClick={() => setCurrentMonth(subMonths(currentMonth, 1))} className="text-text-muted px-2">‹</button>
            <p className="text-text font-medium">{format(currentMonth, 'MMMM yyyy')}</p>
            <button onClick={() => setCurrentMonth(addMonths(currentMonth, 1))} className="text-text-muted px-2">›</button>
          </div>

          <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted mb-2">
            {['S', 'M', 'T', 'W', 'T', 'F', 'S'].map((d, i) => <div key={i}>{d}</div>)}
          </div>

          <div className="grid grid-cols-7 gap-1">
            {days.map((d) => {
              const dayEvents = eventsForDay(d);
              return (
                <button
                  key={d.toISOString()}
                  onClick={() => setSelectedDate(d)}
                  className={`aspect-square rounded-lg text-sm flex flex-col items-center justify-center relative
                    ${!isSameMonth(d, currentMonth) ? 'text-text-muted opacity-40' : 'text-text'}
                    ${isSameDay(d, selectedDate) ? 'bg-primary text-white' : 'hover:bg-primary-soft'}
                  `}
                >
                  {format(d, 'd')}
                  {dayEvents.length > 0 && (
                    <span className={`w-1 h-1 rounded-full mt-0.5 ${isSameDay(d, selectedDate) ? 'bg-white' : 'bg-primary'}`} />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Selected day events */}
        <div className="bg-surface border border-border rounded-xl p-6 max-w-sm w-full">
          <div className="flex items-center justify-between mb-4">
            <p className="text-text font-medium">{format(selectedDate, 'EEEE, MMM d')}</p>
            <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium">
              + Add
            </button>
          </div>

          {showForm && (
            <form onSubmit={handleAdd} className="mb-4 space-y-2">
              <input
                type="text" placeholder="Event title" required
                className="w-full p-2 rounded-lg border border-border bg-bg text-text text-sm"
                value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
              />
              <select
                className="w-full p-2 rounded-lg border border-border bg-bg text-text text-sm"
                value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
              >
                {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
              </select>
              <input
                type="time"
                className="w-full p-2 rounded-lg border border-border bg-bg text-text text-sm"
                value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })}
              />
              <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg text-sm">Save</button>
            </form>
          )}

          {selectedDayEvents.length === 0 && !showForm && (
            <p className="text-text-muted text-sm">No events on this day.</p>
          )}

          <div className="space-y-2">
            {selectedDayEvents.map((e) => (
              <div key={e.id} className="bg-primary-soft rounded-lg p-3 flex justify-between items-center">
                <div>
                  <p className="text-text text-sm font-medium">{e.title}</p>
                  <p className="text-text-muted text-xs">{e.category} {e.event_time && `· ${e.event_time}`}</p>
                </div>
                <button onClick={() => handleDelete(e.id)} className="text-danger text-xs">✕</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}