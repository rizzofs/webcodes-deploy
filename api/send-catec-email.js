// Vercel Serverless Function: Envía email de notificación de postulación CATEC vía Resend.
// Se invoca desde el frontend a través de /api/send-catec-email
//
// Variables de entorno necesarias (configurar en Vercel Dashboard > Settings > Environment Variables):
//   RESEND_API_KEY  - API Key de Resend (re_xxxxxxxx)

const AREA_LABELS = {
  frontend: 'Frontend',
  backend: 'Backend',
  data_analytics: 'Data Analytics',
  qa: 'Q/A (Quality Assurance)'
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY no está configurada');
    return res.status(500).json({ error: 'Configuración de email no disponible' });
  }

  try {
    const { nombre, email, legajo, area, tecnologias, portfolioUrl } = req.body;

    const areaLabel = AREA_LABELS[area] || area;
    const tecnologiasTexto = tecnologias.map(t => `  • ${t}`).join('\n');
    const portfolioTexto = portfolioUrl || 'No proporcionado';

    // ── Email 1: Notificación al equipo CODES++ ──
    const htmlNotificacion = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #39c0c3 0%, #1e6b6e 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px;">🏢 Nueva Postulación CATEC</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">CODES++ - Vinculación Tecnológica</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #39c0c3; margin-top: 0;">👤 Información del Postulante</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #999;">Nombre:</td><td style="padding: 6px 0;"><strong>${nombre}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #39c0c3;">${email}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Legajo:</td><td style="padding: 6px 0;">${legajo}</td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Área:</td><td style="padding: 6px 0;"><strong>${areaLabel}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Portfolio:</td><td style="padding: 6px 0;">${portfolioUrl ? `<a href="${portfolioUrl}" style="color: #39c0c3;">${portfolioUrl}</a>` : 'No proporcionado'}</td></tr>
            </table>
          </div>

          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #39c0c3; margin-top: 0;">💻 Tecnologías</h3>
            <pre style="margin: 0; white-space: pre-wrap; font-family: inherit;">${tecnologiasTexto}</pre>
          </div>

          <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Recibida el ${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    `;

    const textNotificacion = `
NUEVA POSTULACIÓN CATEC - CODES++
==========================================

INFORMACIÓN DEL POSTULANTE:
- Nombre: ${nombre}
- Email: ${email}
- Legajo: ${legajo}
- Área: ${areaLabel}
- Portfolio/GitHub: ${portfolioTexto}

TECNOLOGÍAS:
${tecnologiasTexto}

---
Vinculación Tecnológica CODES++
    `.trim();

    // ── Email 2: Confirmación al estudiante ──
    const htmlConfirmacion = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #39c0c3 0%, #1e6b6e 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px;">✅ ¡Postulación Recibida!</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">CODES++ - Centro de Asistencia Tecnológica y Empresarial</p>
        </div>
        
        <div style="padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6;">Hola <strong>${nombre}</strong>,</p>
          <p style="line-height: 1.6;">
            ¡Gracias por postularte a los proyectos del <strong>CATEC</strong> a través de CODES++! 
            Tu solicitud fue registrada correctamente en nuestra base de datos de vinculación tecnológica.
          </p>
          
          <div style="background: rgba(57, 192, 195, 0.1); border-left: 4px solid #39c0c3; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Área seleccionada:</strong> ${areaLabel}<br/>
              <strong>Tecnologías:</strong> ${tecnologias.join(', ')}
            </p>
          </div>

          <p style="line-height: 1.6;">
            Nuestro equipo revisará tu perfil y te contactaremos cuando surjan proyectos que se ajusten a tus habilidades. 
            Los proyectos CATEC son desarrollos para <strong>empresas reales</strong> y son <strong>remunerados</strong>.
          </p>
          
          <p style="line-height: 1.6;">
            Mientras tanto, te invitamos a seguir participando de la comunidad CODES++.
          </p>

          <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Este es un email automático. Si tenés dudas, respondé a este correo o contactanos por Discord.
            </p>
          </div>
        </div>
      </div>
    `;

    const textConfirmacion = `
Hola ${nombre},

¡Gracias por postularte a los proyectos del CATEC a través de CODES++!
Tu solicitud fue registrada correctamente en nuestra base de datos de vinculación tecnológica.

Área seleccionada: ${areaLabel}
Tecnologías: ${tecnologias.join(', ')}

Nuestro equipo revisará tu perfil y te contactaremos cuando surjan proyectos que se ajusten a tus habilidades.
Los proyectos CATEC son desarrollos para empresas reales y son remunerados.

Mientras tanto, te invitamos a seguir participando de la comunidad CODES++.

---
CODES++ - Vinculación Tecnológica
    `.trim();

    const fromAddress = process.env.RESEND_FROM || 'CODES++ <onboarding@resend.dev>';
    const notificationTo = process.env.NOTIFICATION_TO || 'sistemas@codesunlu.tech';

    // Enviar email de notificación al equipo
    const notifResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [notificationTo],
        subject: `[CATEC] Nueva Postulación - ${nombre} (${areaLabel})`,
        html: htmlNotificacion,
        text: textNotificacion,
        reply_to: email,
      }),
    });

    if (!notifResponse.ok) {
      const resendError = await notifResponse.json();
      console.error('Error de Resend (notificación):', resendError);
      return res.status(502).json({
        success: false,
        error: resendError.message || 'Error al enviar email de notificación'
      });
    }

    // Enviar email de confirmación al estudiante
    const confirmResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: '¡Tu postulación CATEC fue recibida! - CODES++',
        html: htmlConfirmacion,
        text: textConfirmacion,
      }),
    });

    if (!confirmResponse.ok) {
      const confirmError = await confirmResponse.json();
      console.error('Error de Resend (confirmación):', confirmError);
      // No bloqueamos, la notificación ya se envió
    }

    const notifData = await notifResponse.json();

    return res.status(200).json({
      success: true,
      message: 'Emails enviados correctamente',
      emailId: notifData.id
    });

  } catch (error) {
    console.error('Error al enviar email CATEC:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno al procesar la solicitud'
    });
  }
}
