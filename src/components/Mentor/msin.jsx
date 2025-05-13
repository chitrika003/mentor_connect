import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "./style.css";
import MentorDashboard from "./Dashboard/Dashboard";
import { MyStudents } from "./MyStudents/MyStudents";
import { MentorMeetings } from "./MentorMeetings/MentorMeetings";
import MentorNavbar from "./Navbar/navbar";

export const Mentor = () => {

    const navigate = useNavigate();
    const [title, setTitle] = useState("dashboard");
    
    useEffect(() => {
        setTitle("dashboard");
    }, []);

    if(title === "home") {
        navigate("/");
        return;
    }

  return (
    <div className="mentor-main">
        <div className="mentor-navbar-container">
          <MentorNavbar setTitle={setTitle} title={title}/>
        </div>
        <div className="mentor-main-container">
            {
              title === "dashboard" ? <MentorDashboard/> : 
              // title === "availability" ? <MentorAvailability/> : 
              title === "students" ? <MyStudents/> : 
              title === "meetings" ? <MentorMeetings/> : null
            }
        </div>
    </div>
  )
}
