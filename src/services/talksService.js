
import { supabase } from '../supabaseClient';

const talksService = {
  getAll: async () => {
    const { data, error } = await supabase
      .from('talks')
      .select('*')
      .order('date', { ascending: false });

    if (error) throw error;
    return data;
  },

  create: async (talkData) => {
    const { data, error } = await supabase
      .from('talks')
      .insert([talkData])
      .select();

    if (error) throw error;
    return data[0];
  },

  update: async (id, talkData) => {
    const { data, error } = await supabase
      .from('talks')
      .update(talkData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  delete: async (id) => {
    const { error } = await supabase
      .from('talks')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default talksService;
