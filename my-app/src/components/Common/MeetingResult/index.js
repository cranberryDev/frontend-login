import React from "react";
import { Button } from "antd";
import bringImgApproved from "../../../assets/approval/meeting_approved.svg";
import bringImgRejected from "../../../assets/approval/meeting_rejected.svg";
import './style.css';

const MeetingResult = ({status, heading, desc}) => {
  const getStatusImage = () => {
    if(status=="approved"){
      return bringImgApproved
    }else if(status=="rejected"){
      return bringImgRejected
    }else{
      return bringImgApproved
    }
  }
  return (
    <div className="meeting_result">
      <img className="result_banner" src={getStatusImage()} />
      <span className="result_heading">{heading}</span>
      <span className="result_subheading">{desc}</span>
      {/* <a href="https://www.goindigo.in" target="_blank">
        <Button className="primary-btn">Proceed to IndiGo Website</Button>
      </a> */}
    </div>
  );
};


export default MeetingResult;
