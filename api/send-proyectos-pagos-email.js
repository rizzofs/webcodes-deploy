// Vercel Serverless Function: Envía email de confirmación de postulación
// a proyectos pagos vía Resend.
// Se invoca desde el frontend a través de /api/send-proyectos-pagos-email

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
    const { nombre, email, area, tecnologias } = req.body;

    const areaLabel = AREA_LABELS[area] || area;
    const tecnologiasTexto = Array.isArray(tecnologias) ? tecnologias.join(', ') : '';

    const htmlConfirmacion = `
      <div style="font-family: 'Segoe UI', Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #1a1a2e; color: #e0e0e0; border-radius: 12px; overflow: hidden;">
        <div style="background: linear-gradient(135deg, #39c0c3 0%, #1e6b6e 100%); padding: 30px; text-align: center;">
          <h1 style="margin: 0; color: white; font-size: 24px;">✅ ¡Postulación Recibida!</h1>
          <p style="margin: 8px 0 0; color: rgba(255,255,255,0.9); font-size: 14px;">CODES++ - Proyectos Pagos</p>
        </div>

        <div style="padding: 30px;">
          <p style="font-size: 16px; line-height: 1.6;">Hola <strong>${nombre}</strong>,</p>
          <p style="line-height: 1.6;">
            ¡Gracias por postularte a nuestros <strong>proyectos pagos</strong> a través de CODES++!
            Tu solicitud fue registrada correctamente.
          </p>

          <div style="background: rgba(57, 192, 195, 0.1); border-left: 4px solid #39c0c3; border-radius: 8px; padding: 16px; margin: 20px 0;">
            <p style="margin: 0; font-size: 14px;">
              <strong>Área seleccionada:</strong> ${areaLabel}<br/>
              <strong>Tecnologías:</strong> ${tecnologiasTexto}
            </p>
          </div>

          <p style="line-height: 1.6;">
            Revisaremos tu perfil y te contactaremos cuando surjan proyectos que se ajusten a tus habilidades.
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

¡Gracias por postularte a nuestros proyectos pagos a través de CODES++!
Tu solicitud fue registrada correctamente.

Área seleccionada: ${areaLabel}
Tecnologías: ${tecnologiasTexto}

Revisaremos tu perfil y te contactaremos cuando surjan proyectos que se ajusten a tus habilidades.

---
CODES++ - Proyectos Pagos
    `.trim();

    const fromAddress = process.env.RESEND_FROM || 'CODES++ <onboarding@resend.dev>';

    const confirmResponse = await fetch('https://api.resend.com/emails', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        from: fromAddress,
        to: [email],
        subject: '¡Tu postulación a proyectos pagos fue recibida! - CODES++',
        html: htmlConfirmacion,
        text: textConfirmacion
      })
    });

    if (!confirmResponse.ok) {
      const confirmError = await confirmResponse.json();
      console.error('Error de Resend (confirmación):', confirmError);
      return res.status(502).json({
        success: false,
        error: confirmError.message || 'Error al enviar email de confirmación'
      });
    }

    const confirmData = await confirmResponse.json();

    return res.status(200).json({
      success: true,
      message: 'Email de confirmación enviado correctamente',
      emailId: confirmData.id
    });
  } catch (error) {
    console.error('Error al enviar email de proyectos pagos:', error);
    return res.status(500).json({
      success: false,
      error: 'Error interno al procesar la solicitud'
    });
  }
}
