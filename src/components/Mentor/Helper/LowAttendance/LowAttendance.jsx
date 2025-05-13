import React from 'react';
import './LowAttendance.css';

export const LowAttendance = ({ count, students, totalAssignedStudents }) => {

  const lowAttendanceCount = count;

  const attendanceThreshold = 75;
  
  const lowAttendancePercentage = totalAssignedStudents > 0 
    ? Math.round((lowAttendanceCount / totalAssignedStudents) * 100) 
    : 0;

  return (
    <div className="low-attendance-card">
      <div className="card-header">
        <div className="card-title">
          <span className="warning-icon">⚠️</span>
          <h4>Attendance Alert</h4>
        </div>
      </div>
      
      <div className="card-content">
        <div className="attendance-stats">
          <div className="stat-item">
            <div className="badge-container">
              <div className="stat-icon low-attendance-icon">
                <span>👤</span>
              </div>
              <span className="badge">{lowAttendanceCount}</span>
            </div>
            <div className="stat-text">
              <span className="text-secondary">Students with</span>
              <span className="text-strong">Low Attendance</span>
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

        <div className="attendance-progress">
          <div className="progress-header">
            <span>Low Attendance Rate</span>
            <span className="text-strong">{lowAttendancePercentage}%</span>
          </div>
          <div className="new-progress-container">
            <div className="new-progress-background">
              <div 
                className={`new-progress-fill ${
                  lowAttendancePercentage > 30 ? "new-progress-danger" : 
                  lowAttendancePercentage > 15 ? "new-progress-warning" : "new-progress-normal"
                }`}
                style={{ width: `${Math.max(lowAttendancePercentage, 3)}%` }}
              ></div>
            </div>
          </div>
        </div>

        {students?.length > 0 && (
          <div className="student-list">
            <h5>Students Requiring Attention</h5>
            <div className="student-cards">
              {students?.slice(0, 5).map((student, index) => (
                <div key={index} className="student-card">
                  <div className="student-info">
                    <span className="text-strong">{student?.name} <span className="text-secondary">roll no: {student?.rollNumber}</span></span>
                    <div className="attendance-indicator">
                      <span 
                        className={`attendance-value ${
                          student?.attendancePercentage < 50 ? 'critical' : 
                          student?.attendancePercentage < attendanceThreshold ? 'warning' : ''
                        }`}
                      >
                        {Math.round(student?.averageAttendance*10)/10}%
                      </span>
                    </div>
                  </div>
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
    </div>
  );
};
