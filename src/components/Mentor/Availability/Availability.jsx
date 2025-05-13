import React, { useEffect, useState } from 'react';
import './Availability.css';
import axios from 'axios';

export const MentorAvailability = ({ data }) => {

    let initialData = {
        days: data?.days,
        timeSlots: data?.timeSlots
    }

  // Days of the week
  const daysOfWeek = [
    { id: 0, name: 'Sunday' },
    { id: 1, name: 'Monday' },
    { id: 2, name: 'Tuesday' },
    { id: 3, name: 'Wednesday' },
    { id: 4, name: 'Thursday' },
    { id: 5, name: 'Friday' },
    { id: 6, name: 'Saturday' }
  ];

  // Predefined time slots
  const timeSlots = [
    { id: 1, time: '9:00 AM - 10:00 AM' },
    { id: 2, time: '10:00 AM - 11:00 AM' },
    { id: 3, time: '11:00 AM - 12:00 PM' },
    { id: 4, time: '1:00 PM - 2:00 PM' },
    { id: 5, time: '2:00 PM - 3:00 PM' },
    { id: 6, time: '3:00 PM - 4:00 PM' },
    { id: 7, time: '4:00 PM - 5:00 PM' },
    { id: 8, time: '5:00 PM - 6:00 PM' },
    { id: 9, time: '6:00 PM - 7:00 PM' },
    { id: 10, time: '7:00 PM - 8:00 PM' },
    { id: 11, time: '8:00 PM - 9:00 PM' },
    { id: 12, time: '9:00 PM - 10:00 PM' },
  ];

  // Convert initial days and time slots to IDs for selection
  const getInitialDayIds = () => {
    return initialData.days.map(dayName => 
      daysOfWeek.find(day => day.name === dayName)?.id
    ).filter(id => id !== undefined);
  };

  const getInitialTimeSlotIds = () => {
    return initialData.timeSlots.map(timeString => 
      timeSlots.find(slot => slot.time === timeString)?.id
    ).filter(id => id !== undefined);
  };

  const [selectedDays, setSelectedDays] = useState();
  const [selectedTimeSlots, setSelectedTimeSlots] = useState();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setSelectedDays(getInitialDayIds());
    setSelectedTimeSlots(getInitialTimeSlotIds());
  }, [data]);

  const toggleDay = (dayId) => {
    if (selectedDays.includes(dayId)) {
      setSelectedDays(selectedDays.filter(id => id !== dayId));
    } else {
      setSelectedDays([...selectedDays, dayId]);
    }
  };

  const toggleTimeSlot = (slotId) => {
    if (selectedTimeSlots.includes(slotId)) {
      setSelectedTimeSlots(selectedTimeSlots.filter(id => id !== slotId));
    } else {
      setSelectedTimeSlots([...selectedTimeSlots, slotId]);
    }
  };

  const handleUpdate = async () => {
    setLoading(true);
    const availabilityData = {
      days: selectedDays.map(dayId => daysOfWeek.find(day => day.id === dayId).name),
      timeSlots: selectedTimeSlots.map(slotId => {
        const slot = timeSlots.find(slot => slot.id === slotId);
        return slot.time;
      })
    };

    const mentorId = localStorage.getItem('mentorId');
    const token = localStorage.getItem('mentorToken');

    try {
        setLoading(true);
        const response = await axios.post(`http://localhost:9000/add/mentor/availability/${mentorId}`, availabilityData, {
            headers: {
                'x-auth-token': token
            }
        });

        setTimeout(() => {
            alert("Updated successfully");
            setLoading(false);
        }, 1000);
    } catch (error) {
        setLoading(false);
        console.error('Error:', error);
        alert(error?.response?.data?.message ?? "Error updating mentor availability");
    }
  };

  return (
    <div className="mentor-availability">
      <h2 className='availability-title'>Set Your Availability</h2>
      
      <div className="availability-container">
        <div className="days-section">
          <h3 className='days-section-title'>Select Days</h3>
          <div className="days-grid">
            {daysOfWeek.map(day => (
              <div 
                key={day.id} 
                className={`day-item ${selectedDays?.includes(day.id) ? 'selected' : ''}`}
                onClick={() => toggleDay(day.id)}
              >
                {day.name}
              </div>
            ))}
          </div>
        </div>

        <div className="time-slots-section">
          <h3 className='time-slots-section-title'>Select Time Slots</h3>
          <div className="time-slots-grid">
            {timeSlots.map(slot => (
              <div 
                key={slot.id} 
                className={`time-slot ${selectedTimeSlots?.includes(slot.id) ? 'selected' : ''}`}
                onClick={() => toggleTimeSlot(slot.id)}
              >
                {slot.time}
              </div>
            ))}
          </div>

        </div>
      </div>

      <div className="availability-action-buttons">
        <button onClick={handleUpdate} className="availability-update-btn" disabled={loading}>
            {loading ? 'Updating...' : ' Update Availability'}
        </button>
      </div>
    </div>
  );
};