import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import API from '../services/api';

const Signup = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', address: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const res = await API.post('/auth/register', formData);
      setSuccess(res.data.message || 'Registration successful! Redirecting to login...');
      setTimeout(() => navigate('/login'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-8 col-lg-6">
          <div className="custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🚀</span>
              <h3 className="fw-bold mt-2">Create an Account</h3>
              <p className="text-muted small">Join StorePulse to discover and rate top-rated businesses</p>
            </div>

            {error && <div className="alert alert-danger rounded-3 border-0 small mb-3">{error}</div>}
            {success && <div className="alert alert-success rounded-3 border-0 small mb-3">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Full Name (20–60 characters)</label>
                <input
                  type="text"
                  className="form-control form-control-custom"
                  placeholder="e.g., Alexander Montgomery Smith"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Email Address</label>
                <input
                  type="email"
                  className="form-control form-control-custom"
                  placeholder="name@example.com"
                  required
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>

              <div className="mb-3">
                <label className="form-label small fw-bold">Address (Max 400 characters)</label>
                <textarea
                  className="form-control form-control-custom"
                  rows="2"
                  placeholder="Street address, city, state, zip"
                  required
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                ></textarea>
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">Password (8–16 chars, 1 Uppercase & 1 Special Char)</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  placeholder="e.g., Password@123"
                  required
                  value={formData.password}
                  onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                />
              </div>

              <button type="submit" className="btn btn-gradient-primary w-100 rounded-pill py-2" disabled={loading}>
                {loading ? 'Creating Account...' : 'Register Account'}
              </button>
            </form>

            <div className="text-center mt-4">
              <span className="text-muted small">Already have an account? </span>
              <Link to="/login" className="text-primary fw-bold text-decoration-none small">
                Sign in here
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;