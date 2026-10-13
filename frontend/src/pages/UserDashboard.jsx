import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import API from '../services/api';
import StarRating from '../components/StarRating';
import { useDebounce } from '../hooks/useDebounce';
import confetti from 'canvas-confetti';

const UserDashboard = () => {
  const [stores, setStores] = useState([]);
  const [search, setSearch] = useState('');
  const debouncedSearch = useDebounce(search, 350);
  const [sortBy, setSortBy] = useState('name');
  const [sortOrder, setSortOrder] = useState('ASC');
  const [minRating, setMinRating] = useState(0);
  const [loading, setLoading] = useState(true);

  const fetchStores = async () => {
    try {
      setLoading(true);
      const res = await API.get(`/stores/user-list?search=${debouncedSearch}&sortBy=${sortBy}&sortOrder=${sortOrder}`);
      setStores(res.data);
    } catch (err) {
      console.error('Error fetching stores:', err);
      toast.error('Failed to load store listings.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [debouncedSearch, sortBy, sortOrder]);

  const handleRatingSubmit = async (storeId, ratingValue) => {
    try {
      const res = await API.post('/ratings', { storeId, rating: ratingValue });
      toast.success(res.data.message || 'Rating submitted successfully!');

      if (ratingValue === 5) {
        confetti({
          particleCount: 50,
          spread: 60,
          origin: { y: 0.8 }
        });
      }

      fetchStores();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Failed to submit rating.');
    }
  };

  const filteredStores = stores.filter(s => parseFloat(s.overall_rating) >= minRating);

  return (
    <div className="container py-4">
      {/* Hero Header Banner */}
      <div className="custom-card p-4 p-md-5 mb-4 position-relative overflow-hidden text-white" 
           style={{ background: 'linear-gradient(135deg, #4f46e5 0%, #7c3aed 100%)' }}>
        <div className="position-relative z-1 col-lg-8">
          <span className="badge bg-white bg-opacity-20 text-white rounded-pill px-3 py-2 mb-2 fw-semibold">
            ✨ Community Rating Platform
          </span>
          <h1 className="fw-extrabold display-5 mb-2">Discover & Rate Top Businesses</h1>
          <p className="opacity-90 lead mb-0">
            Browse verified store listings, explore real customer ratings, and share your experience with 1-to-5 star evaluations.
          </p>
        </div>
      </div>

      {/* Control & Search Toolbar */}
      <div className="custom-card p-3 mb-4">
        <div className="row g-2 align-items-center">
          <div className="col-12 col-md-5">
            <div className="input-group">
              <span className="input-group-text bg-transparent border-end-0 text-muted">🔍</span>
              <input
                type="text"
                className="form-control form-control-custom border-start-0"
                placeholder="Search by Store Name or Address..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
              />
            </div>
          </div>

          <div className="col-6 col-md-3">
            <select className="form-select form-select-custom" value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
              <option value="name">Sort by Store Name</option>
              <option value="address">Sort by Address</option>
            </select>
          </div>

          <div className="col-6 col-md-2">
            <select className="form-select form-select-custom" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
              <option value="ASC">Order: Ascending</option>
              <option value="DESC">Order: Descending</option>
            </select>
          </div>

          <div className="col-12 col-md-2 d-flex justify-content-end">
            <div className="btn-group w-100" role="group">
              {[0, 3, 4].map((stars) => (
                <button
                  key={stars}
                  type="button"
                  className={`btn btn-sm rounded-pill me-1 ${minRating === stars ? 'btn-dark' : 'btn-outline-secondary'}`}
                  onClick={() => setMinRating(stars)}
                >
                  {stars === 0 ? 'All' : `${stars}★+`}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Store Listings Table */}
      <div className="custom-card overflow-hidden">
        <div className="table-responsive custom-table-container">
          <table className="table custom-table align-middle mb-0">
            <thead>
              <tr>
                <th style={{ width: '25%' }}>Store Info</th>
                <th style={{ width: '30%' }}>Location / Address</th>
                <th style={{ width: '15%' }}>Community Score</th>
                <th style={{ width: '15%' }}>Your Saved Rating</th>
                <th style={{ width: '15%' }}>Rate Now</th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                Array.from({ length: 4 }).map((_, i) => (
                  <tr key={i}>
                    <td colSpan="5" className="py-3">
                      <div className="placeholder-glow">
                        <span className="placeholder col-12 rounded" style={{ height: '24px' }}></span>
                      </div>
                    </td>
                  </tr>
                ))
              ) : filteredStores.length > 0 ? (
                filteredStores.map((store) => (
                  <tr key={store.id}>
                    <td>
                      <div className="d-flex align-items-center gap-2">
                        <div className="avatar-placeholder rounded-circle bg-light d-flex align-items-center justify-content-center fw-bold text-primary" style={{ width: '40px', height: '40px' }}>
                          {store.name.charAt(0)}
                        </div>
                        <div>
                          <strong className="d-block text-dark fs-6">{store.name}</strong>
                          <span className="text-muted small">ID: #{store.id}</span>
                        </div>
                      </div>
                    </td>
                    <td className="text-secondary small">{store.address}</td>
                    <td>
                      <span className="badge bg-warning bg-opacity-20 text-dark px-3 py-2 rounded-pill fs-6 fw-bold">
                        ★ {parseFloat(store.overall_rating).toFixed(1)} / 5.0
                      </span>
                    </td>
                    <td>
                      {store.user_submitted_rating ? (
                        <span className="badge bg-success bg-opacity-20 text-success px-3 py-2 rounded-pill fs-6 fw-bold">
                          ★ {store.user_submitted_rating} / 5
                        </span>
                      ) : (
                        <span className="badge bg-light text-muted border px-2 py-1">Not Rated Yet</span>
                      )}
                    </td>
                    <td>
                      <StarRating
                        initialRating={store.user_submitted_rating || 0}
                        onRate={(ratingValue) => handleRatingSubmit(store.id, ratingValue)}
                      />
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-5 text-muted">
                    <span className="fs-1 d-block mb-2">🔍</span>
                    No stores matching your criteria were found.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;