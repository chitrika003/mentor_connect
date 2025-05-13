import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const StudentNavbar = ({ setTitle, title }) => {

  const navigate = useNavigate();
  const [username, setUsername] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('studentId');
    if (loggedInUser) {
      setUsername(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('studentId');
    localStorage.removeItem('studentToken');
    setUsername(null);
    navigate('/');
  };

  const titles = {
    home: "Home",
    dashboard: "Dashboard",
    bookings: "Bookings",
    newbooking: "New Booking"
  }

  function handleTitleClick(title) {
    setTitle(title);
  }

  return (
    <nav className="student-navbar">
    
      <div className="student-navbar-center">
        <ul className="student-nav-links">
          {Object.keys(titles).map((key) => (
            <li style={key === title ? {color: 'black', backgroundColor: 'white'} : {}} 
              className={`student-navbar-link`} 
              key={key} 
              onClick={() => handleTitleClick(key)}>
              {titles[key]}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="student-navbar-right">
        {username ? (
          <div className="student-user-menu">
            {/* <span className="student-username">{username}</span> */}
            <button className="student-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/studentlogin" className="student-login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default StudentNavbar;
