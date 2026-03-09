import { supabase } from '../supabaseClient';

const catecService = {
  /**
   * Enviar una postulación al CATEC.
   * Guarda en Supabase y envía emails de notificación vía Vercel Serverless Function (Resend).
   */
  submitApplication: async (formData) => {
    // 1. Enviar emails de notificación vía Vercel Serverless Function (obligatorio)
    const emailResult = await catecService.sendNotificationEmail(formData);

    // 2. Intentar guardar en BD (opcional, no bloquea si la tabla no existe)
    try {
      await supabase
        .from('catec_applications')
        .insert([{
          nombre: formData.nombre,
          email: formData.email,
          legajo: formData.legajo,
          area: formData.area,
          tecnologias: formData.tecnologias,
          portfolio_url: formData.portfolioUrl || null
        }]);
    } catch (dbError) {
      console.warn('No se pudo guardar en BD (la tabla puede no existir aún):', dbError.message);
    }

    return emailResult;
  },

  /**
   * Llama a la Vercel Serverless Function (/api/send-catec-email)
   * para enviar los emails de notificación y confirmación vía Resend.
   */
  sendNotificationEmail: async (formData) => {
    const response = await fetch('/api/send-catec-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        legajo: formData.legajo,
        area: formData.area,
        tecnologias: formData.tecnologias,
        portfolioUrl: formData.portfolioUrl
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al enviar email');
    }

    return await response.json();
  },

  /**
   * Obtener todas las postulaciones (solo admins autenticados).
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('catec_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Actualizar el estado de una postulación (solo admins).
   */
  updateStatus: async (id, estado, notasAdmin = null) => {
    const updateData = { estado };
    if (notasAdmin !== null) {
      updateData.notas_admin = notasAdmin;
    }

    const { data, error } = await supabase
      .from('catec_applications')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Eliminar una postulación (solo admins).
   */
  delete: async (id) => {
    const { error } = await supabase
      .from('catec_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default catecService;
