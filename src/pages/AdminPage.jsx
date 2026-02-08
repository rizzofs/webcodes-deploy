import React, { useState, useEffect } from 'react';
import './AdminPage.css';

const AdminPage = () => {
  const [numero, setNumero] = useState('');
  const [estado, setEstado] = useState(null);
  const [loading, setLoading] = useState(false);
  const [estadisticas, setEstadisticas] = useState(null);
  const [numerosVendidos, setNumerosVendidos] = useState([]);

  // URL del Google Apps Script
  const GOOGLE_SHEETS_URL = import.meta.env.VITE_GOOGLE_SHEETS_URL || 'https://script.google.com/macros/s/AKfycbztYN0tvRptLKBaX0jtSvSFQ9QtK0dEEDDoXOltDJSisTWz5trO2n7i8ytZ1ZF5BXKi/exec';

  // Verificar estado de un número
  const verificarEstado = async () => {
    if (!numero) return;
    
    setLoading(true);
    try {
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=verificarDisponibilidad&numero=${numero}`);
      const data = await response.json();
      setEstado(data);
    } catch (error) {
      console.error('Error al verificar estado:', error);
      setEstado({ error: 'Error al conectar con el servidor' });
    } finally {
      setLoading(false);
    }
  };

  // Obtener estadísticas
  const obtenerEstadisticas = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getEstadisticas`);
      const data = await response.json();
      setEstadisticas(data);
    } catch (error) {
      console.error('Error al obtener estadísticas:', error);
    } finally {
      setLoading(false);
    }
  };

  // Obtener números vendidos
  const obtenerNumerosVendidos = async () => {
    setLoading(true);
    try {
      const response = await fetch(`${GOOGLE_SHEETS_URL}?action=getNumerosVendidos`);
      const data = await response.json();
      setNumerosVendidos(data.numeros || []);
    } catch (error) {
      console.error('Error al obtener números vendidos:', error);
    } finally {
      setLoading(false);
    }
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    obtenerEstadisticas();
    obtenerNumerosVendidos();
  }, []);

  return (
    <div className="admin-page">
      <div className="container">
        <h1>🔧 Panel de Administración</h1>
        
        {/* Verificar número específico */}
        <div className="admin-section">
          <h2>🔍 Verificar Número</h2>
          <div className="verificar-numero">
            <input
              type="text"
              placeholder="Ingresa el número (ej: 0001)"
              value={numero}
              onChange={(e) => setNumero(e.target.value)}
              maxLength="4"
            />
            <button onClick={verificarEstado} disabled={loading || !numero}>
              {loading ? 'Verificando...' : 'Verificar'}
            </button>
          </div>
          
          {estado && (
            <div className={`estado-resultado ${estado.disponible ? 'disponible' : 'vendido'}`}>
              <h3>Estado del número {numero}:</h3>
              <p><strong>Disponible:</strong> {estado.disponible ? '✅ SÍ' : '❌ NO'}</p>
              {estado.comprador && (
                <>
                  <p><strong>Comprador:</strong> {estado.comprador}</p>
                  <p><strong>Email:</strong> {estado.email}</p>
                  <p><strong>Teléfono:</strong> {estado.telefono}</p>
                  <p><strong>Fecha de venta:</strong> {estado.fechaVenta}</p>
                </>
              )}
            </div>
          )}
        </div>

        {/* Estadísticas generales */}
        <div className="admin-section">
          <h2>📊 Estadísticas Generales</h2>
          <button onClick={obtenerEstadisticas} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar Estadísticas'}
          </button>
          
          {estadisticas && (
            <div className="estadisticas">
              <div className="stat-card">
                <h3>Total de Números</h3>
                <p className="stat-number">{estadisticas.totalNumeros}</p>
              </div>
              <div className="stat-card">
                <h3>Números Vendidos</h3>
                <p className="stat-number vendidos">{estadisticas.numerosVendidos}</p>
              </div>
              <div className="stat-card">
                <h3>Números Disponibles</h3>
                <p className="stat-number disponibles">{estadisticas.numerosDisponibles}</p>
              </div>
              <div className="stat-card">
                <h3>Total Recaudado</h3>
                <p className="stat-number recaudado">${estadisticas.totalRecaudado?.toLocaleString()}</p>
              </div>
              <div className="stat-card">
                <h3>Porcentaje Vendido</h3>
                <p className="stat-number porcentaje">{estadisticas.porcentajeVendido}%</p>
              </div>
            </div>
          )}
        </div>

        {/* Números vendidos recientemente */}
        <div className="admin-section">
          <h2>🛒 Números Vendidos Recientemente</h2>
          <button onClick={obtenerNumerosVendidos} disabled={loading}>
            {loading ? 'Cargando...' : 'Actualizar Lista'}
          </button>
          
          {numerosVendidos.length > 0 && (
            <div className="numeros-vendidos">
              <table>
                <thead>
                  <tr>
                    <th>Número</th>
                    <th>Comprador</th>
                    <th>Email</th>
                    <th>Teléfono</th>
                    <th>Fecha</th>
                    <th>Estado</th>
                  </tr>
                </thead>
                <tbody>
                  {numerosVendidos.map((venta, index) => (
                    <tr key={index}>
                      <td>{venta.numero}</td>
                      <td>{venta.nombre}</td>
                      <td>{venta.email}</td>
                      <td>{venta.telefono}</td>
                      <td>{new Date(venta.fecha).toLocaleDateString()}</td>
                      <td className={`estado ${venta.estado?.toLowerCase()}`}>
                        {venta.estado}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Enlaces útiles */}
        <div className="admin-section">
          <h2>🔗 Enlaces Útiles</h2>
          <div className="enlaces">
            <a href={`${GOOGLE_SHEETS_URL}?action=getNumeros`} target="_blank" rel="noopener noreferrer">
              Ver todos los números
            </a>
            <a href={`${GOOGLE_SHEETS_URL}?action=getEstadisticas`} target="_blank" rel="noopener noreferrer">
              Ver estadísticas (JSON)
            </a>
            <a href={`${GOOGLE_SHEETS_URL}?action=getNumerosVendidos`} target="_blank" rel="noopener noreferrer">
              Ver números vendidos (JSON)
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminPage;
