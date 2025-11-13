// components/VotingPage.js
import React, { useState } from 'react';
import { useParams } from 'react-router-dom';
import logo from '../logo.png';
import photo from '../fon.png';
import './../App.css';

const VotingPage = () => {
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const { category } = useParams();

  const nominationTitles = {
    'best-photographer': 'Лучший фотограф',
    'nomination-2': '2 НОМИНАЦИЯ',
    'nomination-3': '3 НОМИНАЦИЯ',
    'nomination-4': '4 НОМИНАЦИЯ'
  };

  const photos = [
    { id: 1, src: photo },
    { id: 2, src: photo },
    { id: 3, src: photo }
  ];

  const handleVote = () => {
    if (selectedRating > 0) {
      setShowSuccessModal(true);
    } else {
      alert('Пожалуйста, выберите оценку');
    }
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  return (
    <div className="voting-page">
      {/* Шапка с логотипом и навигацией */}
      <header className="voting-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>
        
        <nav className="nav-tabs">
          <button className="nav-tab">Карта</button>
          <button className="nav-tab">Маршруты</button>
          <button className="nav-tab">Точки притяжения</button>
          <button className="nav-tab">Три урала</button>
          <button className="nav-tab">Спецпроекты</button>
        </nav>
      </header>

      {/* Основной контент */}
      <main className="voting-content">
        <div className="voting-container">
          {/* Название номинации */}
          <div className="nomination-title-card">
            <h2 className="nomination-title-text">
              {nominationTitles[category] || 'Номинация'}
            </h2>
          </div>

          {/* Имя участника */}
          <h3 className="participant-name">Алексей Сидоров</h3>

          {/* Область с фотографией */}
          <div className="photo-section">
            <div className="photo-container">
              <button className="photo-arrow arrow-left" onClick={handlePrevPhoto}>
                ‹
              </button>

              <img 
                src={photos[currentPhotoIndex].src} 
                alt="Работа участника" 
                className="photo-image"
              />

              <button className="photo-arrow arrow-right" onClick={handleNextPhoto}>
                ›
              </button>
            </div>
          </div>

          {/* Рейтинговая шкала */}
          <div className="rating-section">
            <div className="rating-numbers">
              {Array.from({ length: 10 }, (_, index) => {
                const rating = index + 1;
                return (
                  <button
                    key={rating}
                    className={`rating-number ${selectedRating === rating ? 'active' : ''}`}
                    onClick={() => setSelectedRating(rating)}
                  >
                    {rating}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Кнопка голосования */}
          <button className="vote-button" onClick={handleVote}>
            Проголосовать
          </button>
        </div>
      </main>

      {/* Модальное окно успешного голосования */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1 className="modal-title">УРАЛЬСКИЕ ТРОПЫ</h1>
            <h2 className="modal-subtitle">Голосование</h2>
            <p className="modal-message">
              Вы успешно проголосовали за фотографию!
            </p>
            <button className="modal-close-button" onClick={handleCloseModal}>
              Закрыть
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default VotingPage;