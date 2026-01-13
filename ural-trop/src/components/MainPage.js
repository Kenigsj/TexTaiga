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
    fetchNominations();
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
      setNominations(
        data.map(n => ({
          id: n.id,
          title: n.title
        }))
      );
    } catch (err) {
      console.error(err);
      setError('Ошибка загрузки номинаций');
    } finally {
      setLoading(false);
    }
  };

  const handleNominationClick = (id, title) => {
    const base = user?.role === 'moderation' ? 'moderate' : 'vote';
    navigate(`/${base}/nomination-${id}`, {
      state: { nominationId: id, nominationTitle: title }
    });
  };

  return (
    <div className="nominations-page">
      <header className="nominations-header">
        <img src={logo} alt="Лого" className="logo-image" />
        <button onClick={() => navigate('/cabinet')}>
          Личный кабинет
        </button>
      </header>

      <main className="nominations-content" style={{ backgroundImage: `url(${fon})` }}>
        <h1>Номинации</h1>

        {loading && <p>Загрузка...</p>}
        {error && <p className="error-message">{error}</p>}

        <div className="nominations-grid">
          {nominations.map(nom => (
            <div
              key={nom.id}
              className="nomination-item"
              onClick={() => handleNominationClick(nom.id, nom.title)}
            >
              {nom.title}
            </div>
          ))}
        </div>
      </main>
    </div>
  );
};

export default MainPage;
