import api from './axios';

export const searchUsers = (q) => api.get('/friends/search', { params: { q } });
export const sendFriendRequest = (addressee_id) => api.post('/friends/request', { addressee_id });
export const respondToRequest = (id, status) => api.put(`/friends/request/${id}`, { status });
export const getFriends = () => api.get('/friends');