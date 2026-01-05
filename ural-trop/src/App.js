// App.js
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage'; // Убедитесь, что файл существует
import MainPage from './components/MainPage';
import VotingPage from './components/VotingPage';
import UploadPage from './components/UploadPage';
import PersonalCabinetPage from './components/PersonalCabinetPage'; // Новый импорт
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegistrationPage />} />
          <Route path="/main" element={<MainPage />} />
          <Route path="/vote/:category" element={<VotingPage />} />
          <Route path="/cabinet" element={<PersonalCabinetPage />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;