import api from './axios';

export const detectFood = (formData) =>
  api.post('/nutrition/detect', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

export const addNutritionLog = (data) => api.post('/nutrition/log', data);
export const getTodayNutrition = () => api.get('/nutrition/today');
export const deleteNutritionLog = (id) => api.delete(`/nutrition/log/${id}`);