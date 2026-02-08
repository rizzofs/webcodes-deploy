
import { supabase } from '../supabaseClient';

const activitiesService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('activities')
      .select('*')
      .order('date', { ascending: true }); // Próximas actividades primero? O al revés? Definamos próximas

    if (error) throw error;
    return data;
  },

  create: async (activityData) => {
    const { data, error } = await supabase
      .from('activities')
      .insert([activityData])
      .select();

    if (error) throw error;
    return data[0];
  },

  update: async (id, activityData) => {
    const { data, error } = await supabase
      .from('activities')
      .update(activityData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('activities')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default activitiesService;
