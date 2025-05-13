import { useEffect, useState } from "react";
import StudentNavbar from "./Navbar/navbar"
import { StudentDashboard } from "./Dashboard/studentdashboard";
import StudentBookings from "./Bookings/StudentBookings";
import { useNavigate } from "react-router-dom";
import { NewBooking } from "./NewBooking/NewBooking";
import "./style.css";

export const Student = () => {

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
    <div className="student-main">
        <div className="student-navbar-container">
            <StudentNavbar setTitle={setTitle} title={title}/>
        </div>
        <div className="student-main-container">
            {
                title === "dashboard" ? <StudentDashboard/> : 
                title === "bookings" ? <StudentBookings/> : 
                title === "newbooking" ? <NewBooking/> : null
            }
        </div>
    </div>
  )
}
