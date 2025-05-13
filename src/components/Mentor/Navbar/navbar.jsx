import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './navbar.css';

const MentorNavbar = ({ setTitle, title }) => {

  const navigate = useNavigate();
  const [mentorname, setMentorname] = useState(null);

  useEffect(() => {
    const loggedInUser = localStorage.getItem('mentorId');
    if (loggedInUser) {
      setMentorname(loggedInUser);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('mentorId');
    localStorage.removeItem('mentorToken');
    setMentorname(null);
    navigate('/');
  };

  const titles = {
    home: "Home",
    dashboard: "Dashboard",
    // availability: "Availability",
    students: "Students",
    meetings: "Meetings"
  }

  function handleTitleClick(title) {
    setTitle(title);
  }

  return (
    <nav className="mentor-navbar">
    
      <div className="mentor-navbar-center">
        <ul className="mentor-nav-links">
          {Object.keys(titles).map((key) => (
            <li style={key === title ? {color: 'black', backgroundColor: 'white'} : {}} 
              className={`mentor-navbar-link`} 
              key={key} 
              onClick={() => handleTitleClick(key)}>
              {titles[key]}
            </li>
          ))}
        </ul>
      </div>
      
      <div className="mentor-navbar-right">
        {mentorname ? (
          <div className="mentor-user-menu">
            {/* <span className="mentor-username">{username}</span> */}
            <button className="mentor-logout-btn" onClick={handleLogout}>Logout</button>
          </div>
        ) : (
          <Link to="/mentorlogin" className="mentor-login-btn">Login</Link>
        )}
      </div>
    </nav>
  );
};

export default MentorNavbar;
