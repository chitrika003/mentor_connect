import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const AdminNavbar = ({ setTitle, title }) => {

  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('adminId');
    if (loggedInUser) {
      setAdmin(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('adminId');
    localStorage.removeItem('adminToken');
    setAdmin(null);
    navigate('/adminlogin');
  };

  console.log({admin});

  const titles = {
    // home: "Home",
    students: "Students",
    mentors: "Mentors",
    addmentor: "Add Mentor",
    addstudent: "Add Student",
    // addattendance: "Add Attendance"
  }

  function handleTitleClick(title) {
    setTitle(title);
  }

  return (
    <nav className="admin-navbar">
    
      <div className="admin-navbar-center">
        <ul className="admin-nav-links">
          {Object.keys(titles).map((key) => (
            <li style={key === title ? {color: 'black', backgroundColor: 'white'} : {}} 
              className={`admin-navbar-link`} 
              key={key} 
              onClick={() => handleTitleClick(key)}>
              {titles[key]}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="admin-navbar-right">
        {admin ? (
          <div className="admin-user-menu">
            <span className="admin-username">{admin}</span>
            <button className="admin-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/adminlogin" className="admin-login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default AdminNavbar;
