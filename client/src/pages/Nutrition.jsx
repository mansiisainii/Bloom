import { useState, useEffect, useRef } from 'react';
import { detectFood, addNutritionLog, getTodayNutrition, deleteNutritionLog } from '../api/nutrition';
import { calculateBMR, calculateTDEE, getGoalCalories } from '../utils/calorieCalc';
import api from '../api/axios';
import { Soup, Camera } from 'lucide-react';

export default function Nutrition() {
  const [logs, setLogs] = useState([]);
  const [totalCalories, setTotalCalories] = useState(0);
  const [preview, setPreview] = useState(null);
  const [detecting, setDetecting] = useState(false);
  const [detected, setDetected] = useState(null);
  const [error, setError] = useState('');
  const [goalCalories, setGoalCalories] = useState(null);
  const fileInputRef = useRef();

  const fetchLogs = async () => {
    const res = await getTodayNutrition();
    setLogs(res.data.logs);
    setTotalCalories(res.data.totalCalories);
  };

  useEffect(() => {
    fetchLogs();
    api.get('/profile').then((res) => {
      if (res.data) {
        const bmr = calculateBMR(res.data);
        const tdee = calculateTDEE(bmr, res.data.activity_level);
        setGoalCalories(getGoalCalories(tdee, res.data.goal));
      }
    });
  }, []);

  const handleFileSelect = async (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setPreview(URL.createObjectURL(file));
    setDetected(null);
    setError('');
    setDetecting(true);

    const formData = new FormData();
    formData.append('image', file);

    try {
      const res = await detectFood(formData);
      setDetected(res.data);
    } catch (err) {
      setError(err.response?.data?.message || 'Could not detect food');
    } finally {
      setDetecting(false);
    }
  };

  const handleConfirm = async () => {
    try {
      await addNutritionLog(detected);
      setDetected(null);
      setPreview(null);
      fetchLogs();
    } catch (err) {
      setError('Failed to save log');
    }
  };

  const handleDelete = async (id) => {
    await deleteNutritionLog(id);
    fetchLogs();
  };

  return (
    <div className="bg-bg min-h-screen p-8">
     <button onClick={() => fileInputRef.current.click()} className="w-full bg-primary text-white py-3 rounded-lg font-medium flex items-center justify-center gap-2">
  <Camera size={18} /> Snap Food
</button>

      <div className="bg-surface border border-border rounded-xl p-6 max-w-md mb-6">
        <p className="text-text-muted text-sm mb-2">Today's total</p>
        <p className="text-text text-3xl font-semibold mb-4">{totalCalories} kcal</p>

        {goalCalories && (
          <p className="text-text-muted text-sm mt-1 mb-4">
            Goal: {goalCalories} kcal · {totalCalories > goalCalories ? `${totalCalories - goalCalories} over` : `${goalCalories - totalCalories} remaining`}
          </p>
        )}

        <input
          type="file"
          accept="image/*"
          capture="environment"
          ref={fileInputRef}
          onChange={handleFileSelect}
          className="hidden"
        />
        <button
          onClick={() => fileInputRef.current.click()}
          className="w-full bg-primary text-white py-3 rounded-lg font-medium"
        >
          📸 Snap Food
        </button>

        {preview && (
          <img src={preview} alt="preview" className="w-full h-40 object-cover rounded-lg mt-4" />
        )}

        {detecting && <p className="text-text-muted text-sm mt-3">Detecting...</p>}
        {error && <p className="text-danger text-sm mt-3">{error}</p>}

        {detected && (
          <div className="mt-4 bg-primary-soft rounded-lg p-4">
            <p className="text-text font-medium">{detected.food_name}</p>
            <p className="text-text-muted text-sm">
              {detected.calories} kcal · P {detected.protein}g · C {detected.carbs}g · F {detected.fat}g
            </p>
            <div className="flex gap-2 mt-3">
              <button onClick={() => { setDetected(null); setPreview(null); }} className="flex-1 bg-border text-text py-2 rounded-lg text-sm">
                Discard
              </button>
              <button onClick={handleConfirm} className="flex-1 bg-primary text-white py-2 rounded-lg text-sm">
                Confirm & Save
              </button>
            </div>
          </div>
        )}
      </div>

      <div className="max-w-md space-y-3">
        {logs.map((log) => (
          <div key={log.id} className="bg-surface border border-border rounded-lg p-4 flex justify-between items-center">
            <div>
              <p className="text-text font-medium">{log.food_name}</p>
              <p className="text-text-muted text-sm">{log.calories} kcal</p>
            </div>
            <button onClick={() => handleDelete(log.id)} className="text-danger text-sm">
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}