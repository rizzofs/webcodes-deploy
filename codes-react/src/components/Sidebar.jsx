import React, { useState, useEffect } from 'react';
import { Nav } from 'react-bootstrap';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import './Sidebar.css';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('');
  const [isScrolling, setIsScrolling] = useState(false);
  const { isAuthenticated, user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      // Only update active section if sidebar is closed
      if (!isOpen) {
        const sections = ['hero', 'nosotros', 'integrantes', 'eventos', 'extra', 'faq', 'colaboradores', 'contacto'];
        const scrollPosition = window.scrollY + 100;

        for (const section of sections) {
          const element = document.getElementById(section);
          if (element) {
            const { offsetTop, offsetHeight } = element;
            if (scrollPosition >= offsetTop && scrollPosition < offsetTop + offsetHeight) {
              setActiveSection(section);
              break;
            }
          }
        }
      }
    };

    const handleResize = () => {
      if (window.innerWidth < 1200) {
        setIsOpen(false);
      }
    };

    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        setIsOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    window.addEventListener('resize', handleResize);
    document.addEventListener('keydown', handleEscape);

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleResize);
      document.removeEventListener('keydown', handleEscape);
    };
  }, [isOpen]);

  // Handle body scroll when sidebar is open
  useEffect(() => {
    if (isOpen) {
      // Store current scroll position
      const scrollY = window.scrollY;
      document.body.style.position = 'fixed';
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = '100%';
      document.body.classList.add('sidebar-open');
    } else {
      // Restore scroll position
      const scrollY = document.body.style.top;
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('sidebar-open');
      if (scrollY) {
        window.scrollTo(0, parseInt(scrollY || '0') * -1);
      }
    }

    return () => {
      // Cleanup on unmount
      document.body.style.position = '';
      document.body.style.top = '';
      document.body.style.width = '';
      document.body.classList.remove('sidebar-open');
    };
  }, [isOpen]);

  const navItems = [
    { id: 'hero', label: 'Inicio', icon: 'fas fa-home' },
    { id: 'nosotros', label: 'Nosotros', icon: 'fas fa-users' },
    { id: 'integrantes', label: 'Integrantes', icon: 'fas fa-user-friends' },
    { id: 'eventos', label: 'Actividades', icon: 'fas fa-calendar-alt' },
    { id: 'calendario', label: 'Calendario', icon: 'fas fa-calendar-check', external: true, href: '/calendario' },

    { id: 'colaborar', label: 'Colaborar en Proyectos', icon: 'fas fa-users-cog', external: true, href: '/colaborar' },
    { id: 'encuestas', label: 'Encuestas', icon: 'fas fa-poll-h', external: true, href: '/encuestas' },
    { id: 'charlas', label: 'Charlas', icon: 'fas fa-video', external: true, href: '/charlas' },
    { id: 'cacic', label: 'CACIC', icon: 'fas fa-graduation-cap', external: true, href: '/cacic' },
    { id: 'extra', label: 'Recursos', icon: 'fas fa-folder-open' },
    { id: 'blog', label: 'Blog', icon: 'fas fa-newspaper' },
    { id: 'faq', label: 'FAQ', icon: 'fas fa-question-circle' },
    { id: 'contacto', label: 'Contacto', icon: 'fas fa-envelope' },
    { id: 'grupos', label: 'Grupos de Estudio', icon: 'fas fa-graduation-cap', external: true, href: '/grupos' },
    ...(isAuthenticated ? [
      { id: 'dashboard', label: 'Dashboard', icon: 'fas fa-tachometer-alt', external: true, href: '/dashboard' }
    ] : [])
  ];

  // Secciones que solo existen en la página principal
  const homeSections = ['hero', 'nosotros', 'integrantes', 'eventos', 'extra', 'blog', 'faq', 'colaboradores', 'contacto'];

  const scrollToElement = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerOffset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      
      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };

  const scrollToSection = (sectionId) => {
    // Cerrar sidebar inmediatamente al hacer click en cualquier opción
    setIsOpen(false);
    
    const isHomePage = location.pathname === '/';

    // Buscar si el item tiene href (es una página interna separada)
    const navItem = navItems.find(item => item.id === sectionId);
    if (navItem?.external && navItem?.href) {
      navigate(navItem.href);
      return;
    }
    
    // Si es una sección de la home
    if (homeSections.includes(sectionId)) {
      if (isHomePage) {
        // Estamos en la home: simplemente hacer scroll
        setTimeout(() => scrollToElement(sectionId), 300);
      } else {
        // Estamos en otra página: navegar a la home y luego scroll
        navigate('/');
        // Esperar a que la home se renderice y luego hacer scroll
        setTimeout(() => {
          if (sectionId === 'hero') {
            window.scrollTo({ top: 0, behavior: 'smooth' });
          } else {
            scrollToElement(sectionId);
          }
        }, 500);
      }
      return;
    }
    
    // Fallback: intentar scroll directo
    setTimeout(() => scrollToElement(sectionId), 300);
  };

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  return (
    <>
      {/* Sidebar Toggle Button - Always Visible */}
      <button 
        className={`sidebar-toggle ${isOpen ? 'active' : ''}`}
        onClick={toggleSidebar}
        aria-label="Toggle navigation"
      >
        <div className={`hamburger ${isOpen ? 'active' : ''}`}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </button>

      {/* Sidebar Overlay */}
      <div 
        className={`sidebar-overlay ${isOpen ? 'active' : ''}`}
        onClick={() => setIsOpen(false)}
        onTouchStart={() => setIsOpen(false)}
      ></div>

      {/* Sidebar */}
      <aside className={`sidebar ${isOpen ? 'open' : ''}`}>
        <div className="sidebar-header">
          <div className="sidebar-logo">
            <div className="logo-icon">
              <i className="fas fa-code"></i>
            </div>
            <div className="logo-text">
              <h3>CODES++</h3>
              <span>Centro de Estudiantes</span>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <Nav className="flex-column">
            {navItems.map((item, index) => (
              <Nav.Item key={item.id} className="nav-item">
                <button
                  className={`nav-link ${activeSection === item.id ? 'active' : ''}`}
                  onClick={() => scrollToSection(item.id)}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="nav-icon">
                    <i className={item.icon}></i>
                  </div>
                  <span className="nav-label">{item.label}</span>
                  <div className="nav-indicator"></div>
                </button>
              </Nav.Item>
            ))}
          </Nav>
        </nav>



        {/* Sidebar Particles */}
        <div className="sidebar-particles">
          <div className="particle"></div>
          <div className="particle"></div>
          <div className="particle"></div>
        </div>
      </aside>
    </>
  );
};

export default Sidebar;
