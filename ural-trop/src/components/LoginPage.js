// components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../Group 3.png';
import './../App.css';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    if (login.trim() && password.trim()) {
      navigate('/main');
    }
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
          <h1 className="login-title">Авторизация</h1>
          
          <form className="login-form" onSubmit={handleSubmit}>
            {/* Поле Логин с плавающим лейблом */}
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder=" " // Важно: пробел для работы кастомного placeholder
                required
              />
              <label className="input-label">Логин</label>
            </div>

            {/* Поле Пароль с плавающим лейблом */}
            <div className="input-container">
              <input
                type="password"
                className="form-input password-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder=" " // Важно: пробел для работы кастомного placeholder
                required
              />
              <label className="input-label">Пароль</label>
            </div>

            {/* Кнопка входа (теперь красная) */}
            <button 
              type="submit" 
              className="login-button"
            >
              Войти
            </button>

            {/* Ссылка "Забыли пароль?" (теперь черная и подчеркнутая) */}
            <div className="text-center">
              <a href="#forgot" className="forgot-link">
                Забыли пароль?
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;