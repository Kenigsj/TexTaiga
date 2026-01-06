// components/ModerationPage.js
import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import logo from '../logo.png';
import photo from '../fon.png';
import './../App.css';


const ModerationPage = () => {
  const [photos, setPhotos] = useState([
    { id: 1, src: photo, title: 'Фото 1', status: 'pending' },
    { id: 2, src: photo, title: 'Фото 2', status: 'pending' },
    { id: 3, src: photo, title: 'Фото 3', status: 'pending' },
    { id: 4, src: photo, title: 'Фото 4', status: 'pending' },
    { id: 5, src: photo, title: 'Фото 5', status: 'pending' },
    { id: 6, src: photo, title: 'Фото 6', status: 'pending' },
  ]);
  
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { category } = useParams();

  const nominationTitles = {
    'best-photographer': 'Лучший фотограф',
    'nomination-2': '2 НОМИНАЦИЯ',
    'nomination-3': '3 НОМИНАЦИЯ',
    'nomination-4': '4 НОМИНАЦИЯ'
  };

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const handleApprove = (photoId) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, status: 'approved' } : photo
    ));
    setIsModalOpen(false);
    alert(`Фото ${photoId} одобрено!`);
  };

  const handleReject = (photoId) => {
    setPhotos(photos.map(photo => 
      photo.id === photoId ? { ...photo, status: 'rejected' } : photo
    ));
    setIsModalOpen(false);
    alert(`Фото ${photoId} отклонено!`);
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'approved': return '#28a745'; // Зеленый
      case 'rejected': return '#dc3545'; // Красный
      default: return '#6c757d'; // Серый
    }
  };

  const getStatusText = (status) => {
    switch(status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      default: return 'На рассмотрении';
    }
  };

  return (
    <div className="nominations-page">
      {/* Шапка с логотипом и навигацией */}
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
  
  {/* Кнопка Личный кабинет */}
  <button className="cabinet-nav-button" onClick={() => navigate('/cabinet')}>
    Личный кабинет
  </button>
</header>

      {/* Основной контент */}
      <main className="nominations-content">
        <div className="nominations-container">
          <div className="nomination-title-card">
            <h2 className="nomination-title-text">
              {nominationTitles[category] || 'Номинация'} - Модерация
            </h2>
            <p className="moderation-subtitle">Рассмотрение загруженных фотографий</p>
          </div>

          {/* Статистика */}
          <div className="moderation-stats">
            <div className="stat-item">
              <span className="stat-number">{photos.length}</span>
              <span className="stat-label">Всего фото</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{photos.filter(p => p.status === 'pending').length}</span>
              <span className="stat-label">На рассмотрении</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{photos.filter(p => p.status === 'approved').length}</span>
              <span className="stat-label">Одобрено</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{photos.filter(p => p.status === 'rejected').length}</span>
              <span className="stat-label">Отклонено</span>
            </div>
          </div>

          {/* Список фотографий */}
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

      {/* Модальное окно для увеличенного просмотра фото */}
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
                onClick={() => handleReject(selectedPhoto.id)}
                disabled={selectedPhoto.status !== 'pending'}
              >
                Отклонить
              </button>
              <button 
                className="moderation-button approve-button"
                onClick={() => handleApprove(selectedPhoto.id)}
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