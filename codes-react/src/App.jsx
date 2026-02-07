import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './components/MobileFix.css';
import { AuthProvider } from './contexts/AuthContext';

// Components

import Sidebar from './components/Sidebar';
import Logo from './components/Logo';
import Hero from './components/Hero';
import About from './components/About';
import Members from './components/Members';
import Events from './components/Events';
import Resources from './components/Resources';
import Calendar from './components/Calendar';
import Blog from './components/Blog';
import NewsCarousel from './components/NewsCarousel';
import FAQ from './components/FAQ';
import Colaboradores from './components/Colaboradores';
import Contact from './components/Contact';
import Footer from './components/Footer';
import ScrollToTop from './components/ScrollToTop';
import BackToTop from './components/BackToTop';
import ScrollIndicator from './components/ScrollIndicator';
import MobileFormEnhancer from './components/MobileFormEnhancer';
import Login from './components/Login';
import Dashboard from './components/Dashboard';
import TestDashboard from './components/TestDashboard';
import ProtectedRoute from './components/ProtectedRoute';


// Pages
import Groups from './pages/Groups';
import ExpoUnlu from './pages/ExpoUnlu';
import Cacic from './pages/Cacic';
import Transparencia from './pages/Transparencia';
import CalendarPage from './pages/CalendarPage';

import AdminPage from './pages/AdminPage';
import ColaborarPage from './pages/ColaborarPage';
import EncuestasPage from './pages/EncuestasPage';
import CharlasPage from './pages/CharlasPage';

// Importar hook de Google Analytics
import { useGoogleAnalytics } from './hooks/useGoogleAnalytics';

// Componente interno que puede usar useLocation
function AppContent() {
  const location = useLocation();
  const isDashboard = location.pathname === '/dashboard';
  
  // Trackear cambios de página con Google Analytics
  useGoogleAnalytics();

  return (
    <div className="App">
      {/* Solo renderizar estos componentes si NO estamos en el dashboard */}
      {!isDashboard && (
        <>
          <Sidebar />
          <Logo />
          <ScrollIndicator />
          <MobileFormEnhancer />
        </>
      )}
      
      <Routes>
        <Route path="/" element={
          <>
            <Hero />
            <NewsCarousel />
            <About />
            <Members />
            <Events />
            <Resources />
            <Blog />
            <FAQ />
            <Colaboradores />
            <Contact />
          </>
        } />
        <Route path="/grupos" element={<Groups />} />
        <Route path="/expo-unlu" element={<ExpoUnlu />} />
        <Route path="/cacic" element={<Cacic />} />
        <Route path="/transparencia" element={<Transparencia />} />
        <Route path="/calendario" element={<CalendarPage />} />

        <Route path="/colaborar" element={<ColaborarPage />} />
        <Route path="/encuestas" element={<EncuestasPage />} />
        <Route path="/charlas" element={<CharlasPage />} />
        <Route path="/admin" element={<AdminPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/test-dashboard" element={<TestDashboard />} />
        <Route path="/dashboard" element={
          <ProtectedRoute>
            <Dashboard />
          </ProtectedRoute>
        } />
      </Routes>
      
      {/* Solo renderizar footer si NO estamos en el dashboard */}
      {!isDashboard && (
        <>
          <Footer />
          <BackToTop />
          <ScrollToTop />
        </>
      )}
      
      {/* Mascot - aparece en todas las páginas excepto dashboard */}

    </div>
  );
}

function App() {

  useEffect(() => {
    // Force dark mode
    document.documentElement.setAttribute('data-theme', 'dark');
    document.body.style.backgroundColor = '#0f0f0f';
    document.body.style.color = '#ffffff';
  }, []);

  return (
    <AuthProvider>
      <Router>
        <AppContent />
      </Router>
    </AuthProvider>
  );
}

export default App;
