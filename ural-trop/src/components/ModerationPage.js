import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate, useParams, useLocation } from 'react-router-dom';
import logo from '../logo.png';
import './../App.css';

const API = "http://localhost:8080";

const ModerationPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { category } = useParams();

  const initialNominationId = (() => {
    if (location.state?.nominationId) return Number(location.state.nominationId);
    const idFromCategory = category?.replace('nomination-', '');
    const parsed = parseInt(idFromCategory, 10);
    return Number.isFinite(parsed) && parsed > 0 ? parsed : null;
  })();

  const [photos, setPhotos] = useState([]);
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [error, setError] = useState('');
  const [nominationTitle, setNominationTitle] = useState(location.state?.nominationTitle || 'Номинация');
  const [nominationId, setNominationId] = useState(initialNominationId);
  const [nominations, setNominations] = useState([]);
  const [moveNominationId, setMoveNominationId] = useState(initialNominationId || 1);

  useEffect(() => {
    if (location.state) {
      const id = location.state.nominationId || null;
      const title = location.state.nominationTitle || 'Номинация';
      setNominationId(id);
      setNominationTitle(title);
      setMoveNominationId(id || 1);
      return;
    }

    const idFromCategory = category?.replace('nomination-', '');
    const parsed = parseInt(idFromCategory, 10);
    const id = Number.isFinite(parsed) && parsed > 0 ? parsed : null;

    setNominationId(id);
    setNominationTitle(id ? `Номинация ${id}` : 'Номинация');
    setMoveNominationId(id || 1);
  }, [category, location.state]);

  const fetchNominations = useCallback(async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) return;

      const res = await fetch(`${API}/api/nominations`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      if (!res.ok) return;

      const data = await res.json();
      setNominations(Array.isArray(data) ? data : []);

      const found = (Array.isArray(data) ? data : []).find(n => Number(n.id) === Number(nominationId));
      if (found && found.title) setNominationTitle(found.title);
    } catch {
    }
  }, [nominationId]);

  const load = useCallback(async () => {
    setError('');

    if (!nominationId) {
      setPhotos([]);
      return;
    }

    try {
      const token = localStorage.getItem("token");
      if (!token) {
        navigate("/login");
        return;
      }

      const res = await fetch(`${API}/api/participants?nomination=${nominationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      const text = await res.text();
      if (text === "UNAUTHORIZED") {
        navigate("/login");
        return;
      }

      const data = JSON.parse(text);
      setPhotos(
        (Array.isArray(data) ? data : []).map(p => ({
          id: p.id,
          src: p.photoUrl,
          title: p.fio || `Фото ${p.id}`,
          status: p.status || 'pending',
          nomination: p.nomination || nominationId
        }))
      );
    } catch {
      setError("Не удалось загрузить список");
    }
  }, [navigate, nominationId]);

  useEffect(() => {
    fetchNominations();
  }, [fetchNominations]);

  useEffect(() => {
    load();
  }, [load]);

  const handlePhotoClick = (photo) => {
    setSelectedPhoto(photo);
    setMoveNominationId(photo.nomination || nominationId || 1);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };

  const postModeration = async (id, action) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/moderation/participant/${id}/${action}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const text = await res.text();


      if (text === "OK") {
        setPhotos(prev =>
          prev.map(p =>
            p.id === id
              ? { ...p, status: action === "approve" ? "approved" : "rejected" }
              : p
          )
        );
        setIsModalOpen(false);
        return;
      }

      alert("Ошибка: " + text);
    } catch {
      alert("Не удалось подключиться к серверу");
    }
  };

  const setNomination = async (id, newNomId) => {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${API}/api/moderation/participant/${id}/set-nomination?nomination=${newNomId}`, {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` }
      });

      const text = await res.text();

      if (text === "OK") {
        setPhotos(prev =>
          prev.map(p =>
            p.id === id
              ? { ...p, nomination: newNomId }
              : p
          )
        );
        return;
      }

      alert("Ошибка: " + text);
    } catch {
      alert("Не удалось подключиться к серверу");
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'approved': return '#28a745';
      case 'rejected': return '#dc3545';
      default: return '#6c757d';
    }
  };

  const getStatusText = (status) => {
    switch (status) {
      case 'approved': return 'Одобрено';
      case 'rejected': return 'Отклонено';
      default: return 'На рассмотрении';
    }
  };

  const pendingCount = photos.filter(p => p.status === 'pending').length;
  const approvedCount = photos.filter(p => p.status === 'approved').length;
  const rejectedCount = photos.filter(p => p.status === 'rejected').length;

  const titleForHeader = useMemo(() => {
    if (nominationTitle && nominationTitle !== 'Номинация') return nominationTitle;
    const found = nominations.find(n => Number(n.id) === Number(nominationId));
    return found?.title || nominationTitle || 'Номинация';
  }, [nominations, nominationId, nominationTitle]);

  return (
    <div className="nominations-page">
      <header className="nominations-header">
        <div className="logo-container">
          <img src={logo} alt="Уральские тропы" className="logo-image" />
        </div>

        <nav className="nav-tabs">
        </nav>

        <button className="cabinet-nav-button" onClick={() => navigate('/cabinet')}>
          Личный кабинет
        </button>
      </header>

      <main className="nominations-content">
        <div className="nominations-container">
          <div className="nomination-title-card">
            <h2 className="nomination-title-text">
              {titleForHeader} - Модерация
            </h2>
            <p className="moderation-subtitle">Рассмотрение загруженных фотографий</p>
          </div>

          <div className="moderation-stats">
            <div className="stat-item">
              <span className="stat-number">{photos.length}</span>
              <span className="stat-label">Всего фото</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{pendingCount}</span>
              <span className="stat-label">На рассмотрении</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{approvedCount}</span>
              <span className="stat-label">Одобрено</span>
            </div>
            <div className="stat-item">
              <span className="stat-number">{rejectedCount}</span>
              <span className="stat-label">Отклонено</span>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}


          <div className="photos-grid">
            {photos.map(photo => (
              <div
                key={photo.id}
                className="photo-item"
                onClick={() => handlePhotoClick(photo)}
              >
                <div className="photo-thumbnail">
                  <img src={photo.src} alt={photo.title} className="photo-thumb" />
                  <div
                    className="photo-status-badge"
                    style={{ backgroundColor: getStatusColor(photo.status) }}
                  >
                    {getStatusText(photo.status)}
                  </div>
                </div>
                <div className="photo-info">
                  <h4 className="photo-title">{photo.title}</h4>
                  <p className="photo-id">ID: {photo.id}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {isModalOpen && selectedPhoto && (
        <div className="moderation-modal-overlay" onClick={handleCloseModal}>
          <div className="moderation-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
              <h3>Просмотр фото #{selectedPhoto.id}</h3>
              <button className="modal-close" onClick={handleCloseModal}>×</button>
            </div>

            <div className="modal-body">
              <img src={selectedPhoto.src} alt={selectedPhoto.title} className="modal-photo" />

              <div className="photo-details">
                <h4>{selectedPhoto.title}</h4>

                <p>
                  Статус: <span style={{ color: getStatusColor(selectedPhoto.status) }}>
                    {getStatusText(selectedPhoto.status)}
                  </span>
                </p>

                <div style={{ marginTop: 12 }}>
                  <div style={{ marginBottom: 6, fontWeight: 600 }}>Номинация:</div>
                  <select
                    value={moveNominationId}
                    onChange={(e) => setMoveNominationId(parseInt(e.target.value, 10))}
                    style={{ width: "100%", padding: 8, borderRadius: 8 }}
                  >
                    {nominations.map(n => (
                      <option key={n.id} value={n.id}>
                        {n.title}
                      </option>
                    ))}
                  </select>

                  <button
                    className="moderation-button approve-button"
                    style={{ marginTop: 10, width: "100%" }}
                    onClick={() => setNomination(selectedPhoto.id, moveNominationId)}
                  >
                    Переместить в номинацию
                  </button>
                </div>
              </div>
            </div>

            <div className="modal-footer">
              <button
                className="moderation-button reject-button"
                onClick={() => postModeration(selectedPhoto.id, "reject")}
                disabled={selectedPhoto.status !== 'pending'}
              >
                Отклонить
              </button>
              <button
                className="moderation-button approve-button"
                onClick={() => postModeration(selectedPhoto.id, "approve")}
                disabled={selectedPhoto.status !== 'pending'}
              >
                Одобрить
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ModerationPage;
