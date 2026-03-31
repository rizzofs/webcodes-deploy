import { supabase } from '../supabaseClient';

const proyectosRealesService = {
  /**
   * Enviar una postulación a proyectos reales.
   * Guarda en Supabase y envía email de confirmación vía Vercel Serverless Function (Resend).
   */
  submitApplication: async (formData) => {
    const tecnologiasConNivel = formData.tecnologias.map((tech) => ({
      tecnologia: tech === 'otros' ? formData.otraTecnologia : tech,
      nivel: formData.nivelesExperiencia[tech] || null,
      esOtra: tech === 'otros'
    }));

    // 1. Guardar en BD (Obligatorio para no perder el dato si falla el email)
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
      console.warn('Fallo payload nuevo, intentando legacy:', error);
      const payloadLegacy = {
        nombre: formData.nombre,
        email: formData.email,
        legajo: formData.legajo,
        area: formData.area,
        tecnologias: tecnologiasConNivel.map(item => `${item.tecnologia} (${item.nivel || 'sin nivel'})`)
      };

      const { error: errorLegacy } = await supabase
        .from('proyectos_reales_applications')
        .insert([payloadLegacy]);
        
      if (errorLegacy) {
          throw new Error('No se pudo guardar la postulación en la base de datos: ' + errorLegacy.message);
      }
    }

    // 2. Enviar email de confirmación vía Vercel Serverless Function
    let emailResult = { success: false, message: 'No se intentó enviar email' };
    try {
      emailResult = await proyectosRealesService.sendConfirmationEmail({
        ...formData,
        tecnologiasConNivel
      });
    } catch (emailError) {
      console.error('La postulación se guardó en BD pero falló el email:', emailError);
      // Podemos decidir no romper el flujo principal si solo falló el email
      // throw emailError; 
    }

    return emailResult;
  },

  /**
   * Llama a la Vercel Serverless Function (/api/send-proyectos-reales-email)
    * para enviar el email de confirmación vía Resend.
   */
  sendConfirmationEmail: async (formData) => {
    const response = await fetch('/api/send-proyectos-reales-email', {
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

export default proyectosRealesService;
