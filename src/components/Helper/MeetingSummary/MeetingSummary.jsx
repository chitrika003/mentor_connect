import React from 'react'
import './MeetingSummary.css'

export const MeetingSummary = ({totalMeetings, currentMonthMeetings}) => {
  return (
    <div className="meeting-summary-dashboard-card">
        <div className="meeting-summary-card-header">
            <h3 className='meeting-summary-card-title'>Meeting Summary</h3>
        </div>
        <div className="meeting-summary-card-content">
            <div className="meeting-summary-stats-grid">
                <div className="meeting-summary-stat-item">
                    <div className="meeting-summary-stat-icon meeting-summary-stat-icon-total">
                        <i className="fas fa-users"></i>
                    </div>
                    <div className="meeting-summary-stat-info">
                        <span className="meeting-summary-stat-label">Total Meetings</span>
                        <span className="meeting-summary-stat-value">{totalMeetings || 0}</span>
                    </div>
                </div>
                
                <div className="meeting-summary-stat-item">
                    <div className="meeting-summary-stat-icon meeting-summary-stat-icon-month">
                        <i className="fas fa-calendar-check"></i>
                    </div>
                    <div className="meeting-summary-stat-info">
                        <span className="meeting-summary-stat-label">This Month</span>
                        <span className="meeting-summary-stat-value">{currentMonthMeetings || 0}</span>
                    </div>
                </div>
            </div>
        </div>
  </div>
  )
}
