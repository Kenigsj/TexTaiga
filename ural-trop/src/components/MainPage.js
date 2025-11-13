// components/MainPage.js
import React from 'react';
import { useNavigate } from 'react-router-dom';
import logo from './../Group 3.png';
import fon from '../fon.png';
import './../App.css';

const MainPage = () => {
  const navigate = useNavigate();

  const nominations = [
    { id: 1, title: 'красивый хуй', path: 'best-photographer' },
    { id: 2, title: 'славный пенис', path: 'nomination-2' },
    { id: 3, title: 'большие пречендалы', path: 'nomination-3' },
    { id: 4, title: 'вкусный хуй', path: 'nomination-4' },
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
          {/* Кнопка "Выход" убрана */}
        </nav>
      </header>

      {/* Основной контент с фоновым изображением */}
      <main 
        className="nominations-content"
        style={{ backgroundImage: `url(${fon})` }}
      >
        <div className="nominations-container">
          <h1 className="nominations-title">ХУЙ</h1>
          
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