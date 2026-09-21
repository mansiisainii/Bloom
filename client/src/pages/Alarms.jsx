import { useState, useEffect } from 'react';
import { getEvents, createEvent, deleteEvent } from '../api/events';
import { AlarmClock } from 'lucide-react';

export default function Alarms() {
  const [alarms, setAlarms] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: '', event_time: '', label: '' });

  const fetchAlarms = async () => {
    const res = await getEvents('alarm');
    setAlarms(res.data);
  };

  useEffect(() => {
    fetchAlarms();
  }, []);

  const handleAdd = async (e) => {
    e.preventDefault();
    await createEvent({
      ...form,
      event_type: 'alarm',
      event_date: new Date().toISOString().split('T')[0], // alarms repeat daily, date not critical
    });
    setForm({ title: '', event_time: '', label: '' });
    setShowForm(false);
    fetchAlarms();
  };

  const handleDelete = async (id) => {
    await deleteEvent(id);
    fetchAlarms();
  };

  return (
    <div className="bg-bg min-h-screen p-8">
      <div className="flex items-center justify-between mb-6 max-w-md">
        <h1 className="text-primary text-2xl font-semibold flex items-center gap-2">
          <AlarmClock size={24} /> Alarms
        </h1>
        <button onClick={() => setShowForm(!showForm)} className="text-primary text-sm font-medium">
          + New Alarm
        </button>
      </div>

      {showForm && (
        <form onSubmit={handleAdd} className="bg-surface border border-border rounded-xl p-4 max-w-md mb-4 space-y-2">
          <input
            type="time" required
            className="w-full p-2 rounded-lg border border-border bg-bg text-text text-sm"
            value={form.event_time} onChange={(e) => setForm({ ...form, event_time: e.target.value })}
          />
          <input
            type="text" placeholder="Title (e.g. Car wash)" required
            className="w-full p-2 rounded-lg border border-border bg-bg text-text text-sm"
            value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })}
          />
          <input
            type="text" placeholder="Label (e.g. Chore, Health)"
            className="w-full p-2 rounded-lg border border-border bg-bg text-text text-sm"
            value={form.label} onChange={(e) => setForm({ ...form, label: e.target.value })}
          />
          <button type="submit" className="w-full bg-primary text-white py-2 rounded-lg text-sm">Save Alarm</button>
        </form>
      )}

      <div className="max-w-md space-y-3">
        {alarms.length === 0 && <p className="text-text-muted text-sm">No alarms set yet.</p>}
        {alarms.map((a) => (
          <div key={a.id} className="bg-surface border border-border rounded-xl p-4 flex justify-between items-center">
            <div>
              <p className="text-text text-xl font-semibold">{a.event_time?.slice(0, 5)}</p>
              <p className="text-text-muted text-sm">{a.title}</p>
              {a.label && (
                <span className="inline-block mt-1 bg-primary-soft text-primary text-xs px-2 py-0.5 rounded-full">
                  {a.label}
                </span>
              )}
            </div>
            <button onClick={() => handleDelete(a.id)} className="text-danger text-sm">Delete</button>
          </div>
        ))}
      </div>
    </div>
  );
}