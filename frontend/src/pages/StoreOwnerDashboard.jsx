import React, { useState, useEffect } from 'react';
import API from '../services/api';

const StoreOwnerDashboard = () => {
  const [data, setData] = useState({
    storeName: '',
    address: '',
    averageRating: '0.00',
    raters: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true);
        const res = await API.get('/stores/owner-dashboard');
        setData(res.data);
      } catch (err) {
        console.error('Error loading store owner dashboard:', err);
      } finally {
        setLoading(false);
      }
    };
    fetchDashboard();
  }, []);

  // Calculate rating frequency breakdown (1 to 5 stars)
  const getDistribution = () => {
    const counts = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 };
    data.raters.forEach((r) => {
      if (counts[r.rating] !== undefined) counts[r.rating]++;
    });
    return counts;
  };

  const distribution = getDistribution();
  const totalReviews = data.raters.length;

  return (
    <div className="container py-4">
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center mb-4 gap-3">
        <div>
          <h2 className="fw-extrabold display-title mb-1">Executive Analytics Portal</h2>
          <p className="text-muted mb-0">Real-time performance ratings, customer feedback breakdown, and score velocity.</p>
        </div>
      </div>

      {loading ? (
        <div className="custom-card p-5 text-center text-muted">
          <div className="spinner-border text-primary mb-2" role="status"></div>
          <p className="mb-0 fw-medium">Calculating store metrics...</p>
        </div>
      ) : (
        <>
          {/* Main Key Performance Indicators */}
          <div className="row g-3 mb-4">
            <div className="col-12 col-md-6">
              <div className="metric-card p-4 h-100 d-flex flex-column justify-content-between">
                <div className="d-flex justify-content-between align-items-center mb-3">
                  <span className="text-muted fw-semibold small text-uppercase">Overall Reputation Score</span>
                  <span className="badge bg-warning bg-opacity-20 text-dark px-3 py-1 rounded-pill fw-bold">Active</span>
                </div>
                <div className="d-flex align-items-baseline gap-2">
                  <h1 className="display-4 fw-extrabold text-dark mb-0">★ {parseFloat(data.averageRating).toFixed(2)}</h1>
                  <span className="text-muted fs-5">/ 5.0</span>
                </div>
                <p className="text-muted small mt-2 mb-0">Based on {totalReviews} verified customer submissions.</p>
              </div>
            </div>

            <div className="col-12 col-md-6">
              <div className="custom-card p-4 h-100">
                <h6 className="fw-bold text-dark mb-3">Rating Score Distribution</h6>
                {[5, 4, 3, 2, 1].map((star) => {
                  const count = distribution[star];
                  const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0;
                  return (
                    <div key={star} className="d-flex align-items-center gap-2 mb-2">
                      <span className="small fw-bold text-muted style-star-label" style={{ width: '35px' }}>{star} ★</span>
                      <div className="progress flex-grow-1" style={{ height: '8px', borderRadius: '4px' }}>
                        <div
                          className="progress-bar bg-warning"
                          role="progressbar"
                          style={{ width: `${percentage}%` }}
                          aria-valuenow={percentage}
                          aria-valuemin="0"
                          aria-valuemax="100"
                        ></div>
                      </div>
                      <span className="small text-muted" style={{ width: '30px', textAlign: 'right' }}>{count}</span>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Feedback Breakdown Grid */}
          <div className="custom-card overflow-hidden">
            <div className="p-3 border-bottom bg-light d-flex justify-content-between align-items-center">
              <h5 className="fw-bold text-dark mb-0">Customer Feedback Logs</h5>
              <span className="badge bg-primary rounded-pill px-3">{totalReviews} Entries</span>
            </div>

            <div className="table-responsive custom-table-container">
              <table className="table custom-table align-middle mb-0">
                <thead>
                  <tr>
                    <th>Customer Name</th>
                    <th>Email Address</th>
                    <th>Rating Score</th>
                    <th>Date Received</th>
                  </tr>
                </thead>
                <tbody>
                  {data.raters.length > 0 ? (
                    data.raters.map((r, idx) => (
                      <tr key={idx}>
                        <td><strong className="text-dark">{r.name}</strong></td>
                        <td className="text-secondary small">{r.email}</td>
                        <td>
                          <span className={`badge px-3 py-1 fs-6 ${r.rating >= 4 ? 'bg-success' : r.rating === 3 ? 'bg-warning text-dark' : 'bg-danger'}`}>
                            ★ {r.rating} / 5
                          </span>
                        </td>
                        <td className="text-secondary small">
                          {new Date(r.updated_at).toLocaleDateString('en-US', {
                            year: 'numeric',
                            month: 'short',
                            day: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="4" className="text-center py-5 text-muted">
                        No feedback logs recorded yet.
                      </td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default StoreOwnerDashboard;