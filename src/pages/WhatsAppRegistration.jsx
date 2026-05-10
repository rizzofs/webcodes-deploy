import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import * as pdfjsLib from 'pdfjs-dist';
import './WhatsAppRegistration.css';

// Configurar el worker de PDF.js
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

const WhatsAppRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [isBurnMessage, setIsBurnMessage] = useState(false);
  const [file, setFile] = useState(null);
  const [userIp, setUserIp] = useState('');
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    whatsapp: '',
    legajo: '',
    sede: 'lujan'
  });

  // Obtener IP al cargar
  useEffect(() => {
    fetch('https://api.ipify.org?format=json')
      .then(res => res.json())
      .then(data => setUserIp(data.ip))
      .catch(err => console.error('Error obteniendo IP:', err));
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile && selectedFile.type === 'application/pdf') {
      setFile(selectedFile);
      setError(null);
    } else {
      setFile(null);
      setError('Por favor, selecciona un archivo PDF válido.');
    }
  };

  const extractPdfText = async (file) => {
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      let fullText = '';
      
      // Solo leemos las primeras 2 páginas para no tardar tanto
      const pagesToRead = Math.min(pdf.numPages, 2);
      for (let i = 1; i <= pagesToRead; i++) {
        const page = await pdf.getPage(i);
        const textContent = await page.getTextContent();
        const pageText = textContent.items.map(item => item.str).join(' ');
        fullText += pageText + ' ';
      }
      return fullText;
    } catch (err) {
      console.error('Error extrayendo texto del PDF:', err);
      return '';
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Debes cargar tu certificado de alumno regular.');
      return;
    }

    setLoading(true);
    setError(null);
    setIsBurnMessage(false);

    try {
      // 0. VERIFICAR BLOQUEO POR IP (Máximo 3 intentos rechazados)
      if (userIp) {
        const { count, error: countError } = await supabase
          .from('whatsapp_requests')
          .select('*', { count: 'exact', head: true })
          .eq('ip_address', userIp)
          .eq('estado', 'rechazado');

        if (!countError && count >= 3) {
          setIsBurnMessage(true);
          setError(`IP BLOQUEADA. Se han detectado demasiados intentos fallidos desde esta conexión (${userIp}). Contactá a un administrador del Centro de Estudiantes.`);
          setLoading(false);
          return;
        }
      }

      // 1. VALIDACIONES ANTI-PELOTUDOS
      const blacklist = ['test', 'prueba', 'asdf', 'admin', 'usuario', 'demo'];
      const fieldsToCheck = [formData.nombre, formData.apellido, formData.email];
      const hasBlacklistedWord = fieldsToCheck.some(field => 
        blacklist.some(word => field.toLowerCase().includes(word))
      );

      const legajoNum = parseInt(formData.legajo);
      const isInvalidLegajo = legajoNum < 111111 || legajoNum > 300000;

      // Leer PDF para verificar contenido
      const pdfText = await extractPdfText(file);
      const lowerText = pdfText.toLowerCase().trim();
      
      // Si no hay texto, puede ser un PDF "imagen". No lo rebotamos, lo mandamos a revisión manual.
      const isUnreadable = lowerText.length < 10;

      // Filtros mínimos (Basta con que tenga UNA de estas palabras)
      const hasKeywords = lowerText.includes('lujan') || 
                          lowerText.includes('luján') ||
                          lowerText.includes('universidad') ||
                          lowerText.includes('legajo') ||
                          lowerText.includes('estudiante') ||
                          lowerText.includes('ingresante');

      // 1. RECHAZO DURO (Burn Message): Solo por Legajo o Blacklist
      if (hasBlacklistedWord || isInvalidLegajo) {
        setIsBurnMessage(true);
        setError(`Buen intento. Te olvidaste que somos de sistemas, gracias por dejarnos tu IP: ${userIp || 'detectada'}.`);
        setLoading(false);
        return;
      }

      // 2. RECHAZO BLANDO O REVISIÓN MANUAL
      let status = 'pendiente';
      let rejectionReason = '';

      if (isUnreadable) {
        rejectionReason = 'PDF ilegible (posible imagen). Requiere revisión manual.';
      } else if (!hasKeywords) {
        // Tiene texto pero no dice nada de Luján/Legajo -> Sospechoso, lo marcamos como rechazado
        status = 'rechazado';
        rejectionReason = 'PDF con texto pero sin palabras clave académicas.';
      }

      // 3. Proceso de subida
      const sanitizePath = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
      };

      const fileExt = file.name.split('.').pop();
      const cleanNombre = sanitizePath(formData.nombre);
      const cleanApellido = sanitizePath(formData.apellido);
      const fileName = `${Date.now()}_${cleanApellido}_${cleanNombre}.${fileExt}`;
      const filePath = `solicitudes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('certificados')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 4. Guardar en la DB
      const { error: insertError } = await supabase
        .from('whatsapp_requests')
        .insert([
          {
            nombre: formData.nombre,
            apellido: formData.apellido,
            email: formData.email,
            whatsapp: formData.whatsapp,
            legajo: formData.legajo,
            sede: formData.sede,
            certificado_url: filePath,
            estado: status,
            ip_address: userIp,
            observaciones: rejectionReason
          }
        ]);

      if (insertError) throw insertError;

      // 5. Respuesta al usuario
      if (status === 'rechazado') {
        // Si el texto es basura pero no es blacklist, le mostramos un error común, no el de Sistemas
        setError('El certificado no parece ser válido. Si crees que es un error, contactanos.');
        setLoading(false);
      } else {
        setSubmitted(true);
      }
    } catch (err) {
      console.error('Error:', err);
      if (err.code === '23505') {
        setError('Este número de legajo ya tiene una solicitud en curso. No es necesario anotarse dos veces.');
      } else {
        setError('Hubo un problema al enviar tu solicitud. Por favor intenta de nuevo.');
      }
    } finally {
      setLoading(false);
    }
  };

  if (submitted) {
    return (
      <div className="whatsapp-reg-container">
        <div className="whatsapp-reg-card">
          <div className="success-message">
            <span className="success-icon">✓</span>
            <h2>¡Solicitud Enviada!</h2>
            <p>
              Gracias <strong>{formData.nombre}</strong>. Hemos recibido tus datos y tu certificado correctamente.
            </p>
            <p>
              Un administrador revisará la documentación y te agregará al grupo de WhatsApp en las próximas horas.
            </p>
            <button 
              className="submit-button" 
              onClick={() => window.location.href = '/'}
              style={{marginTop: '30px'}}
            >
              Volver al Inicio
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="whatsapp-reg-container">
      <div className="whatsapp-reg-card">
        <div className="whatsapp-reg-header">
          <h1>Comunidad LSI</h1>
          <p>Registrate para unirte al grupo oficial de estudiantes. Verificamos cada perfil para mantener un ambiente seguro y libre de spam.</p>
        </div>

        <form className="whatsapp-reg-form" onSubmit={handleSubmit}>
          <div className="form-group-row">
            <div className="input-container">
              <label>Nombre</label>
              <input 
                type="text" 
                name="nombre" 
                required 
                placeholder="Tu nombre"
                value={formData.nombre}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                  setFormData(prev => ({ ...prev, nombre: value }));
                }}
              />
            </div>
            <div className="input-container">
              <label>Apellido</label>
              <input 
                type="text" 
                name="apellido" 
                required 
                placeholder="Tu apellido"
                value={formData.apellido}
                onChange={(e) => {
                  const value = e.target.value.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ\s]/g, '');
                  setFormData(prev => ({ ...prev, apellido: value }));
                }}
              />
            </div>
          </div>

          <div className="input-container">
            <label>Correo Electrónico</label>
            <input 
              type="email" 
              name="email" 
              required 
              placeholder="ejemplo@mail.com"
              value={formData.email}
              onChange={(e) => {
                setFormData(prev => ({ ...prev, email: e.target.value.toLowerCase() }));
              }}
            />
          </div>

          <div className="form-group-row">
            <div className="input-container">
              <label>WhatsApp (solo números)</label>
              <input 
                type="tel" 
                name="whatsapp" 
                required 
                placeholder="5491122334455"
                value={formData.whatsapp}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, whatsapp: value }));
                }}
              />
            </div>
            <div className="input-container">
              <label>Legajo</label>
              <input 
                type="text" 
                name="legajo" 
                required 
                maxLength="6"
                placeholder="Ej: 123456"
                value={formData.legajo}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setFormData(prev => ({ ...prev, legajo: value }));
                }}
              />
            </div>
          </div>

          <div className="input-container">
            <label>Sede</label>
            <select name="sede" value={formData.sede} onChange={handleInputChange}>
              <option value="lujan">Luján</option>
              <option value="chivilcoy">Chivilcoy</option>
              <option value="san_miguel">San Miguel</option>
            </select>
          </div>

          <div className="input-container">
            <label>Certificado de Alumno Regular (PDF)</label>
            <div className={`file-upload-area ${file ? 'has-file' : ''}`}>
              <input 
                type="file" 
                accept=".pdf" 
                onChange={handleFileChange}
              />
              <div className="file-info">
                <i className="file-icon">📄</i>
                <span>{file ? file.name : 'Haz clic o arrastra tu PDF aquí'}</span>
                <small>Tamaño máximo sugerido: 5MB</small>
              </div>
            </div>
          </div>

          {error && (
            <div className={`error-message ${isBurnMessage ? 'burn-message' : ''}`}>
              {isBurnMessage && <span className="burn-icon">🔥</span>}
              <p>{error}</p>
            </div>
          )}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Verificando...
              </>
            ) : (
              'Enviar Solicitud'
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default WhatsAppRegistration;

