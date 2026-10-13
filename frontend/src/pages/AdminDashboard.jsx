import React, { useState, useEffect } from 'react';
import API from '../services/api';
import { useDebounce } from '../hooks/useDebounce';

const AdminDashboard = () => {
  const [stats, setStats] = useState({ totalUsers: 0, totalStores: 0, totalRatings: 0 });
  const [users, setUsers] = useState([]);
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [roleFilter, setRoleFilter] = useState('');
  const [activeTab, setActiveTab] = useState('users');

  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });
  const [message, setMessage] = useState({ type: '', text: '' });

  const fetchData = async () => {
    try {
      const statsRes = await API.get('/admin/dashboard');
      setStats(statsRes.data);

      const usersRes = await API.get(`/admin/users?search=${debouncedSearch}&role=${roleFilter}`);
      setUsers(usersRes.data);

      const storesRes = await API.get(`/admin/stores?search=${debouncedSearch}`);
      setStores(storesRes.data);
    } catch (err) {
      console.error('Error fetching admin data:', err);
    }
  };

  useEffect(() => {
    fetchData();
  }, [debouncedSearch, roleFilter]);

  const handleAddUser = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await API.post('/admin/users', newUser);
      setMessage({ type: 'success', text: res.data.message });
      setNewUser({ name: '', email: '', password: '', address: '', role: 'NORMAL_USER' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to add user.' });
    }
  };

  const handleAddStore = async (e) => {
    e.preventDefault();
    setMessage({ type: '', text: '' });
    try {
      const res = await API.post('/admin/stores', newStore);
      setMessage({ type: 'success', text: res.data.message });
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      fetchData();
    } catch (err) {
      setMessage({ type: 'danger', text: err.response?.data?.message || 'Failed to add store.' });
    }
  };

  return (
    <div className="container py-4">
      {/* Header Banner */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold display-title mb-1">System Administration</h2>
          <p className="text-muted mb-0">Platform performance analytics, user access control, and store management.</p>
        </div>
        <div className="d-flex gap-2">
          <button className="btn btn-gradient-primary rounded-pill btn-sm px-3" data-bs-toggle="modal" data-bs-target="#addUserModal">
            + Add User
          </button>
          <button className="btn btn-outline-dark rounded-pill btn-sm px-3 fw-semibold" data-bs-toggle="modal" data-bs-target="#addStoreModal">
            + Add Store
          </button>
        </div>
      </div>

      {message.text && (
        <div className={`alert alert-${message.type} alert-dismissible fade show rounded-3 border-0 shadow-sm mb-4`} role="alert">
          {message.text}
          <button type="button" className="btn-close" onClick={() => setMessage({ type: '', text: '' })}></button>
        </div>
      )}

      {/* Analytics Hero Section */}
      <div className="row g-3 mb-4">
        <div className="col-12 col-md-4">
          <div className="metric-card p-3 p-lg-4 d-flex align-items-center gap-3">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(99, 102, 241, 0.12)', color: '#4f46e5' }}>
              👥
            </div>
            <div>
              <span className="text-muted fw-semibold small text-uppercase d-block">Registered Users</span>
              <h3 className="fw-bold mb-0 text-dark">{stats.totalUsers}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="metric-card p-3 p-lg-4 d-flex align-items-center gap-3">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(236, 72, 153, 0.12)', color: '#ec4899' }}>
              🏪
            </div>
            <div>
              <span className="text-muted fw-semibold small text-uppercase d-block">Total Stores</span>
              <h3 className="fw-bold mb-0 text-dark">{stats.totalStores}</h3>
            </div>
          </div>
        </div>

        <div className="col-12 col-md-4">
          <div className="metric-card p-3 p-lg-4 d-flex align-items-center gap-3">
            <div className="metric-icon-wrapper" style={{ background: 'rgba(16, 185, 129, 0.12)', color: '#10b981' }}>
              ⭐
            </div>
            <div>
              <span className="text-muted fw-semibold small text-uppercase d-block">Submitted Ratings</span>
              <h3 className="fw-bold mb-0 text-dark">{stats.totalRatings}</h3>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters Toolbar */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-2">
          <div className="col-12 col-md-7">
            <input
              type="text"
              className="form-control form-control-custom"
              placeholder="Filter listings by Name, Email, or Address..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>
          <div className="col-12 col-md-5">
            <select className="form-select form-select-custom" value={roleFilter} onChange={(e) => setRoleFilter(e.target.value)}>
              <option value="">All Account Roles</option>
              <option value="SYSTEM_ADMIN">System Administrator</option>
              <option value="NORMAL_USER">Normal User</option>
              <option value="STORE_OWNER">Store Owner</option>
            </select>
          </div>
        </div>
      </div>

      {/* Tabs Selection */}
      <ul className="nav nav-pills custom-pills mb-3 gap-2">
        <li className="nav-item">
          <button className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'users' ? 'active btn-gradient-primary' : 'bg-white text-dark shadow-sm'}`} onClick={() => setActiveTab('users')}>
            Users Management ({users.length})
          </button>
        </li>
        <li className="nav-item">
          <button className={`nav-link rounded-pill px-4 fw-semibold ${activeTab === 'stores' ? 'active btn-gradient-primary' : 'bg-white text-dark shadow-sm'}`} onClick={() => setActiveTab('stores')}>
            Stores Directory ({stores.length})
          </button>
        </li>
      </ul>

      {/* Data Table Container */}
      <div className="custom-card overflow-hidden">
        <div className="table-responsive custom-table-container">
          {activeTab === 'users' ? (
            <table className="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th>User Profile</th>
                  <th>Email</th>
                  <th>Address</th>
                  <th>Role</th>
                  <th>Store Rating (If Owner)</th>
                </tr>
              </thead>
              <tbody>
                {users.map((u) => (
                  <tr key={u.id}>
                    <td><strong className="text-dark">{u.name}</strong></td>
                    <td className="text-secondary small">{u.email}</td>
                    <td className="text-secondary small">{u.address}</td>
                    <td>
                      <span className={`badge px-2 py-1 ${u.role === 'SYSTEM_ADMIN' ? 'bg-danger' : u.role === 'STORE_OWNER' ? 'bg-warning text-dark' : 'bg-info text-dark'}`}>
                        {u.role}
                      </span>
                    </td>
                    <td>
                      {u.role === 'STORE_OWNER' ? (
                        <span className="fw-bold text-primary">★ {parseFloat(u.store_rating || 0).toFixed(1)} / 5.0</span>
                      ) : (
                        <span className="text-muted small">N/A</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <table className="table custom-table align-middle mb-0">
              <thead>
                <tr>
                  <th>Store Name</th>
                  <th>Business Email</th>
                  <th>Address</th>
                  <th>Overall Community Rating</th>
                </tr>
              </thead>
              <tbody>
                {stores.map((s) => (
                  <tr key={s.id}>
                    <td><strong className="text-dark">{s.name}</strong></td>
                    <td className="text-secondary small">{s.email}</td>
                    <td className="text-secondary small">{s.address}</td>
                    <td>
                      <span className="badge bg-warning text-dark px-3 py-1 fs-6">
                        ★ {parseFloat(s.overall_rating).toFixed(1)} / 5.0
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>

      {/* Add User Modal */}
      <div className="modal fade" id="addUserModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Register New Account</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddUser}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Full Name (20–60 chars)</label>
                  <input type="text" className="form-control form-control-custom" required value={newUser.name} onChange={(e) => setNewUser({ ...newUser, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Email Address</label>
                  <input type="email" className="form-control form-control-custom" required value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Password (8–16 chars, 1 Upper, 1 Special)</label>
                  <input type="password" className="form-control form-control-custom" required value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Address (Max 400 chars)</label>
                  <textarea className="form-control form-control-custom" rows="2" required value={newUser.address} onChange={(e) => setNewUser({ ...newUser, address: e.target.value })}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">User Role</label>
                  <select className="form-select form-select-custom" value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}>
                    <option value="NORMAL_USER">Normal User</option>
                    <option value="STORE_OWNER">Store Owner</option>
                    <option value="SYSTEM_ADMIN">System Administrator</option>
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-gradient-primary rounded-pill px-4" data-bs-dismiss="modal">Create User</button>
              </div>
            </form>
          </div>
        </div>
      </div>

      {/* Add Store Modal */}
      <div className="modal fade" id="addStoreModal" tabIndex="-1" aria-hidden="true">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content border-0 shadow-lg rounded-4">
            <div className="modal-header border-0 pb-0">
              <h5 className="modal-title fw-bold">Register New Store</h5>
              <button type="button" className="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
            </div>
            <form onSubmit={handleAddStore}>
              <div className="modal-body">
                <div className="mb-3">
                  <label className="form-label small fw-bold">Store Name</label>
                  <input type="text" className="form-control form-control-custom" required value={newStore.name} onChange={(e) => setNewStore({ ...newStore, name: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Business Email</label>
                  <input type="email" className="form-control form-control-custom" required value={newStore.email} onChange={(e) => setNewStore({ ...newStore, email: e.target.value })} />
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Address (Max 400 chars)</label>
                  <textarea className="form-control form-control-custom" rows="2" required value={newStore.address} onChange={(e) => setNewStore({ ...newStore, address: e.target.value })}></textarea>
                </div>
                <div className="mb-3">
                  <label className="form-label small fw-bold">Assign Store Owner (Optional)</label>
                  <select className="form-select form-select-custom" value={newStore.ownerId} onChange={(e) => setNewStore({ ...newStore, ownerId: e.target.value })}>
                    <option value="">-- Select Store Owner --</option>
                    {users.filter(u => u.role === 'STORE_OWNER').map(u => (
                      <option key={u.id} value={u.id}>{u.name} ({u.email})</option>
                    ))}
                  </select>
                </div>
              </div>
              <div className="modal-footer border-0 pt-0">
                <button type="button" className="btn btn-light rounded-pill px-4" data-bs-dismiss="modal">Cancel</button>
                <button type="submit" className="btn btn-gradient-primary rounded-pill px-4" data-bs-dismiss="modal">Create Store</button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;