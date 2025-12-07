// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import MainPage from './components/MainPage';
import VotingPage from './components/VotingPage';
import UploadPage from './components/UploadPage';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} /> {/* Стартовая страница - загрузка */}
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/vote/:category" element={<VotingPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;