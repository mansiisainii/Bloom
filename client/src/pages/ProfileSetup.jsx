import { useState, useEffect } from 'react';
import api from '../api/axios';

export default function ProfileSetup() {
  const [form, setForm] = useState({
    age: '', gender: 'female', weight_kg: '', height_cm: '',
    activity_level: 'moderate', goal: 'maintain', track_periods: true,
  });
  const [saved, setSaved] = useState(false);

  const handleGenderChange = (value) => {
    setForm({ ...form, gender: value, track_periods: value === 'female' });
  };

  useEffect(() => {
    api.get('/profile').then((res) => {
      if (res.data) setForm(res.data);
    });
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    await api.put('/profile', form);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="bg-bg min-h-screen p-8">
      <h1 className="text-primary text-2xl font-semibold mb-6">Your Profile</h1>
      <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-xl p-6 max-w-md space-y-3">
        <input type="number" placeholder="Age" required
          className="w-full p-3 rounded-lg border border-border bg-bg text-text"
          value={form.age} onChange={(e) => setForm({ ...form, age: e.target.value })} />

        <select className="w-full p-3 rounded-lg border border-border bg-bg text-text"
          value={form.gender} onChange={(e) => handleGenderChange(e.target.value)}>
          <option value="female">Female</option>
          <option value="male">Male</option>
        </select>

        <input type="number" placeholder="Weight (kg)" required
          className="w-full p-3 rounded-lg border border-border bg-bg text-text"
          value={form.weight_kg} onChange={(e) => setForm({ ...form, weight_kg: e.target.value })} />

        <input type="number" placeholder="Height (cm)" required
          className="w-full p-3 rounded-lg border border-border bg-bg text-text"
          value={form.height_cm} onChange={(e) => setForm({ ...form, height_cm: e.target.value })} />

        <select className="w-full p-3 rounded-lg border border-border bg-bg text-text"
          value={form.activity_level} onChange={(e) => setForm({ ...form, activity_level: e.target.value })}>
          <option value="sedentary">Sedentary (little/no exercise)</option>
          <option value="light">Light (1-3 days/week)</option>
          <option value="moderate">Moderate (3-5 days/week)</option>
          <option value="active">Active (6-7 days/week)</option>
          <option value="very_active">Very Active (athlete)</option>
        </select>

        <select className="w-full p-3 rounded-lg border border-border bg-bg text-text"
          value={form.goal} onChange={(e) => setForm({ ...form, goal: e.target.value })}>
          <option value="lose">Lose weight</option>
          <option value="maintain">Maintain weight</option>
          <option value="gain">Gain weight</option>
        </select>

        {form.gender === 'female' && (
          <label className="flex items-center gap-2 text-text text-sm">
            <input
              type="checkbox"
              checked={form.track_periods}
              onChange={(e) => setForm({ ...form, track_periods: e.target.checked })}
            />
            Track period/cycle in calendar
          </label>
        )}

        <button type="submit" className="w-full bg-primary text-white py-3 rounded-lg font-medium">
          {saved ? 'Saved ✓' : 'Save Profile'}
        </button>
      </form>
    </div>
  );
}