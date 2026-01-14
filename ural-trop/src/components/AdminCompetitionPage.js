// components/AdminCompetitionPage.js
import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const AdminCompetitionPage = () => {
  const [nominations, setNominations] = useState([]);
  const [newNomination, setNewNomination] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editText, setEditText] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const navigate = useNavigate();

  const getAuthHeaders = useCallback(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  }, [navigate]);

  const fetchNominations = useCallback(async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API}/api/nominations`, { headers });
      const text = await res.text();

      if (text === "UNAUTHORIZED") {
        navigate('/login');
        return;
      }
      if (!res.ok) throw new Error(text);

      setNominations(JSON.parse(text));
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить номинации");
    }
  }, [getAuthHeaders, navigate]);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  const handleAddNomination = async (e) => {
    e.preventDefault();
    setError('');
    if (!newNomination.trim()) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API}/api/nominations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: newNomination })
      });

      const text = await res.text();
      if (text === "FORBIDDEN") throw new Error("Нет прав");
      if (!res.ok && text !== "OK") throw new Error(text);

      setNewNomination('');
      setSuccess('Номинация добавлена');
      fetchNominations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Ошибка при добавлении номинации');
    }
  };

  const handleEdit = (id, title) => {
    setEditingId(id);
    setEditText(title);
  };

  const handleSaveEdit = async (id) => {
    setError('');
    if (!editText.trim()) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API}/api/nominations/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ title: editText })
      });

      const text = await res.text();
      if (text === "FORBIDDEN") throw new Error("Нет прав");
      if (!res.ok && text !== "OK") throw new Error(text);

      setEditingId(null);
      setSuccess('Номинация обновлена');
      fetchNominations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Ошибка при обновлении номинации');
    }
  };

  const handleDelete = async (id) => {
    setError('');
    if (!window.confirm('Удалить номинацию?')) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate('/login');

    try {
      const res = await fetch(`${API}/api/nominations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      const text = await res.text();
      if (text === "FORBIDDEN") throw new Error("Нет прав");
      if (!res.ok && text !== "OK") throw new Error(text);

      setSuccess('Номинация удалена');
      fetchNominations();
      setTimeout(() => setSuccess(''), 3000);
    } catch (err) {
      console.error(err);
      setError('Ошибка при удалении номинации');
    }
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

        <button
          className="cabinet-nav-button"
          onClick={() => navigate(-1)}
        >
          Назад
        </button>
      </header>

      <main className="nominations-content">
        <div className="admin-page-container">
          <h1 className="admin-page-title">Управление конкурсом</h1>

          <div className="admin-card">
            {/* Добавление */}
            <div className="add-nomination-section">
              <h3 className="section-title">Добавить номинацию</h3>

              <form
                onSubmit={handleAddNomination}
                className="add-nomination-form"
              >
                <input
                  type="text"
                  className="admin-input"
                  placeholder="Название номинации"
                  value={newNomination}
                  onChange={(e) => setNewNomination(e.target.value)}
                />
                <button
                  type="submit"
                  className="admin-submit-button"
                >
                  Добавить
                </button>
              </form>
            </div>

            {/* Список */}
            <div className="nominations-list-section">
              <h3 className="section-title">Текущие номинации</h3>

              {nominations.length === 0 ? (
                <p className="no-nominations">Нет номинаций</p>
              ) : (
                <div className="nominations-list">
                  {nominations.map(nom => (
                    <div
                      key={nom.id}
                      className="nomination-item-admin"
                    >
                      {editingId === nom.id ? (
                        <div className="edit-form">
                          <input
                            type="text"
                            className="admin-input"
                            value={editText}
                            onChange={(e) => setEditText(e.target.value)}
                          />
                          <button
                            type="button"
                            className="admin-small-button save-button"
                            onClick={() => handleSaveEdit(nom.id)}
                          >
                            Сохранить
                          </button>
                          <button
                            type="button"
                            className="admin-small-button cancel-button"
                            onClick={() => setEditingId(null)}
                          >
                            Отмена
                          </button>
                        </div>
                      ) : (
                        <>
                          <span className="nomination-title">
                            {nom.title}
                          </span>

                          <div className="nomination-actions">
                            <button
                              type="button"
                              className="admin-small-button edit-button"
                              onClick={() => handleEdit(nom.id, nom.title)}
                            >
                              Редактировать
                            </button>
                            <button
                              type="button"
                              className="admin-small-button delete-button"
                              onClick={() => handleDelete(nom.id)}
                            >
                              Удалить
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>

            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
          </div>
        </div>
      </main>
    </div>
  );
};

export default AdminCompetitionPage;
