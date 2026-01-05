// components/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import fon from '../fon.png';
import './../App.css';


const MainPage = () => {
  const navigate = useNavigate();

  const nominations = [
    { id: 1, title: 'лучший фотограф', path: 'best-photographer' },
    { id: 2, title: '2 НОМИНАЦИЯ', path: 'nomination-2' },
    { id: 3, title: '3 НОМИНАЦИЯ', path: 'nomination-3' },
    { id: 4, title: '4 НОМИНАЦИЯ', path: 'nomination-4' },
  ];

  const handleNominationClick = (path) => {
    navigate(`/vote/${path}`);
  };

  return (
    <div className="nominations-page">
      {/* Шапка с логотипом и навигацией */}
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
        
        {/* Кнопка личного кабинета ВНЕ nav-tabs, справа */}
        <button 
          className="cabinet-nav-button" 
          onClick={() => navigate('/cabinet')} // Меняем на navigate
        >
          Личный кабинет
        </button>
      </header>

      {/* Основной контент с фоновым изображением */}
      <main 
        className="nominations-content"
        style={{ backgroundImage: `url(${fon})` }}
      >
        <div className="nominations-container">
          <h1 className="nominations-title">НОМИНАЦИИ</h1>
          
          <div className="nominations-grid">
            {nominations.map((nomination) => (
              <div 
                key={nomination.id}
                className="nomination-item"
                onClick={() => handleNominationClick(nomination.path)}
              >
                <p className="nomination-text">{nomination.title}</p>
              </div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default MainPage;