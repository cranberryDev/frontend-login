import React, { useState } from 'react';
//import api from './../../utils/axios.js';
import {  Form, Input, Select } from 'antd';
import {  DeleteOutlined} from '@ant-design/icons';
import './style.css'

const { Option } = Select;

const AccompanyForm = ({details, index, handleAccompanyInput, handleAccompanydelete}) => {
    return (<>
        <div className='accompany-form-wrapper'>
            <h6>Accompany Details <span className="delete-icon" onClick={() => handleAccompanydelete(index)}><DeleteOutlined /></span></h6>
                <div className="form-row">
                    <Form.Item rules={[{ required: true }]}>
                        <Input name="name" className='form-field-input' placeholder='Name' value={details.name} onChange={(e) => handleAccompanyInput('name', e.target.value, index)} />
                    </Form.Item>
                    <Form.Item rules={[{ required: true }]}>
                        <Input maxLength="10" minLength={'10'} name="mobile" className='form-field-input' placeholder='Mobile' value={details.mobile} onChange={(e) => handleAccompanyInput('mobile', e.target.value, index)} />
                    </Form.Item>
                </div>
                <div className="form-row">
                    <Form.Item rules={[{ required: true }]}>
                        <Input type='email' name="email" className='form-field-input' placeholder='Email' value={details.email} onChange={(e) => handleAccompanyInput('email', e.target.value, index)}/>
                    </Form.Item>
                </div>
            
        </div>
    </>);
}


export default AccompanyForm;