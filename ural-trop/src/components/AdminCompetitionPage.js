// components/AdminCompetitionPage.js
import React, { useState, useEffect } from 'react';
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

  useEffect(() => {
    fetchNominations();
  }, []);

  const getAuthHeaders = () => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate('/login');
      return null;
    }
    return {
      Authorization: `Bearer ${token}`,
      "Content-Type": "application/json"
    };
  };

  const fetchNominations = async () => {
    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API}/api/nominations`, { headers });
      if (!res.ok) throw new Error(await res.text());
      setNominations(await res.json());
    } catch (err) {
      console.error(err);
      setError("Не удалось загрузить номинации");
    }
  };

  const handleAddNomination = async (e) => {
    e.preventDefault();
    if (!newNomination.trim()) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API}/api/nominations`, {
        method: "POST",
        headers,
        body: JSON.stringify({ title: newNomination })
      });

      if (!res.ok) throw new Error(await res.text());

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
    if (!editText.trim()) return;

    const headers = getAuthHeaders();
    if (!headers) return;

    try {
      const res = await fetch(`${API}/api/nominations/${id}`, {
        method: "PUT",
        headers,
        body: JSON.stringify({ title: editText })
      });

      if (!res.ok) throw new Error(await res.text());

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
    if (!window.confirm('Удалить номинацию?')) return;

    const token = localStorage.getItem("token");
    if (!token) return navigate('/login');

    try {
      const res = await fetch(`${API}/api/nominations/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) throw new Error(await res.text());

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
        <img src={logo} alt="Лого" className="logo-image" />
        <button className="cabinet-nav-button" onClick={() => navigate(-1)}>
          Назад
        </button>
      </header>

      <main className="nominations-content">
        <div className="admin-card">
          <h1>Управление конкурсом</h1>

          <form onSubmit={handleAddNomination} className="add-nomination-form">
            <input
              type="text"
              placeholder="Название номинации"
              value={newNomination}
              onChange={(e) => setNewNomination(e.target.value)}
            />
            <button type="submit">Добавить</button>
          </form>

          <div className="nominations-list">
            {nominations.map(nom => (
              <div key={nom.id} className="nomination-item-admin">
                {editingId === nom.id ? (
                  <>
                    <input
                      value={editText}
                      onChange={(e) => setEditText(e.target.value)}
                    />
                    <button type="button" onClick={() => handleSaveEdit(nom.id)}>
                      Сохранить
                    </button>
                    <button type="button" onClick={() => setEditingId(null)}>
                      Отмена
                    </button>
                  </>
                ) : (
                  <>
                    <span>{nom.title}</span>
                    <button type="button" onClick={() => handleEdit(nom.id, nom.title)}>
                      Редактировать
                    </button>
                    <button type="button" onClick={() => handleDelete(nom.id)}>
                      Удалить
                    </button>
                  </>
                )}
              </div>
            ))}
          </div>

          {error && <div className="message error">{error}</div>}
          {success && <div className="message success">{success}</div>}
        </div>
      </main>
    </div>
  );
};

export default AdminCompetitionPage;
