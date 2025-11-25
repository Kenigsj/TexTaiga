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

  function getNominationNumber(cat) {
    switch (cat) {
      case "best-photographer": return 1;
      case "nomination-2": return 2;
      case "nomination-3": return 3;
      case "nomination-4": return 4;
      default: return 1;
    }
  }

  const handleVote = async () => {
    if (selectedRating === 0) {
      alert('Пожалуйста, выберите оценку');
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Ошибка: вы не авторизованы");
        return;
      }

      const participantId = 1;
      const nomination = getNominationNumber(category);

      const response = await fetch("http://localhost:8080/api/vote/set", {
        method: "POST",
        headers: {
          "Authorization": token,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({
          participantId,
          nomination,
          score: selectedRating
        })
      });

      const text = await response.text();

      if (text === "OK") {
        setShowSuccessModal(true);
      } else {
        alert("Ошибка сервера: " + text);
      }

    } catch (err) {
      console.error(err);
      alert("Не удалось отправить голосование");
    }
  };

  const handleNextPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
  };

  return (
    <div className="voting-page">

      {/* Шапка */}
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

          {/* Заголовок номинации */}
          <div className="nomination-title-card">
            <h2 className="nomination-title-text">
              {nominationTitles[category] || 'Номинация'}
            </h2>
          </div>

          {/* Имя участника */}
          <h3 className="participant-name">Алексей Сидоров</h3>

          {/* Фото */}
          <div className="photo-section">
            <div className="photo-container">
              <button className="photo-arrow arrow-left" onClick={handlePrevPhoto}>‹</button>

              <img
                src={photos[currentPhotoIndex].src}
                alt="Работа участника"
                className="photo-image"
              />

              <button className="photo-arrow arrow-right" onClick={handleNextPhoto}>›</button>
            </div>
          </div>

          {/* Рейтинг */}
          <div className="rating-section">
            <div className="rating-numbers">
              {Array.from({ length: 10 }, (_, i) => i + 1).map(rating => (
                <button
                  key={rating}
                  className={`rating-number ${selectedRating === rating ? 'active' : ''}`}
                  onClick={() => setSelectedRating(rating)}
                >
                  {rating}
                </button>
              ))}
            </div>
          </div>

          {/* Кнопка */}
          <button className="vote-button" onClick={handleVote}>
            Проголосовать
          </button>

        </div>
      </main>

      {/* Модальное окно */}
      {showSuccessModal && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h1 className="modal-title">УРАЛЬСКИЕ ТРОПЫ</h1>
            <h2 className="modal-subtitle">Голосование</h2>
            <p className="modal-message">Вы успешно проголосовали за фотографию!</p>
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
