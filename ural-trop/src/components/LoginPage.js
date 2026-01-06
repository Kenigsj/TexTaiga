// components/LoginPage.js
import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import logo from './../logo.png';
import './../App.css';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Простая проверка - если поля не пустые, переходим на главную
    if (login.trim() && password.trim()) {
      // В реальном приложении здесь будет запрос к API для получения роли
      // Сейчас используем заглушку: если логин содержит "moder", то модератор
      const userRole = login.toLowerCase().includes('moder') ? 'moderation' : 'jury';
      
      // Сохраняем пользователя
      setUser({ login, role: userRole });
      
      navigate('/main');
    }
  };

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>
      </header>

      <main className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">Авторизация</h1>
          
          <form className="login-form" onSubmit={handleSubmit}>
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

            <button type="submit" className="login-button">
              Войти
            </button>

            <div className="text-center">
              <a href="#forgot" className="forgot-link">
                Забыли пароль?
              </a>
            </div>
            
            <div className="text-center mt-3">
              <span className="text-muted">Нет аккаунта? </span>
              <a href="/register" className="auth-link" onClick={(e) => {
                e.preventDefault();
                navigate('/register');
              }}>
                Зарегистрироваться
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;