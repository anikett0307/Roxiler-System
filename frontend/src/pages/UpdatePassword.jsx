import React, { useState } from 'react';
import API from '../services/api';

const UpdatePassword = () => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [message, setMessage] = useState({ type: '', text: '' });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    setLoading(true);

    try {
      const res = await API.put('/auth/update-password', { currentPassword, newPassword });
      setMessage({ type: 'success', text: res.data.message || 'Password updated successfully!' });
      setCurrentPassword('');
      setNewPassword('');
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to update password.' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-12 col-md-6 col-lg-5">
          <div className="custom-card p-4 p-md-5">
            <div className="text-center mb-4">
              <span className="fs-1">🔒</span>
              <h3 className="fw-bold mt-2">Security Settings</h3>
              <p className="text-muted small">Update your account password</p>
            </div>

            {message.text && (
              <div className={`alert alert-${message.type} rounded-3 border-0 small mb-3`} role="alert">
                {message.text}
              </div>
            )}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label small fw-bold">Current Password</label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  placeholder="••••••••"
                  required
                  value={currentPassword}
                  onChange={(e) => setCurrentPassword(e.target.value)}
                />
              </div>

              <div className="mb-4">
                <label className="form-label small fw-bold">
                  New Password (8–16 chars, 1 Uppercase & 1 Special Char)
                </label>
                <input
                  type="password"
                  className="form-control form-control-custom"
                  placeholder="••••••••"
                  required
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                />
              </div>

              <button type="submit" className="btn btn-gradient-primary w-100 rounded-pill py-2" disabled={loading}>
                {loading ? 'Updating Password...' : 'Save New Password'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpdatePassword;