import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import logo from '../logo.png';
import fon from '../fon.png';
import './../App.css';

const API = "http://localhost:8080";

const PersonalCabinetPage = () => {
  const { user, setUser } = useContext(UserContext);
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmNewPassword, setConfirmNewPassword] = useState('');
  const [deletePassword, setDeletePassword] = useState('');
  const [showChangePassword, setShowChangePassword] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/api/auth/me`, { headers: { Authorization: token } })
      .then(r => r.text())
      .then(t => {
        if (t === "UNAUTHORIZED") return;
        const me = JSON.parse(t);
        localStorage.setItem("userLogin", me.login);
        localStorage.setItem("userRole", me.role);
        localStorage.setItem("registeredDate", me.registeredDate);
        setUser({ id: me.id, login: me.login, role: me.role, registeredDate: me.registeredDate });
      })
      .catch(() => {});
  }, [setUser]);

  const userData = {
    login: user?.login || localStorage.getItem('userLogin') || '',
    role: user?.role || localStorage.getItem('userRole') || '',
    registeredDate: user?.registeredDate || localStorage.getItem('registeredDate') || ''
  };

  const handleChangePassword = async (e) => {
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

    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/auth/change-password`, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ currentPassword, newPassword })
      });

      const text = await res.text();
      if (text === "OK") {
        setSuccess('Пароль успешно изменен!');
        setCurrentPassword('');
        setNewPassword('');
        setConfirmNewPassword('');
        setShowChangePassword(false);
        return;
      }
      if (text === "INVALID_PASSWORD") {
        setError("Текущий пароль неверный");
        return;
      }
      setError("Ошибка: " + text);
    } catch {
      setError("Не удалось подключиться к серверу");
    }
  };

  const handleDeleteAccount = (e) => {
    e.preventDefault();
    setError('');
    if (!deletePassword) {
      setError('Введите пароль для подтверждения');
      return;
    }
    setShowDeleteConfirm(true);
  };

  const confirmDeleteAccount = async () => {
    setError('');
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/auth/delete`, {
        method: "POST",
        headers: { Authorization: token, "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ password: deletePassword })
      });

      const text = await res.text();
      if (text !== "OK") {
        setError("Ошибка: " + text);
        setShowDeleteConfirm(false);
        return;
      }

      localStorage.removeItem('userLogin');
      localStorage.removeItem('userRole');
      localStorage.removeItem('registeredDate');
      localStorage.removeItem('token');
      setUser(null);
      navigate('/upload');
    } catch {
      setError("Не удалось подключиться к серверу");
      setShowDeleteConfirm(false);
    }
  };

  const handleBack = () => navigate(-1);

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

        <button className="cabinet-nav-button" onClick={handleBack}>
          Назад
        </button>
      </header>

      <main className="nominations-content" style={{ backgroundImage: `url(${fon})` }}>
        <div className="cabinet-page-container">
          <h1 className="cabinet-page-title">Личный кабинет</h1>

          <div className="cabinet-card-wide">
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

           
{/* Секция администрирования */}
<div className="admin-section">
  <h3 className="section-title">Администрирование</h3>
  
  <div className="admin-buttons">
    <button 
      className="admin-button"
      onClick={() => navigate('/register')}
    >
      Регистрация новых пользователей
    </button>
    
    <button 
      className="admin-button"
      onClick={() => navigate('/admin/competition')}
    >
      Управление конкурсом
    </button>
  </div>
</div>

            <div className="section">
              <h3 className="section-title">Смена пароля</h3>

              {!showChangePassword ? (
                <button
                  className="change-password-button"
                  onClick={() => setShowChangePassword(true)}
                >
                  Сменить пароль
                </button>
              ) : (
                <form onSubmit={handleChangePassword} className="password-form">
                  <div className="form-group">
                    <input
                      type="password"
                      className="form-control-below"
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

            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default PersonalCabinetPage;
