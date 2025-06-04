import { api } from './api';

export const updateProfile = (profileData) => api.put('/profile', profileData);

export const getProfile = () => api.get('/profile');