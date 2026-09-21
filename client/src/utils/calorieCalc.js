// Mifflin-St Jeor Equation
export function calculateBMR({ weight_kg, height_cm, age, gender }) {
  const base = 10 * weight_kg + 6.25 * height_cm - 5 * age;
  return gender === 'male' ? base + 5 : base - 161;
}

const ACTIVITY_MULTIPLIERS = {
  sedentary: 1.2,
  light: 1.375,
  moderate: 1.55,
  active: 1.725,
  very_active: 1.9,
};

export function calculateTDEE(bmr, activity_level) {
  return Math.round(bmr * (ACTIVITY_MULTIPLIERS[activity_level] || 1.55));
}

export function getGoalCalories(tdee, goal) {
  if (goal === 'lose') return tdee - 500;   // ~0.5kg/week deficit
  if (goal === 'gain') return tdee + 500;   // ~0.5kg/week surplus
  return tdee; // maintain
}