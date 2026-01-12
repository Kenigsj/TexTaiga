import React, { useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { UserContext } from '../App';
import logo from './../logo.png';
import fon from '../fon.png';
import './../App.css';

const MainPage = () => {
  const navigate = useNavigate();
  const { user } = useContext(UserContext);

  const nominations = [
    { id: 1, title: 'лучший фотограф', path: 'best-photographer' },
    { id: 2, title: '2 НОМИНАЦИЯ', path: 'nomination-2' },
    { id: 3, title: '3 НОМИНАЦИЯ', path: 'nomination-3' },
    { id: 4, title: '4 НОМИНАЦИЯ', path: 'nomination-4' },
  ];

  const handleNominationClick = (path) => {
    if (user?.role === 'moderation') navigate(`/moderate/${path}`);
    else navigate(`/vote/${path}`);
  };

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

        <button className="cabinet-nav-button" onClick={() => navigate('/cabinet')}>
          Личный кабинет
        </button>
      </header>

      <main className="nominations-content" style={{ backgroundImage: `url(${fon})` }}>
        <div className="nominations-container">
          <h1 className="nominations-title">
            НОМИНАЦИИ
            {user && user.role === 'moderation' && (
              <span className="moderation-badge"> (Режим модерации)</span>
            )}
          </h1>

          <div className="nominations-grid">
            {nominations.map((nomination) => (
              <div
                key={nomination.id}
                className="nomination-item"
                onClick={() => handleNominationClick(nomination.path)}
              >
                <p className="nomination-text">{nomination.title}</p>
                {user && user.role === 'moderation' && (
                  <p className="nomination-subtext">Нажмите для модерации</p>
                )}
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;
