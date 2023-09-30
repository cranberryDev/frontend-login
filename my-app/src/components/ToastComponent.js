// ToastComponent.js
import React from 'react';
import { Toast, ToastContainer } from 'react-bootstrap';

const ToastComponent = ({ showToast, setShowToast,toastMessage }) => {
    // console.log(toastMessage);
  return (
    <ToastContainer className="p-3" position="bottom-end">
      <Toast show={showToast} onClose={() => setShowToast(false)}>
        <Toast.Header className="bg-success text-white">
          <strong className="me-auto ">Message</strong>
        </Toast.Header>
        <Toast.Body>
          {toastMessage}
        </Toast.Body>
      </Toast>
    </ToastContainer>
  );
};

export default ToastComponent;
