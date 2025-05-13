import React from 'react';
import './MeetingHistory.css';

export const MeetingHistory = ({bookings}) => {
  console.log(bookings);
  return ( 
    <div className="meetings-history">
        <div className="meeting-history-card-header">
            <h2 className="meeting-history-title">Meetings History</h2>
        </div>
        <div className="meeting-history-stats">
            <div className="stat-card completed">
            <h3>Completed</h3>
            <p className="stat-number">{bookings?.completed ?? '--'}</p>
            </div>
            <div className="stat-card confirmed">
            <h3>Confirmed</h3>
            <p className="stat-number">{bookings?.confirmed ?? '--'}</p>
            </div>
            <div className="stat-card rejected">
            <h3>Rejected</h3>
            <p className="stat-number">{bookings?.rejected ?? '--'}</p>
            </div>
            <div className="stat-card pending">
            <h3>Pending</h3>
            <p className="stat-number">{bookings?.pending ?? '--'}</p>
            </div>
        </div>
    </div>
  )
}
