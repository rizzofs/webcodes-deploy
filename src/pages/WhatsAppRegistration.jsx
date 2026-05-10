import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import './WhatsAppRegistration.css';

const WhatsAppRegistration = () => {
  const [loading, setLoading] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const [formData, setFormData] = useState({
    nombre: '',
    apellido: '',
    email: '',
    whatsapp: '',
    legajo: '',
    sede: 'lujan'
  });

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!file) {
      setError('Debes cargar tu certificado de alumno regular.');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Función para limpiar tildes del nombre del archivo
      const sanitizePath = (str) => {
        return str.normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-zA-Z0-9]/g, "_");
      };

      // 1. Subir el archivo al Storage
      const fileExt = file.name.split('.').pop();
      const cleanNombre = sanitizePath(formData.nombre);
      const cleanApellido = sanitizePath(formData.apellido);
      const fileName = `${Date.now()}_${cleanApellido}_${cleanNombre}.${fileExt}`;
      const filePath = `solicitudes/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('certificados')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      // 2. Guardar datos en la tabla
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
            estado: 'pendiente'
          }
        ]);

      if (insertError) throw insertError;

      setSubmitted(true);
    } catch (err) {
      console.error('Error:', err);
      if (err.code === '23505') { // Código de error de Postgres para violación de unicidad
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
                pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                title="Solo se permiten letras"
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
                pattern="[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+"
                title="Solo se permiten letras"
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
              pattern="[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,}$"
              title="Por favor, ingresa un correo electrónico válido (ej: nombre@dominio.com)"
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
                pattern="[0-9]+"
                title="Solo se permiten números"
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
                pattern="[0-9]{6}"
                title="El legajo debe tener exactamente 6 números"
                placeholder="Ej: 123456"
                value={formData.legajo}
                onChange={(e) => {
                  // Solo permitir números
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

          {error && <p style={{color: '#ff4d4d', textAlign: 'center', fontSize: '0.9rem'}}>{error}</p>}

          <button className="submit-button" type="submit" disabled={loading}>
            {loading ? (
              <>
                <span className="loading-spinner"></span>
                Enviando...
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
