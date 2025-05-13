import React, { useState, useEffect } from 'react'
import './NewBooking.css'
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Loading } from '../../Helper/Loading/Loading';

export const NewBooking = () => {

    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [bookingLoading, setBookingLoading] = useState(false);
    const [mentors, setMentors] = useState([]);
    const [selectedMentor, setSelectedMentor] = useState('');
    const [description, setDescription] = useState('');
    const [selectedDate, setSelectedDate] = useState('');
    const [selectedTime, setSelectedTime] = useState('');

    const [timeSlots, setTimeSlots] = useState([]);
    const [dates, setDates] = useState([]);

    useEffect(() => {
        getMentors();
    }, []);

    useEffect(() => {
        if(selectedMentor) {
            mentors.map((value)=> {
                if(value._id === selectedMentor) {
                    setDates(value?.availability?.days ?? []);
                    setTimeSlots(value?.availability?.timeSlots ?? []);
                }
            })
        }
    }, [selectedMentor]);

    async function getMentors() {
        try {
            setLoading(true);
            const token = localStorage.getItem('studentToken');
            const studentId = localStorage.getItem('studentId');
            const response = await axios.get(`http://localhost:9000/get-mentors/${studentId}`, {
                headers: {
                    'x-auth-token': `${token}`
                }
            });

            console.log(response?.data, "response");

            if(response.data.error === "jwt must be provided") {
                setLoading(false);
                alert("Please login again");
                localStorage.removeItem('studentToken');
                localStorage.removeItem('studentId');
                navigate('/studentlogin');
                return;
            }

            if(response.status === 200) {
                setTimeout(() => {
                    setLoading(false);
                }, 1000);
                setMentors(response.data);
                return;
            }

            setLoading(false);

        } catch (error) {
            console.log(error);
            setLoading(false);
            alert(error?.response?.data?.message ?? "Error fetching mentors");
        }
    }

    const handleSubmit = async(e) => {
        try {
            e.preventDefault();
            if (!selectedMentor || !description || !selectedDate || !selectedTime) {
                alert('Please fill all the fields');
                return;
            }

            const token = localStorage.getItem('studentToken');
            const studentId = localStorage.getItem('studentId');
            
            setBookingLoading(true);
            const response = await axios.post(`http://localhost:9000/book-session/${studentId}`, {
                mentorId: selectedMentor,
                description,
                date: selectedDate,
                time: selectedTime
            }, {
                headers: {
                    'x-auth-token': `${token}`
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
                setTimeout(() => {
                setBookingLoading(false);
                }, 1000);
                alert('Booking request submitted successfully!');
                setSelectedMentor('');
                setDescription('');
                setSelectedDate('');
                setSelectedTime('');
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

    if(loading) {
        return (
            <Loading />
        )}

    return (
        <div className="newbooking-container">
            <div className="newbooking-card">
                <div className="newbooking-card-header">
                    <h2>Book a Session with a Mentor</h2>
                    <p className="newbooking-subtitle">Schedule a meeting with your preferred mentor</p>
                </div>
                
                <div className="newbooking-card-body">
                    <form className="newbooking-form" onSubmit={handleSubmit}>
                        <div className="newbooking-form-group">
                            <label htmlFor="mentor-select">Select a Mentor</label>
                            <select 
                                id="mentor-select" 
                                value={selectedMentor} 
                                onChange={(e) => setSelectedMentor(e.target.value)}
                                className="newbooking-form-control"
                            >
                                <option value="">-- Select a Mentor --</option>
                                {mentors?.map((mentor) => (
                                    <option key={mentor._id} value={mentor._id}>
                                        {mentor.name} - {mentor.department}
                                    </option>
                                ))}
                            </select>
                        </div>
                        
                        {selectedMentor && (
                            <>
                                <div className="newbooking-form-group">
                                    <label htmlFor="description">Session Description</label>
                                    <textarea 
                                        id="description" 
                                        value={description} 
                                        onChange={(e) => setDescription(e.target.value)}
                                        placeholder="Describe your doubts or topics you'd like to discuss..."
                                        className="newbooking-form-control"
                                        rows="4"
                                    ></textarea>
                                </div>
                                
                                <div className="newbooking-booking-schedule">
                                    <div className="newbooking-form-group">
                                        <label>Select a Date</label>
                                        <div className="newbooking-date-grid">
                                            {dates && dates?.length ? dates.map((date) => (
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
                                            {timeSlots && timeSlots?.length ? timeSlots.map((time) => (
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
                                
                                <div className="newbooking-form-group">
                                    <button disabled={bookingLoading} type="submit" className="newbooking-btn newbooking-btn-primary">
                                        {bookingLoading ? 'Booking...' : 'Book Session'}
                                    </button>
                                </div>
                            </>
                        )}
                    </form>
                </div>
            </div>
        </div>
    )
}
