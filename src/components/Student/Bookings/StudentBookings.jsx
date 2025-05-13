import { useNavigate } from 'react-router-dom'
import { useEffect, useState } from 'react'
import './StudentBookings.css'
import { FaVideo, FaCalendarAlt, FaClock, FaUserAlt, FaSearch, FaFilter } from 'react-icons/fa'
import BookingDetailsModal from '../Modal/Modal'
import axios from 'axios'
import { Loading } from '../../Helper/Loading/Loading'
import { convertUTCDateShortFormat } from '../../../../utils'

function StudentBookings() {

  const navigate = useNavigate();
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  const studentId = localStorage.getItem('studentId');
  const token = localStorage.getItem('studentToken');

  useEffect(() => {
    fetchBookings()
  }, [])

  async function fetchBookings() {
    try {

      setLoading(true)
      const response = await axios.get(`http://localhost:9000/app/student/mybookings/${studentId}`,{
        headers: {
          'x-auth-token': token
        }
      });

      setLoading(false)

      if(response.data.error === "jwt must be provided") {
        setLoading(false);
        alert("Please login again");
        localStorage.removeItem('studentToken');
        localStorage.removeItem('studentId');
        navigate('/studentlogin');
        return;
      }
      if (response.status === 200) {
        setBookings(response.data.bookings)
      }

    } catch (error) {
      alert(error?.response?.data?.message ?? "Error fetching bookings")
      setLoading(false)
      console.error('Error fetching bookings:', error)
    }
  }

  const [activeFilter, setActiveFilter] = useState('all')
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedBooking, setSelectedBooking] = useState(null)

  const filteredBookings = bookings
    .filter(booking => activeFilter === 'all' || booking?.sessionStatus.toLowerCase() === activeFilter)
    .filter(booking => booking?.mentorName.toLowerCase().includes(searchQuery.toLowerCase()))

  const openBookingDetails = (booking) => {
    setSelectedBooking(booking)
  }

  const closeBookingDetails = () => {
    setSelectedBooking(null)
  }

  const handleJoinSession = (booking) => {
    if(booking?.sessionLink) {
      navigate(`/videocall/${booking.sessionLink}`);
    } else {
      alert("Session link not found");
    }
  };

  if(loading) {
    return <Loading />
  }

  return (
    <div className="student-bookings-container">     
        <div className="bookings-header">
          <h2 className="bookings-title">My Mentoring Sessions</h2>
          <div className="header-actions">
            <div className="search-container">
              <input 
                type="text" 
                placeholder="Search mentor..." 
                className="search-input"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
              <FaSearch className="search-icon" />
            </div>
          </div>
        </div>

        
        <div className="status-pills">
          {['all', 'pending', 'confirmed', 'completed', 'rejected'].map(filter => (
            <button 
              key={filter}
              className={`status-pill ${activeFilter === filter ? 'active' : ''}`}
              onClick={() => setActiveFilter(filter)}
            >
              <div className={`pill-dot ${filter}`}></div>
              {filter.charAt(0).toUpperCase() + filter.slice(1)}
            </button>
          ))}
        </div>

        <div className="bookings-section">
          {filteredBookings.length > 0 ? (
            <div className="bookings-grid">
              {filteredBookings.map(booking => (
                <div key={booking.bookingId} className="student-booking-card">
                    <div className="student-mentor-info">
                      <div className="student-mentor-avatar">
                        {booking.mentorName.charAt(0)}
                      </div>
                      <h3 className="student-mentor-name">{booking.mentorName}</h3>
                    </div>
                    
                    <div className="session-details">
                      <div className="detail-row">
                        <span className="detail-text">Booking Date: {convertUTCDateShortFormat(booking.bookingDate) || "--"}</span>
                      </div>
                      <div className="detail-row">
                        <span className="detail-text">Last update: {convertUTCDateShortFormat(booking.lastUpdatedDate) || "--"}</span>
                      </div>

                    </div>
                    
                    <div className="card-status-banner-container">  
                      <div className="join-btn-container">
                        <button onClick={() => openBookingDetails(booking)} className="view-details-btn">
                          View Details
                        </button>
                        {
                        booking.sessionStatus.toLowerCase() === 'confirmed' ? 
                          <button onClick={() => handleJoinSession(booking)} className="join-btn">
                            <FaVideo /> Join Session
                          </button>
                          :
                          <div className={`card-status-banner ${booking.sessionStatus.toLowerCase()}`}>
                            {booking.sessionStatus }
                          </div>
                        }
                      </div>
                    </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-state">
              <div className="empty-illustration">
                <FaCalendarAlt />
              </div>
              <h3 className="empty-title">No sessions found</h3>
              <p className="empty-message">
                {activeFilter !== 'all' 
                  ? `You don't have any ${activeFilter} sessions at the moment.` 
                  : "You haven't booked any mentoring sessions yet."}
              </p>
            </div>
          )}
        </div>

        {selectedBooking && (
          <BookingDetailsModal 
            booking={selectedBooking} 
            onClose={closeBookingDetails} 
          />
        )}
    </div>
  )
}

export default StudentBookings