import React, { useState, useEffect } from 'react';
import './overallMentors.css';
import DepartmentNavbar from '../Navbar/departmentNavbar';
import Search from '../Search/Search';
import { departments } from '../../../../utils';
import axios from 'axios';
import AssignStudentsModal from './modal';

const OverallMentors = () => {

  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [mentors, setMentors] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedMentor, setSelectedMentor] = useState(null);
  useEffect(() => {
    fetchMentorsByDepartment(selectedDepartment.name);
  }, []);

  // Mock function to fetch mentors by department
  const fetchMentorsByDepartment = async (departmentName) => {
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9000/get/all/mentors/${departmentName}`, {
        headers: {
          "x-auth-token": localStorage.getItem('adminToken')
        }
      })


      if(response.data.error === "jwt must be provided") {
        alert("Please login to continue");
        navigate('/admin');
      }


      if(response.status === 200) {
        setTimeout(() => {
          setLoading(false);
          setMentors(response.data.mentors);
        }, 1000);
      }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Error fetching mentors");
      console.log(error)
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    fetchMentorsByDepartment(department.name);
  };

  console.log(mentors, "mentors");

  return (
    <div className="admin-mentors-container">

      <DepartmentNavbar 
        departments={departments} 
        selectedDepartment={selectedDepartment} 
        handleDepartmentSelect={handleDepartmentSelect} 
      />

      {selectedDepartment && (
        <section className="admin-mentors-section">
          
          <Search
            selectedDepartment={selectedDepartment}
            fetchStudentsByDepartment={fetchMentorsByDepartment}
            setStudents={setMentors}
            students={mentors}
            title="Mentor"
          />
          
          {loading ? (
            <div className="admin-mentors-loading">
              <div className="spinner"></div>
              <p>Loading mentors...</p>
            </div>        
          ) : mentors && mentors?.length > 0 ? (
            <div className="admin-mentors-grid">
              {mentors?.map(mentor => (
                <div key={mentor.id} className="admin-mentor-card">
                  <div className="admin-mentor-header">
                    <img src={mentor.photo} alt={mentor.name} className="admin-mentor-photo" />
                    <div className="admin-mentor-basic-info">
                      <h3>{mentor.name}</h3>
                      <p><strong>Department:</strong> {mentor.department}</p>
                    </div>
                  </div>
                  
                  <div className="admin-mentor-details">
                    <p><strong>Email:</strong> {mentor.email}</p>
                    <p><strong>Phone:</strong> {mentor.phone}</p>
                    <p><strong>Students Assigned:</strong> {mentor.studentsAssigned?.length ?? 0}</p>
                    <p><strong>Experience:</strong> {mentor.experience} years</p>
                    <p><strong>Specialization:</strong> {mentor.specialization}</p>
                    
                    
                    <button 
                      className="assign-students-btn"
                      onClick={() => {
                        setSelectedMentor(mentor);
                        setIsModalOpen(true);
                      }}
                    >
                      <i className="fas fa-user-plus"></i> Assign Students
                    </button>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-mentors-no-mentors">
              <p className='admin-mentors-no-mentors-text'>No mentors found</p>
            </div>
          )}
        </section>
      )}

      {isModalOpen && (
        <AssignStudentsModal 
          isOpen={isModalOpen} 
          onClose={() => setIsModalOpen(false)} 
          mentor={selectedMentor} 
        />
      )}
    </div>
  );
};

export default OverallMentors;
