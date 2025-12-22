// components/LoginPage.js
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../logo.png';
import './../App.css';

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError(""); // очищаем ошибку

    try {
      const response = await fetch(`http://localhost:8080/api/auth/login?login=${login}&password=${password}`, {
    	method: "POST"
      });

      const token = await response.text();

      if (token === "INVALID") {
        setError("Неверный логин или пароль");
        return;
      }

      // сохраняем токен в память браузера
      localStorage.setItem("token", token);

      // успешный вход
      navigate('/main');

    } catch (err) {
      console.error(err);
      setError("Ошибка соединения с сервером");
    }
  };

  return (
    <div className="login-page">
    {/* Шапка с логотипом - ТОЛЬКО логотип, без навбара */}
    <header className="login-header">
      <div className="logo-container">
        <img src={logo} alt="Уральские тропы" className="logo-image" />
      </div>
      {/* Навбара здесь НЕТ */}
    </header>

      <main className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">Авторизация</h1>

          {error && <p style={{ color: "red", marginBottom: "10px" }}>{error}</p>}

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
