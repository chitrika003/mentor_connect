import React, { useEffect, useState } from 'react'
import axios from 'axios';
import { LowMeeting } from '../Helper/LowMeeting/LowMeeting';
import { MeetingHistory } from '../Helper/MeetingHistory/MeetingHistory';
import './MentorMeetings.css';
import { FaVideo } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../Helper/Loading/Loading';

export const MentorMeetings = () => {

  const navigate = useNavigate();
  const [allData, setAllData] = useState(null);
  const [selectedStatus, setSelectedStatus] = useState('');
  const [selectedBookingId, setSelectedBookingId] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('');
  const [filterStatus, setFilterStatus] = useState('');
  const [notes, setNotes] = useState({});
  const [editingNoteId, setEditingNoteId] = useState(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [selectedMeeting, setSelectedMeeting] = useState(null);

  const [loading, setLoading] = useState(true);

  const mentorId = localStorage.getItem('mentorId');
  const token = localStorage.getItem('mentorToken');

  useEffect(() => {
    getMeeting();
  }, []);

  useEffect(() => {
    // Initialize notes from fetched data
    if (allData?.allMeetings) {
      const initialNotes = {};
      allData.allMeetings.forEach(meeting => {
        initialNotes[meeting.bookingId] = meeting.sessionNotes || '';
      });
      setNotes(initialNotes);
    }
  }, [allData]);

  async function getMeeting() {
    try {
      const res = await axios.get(`http://localhost:9000/app/mentor/meeting/${mentorId}`, 
        {
          headers: {
            'x-auth-token': token
          }
        }
        );

        setLoading(false);
        if(res.data.error === "jwt must be provided") {
          alert("Please login to continue");
          localStorage.removeItem('mentorToken');
          localStorage.removeItem('mentorId');
          navigate('/mentorlogin');
          return;
        }

        console.log(res,"res.data");
        if(res?.status === 200) {
          setAllData(res.data);
        }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Unable to fetch data");
      console.log(error);
    }
  }

  async function updateMeetingStatus(bookingId, newStatus) {
    try {
      setIsUpdating(true);
      const res = await axios.post(`http://localhost:9000/app/mentor/meeting/update-status/${bookingId}`, 
        { sessionStatus: newStatus },
        {
          headers: {
            'x-auth-token': token
          }
        }
      );

      if(res?.status === 200) {
        // Refresh the meetings data
        getMeeting();
        setSelectedBookingId(null);
        setSelectedStatus('');
      }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Unable to update meeting status");
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }

  async function updateMeetingNotes(bookingId, newNotes) {
    try {
      setIsUpdating(true);
      const res = await axios.post(`http://localhost:9000/app/update/session-notes/${bookingId}`, 
        { sessionNotes: newNotes },
          {
            headers: {
              'x-auth-token': token
            }
          }
      );

      if(res?.status === 200) {
        // Update the notes in the current state without refetching
        if (selectedMeeting && selectedMeeting.bookingId === bookingId) {
          setSelectedMeeting({
            ...selectedMeeting,
            sessionNotes: newNotes
          });
        }
        
        // Also update in the allData state
        if (allData?.allMeetings) {
          const updatedMeetings = allData.allMeetings.map(meeting => {
            if (meeting.bookingId === bookingId) {
              return { ...meeting, sessionNotes: newNotes };
            }
            return meeting;
          });
          
          setAllData({
            ...allData,
            allMeetings: updatedMeetings
          });
        }
        
        setEditingNoteId(null);
      }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Unable to update meeting notes");
      console.log(error);
    } finally {
      setIsUpdating(false);
    }
  }

  const handleStatusChange = async (e, bookingId) => {
    setSelectedStatus(e.target.value);
    setSelectedBookingId(bookingId);
  };

  const handleStatusUpdate = () => {
    if (selectedStatus && selectedBookingId) {
      updateMeetingStatus(selectedBookingId, selectedStatus);

      setSelectedBookingId(null);
    }
  };

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleDepartmentFilterChange = (e) => {
    setFilterDepartment(e.target.value);
  };

  const handleStatusFilterChange = (e) => {
    setFilterStatus(e.target.value);
  };

  const handleNoteChange = (e, bookingId) => {
    setNotes({
      ...notes,
      [bookingId]: e.target.value
    });
  };

  const handleEditNote = (bookingId) => {
    setEditingNoteId(bookingId);
  };

  const handleSaveNote = (bookingId) => {
    updateMeetingNotes(bookingId, notes[bookingId]);
  };

  const handleCancelEdit = () => {
    // Reset the notes for the current editing booking to its original value
    if (editingNoteId && allData?.allMeetings) {
      const meeting = allData.allMeetings.find(m => m.bookingId === editingNoteId);
      if (meeting) {
        setNotes({
          ...notes,
          [editingNoteId]: meeting.sessionNotes || ''
        });
      }
    }
    // Exit edit mode
    setEditingNoteId(null);
  };

  const handleViewMore = (meeting) => {
    setSelectedMeeting(meeting);
    setShowModal(true);
  };

  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMeeting(null);
    setEditingNoteId(null);
  };

  const handleJoinSession = (meeting) => {
    if(meeting?.sessionLink) {
      navigate(`/videocall/${meeting.sessionLink}`);
    } else {
      alert("Session link not found");
    }
  };

  // Get unique departments for filter dropdown
  const departments = allData?.allMeetings 
    ? [...new Set(allData.allMeetings.map(meeting => meeting.studentDepartment))]
    : [];

  // Filter meetings based on search term and filters
  const filteredMeetings = allData?.allMeetings
    ? allData.allMeetings.filter(meeting => {
        const matchesSearch = 
          meeting.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          meeting.studentRollNumber.toLowerCase().includes(searchTerm.toLowerCase()) ||
          (meeting.doubts && meeting.doubts.toLowerCase().includes(searchTerm.toLowerCase()));
        
        const matchesDepartment = filterDepartment === '' || meeting.studentDepartment === filterDepartment;
        const matchesStatus = filterStatus === '' || meeting.sessionStatus === filterStatus;
        
        return matchesSearch && matchesDepartment && matchesStatus;
      })
    : [];

  if(loading) {
    return <Loading />
  } 

  return (
    <div className="mentor-meetings-container">
      {/* left side */}
      <div className="mentor-meetings-left">
          <MeetingHistory bookings={allData?.bookingStats} />
          <LowMeeting count={allData?.totalStudentsWithLowMeetingCount} students={allData?.studentsWithLowMeetingCount} totalAssignedStudents={allData?.totalStudentsAssigned} />
      </div>
      {/* right side */}
      <div className="mentor-meetings-right">
        <h2 className='mentor-meetings-title'>Student Meeting Details</h2>
        
        {/* Search and Filter Section */}
        <div className="search-filter-container">
          <div className="search-box">
            <input 
              type="text" 
              placeholder="Search by name, roll number, or doubts..." 
              value={searchTerm}
              onChange={handleSearchChange}
            />
          </div>
          <div className="filter-box">
            <select 
              value={filterDepartment} 
              onChange={handleDepartmentFilterChange}
            >
              <option value="">All Departments</option>
              {departments.map(dept => (
                <option key={dept} value={dept}>{dept}</option>
              ))}
            </select>
            
            <select 
              value={filterStatus} 
              onChange={handleStatusFilterChange}
            >
              <option value="">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="completed">Completed</option>
              <option value="rejected">Rejected</option>
              <option value="confirmed">Confirmed</option>
            </select>
          </div>
        </div>
        
        <div className="student-meetings-table">
          <table>
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Roll Number</th>
                <th>Status</th>
                <th>Action</th>
                <th>View Details</th>
              </tr>
            </thead>
            <tbody>
              {filteredMeetings.map((booking) => (
                <tr key={booking.bookingId}>
                  <td>{booking.studentName}</td>
                  <td>{booking.studentRollNumber}</td>
                  <td>
                    {booking.sessionStatus}
                    {booking.sessionStatus === "confirmed" && (
                      <button 
                        className="join-session-button"
                        onClick={() => handleJoinSession(booking)}
                      >
                        <FaVideo /> Join Session
                      </button>
                    )}
                  </td>
                  <td>
                    <div className="status-dropdown-container">
                      <select 
                        value={selectedBookingId === booking?.bookingId ? selectedStatus : ''}
                        onChange={(e) => handleStatusChange(e, booking?.bookingId)}
                        className="status-dropdown"
                      >
                        <option value="">Change Status</option>
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="confirmed">Confirmed</option>
                        <option value="rejected">Rejected</option>
                      </select>
                      {selectedBookingId === booking?.bookingId && selectedStatus && !isUpdating && (
                        <button 
                          className="update-button"
                          onClick={handleStatusUpdate}
                        >
                          Update
                        </button>
                      )}
                    </div>
                  </td>
                  <td>
                    <button 
                      className="view-more-button"
                      onClick={() => handleViewMore(booking)}
                    >
                      View More
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Meeting Details Modal */}
        {showModal && selectedMeeting && (
          <div className="meeting-modal-overlay">
            <div className="meeting-modal">
              <div className="modal-header">
                <h3>Meeting Details</h3>
                <button className="close-modal-button" onClick={handleCloseModal}>×</button>
              </div>
              <div className="modal-content">
                <div className="modal-info">
                  <p><strong>Student:</strong> {selectedMeeting.studentName}</p>
                  <p><strong>Roll Number:</strong> {selectedMeeting.studentRollNumber}</p>
                  <p><strong>Department:</strong> {selectedMeeting.studentDepartment}</p>
                  <p><strong>Booking Date:</strong> {new Date(selectedMeeting.bookingDate).toLocaleDateString()}</p>
                  <p><strong>Status:</strong> {selectedMeeting.sessionStatus}</p>
                  
                  {selectedMeeting.sessionStatus === "completed" && (
                    <div className="modal-action-buttons">
                      <button 
                        className="join-session-button"
                        onClick={() => handleJoinSession(selectedMeeting)}
                      >
                        <FaVideo /> Join Session
                      </button>
                    </div>
                  )}
                  
                  <div className="modal-doubts">
                    <h4>Doubts/Concerns:</h4>
                    <p>{selectedMeeting.doubts || 'No doubts mentioned'}</p>
                  </div>
                  <div className="modal-notes">
                    <h4>Session Notes:</h4>
                    {editingNoteId === selectedMeeting.bookingId ? (
                      <div className="notes-edit-container">
                        <textarea
                          value={notes[selectedMeeting.bookingId]}
                          onChange={(e) => handleNoteChange(e, selectedMeeting.bookingId)}
                          className="notes-textarea"
                          placeholder="Add notes for student..."
                        />
                        <div className="notes-buttons">
                          <button 
                            className="save-note-button"
                            onClick={() => handleSaveNote(selectedMeeting.bookingId)}
                          >
                            Save
                          </button>
                          <button 
                            className="cancel-note-button"
                            onClick={handleCancelEdit}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <div className="notes-display">
                        <p>{selectedMeeting.sessionNotes || 'No notes'}</p>
                        <button 
                          className="edit-note-button"
                          onClick={() => handleEditNote(selectedMeeting.bookingId)}
                        >
                          Edit Notes
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
