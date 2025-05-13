import Navbar from './Navbar/Navbar'
import './Home.css'
import { Link } from 'react-router-dom'

function Home() {
  return (
    <div className='home-main-container'>
      <Navbar />
      <div className="home-container">
        <h1 className='home-title'>Welcome to MentorConnect</h1>
        <p className='home-description'>Connect with expert mentors to solve your doubts and accelerate your learning journey.</p>
        
        <div className="home-cards">
          <div className="home-card">
            <h2 className='home-card-title'>For Students</h2>
            <p className='home-card-description'>Browse available mentors, book sessions, and get your doubts clarified.</p>
            <Link to="/studentlogin" className="home-button">Student Login</Link>
          </div>
          
          <div className="home-card">
            <h2 className='home-card-title'>For Mentors</h2>
            <p className='home-card-description'>Manage your availability, view booking requests, and help students.</p>
            <Link to="/mentorlogin" className="home-button">Mentor Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Home