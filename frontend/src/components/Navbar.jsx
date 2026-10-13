import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

const Navbar = () => {
  const { user, logout } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark navbar-custom sticky-top">
      <div className="container">
        <Link className="navbar-brand d-flex align-items-center gap-2" to="/">
          <span className="fs-3">🏪</span>
          <span className="brand-gradient fs-4">StorePulse</span>
        </Link>
        
        <button
          className="navbar-toggler border-0"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div className="collapse navbar-collapse" id="navbarNav">
          {user ? (
            <ul className="navbar-nav ms-auto align-items-lg-center gap-2 mt-3 mt-lg-0">
              {user.user.role === 'NORMAL_USER' && (
                <li className="nav-item">
                  <Link className="nav-link text-white-50 px-3 fw-medium" to="/stores">
                    🔍 Explore Stores
                  </Link>
                </li>
              )}
              {user.user.role === 'STORE_OWNER' && (
                <li className="nav-item">
                  <Link className="nav-link text-white-50 px-3 fw-medium" to="/owner">
                    📊 Store Dashboard
                  </Link>
                </li>
              )}
              {user.user.role === 'SYSTEM_ADMIN' && (
                <li className="nav-item">
                  <Link className="nav-link text-white-50 px-3 fw-medium" to="/admin">
                    🛡️ Admin Console
                  </Link>
                </li>
              )}
              <li className="nav-item">
                <Link className="nav-link text-white-50 px-3 fw-medium" to="/update-password">
                  ⚙️ Password
                </Link>
              </li>
              <li className="nav-item ms-lg-2">
                <div className="d-flex align-items-center gap-2 bg-white bg-opacity-10 rounded-pill px-3 py-1">
                  <span className="badge bg-primary rounded-circle p-2">👤</span>
                  <div className="text-start leading-tight">
                    <span className="d-block text-white small fw-bold">{user.user.name.split(' ')[0]}</span>
                    <span className="d-block text-white-50 text-uppercase" style={{ fontSize: '0.65rem' }}>
                      {user.user.role.replace('_', ' ')}
                    </span>
                  </div>
                </div>
              </li>
              <li className="nav-item ms-lg-2 mt-2 mt-lg-0">
                <button 
                  onClick={handleLogout} 
                  className="btn btn-outline-light btn-sm rounded-pill px-3 fw-semibold w-100"
                >
                  Logout
                </button>
              </li>
            </ul>
          ) : (
            <div className="ms-auto d-flex gap-2 mt-3 mt-lg-0">
              <Link to="/login" className="btn btn-outline-light rounded-pill px-4 btn-sm fw-semibold">
                Sign In
              </Link>
              <Link to="/signup" className="btn btn-gradient-primary btn-sm rounded-pill px-4">
                Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;