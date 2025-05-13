import React, { useState } from 'react'
import './addStudent.css'
import { departments } from '../../../../utils'
import axios from 'axios'

const AddStudent = () => {
    const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState({
    name: '',
    rollNumber: '',
    photo: '',
    dateOfBirth: '',
    email: '',
    phone: '',
    department: '',
    availedLeaves: 0,
    meetings: [],
    cgpa: 0,
    address: '',
    fatherName: '',
    fatherPhone: '',
    motherName: '',
    motherPhone: '',
  })

// meetings {
// id: 1, //this is month number 1 is for january, 2 is for february and so on
// count: 4 //this is the number of meetings the student has attended in that month
// }

  const handleChange = (e) => {
    const { name, value } = e.target
    setStudentData({
      ...studentData,
      [name]: value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if(studentData.name === '' || studentData.rollNumber === '' || studentData.dateOfBirth === '' || 
      studentData.email === '' || studentData.phone === '' || studentData.department === '' || studentData.photo === '') {
      alert('All fields are required');
      return;
    }

    if(parseInt(studentData?.availedLeaves) < 0) {
      alert('Availed Leaves cannot be negative');
      return;
    }

    if(parseInt(studentData?.availedLeaves) === 0) {
      alert('Availed Leaves cannot be 0');
      return;
    }
    
    try {
        setLoading(true);
        const response = await axios.post('http://localhost:9000/add/student', studentData, {
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
        setLoading(false);
        if(response.status === 200) {
            alert('Student added successfully');
            setStudentData({
                name: '',
                rollNumber: '',
                dateOfBirth: '',
                email: '',
                phone: '',
                department: '',
                availedLeaves: 0,
                meetings: []
            })
        }
    } catch (error) {
        alert(error?.response?.data?.message ?? "Something went wrong");
        console.log(error);
        setLoading(false);
    }
  }

  return (
    <div className="add-student-wrapper">
      <h2 className="student-form-title">Add New Student</h2>
      
      <form onSubmit={handleSubmit} className="student-form">
        <div className="student-form-group">
          <label htmlFor="name">Full Name</label>
          <input 
            type="text" 
            id="name"
            name="name" 
            value={studentData.name} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="rollNumber">Roll Number</label>
          <input 
            type="text" 
            id="rollNumber"
            name="rollNumber" 
            value={studentData.rollNumber} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="photo">Photo</label>
          <input 
            type="text" 
            id="photo"
            name="photo" 
            value={studentData.photo} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="dateOfBirth">Date of Birth</label>
          <input 
            type="date" 
            id="dateOfBirth"
            name="dateOfBirth" 
            value={studentData.dateOfBirth} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="email">Email</label>
          <input 
            type="email" 
            id="email"
            name="email" 
            value={studentData.email} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="phone">Student Ph.Number</label>
          <input 
            type="tel" 
            id="phone"
            name="phone" 
            value={studentData.phone} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="fatherName">Father's Name</label>
          <input 
            type="text" 
            id="fatherName"
            name="fatherName" 
            value={studentData.fatherName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="fatherPhone">Father's Ph.Number</label>
          <input 
            type="tel" 
            id="fatherPhone"
            name="fatherPhone" 
            value={studentData.fatherPhone} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="motherName">Mother's Name</label>
          <input 
            type="text" 
            id="motherName"
            name="motherName" 
            value={studentData.motherName} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="motherPhone">Mother's Ph.Number</label>
          <input 
            type="tel" 
            id="motherPhone"
            name="motherPhone" 
            value={studentData.motherPhone} 
            onChange={handleChange} 
            required 
          />
        </div>
        
        <div className="student-form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={studentData.department}
            onChange={handleChange}
            required
          >
            <option value="">Select Department</option>
            {departments.map((dept, index) => (
              <option key={index} value={dept.name}>
                {dept.name}
              </option>
            ))}
          </select>
        </div>

        <div className="student-form-group">
          <label htmlFor="availedLeaves">Availed Leaves</label>
          <input 
            type="number" 
            id="availedLeaves"
            name="availedLeaves" 
            value={studentData.availedLeaves} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="cgpa">CGPA</label>
          <input 
            type="number" 
            id="cgpa"
            name="cgpa" 
            value={studentData.cgpa} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-group">
          <label htmlFor="address">Address</label>
          <input 
            type="text" 
            id="address"
            name="address" 
            value={studentData.address} 
            onChange={handleChange} 
            required 
          />
        </div>

        <div className="student-form-actions">
          <button type="submit" className="student-submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Student'}
          </button>
        </div>
      </form>
    </div>
  )
}

export default AddStudent