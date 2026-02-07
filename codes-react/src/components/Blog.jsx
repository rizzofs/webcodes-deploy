import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Card, Button, Modal } from 'react-bootstrap';
import newsService from '../services/newsService';
import './Blog.css';

const Blog = () => {
  const [news, setNews] = useState([]);
  const [selectedNews, setSelectedNews] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const data = await newsService.getAll(true);
        setNews(data);
      } catch (error) {
        console.error('Error fetching news:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchNews();
  }, []);

  const handleShowModal = (item) => {
    setSelectedNews(item);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedNews(null);
  };

  if (loading) return null;

  return (
    <section id="blog" className="py-5">
      <Container>
        <div className="text-center mb-5">
          <h2 className="section-title">📰 Blog y Noticias</h2>
          <p className="section-subtitle">
            Mantente informado sobre las últimas novedades, eventos y recursos de CODES++
          </p>
        </div>

        {news.length > 0 ? (
          <Row>
            {news.map((item) => (
              <Col md={4} key={item.id} className="mb-4">
                <Card className="blog-card h-100">
                  {item.image_url && (
                    <div className="card-image">
                      <Card.Img variant="top" src={item.image_url} />
                    </div>
                  )}
                  <Card.Body className="d-flex flex-column">
                    <div className="card-meta mb-2">
                      <small>{new Date(item.created_at).toLocaleDateString()}</small>
                    </div>
                    <Card.Title className="card-title">{item.title}</Card.Title>
                    <Card.Text className="card-excerpt">
                      {item.excerpt}
                    </Card.Text>
                    <div className="mt-auto">
                      <Button 
                        variant="link" 
                        className="read-more-btn text-decoration-none p-0"
                        onClick={() => handleShowModal(item)}
                      >
                        Leer más <i className="fas fa-arrow-right ms-1"></i>
                      </Button>
                    </div>
                  </Card.Body>
                </Card>
              </Col>
            ))}
          </Row>
        ) : (
          <div className="text-center py-5">
            <div className="coming-soon-container">
              <div className="coming-soon-icon mb-4">
                <i className="fas fa-newspaper fa-4x text-primary"></i>
              </div>
              <h3 className="coming-soon-title mb-3">Próximamente</h3>
              <p className="coming-soon-text text-muted">
                Estamos preparando contenido exclusivo para ti. 
                <br />
                ¡Mantente atento a las novedades!
              </p>
            </div>
          </div>
        )}

        {/* Modal for Full News Content */}
        <Modal show={showModal} onHide={handleCloseModal} size="lg" centered>
          {selectedNews && (
            <>
              <Modal.Header closeButton>
                <Modal.Title>{selectedNews.title}</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                {selectedNews.image_url && (
                  <img 
                    src={selectedNews.image_url} 
                    alt={selectedNews.title} 
                    className="img-fluid mb-4 rounded"
                    style={{ width: '100%', maxHeight: '400px', objectFit: 'cover' }}
                  />
                )}
                <div className="news-meta mb-3 text-muted">
                  <small>
                    <i className="far fa-calendar-alt me-2"></i>
                    {new Date(selectedNews.created_at).toLocaleDateString()}
                  </small>
                  {selectedNews.author?.full_name && (
                    <small className="ms-3">
                      <i className="far fa-user me-2"></i>
                      {selectedNews.author.full_name}
                    </small>
                  )}
                </div>
                <div className="news-content" style={{ whiteSpace: 'pre-wrap' }}>
                  {selectedNews.content || selectedNews.excerpt}
                </div>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={handleCloseModal}>
                  Cerrar
                </Button>
              </Modal.Footer>
            </>
          )}
        </Modal>
      </Container>
    </section>
  );
};

export default Blog;
