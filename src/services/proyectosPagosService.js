import { supabase } from '../supabaseClient';

const proyectosPagosService = {
  /**
   * Enviar una postulación a proyectos pagos.
   * Guarda en Supabase y envía email de confirmación vía Vercel Serverless Function (Resend).
   */
  submitApplication: async (formData) => {
    const tecnologiasConNivel = formData.tecnologias.map((tech) => ({
      tecnologia: tech === 'otros' ? formData.otraTecnologia : tech,
      nivel: formData.nivelesExperiencia[tech] || null,
      esOtra: tech === 'otros'
    }));

    // 1. Enviar email de confirmación vía Vercel Serverless Function (obligatorio)
    const emailResult = await proyectosPagosService.sendConfirmationEmail({
      ...formData,
      tecnologiasConNivel
    });

    // 2. Intentar guardar en BD (opcional, no bloquea si la tabla no existe)
    try {
      const payloadNuevo = {
        nombre: formData.nombre,
        email: formData.email,
        legajo: formData.legajo,
        celular: formData.celular,
        github_url: formData.githubUrl,
        linkedin_url: formData.linkedinUrl,
        area: formData.area,
        tecnologias: tecnologiasConNivel,
        niveles_experiencia: formData.nivelesExperiencia,
        otra_tecnologia: formData.otraTecnologia || null
      };

      const { error } = await supabase
        .from('proyectos_reales_applications')
        .insert([payloadNuevo]);

      if (error) {
        const payloadLegacy = {
          nombre: formData.nombre,
          email: formData.email,
          legajo: formData.legajo,
          area: formData.area,
          tecnologias: tecnologiasConNivel.map(item => `${item.tecnologia} (${item.nivel || 'sin nivel'})`)
        };

        await supabase
          .from('proyectos_reales_applications')
          .insert([payloadLegacy]);
      }
    } catch (dbError) {
      console.warn('No se pudo guardar en BD (la tabla puede no existir aún):', dbError.message);
    }

    return emailResult;
  },

  /**
   * Llama a la Vercel Serverless Function (/api/send-proyectos-pagos-email)
    * para enviar el email de confirmación vía Resend.
   */
  sendConfirmationEmail: async (formData) => {
    const response = await fetch('/api/send-proyectos-pagos-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre: formData.nombre,
        email: formData.email,
        legajo: formData.legajo,
        celular: formData.celular,
        githubUrl: formData.githubUrl,
        linkedinUrl: formData.linkedinUrl,
        area: formData.area,
        tecnologiasConNivel: formData.tecnologiasConNivel
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
      .from('proyectos_reales_applications')
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
      .from('proyectos_reales_applications')
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
      .from('proyectos_reales_applications')
      .delete()
      .eq('id', id);

    if (error) throw error;
    return true;
  }
};

export default proyectosPagosService;
