import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(!!localStorage.getItem('token'));

  const handleLogin = () => {
    setIsLoggedIn(true);
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    setIsLoggedIn(false);
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route 
          path="/login" 
          element={isLoggedIn ? <Navigate to="/profile" /> : <LoginPage onLogin={handleLogin} />} 
        />
        <Route 
          path="/profile" 
          element={isLoggedIn ? <ProfilePage onLogout={handleLogout} /> : <Navigate to="/login" />} 
        />
        <Route path="/" element={<Navigate to={isLoggedIn ? "/profile" : "/login"} />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
