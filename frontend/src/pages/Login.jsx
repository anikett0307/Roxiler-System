import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import API from '../services/api';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      const res = await API.post('/auth/login', { email, password });
      login(res.data);
      const role = res.data.user.role;
      if (role === 'SYSTEM_ADMIN') navigate('/admin');
      else if (role === 'STORE_OWNER') navigate('/owner');
      else navigate('/stores');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Check your credentials.');
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🏪</span>
              <h3 className="fw-bold mt-2">Welcome Back</h3>
              <p className="text-muted small">Access your StorePulse dashboard</p>
            </div>

            {error && <div className="alert alert-danger rounded-3 border-0 small">{error}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-custom"
                  placeholder="name@example.com"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Password</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  placeholder="••••••••"
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-gradient-primary w-100 rounded-pill py-2">
                Sign In
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Don't have an account? </span>
              <Link to="/signup" className="text-primary fw-bold text-decoration-none small">
                Register here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;