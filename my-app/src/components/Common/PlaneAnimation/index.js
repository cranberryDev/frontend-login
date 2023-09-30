import React from "react";
import bringing from '../../../assets/login/Bringing.svg'
import blue from '../../../assets/login/blue.svg'
import back from '../../../assets/login/backinskies.svg'
import backPlane from '../../../assets/login/login-plan-img.svg';
import plane from '../../../assets/login/Plane.svg'
import cloud1 from '../../../assets/login/cloud1.png'
import cloud2 from '../../../assets/login/cloud2.png'
import cloud3 from '../../../assets/login/cloud3.png'
import cloud4 from '../../../assets/login/cloud4.png'
import './style.css';

const AnimationPlan = () => {
  return (
    <div className="indigo-blue-bar">

      <img className="background-bg" src={backPlane} alt="indigo-images" />
      {/* <img className="cloud-img" src={clouds} alt="cloud" /> */}
      <div className="text-section">
        <div className="first-row">
          <img className="back-text-img" src={back} alt="back" />
        </div>
        <div className="second-row">
          <img className="blue-text-img" src={blue} alt="blue" />
          <img className="plane-img" src={plane} alt="plane" />
        </div>
        <div className="third-row">
          <img className="bringing-text-img" src={bringing} alt="bringing" />
        </div>
      </div>

      <div class="large-cloud">
        <img src={cloud1} alt="cloud1" class="lg-cloud1" />
        <img src={cloud2} alt="cloud1" class="lg-cloud2" />
        <img src={cloud3} alt="cloud1" class="lg-cloud3" />
        <img src={cloud4} alt="cloud1" class="lg-cloud4" />
      </div>
    </div>
  );
};


export default AnimationPlan;
