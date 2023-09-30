import React, { useEffect, useState } from 'react';
import { Checkbox } from 'antd';
import callAPI from '../../utils/axios.js';
import { Button, Form, Input, Select, notification, Upload, DatePicker } from 'antd';
import {
  CheckCircleOutlined
} from '@ant-design/icons';
import BlueAnimationPlane from './../Common/BluePlaneAnimation'
import { UploadOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import AccompanyForm from './Accompany';
import { useParams } from 'react-router-dom';
import LoadingAnimation from './../Common/LoadingAnimation/LoadingAnimation.jsx';
import dayjs from 'dayjs';
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'
import './style.css'

const { Option } = Select;

const MeetingForm = () => {
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const [accompanyDetails, setAccompanyDetails] = useState([]);
  const [file, setFile] = useState('');
  const [edit, setEdit] = useState(false);
  const [isLoader, setIsLoader] = useState(false);
  const [code, setCode] = useState()

  let { id } = useParams();
  console.log(id, 'id');

  useEffect(() => {
    document.body.classList.add('meeting-page');
    return () => document.body.classList.remove('meeting-page');
  }, [])


  useEffect(() => {
    if (id) {
      getMeetingDetails();
    }
    else {
      console.log('no id');
    }
  }, [id]);



  const getMeetingDetails = async () => {
    try {
      setEdit(true)
      setIsLoader(true);

      console.log(id, 'id');
      //Employee Data
      let meetingData = await callAPI.get(`/meeting/formDataEmployee`, {
        headers: {
          id: id
        }
      })
      const data = meetingData.data['Form Data'][0];

      //Visitor Data
      let visitorData = await callAPI.get(`/meeting/formDataVisitor`, {
        headers: {
          vid: data.visitor_id
        }
      })
      const v_data = visitorData.data['Form Data'][0];
      console.log(v_data, 'v_data');
      let phoneNumber = v_data.visitor_mobile
      setCode(phoneNumber.slice(0, 3))
      phoneNumber= phoneNumber.slice(3)
      console.log(phoneNumber.slice(3) ,'neNumber');


      console.log(data, 'meetingData');
      form.setFieldsValue({
        employee_name: data.host_employee,
        employee_email: data.employee_email,
        location: data.office_loc,
        VisitorName: v_data.visitor_mobile,
        mobileNumber: phoneNumber,
        email: v_data.visitor_email
      })
      setIsLoader(false);
    }
    catch (err) {
      setIsLoader(false);
      console.log(`Error during Fetching Meeting Details: ${err}`);
    }
  }

  // if (!sessionStorage.getItem('userType')) {
  //   navigate('/')
  // }
  const onFinish = async (values) => {
    console.log(accompanyDetails, 'accompany');
    values.idUpload = file;
    console.log(values.idUpload, 'values.idUpload');
    values.startTime = new Date(values.startTime);
    values.endTime = new Date(values.endTime);
    console.log(values, 'values');
    console.log(form.getFieldsValue(), 'form.getFieldsValue()')
    const formData = new FormData();
    formData.append('VisitorName', values.VisitorName);
    formData.append('purpose', values.purpose);
    formData.append('mobileNumber', values.mobileNumber);
    formData.append('email', values.email);
    formData.append('id', values.id);
    formData.append('idNumber', values.idNumber);
    formData.append('idUpload', values.idUpload);
    formData.append('employee_name', values.employee_name);
    formData.append('employee_email', values.employee_email);
    formData.append('startTime', dayjs(values.startTime).format("YYYY-MM-DD HH:mm:ss"));
    formData.append('endTime', dayjs(values.endTime).format("YYYY-MM-DD HH:mm:ss"));
    formData.append('location', values.location);
    formData.append('accompany', JSON.stringify(accompanyDetails));

    console.log(formData.VisitorName, 'formData');

    try {
      let meetingData = await callAPI.post('/meeting/meeting', formData, {
        headers: {
          id: id
        }
      })
      console.log(meetingData, 'apiresult');
      if (meetingData.status === 200) {
        console.log(values.employee_email)
        notification.open({
          message: "Registered for Meeting Successfully",
          description: '',
          icon: <CheckCircleOutlined style={{ color: 'green' }} />,
        })
        let mailerData = await callAPI.post('/meeting/mailer', {
          empName: values.employee_name,
          empMail: values.employee_email,
          visitorName: values.VisitorName,
          id: id,
          startTime: values.startTime,
          endTime: values.endTime,
          location: values.location

        }
        )
        if (mailerData.status === 200) {
          console.log('email sent');
          notification.open({
            message: "Email Sent Successfully",
            description: '',
            icon: <CheckCircleOutlined style={{ color: 'green' }} />,
          });
          form.resetFields();
          navigate('/thankyou')
          setFile('');
          setAccompanyDetails([])
        }
        console.log(mailerData, 'mailerData');
      }
      else {
        console.log('cannot send email');
      }

    }
    catch (err) {
      console.log(`Error during Mailer API Call ${err}`);
    }
  };

  const onUploadChange = ({ file }) => {
    console.log(file, file.name, 'newfile');
    setFile(file);
  };

  const handleAccompany = () => {
    const temp = [...accompanyDetails];
    const data = {
      name: '',
      mobile: '',
      email: '',
    }
    temp.push(data);
    setAccompanyDetails(temp)
  }

  const handleAccompanyInput = (name, value, index) => {
    const temp = [...accompanyDetails];
    temp[index][name] = value;
    setAccompanyDetails(temp);
  }

  const handleAccompanydelete = (index) => {
    const temp = [...accompanyDetails];
    temp.splice(index, 1);
    setAccompanyDetails(temp);

  }


  if (isLoader) return <LoadingAnimation />;

  return (<>

    <div className='meeting-form-wrapper'>
      <div className='meeting-form-banner'>
        {/* <img src={bringImg} alt='Bring you back in the skies' /> */}
        <BlueAnimationPlane />
      </div>
      <div className='request-form'>
        <div className="request-form-content">
          <h4>IndiGo Meeting Form</h4>
          <Form
            form={form}
            name="control-hooks"
            onFinish={onFinish}
          >
            <h6>Visitor information</h6>
            <div className="form-row">
              <Form.Item name="VisitorName" rules={[{ required: true }]}>
                <Input className='form-field-input' placeholder='Visitor name' disabled={edit} />
              </Form.Item>
              <Form.Item name="purpose" rules={[{ required: true }]}>
                <Select
                  //className='dropdownPurpose'
                  className='form-feild-select'
                  placeholder="Purpose of visit"
                  //onChange={onGenderChange}
                  allowClear
                >
                  <Option value="Official Meeting">Official Meeting</Option>
                  <Option value="Casual Meeting">Casual Meeting</Option>
                  <Option value="New Joinees">New Joinees</Option>
                  <Option value="Orientation/Induction">Orientation/Induction</Option>
                  <Option value="Other">Other</Option>
                </Select>
              </Form.Item>
            </div>
            <div className="form-row">
            <div className='phone-input'>                
                <Form.Item name="mobileNumber" rules={[{
                  required: true,                 
                  validator: (_, value) => {
                    if (/^(\+\d{1,3}[- ]?)?\d{12  }$/.test(value)) {
                      return Promise.resolve();
                    }
                     else {
                      return Promise.reject('Enter valid mobile number');
                    }
                  }
                }]}>
                  <PhoneInput
                    className='form-field-input'
                    maxLength={13} minLength={13}
                    placeholder="Mobile Number"
                    value={code}
                    onChange={setCode} />
                </Form.Item>
              </div>

              <Form.Item name="email" rules={[{ required: true }]} >
                <Input className='form-field-input' type='email' disabled={edit} placeholder='Email' />
              </Form.Item>
            </div>
            <h6>Visitor proof document</h6>
            <div className="form-row">
              <Form.Item name="id" rules={[{ required: true }]}>
                <Select placeholder='Visitor Id'
                  className='form-feild-select'
                  allowClear>
                  <Option value="aadhar">Aadhar</Option>
                  <Option value="officeId">Work ID</Option>
                  <Option value="pan">Pan</Option>
                  <Option value="passport">Passport</Option>
                </Select>
              </Form.Item>
              <Form.Item name="idNumber" rules={[{ required: true }]}>
                <Input className="form-field-input" placeholder='ID number' />
              </Form.Item>
            </div>
            <div className="form-row">
              <Form.Item name="idUpload" className='upload'>
                <Input className="form-field-input" value={file?.name} placeholder='ID Proof' disabled />
                <Upload
                  beforeUpload={() => {
                    return false;
                  }}
                  className='upload-btn' onChange={onUploadChange}>
                  <Button icon={<UploadOutlined />}>Choose File</Button>
                </Upload>
              </Form.Item>
            </div>
            <h6>Indigo Employee Information</h6>
            <div className="form-row">
              <Form.Item name="employee_name">
                <Input className="form-field-input" placeholder='Employee name' disabled={edit}></Input>
              </Form.Item>
              <Form.Item name="employee_email">
                <Input className='form-field-input' placeholder='Employee email' disabled={edit}></Input>
              </Form.Item>
            </div>
            <h6>Meeting details</h6>
            <div className="form-row">
              <Form.Item name="startTime">
                <DatePicker className='form-field-input' showTime placeholder='Meeting Starts' />
              </Form.Item>
              <Form.Item name="endTime">
                <DatePicker className='form-field-input' showTime placeholder='Meeting Ends' />
              </Form.Item>
            </div>
            <div className="form-row">
              <Form.Item name="location">
                <Input className="form-field-input" placeholder='Meeting location' disabled={edit}></Input>
              </Form.Item>

            </div>
            <div className='company-details'>
              Accompany
              <Button className='primary-btn' type="primary" onClick={handleAccompany}>
                Add
              </Button>
            </div>
            {(accompanyDetails && accompanyDetails.length) ? accompanyDetails.map((item, index) => <AccompanyForm details={item} index={index} handleAccompanyInput={handleAccompanyInput} handleAccompanydelete={handleAccompanydelete} />) : ''}


            <Form.Item name="tc" valuePropName="checked">
              <Checkbox onChange={(e) => setChecked(e.target.checked)}> By clicking on this you agree to the terms of IndiGo's <a href="https://www.goindigo.in/information/privacy.html" target='_blank' >Privacy Policy</a>.</Checkbox>
            </Form.Item>
            <div className="form-row meeting-btn">
              <Form.Item>
                <Button className='secondary-btn' htmlType="reset">
                  Clear
                </Button>
              </Form.Item>
              <Form.Item name="submit-btn">
                <Button className='primary-btn' type="primary" disabled={!checked} htmlType="submit">
                  Submit Details
                </Button>
              </Form.Item>
            </div>
          </Form>
          <div className="meeting-footer">
            {/* <img src={bringLogo} alt="logo" /> */}
            <span>©Copyright 2023 IndiGo. All rights reserved.</span>
          </div>
        </div>
      </div>
    </div>
  </>);
}


export default MeetingForm;
