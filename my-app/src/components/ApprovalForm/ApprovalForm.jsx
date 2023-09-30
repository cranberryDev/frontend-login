import React, { useState } from "react";
import BlueAnimationPlane from "./../Common/BluePlaneAnimation";
import callAPI from "./../../utils/axios.js";
import { Button, Form, Input, Select, Space } from "antd";
import { useParams } from "react-router-dom";
import "./style.css";
import { useEffect } from "react";
import axiosAPI from "./../../utils/axios.js";
import MeetingResult from "../Common/MeetingResult";
import AccompanyForm from "./Accompany";
import LoadingAnimation from "../Common/LoadingAnimation/LoadingAnimation";
import 'react-phone-number-input/style.css'
import PhoneInput from 'react-phone-number-input'

const { Option } = Select;

const ApprovalForm = () => {
  const [form] = Form.useForm();
  const [checked, setChecked] = useState(false);
  const { id } = useParams();
  console.log(id, "id");
  const [meetingData, setMeetingData] = useState([]);
  const [status, setStatus] = useState("");
  const [isLoader, setIsLoader] = useState(false);
  const [code, setCode] = useState()

  const getInitialAPI = () => {
    try {
      setIsLoader(true);
      axiosAPI
        .get(`security-api/approval_search_bar?q=${id}`)
        .then((res) => {
          setMeetingData(res.data.data);
          setStatus(res.data.data[0].status);
          const meetingDataFill = res.data.data;
          console.log(meetingDataFill, "meeting data");
          form.setFieldsValue({
            visitorName: meetingDataFill[0].visitor.visitor_name,
            mobileNumber: meetingDataFill[0].visitor.visitor_mobile,
            email: meetingDataFill[0].visitor.visitor_email,
            purposeOfVisit: meetingDataFill[0].purpose_of_visit,
            meetingTime:
              meetingDataFill[0].start_time + " " + meetingDataFill[0].end_time,
          });
          setIsLoader(false);
        })
        .catch((err) => {
          setIsLoader(false);
          console.log(err);
        });
    } catch (error) {
      setIsLoader(false);
      console.log(error);
    }
  };

  const handleAction = async (value) => {
    try {
      let meetingCall = await callAPI.put("/security-api/security_approval", {
        vm_request_id: id,
        status: value,
      });

      setStatus(value);
      if (value === "approved" && meetingCall.status === 200) {
        let mailerData = await callAPI.post("/api/approvalmail", {
          id,
          visitorName: meetingData[0].visitor_name,
          visitorEmail: meetingData[0].visitor_email,
        });
        console.log("Approved Mail Sent", mailerData);
      } else if (value === "rejected" && meetingCall.status === 200) {
        let mailerData = await callAPI.post("/api/rejectedmail", {
          id,
          visitorName: meetingData[0].visitor_name,
          visitorEmail: meetingData[0].visitor_email,
        });
        console.log("Rejected Mail Sent", mailerData);
      }
      //console.log(meetingData, "apiresult");
    } catch (error) {
      console.log(error);
    }

    // mailer code
    // try{
    //   if (meetingData.status === 200) {
    //     let mailerData = await callAPI.get('/meeting/test')
    //     if(mailerData.status === 200){
    //       console.log('email sent');
    //     }
    //     console.log(mailerData, 'mailerData');
    //   }
    //   else{
    //     console.log('cannot send email');
    //   }

    // }
    // catch(err){
    //   console.log(`Error during Mailer API Call ${err}`);
    // }
  };

  //now we fetch the details of this id
  useEffect(() => {
    getInitialAPI();
  }, []);

  if (isLoader) return <LoadingAnimation />;

  // status===undefined ? () :
  return (
    <>
      <div data-testid="approval-component" className="approval-form meeting-form-wrapper">
        <div className="meeting-form-banner">
          {/* <img src={bringImg} alt='Bring you back in the skies' /> */}
          <BlueAnimationPlane />
        </div>

        <div className="request-form">
          <div className="request-form-content">
            {status === "pending" ? (
              <div>
                <h4 className="request_header">Meeting Request for you!</h4>
                <Form
                  form={form}
                  intialValues={{ VisitorName: meetingData[0].visitor_name }}
                >
                  <h6>Visitor information</h6>
                  <div className="form-row">
                    <Form.Item name="visitorName">
                      <Input
                        className="form-field-input"
                        placeholder="Visitor name"
                        //defaultValue={meetingData[0].visitor_name}
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <div className="form-row">
                    <div className='phone-input'>
                      <Form.Item name="mobileNumber" rules={[{
                        required: true,
                        validator: (_, value) => {
                          if (/^(\+\d{1,3}[- ]?)?\d{11}$/.test(value)) {
                            return Promise.resolve();
                          }
                          else {
                            return Promise.reject('Enter valid mobile number');
                          }
                        }
                      }]}>
                        <PhoneInput
                          className='form-field-input'
                          maxLength={11} minLength={11}
                          placeholder="Mobile Number"
                          value={code}
                          onChange={setCode} />

                      </Form.Item>
                    </div>
                  </div>
                  <div className="form-row">
                    <Form.Item name="email">
                      <Input
                        className="form-field-input"
                        type="email"
                        placeholder="Email"
                        //defaultValue={meetingData[0].visitor_email}
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <div className="form-row">
                    <Form.Item name="purposeOfVisit">
                      <Input
                        className="form-field-input"
                        type="text"
                        placeholder="purpose-of-visit"
                        //defaultValue={meetingData[0].purpose_of_visit}
                        disabled
                      />
                    </Form.Item>
                  </div>
                  <div className="form-row">
                    <Form.Item name="meetingTime">
                      <Input
                        className="form-field-input"
                        type="text"
                        placeholder="Meeting Starts"
                        // //defaultValue={
                        //   meetingData[0].start_time +
                        //   "      " +
                        //   meetingData[0].end_time
                        // }
                        disabled
                      />
                    </Form.Item>
                  </div>
                  {/* <div className="company-details">Accompany Details</div> */}
                  <div>
                    {meetingData[0]?.accompany && JSON.parse(meetingData[0].accompany)
                      ? JSON.parse(meetingData[0].accompany).map(
                        (item, index) => (
                          <AccompanyForm details={item} index={index} />
                        )
                      )
                      : ""}
                  </div>
                  <div className="form-row meeting-btn">
                    <Form.Item>
                      <Button
                        className="reject-btn"
                        onClick={() => handleAction("rejected")}
                        data-testid="on-change"
                      >
                        Reject
                      </Button>
                    </Form.Item>
                    <Form.Item>
                      <Button
                        className="success-btn"
                        onClick={() => handleAction("approved")}
                        data-testid="on-change"
                      >
                        Approve
                      </Button>
                    </Form.Item>
                  </div>
                </Form>
                <div className="meeting-footer">
                  {/* <img src={bringLogo} alt="logo" /> */}
                  <span>©Copyright 2023 IndiGo. All rights reserved.</span>
                </div>
              </div>
            ) : status === "approved" || status === "rejected" ? (
              <div>
                <h4 className="request_header">Meeting Request for you!</h4>
                <MeetingResult
                  status={status}
                  heading={status === "approved" ? 'Thanks for your approval!' : "Rejection request submitted"}
                  desc={status == "approved" ? "Visitor will approach you at the scheduled meeting time" : "We will notify the visitor about the rejection"}
                />
                <div className="meeting-footer">
                  {/* <img src={bringLogo} alt="logo" /> */}
                  <span>©Copyright 2023 IndiGo. All rights reserved.</span>
                </div>
              </div>

            ) : (
              <h4>Meeting Not Found</h4>
            )}

          </div>
        </div>

        {/* <div className="request-form">
            <div className="request-form-content">
              <h1>Meeting not found</h1>
            </div>
          </div> */}
      </div>
    </>
  );
};

export default ApprovalForm;
