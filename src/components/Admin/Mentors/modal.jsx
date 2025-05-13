import React, { useState, useEffect } from 'react';
import './modal.css';
import { departments } from '../../../../utils';
import axios from 'axios';

const AssignStudentsModal = ({ isOpen, onClose, mentor }) => {

  const [expandedDepartment, setExpandedDepartment] = useState(null);
  const [students, setStudents] = useState([]);
  const [selectedStudents, setSelectedStudents] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const handleDepartmentClick = async (departmentId) => {
    if(departmentId === "" || departmentId === null || departmentId === undefined){
      setExpandedDepartment(null);
      return;
    }
    setExpandedDepartment(departmentId);
    try {
        const response = await axios.get(`http://localhost:9000/get/all/students/${departments[departmentId-1].name}`, {
          headers: {
            'x-auth-token': `${localStorage.getItem('adminToken')}`
          }
        })
        
        if(response.status === 200){
          setStudents(response.data.students);
        }
    
    } catch (error) {
      alert(error?.response?.data?.message ?? "Error fetching students");
      console.error('Error fetching students:', error);
    }
  };
  
  const handleAddStudent = (student) => {
    console.log({student})
    console.log({selectedStudents})
    if (!selectedStudents.some(s => s.rollNumber === student.rollNumber)) {
      setSelectedStudents([...selectedStudents, student]);
    }
  };
  
  const handleRemoveStudent = (studentId) => {
    console.log({studentId})
    setSelectedStudents(selectedStudents.filter(student => student.rollNumber !== studentId));
  };
  
  const handleAssignStudents = async () => {
    try {
        setLoading(true);
      const response = await axios.post(`http://localhost:9000/add/student/to/mentor/${mentor._id}`, {
        students: selectedStudents.map(student => student.rollNumber)
      }, {
        headers: {
          'x-auth-token': `${localStorage.getItem('adminToken')}`
        }
      })

      if(response.data.error === "jwt must be provided") {
        alert("Please login to continue");
        navigate('/admin');
      }
      
      if(response.status === 200){
        setLoading(false);
        alert("Students assigned successfully");
        onClose();
      }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Error assigning students");
      console.error('Error assigning students:', error);
    } finally {
      setLoading(false);
    }
  };
  
  if (!isOpen) return null;
  
  return (
    <div className="mentor-modal">
      <div className="mentor-modal-content">
        <div className="mentor-modal-header">
          <h2 className="mentor-modal-title">Assign Students to Mentor</h2>
          <button className="close-button" onClick={onClose}>&times;</button>
        </div>
        
        <div className="department-list">
          <h3 className='department-list-title'>Select Department</h3>
          <div className="custom-dropdown-container">
            <select 
              className="custom-dropdown"
              onChange={(e) => handleDepartmentClick(e.target.value)}
            >
              <option value="">Select Department</option>
              {departments.map(department => (
                <option key={department.id} value={department.id}>
                  {department.name}
                </option>
              ))}
            </select>
            <div className="dropdown-arrow">▼</div>
          </div>
        </div>
        
        {expandedDepartment && (
          <div className="student-list">
            <h3>Students</h3>
            {students.map(student => (
              <div key={student.id} className="student-item">
                <span>{student.name}</span>
                {student?.mentorAssigned && student.mentorAssigned.length > 0 && student.mentorAssigned.includes(mentor?._id) ? <span className='assigned-student'>Assigned</span> : 
                <button 
                  className="add-student-btn"
                  onClick={() => handleAddStudent(student)}
                >
                  Add
                </button>
                }
              </div>
            ))}
          </div>
        )}
        
        {selectedStudents.length > 0 && (
          <div className="selected-students">
            <h3>Selected Students</h3>
            {selectedStudents.map(student => (
              <div key={student.id} className="selected-student-item">
                <span>{student.name}</span>
                <button 
                  className="remove-student-btn"
                  onClick={() => handleRemoveStudent(student.rollNumber)}
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
        
        <button 
          className="assign-students-btn"
          onClick={handleAssignStudents}
          disabled={selectedStudents.length === 0}
        >
          Assign Students
        </button>
      </div>
    </div>
  );
};

export default AssignStudentsModal;