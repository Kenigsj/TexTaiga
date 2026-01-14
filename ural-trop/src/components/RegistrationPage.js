import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import logo from './../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const RegistrationPage = () => {
  const [login, setLogin] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [role, setRole] = useState('jury');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return;
    }

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

    try {
      const res = await fetch(`${API}/api/auth/register`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/x-www-form-urlencoded"
        },
        body: new URLSearchParams({ login, password, role })
      });

      const text = await res.text();

      if (text === "FORBIDDEN") {
        setError("Нет прав: регистрацию может делать только админ");
        return;
      }

      if (text === "EXISTS") {
        setError("Логин уже занят");
        return;
      }

      if (text === "INVALID") {
        setError("Ошибка регистрации");
        return;
      }

      if (text !== "OK") {
        setError("Ошибка: " + text);
        return;
      }

      setSuccess("Пользователь успешно зарегистрирован");
      setLogin('');
      setPassword('');
      setConfirmPassword('');
      setRole('jury');
    } catch {
      setError("Не удалось подключиться к серверу");
    }
  };

  const displayRole =
    user?.role ||
    localStorage.getItem("userRole") ||
    '';

  return (
    <div className="login-page">
      <header className="login-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>
      </header>

      <main className="login-content">
        <div className="login-form-container">
          <h1 className="login-title">Регистрация</h1>

          {displayRole !== "admin" && (
            <div className="error-message">
              Доступ запрещен: страницу регистрации новых пользователей видит только админ.
            </div>
          )}

          <form className="login-form" onSubmit={handleSubmit}>
            <div className="input-container">
              <input
                type="text"
                className="form-input"
                value={login}
                onChange={(e) => setLogin(e.target.value)}
                placeholder=" "
                required
                disabled={displayRole !== "admin"}
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
                disabled={displayRole !== "admin"}
              />
              <label className="input-label">Пароль</label>
            </div>

            <div className="input-container">
              <input
                type="password"
                className="form-input password-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder=" "
                required
                disabled={displayRole !== "admin"}
              />
              <label className="input-label">Подтверждение пароля</label>
            </div>

            <div className="role-selection">
              <label className="role-label">Выберите роль:</label>
              <div className="role-buttons">
                <button
                  type="button"
                  className={`role-button ${role === 'jury' ? 'active' : ''}`}
                  onClick={() => setRole('jury')}
                  disabled={displayRole !== "admin"}
                >
                  Жюри
                </button>
                <button
                  type="button"
                  className={`role-button ${role === 'moderator' ? 'active' : ''}`}
                  onClick={() => setRole('moderator')}
                  disabled={displayRole !== "admin"}
                >
                  Модерация
                </button>
              </div>
            </div>

            {error && <div className="error-message">{error}</div>}
            {success && <div className="message success">{success}</div>}

            <button
              type="submit"
              className="login-button"
              disabled={displayRole !== "admin"}
            >
              Зарегистрировать
            </button>

            <div className="text-center mt-3">
              <a
                href="/cabinet"
                className="auth-link"
                onClick={(e) => {
                  e.preventDefault();
                  navigate('/cabinet');
                }}
              >
                Назад в личный кабинет
              </a>
            </div>
          </form>
        </div>
      </main>
    </div>
  );
};

export default RegistrationPage;
