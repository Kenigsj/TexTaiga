import React, { useEffect, useState, createContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';

import RatingPage from './components/RatingPage';
import LoginPage from './components/LoginPage';
import RegistrationPage from './components/RegistrationPage';
import MainPage from './components/MainPage';
import VotingPage from './components/VotingPage';
import ModerationPage from './components/ModerationPage';
import UploadPage from './components/UploadPage';
import ProtectedRoute from './components/ProtectedRoute';
import PersonalCabinetPage from './components/PersonalCabinetPage';
import AdminCompetitionPage from './components/AdminCompetitionPage';
import UserManagementPage from './components/UserManagePage';

import './App.css';

export const UserContext = createContext();

const API = "http://localhost:8080";

function App() {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    fetch(`${API}/api/auth/me`, {
      headers: { Authorization: `Bearer ${token}` }
    })
      .then(r => r.text().then(t => ({ ok: r.ok, t })))
      .then(({ t }) => {
        if (t === "UNAUTHORIZED") {
          localStorage.clear();
          setUser(null);
          return;
        }

        const data = JSON.parse(t);
        localStorage.setItem("userLogin", data.login);
        localStorage.setItem("userRole", data.role);
        localStorage.setItem("registeredDate", data.registeredDate);

        setUser({
          id: data.id,
          login: data.login,
          role: data.role,
          registeredDate: data.registeredDate
        });
      })
      .catch(() => {});
  }, []);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <Router>
        <Routes>
          <Route path="/" element={<Navigate to="/upload" />} />
          <Route path="/upload" element={<UploadPage />} />
          <Route path="/login" element={<LoginPage />} />

          <Route
            path="/register"
            element={
              <ProtectedRoute requiredRole="admin">
                <RegistrationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/cabinet"
            element={
              <ProtectedRoute>
                <PersonalCabinetPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/main"
            element={
              <ProtectedRoute>
                <MainPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/vote/:category"
            element={
              <ProtectedRoute requiredRole={["jury", "admin"]}>
                <VotingPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/moderate/:category"
            element={
              <ProtectedRoute requiredRole={["moderator", "admin"]}>
                <ModerationPage />
              </ProtectedRoute>
            }
          />

          <Route
            path="/admin/competition"
            element={
              <ProtectedRoute requiredRole="admin">
                <AdminCompetitionPage />
              </ProtectedRoute>
            }
          />
          <Route
  path="/rating"
  element={
    <ProtectedRoute>
      <RatingPage />
    </ProtectedRoute>
  }
/>
<Route path="/admin/users" element={<UserManagementPage />} />

        </Routes>
      </Router>
    </UserContext.Provider>
  );
}

export default App;
