import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import logo from './../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const LoginPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { setUser } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      const res = await fetch(`${API}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: new URLSearchParams({ login, password })
      });

      const token = await res.text();
      if (token === "INVALID") {
        setError("Неверный логин или пароль");
        return;
      }

      localStorage.setItem("token", token);

      const meRes = await fetch(`${API}/api/auth/me`, {
        headers: { Authorization: token }
      });

      const meText = await meRes.text();
      if (meText === "UNAUTHORIZED") {
        setError("Ошибка авторизации");
        return;
      }

      const me = JSON.parse(meText);
      localStorage.setItem("userLogin", me.login);
      localStorage.setItem("userRole", me.role);
      localStorage.setItem("registeredDate", me.registeredDate);

      setUser({ id: me.id, login: me.login, role: me.role, registeredDate: me.registeredDate });

      if (me.role === "admin") {
        navigate('/cabinet');
      } else {
        navigate('/main');
      }
    } catch (e2) {
      setError("Не удалось подключиться к серверу");
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

            {error && <div className="error-message">{error}</div>}

            <button type="submit" className="login-button">
              Войти
            </button>
          </form>
        </div>
      </main>
    </div>
  );
};

export default LoginPage;
