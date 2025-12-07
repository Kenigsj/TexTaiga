// components/UploadPage.js
import React, { useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import fon from '../image.png';
import './../App.css';

const UploadPage = () => {
  const [file, setFile] = useState(null);
  const [preview, setPreview] = useState(null);
  const [fio, setFio] = useState('');
  const [email, setEmail] = useState('');
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [uploadStatus, setUploadStatus] = useState(null);
  const navigate = useNavigate();

  const handleFileChange = (e) => {
    const selectedFile = e.target.files[0];
    if (selectedFile) {
      processFile(selectedFile);
    }
  };

  const processFile = (selectedFile) => {
    setFile(selectedFile);
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreview(reader.result);
    };
    reader.readAsDataURL(selectedFile);
  };

  const handleDragOver = useCallback((e) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const handleDrop = useCallback((e) => {
    e.preventDefault();
    setIsDragging(false);
    
    const droppedFile = e.dataTransfer.files[0];
    if (droppedFile && droppedFile.type.startsWith('image/')) {
      processFile(droppedFile);
    } else {
      alert('Пожалуйста, загрузите только изображения');
    }
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!file) {
      alert('Пожалуйста, выберите фотографию');
      return;
    }
    
    if (!fio.trim()) {
      alert('Пожалуйста, введите ФИО');
      return;
    }
    
    if (!email.trim()) {
      alert('Пожалуйста, введите email');
      return;
    }

    setIsLoading(true);
    setUploadStatus(null);

    // Заглушка вместо реальной отправки на сервер
    setTimeout(() => {
      console.log('Отправленные данные:', {
        file: file.name,
        fio,
        email,
        fileSize: file.size,
        fileType: file.type
      });
      
      setIsLoading(false);
      setUploadStatus({
        type: 'success',
        message: 'Фотография успешно загружена! Данные сохранены в базе.'
      });
      
      // Очистка формы через 3 секунды
      setTimeout(() => {
        setFile(null);
        setPreview(null);
        setFio('');
        setEmail('');
        setUploadStatus(null);
      }, 3000);
    }, 1500);
  };

  const handleJuryRedirect = () => {
    navigate('/login');
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
      </header>

      {/* Кнопка "Вы жюри?" в правом верхнем углу страницы */}
      <button className="jury-page-button" onClick={handleJuryRedirect}>
        Вы жюри?
      </button>

      {/* Основной контент с фоновым изображением */}
      <main 
        className="nominations-content"
        style={{ backgroundImage: `url(${fon})` }}
      >
        <div className="nominations-container">
          <h1 className="nominations-title">КОНКУРС ФОТОГРАФИЙ</h1>
          
          {/* Карточка только для загрузки фото (короткая) */}
          <div className="upload-photo-card">
  <div className="card-body">
    {/* Область перетаскивания файла - УДАЛЕН ЗАГОЛОВОК */}
    <div className="upload-section">
      {/* УДАЛЕН ЗАГОЛОВОК: <h4 className="upload-section-title">Загрузите свою фотографию</h4> */}
      
      <div 
        className={`drop-zone ${isDragging ? 'dragging' : ''} ${preview ? 'has-preview' : ''}`}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={() => document.getElementById('fileInput').click()}
        style={{ cursor: 'pointer' }}
      >
        <input
          id="fileInput"
          type="file"
          accept="image/*"
          onChange={handleFileChange}
          style={{ display: 'none' }}
        />
        
        {preview ? (
          <div className="preview-container">
            <img 
              src={preview} 
              alt="Предпросмотр" 
              className="preview-image"
            />
            <div className="preview-overlay">
              <p className="mb-0">Нажмите или перетащите для замены</p>
              <small>Файл: {file.name}</small>
            </div>
          </div>
        ) : (
          <div className="drop-zone-content">
            <div className="upload-icon">
              📸
            </div>
            <h5>Загрузите свою фотографию</h5> {/* Заголовок остается здесь внутри */}
            <p className="drop-zone-text">Перетащите сюда изображение или нажмите для выбора</p>
            <div className="mt-3">
              <button className="select-file-button">
                Выберите файл
              </button>
            </div>
            <small className="file-types-text">Поддерживаются: JPG, PNG, GIF</small>
          </div>
        )}
      </div>
    </div>
  </div>
</div>

          {/* Форма ввода данных (под карточкой, не на ней) */}
          <form onSubmit={handleSubmit} className="upload-form-below">
            <div className="form-group-below">
              <input
                type="text"
                className="form-control-below"
                placeholder="ФИО"
                value={fio}
                onChange={(e) => setFio(e.target.value)}
                required
              />
            </div>

            <div className="form-group-below">
              <input
                type="email"
                className="form-control-below"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
              <div className="form-text-below">
                На этот email придут результаты конкурса
              </div>
            </div>

            {/* Статус загрузки */}
            {uploadStatus && (
              <div className={`alert-message-below ${uploadStatus.type === 'success' ? 'success' : 'error'}`}>
                {uploadStatus.message}
              </div>
            )}

            {/* Кнопка загрузки */}
            <div className="upload-button-container-below">
              <button 
                type="submit" 
                className="upload-button-below"
                disabled={isLoading || !file}
              >
                {isLoading ? (
                  <>
                    <span className="spinner"></span>
                    Загрузка...
                  </>
                ) : (
                  'Загрузить'
                )}
              </button>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default UploadPage;