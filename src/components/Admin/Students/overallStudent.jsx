import React, { useState, useEffect } from 'react';
import './overallStudent.css';
import DepartmentNavbar from '../Navbar/departmentNavbar';
import Search from '../Search/Search';
import { calculateCurrentMonthLeaves, calculateMonthlyAttendancePercentage, calculateOverallAttendancePercentage, calculatePendingLeaves, checkIfAttendanceIsUpToDate, departments } from '../../../../utils';
import axios from 'axios';
import { StudentEditModal } from './modal';
import { useNavigate } from 'react-router-dom';

const OverallStudent = () => {

  const navigate = useNavigate();
  const [selectedDepartment, setSelectedDepartment] = useState(departments[0]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [attendanceData, setAttendanceData] = useState({
    month: new Date().toLocaleString('default', { month: 'long' }),
    totalWorkingDays: 0,
    leavesTaken: 0
  });
  const [showViewModal, setShowViewModal] = useState(false);
  const [viewStudent, setViewStudent] = useState(null);

  useEffect(() => {
    fetchStudentsByDepartment(selectedDepartment.name);
  }, []);

  // Mock function to fetch students by department
  const fetchStudentsByDepartment = async (departmentName) => {
    console.log(departmentName)
    try {
      setLoading(true);
      const response = await axios.get(`http://localhost:9000/get/all/students/${departmentName}`, {
        headers: {
          "x-auth-token": localStorage.getItem('adminToken')
        }
      })
      if(response.data.error === "jwt must be provided") {
        alert("Please login to continue");
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminId');
        navigate('/adminlogin');
        return;
      }
      setTimeout(() => {
        setLoading(false);
        setStudents(response.data.students);
      }, 1000);
    } catch (error) {
      alert(error?.response?.data?.message ?? "Error fetching students");
      console.log(error)
    }
  };

  const handleDepartmentSelect = (department) => {
    setSelectedDepartment(department);
    fetchStudentsByDepartment(department.name);
  };

  const handleEditClick = (student) => {
    setSelectedStudent(student);
    setShowEditModal(true);
  };

  const handleViewClick = (student) => {
    setViewStudent(student);
    setShowViewModal(true);
  };

  const handleCloseModal = () => {
    setShowEditModal(false);
    setSelectedStudent(null);
  };

  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setViewStudent(null);
  };

  const handleAttendanceChange = (e) => {
    const { name, value } = e.target;
    setAttendanceData({
      ...attendanceData,
      [name]: value
    });
  };

  const handleSubmitAttendance = async () => {
    try {

      const totalWorkingDays = parseInt(attendanceData.totalWorkingDays);
      const leavesTaken = parseInt(attendanceData.leavesTaken);
      const month = attendanceData.month;

      if(totalWorkingDays < leavesTaken) {
        alert("Total working days cannot be less than leaves taken");
        return;
      }

      if(totalWorkingDays === 0) {
        alert("Total working days cannot be 0");
        return;
      }

      if(leavesTaken < 0) {
        alert("Leaves taken cannot be negative");
        return;
      }
         
      const response = await axios.post(`http://localhost:9000/update/student/attendance/${selectedStudent.rollNumber}`, {
        month,
        totalWorkingDays,
        leavesTaken
      }, {
        headers: {
          "x-auth-token": localStorage.getItem('adminToken')
        }
      });

      if(response.status === 200) {
        alert("Attendance updated successfully");
        setAttendanceData({
          month: new Date().toLocaleString('default', { month: 'long' }),
          totalWorkingDays: 0,
          leavesTaken: 0
        });
        handleCloseModal();
        fetchStudentsByDepartment(selectedDepartment.name);
      }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Error updating attendance");
      console.error('Error updating attendance:', error);
    }
  };

  return (
    <div className="admin-students-container">
      
      <DepartmentNavbar 
        departments={departments} 
        selectedDepartment={selectedDepartment} 
        handleDepartmentSelect={handleDepartmentSelect} 
      />

      {selectedDepartment && (
        <section className="admin-students-section">

          <Search
            selectedDepartment={selectedDepartment}
            fetchStudentsByDepartment={fetchStudentsByDepartment}
            setStudents={setStudents}
            students={students}
            title="Student"
          />
          
          {loading ? (
            <div className="admin-students-loading">
              <div className="spinner"></div>
              <p>Loading students...</p>
            </div>
          ) : students.length > 0 ? (
            <div className="admin-students-grid">
              {students?.map(student => (
                <div key={student.id} className="admin-student-card">
                  <div className="admin-student-header">
                    <div className="admin-student-header-left">
                    <div className="admin-student-photo-container">
                      <img src={student.photo} alt={student.name} className="admin-student-photo" />
                    </div>
                    <div className="admin-student-basic-info">
                      <h3 className="admin-student-name">{student.name}</h3>
                      <p className="admin-student-detail"><span>Roll:</span> {student.rollNumber}</p>
                      <p className="admin-student-detail"><span>DOB:</span> {new Date(student.dateOfBirth).toLocaleDateString()}</p>
                      <p className="admin-student-detail"><span>CGPA:</span> {student?.cgpa ?? "--"}</p>
                      </div>
                    </div>
                    <div className="admin-student-header-right">
                        <button className="admin-student-view-btn" title="View Student" onClick={() => handleViewClick(student)}>
                          view more
                        </button>
                        <button style= {{color: checkIfAttendanceIsUpToDate(student.attendance) ? "green" : "red"}} className="admin-student-edit-btn" title="Edit Student" onClick={() => handleEditClick(student)}>
                          <i className="fas fa-edit"></i>
                        </button>
                    </div>
                  </div>
                  
                  <div className="admin-student-compact-stats">
                    <div className="admin-student-attendance">
                      <div className="attendance-bars">
                        <div className="attendance-bar">
                          <div className="bar-label">Overall Attendance</div>
                          <div className="bar-container">
                            <div className="bar-fill" style={{width: `${calculateOverallAttendancePercentage(student.attendance) || 0}%`, backgroundColor: '#4CAF50'}}></div>
                            <span className="bar-value">{calculateOverallAttendancePercentage(student.attendance) || 0}%</span>
                          </div>
                        </div>
                        <div className="attendance-bar">
                          <div className="bar-label">Monthly Attendance</div>
                          <div className="bar-container">
                            <div className="bar-fill" style={{width: `${calculateMonthlyAttendancePercentage(student.attendance) || 0}%`, backgroundColor: '#2196F3'}}></div>
                            <span className="bar-value">{calculateMonthlyAttendancePercentage(student.attendance) || 0}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    <div className="admin-student-metrics">
                      <div className="metric-item">
                        <span className="metric-value">{student.availedLeaves ?? "--"}</span>
                        <span className="metric-label">Total Leaves</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value">{calculateCurrentMonthLeaves(student.attendance) ?? 0}</span>
                        <span className="metric-label">Current Month Leaves</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value">{calculatePendingLeaves(student.attendance, student.availedLeaves) ?? 0}</span>
                        <span className="metric-label">Pending Leaves</span>
                      </div>
                      <div className="metric-item">
                        <span className="metric-value">{student.meetingsAttended ?? 0}</span>
                        <span className="metric-label">Meetings Attended</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="admin-students-no-students">
              <p className='admin-students-no-students-text'>No students found</p>
            </div>
          )}
        </section>
      )}

      {showEditModal && selectedStudent && (
        <StudentEditModal
          selectedStudent={selectedStudent} 
          handleCloseModal={handleCloseModal} 
          handleAttendanceChange={handleAttendanceChange} 
          attendanceData={attendanceData}
          setShowEditModal={setShowEditModal}
          setSelectedStudent={setSelectedStudent}
          setAttendanceData={setAttendanceData}
          handleSubmitAttendance={handleSubmitAttendance}
        />
      )}

      {showViewModal && viewStudent && (
        <div className="modal-backdrop">
          <div className="student-view-modal">
            <div className="modal-header">
              <h2 style={{color: "#ffffff"}}>Student Details</h2>
              <button className="close-btn" onClick={handleCloseViewModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="student-info-section">
                <div className="student-photo-container">
                  <img src={viewStudent.photo} alt={viewStudent.name} className="student-photo-large" />
                </div>
                <div className="student-basic-details">
                  <h3>{viewStudent.name}</h3>
                  <p><strong>Roll Number:</strong> {viewStudent.rollNumber}</p>
                  <p><strong>Department:</strong> {viewStudent.department}</p>
                  <p><strong>Date of Birth:</strong> {new Date(viewStudent.dateOfBirth).toLocaleDateString()}</p>
                  <p><strong>CGPA:</strong> {viewStudent?.cgpa ?? "--"}</p>
                </div>
              </div>
              
              <div className="student-contact-details">
                <h4>Contact Information</h4>
                <p><strong>Address:</strong> {viewStudent.address || "Not provided"}</p>
                <p><strong>Email:</strong> {viewStudent.email || "Not provided"}</p>
                <p><strong>Phone:</strong> {viewStudent.phone || "Not provided"}</p>
              </div>
              
              <div className="student-family-details">
                <h4>Family Information</h4>
                <p><strong>Father's Name:</strong> {viewStudent.fatherName || "Not provided"}</p>
                <p><strong>Father's Number:</strong> {viewStudent.fatherPhone || "Not provided"}</p>
                <p><strong>Mother's Name:</strong> {viewStudent.motherName || "Not provided"}</p>
                <p><strong>Mother's Number:</strong> {viewStudent.motherPhone || "Not provided"}</p>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default OverallStudent;