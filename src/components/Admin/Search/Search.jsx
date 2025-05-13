import React from 'react';
import '../Students/overallStudent.css';
import './Search.css';
const Search = ({ selectedDepartment, fetchStudentsByDepartment, setStudents, students, title }) => {
  const handleSearch = (e) => {
    const searchTerm = e.target.value.toLowerCase();
    if (searchTerm === '') {
      fetchStudentsByDepartment(selectedDepartment.name);
    } else {
      const filteredStudents = students.filter(student => 
        student.name.toLowerCase().includes(searchTerm)
      );
      setStudents(filteredStudents);
    }
  };

  return (
    <div className='admin-students-section-header'>
      <div className='admin-students-section-header-title'>
        <button className='admin-students-section-header-reload-button' onClick={() => fetchStudentsByDepartment(selectedDepartment.name)}><i className="fas fa-sync-alt"></i></button>
        <h2 className="admin-students-title">{title} Details - {selectedDepartment.name}</h2>
      </div>
      <div className="admin-students-search-container">
        <input 
          type="text" 
          placeholder={`Search ${title}...`} 
          className="admin-students-search-input"
          onChange={handleSearch}
        />
        {/* <i className="search-icon fas fa-search"></i> */}
      </div>
    </div>
  );
};

export default Search;