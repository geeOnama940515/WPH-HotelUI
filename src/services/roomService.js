import { api } from './api';

export const getRooms = () => api.get('/rooms');

export const createRoom = (roomData) => api.post('/rooms', roomData);

export const updateRoom = (roomId, roomData) => api.put(`/rooms/${roomId}`, roomData);

export const deleteRoom = (roomId) => api.delete(`/rooms/${roomId}`);