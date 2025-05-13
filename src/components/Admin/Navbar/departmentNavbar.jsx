import './departmentNavbar.css';

const DepartmentNavbar = ({ departments, selectedDepartment, handleDepartmentSelect }) => {
  return (
    <div className="admin-students-departments-section">
    <h2 className="admin-students-departments-title">Departments</h2>
    <div className="admin-students-departments-grid">
      {departments.map(department => (
        <div 
          key={department.id} 
          className={`admin-students-department-card ${selectedDepartment?.id === department.id ? 'selected' : ''}`}
          onClick={() => handleDepartmentSelect(department)}
        >
          <h3 className='admin-students-department-card-title'>{department.name}</h3>
        </div>
      ))}
    </div>
  </div>
  );
};

export default DepartmentNavbar;
