// components/RegistrationPage.js
import React, { useState, useContext } from 'react'; // Добавляем useContext
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App'; // Добавляем импорт
import logo from './../logo.png';
import './../App.css';

const RegistrationPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('jury'); // По умолчанию "жюри"
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext); // Добавляем получение setUser

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');

    // Валидация
    if (!login.trim() || !password.trim() || !confirmPassword.trim()) {
      setError('Все поля обязательны для заполнения');
      return;
    }

    if (password !== confirmPassword) {
      setError('Пароли не совпадают');
      return;
    }

    if (password.length < 6) {
      setError('Пароль должен быть не менее 6 символов');
      return;
    }

    // Сохраняем пользователя
    setUser({ login, role });
    
    // Перенаправляем на главную
    navigate('/main');
  };

  return (
    <div className="login-page">
      {/* Шапка с логотипом */}
      <header className="login-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>
      </header>

      {/* Основной контент */}
      <main className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">Регистрация</h1>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Поле Логин */}
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder=" "
                required
              />
              <label className="input-label">Логин</label>
            </div>

            {/* Поле Пароль */}
            <div className="input-container">
              <input
                type="password"
                className="form-input password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" "
                required
              />
              <label className="input-label">Пароль</label>
            </div>

            {/* Поле Подтверждение пароля */}
            <div className="input-container">
              <input
                type="password"
                className="form-input password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                required
              />
              <label className="input-label">Подтверждение пароля</label>
            </div>

            {/* Выбор роли */}
            <div className="role-selection">
              <label className="role-label">Выберите роль:</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-button ${role === 'jury' ? 'active' : ''}`}
                  onClick={() => setRole('jury')}
                >
                  Жюри
                </button>
                <button
                  type="button"
                  className={`role-button ${role === 'moderation' ? 'active' : ''}`}
                  onClick={() => setRole('moderation')}
                >
                  Модерация
                </button>
              </div>
            </div>

            {/* Сообщение об ошибке */}
            {error && (
              <div className="error-message">
                {error}
              </div>
            )}

            {/* Кнопка регистрации */}
            <button 
              type="submit" 
              className="login-button"
            >
              Зарегистрироваться
            </button>

            {/* Ссылка на авторизацию */}
            <div className="text-center mt-3">
              <span className="text-muted">Уже есть аккаунт? </span>
              <a href="/login" className="auth-link" onClick={(e) => {
                e.preventDefault();
                navigate('/login');
              }}>
                Войти
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;