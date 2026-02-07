import React, { useState, useEffect } from 'react';
import axios from 'axios';
import './ProfilePage.css';

const ProfilePage = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchProfile();
  }, []);

  const fetchProfile = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await axios.get('/api/auth/profile', {
        headers: { Authorization: `Bearer ${token}` }
      });
      setUser(response.data.user);
    } catch (err) {
      setError('Vui lòng đăng nhập để xem hồ sơ');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    window.location.reload();
  };

  if (loading) return <div className="loading">Đang tải...</div>;
  if (error) return <div className="error-container">{error}</div>;

  return (
    <div className="profile-container">
      <div className="profile-box">
        <div className="profile-header">
          <img src={user.avatar} alt={user.name} className="avatar" />
          <h1>{user.name}</h1>
        </div>
        <div className="profile-info">
          <div className="info-item">
            <label>Email:</label>
            <p>{user.email}</p>
          </div>
          <div className="info-item">
            <label>ID:</label>
            <p>{user.id}</p>
          </div>
        </div>
        <button onClick={handleLogout} className="logout-btn">
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default ProfilePage;
