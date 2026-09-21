import { useState, useEffect } from 'react';
import { getTodayWater, updateWaterGlasses, updateWaterGoal, getWaterStreak } from '../api/water';
import { Droplet } from 'lucide-react';
import ProgressCard from '../components/ProgressCard';

export default function WaterTracker() {
  const [log, setLog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editingGoal, setEditingGoal] = useState(false);
  const [goalInput, setGoalInput] = useState(8);
  const [streak, setStreak] = useState(0);

  const fetchLog = async () => {
    try {
      const res = await getTodayWater();
      setLog(res.data);
      setGoalInput(res.data.goal);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLog();
    getWaterStreak().then((res) => setStreak(res.data.streak));
  }, []);

  const handleChange = async (change) => {
    try {
      const res = await updateWaterGlasses(change);
      setLog(res.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleGoalSave = async () => {
    try {
      const res = await updateWaterGoal(Number(goalInput));
      setLog(res.data);
      setEditingGoal(false);
    } catch (err) {
      console.error(err);
    }
  };

  if (loading) return <div className="p-8 text-text">Loading...</div>;

  const percentage = Math.min(100, Math.round((log.glasses / log.goal) * 100));

  return (
    <div className="bg-bg min-h-screen p-8">
      <div className="flex items-center justify-between mb-6 max-w-md">
        <h1 className="text-primary text-2xl font-semibold flex items-center gap-2">
          <Droplet size={24} /> Water Tracker
        </h1>
        {editingGoal ? (
          <div className="flex items-center gap-2">
            <input
              type="number"
              min="1"
              value={goalInput}
              onChange={(e) => setGoalInput(e.target.value)}
              className="w-16 p-2 rounded-lg border border-border bg-surface text-text text-sm"
            />
            <button onClick={handleGoalSave} className="text-primary text-sm font-medium">
              Save
            </button>
          </div>
        ) : (
          <button
            onClick={() => setEditingGoal(true)}
            className="text-text-muted text-sm underline"
          >
            Edit goal
          </button>
        )}
      </div>

      <div className="bg-surface border border-border rounded-xl p-6 max-w-md">
        <p className="text-text-muted text-sm mb-2">{percentage}% of daily goal</p>

        <div className="flex flex-wrap gap-3 mb-6">
          {Array.from({ length: log.goal }).map((_, i) => (
            <div
              key={i}
              className={`w-10 h-14 rounded-b-lg border-2 flex items-end justify-center transition-colors ${
                i < log.glasses ? 'bg-primary border-primary' : 'bg-bg border-border'
              }`}
            >
              <span className="text-xs mb-1 text-white">
                {i < log.glasses && <Droplet size={14} className="text-white" fill="white" />}
              </span>
            </div>
          ))}
        </div>

        <p className="text-text text-lg font-medium mb-4">
          {log.glasses} / {log.goal} glasses
        </p>

        <div className="flex gap-3">
          <button onClick={() => handleChange(-1)} className="flex-1 bg-border text-text py-3 rounded-lg font-medium">
            − Remove
          </button>
          <button onClick={() => handleChange(1)} className="flex-1 bg-primary text-white py-3 rounded-lg font-medium">
            + Add Glass
          </button>
        </div>
      </div>

      <div className="mt-6">
        <ProgressCard streak={streak} glasses={log.glasses} goal={log.goal} />
      </div>
    </div>
  );
}