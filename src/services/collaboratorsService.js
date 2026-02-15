
import { supabase } from '../supabaseClient';

const collaboratorsService = {
  /**
   * Enviar una solicitud de colaboración.
   * Envía el email de notificación vía la API serverless de Vercel (Resend) y,
   * si la tabla existe en Supabase, también guarda el registro en BD.
   */
  submitApplication: async (formData) => {
    // 1. Enviar email de notificación vía Vercel Serverless Function (obligatorio)
    const emailResult = await collaboratorsService.sendNotificationEmail(formData);

    // 2. Intentar guardar en BD (opcional, no bloquea si la tabla no existe)
    try {
      await supabase
        .from('collaborator_applications')
        .insert([{
          nombre: formData.nombre,
          email: formData.email,
          telefono: formData.telefono,
          ano_ingreso: parseInt(formData.anoIngreso),
          disponibilidad: formData.disponibilidad,
          tecnologias: formData.tecnologias,
          niveles_experiencia: formData.nivelesExperiencia,
          motivacion: formData.motivacion
        }]);
    } catch (dbError) {
      // Si falla la BD (tabla no existe, etc.), no bloqueamos - el email ya se envió
      console.warn('No se pudo guardar en BD (la tabla puede no existir aún):', dbError.message);
    }

    return emailResult;
  },

  /**
   * Llama a la Vercel Serverless Function (/api/send-collaborator-email)
   * para enviar el email de notificación vía Resend.
   */
  sendNotificationEmail: async (formData) => {
    const response = await fetch('/api/send-collaborator-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        telefono: formData.telefono,
        anoIngreso: formData.anoIngreso,
        disponibilidad: formData.disponibilidad,
        tecnologias: formData.tecnologias,
        nivelesExperiencia: formData.nivelesExperiencia,
        motivacion: formData.motivacion
      })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.error || 'Error al enviar email');
    }

    return await response.json();
  },

  /**
   * Obtener todas las solicitudes (solo admins autenticados).
   */
  getAll: async () => {
    const { data, error } = await supabase
      .from('collaborator_applications')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) throw error;
    return data;
  },

  /**
   * Actualizar el estado de una solicitud (solo admins).
   */
  updateStatus: async (id, estado, notasAdmin = null) => {
    const updateData = { estado };
    if (notasAdmin !== null) {
      updateData.notas_admin = notasAdmin;
    }

    const { data, error } = await supabase
      .from('collaborator_applications')
      .update(updateData)
      .eq('id', id)
      .select();

    if (error) throw error;
    return data[0];
  },

  /**
   * Eliminar una solicitud (solo admins).
   */
  delete: async (id) => {
    const { error } = await supabase
      .from('collaborator_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default collaboratorsService;
