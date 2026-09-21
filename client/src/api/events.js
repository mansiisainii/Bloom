import api from './axios';
export const predictNextPeriod = () => api.get('/events/predict-period');

export const getEvents = (type) => api.get('/events', { params: type ? { type } : {} });
export const createEvent = (data) => api.post('/events', data);
export const updateEvent = (id, data) => api.put(`/events/${id}`, data);
export const deleteEvent = (id) => api.delete(`/events/${id}`);
export const getUpcomingEvents = () => api.get('/events/upcoming');