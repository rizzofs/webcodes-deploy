import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import './WhatsAppManagement.css';

const WhatsAppManagement = () => {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [currentTab, setCurrentTab] = useState('pendiente');

  const fetchRequests = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('whatsapp_requests')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching requests:', error);
    } else {
      setRequests(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const updateStatus = async (id, newStatus) => {
    const { error } = await supabase
      .from('whatsapp_requests')
      .update({ estado: newStatus })
      .eq('id', id);

    if (error) {
      alert('Error al actualizar el estado');
    } else {
      fetchRequests();
    }
  };

  const deleteRequest = async (id) => {
    if (window.confirm('¿Estás seguro de eliminar permanentemente esta solicitud?')) {
      const { error } = await supabase
        .from('whatsapp_requests')
        .delete()
        .eq('id', id);

      if (error) {
        alert('Error al eliminar');
      } else {
        fetchRequests();
      }
    }
  };

  const viewCertificate = async (path) => {
    const { data, error } = await supabase.storage
      .from('certificados')
      .createSignedUrl(path, 600);

    if (error) {
      alert('Error al obtener el certificado');
    } else {
      setSelectedPdf(data.signedUrl);
    }
  };

  const getWhatsAppLink = (number, nombre) => {
    const cleanNumber = number.replace(/\D/g, '');
    const message = encodeURIComponent(`Hola ${nombre}, verifiqué tu certificado. ¡Bienvenido a la comunidad LSI! Ya podés unirte al grupo oficial.`);
    return `https://wa.me/${cleanNumber}?text=${message}`;
  };

  const filteredRequests = requests.filter(req => req.estado === currentTab);
  
  const counts = {
    pendiente: requests.filter(r => r.estado === 'pendiente').length,
    aprobado: requests.filter(r => r.estado === 'aprobado').length,
    rechazado: requests.filter(r => r.estado === 'rechazado').length,
  };

  return (
    <div className="wa-mgmt-container">
      <div className="wa-mgmt-header">
        <div className="title-area">
          <h3>📱 Gestión de Comunidad LSI</h3>
          <p>Verifica los certificados y agrega alumnos al WhatsApp</p>
        </div>
        <button className="refresh-btn" onClick={fetchRequests} title="Actualizar">
          🔄 Actualizar Lista
        </button>
      </div>

      <div className="wa-tabs">
        <button 
          className={`wa-tab-item ${currentTab === 'pendiente' ? 'active' : ''}`}
          onClick={() => setCurrentTab('pendiente')}
        >
          Pendientes <span className="tab-count">{counts.pendiente}</span>
        </button>
        <button 
          className={`wa-tab-item ${currentTab === 'aprobado' ? 'active' : ''}`}
          onClick={() => setCurrentTab('aprobado')}
        >
          Aprobados <span className="tab-count">{counts.aprobado}</span>
        </button>
        <button 
          className={`wa-tab-item ${currentTab === 'rechazado' ? 'active' : ''}`}
          onClick={() => setCurrentTab('rechazado')}
        >
          Rechazados <span className="tab-count">{counts.rechazado}</span>
        </button>
      </div>

      <div className="wa-mgmt-table-container">
        {loading ? (
          <div className="loading-area">
            <div className="spinner"></div>
            <p>Cargando solicitudes...</p>
          </div>
        ) : filteredRequests.length === 0 ? (
          <div className="no-data">
            <div className="no-data-icon">📭</div>
            <p>No hay solicitudes en la lista de <strong>{currentTab}s</strong>.</p>
          </div>
        ) : (
          <table className="wa-mgmt-table">
            <thead>
              <tr>
                <th>Alumno</th>
                <th>Sede</th>
                <th>Fecha</th>
                <th>Acciones</th>
              </tr>
            </thead>
            <tbody>
              {filteredRequests.map((req) => (
                <tr key={req.id}>
                  <td>
                    <div className="student-info">
                      <span className="student-name">{req.nombre} {req.apellido}</span>
                      <span className="student-meta">LEG: {req.legajo} | WSP: {req.whatsapp}</span>
                    </div>
                  </td>
                  <td><span className="sede-badge">{req.sede}</span></td>
                  <td>{new Date(req.created_at).toLocaleDateString()}</td>
                  <td className="action-buttons">
                    <button 
                      className="btn-icon btn-view" 
                      onClick={() => viewCertificate(req.certificado_url)}
                      title="Ver Certificado"
                    >
                      📄
                    </button>
                    
                    {currentTab === 'aprobado' && (
                      <a 
                        href={getWhatsAppLink(req.whatsapp, req.nombre)} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="btn-icon btn-wa"
                        title="Enviar mensaje de bienvenida"
                      >
                        💬
                      </a>
                    )}

                    {currentTab !== 'aprobado' && (
                      <button 
                        className="btn-icon btn-approve" 
                        onClick={() => updateStatus(req.id, 'aprobado')}
                        title="Aprobar y Mover"
                      >
                        ✅
                      </button>
                    )}

                    {currentTab === 'pendiente' && (
                      <button 
                        className="btn-icon btn-reject" 
                        onClick={() => updateStatus(req.id, 'rechazado')}
                        title="Rechazar"
                      >
                        ❌
                      </button>
                    )}

                    {currentTab === 'rechazado' && (
                      <button 
                        className="btn-icon btn-approve" 
                        onClick={() => updateStatus(req.id, 'pendiente')}
                        title="Mover a Pendientes"
                      >
                        🔄
                      </button>
                    )}

                    <button 
                      className="btn-icon btn-delete" 
                      onClick={() => deleteRequest(req.id)}
                      title="Eliminar permanentemente"
                    >
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {selectedPdf && (
        <div className="modal-overlay" onClick={() => setSelectedPdf(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <h4>Certificado: {requests.find(r => r.id === requests.find(x => x.id))?.nombre}</h4>
              <button className="btn-close" onClick={() => setSelectedPdf(null)}>&times;</button>
            </div>
            <iframe 
              src={selectedPdf} 
              className="pdf-viewer" 
              title="Certificado PDF"
            ></iframe>
          </div>
        </div>
      )}
    </div>
  );
};

export default WhatsAppManagement;
