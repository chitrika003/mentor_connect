import React, { useState, useEffect } from 'react';
import './Admin.css';
import AdminNavbar from './Navbar/navbar';
import OverallStudent from './Students/overallStudent';
import OverallMentors from './Mentors/overallMentors';
import AddMentor from './addMentor/addMentor';
import AddStudent from './addStudent/addStudent';

const Admin = () => {

  // const [loading, setLoading] = useState(true);
  const [title, setTitle] = useState('students');

  useEffect(() => {
    setTitle(title);
  }, [title]);

  // if (loading) {
  //   return <div className="loading">Loading...</div>;
  // }

  console.log(title);

  return (
    <div className="admin-container">
      <div className="admin-navbar-container"><AdminNavbar title={title} setTitle={setTitle} /></div>

      <div className="admin-body-container">
        {
          // title === 'home' ? <Home /> : 
          title === 'students' ? <OverallStudent /> : 
          title === 'mentors' ? <OverallMentors /> :
          title === 'addmentor' ? <AddMentor /> :
          title === 'addstudent' ? <AddStudent /> :
          null
        }

      </div>
    </div>
  );
};

export default Admin; 