import React, { useState } from 'react';
//import api from './../../utils/axios.js';
import {  Form, Input, Select } from 'antd';
import {  DeleteOutlined} from '@ant-design/icons';
import './style.css'

const { Option } = Select;

const AccompanyForm = ({details, index}) => {
    return (<>
        <div className='accompany-form-wrapper'>
            <h6>Accompany Member {index+1}</h6>
                <div className="form-row">
                    <Form.Item rules={[{ required: true }]}>
                        <Input disabled name="name" className='form-field-input' placeholder='Name' value={details.name} />
                    </Form.Item>
                    <Form.Item rules={[{ required: true }]}>
                        <Input disabled maxLength="10" minLength={'10'} name="mobile" className='form-field-input' placeholder='Mobile' value={details.mobile}  />
                    </Form.Item>
                </div>
                <div className="form-row">
                    <Form.Item rules={[{ required: true }]}>
                        <Input disabled type='email' name="email" className='form-field-input' placeholder='Email' value={details.email} />
                    </Form.Item>
                </div>
            
        </div>
    </>);
}


export default AccompanyForm;