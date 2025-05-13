import React, { useState } from 'react';
import './addMentor.css';
import { departments } from '../../../../utils';
import axios from 'axios';

export const AddMentor = () => {
    const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    photo: '',
    experience: '',
    specialization: '',
    email: '',
    phone: '',
    department: '',
    ratings: 0,
    studentsAssigned: [],
    availability: { days: [], timeSlots: [] }
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if(formData.name === '' || formData.photo === '' || formData.experience === '' || formData.specialization === '' || formData.email === '' || formData.phone === '' || formData.department === '') {
        alert('All fields are required');
        return;
    }
    try {
        setLoading(true);
        const response = await axios.post('http://localhost:9000/add/mentor', formData, {
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
            alert('Mentor added successfully');
            setFormData({
              name: '',
              photo: '',
              experience: '',
              specialization: '',
              email: '',
              phone: '',
              department: '',
              ratings: 0,
              studentsAssigned: []
            });
        }
    } catch (error) {
        alert(error?.response?.data?.message ?? "Something went wrong");
        console.log(error)
        setLoading(false);
    }
  };

  return (
    <div className="add-mentor-container">
      <h2 className="form-title">Add New Mentor</h2>
      
      <form onSubmit={handleSubmit} className="mentor-form">
        <div className="form-group">
          <label htmlFor="name">Full Name</label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="photo">Photo URL</label>
          <input
            type="text"
            id="photo"
            name="photo"
            value={formData.photo}
            onChange={handleChange}
            placeholder="Enter image URL"
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="experience">Experience (years)</label>
          <input
            type="number"
            id="experience"
            name="experience"
            value={formData.experience}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="specialization">Specialization</label>
          <input
            type="text"
            id="specialization"
            name="specialization"
            value={formData.specialization}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="phone">Phone Number</label>
          <input
            type="tel"
            id="phone"
            name="phone"
            value={formData.phone}
            onChange={handleChange}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="department">Department</label>
          <select
            id="department"
            name="department"
            value={formData.department}
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

        <div className="form-group">
          <label htmlFor="ratings">Initial Rating</label>
          <input
            type="number"
            id="ratings"
            name="ratings"
            min="0"
            max="5"
            step="0.1"
            value={formData.ratings}
            onChange={handleChange}
          />
        </div>

        <div className="mentor-form-actions">
          <button type="submit" className="mentor-submit-btn" disabled={loading}>
            {loading ? 'Adding...' : 'Add Mentor'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AddMentor;