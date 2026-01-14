// components/RatingPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const RatingPage = () => {
  const [nominations, setNominations] = useState([]);
  const [selectedNomination, setSelectedNomination] = useState(null);
  const [participants, setParticipants] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  // Загружаем список номинаций
  const fetchNominations = useCallback(async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${API}/api/nominations`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setNominations(data);
    } catch (err) {
      console.error(err);
      setError('Не удалось загрузить список номинаций');
    }
  }, [navigate]);

  // Загружаем рейтинг участников выбранной номинации
  const fetchParticipants = useCallback(async (nominationId) => {
    setLoading(true);
    setError('');
    try {
      const token = localStorage.getItem('token');
      if (!token) return navigate('/login');

      const res = await fetch(`${API}/api/participants/rating?nomination=${nominationId}`, {
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
    fetchNominations();
  }, [fetchNominations]);

  useEffect(() => {
    if (selectedNomination) {
      fetchParticipants(selectedNomination);
    } else {
      setParticipants([]);
    }
  }, [selectedNomination, fetchParticipants]);

  return (
    <div className="nominations-page">
      <header className="nominations-header">
        <div className="logo-container">
          <img src={logo} alt="Лого" className="logo-image" />
        </div>

        <div className="cabinet-buttons" style={{ position: 'absolute', right: '20px', top: '50%', transform: 'translateY(-50%)', display: 'flex', gap: '10px' }}>
          <button className="cabinet-nav-button" onClick={() => navigate(-1)}>Назад</button>
        </div>
      </header>

      <main className="nominations-content">
        <div className="nominations-container">
          <h1 className="nominations-title">РЕЙТИНГ УЧАСТНИКОВ</h1>

          {error && <div className="error-message">{error}</div>}

          {/* Красивый выбор номинации */}
          <div className="custom-select-container">
            <label htmlFor="nomination-select" className="custom-select-label">Выберите номинацию:</label>
            <div className="custom-select-wrapper">
              <select
                id="nomination-select"
                className="custom-select"
                value={selectedNomination || ''}
                onChange={(e) => setSelectedNomination(e.target.value)}
              >
                <option value="">-- выбрать --</option>
                {nominations.map(n => (
                  <option key={n.id} value={n.id}>{n.title}</option>
                ))}
              </select>
            </div>
          </div>

          {/* Таблица рейтинга */}
          {loading && <div className="loading-message">Загрузка...</div>}
          {!loading && selectedNomination && participants.length > 0 && (
            <>
              <h2 style={{ margin: '15px 0' }}>Номинация: {nominations.find(n => n.id === Number(selectedNomination))?.title}</h2>
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
            </>
          )}

          {!loading && selectedNomination && participants.length === 0 && (
            <div>Нет участников для этой номинации</div>
          )}
        </div>
      </main>
    </div>
  );
};

export default RatingPage;
