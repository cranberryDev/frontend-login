import React from "react";
import BlueAnimationPlane from './../BluePlaneAnimation';
import MeetingResult from './../MeetingResult';
import './style.css';

const ThankYou = ({ status, heading, desc }) => {

    return (
        <div className='meeting-form-wrapper'>
            <div className='meeting-form-banner'>
                {/* <img src={bringImg} alt='Bring you back in the skies' /> */}
                <BlueAnimationPlane />
            </div>
            <div className='request-form' style={{justifyContent: "center"}}>
                <MeetingResult status={status ? status : 'success'} heading={heading ? heading : 'Thank You'} desc={desc ? desc : 'Please Visit Again'} />
            </div>
        </div>
    );
};


export default ThankYou;
