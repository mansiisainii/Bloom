import api from './axios';

export const getMessages = (friendId) => api.get(`/messages/${friendId}`);
export const sendMessage = (friendId, messageData) => api.post(`/messages/${friendId}`, messageData);
