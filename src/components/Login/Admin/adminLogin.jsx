import React, { useState, useEffect } from 'react';
import './adminLogin.css';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import { Loading } from '../../Helper/Loading/Loading';

export const AdminLogin = () => {

  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    type: 'login',
    secret: '',
  });

  useEffect(() => {
    if(localStorage.getItem('adminId')) {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        navigate('/admin');
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

  const toggleRegister = () => {
    setIsRegister(!isRegister);
    setFormData({
      ...formData,
      type: !isRegister ? 'register' : 'login',
      secret: '',
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);
      const response = await axios.post('http://localhost:9000/admin/login', formData);
      if(response.status === 200) {
        setLoading(false);
        
        if (formData.type === 'register') {
          alert('Registration successful! Please login to continue.');
          setIsRegister(false);
          setFormData({
            email: '',
            password: '',
            type: 'login',
            secret: '',
          });
        } else {
          localStorage.setItem('adminId', response.data.id);
          localStorage.setItem('adminToken', response.data.token);
          navigate('/admin');
        }
      }
    } catch (error) {
      console.log(error);
      setLoading(false);
      alert(error?.response?.data?.message ?? "Something went wrong");
    }
  };

  if(loading) {
    return <Loading />
  }

  return (
    <div className="mentor-login-container">
      <div className="mentor-login-card">
        <div className="mentor-login-left">
          <div className="mentor-login-overlay">
            <h2 className='mentor-login-overlay-h2'>Welcome Back</h2>
            <p className='mentor-login-overlay-p'>Your students and mentors are waiting for your guidance</p>
          </div>
        </div>
        <div className="mentor-login-right">
          <div className="mentor-login-header">
            <h1 className='mentor-login-header-h1'>{isRegister ? 'Admin Register' : 'Admin Login'}</h1>
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
            {isRegister && (
              <div className="form-group">
                <label htmlFor="secret" className='form-group-label'>Secret Key</label>
                <input
                  type="text"
                  id="secret"
                  name="secret"
                  value={formData.secret}
                  onChange={handleChange}
                  placeholder="Enter secret key"
                  className='form-group-input'
                  required
                />
              </div>
            )}
            {/* <div className="form-options"> */}
              {/* <div className="remember-me">
                <input type="checkbox" id="remember" className='remember-me-input' />
                <label htmlFor="remember" className='remember-me-label'>Remember me</label>
              </div> */}
              {/* <a href="#" className="forgot-password">Forgot Password?</a> */}
            {/* </div> */}
            <button type="submit" className="login-btn">{isRegister ? 'Register' : 'Login'}</button>
          </form>
          <div className="admin-login-footer">
            <p className="admin-login-footer-p">
              {isRegister ? "Already have an account? " : "Don't have an account? "}
              <span className="admin-login-footer-span" onClick={toggleRegister}>
                {isRegister ? "Login" : "Register"}
              </span>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;