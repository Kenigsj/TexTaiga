// components/PersonalCabinetPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import fon from '../fon.png';
import './../App.css';

const PersonalCabinetPage = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  // Заглушка данных пользователя
  const userData = {
    login: localStorage.getItem('userLogin') || 'user123',
    role: localStorage.getItem('userRole') || 'jury',
    registeredDate: '2024-01-15'
  };

  const handleChangePassword = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (!currentPassword || !newPassword || !confirmNewPassword) {
      setError('Все поля обязательны');
      return;
    }

    if (newPassword !== confirmNewPassword) {
      setError('Новые пароли не совпадают');
      return;
    }

    if (newPassword.length < 6) {
      setError('Новый пароль должен быть не менее 6 символов');
      return;
    }

    // Заглушка
    console.log('Смена пароля:', { user: userData.login });
    setSuccess('Пароль успешно изменен!');
    setCurrentPassword('');
    setNewPassword('');
    setConfirmNewPassword('');
    setShowChangePassword(false);
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setError('');

    if (!deletePassword) {
      setError('Введите пароль для подтверждения');
      return;
    }

    // Заглушка
    console.log('Попытка удаления аккаунта:', userData.login);
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = () => {
    // Заглушка удаления
    console.log('Удаление аккаунта:', userData.login);
    
    // Очищаем localStorage
    localStorage.removeItem('userLogin');
    localStorage.removeItem('userRole');
    localStorage.removeItem('token');
    
    // Перенаправление на страницу загрузки фото
    navigate('/upload');
  };

  const handleBack = () => {
    navigate(-1); // Вернуться назад
  };

  return (
  <div className="nominations-page">
    {/* Шапка */}
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
      
      {/* Кнопка назад - красная */}
      <button className="cabinet-nav-button" onClick={handleBack}>
        Назад
      </button>
    </header>

    <main className="nominations-content" style={{ backgroundImage: `url(${fon})` }}>
      <div className="cabinet-page-container">
        <h1 className="cabinet-page-title">Личный кабинет</h1>
        
        <div className="cabinet-card-wide"> {/* Широкая карточка */}
          {/* Информация о пользователе */}
          <div className="user-info-section">
            <h3 className="section-title">Информация о пользователе</h3>
            
            <div className="info-item">
              <span className="info-label">Логин:</span>
              <span className="info-value">{userData.login}</span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Роль:</span>
              <span className="info-value role-badge">
                {userData.role === 'jury' ? 'Член жюри' : 'Модератор'}
              </span>
            </div>
            
            <div className="info-item">
              <span className="info-label">Дата регистрации:</span>
              <span className="info-value">{userData.registeredDate}</span>
            </div>
          </div>

          {/* Смена пароля - кнопка красная */}
          <div className="section">
            <h3 className="section-title">Смена пароля</h3>
            
            {!showChangePassword ? (
              <button 
                className="change-password-button" // Новая красная кнопка
                onClick={() => setShowChangePassword(true)}
              >
                Сменить пароль
              </button>
            ) : (
              <form onSubmit={handleChangePassword} className="password-form">
                {/* Убираем label, оставляем только placeholder */}
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control-below" // Используем тот же класс что на странице загрузки
                    placeholder="Текущий пароль"
                    value={currentPassword}
                    onChange={(e) => setCurrentPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control-below"
                    placeholder="Новый пароль"
                    value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control-below"
                    placeholder="Повторите новый пароль"
                    value={confirmNewPassword}
                    onChange={(e) => setConfirmNewPassword(e.target.value)}
                    required
                  />
                </div>
                
                <div className="form-buttons">
                  <button type="submit" className="change-password-button">
                    Сохранить
                  </button>
                  <button 
                    type="button" 
                    className="cancel-button"
                    onClick={() => {
                      setShowChangePassword(false);
                      setError('');
                      setSuccess('');
                    }}
                  >
                    Отмена
                  </button>
                </div>
              </form>
            )}
          </div>

          {/* Удаление аккаунта */}
          <div className="section danger-section">
            <h3 className="section-title danger-text">Удаление аккаунта</h3>
            
            {!showDeleteConfirm ? (
              <form onSubmit={handleDeleteAccount} className="delete-form">
                <div className="form-group">
                  <input
                    type="password"
                    className="form-control-below"
                    placeholder="Введите пароль для подтверждения"
                    value={deletePassword}
                    onChange={(e) => setDeletePassword(e.target.value)}
                    required
                  />
                </div>
                
                <button type="submit" className="delete-button-red">
                  Удалить аккаунт
                </button>
              </form>
            ) : (
              <div className="delete-confirmation">
                <p className="confirmation-text danger-text">
                  Вы уверены, что хотите удалить аккаунт? Это действие невозможно отменить.
                </p>
                <div className="form-buttons">
                  <button className="delete-button-red" onClick={confirmDeleteAccount}>
                    Да, удалить
                  </button>
                  <button 
                    className="cancel-button"
                    onClick={() => setShowDeleteConfirm(false)}
                  >
                    Отмена
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Сообщения */}
          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
        </div>
      </div>
    </main>
  </div>
);
};

export default PersonalCabinetPage;