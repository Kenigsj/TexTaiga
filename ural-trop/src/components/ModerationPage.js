import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const ModerationPage = () => {
  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { category } = useParams();

  const nominationTitles = {
    'best-photographer': 'Лучший фотограф',
    'nomination-2': '2 НОМИНАЦИЯ',
    'nomination-3': '3 НОМИНАЦИЯ',
    'nomination-4': '4 НОМИНАЦИЯ'
  };

  const nominationNumber = useMemo(() => {
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
      const res = await fetch(`${API}/api/participants?nomination=${nominationNumber}`, {
        headers: { Authorization: token }
      });
      const text = await res.text();
      if (text === "UNAUTHORIZED") {
        navigate("/login");
        return;
      }
      const data = JSON.parse(text);
      setPhotos(data.map(p => ({
        id: p.id,
        src: p.photoUrl,
        title: p.fio || `Фото ${p.id}`,
        status: p.status || 'pending'
      })));
    } catch {
      setError("Не удалось загрузить список");
    }
  };

  useEffect(() => { load(); }, [nominationNumber]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const postModeration = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/moderation/participant/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: token }
      });
      const text = await res.text();
      if (text === "OK") {
        await load();
        setIsModalOpen(false);
        return;
      }
      alert("Ошибка: " + text);
    } catch {
      alert("Не удалось подключиться к серверу");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      default: return 'На рассмотрении';
    }
  };

  const pendingCount = photos.filter(p => p.status === 'pending').length;
  const approvedCount = photos.filter(p => p.status === 'approved').length;
  const rejectedCount = photos.filter(p => p.status === 'rejected').length;

  return (
    <div className="nominations-page">
      <header className="nominations-header">
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

      <main className="nominations-content">
        <div className="nominations-container">
          <div className="nomination-title-card">
            <h2 className="nomination-title-text">
              {nominationTitles[category] || 'Номинация'} - Модерация
            </h2>
            <p className="moderation-subtitle">Рассмотрение загруженных фотографий</p>
          </div>

          <div className="moderation-stats">
            <div className="stat-item">
              <span className="stat-number">{photos.length}</span>
              <span className="stat-label">Всего фото</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{pendingCount}</span>
              <span className="stat-label">На рассмотрении</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{approvedCount}</span>
              <span className="stat-label">Одобрено</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{rejectedCount}</span>
              <span className="stat-label">Отклонено</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <div className="photos-grid">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="photo-item"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="photo-thumbnail">
                  <img src={photo.src} alt={photo.title} className="photo-thumb" />
                  <div
                    className="photo-status-badge"
                    style={{ backgroundColor: getStatusColor(photo.status) }}
                  >
                    {getStatusText(photo.status)}
                  </div>
                </div>
                <div className="photo-info">
                  <h4 className="photo-title">{photo.title}</h4>
                  <p className="photo-id">ID: {photo.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && selectedPhoto && (
        <div className="moderation-modal-overlay" onClick={handleCloseModal}>
          <div className="moderation-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Просмотр фото #{selectedPhoto.id}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <img src={selectedPhoto.src} alt={selectedPhoto.title} className="modal-photo" />

              <div className="photo-details">
                <h4>{selectedPhoto.title}</h4>
                <p>Статус: <span style={{ color: getStatusColor(selectedPhoto.status) }}>
                  {getStatusText(selectedPhoto.status)}
                </span></p>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="moderation-button reject-button"
                onClick={() => postModeration(selectedPhoto.id, "reject")}
                disabled={selectedPhoto.status !== 'pending'}
              >
                Отклонить
              </button>
              <button
                className="moderation-button approve-button"
                onClick={() => postModeration(selectedPhoto.id, "approve")}
                disabled={selectedPhoto.status !== 'pending'}
              >
                Одобрить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;
