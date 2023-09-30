import React from "react";
import Logo from "../../assets/login/Logo.png";
import "./loginComponent.css";
import { Button, Form, Input } from "antd";
import { useNavigate } from 'react-router-dom';
import { userList } from './../../helper';
import { notification } from 'antd';
import { PlaneLogo } from './svg';
import AnimationPlan from '../Common/PlaneAnimation';
// import callAPI from './../../utils/axios.js';
// import clouds from '../../assets/login/Clouds.svg';



import {
  ExclamationCircleFilled
} from '@ant-design/icons';
//import { useMsal } from '@azure/msal-react';

//import { loginRequest, msalConfig } from '../../msalconfig';
import { useState } from "react";
import { useEffect } from "react";
// import axiosAPI from "../../utils/axios";
// import axios from "axios";
// import axiosAPI from "../../utils/axios";




const Login = () => {
  const navigate = useNavigate();
  // const [ssologin, setssologin] = useState(false);
  const [form] = Form.useForm();
  const onFinish = (values) => {
    const { username, password } = values;
    const userFind = userList.find((user) => user.user === username);
    if (userFind) {
      if (username === userFind.user && password === userFind.password) {
        sessionStorage.setItem("userType", JSON.stringify(userFind.type));
        navigate("/visitor");
      }
    } else {
      notification.open({
        message: 'Invalid Credentials',
        description: '',
        icon: <ExclamationCircleFilled style={{ color: '#FF0000' }} />,

        // onClick: () => {
        //   console.log('Notification Clicked!');
        // },
      });
    }


    console.log("Success:", values);
  };
  const onFinishFailed = (errorInfo) => {
    console.log("Failed:", errorInfo);

  };

 // const { instance } = useMsal();



  // const onSSOLogin = () => {
  //   console.log("call api SSO");

  //   instance.loginPopup(loginRequest).then(
  //     res => {
  //       console.log(res)
  //       //console.log(res.account.name)
  //       sessionStorage.setItem('hostname', res.account.name)
  //       //console.log(res.account.username)
  //       sessionStorage.setItem("hostemail", res.account.username)
  //       navigate("/botform");

  //     })
  // }



  useEffect(() => {
    console.log(JSON.parse(sessionStorage.getItem("userType")))
    document.body.classList.add('login-page');
    return () => document.body.classList.remove('login-page');
  }, []);

  return (
    <div  data-testid="login-component" className="login_container">
      <div className="login_image_section">
        <AnimationPlan />
      </div>
      <div className="login_form">
        <div className="login_form_content">
          <div className="logo">
            <img src={Logo} className="login_form_logo" alt="Indigo Logo" />
          </div>
          <div className="title-section">

            { JSON.parse(sessionStorage.getItem("userType")) == "admin" || JSON.parse(sessionStorage.getItem("userType")) == "user" ? <h2 className="title">Nice to see you again</h2> : (
              <h2 className="title">Welcome to VMS</h2>
            )}

            <div className="subtitle">Enter your login details to continue</div>
          </div>
          <Form
            form={form}
            name="login"
            onFinish={onFinish}
            onFinishFailed={onFinishFailed}
          >
            <Form.Item
              name="username"
              rules={[
                {
                  required: true,
                  message: "Please input your username!",
                },
              ]}
            >
              <Input className="form-field-input" placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="password"
              rules={[
                {
                  required: true,
                  message: "Please input your password!",
                },
              ]}
            >
              <Input.Password
                className="form-field-input"
                placeholder="Password"
              />
            </Form.Item>
            {/* This is the code for Remember Me switch and Forgot Password, currently we don't have this functionality but the code is ready to use. */}
            {/* <Form.Item>
              <div className="login_form_middle_container">
                <span className="switchbtn">
                  <Switch
                    colorPrimary="#001B94"
                    defaultChecked
                    onChange={handleSwitchChange}
                  />
                  <span>Remember me</span>
                </span>
                <a href="#">Forgot password?</a>
              </div>
            </Form.Item> */}
            <Form.Item>
              <Button data-testid="on-finish" size="large" htmlType="submit" className="primary-btn" >
                Login
              </Button>
            </Form.Item>
            {/* <Form.Item>

              <Button size="large" className="primary-btn" style={{ backgroundColor: "green" }} onClick={onSSOLogin}>

                Sign in with SSO
              </Button>
            </Form.Item> */}
          </Form>
          <div className="login_form_footer">
            <PlaneLogo />
            <span className="login_form_footer_copyright">
              Ⓒ Copyright 2023 IndiGo. All rights reserved.
              <br/>VMS v2.0
            </span>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Login;
