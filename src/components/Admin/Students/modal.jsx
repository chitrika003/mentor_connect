import './modal.css';

export const StudentEditModal = ({selectedStudent, handleCloseModal, handleAttendanceChange, attendanceData, handleSubmitAttendance}) => {
  return (
        <div className="edit-attendance-modal-overlay">
          <div className="edit-attendance-modal">
            <div className="modal-header">
              <h2>Update Attendance for {selectedStudent.name}</h2>
              <button className="close-modal-btn" onClick={handleCloseModal}>×</button>
            </div>
            <div className="modal-body">
              <div className="form-group">
                <label htmlFor="month">Month:</label>
                <select 
                  id="month" 
                  name="month" 
                  value={attendanceData.month} 
                  onChange={handleAttendanceChange}
                >
                  {[
                    'January', 'February', 'March', 'April', 'May', 'June', 
                    'July', 'August', 'September', 'October', 'November', 'December'
                  ].map(month => (
                    <option key={month} value={month}>{month}</option>
                  ))}
                </select>
              </div>
              <div className="form-group">
              <label htmlFor="totalWorkingDays">Total Working Days:</label>
              <input 
                type="number" 
                id="totalWorkingDays" 
                name="totalWorkingDays" 
                value={attendanceData.totalWorkingDays} 
                onChange={handleAttendanceChange}
                min="0"
              />
            </div>
            <div className="form-group">
              <label htmlFor="leavesTaken">Total Leaves Taken:</label>
              <input 
                type="number" 
                id="leavesTaken" 
                name="leavesTaken" 
                value={attendanceData.leavesTaken} 
                onChange={handleAttendanceChange}
                min="0"
              />
            </div>
          </div>
          <div className="modal-footer">
            <button className="cancel-btn" onClick={handleCloseModal}>Cancel</button>
            <button className="save-btn" onClick={handleSubmitAttendance}>Save Changes</button>
          </div>
        </div>
      </div>
  )
}
