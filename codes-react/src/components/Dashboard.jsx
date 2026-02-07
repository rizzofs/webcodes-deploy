import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Nav, Tab } from 'react-bootstrap';
import { useAuth } from '../contexts/AuthContext';
import NewsManagement from './NewsManagement';
import ActivitiesManagement from './ActivitiesManagement';
import TalksManagement from './TalksManagement';
import UserManagement from './UserManagement';
import DashboardStats from './DashboardStats';
import DiscordLive from './DiscordLive';
import './Dashboard.css';

const Dashboard = () => {
  const { user, logout, hasPermission } = useAuth();
  const [activeTab, setActiveTab] = useState('stats');

  // No default user, rely on AuthContext
  const currentUser = user;

  // Si no hay usuario (aunque ProtectedRoute debería prevenir esto), no renderizar
  if (!currentUser) return null;

  // Wrapper simple para hasPermission del contexto
  const checkPermission = (permission) => {
    return hasPermission(permission);
  };

  const handleLogout = () => {
    if (user) {
      logout();
    }
    window.location.href = '/';
  };

  const getRoleDisplayName = (role) => {
    const roles = {
      admin: 'Administrador',
      editor: 'Editor',
      member: 'Miembro'
    };
    return roles[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      admin: 'danger',
      editor: 'warning',
      member: 'info'
    };
    return colors[role] || 'secondary';
  };

  // El sidebar principal ya no se renderiza cuando estamos en el dashboard
  // gracias a la lógica en App.jsx

  return (
    <div className="dashboard-page">
      {/* Header del Dashboard */}
      <div className="dashboard-header">
        <div className="header-left">
          <div className="dashboard-logo">
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </div>
          <div className="breadcrumb">
            <span>Dashboard</span>
            <i className="fas fa-chevron-right"></i>
            <span>
              {activeTab === 'stats' && 'Estadísticas'}
              {activeTab === 'news' && 'Noticias'}
              {activeTab === 'activities' && 'Actividades'}
              {activeTab === 'talks' && 'Charlas'}
              {activeTab === 'users' && 'Usuarios'}
              {activeTab === 'discord' && 'Discord'}
            </span>
          </div>
        </div>
        
        <div className="header-right">
          <div className="user-profile">
            <img 
              src={currentUser.avatar} 
              alt={currentUser.name}
              className="user-avatar"
            />
            <div className="user-info">
              <span className="user-name">{currentUser.name}</span>
              <span className="user-role">{getRoleDisplayName(currentUser.role)}</span>
            </div>
            <button className="logout-btn" onClick={handleLogout}>
              <i className="fas fa-sign-out-alt"></i>
            </button>
          </div>
        </div>
      </div>

      {/* Navegación del Dashboard */}
      <div className="dashboard-nav">
        <div className="nav-container">
          {[
            { id: 'stats', title: 'Estadísticas', icon: 'fas fa-chart-bar', permission: null },
            { id: 'news', title: 'Noticias', icon: 'fas fa-newspaper', permission: 'manage_blog' },
            { id: 'activities', title: 'Actividades', icon: 'fas fa-calendar-alt', permission: 'write' },
            { id: 'talks', title: 'Charlas', icon: 'fas fa-video', permission: 'write' },
            { id: 'users', title: 'Usuarios', icon: 'fas fa-users', permission: 'manage_users' },
            { id: 'discord', title: 'Discord', icon: 'fab fa-discord', permission: null }
          ].map((item) => {
            if (item.permission && !checkPermission(item.permission)) return null;
            
            return (
              <button
                key={item.id}
                className={`nav-item ${activeTab === item.id ? 'active' : ''}`}
                onClick={() => setActiveTab(item.id)}
              >
                <i className={item.icon}></i>
                <span>{item.title}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Contenido Principal */}
      <div className="dashboard-content">
        {activeTab === 'stats' && <DashboardStats />}
        {activeTab === 'news' && checkPermission('manage_blog') && <NewsManagement />}
        {activeTab === 'activities' && checkPermission('write') && <ActivitiesManagement />}
        {activeTab === 'talks' && checkPermission('write') && <TalksManagement />}
        {activeTab === 'users' && checkPermission('manage_users') && <UserManagement />}
        {activeTab === 'discord' && <DiscordLive />}
      </div>
    </div>
  );
};

export default Dashboard;
