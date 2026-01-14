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
          navigate('/login');
          return;
        }

        const data = JSON.parse(text);
        setUsers(Array.isArray(data) ? data : []);
      } catch {
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
          <h1 className="cabinet-page-title">Управление учетными записями</h1>

          {loading && <p>Загрузка...</p>}
          {error && <p className="error-message">{error}</p>}

          {!loading && !error && (
            <div className="user-management-table">
              <table className="table">
                <thead>
                  <tr>
                    <th>Логин</th>
                    <th>Роль</th>
                    <th>Дата регистрации</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td>{u.login}</td>
                      <td>{u.role}</td>
                      <td>{u.registeredDate}</td>
                    </tr>
                  ))}
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
