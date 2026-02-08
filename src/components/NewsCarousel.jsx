import React, { useState, useEffect } from 'react';
import { Container, Carousel, Button } from 'react-bootstrap';
import newsService from '../services/newsService';
import './NewsCarousel.css';

const getIconForCategory = (category) => {
  switch (category) {
    case 'Charla': return 'microphone-alt';
    case 'Evento': return 'calendar-alt';
    case 'Aviso': return 'bullhorn';
    default: return 'newspaper';
  }
};

const NewsCarousel = () => {
  const [news, setNews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let mounted = true;
    const fetchNews = async () => {
      try {
        // Attempt 1: Try to fetch with categories and authors (Full Rich Data)
        // Set a timeout for the fetch
        const timeoutPromise = new Promise((_, reject) => 
          setTimeout(() => reject(new Error('Timeout_Rich')), 8000)
        );
        const fetchPromise = newsService.getAll(true);
        const data = await Promise.race([fetchPromise, timeoutPromise]);
        
        if (mounted) {
          setNews(data.slice(0, 5));
          setError(null);
        }
      } catch (err) {
        console.warn('Rich fetch failed, trying simple fetch:', err);
        
        // Attempt 2: Fallback to Simple Data (Safe Mode)
        try {
            const timeoutPromiseSafe = new Promise((_, reject) => 
              setTimeout(() => reject(new Error('Timeout_Safe')), 8000)
            );
            const fetchPromiseSafe = newsService.getAllSimple(true);
            const dataSafe = await Promise.race([fetchPromiseSafe, timeoutPromiseSafe]);

            if (mounted) {
                setNews(dataSafe.slice(0, 5));
                setError(null);
            }
        } catch (errSafe) {
             console.error('Safe fetch also failed:', errSafe);
             if (mounted) {
               setError('No se pudo conectar con el servidor de noticias.');
             }
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    fetchNews();
    
    return () => { mounted = false; };
  }, []);

  const handleReadMore = () => {
    const blogSection = document.getElementById('blog');
    if (blogSection) {
      const headerOffset = 80;
      const elementPosition = blogSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: 'smooth'
      });
    }
  };


  if (loading) {
    return (
      <section className="news-carousel-section">
        <Container>
          <div className="text-center p-5">
             <i className="fas fa-spinner fa-spin fa-2x"></i>
             <span className="ms-2">Cargando novedades...</span>
          </div>
        </Container>
      </section>
    );
  }

  if (error) {
     return (
        <section className="news-carousel-section">
            <Container>
                <div className="text-center p-4 text-danger">
                    <i className="fas fa-exclamation-triangle mb-2"></i>
                    <p>No se pudieron cargar las noticias: {error}</p>
                    <small>Verifica tu conexión o la base de datos.</small>
                </div>
            </Container>
        </section>
     );
  }

  // Render simplified view or nothing if no news, but let's show something for debugging if needed
  // specific user request: "Ultimas novedades deberian ser etiquetas..." implies they want to see it.
  if (news.length === 0) {
     return (
        <section className="news-carousel-section">
            <Container>
                <div className="carousel-title-wrapper">
                    <h2 className="carousel-title">Últimas Novedades</h2>
                    <p className="text-muted">Próximamente publicaremos noticias.</p>
                </div>
            </Container>
        </section>
     );
  }

  return (
    <section className="news-carousel-section">
      <Container>
        <div className="carousel-title-wrapper">
          <h2 className="carousel-title">Últimas Novedades</h2>
          <p className="text-muted">Entérate de todo lo que está pasando en CODES++</p>
        </div>

        <Carousel className="carousel-custom" interval={5000} pause="hover">
          {news.map((item) => (
            <Carousel.Item key={item.id}>
              <div 
                className="carousel-item-content"
                style={{ 
                  backgroundImage: `url(${item.image_url || 'https://via.placeholder.com/1200x600?text=CODES++'})` 
                }}
              >
                <div className="carousel-overlay">
                  <div className="carousel-text-content">
                    <span className={`carousel-badge bg-${(item.category || 'Noticia').toLowerCase()}`}>
                      <i className={`fas fa-${getIconForCategory(item.category)} me-2`}></i>
                      {item.category || 'Noticia'}
                    </span>
                    <h3 className="carousel-item-title">{item.title}</h3>
                    <p className="carousel-description">
                      {item.excerpt || "Haz clic para leer la noticia completa..."}
                    </p>
                    <Button 
                      className="carousel-btn"
                      onClick={handleReadMore}
                    >
                      Leer noticia completa
                      <i className="fas fa-arrow-right"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </Carousel.Item>
          ))}
        </Carousel>
      </Container>
    </section>
  );
};

export default NewsCarousel;
