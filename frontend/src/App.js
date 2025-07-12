import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

// Auth Components
import Login from './components/auth/Login';
import Register from './components/auth/Register';

// Main Components
import Header from './components/common/Header';
import Footer from './components/common/Footer';

// Pages
import HomePage from './pages/HomePage';
import ProfilePage from './pages/ProfilePage';
import SwapListPage from './pages/SwapListPage';
import SwapRequestPage from './pages/SwapRequestPage';
import UserSearchPage from './pages/UserSearchPage';
import AdminDashboard from './pages/AdminDashboard';

// Context
import { AuthProvider } from './context/AuthContext';
import PrivateRoute from './components/common/PrivateRoute';
import AdminRoute from './components/common/AdminRoute';

function App() {
  return (
    <AuthProvider>
      <Router>
        <div className="app-container">
          <Header />
          <main className="main-content">
            <ToastContainer position="top-right" autoClose={3000} />
            <Routes>
              <Route path="/" element={<UserSearchPage />} /> {/* Changed to UserSearchPage */}
              <Route path="/home" element={<HomePage />} /> {/* Keep original HomePage accessible */}
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/search" element={<UserSearchPage />} />
              
              {/* Protected Routes */}
              <Route path="/profile" element={
                <PrivateRoute>
                  <ProfilePage />
                </PrivateRoute>
              } />
              <Route path="/swaps" element={
                <PrivateRoute>
                  <SwapListPage />
                </PrivateRoute>
              } />
              <Route path="/swaps/new" element={
                <PrivateRoute>
                  <SwapRequestPage />
                </PrivateRoute>
              } />
              
              {/* Admin Routes */}
              <Route path="/admin/*" element={
                <AdminRoute>
                  <AdminDashboard />
                </AdminRoute>
              } />
              
              {/* Fallback route */}
              <Route path="*" element={<Navigate to="/" replace />} />
            </Routes>
          </main>
          <Footer />
        </div>
      </Router>
    </AuthProvider>
  );
}

export default App;
