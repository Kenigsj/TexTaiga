import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import fon from '../fon.png';
import './../App.css';

const API = "http://localhost:8080";

const UserManagementPage = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadUsers = async () => {
      setLoading(true);
      setError('');

      try {
        const token = localStorage.getItem("token");
        if (!token) {
          navigate('/login');
          return;
        }

        const res = await fetch(`${API}/api/admin/users`, {
          headers: { Authorization: `Bearer ${token}` }
        });

        const text = await res.text();

        if (text === "UNAUTHORIZED") {
          localStorage.clear();
          navigate('/login');
          return;
        }

        if (text === "FORBIDDEN") {
          setUsers([]);
          setError("Нет доступа: нужна роль admin");
          return;
        }

        let data;
        try {
          data = JSON.parse(text);
        } catch {
          setUsers([]);
          setError(`Бек вернул не JSON: ${text.slice(0, 120)}`);
          return;
        }

        if (!Array.isArray(data)) {
          setUsers([]);
          setError(`Ожидали массив пользователей, пришло: ${typeof data}`);
          return;
        }

        setUsers(data);
      } catch {
        setUsers([]);
        setError("Не удалось загрузить пользователей");
      } finally {
        setLoading(false);
      }
    };

    loadUsers();
  }, [navigate]);

  const handleBack = () => navigate(-1);

  return (
    <div className="nominations-page">
      <header className="nominations-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>

        <nav className="nav-tabs">
        </nav>

        <button className="cabinet-nav-button" onClick={handleBack}>
          Назад
        </button>
      </header>

      <main className="nominations-content" style={{ backgroundImage: `url(${fon})` }}>
        <div className="cabinet-page-container">
          <h1 className="cabinet-page-title">Управление учетными записями</h1>

          {loading && <p>Загрузка...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <div className="user-management-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Логин</th>
                    <th>Пароль</th>
                    <th>Роль</th>
                    <th>Дата регистрации</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.login}</td>
                      <td className="password-cell">
                        {u.password ? u.password : '—'}
                      </td>
                      <td>{u.role}</td>
                      <td>{u.registeredDate}</td>
                    </tr>
                  ))}

                  {users.length === 0 && (
                    <tr>
                      <td colSpan={4} style={{ textAlign: "center", opacity: 0.8 }}>
                        Пользователей нет (или бек вернул пустой список)
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default UserManagementPage;
