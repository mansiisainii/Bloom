import api from './axios';

export const getTodayWater = () => api.get('/water/today');
export const updateWaterGlasses = (change) => api.patch('/water/update', { change });
export const updateWaterGoal = (goal) => api.patch('/water/goal', { goal });
export const getWaterHistory = () => api.get('/water/history');
export const getWaterStreak = () => api.get('/water/streak');