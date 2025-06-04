import supabase from './api';

export const getRooms = async () => {
  const { data, error } = await supabase
    .from('rooms')
    .select('*');

  if (error) throw error;
  return data;
};

export const createRoom = async (roomData) => {
  const { data, error } = await supabase
    .from('rooms')
    .insert([roomData]);

  if (error) throw error;
  return data;
};

export const updateRoom = async (roomId, roomData) => {
  const { data, error } = await supabase
    .from('rooms')
    .update(roomData)
    .eq('id', roomId);

  if (error) throw error;
  return data;
};

export const deleteRoom = async (roomId) => {
  const { error } = await supabase
    .from('rooms')
    .delete()
    .eq('id', roomId);

  if (error) throw error;
  return true;
};