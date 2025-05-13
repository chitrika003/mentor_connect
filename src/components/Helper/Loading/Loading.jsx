import React from 'react'
import './Loading.css';

export const Loading = () => {
  return (
    <div className="loading-container">
        <div className="loading-spinner"></div>
        <p className="loading-text">Please wait while we fetch the details...</p>
    </div>
  )
}
