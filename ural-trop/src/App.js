// App.js
import React, { useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import MainPage from './components/MainPage';
import VotingPage from './components/VotingPage';
import ModerationPage from './components/ModerationPage';
import UploadPage from './components/UploadPage';
import ProtectedRoute from './components/ProtectedRoute'; // Добавляем импорт
import PersonalCabinetPage from './components/PersonalCabinetPage';
import './App.css';

// Создаем контекст для пользователя
export const UserContext = createContext();

function App() {
  const [user, setUser] = useState(null); // { login: '', role: 'jury' | 'moderation' }

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <div className="App">
          <Routes>
  <Route path="/" element={<Navigate to="/upload" />} />
  <Route path="/upload" element={<UploadPage />} />
  <Route path="/login" element={<LoginPage />} />
  <Route path="/register" element={<RegistrationPage />} />
  <Route path="/cabinet" element={
  <ProtectedRoute>
    <PersonalCabinetPage />
  </ProtectedRoute>
} />
  <Route path="/main" element={
    <ProtectedRoute>
      <MainPage />
    </ProtectedRoute>
  } />
  
  {/* Обе страницы доступны по разным URL, ProtectedRoute проверит роль */}
  <Route path="/vote/:category" element={
    <ProtectedRoute>
      <VotingPage />
    </ProtectedRoute>
  } />
  <Route path="/moderate/:category" element={
    <ProtectedRoute>
      <ModerationPage />
    </ProtectedRoute>
  } />
</Routes>
        </div>
      </Router>
    </UserContext.Provider>
  );
}

export default App;