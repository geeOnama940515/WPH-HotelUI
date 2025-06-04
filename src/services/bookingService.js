import supabase from './api';

export const createBooking = async (bookingData) => {
  const { data, error } = await supabase
    .from('bookings')
    .insert([bookingData]);

  if (error) throw error;
  return data;
};

export const getUserBookings = async (userId) => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      rooms (
        name,
        price
      )
    `)
    .eq('user_id', userId);

  if (error) throw error;
  return data;
};

export const updateBookingStatus = async (bookingId, status) => {
  const { data, error } = await supabase
    .from('bookings')
    .update({ status })
    .eq('id', bookingId);

  if (error) throw error;
  return data;
};

export const getAllBookings = async () => {
  const { data, error } = await supabase
    .from('bookings')
    .select(`
      *,
      rooms (
        name,
        price
      ),
      profiles (
        full_name,
        email
      )
    `);

  if (error) throw error;
  return data;
};