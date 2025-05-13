import React, { useEffect, useState } from 'react';
import './LowMeeting.css';
import axios from 'axios';

export const LowMeeting = ({ count, students, totalAssignedStudents }) => {
  const [showModal, setShowModal] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [availabilityLoading, setAvailabilityLoading] = useState(true);
  const [availability, setAvailability] = useState(null);
  const [error, setError] = useState(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [description, setDescription] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  const handleBookMeeting = (student) => {
    console.log(student,"xxxxccc");
    setSelectedStudent(student);
    setShowModal(true);
  };


  useEffect(() => {
    if(showModal) {
      getMentorAvailability()
    }
  }, [showModal]);

  async function getMentorAvailability() {
    try {
      const token = localStorage.getItem('mentorToken');
      const mentorId = localStorage.getItem('mentorId');
      const response = await axios.get(`http://localhost:9000/mentor/get-mentor-availability/${mentorId}`, {
        headers: { 'x-auth-token': `${token}` }
      });
      setAvailabilityLoading(false);
      console.log(response?.data?.availability,"xxxxccc");

      if(response.data.error === "jwt must be provided") {
        alert("Please login again");
        localStorage.removeItem('mentorToken');
        localStorage.removeItem('mentorId');
        navigate('/mentorlogin');
        return;
      }

      if(response.status === 200 && (response.data?.availability?.days?.length === 0 || response.data?.availability?.timeSlots?.length === 0)) {
        setError("Please set your availability first.");
        return;
      }

      if(response.status === 200) {
        setAvailability(response?.data?.availability);
      }

    } catch (error) {
      setAvailabilityLoading(false);
      alert(error?.data?.error ?? error?.response?.data?.message ?? "Unable to fetch mentor availability");
      console.log(error);
    }
  }

  const confirmBooking = async (e) => {
      try {

          e.preventDefault();

          if (!selectedStudent?.studentId || !description || !selectedDate || !selectedTime) {
              alert('Please fill all the fields');
              return;
          }

          const token = localStorage.getItem('mentorToken');
          const mentorId = localStorage.getItem('mentorId');
          const studentId = selectedStudent?.studentId;
          
          setBookingLoading(true);
          const response = await axios.post(`http://localhost:9000/mentor/book-session/${mentorId}`, {
              studentId,
              description,
              date: selectedDate,
              time: selectedTime
          }, {
              headers: {
                  'x-auth-token': `${token}`
              }
          });
      
          if(response.data.error === "jwt must be provided") {
              setBookingLoading(false);
              alert("Please login again");
              localStorage.removeItem('mentorToken');
              localStorage.removeItem('mentorId');
              navigate('/mentorlogin');
              return;
          }

          if(response.status === 200) {
              setTimeout(() => {
              setBookingLoading(false);
              }, 1000);
              alert('Booking created successfully!');
              setSelectedStudent('');
              setSelectedDate('');
              setSelectedTime('');
              setDescription('');
              return;
          }

          alert(error?.response?.data?.message ?? "Error submitting booking request");

      } catch (error) {
          console.log(error);
          alert(error?.data?.error ?? error?.response?.data?.message ?? "Error submitting booking request");
      }
  };

  const handleDateClick = (date) => {
    // If the date is already selected, deselect it
    if (selectedDate === date) {
        setSelectedDate('');
    } else {
        setSelectedDate(date);
    }
};

const handleTimeClick = (time) => {
    // If the time is already selected, deselect it
    if (selectedTime === time) {
        setSelectedTime('');
    } else {
        setSelectedTime(time);
    }
};

  const closeModal = () => {
    setShowModal(false);
    setSelectedStudent(null);
  };

  const lowMeetingCount = count;
  
  const meetingThreshold = 2; // Minimum required meetings
  
  const lowMeetingPercentage = totalAssignedStudents > 0 
    ? Math.round((lowMeetingCount / totalAssignedStudents) * 100) 
    : 0;

  return (
    <div className="low-meeting-card">
      <div className="card-header">
        <div className="card-title">
          <span className="warning-icon">⚠️</span>
          <h4>Meeting Alert</h4>
        </div>
      </div>
      
      <div className="card-content">
        <div className="meeting-stats">
          <div className="stat-item">
            <div className="badge-container">
              <div className="stat-icon low-meeting-icon">
                <span>👤</span>
              </div>
              <span className="badge">{lowMeetingCount}</span>
            </div>
            <div className="stat-text">
              <span className="text-secondary">Students with</span>
              <span className="text-strong">Insufficient Meetings</span>
            </div>
          </div>
          
          <div className="stat-divider"></div>
          
          <div className="stat-item">
            <div className="badge-container">
              <div className="stat-icon total-students-icon">
                <span>👥</span>
              </div>
              <span className="badge">{totalAssignedStudents}</span>
            </div>
            <div className="stat-text">
              <span className="text-secondary">Total</span>
              <span className="text-strong">Assigned Students</span>
            </div>
          </div>
        </div>

        <div className="meeting-progress">
          <div className="progress-header">
            <span>Low Meeting Rate</span>
            <span className="text-strong">{lowMeetingPercentage}%</span>
          </div>
          <div className="new-progress-container">
            <div className="new-progress-background">
              <div 
                className={`new-progress-fill ${
                  lowMeetingPercentage > 30 ? "new-progress-danger" : 
                  lowMeetingPercentage > 15 ? "new-progress-warning" : "new-progress-normal"
                }`}
                style={{ width: `${Math.max(lowMeetingPercentage, 3)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {students?.length > 0 && (
          <div className="student-list">
            <h5>Students Meetings</h5>
            <div className="student-cards">
              {students?.slice(0, 5).map((student, index) => (
                <div key={index} className="student-card">
                  <div className="student-info">
                    <span className="text-strong">{student?.name} <span className="text-secondary">roll no: {student?.rollNumber}</span></span>
                    <div className="meeting-indicator">
                      <span 
                        className={`meeting-value ${
                          student?.completedMeetings < 1 ? 'critical' : 
                          student?.completedMeetings < meetingThreshold ? 'warning' : ''
                        }`}
                      >
                        {student?.completedMeetings}/{meetingThreshold} meetings
                      </span>
                    </div>
                  </div>
                  <button 
                    className="mentor-book-meeting-btn" 
                    onClick={() => handleBookMeeting(student)}
                  >
                    Book Meeting
                  </button>
                </div>
              ))}
              {students?.length > 5 && (
                <span className="more-students">
                  +{students?.length - 5} more students
                </span>
              )}
            </div>
          </div>
        )}
      </div>

      {/* Confirmation Modal */}
      {showModal && (
        <div className="mentor-modal-overlay">
          <div className="mentor-confirmation-modal">
            {availabilityLoading ? <div className="mentor-loading-container">
              <div className="mentor-loading-spinner"></div>
              <div className="mentor-loading-text">Loading...</div>
            </div> : 
            <>
              <p style={{fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 'bold'}}>Are you sure you want to book a meeting with {selectedStudent?.name}?</p>
              {error && <p className="mentor-error-message">{error}</p>}
              <div className="newbooking-booking-schedule">
                <div className="newbooking-form-group">
                    <label>Select a Date</label>
                    <div className="newbooking-date-grid">
                        {availability?.days && availability?.days?.length ? availability?.days.map((date) => (
                            <div 
                                key={date} 
                                className={`newbooking-date-item ${selectedDate === date ? 'selected' : ''}`}
                                onClick={() => handleDateClick(date)}
                            >
                                {date}
                            </div>
                        )) : <p style={{whiteSpace: 'nowrap', color: 'gray'}} >No dates available</p>}
                    </div>
                </div>
                
                <div className="newbooking-form-group">
                    <label>Select a Time Slot</label>
                    <div className="newbooking-time-grid">
                        {availability?.timeSlots && availability?.timeSlots?.length ? availability?.timeSlots.map((time) => (
                            <div 
                                key={time} 
                                className={`newbooking-time-item ${selectedTime === time ? 'selected' : ''}`}
                                onClick={() => handleTimeClick(time)}
                            >
                                {time}
                            </div>
                        )) : <p style={{whiteSpace: 'nowrap', color: 'gray'}}>No time slots available</p>}
                    </div>
                </div>
            </div>
            <div className="mentor-form-group">
              <label>Description</label>
              <textarea className="mentor-textarea" value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
            </div>
              <div className="mentor-modal-actions">
                <button style={{opacity: availabilityLoading || error ? 0.5 : 1, pointerEvents: availabilityLoading || error ? 'none' : 'pointer'}} disabled={availabilityLoading || error} className="mentor-cancel-btn" onClick={closeModal}>Cancel</button>
                <button style={{opacity: availabilityLoading || error ? 0.5 : 1, pointerEvents: availabilityLoading || error || bookingLoading ? 'none' : 'pointer'}} disabled={availabilityLoading || error || bookingLoading} className="mentor-confirm-btn" onClick={confirmBooking}>{bookingLoading ? "Booking..." : "Confirm"}</button>
              </div>
            </>}
          </div>
        </div>
      )}
    </div>
  );
};