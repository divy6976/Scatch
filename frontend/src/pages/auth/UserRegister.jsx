import React, { useState } from 'react';
import axios from '../../config/axios';
import '../../styles/theme.css';
import '../../styles/auth.css';

import { useNavigate } from 'react-router-dom';


const UserRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const fullName = e.target.fullName.value.trim();
    const email = e.target.email.value.trim();
    const password = e.target.password.value;

    // Client-side validation
    if (!fullName || !email || !password) {
      setError('Name, email and password are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    console.log(fullName, email, password);

    try {
      const response = await axios.post('http://localhost:6969/api/v1/register', {
        name: fullName,
        email,
        password
      });

      console.log('Registration successful:', response.data);
      setSuccess('Account created successfully! Redirecting to login...');
      
      // Redirect to login page after 2 seconds
      setTimeout(() => {
        navigate('/')
      }, 2000);

    } catch (error) {
      console.error('Registration error:', error.response?.data || error.message);
      setError(error.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  }




  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🍽️</div>
          <h1 className="auth-title">Create Account</h1>
          <p className="auth-subtitle">Join us and discover amazing food</p>
        </div>
        
        <form className="auth-form" onSubmit={onSubmit}>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          {success && <div className="success-message" style={{color: 'green', marginBottom: '1rem', textAlign: 'center'}}>{success}</div>}
          
          <div className="form-group">
            <label htmlFor="fullName" className="form-label">Full Name</label>
            <input
              type="text"
              id="fullName"
              name="fullName"
              className="form-input"
              placeholder="Enter your full name"
              required
            />
          </div>
          
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
              placeholder="Create a password"
              required
            />
          </div>
          
          <div className="form-group">
            <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
              <input type="checkbox" required />
              <span className="auth-text">
                I agree to the{' '}
                <a href="#" className="auth-link">Terms of Service</a>
                {' '}and{' '}
                <a href="#" className="auth-link">Privacy Policy</a>
              </span>
            </label>
          </div>
          
          <button type="submit" className="auth-button"  disabled={loading}>
            {loading ? 'Creating Account...' : 'Create Account'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-text">
            Already have an account?{' '}
            <a href="/user/login" className="auth-link">Sign in</a>
          </p>
          <p className="auth-text mt-md">
            Are you a restaurant owner?{' '}
            <a href="/foodpartner/register" className="auth-link">Register as Food Partner</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default UserRegister;
