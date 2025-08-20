import React from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useAuth();

  const handleLogout = () => {
    logout();
  };

  return (
    <nav className="navbar">
      <Link to="/" className="navbar-brand">
        ExamApp
      </Link>
      <div className="navbar-nav">
        {user ? (
          <>
            <span>Welcome, {user.name}</span>
            <Link to="/exam/start" className="nav-link">
              Dashboard
            </Link>
            <button onClick={handleLogout} className="btn-logout">
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-link">
              Login
            </Link>
            <Link to="/register" className="nav-link">
              Register
            </Link>
          </>
        )}
      </div>
    </nav>
  );
};

export default Navbar;