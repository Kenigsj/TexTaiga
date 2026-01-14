import React, { useContext, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import logo from './../logo.png';
import fon from '../fon.png';
import './../App.css';

const API = "http://localhost:8080";

const MainPage = () => {
  const [nominations, setNominations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  useEffect(() => {
    if (user?.role === "admin") {
      navigate('/cabinet');
      return;
    }
    fetchNominations();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const fetchNominations = async () => {
    const token = localStorage.getItem("token");
    if (!token) return navigate('/login');

    try {
      const res = await fetch(`${API}/api/nominations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

      const data = await res.json();
      setNominations(data.map(n => ({ id: n.id, title: n.title })));
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки номинаций');
    } finally {
      setLoading(false);
    }
  };

  const handleNominationClick = (id, title) => {
    const base = user?.role === 'moderator' ? 'moderate' : 'vote';
    navigate(`/${base}/nomination-${id}`, {
      state: { nominationId: id, nominationTitle: title }
    });
  };

  if (user?.role === "admin") return null;

  return (
    <div className="nominations-page">
      <header className="nominations-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>

        <nav className="nav-tabs">{/* пусто */}</nav>

        <div className="header-buttons-right">
          {user?.role === 'jury' && (
            <button
              className="cabinet-nav-button"
              onClick={() => navigate('/rating')}
            >
              Рейтинг
            </button>
          )}

          <button
            className="cabinet-nav-button"
            onClick={() => navigate('/cabinet')}
          >
            Личный кабинет
          </button>
        </div>
      </header>

      <main className="nominations-content" style={{ backgroundImage: `url(${fon})` }}>
        <div className="nominations-container">
          <h1 className="nominations-title">
            НОМИНАЦИИ
            {user?.role === 'moderator' && (
              <span className="moderation-badge"> (Режим модерации)</span>
            )}
          </h1>

          {loading ? (
            <div className="loading-message">Загрузка...</div>
          ) : error ? (
            <div className="error-message">{error}</div>
          ) : (
            <div className="nominations-grid">
              {nominations.map(n => (
                <div
                  key={n.id}
                  className="nomination-item"
                  onClick={() => handleNominationClick(n.id, n.title)}
                >
                  <p className="nomination-text">{n.title}</p>
                  {user?.role === 'moderator' && (
                    <p className="nomination-subtext">Нажмите для модерации</p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
