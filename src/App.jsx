import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import './App.css'
import Home from './components/Home/Home'
import MentorLogin from './components/Login/mentorLogin'
import StudentLogin from './components/Login/studentLogin'
import Admin from './components/Admin/Admin'
import { Student } from './components/Student/main'
import { Mentor } from './components/Mentor/msin'
import VideoCallIntegration from './components/Helper/videoCall/videocallIntegration'
import AdminLogin from './components/Login/Admin/adminLogin'

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path='/admin' element={<Admin/>}/>
        <Route path='/adminlogin' element={<AdminLogin />} />
        {/* <Route path='/admin/register' element={<AdminRegister />} /> */}


        <Route path="/studentlogin" element={<StudentLogin />} />
        <Route path="/student" element={<Student />} />


        <Route path="/mentorlogin" element={<MentorLogin />} />
        <Route path="/mentor" element={<Mentor />} />

        <Route path="/videocall/:roomId" element={<VideoCallIntegration />} />

        <Route path="*" element={<div className='not-found'>404 Page Not Found</div>} />

      </Routes>
    </Router>
  )
}

export default App
