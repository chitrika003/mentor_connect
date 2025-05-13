import React, { useEffect, useState } from 'react'
import NameInitials from '../../../Helper/helper'
import './BasicInfo.css'

export const MentorBasicInfo = ({ mentor }) => {

    return (
        <div className="mentor-profile-card">
            <div className="mentor-profile-header">
                <div className="mentor-profile-name-department-container">
                    <div className="mentor-profile-image">
                        <NameInitials profileImage={mentor?.photo || ''} name={mentor?.name || '--'} />
                    </div>
                    <div className="mentor-profile-name-department">
                        <div className="mentor-name-department">
                            <div className='mentor-name'>{mentor?.name || '--'}</div> 
                            <div className="mentor-department">{mentor?.department || '--'}</div>
                        </div>
                        <span className="mentor-detail-value">{mentor?.email || '--'}</span>
                    </div>
                </div>
                <div className="mentor-profile-info">
                    <div className="mentor-profile-details">
                        <div className="mentor-detail-item">
                            <div className="mentor-detail-icon"><div className="fas fa-star"></div></div>
                            <div className="mentor-detail-content">
                                <span className="mentor-detail-label">No. of Students assigned</span>
                                <span className="mentor-detail-value">{mentor?.studentsAssigned || 0}</span>
                            </div>
                        </div>
                        <div className="mentor-detail-item">
                            <div className="mentor-detail-icon"><div className="fas fa-briefcase"></div></div>
                            <div className="mentor-detail-content">
                                <span className="mentor-detail-label">Experience</span>
                                <span className="mentor-detail-value">{mentor?.experience || '--'}</span>
                            </div>
                        </div>
                        <div className="mentor-detail-item">
                            <div className="mentor-detail-icon"><div className="fas fa-graduation-cap"></div></div>
                            <div className="mentor-detail-content">
                                <span className="mentor-detail-label">Specialization</span>
                                <span className="mentor-detail-value">{mentor?.specialization || '--'}</span>
                            </div>
                        </div>
                        {/* <div className="mentor-detail-item">
                            <div className="mentor-detail-icon"><div className="fas fa-envelope"></div></div>
                            <div className="mentor-detail-content">
                                <span className="mentor-detail-label">Email</span>
                                <span className="mentor-detail-value">{mentor?.email || '--'}</span>
                            </div>
                        </div> */}
                        <div className="mentor-detail-item">
                            <div className="mentor-detail-icon"><div className="fas fa-phone"></div></div>
                            <div className="mentor-detail-content">
                                <span className="mentor-detail-label">Phone</span>
                                <span className="mentor-detail-value">{mentor?.phone || '--'}</span>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}
