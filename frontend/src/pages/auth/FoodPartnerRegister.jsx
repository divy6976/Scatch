import React, { useState } from 'react';
import '../../styles/theme.css';
import '../../styles/auth.css';
import { useNavigate } from 'react-router-dom';
import FoodAdd from '../../food-partner/FoodAdd';
import axios from '../../config/axios';
const FoodPartnerRegister = () => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const onSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const restaurantName = e.target.restaurantName.value.trim();
    const ownerName = e.target.ownerName.value.trim();
    const email = e.target.email.value.trim();
    const phone = e.target.phone.value.trim();
    const address = e.target.address.value.trim();
    const password = e.target.password.value;

    if (!restaurantName || !ownerName || !email || !phone || !address || !password) {
      setError('All fields are required');
      return;
    }

    if (password.length < 6) {
      setError('Password must be at least 6 characters long');
      return;
    }

    setLoading(true);
    try {
      await axios.post('http://localhost:6969/api/v1/foodpartner/register', {
        restaurantName,
        name: ownerName,
        email,
        phone,
        address,
        password
      });

      setSuccess('Partner account created! Redirecting to add food...');
      setTimeout(() => navigate('/food/add'), 1500);
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <div className="auth-header">
          <div className="auth-logo">🏪</div>
          <h1 className="auth-title">Partner Registration</h1>
          <p className="auth-subtitle">Join our partner network</p>
        </div>
        
        <form className="auth-form" onSubmit={onSubmit}>
          {error && <div className="error-message" style={{color: 'red', marginBottom: '1rem', textAlign: 'center'}}>{error}</div>}
          {success && <div className="success-message" style={{color: 'green', marginBottom: '1rem', textAlign: 'center'}}>{success}</div>}
          <div className="form-group">
            <label htmlFor="restaurantName" className="form-label">Restaurant Name</label>
            <input
              type="text"
              id="restaurantName"
              name="restaurantName"
              className="form-input"
              placeholder="Enter restaurant name"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="ownerName" className="form-label">Owner Name</label>
            <input
              type="text"
              id="ownerName"
              name="ownerName"
              className="form-input"
              placeholder="Enter owner's name"
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
            <label htmlFor="phone" className="form-label">Phone Number</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              className="form-input"
              placeholder="Enter your phone number"
              required
            />
          </div>
          
          <div className="form-group">
            <label htmlFor="address" className="form-label">Restaurant Address</label>
            <textarea
              id="address"
              name="address"
              className="form-input"
              placeholder="Enter restaurant address"
              rows="3"
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
                <a href="#" className="auth-link">Partner Terms</a>
                {' '}and{' '}
                <a href="#" className="auth-link">Privacy Policy</a>
              </span>
            </label>
          </div>
          
          <button type="submit" className="auth-button" disabled={loading}>
            {loading ? 'Registering...' : 'Register Restaurant'}
          </button>
        </form>
        
        <div className="auth-footer">
          <p className="auth-text">
            Already a partner?{' '}
            <a href="/foodpartner/login" className="auth-link">Sign in</a>
          </p>
          <p className="auth-text mt-md">
            Are you a customer?{' '}
            <a href="/user/register" className="auth-link">Register as User</a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default FoodPartnerRegister;
