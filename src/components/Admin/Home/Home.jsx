// import React, { useState, useEffect } from 'react';
// import './Home.css';
// import { FaUserGraduate, FaUserCheck, FaChartBar } from 'react-icons/fa';

// const Home = () => {
//   // Sample data - replace with actual API call
//   const [departmentData, setDepartmentData] = useState([
//     { id: 1, name: 'Computer Science', totalStudents: 120, presentStudents: 98 },
//     { id: 2, name: 'Electrical Engineering', totalStudents: 85, presentStudents: 72 },
//     { id: 3, name: 'Mechanical Engineering', totalStudents: 95, presentStudents: 80 },
//     { id: 4, name: 'Civil Engineering', totalStudents: 75, presentStudents: 65 },
//     { id: 5, name: 'Business Administration', totalStudents: 110, presentStudents: 90 },
//   ]);

//   // Calculate total stats
//   const totalStudents = departmentData.reduce((sum, dept) => sum + dept.totalStudents, 0);
//   const totalPresent = departmentData.reduce((sum, dept) => sum + dept.presentStudents, 0);
//   const overallAttendance = Math.round((totalPresent / totalStudents) * 100);

//   return (
//     <div className="admin-home-container">
//       <h1 className="admin-home-title">Admin Dashboard</h1>
      
//       {/* Summary Cards */}
//       <div className="admin-summary-cards">
//         <div className="admin-summary-card">
//           <div className="admin-card-icon">
//             <FaUserGraduate />
//           </div>
//           <div className="admin-card-content">
//             <h3>Total Students</h3>
//             <p>{totalStudents}</p>
//           </div>
//         </div>
        
//         <div className="admin-summary-card">
//           <div className="admin-card-icon">
//             <FaUserCheck />
//           </div>
//           <div className="admin-card-content">
//             <h3>Present Today</h3>
//             <p>{totalPresent}</p>
//           </div>
//         </div>
        
//         <div className="admin-summary-card">
//           <div className="admin-card-icon">
//             <FaChartBar />
//           </div>
//           <div className="admin-card-content">
//             <h3>Attendance Rate</h3>
//             <p>{overallAttendance}%</p>
//           </div>
//         </div>
//       </div>
      
//       {/* Department Attendance Table */}
//       <div className="admin-attendance-section">
//         <h2 className="admin-attendance-title">Department Attendance</h2>
//         <div className="admin-attendance-table">
//           <div className="admin-table-header">
//             <div className="admin-header-cell">Department</div>
//             <div className="admin-header-cell">Total Students</div>
//             <div className="admin-header-cell">Present</div>
//             <div className="admin-header-cell">Attendance Rate</div>
//             <div className="admin-header-cell">Status</div>
//           </div>
          
//           {departmentData.map(dept => {
//             const attendanceRate = Math.round((dept.presentStudents / dept.totalStudents) * 100);
//             let statusClass = 'status';
//             if (attendanceRate >= 90) statusClass += ' excellent';
//             else if (attendanceRate >= 75) statusClass += ' good';
//             else if (attendanceRate >= 60) statusClass += ' average';
//             else statusClass += ' poor';
            
//             return (
//               <div className="admin-table-row" key={dept.id}>
//                 <div className="admin-table-cell">{dept.name}</div>
//                 <div className="admin-table-cell">{dept.totalStudents}</div>
//                 <div className="admin-table-cell">{dept.presentStudents}</div>
//                 <div className="admin-table-cell">{attendanceRate}%</div>
//                 <div className="admin-table-cell">
//                   <span className={statusClass}>
//                     {attendanceRate >= 90 ? 'Excellent' : 
//                      attendanceRate >= 75 ? 'Good' : 
//                      attendanceRate >= 60 ? 'Average' : 'Poor'}
//                   </span>
//                 </div>
//               </div>
//             );
//           })}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Home;