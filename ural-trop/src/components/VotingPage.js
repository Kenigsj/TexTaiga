import React, { useEffect, useMemo, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const VotingPage = () => {
  const navigate = useNavigate();
  const [selectedRating, setSelectedRating] = useState(0);
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState('');
  const { category } = useParams();

  const nominationTitles = {
    'best-photographer': 'Лучший фотограф',
    'nomination-2': '2 НОМИНАЦИЯ',
    'nomination-3': '3 НОМИНАЦИЯ',
    'nomination-4': '4 НОМИНАЦИЯ'
  };

  const nomination = useMemo(() => {
    switch (category) {
      case "best-photographer": return 1;
      case "nomination-2": return 2;
      case "nomination-3": return 3;
      case "nomination-4": return 4;
      default: return 1;
    }
  }, [category]);

  const load = async () => {
    setError('');
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/participants?nomination=${nomination}`, {
        headers: { Authorization: token }
      });
      const text = await res.text();
      if (text === "UNAUTHORIZED") {
        navigate("/login");
        return;
      }
      const data = JSON.parse(text);
      const mapped = data.map(p => ({
        id: p.id,
        src: p.photoUrl,
        fio: p.fio || ''
      }));
      setPhotos(mapped);
      setCurrentPhotoIndex(0);
    } catch {
      setError("Не удалось загрузить фотографии");
    }
  };

  useEffect(() => { load(); }, [nomination]);

  const handleVote = async () => {
    if (selectedRating === 0) {
      alert('Пожалуйста, выберите оценку');
      return;
    }

    if (!photos.length) {
      alert("Нет фотографий для голосования");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Ошибка: вы не авторизованы");
        return;
      }

      const participantId = photos[currentPhotoIndex].id;

      const response = await fetch(`${API}/api/vote/set`, {
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
      alert("Не удалось отправить голосование");
    }
  };

  const handleNextPhoto = () => {
    if (!photos.length) return;
    setSelectedRating(0);
    setCurrentPhotoIndex((prev) => (prev + 1) % photos.length);
  };

  const handlePrevPhoto = () => {
    if (!photos.length) return;
    setSelectedRating(0);
    setCurrentPhotoIndex((prev) => (prev - 1 + photos.length) % photos.length);
  };

  const handleCloseModal = () => {
    setShowSuccessModal(false);
    handleNextPhoto();
  };

  const current = photos.length ? photos[currentPhotoIndex] : null;

  return (
    <div className="voting-page">
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

        <button className="cabinet-nav-button" onClick={() => navigate('/cabinet')}>
          Личный кабинет
        </button>
      </header>

      <main className="voting-content">
        <div className="voting-container">
          <div className="nomination-title-card">
            <h2 className="nomination-title-text">
              {nominationTitles[category] || 'Номинация'}
            </h2>
          </div>

          {error && <div className="error-message">{error}</div>}

          {!current ? (
            <div className="error-message">Нет одобренных фотографий</div>
          ) : (
            <>
              <h3 className="participant-name">{current.fio || `Участник #${current.id}`}</h3>

              <div className="photo-section">
                <div className="photo-container">
                  <button className="photo-arrow arrow-left" onClick={handlePrevPhoto}>‹</button>

                  <img
                    src={current.src}
                    alt="Работа участника"
                    className="photo-image"
                  />

                  <button className="photo-arrow arrow-right" onClick={handleNextPhoto}>›</button>
                </div>
              </div>

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

              <button className="vote-button" onClick={handleVote}>
                Проголосовать
              </button>
            </>
          )}
        </div>
      </main>

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
