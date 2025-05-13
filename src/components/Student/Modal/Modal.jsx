import React from 'react';
import { FaCalendarAlt, FaClock, FaUserAlt, FaEnvelope, FaPhone, FaBuilding, FaTimes, FaFileAlt, FaEdit, FaVideo } from 'react-icons/fa';
import './Modal.css';

function BookingDetailsModal({ booking, onClose }) {
  if (!booking) return null;

  return (
    <div className="booking-modal-overlay">
      <div className="booking-modal-container">
        <div className="booking-modal-header">
            <div className="booking-modal-header-left">
                <h2>Booking Details</h2>
                <div className={`status-badge ${booking?.sessionStatus.toLowerCase()}`}>
                  {booking?.sessionStatus}
                </div>
            </div>
          <button className="close-modal-btn" onClick={onClose}>
            <FaTimes />
          </button>
        </div>
        
        <div className="booking-modal-content">
          {/* Mentor Information */}
          <div className="booking-modal-section">
            <h3 className="section-title">Mentor Information</h3>
            <div className="mentor-profile">
              <div className="mentor-avatar">
                {booking?.mentorName.charAt(0)}
              </div>
              <div className="mentor-details">
                <div className="mentor-info-item">
                  <FaUserAlt className="mentor-info-icon" />
                  <p>{booking?.mentorName}</p>
                </div>
                <div className="mentor-info-item">
                  <FaEnvelope className="mentor-info-icon" />
                  <p>{booking?.mentorEmail || `--`}</p>
                </div>
                <div className="mentor-info-item">
                  <FaPhone className="mentor-info-icon" />
                  <p>{booking?.mentorPhone || "--"}</p>
                </div>
                <div className="mentor-info-item">
                  <FaBuilding className="mentor-info-icon" />
                  <p>{booking?.mentorDepartment || "--"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Session Information */}
          <div className="booking-modal-section">
            <h3 className="section-title">Session Information</h3>
            <div className="booking-info-compact">
              <div className="info-item">
                <FaCalendarAlt className="info-icon" />
                <div>
                  <p className="info-label">Booking Date</p>
                  <p className="info-value">{booking?.bookingDate}</p>
                </div>
              </div>
              {/* <div className="info-item">
                <FaClock className="info-icon" />
                <div>
                  <p className="info-label">Time</p>
                  <p className="info-value">{booking.time}</p>
                </div>
              </div> */}
              <div className="info-item">
                <FaEdit className="info-icon" />
                <div>
                  <p className="info-label">Last Updated</p>
                  <p className="info-value">{booking?.lastUpdatedDate || "--"}</p>
                </div>
              </div>
            </div>
          </div>
          
          {/* Doubt Description */}
          <div className="booking-modal-section">
            <h3 className="section-title">Doubt Description</h3>
            <div className="scrollable-content">
              <p>{booking?.doubts || "--"}</p>
            </div>
          </div>

          {/* Meeting Notes */}
          <div className="booking-modal-section">
            <h3 className="section-title">Meeting Notes</h3>
            <div className="scrollable-content">
              <p>{booking?.sessionNotes || "--"}</p>
            </div>
          </div>
        </div>

        <div className="booking-modal-footer">
          {booking?.sessionStatus.toLowerCase() === 'confirmed' && (
            <button className="join-session-btn">
              <FaVideo /> Join Session
            </button>
          )}
          <button className="close-btn" onClick={onClose}>Close</button>
        </div>
      </div>
    </div>
  );
}

export default BookingDetailsModal;