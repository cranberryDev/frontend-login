import { Avatar, Button } from 'antd';
import './security_svg.css'

const Security_Column = () => {
    return ( 
    <div className='tabular-box'>
        <div className='tabular-box-header'> 
            <Avatar size={48} style={{ backgroundColor: '#E8F0FB', color: '#141522' }}>AS</Avatar>
            <div className='tabular-box-header-text'>
                <h5>Visitor name</h5>
                <h3>Ashok Singh</h3>
            </div>
        </div> 
        <div className="tabular-box-header2">
            <div className='tabular-box-header-text'>
                <h5>Visitor contact no</h5>
                <h3>+91 9844242422</h3>
            </div>
        </div>
        <div className="tabular-box-header1">
            <div className='tabular-box-header-text'>
                <h5>Wants to meet</h5>
                <h3>Krishna Vijay</h3>
            </div>
        </div>
        <div className="tabular-box-header1">
            <div className='tabular-box-header-text'>
                <h5>Employee email</h5>
                <h3>Krishna.Vijay@goindigo.in</h3>
            </div>
        </div>
        <Button type="primary" style={{backgroundColor: "#D93025"}} >
            Reject
        </Button>
        <Button type="primary" style={{backgroundColor: "#099A4F"}}>
            Approve
        </Button>
    </div>)
}
 
export default Security_Column;