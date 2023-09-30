import React, { useState } from 'react';
import bringImg from './../../assets/meetingForm/indigo.svg';
import bringLogo from './../../assets/meetingForm/logo1.svg';
import callAPI from './../../utils/axios.js';
import { CheckCircleOutlined, CloseCircleOutlined } from '@ant-design/icons';
import { Button, Form, Input, Select, Space, notification } from 'antd';
import { useNavigate } from 'react-router-dom';
import BlueAnimationPlane from './../Common/BluePlaneAnimation';
import './style.css'

const { Option } = Select;

const EmployeeForm = () => {
    const [form] = Form.useForm();
    const [checked, setChecked] = useState(false);
    const navigate = useNavigate();

    const onFinish = async (values) => {
        console.log(values)
        const hostemail = sessionStorage.getItem('hostemail')
        const hostname = sessionStorage.getItem('hostname')
        console.log(hostemail)
        console.log(hostname)
        try {
            let apiresult = await callAPI.post('/api/register', {
                VisitorName: values.VisitorName,
                hostemail: hostemail,
                hostname: hostname,
                email: values.email,
                mobileNumber: values.mobileNumber,
                location: values.location
            })

            if (apiresult.status === 200) {
                 //TOAST
                notification.open({
                    message: "Visitor Registered Successfully",
                    description: '',
                    icon: <CheckCircleOutlined style={{ color: 'green' }} />,
                })
                console.log("inside register")
                const vm_id = apiresult.data.vm_request_id
                console.log(vm_id)
             
                let apiMail = await callAPI.post('/api/registermail',{
                    VisitorName: values.VisitorName,
                    hostemail: hostemail,
                    hostname:hostname,
                    email: values.email,
                    vm_request_id: vm_id
                })
               
                if(apiMail.status === 200){
                    console.log("Mail sent successfully!")
                    navigate('/thankyou')
                    
                }

             }else{
                if(apiresult.status===201){
                    console.log("inside mobile")
                    notification.open({
                        message: "Mobile Number already exists!",
                        description: '',
                        icon: <CloseCircleOutlined style={{ color: 'red' }} />,
                    })
                }
            }
            console.log(apiresult, 'apiresult');
        } catch (err) {
            console.log("Error", err)
        }


    };

    return (
        <>
            <div className='employee-form-wrapper'>
                <div className='employee-form-banner'>
                <BlueAnimationPlane />
                </div>
                <div className='request-form'>
                    <div className='request-form-content'>
                        <h4>Raise meeting request</h4>
                        <span>All fields mentioned are mandatory</span>
                        <Form
                            form={form}
                            name="control-hooks"
                            onFinish={onFinish}
                        >
                            <div className="form-row">
                                <Form.Item name="VisitorName" rules={[{ required: true }]}>
                                    <Input className='form-field-input' placeholder='Visitor name' />
                                </Form.Item>

                            </div>

                            <div className="form-row">
                                <Form.Item name="mobileNumber" rules={[{ required: true }]}>
                                    <Space.Compact>
                                        <Input className='form-field-input padding-sm' style={{ width: '20%' }} defaultValue="+91" />
                                        <Input type="tel" maxLength={10} minLength={10} className='form-field-input' style={{ width: '80%' }} placeholder='Mobile Number' />
                                    </Space.Compact>
                                </Form.Item>

                            </div>

                            <div className="form-row">
                                <Form.Item name="email" rules={[{ required: true }]}>
                                    <Input className='form-field-input' type='email' placeholder='Email' />
                                </Form.Item>
                            </div>

                            <div className='form-row'>
                                <Form.Item name="location" rules={[{ required: true }]}>
                                    <Select
                                        //className='dropdownPurpose'
                                        className='form-feild-select'
                                        placeholder="Meeting Location"
                                        //onChange={onGenderChange}
                                        allowClear
                                    >
                                        <Option value="iFly">iFly</Option>
                                        <Option value="GBP Tower A">GBP Tower A</Option>
                                        <Option value="GBP Tower C">GBP Tower C</Option>
                                        <Option value="EMAAR 1">EMAAR 1</Option>
                                        <Option value="EMAAR 2">EMAAR 2</Option>
                                        <Option value="Other">Other</Option>
                                    </Select>
                                </Form.Item>
                            </div>
                            <div className="form-row employee-btn">
                                <Form.Item n>
                                    <Button className='secondary-btn' htmlType="reset">
                                        Clear
                                    </Button>
                                </Form.Item>
                                <Form.Item name="submit-btn">
                                    <Button className='primary-btn' type="primary" htmlType="submit" >
                                        Submit Details
                                    </Button>
                                </Form.Item>
                            </div>
                        </Form>
                        <div className="employee-footer">
                            <span>©Copyright 2023 IndiGo. All rights reserved.</span>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
};

export default EmployeeForm;
