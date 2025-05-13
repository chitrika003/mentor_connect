import React, { useEffect, useState } from 'react';
import './studentdashboard.css';
import NameInitials from '../../Helper/helper';
import axios from 'axios';
import { calculateCurrentMonthLeaves, calculateMonthlyAttendancePercentage, calculateOverallAttendancePercentage, calculatePendingLeaves } from '../../../../utils';
import { useNavigate } from 'react-router-dom';
import { MeetingSummary } from '../../Helper/MeetingSummary/MeetingSummary';
import { MeetingHistory } from '../../Mentor/Helper/MeetingHistory/MeetingHistory';
import { Loading } from '../../Helper/Loading/Loading';

export const StudentDashboard = () => {

  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [studentData, setStudentData] = useState(null);
  const [mentors, setMentors] = useState(null);


  useEffect(() => {
    const studentId = localStorage.getItem('studentId');
    if(!studentId) {
      alert('Please login to continue');
      navigate('/studentlogin');
    }

    const fetchStudentData = async () => {
      try {
        setLoading(true);
        const response = await axios.get(`http://localhost:9000/student/${studentId}`, {
          headers: {
            "x-auth-token": localStorage.getItem('studentToken')
          }
        });
        if(response.data.error === "jwt must be provided") {
          setLoading(false);
          alert("Please login again");
          localStorage.removeItem('studentToken');
          localStorage.removeItem('studentId');
          navigate('/studentlogin');
          return;
        }
        if(response.status === 200) {
          setLoading(false);
          setStudentData(response.data);
          setMentors(response.data.mentorDetails);
        }
      } catch (error) {
        setLoading(false);
        alert(error?.response?.data?.message ?? "Error fetching student data");
        console.error('Error fetching student data:', error);
      }
    };
    fetchStudentData();
  }, []);

  if(loading) {
    return <Loading />
  }

  return (
    <div className="dashboard-container">

      <div className="dashboard-content">
        {/* Left Column */}
        <div className="dashboard-column main-column">

          {/* Header with student basic info */}
          <div className="profile-card">
            <div className="profile-header">
              <div className="profile-image">
                <NameInitials profileImage={studentData?.student?.photo || ''} name={studentData?.student?.name || '--'} />
              </div>
              <div className="profile-info">
                <h2 className="student-name">{studentData?.student?.name || '--'}</h2>
                <p className="student-department">{studentData?.student?.department || '--'}</p>
                <div className="profile-details">
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-id-card"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Roll Number</span>
                      <span className="detail-value">{studentData?.student?.rollNumber || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-birthday-cake"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Date of Birth</span>
                      <span className="detail-value">{studentData?.student?.dateOfBirth || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-envelope"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Email</span>
                      <span className="detail-value">{studentData?.student?.email || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-phone"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Phone</span>
                      <span className="detail-value">{studentData?.student?.phone || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-graduation-cap"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Father's Name</span>
                      <span className="detail-value">{studentData?.student?.fatherName || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-graduation-cap"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Father's Phone</span>
                      <span className="detail-value">{studentData?.student?.fatherPhone || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-graduation-cap"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Mother's Name</span>
                      <span className="detail-value">{studentData?.student?.motherName || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-graduation-cap"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Mother's Phone</span>
                      <span className="detail-value">{studentData?.student?.motherPhone || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-graduation-cap"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">CGPA</span>
                      <span className="detail-value">{studentData?.student?.cgpa || '--'}</span>
                    </div>
                  </div>
                  <div className="detail-item">
                    <span className="detail-icon"><i className="fas fa-graduation-cap"></i></span>
                    <div className="detail-content">
                      <span className="detail-label">Address</span>
                      <span className="detail-value">{studentData?.student?.address || '--'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3 className='card-title'>Attendance Overview</h3>
            </div>
            <div className="card-content">
              <div className="attendance-grid">
                <div className="student-dashboard-attendance-item">
                  <h4 className='student-dashboard-attendance-item-title'>Overall Attendance</h4>
                  <div className="student-dashboard-progress-container">
                    <div className="student-dashboard-progress-bar">
                      <div 
                        className="student-dashboard-progress-fill" 
                        style={{ width: `${calculateOverallAttendancePercentage(studentData?.student?.attendance) ?? 0}%` }}
                      ></div>
                    </div>
                    <span className="student-dashboard-progress-text">{calculateOverallAttendancePercentage(studentData?.student?.attendance) ?? 0}%</span>
                  </div>
                </div>
                
                <div className="student-dashboard-attendance-item">
                  <h4 className='student-dashboard-attendance-item-title'>Monthly Attendance</h4>
                  <div className="student-dashboard-progress-container">
                    <div className="student-dashboard-progress-bar">
                      <div 
                        className="student-dashboard-progress-fill" 
                        style={{ width: `${calculateMonthlyAttendancePercentage(studentData?.student?.attendance) ?? 0}%` }}
                      ></div>
                    </div>
                    <span className="student-dashboard-progress-text">{calculateMonthlyAttendancePercentage(studentData?.student?.attendance) ?? 0}%</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Meeting Summary */}
          <MeetingSummary totalMeetings={studentData?.bookingStats?.totalBookings} currentMonthMeetings={studentData?.bookingStats?.currentMonthBookings} />

          {/* Meeting History */}
          <MeetingHistory bookings={studentData?.bookingStats?.statusCounts} />

          {/* Leave Summary - Moved from right column to left column */}
          <div className="dashboard-card">
            <div className="card-header">
              <h3>Leave Summary</h3>
            </div>
            <div className="card-content">
              <div className="leave-stats">
                <div className="leave-stat-item">
                  <div className="stat-icon leave-total-icon">
                    <i className="fas fa-calendar-alt"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Total Leaves</span>
                    <span className="stat-value">{studentData?.student?.availedLeaves || 0}</span>
                  </div>
                </div>
                
                <div className="divider"></div>
                
                <div className="leave-stat-item">
                  <div className="stat-icon leave-month-icon">
                    <i className="fas fa-calendar-times"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Current Month Leaves</span>
                    <span className="stat-value">{calculateCurrentMonthLeaves(studentData?.student?.attendance) || 0}</span>
                  </div>
                </div>
                
                <div className="divider"></div>
                
                <div className="leave-stat-item">
                  <div className="stat-icon leave-pending-icon">
                    <i className="fas fa-hourglass-half"></i>
                  </div>
                  <div className="stat-info">
                    <span className="stat-label">Pending Leaves</span>
                    <span className="stat-value">{calculatePendingLeaves(studentData?.student?.attendance, studentData?.student?.availedLeaves) || 0}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right Column */}
        <div className="dashboard-column side-column">
          <div className="student-dashboard-mentors-card dashboard-card">
            <div className="student-dashboard-card-header card-header">
              <h3>My Mentors</h3>
            </div>
            <div className="student-dashboard-card-content card-content">
              <div className="student-dashboard-mentors-container">
                {mentors && mentors.length > 0 ? (
                  mentors.map((mentor, index) => (
                    <div key={index} className="student-dashboard-mentor-profile">
                      <div className="student-dashboard-mentor-header">
                        <div className="student-dashboard-mentor-image">
                          {mentor.photo ? (
                            <img src={mentor.photo} alt={mentor.name} />
                          ) : (
                            <NameInitials name={mentor.name || 'Mentor'} />
                          )}
                        </div>
                        <div className="student-dashboard-mentor-basic-info">
                          <h4>{mentor.name || 'Mentor Name'}</h4>
                          <div className="student-dashboard-mentor-department">{mentor.department || 'Department'}</div>
                        </div>
                      </div>
                      <div className="student-dashboard-mentor-details">
                        <div className="student-dashboard-mentor-detail-row">
                          <div className="student-dashboard-mentor-detail-item">
                            <i className="fas fa-briefcase"></i>
                            <span>Experience: {mentor.experience || 0} years</span>
                          </div>
                          <div className="student-dashboard-mentor-detail-item">
                            <i className="fas fa-graduation-cap"></i>
                            <span>Specialization: {mentor.specialization || 'N/A'}</span>
                          </div>
                        </div>
                        <div className="student-dashboard-mentor-detail-row">
                          <div className="student-dashboard-mentor-detail-item">
                            <i className="fas fa-envelope"></i>
                            <span>{mentor.email || 'email@example.com'}</span>
                          </div>
                          <div className="student-dashboard-mentor-detail-item">
                            <i className="fas fa-phone"></i>
                            <span>{mentor.phone || 'N/A'}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                ) : (
                  <div className="student-dashboard-no-mentors-message">
                    <i className="fas fa-user-slash"></i>
                    <p>No mentors assigned yet</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

    </div>
  );
};
