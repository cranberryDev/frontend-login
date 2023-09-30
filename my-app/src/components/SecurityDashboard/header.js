import React from 'react';
import Navbar from '../Navbar/';
import './style.css'

const Header =() =>{
    return (<>
        <Navbar/>
        <div className="security-container">
            <div className="security-header">
                <h3> Hello, Security Personnel</h3>
                <h4>Let's finish your task for today!</h4>
            </div>
        </div>
        </>
    )
}
export default Header;