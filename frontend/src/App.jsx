import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider } from './context/AuthContext';
import Navbar from './components/Navbar';
import ProtectedRoute from './components/ProtectedRoute';

import Login from './pages/Login';
import Signup from './pages/Signup';
import AdminDashboard from './pages/AdminDashboard';
import UserDashboard from './pages/UserDashboard';
import StoreOwnerDashboard from './pages/StoreOwnerDashboard';
import UpdatePassword from './pages/UpdatePassword';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="min-vh-100 d-flex flex-column">
          <Navbar />
          <ToastContainer position="top-right" autoClose={3000} hideProgressBar={false} newestOnTop closeOnClick pauseOnHover />
          <div className="flex-grow-1">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/signup" element={<Signup />} />
              
              <Route path="/admin" element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN']}>
                  <AdminDashboard />
                </ProtectedRoute>
              } />

              <Route path="/stores" element={
                <ProtectedRoute allowedRoles={['NORMAL_USER']}>
                  <UserDashboard />
                </ProtectedRoute>
              } />

              <Route path="/owner" element={
                <ProtectedRoute allowedRoles={['STORE_OWNER']}>
                  <StoreOwnerDashboard />
                </ProtectedRoute>
              } />

              <Route path="/update-password" element={
                <ProtectedRoute allowedRoles={['SYSTEM_ADMIN', 'NORMAL_USER', 'STORE_OWNER']}>
                  <UpdatePassword />
                </ProtectedRoute>
              } />

              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          </div>
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;