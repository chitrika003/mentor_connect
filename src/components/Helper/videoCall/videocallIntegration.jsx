import React, { useState } from 'react';
import { JitsiMeeting } from '@jitsi/react-sdk';
import {useNavigate, useParams } from 'react-router-dom';
import './videocallIntegration.css'

const VideoCallIntegration = ({userName}) => {

    const navigate = useNavigate();
    const { roomId } = useParams();
    console.log(userName,"userName", roomId)

    return (
        <div className="video-call-container">
            <div onClick={() => navigate(-1)} className="meeting-title-container">
                <h1 className="meeting-title"> ← Back</h1>
            </div>
            <div className="jitsi-container">
                <JitsiMeeting
                    domain="meet.jit.si"
                    roomName={roomId}
                    configOverwrite={{
                        startWithAudioMuted: true,
                        disableModeratorIndicator: true,
                        startScreenSharing: true,
                        enableEmailInStats: false
                    }}
                    interfaceConfigOverwrite={{
                        DISABLE_JOIN_LEAVE_NOTIFICATIONS: true
                    }}
                    userInfo={{
                        displayName: userName ?? "Guest"
                    }}
                    
                    getIFrameRef={(iframeRef) => { 
                        iframeRef.style.height = '100%'; 
                        iframeRef.style.width = '100%'; 
                        iframeRef.style.border = 'none';
                    }}
                />
            </div>
        </div>
    );
};

export default VideoCallIntegration;
//     // Create room ID using participant name and timestamp
//     const roomId = `call-${participantName.replace(/\s+/g, '-')}-${Date.now()}`;
//     const domain = 'meet.jit.si';
    
//     // Open Jitsi Meet in a new window
//     window.open(`https://${domain}/${roomId}`, '_blank');

//     // Initialize Jitsi Meet API
//     const api = new JitsiMeetExternalAPI("8x8.vc", {
//         roomName: roomId,
//         parentNode: document.querySelector('#jaas-container'),
//         userInfo: {
//             displayName: participantName // Optional: Set display name
//         },
//         configOverwrite: {
//             startWithAudioMuted: true, // Start with audio muted
//             startWithVideoMuted: true, // Start with video muted
//             enableWelcomePage: false, // Disable welcome page
//             disableAudio: true, // Disable audio to avoid prompt
//             disableVideo: true // Disable video to avoid prompt
//         }
//     });

//     console.log(api.getIFrame(),"poiuytrewq")

//     api.addEventListener('videoConferenceJoined', () => {
//         console.log('Video conference joined.');
//     });

//     api.addEventListener('readyToClose', () => {
//         console.log('Meeting is ready to close.');
//         alert('Meeting has ended.');
//         newWindow.close(); // Close the new window when the meeting ends
//     });

//     // Listen for the video conference left event
//     api.addEventListener('videoConferenceLeft', () => {
//         console.log('Meeting has ended.');
//         // You can add additional logic here, such as closing the window or updating the UI
//         alert('Meeting has ended.');
//         newWindow.close(); // Optional: Close the new window when the meeting ends
//     });
// };