// components/SuccessPage.js
import React from 'react';
import { Container, Card, Button } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';

const SuccessPage = () => {
  const navigate = useNavigate();

  return (
    <div>
      <div className="ural-header">
        <h1 className="ural-title">УРАЛЬСКИЕ ТРОПЫ</h1>
      </div>

      <Container>
        <Card className="success-message">
          <Card.Body className="text-center">
            <h2>Голосование</h2>
            <p className="lead mt-4 mb-4">
              Вы успешно проголосовали за фотографию!
            </p>
            <Button 
              variant="primary" 
              onClick={() => navigate('/main')}
              size="lg"
            >
              Вернуться к номинациям
            </Button>
          </Card.Body>
        </Card>
      </Container>
    </div>
  );
};

export default SuccessPage;