import React from "react";
import bringImg from './../../../assets/meetingForm/indigo.svg';
import bringLogo from './../../../assets/meetingForm/logo1.svg';
import './style.css';

const BlueAnimationPlane = () => {
  return (
    <div className="blue-indigo-image">
      <img className="background-bg" src={bringLogo} alt="logo" />
      <img className="indigo-logo" src={bringImg} alt="logo" />
    </div>
  );
};


export default BlueAnimationPlane;
