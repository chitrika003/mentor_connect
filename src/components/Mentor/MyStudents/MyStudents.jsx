import React, { useEffect, useState } from 'react'
import { LowAttendance } from '../Helper/LowAttendance/LowAttendance'
import './MyStudents.css'
import axios from 'axios';
import { Loading } from '../../Helper/Loading/Loading';

export const MyStudents = () => {

  const [allData, setAllData] = useState([]);

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);

  const mentorId = localStorage.getItem('mentorId');
  const token = localStorage.getItem('mentorToken');

  useEffect(() => {
    getStudents();
  }, []);

  async function getStudents() {
    try {
      setLoading(true);
      const res = await axios.get(`http://localhost:9000/get/students/mentor/${mentorId}`,
         {
        headers: {
          "x-auth-token": token
        }
      }
    );
    console.log(res.data);
    if (res.status === 200) {
      setAllData(res?.data);
      setLoading(false);
    }
    } catch (err) {
      alert("Error fetching students");
      setLoading(false);
      console.log(err);
    }
  }
  const departments = [...new Set(allData?.students?.map(student => student.department))];

  // Filter students
  const filteredStudents = allData?.students?.filter(student => {
    const matchesDepartment = departmentFilter === '' || student.department === departmentFilter;
    const matchesSearch = searchTerm === '' || 
      student.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.rollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.email.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesDepartment && matchesSearch;
  });

  // Function to handle opening the modal
  const handleViewMore = (student) => {
    setSelectedStudent(student);
    setShowModal(true);
  };

  // Function to close the modal
  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  if(loading) {
    return <Loading />
  }

  return (
    <div className="mystudent-container">
      <div className="mystudent-sidebar">
        <LowAttendance totalAssignedStudents={allData?.totalStudents} count={allData?.lowAttendanceCount} students={allData?.studentsWithLowAttendance} />
      </div>
      <div className="mystudent-main">
        <h2 className="mystudent-title">Student Details</h2>
        
        <div className="mystudent-filters">
          <div className="mystudent-search">
            <input
              type="text"
              placeholder="Search by name, roll number or email"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="mystudent-search-input"
            />
          </div>
          
          <div className="mystudent-department-filter">
            <select 
              value={departmentFilter} 
              onChange={(e) => setDepartmentFilter(e.target.value)}
              className="mystudent-select"
            >
              <option value="">All Departments</option>
              {departments.map((dept, index) => (
                <option key={index} value={dept}>{dept}</option>
              ))}
            </select>
          </div>
        </div>
        
        <div className="mystudent-table-container">
          <table className="mystudent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Roll Number</th>
                {/* <th>Date of Birth</th> */}
                <th>CGPA</th>
                <th>Email</th>
                <th>Phone</th>
                {/* <th>Department</th> */}
                <th>Attendance</th>
                <th>View Details</th>
                
              </tr>
            </thead>
            <tbody>
              {filteredStudents?.length > 0 ? (
                filteredStudents?.map((student) => (
                  <tr key={student._id}>
                    <td>{student.name}</td>
                    <td>{student.rollNumber}</td>
                    {/* <td>{student.dateOfBirth}</td> */}
                    <td>{student?.cgpa ?? "--"}</td>
                    <td>{student.email}</td>
                    <td>{student.phone}</td>
                    {/* <td>{student.department}</td> */}
                    <td>{Math.round(student.averageAttendance*10)/10}%</td>
                    <td>
                      <button 
                        className="mystudent-view-button"
                        onClick={() => handleViewMore(student)}
                      >
                        View More
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="mystudent-no-data">No students found</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal */}
      {showModal && selectedStudent && (
        <div className="mystudent-modal-overlay" onClick={closeModal}>
          <div className="mystudent-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="mystudent-modal-header">
              <h2>{selectedStudent.name}'s Details</h2>
              <button className="mystudent-modal-close-btn" onClick={closeModal}>×</button>
            </div>
            
            <div className="mystudent-modal-body">
              <div className="mystudent-info-section">
                <h3>Student Information</h3>
                <div className="mystudent-info-grid">
                  <div className="mystudent-info-item">
                    <span className="mystudent-info-label">Department:</span>
                    <span className="mystudent-info-value">{selectedStudent.department}</span>
                  </div>
                  <div className="mystudent-info-item">
                    <span className="mystudent-info-label">Date of Birth:</span>
                    <span className="mystudent-info-value">{selectedStudent.dateOfBirth}</span>
                  </div>
                </div>
              </div>
              
              <div className="mystudent-info-section">
                <h3>Family Information</h3>
                <div className="mystudent-info-grid">
                  <div className="mystudent-info-item">
                    <span className="mystudent-info-label">Father's Name:</span>
                    <span className="mystudent-info-value">{selectedStudent.fatherName || "Not provided"}</span>
                  </div>
                  <div className="mystudent-info-item">
                    <span className="mystudent-info-label">Father's Number:</span>
                    <span className="mystudent-info-value">{selectedStudent.fatherPhone || "Not provided"}</span>
                  </div>
                  <div className="mystudent-info-item">
                    <span className="mystudent-info-label">Mother's Name:</span>
                    <span className="mystudent-info-value">{selectedStudent.motherName || "Not provided"}</span>
                  </div>
                  <div className="mystudent-info-item">
                    <span className="mystudent-info-label">Mother's Number:</span>
                    <span className="mystudent-info-value">{selectedStudent.motherPhone || "Not provided"}</span>
                  </div>
                </div>
              </div>
              
              <div className="mystudent-info-section">
                <h3>Address</h3>
                <div className="mystudent-info-item mystudent-full-width">
                  <span className="mystudent-info-value mystudent-address">{selectedStudent.address || "Not provided"}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
