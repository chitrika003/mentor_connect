import React, { useState, useEffect } from 'react';
import './mentorLogin.css';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export const MentorLogin = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  useEffect(() => {
    if(localStorage.getItem('mentorId')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/mentor');
      }, 1000);
    }
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login attempt with:', formData);
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:9000/mentor/login', formData);
      if(response.status === 200) {
        setLoading(false);
        localStorage.setItem('mentorId', response.data.id);
        localStorage.setItem('mentorToken', response.data.token);
        navigate('/mentor');
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error?.response?.data?.message ?? "Something went wrong");
    }
  };

  if(loading) {
    return (
      <div className="mentor-login-loading-container">
        <div className="mentor-login-loading-spinner"></div>
        <p className="mentor-login-loading-text">Checking mentor login...</p>
      </div>
    )
  }

  return (
    <div className="mentor-login-container">
      <div className="mentor-login-card">
        <div className="mentor-login-left">
          <div className="mentor-login-overlay">
            <h2 className='mentor-login-overlay-h2'>Welcome Back</h2>
            <p className='mentor-login-overlay-p'>Your students are waiting for your guidance</p>
          </div>
        </div>
        <div className="mentor-login-right">
          <div className="mentor-login-header">
            <h1 className='mentor-login-header-h1'>Mentor Login</h1>
            <p className='mentor-login-header-p'>Please enter your credentials to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="mentor-login-form">
            <div className="form-group">
              <label htmlFor="email" className='form-group-label'>Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter your email"
                className='form-group-input'
                required
              />
            </div>
            <div className="form-group">
              <label htmlFor="password" className='form-group-label'>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className='form-group-input'
                required
              />
            </div>
            <div className="form-options">
              {/* <div className="remember-me">
                <input type="checkbox" id="remember" className='remember-me-input' />
                <label htmlFor="remember" className='remember-me-label'>Remember me</label>
              </div> */}
              {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
            </div>
            <button type="submit" className="login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default MentorLogin;