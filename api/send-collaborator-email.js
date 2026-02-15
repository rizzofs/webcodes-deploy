// Vercel Serverless Function: Envía email de notificación de solicitud de colaboración via Resend.
// Se invoca desde el frontend a través de /api/send-collaborator-email
//
// Variables de entorno necesarias (configurar en Vercel Dashboard > Settings > Environment Variables):
//   RESEND_API_KEY  - API Key de Resend (re_xxxxxxxx)

export default async function handler(req, res) {
  // Solo aceptar POST
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Método no permitido' });
  }

  const RESEND_API_KEY = process.env.RESEND_API_KEY;

  if (!RESEND_API_KEY) {
    console.error('RESEND_API_KEY no está configurada');
    return res.status(500).json({ error: 'Configuración de email no disponible' });
  }

  try {
    const {
      applicationId,
      nombre,
      email,
      telefono,
      anoIngreso,
      disponibilidad,
      tecnologias,
      nivelesExperiencia,
      motivacion,
    } = req.body;

    // Construir contenido del email
    const tecnologiasTexto = tecnologias
      .map((tech) => {
        const nivel = nivelesExperiencia[tech] || 'No especificado';
        return `  • ${tech} (${nivel})`;
      })
      .join('\n');

    const disponibilidadTexto = disponibilidad.join(', ');

    const htmlBody = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px;">🤝 Nueva Solicitud de Colaboración</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">CODES++ - Centro de Estudiantes</p>
        </div>
        
        <div style="padding: 30px;">
          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">👤 Información Personal</h3>
            <table style="width: 100%; border-collapse: collapse;">
              <tr><td style="padding: 6px 0; color: #999;">Nombre:</td><td style="padding: 6px 0;"><strong>${nombre}</strong></td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Email:</td><td style="padding: 6px 0;"><a href="mailto:${email}" style="color: #667eea;">${email}</a></td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Teléfono:</td><td style="padding: 6px 0;">${telefono}</td></tr>
              <tr><td style="padding: 6px 0; color: #999;">Año ingreso:</td><td style="padding: 6px 0;">${anoIngreso}</td></tr>
            </table>
          </div>

          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">🕐 Disponibilidad Horaria</h3>
            <p style="margin: 0;">${disponibilidadTexto}</p>
          </div>

          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">💻 Tecnologías</h3>
            <pre style="margin: 0; white-space: pre-wrap; font-family: inherit;">${tecnologiasTexto}</pre>
          </div>

          <div style="background: rgba(255,255,255,0.05); border-radius: 8px; padding: 20px; margin-bottom: 20px;">
            <h3 style="color: #667eea; margin-top: 0;">💡 Motivación</h3>
            <p style="margin: 0; line-height: 1.6;">${motivacion}</p>
          </div>

          <div style="text-align: center; margin-top: 24px; padding-top: 20px; border-top: 1px solid rgba(255,255,255,0.1);">
            <p style="color: #999; font-size: 12px; margin: 0;">
              Solicitud #${applicationId || 'N/A'} · Recibida el ${new Date().toLocaleDateString('es-AR', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </p>
          </div>
        </div>
      </div>
    `;

    const textBody = `
NUEVA SOLICITUD DE COLABORACIÓN - CODES++
==========================================

INFORMACIÓN PERSONAL:
- Nombre: ${nombre}
- Email: ${email}
- Teléfono: ${telefono}
- Año de ingreso: ${anoIngreso}

DISPONIBILIDAD HORARIA:
${disponibilidadTexto}

TECNOLOGÍAS E INTERESES:
${tecnologiasTexto}

MOTIVACIÓN E INTERESES:
${motivacion}

---
Solicitud #${applicationId || 'N/A'}
    `.trim();

    // Enviar email via Resend API
    // "from" usa onboarding@resend.dev por defecto (funciona sin verificar dominio).
    // Cuando verifiques tu dominio en Resend, cambiá RESEND_FROM a: "CODES++ <noreply@codesunlu.tech>"
    // y NOTIFICATION_TO a: "sistemas@codesunlu.tech"
    const fromAddress = process.env.RESEND_FROM || 'CODES++ <onboarding@resend.dev>';
    const toAddress = process.env.NOTIFICATION_TO || 'sistemas@codesunlu.tech';

    const resendResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [toAddress],
        subject: `[CODES++] Nueva Solicitud de Colaboración - ${nombre}`,
        html: htmlBody,
        text: textBody,
        reply_to: email,
      }),
    });

    if (!resendResponse.ok) {
      const resendError = await resendResponse.json();
      console.error('Error de Resend:', resendError);
      return res.status(502).json({ 
        success: false, 
        error: resendError.message || 'Error al enviar email vía Resend' 
      });
    }

    const resendData = await resendResponse.json();

    return res.status(200).json({ 
      success: true, 
      message: 'Email enviado correctamente',
      emailId: resendData.id 
    });

  } catch (error) {
    console.error('Error al enviar email de colaboración:', error);
    return res.status(500).json({ 
      success: false, 
      error: 'Error interno al procesar la solicitud' 
    });
  }
}
