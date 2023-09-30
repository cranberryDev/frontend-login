import React from "react";
import { LoadingOutlined } from "@ant-design/icons";
import { Spin } from "antd";
import "./style.css";
const antIcon = (
  <LoadingOutlined
    style={{
      fontSize: 90,
    }}
    spin
  />
);
const LoadingAnimation = () => (
  <div className="loading">
    <Spin indicator={antIcon} />
  </div>
);
export default LoadingAnimation;
