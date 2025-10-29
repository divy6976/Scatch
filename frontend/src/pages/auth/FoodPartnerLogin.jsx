import React, { useState } from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';
import FoodAdd from '../../food-partner/FoodAdd';

const FoodPartnerLogin = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');

    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:6969/api/v1/foodpartner/login', {
        email,
        password
      });
      navigate('/food/add');
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏪</div>
          <h1 className="auth-title">Partner Login</h1>
          <p className="auth-subtitle">Access your restaurant dashboard</p>
        </div>
        
        <form className="auth-form" onSubmit={onSubmit}>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          <div className="form-group">
            <label htmlFor="email" className="form-label">Email Address</label>
            <input
              type="email"
              id="email"
              name="email"
              className="form-input"
              placeholder="Enter your email"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="password" className="form-label">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="Enter your password"
              required
            />
          </div>
          
          <div className="form-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                <input type="checkbox" />
                <span className="auth-text">Remember me</span>
              </label>
              <a href="#" className="auth-link">Forgot password?</a>
            </div>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-text">
            New partner?{' '}
            <a href="/foodpartner/register" className="auth-link">Register here</a>
          </p>
          <p className="auth-text mt-md">
            Are you a customer?{' '}
            <a href="/user/login" className="auth-link">Login as User</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerLogin;
