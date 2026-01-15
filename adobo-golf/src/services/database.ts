import { createSupabaseClient } from './supabase';
import type { Player, Series, Event, Result, Photo } from '../types/database';

const supabase = createSupabaseClient();

// Players
export const getPlayers = async () => {
  const { data, error } = await supabase
    .from('players')
    .select('*')
    .order('name');
  return { data, error };
};

export const createPlayer = async (player: Omit<Player, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('players')
    .insert([player])
    .select();
  return { data, error };
};

export const updatePlayer = async (id: number, player: Partial<Omit<Player, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('players')
    .update(player)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deletePlayer = async (id: number) => {
  const { error } = await supabase
    .from('players')
    .delete()
    .eq('id', id);
  return { error };
};

// Series
export const getSeries = async () => {
  const { data, error } = await supabase
    .from('series')
    .select('*')
    .order('start_at', { ascending: false });
  return { data, error };
};

export const createSeries = async (series: Omit<Series, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('series')
    .insert([series])
    .select();
  return { data, error };
};

export const updateSeries = async (id: number, series: Partial<Omit<Series, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('series')
    .update(series)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteSeries = async (id: number) => {
  const { error } = await supabase
    .from('series')
    .delete()
    .eq('id', id);
  return { error };
};

// Events
export const getEvents = async () => {
  const { data, error } = await supabase
    .from('events')
    .select(`
      *,
      series:series_id (
        id,
        name
      )
    `)
    .order('start_at', { ascending: false });
  return { data, error };
};

export const createEvent = async (event: Omit<Event, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('events')
    .insert([event])
    .select();
  return { data, error };
};

export const updateEvent = async (id: number, event: Partial<Omit<Event, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('events')
    .update(event)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteEvent = async (id: number) => {
  const { error } = await supabase
    .from('events')
    .delete()
    .eq('id', id);
  return { error };
};

// Results
export const getResults = async () => {
  const { data, error } = await supabase
    .from('results')
    .select(`
      *,
      player:player_id (
        id,
        name
      ),
      event:event_id (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createResult = async (result: Omit<Result, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('results')
    .insert([result])
    .select();
  return { data, error };
};

export const updateResult = async (id: number, result: Partial<Omit<Result, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('results')
    .update(result)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deleteResult = async (id: number) => {
  const { error } = await supabase
    .from('results')
    .delete()
    .eq('id', id);
  return { error };
};

// Photos
export const getPhotos = async () => {
  const { data, error } = await supabase
    .from('photos')
    .select(`
      *,
      event:event_id (
        id,
        name
      )
    `)
    .order('created_at', { ascending: false });
  return { data, error };
};

export const createPhoto = async (photo: Omit<Photo, 'id' | 'created_at'>) => {
  const { data, error } = await supabase
    .from('photos')
    .insert([photo])
    .select();
  return { data, error };
};

export const updatePhoto = async (id: number, photo: Partial<Omit<Photo, 'id' | 'created_at'>>) => {
  const { data, error } = await supabase
    .from('photos')
    .update(photo)
    .eq('id', id)
    .select();
  return { data, error };
};

export const deletePhoto = async (id: number) => {
  const { error } = await supabase
    .from('photos')
    .delete()
    .eq('id', id);
  return { error };
};
