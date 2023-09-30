import './App.css';
import { Routes, Route} from "react-router-dom";
import Navbar from './components/Navbar';
import VisitorRequestForm from './components/VisitorRequestForm';
import Login from './components/Login/LoginComponent';

import Meeting from './components/MeetingForm'
import { useState } from 'react';
import SecurityDashboard from './components/SecurityDashboard';
import EmployeeForm from './components/EmployeeForm/EmployeeForm';
import ApprovalForm from './components/ApprovalForm/ApprovalForm';
import ThankYou from './components/Common/Thankyou'


function App() {
  
  return (
  <div className='main-page'>
  {/* <Navbar/> */}
  <Routes>
    <Route path="/" element={<Login/>}/>
    <Route path="/visitor" element={<VisitorRequestForm/>}/>
    <Route path="/meeting/:id" element={<Meeting/>}/>
    <Route path="/security" element={<SecurityDashboard/>}/>
    <Route path="/botform" element={<EmployeeForm/>}/>
    <Route path="/thankyou" element={<ThankYou/>}/>
    <Route path="/approval/:id" element={<ApprovalForm/>}/>
   
  </Routes>
  </div>
  );
}

export default App;
