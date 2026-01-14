// components/RatingPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const RatingPage = () => {
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Загружаем участников
  const fetchParticipants = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${API}/api/participants/rating`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      data.sort((a, b) => b.points - a.points); // сортировка по очкам
      setParticipants(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить рейтинг участников');
    } finally {
      setLoading(false);
    }
  }, [navigate]);

  useEffect(() => {
    fetchParticipants();
  }, [fetchParticipants]);

  return (
    <div className="nominations-page">
      <header className="nominations-header">
        <div className="logo-container">
          <img src={logo} alt="Лого" className="logo-image" />
        </div>

        <nav className="nav-tabs">
          <button className="nav-tab">Карта</button>
          <button className="nav-tab">Маршруты</button>
          <button className="nav-tab">Точки притяжения</button>
          <button className="nav-tab">Три урала</button>
          <button className="nav-tab">Спецпроекты</button>
        </nav>

        {/* Кнопка назад вместо Рейтинг */}
        <button className="cabinet-nav-button" onClick={() => navigate(-1)}>
          Назад
        </button>
      </header>

      <main className="nominations-content">
        <div className="nominations-container">
          <h1 className="nominations-title">РЕЙТИНГ УЧАСТНИКОВ</h1>

          {loading && <div className="loading-message">Загрузка...</div>}
          {error && <div className="error-message">{error}</div>}

          {!loading && !error && (
            <table className="rating-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>ФИО</th>
                  <th>Email</th>
                  <th>Очки жюри</th>
                </tr>
              </thead>
              <tbody>
                {participants.map((p, index) => (
                  <tr key={p.id}>
                    <td>{index + 1}</td>
                    <td>{p.fio}</td>
                    <td>{p.email}</td>
                    <td>{p.points}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default RatingPage;
