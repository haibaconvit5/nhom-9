import React from 'react';
import './HomePage.css';

const HomePage = () => {
  return (
    <div className="home-container">
      <div className="hero">
        <h1>Chào mừng đến EduHub</h1>
        <p>Nền tảng học tập trực tuyến hàng đầu</p>
      </div>
      <div className="features">
        <div className="feature-card">
          <h2>📚 Khóa học đa dạng</h2>
          <p>Học từ các khóa học được thiết kế bởi các chuyên gia</p>
        </div>
        <div className="feature-card">
          <h2>👨‍🏫 Giáo viên chuyên nghiệp</h2>
          <p>Học từ những giáo viên có kinh nghiệm</p>
        </div>
        <div className="feature-card">
          <h2>💻 Công nghệ tiên tiến</h2>
          <p>Sử dụng công nghệ mới nhất để cải thiện trải nghiệm học tập</p>
        </div>
        <div className="feature-card">
          <h2>🏆 Chứng chỉ hoàn thành</h2>
          <p>Nhận chứng chỉ khi hoàn thành khóa học</p>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
