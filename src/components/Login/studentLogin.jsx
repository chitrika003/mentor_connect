import React, { useEffect, useState } from 'react';
import './studentLogin.css';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';


export const StudentLogin = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    rollNumber: '',
    password: '',
  });

  useEffect(() => {
    if(localStorage.getItem('studentId')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/student');
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
    console.log('Login attempt with:', formData);
    try {
      setLoading(true);
      const response = await axios.post('http://localhost:9000/student/login', formData);
      if(response.status === 200) {
   
        localStorage.setItem('studentId', response.data.id);
        localStorage.setItem('studentToken', response.data.token);
        setTimeout(() => {
          setLoading(false);
          navigate('/student');
        }, 1000);
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error?.response?.data?.message ?? "Something went wrong");
    }
  };
  
  if(loading) {
    return (
      <div className="student-login-loading-container">
          <div className="student-login-loading-spinner"></div>
          <p className="student-login-loading-text">Checking student login...</p>
      </div>
    )
  }

  return (
    <div className="student-login-container">
      <div className="student-login-card">
        <div className="student-login-left">
          <div className="student-login-overlay">
            <h2 className='student-login-overlay-h2'>Welcome Back</h2>
            <p className='student-login-overlay-p'>Get ready to learn and grow</p>
          </div>
        </div>
        <div className="student-login-right">
          <div className="student-login-header">
            <h1 className='student-login-header-h1'>Student Login</h1>
            <p className='student-login-header-p'>Please enter your credentials to continue</p>
          </div>
          <form onSubmit={handleSubmit} className="student-login-form">
            <div className="student-form-group">
              <label htmlFor="rollNumber" className='student-form-group-label'>Roll Number</label>
              <input
                type="text"
                id="rollNumber"
                name="rollNumber"
                value={formData.rollNumber}
                onChange={handleChange}
                placeholder="Enter your roll number"
                className='student-form-group-input'
                required
              />
            </div>
            <div className="student-form-group">
              <label htmlFor="password" className='student-form-group-label'>Password</label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className='student-form-group-input'
                required
              />
            </div>
            <div className="student-form-options">
              {/* <div className="student-remember-me">
                <input type="checkbox" id="remember" className='student-remember-me-input' />
                <label htmlFor="remember" className='student-remember-me-label'>Remember me</label>
              </div>     */}
              {/* <a href="#" className="student-forgot-password">Forgot Password?</a> */}
            </div>
            <button type="submit" className="student-login-btn">Login</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default StudentLogin;