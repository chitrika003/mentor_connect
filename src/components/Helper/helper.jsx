import React, { useState } from 'react';
import './helper.css';

const NameInitials = ({ profileImage, name }) => {
  const [imageError, setImageError] = useState(false);

  const getInitials = (name) => {
    if (!name) return '??';
    return name.substring(0, 2).toUpperCase();
  };

  const handleImageError = () => {
    setImageError(true);
  };

  return (
    <div className='name-initials'>
      {profileImage && !imageError ? (
        <img 
          src={profileImage} 
          alt={name || 'Profile'} 
          onError={handleImageError}
          className="profile-image"
        />
      ) : (
        getInitials(name)
      )}
    </div>
  );
};

export default NameInitials;