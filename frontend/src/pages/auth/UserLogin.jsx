import React, { useState } from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import axios from '../../config/axios';


const UserLogin = () => {
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
      await axios.post('http://localhost:6969/api/v1/login', {
        email,
        password
      });
      navigate('/');
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
          <div className="auth-logo">🍽️</div>
          <h1 className="auth-title">Welcome Back</h1>
          <p className="auth-subtitle">Sign in to your account</p>
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
            Don't have an account?{' '}
            <a href="/user/register" className="auth-link">Sign up</a>
          </p>
          <p className="auth-text mt-md">
            Are you a restaurant owner?{' '}
            <a href="/foodpartner/login" className="auth-link">Login as Food Partner</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
