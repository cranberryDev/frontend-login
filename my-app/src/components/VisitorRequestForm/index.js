import React, { useEffect, useState } from "react";
import bringLogo from "./../../assets/VisitorRequestForm/Logo.svg";
import { useNavigate } from "react-router-dom";
import {
  Button,
  Form,
  Input,
  Select,
  Upload,
  DatePicker,
  notification,
} from "antd";
import { CheckCircleOutlined, UploadOutlined } from "@ant-design/icons";
import BlueAnimationPlane from "./../Common/BluePlaneAnimation";
import "react-phone-number-input/style.css";
import PhoneInput from "react-phone-number-input";
import dayjs from "dayjs";
import callAPI from "../../utils/axios.js";
import DebounceSelect from "../Common/DebounceSelect";
import Resizer from "react-image-file-resizer";
import "./styles.css";
const { Option } = Select;
const VisitorRequestForm = () => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const [file, setFile] = useState("");
  const [empName, setEmpName] = useState("");
  const [empList, setEmpList] = useState(null);
  const [code, setCode] = useState();
  const [startDate, setStartDate] = useState('');

  useEffect(() => {
    if (!sessionStorage.getItem("userType")) {
      navigate("/");
    }
  }, []);
  const onFinish = async (values) => {
    values.idUpload = file;
    console.log(typeof file, "type of");
    const formDataMeeting = new FormData();
    //Body params for insertion into Meeting
    formDataMeeting.append("purpose", values.purpose);
    formDataMeeting.append(
      "startTime",
      dayjs(values.startTime).format("YYYY-MM-DD HH:mm:ss")
    );
    formDataMeeting.append(
      "endTime",
      dayjs(values.endTime).format("YYYY-MM-DD HH:mm:ss")
    );
    // Body param for insertion into Identity
    formDataMeeting.append("idUpload", values.idUpload);

    console.log(formDataMeeting, "formDataMeeting");
    console.log(values, "values");
    const visitorbodyData = {
      VisitorName: values.VisitorName,
      mobileNumber: values.mobileNumber,
      email: values.email,
      location: values.location,
      hostname: empName,
      hostemail: values.employeeEmail,
    };

    try {
      console.log("Inside API Calls");
      let visitorWalkin = await callAPI.post("/api/register", visitorbodyData);
      console.log(visitorWalkin, "visitorWalkin");

      // if (visitorWalkin.status === 201) {
      //   notification.open({
      //     message: "Mobile Number already exists!",

      //     description: "",

      //     icon: <CloseCircleOutlined style={{ color: "red" }} />,
      //   });
      // } else {
        
        if (visitorWalkin.status === 200) {
          const vmid = visitorWalkin.data.vm_request_id;
          console.log(vmid, "vmid");
          // console.log("visitorWalkin",vis)
          //now we call the meeting api to create a new meeting
          let meetingWalkin = await callAPI.post(
            "/meeting/meeting",
            formDataMeeting,
            {
              headers: {
                id: vmid,
              },
            }
          );
          console.log(meetingWalkin, "meetingWalkin");
          if (meetingWalkin.status === 200) {
            notification.open({
              message: "Registered for Meeting Successfully",
              description: "",
              icon: <CheckCircleOutlined style={{ color: "green" }} />,
            });
            
            let approveMail = await callAPI.post("/meeting/mailer", {
              empName: values.employeeName,
              empMail: values.employeeEmail,
              visitorName: values.VisitorName,
              id: vmid,
              startTime: values.startTime,
              endTime: values.endTime,
              location: values.location,
            });

            if (approveMail.status === 200) {
              notification.open({
                message: "Email Sent Successfully",
                description: "",
                icon: <CheckCircleOutlined style={{ color: "green" }} />,
              });
              form.resetFields();
              navigate("/security");
              console.log(
                `Mail sent to ${values.employeeName} regarding the meeting details`
              );
            } else {
              console.log(
                `Error in sending mail to ${values.employeeName} regarding the meeting details`
              );
            }
          } else {
            console.log(
              `Error in inserting Meeting Details through Meeting API`
            );
          }
        } else {
          console.log(
            `Error in inserting Visitor Details through register API`
          );
        }
      
    } catch (err) {
      console.log(`Error in hitting API ${err}`);
    }
  };

  const resizeFile = (file) =>
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      300,
      300,
      "JPEG",
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      "file"
    );
  });

  const onUploadChange = ({ file }) => {
    //console.log(file, file.name, "newfile");
    const image = resizeFile(file).then(res => setFile(file))

    console.log(image,'image');
    //setFile(image)
  };
  // const handleCam = () => {
  //   //debugger;
  //   setCam(!cam)
  // }
  // const handleConfirm = (value) => {
  //   const formDetails = form.getFieldsValue();
  //   // value=value.slice(23)
  //   const binaryString = atob(value.split(',')[1]);
  //   const blob = new Blob([binaryString], { type: 'image/jpeg' });
  //   console.log(blob,'blob');
  //   formDetails.idUpload = blob;
  //   form.setFieldsValue(formDetails)
  //   setFile(blob);
  //   // console.log(JSON.stringify(value))
  //   console.log(value, 'value')
  // }
  const handleEmployeeNameChange = (value) => {
    const information = form.getFieldsValue();
    const employeeFind = empList.find(item => item.mail === value[0]);
    setEmpName(employeeFind?.displayName);
    information.employeeEmail = value[0];
    form.setFieldsValue(information);
    console.log(value);
  };

  const fetchUserList = async (username) => {
    console.log("fetching user", username);
    try {
      let apiresult = await callAPI.get("/api/token");
      console.log(apiresult.data);
      const token = apiresult.data;
      const graphEndpoint = `https://graph.microsoft.com/v1.0/users?$filter=startswith(displayName,'${username}')`;
      const response = await fetch(graphEndpoint, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        console.log(data,'data');
        setEmpList(data?.value)
        return data?.value.map((item) => ({
          label: item.displayName,
          value: item.mail,
        }));
      }
    } catch (error) {
      // Handle token acquisition error
      console.log(error);
    }
    // return fetch('https://randomuser.me/api/?results=5')
    // .then((response) => response.json())
    // .then((body) =>
    //   body.results.map((user) => ({
    //     label: `${user.name.first} ${user.name.last}`,
    //     value: user.login.username,
    //   })),
    // );
  };
  const filterOption = (input, option) =>
    (option?.label ?? "").toLowerCase().includes(input.toLowerCase());

  const getHandleDate = () => {
    const information = form.getFieldsValue();
    console.log(information.startTime, 'information.startTime')
    setStartDate(information.startTime)
  }

  return (
    <>
      <div data-testid="visitor-component" className="meeting-form-wrapper">
        <div className="meeting-form-banner">
          <BlueAnimationPlane />
        </div>
        <div data-testid="visitor-form-main" className="request-form">
          <div className="request-form-content">
            <h4>IndiGo Walk-in Visitor Form</h4>
            <Form form={form} name="control-hooks" onFinish={onFinish}>
              <h6>Visitor information</h6>
              <div className="form-row">
                <Form.Item name="VisitorName" rules={[{ required: true }]}>
                  <Input
                    className="form-field-input"
                    placeholder="Visitor name"
                  />
                </Form.Item>
                <Form.Item name="purpose" rules={[{ required: true }]}>
                  <Select
                    //className='dropdownPurpose'
                    className="form-feild-select"
                    placeholder="Purpose of visit"
                    //onChange={onGenderChange}
                    allowClear
                  >
                    <Option value="business meeting">Business Meeting</Option>
                    <Option value="Orientation">
                      Orientation
                    </Option>
                    <Option value="Induction">Induction</Option>
                    <Option value="Interview">Interview</Option>
                    <Option value="other">Others</Option>
                  </Select>
                </Form.Item>
              </div>
              <div className="form-row">
                <div className="phone-input">
                  <Form.Item
                    name="mobileNumber"
                    rules={[
                      {
                        required: true,
                        validator: (_, value) => {
                          if (/^(\+\d{1,3}[- ]?)?\d{11}$/.test(value)) {
                            return Promise.resolve();
                          } else {
                            return Promise.reject("Enter valid mobile number");
                          }
                        },
                      },
                    ]}
                  >
                    <PhoneInput
                      className="form-field-input"
                      maxLength={11}
                      minLength={11}
                      placeholder="Mobile Number"
                      defaultCountry="IN"
                      value={code}
                      onChange={setCode}
                    />
                  </Form.Item>
                </div>
                <Form.Item name="email" rules={[{ required: true }]}>
                  <Input
                    className="form-field-input"
                    type="email"
                    placeholder="Email"
                  />
                </Form.Item>
              </div>
              <div className="form-row">
                <Form.Item name="idUpload" className="upload">
                  <Input
                    className="form-field-input"
                    value={file?.name}
                    placeholder="ID Proof"
                    disabled
                  />
                  <Upload
                    beforeUpload={() => {
                      return false;
                    }}
                    className="upload-btn"
                    onChange={onUploadChange}
                  >
                    <Button icon={<UploadOutlined />}>Choose File</Button>
                  </Upload>
                  {/* <Button className='upload-btn' onClick={() => handleCam()} icon={<CameraOutlined />}>Open Camera</Button>
                {cam && <Camera
                  handleCam={handleCam}
                  handleConfirm={handleConfirm}
                />}  */}
                </Form.Item>
              </div>
              <h6>Indigo Employee Information</h6>
              <div className="form-row">
                <Form.Item name="employeeName1">
                  {/* <Input className="form-field-input" placeholder='Whom to meet'></Input> */}
                  <DebounceSelect
                    mode="multiple"
                    //value={value}
                    placeholder="Select users"
                    fetchOptions={fetchUserList}
                    onChange={handleEmployeeNameChange}
                    style={{
                      width: "100%",
                    }}
                  />
                  {/* <Select
                  className='form-feild-select'
                  showSearch
                  placeholder="Employee Name"
                  optionFilterProp="children"
                  onChange={handleEmployeeNameChange}
                  //onSearch={onSearch}
                  filterOption={filterOption}
                  options={employeeOption}
                /> */}
                </Form.Item>
                <Form.Item name="employeeEmail">
                  <Input
                    className="form-field-input"
                    placeholder="Employee email"
                    disabled
                  />
                </Form.Item>
              </div>
              <h6>Meeting details</h6>
              <div className="form-row">
                <Form.Item name="startTime">
                  <DatePicker
                    className="form-field-input"
                    showTime
                    placeholder="Meeting Start time"
                    disabledDate={(currentDate) => {
                      return currentDate && dayjs(currentDate).format("YYYY-MM-DD HH:mm:ss") < dayjs(new Date()).format("YYYY-MM-DD HH:mm:ss");
                      }}
                    onChange={() => getHandleDate()}
                  />
                </Form.Item>
                <Form.Item name="endTime">
                  <DatePicker
                  disabled={!startDate}
                    disabledDate={(currentDate) => {
                      return currentDate && dayjs(currentDate).format("YYYY-MM-DD HH:mm:ss") < dayjs(startDate - 5000).format("YYYY-MM-DD HH:mm:ss");
                      }}
                    className="form-field-input"
                    showTime
                    placeholder="Meeting End time"
                  />
                </Form.Item>
              </div>
              <div className="form-row">
                <Form.Item name="location" rules={[{ required: true }]}>
                  <Select
                    //className='dropdownPurpose'
                    className="form-feild-select"
                    placeholder="Meeting Location"
                    //onChange={onGenderChange}
                    allowClear
                  >
                    <Option value="GBP Tower A">GBP Tower A</Option>
                    <Option value="EMAAR 1">EMAAR 1</Option>
                  </Select>
                </Form.Item>
              </div>
              {/* <div className="form-row">
              <Form.Item name="location">
                <Input className="form-field-input" placeholder='Meeting location'></Input>
              </Form.Item>
            </div> */}
              <div className="form-row meeting-btn">
                <Form.Item>
                  <Button className="secondary-btn" htmlType="reset">
                    Clear
                  </Button>
                </Form.Item>
                <Form.Item>
                  <Button
                    className="primary-btn"
                    type="primary"
                    htmlType="submit"
                    data-testid="on-finish"
                  >
                    Submit Details
                  </Button>
                </Form.Item>
              </div>
            </Form>
            <div className="meeting-footer">
              <img src={bringLogo} alt="logo" />
              <span>©Copyright 2023 IndiGo. All rights reserved.</span>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};
export default VisitorRequestForm;
