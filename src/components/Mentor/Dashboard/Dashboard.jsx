import { useState } from 'react'
import './Dashboard.css'
import { MentorBasicInfo } from '../Helper/BasicInfo/BasicInfo'
import { MeetingSummary } from '../../Helper/MeetingSummary/MeetingSummary'
import { MeetingHistory } from '../Helper/MeetingHistory/MeetingHistory'
import { MentorAvailability } from '../Availability/Availability'
import axios from 'axios';
import { useEffect } from 'react';
import { Loading } from '../../Helper/Loading/Loading';

function MentorDashboard() {

  const [mentor, setMentor] = useState(null);
  const [loading, setLoading] = useState(true);

  const mentorId = localStorage.getItem('mentorId');
  const token = localStorage.getItem('mentorToken');
  
  useEffect(() => {
    // if(!mentorId) {
    //   alert('Please login to continue');
    //   navigate('/mentorlogin');
    // }
    getMentor();
  }, []);

  async function getMentor() {
    try {
      setLoading(true);

      const response = await axios.get(`http://localhost:9000/get/mentor/${mentorId}`, {
        headers: {
          'x-auth-token': token
        }
      });
      if (response.status === 200) {
        setMentor(response.data);
        setLoading(false);
      } else {
        setLoading(false);
        console.error('Error fetching mentor:', response.data);
      }
    } catch (error) {
      alert(error?.response?.data?.message ?? "Error fetching mentor");
      setLoading(false);
      console.error('Error fetching mentor:', error);
    }
  }

  if(loading) {
    return <Loading />
  }

  return (
    <div className="dashboard-container">

      <div className="dashboard-content">
      
        {/* left-side main column */}
        <div className="dashboard-column main-column">
          <MentorBasicInfo mentor={mentor?.mentor}/>
          <MeetingSummary currentMonthMeetings={mentor?.bookingStats?.currentMonthBookings} totalMeetings={mentor?.bookingStats?.totalBookings}/>
          <MeetingHistory bookings={mentor?.bookingStats?.statusCounts}/>
        </div>

        {/* right-side side column */}
        <div className="dashboard-column side-column">
          <MentorAvailability 
            data={{
              days: mentor?.mentor?.availability?.days && mentor?.mentor?.availability?.days?.length > 0 ? mentor?.mentor?.availability?.days : [],
              timeSlots: mentor?.mentor?.availability?.timeSlots && mentor?.mentor?.availability?.timeSlots?.length > 0 ? mentor?.mentor?.availability?.timeSlots : []
            }}
          />
        </div>

      </div>
    </div>
  )
}

export default MentorDashboard;