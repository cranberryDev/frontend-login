import {React,useEffect,useState} from 'react';
import { EditOutlined, EllipsisOutlined, SettingOutlined, } from '@ant-design/icons';
import { Avatar, Card, Button, Tooltip, Image } from 'antd';
import './style.css';


const { Meta } = Card;

const Carrd = ({ data, backgroundColor = '#E8F0FB', color = '#141522', handleCheckIn, handleCheckOut, handleAction }) =>
{ 
  const [imageSrc, setImageSrc] = useState(null);
  
  try{
   
    useEffect(() => {
      if (data.id_proof) {
        // Convert the Buffer to a data URL
        const arrayBufferView = new Uint8Array(data.id_proof.data);
        const blob = new Blob([arrayBufferView], { type: data.id_proof.type });
        const urlCreator = window.URL || window.webkitURL;
        const imageUrl = urlCreator.createObjectURL(blob);
  
        // Set the data URL as the image source
        setImageSrc(imageUrl);
      }
    }, [data.id_proof]);

  }catch(e){
    console.log(e);
  }
  return (
  <Card
    className='visitor-card'
  >
    <div className='card-header'>
      <Meta
        // avatar={<Avatar size={48} src={imageSrc} style={{ backgroundColor: backgroundColor, color: color }}>{!imageSrc?"UJ":null}</Avatar>}
        title={data.visitor_name}
        description={data.purpose_of_visit}
      />
    </div>
    <div className='card-body'>
      <div className='card-content-left'>
        <img src={imageSrc} />
      </div>
      <div className='card-content'>
      <div><strong>Whom to meet:</strong> {data.host_employee}</div>
      <div><strong>Employee Email :</strong> {data.employee_email}</div>
      <div><strong>Meeting Timings:</strong> {data.start_time + " - " + data.end_time}</div>
      <div><strong>Office Location:</strong> {data.office_loc}</div>
      </div>
    </div>
    {data.status.toLowerCase() === 'pending' ? <div className="card-footer action-btn">
      <Button type="primary" danger onClick={(e) => handleAction(e,data, "rejected")}>
        REJECT
      </Button>
      <Button type="primary" style={{ backgroundColor: "#099A4F" }} onClick={(e) => handleAction(e,data,"approved")}>
        APPROVE
      </Button>
    </div> : data.status.toLowerCase() === 'approved' ?

      <div className="card-footer action-btn">
        <Tooltip placement="top" title={data.check_in ? `Checked In at ${data.check_in}` : ""} overlayInnerStyle={{ textAlign: 'center' }}>
          <Button type="primary" className="green-btn" disabled={data.check_in} onClick={(e) => handleCheckIn(e, data)}>
            CHECK IN
          </Button>
        </Tooltip>
        <Tooltip placement="bottom" title={data.check_out ? `Checked out at ${data.check_out}` : ""} overlayInnerStyle={{ textAlign: 'center' }}>
          <Button type="primary" className="red-btn" disabled={data.check_out} onClick={(e) => handleCheckOut(e,data)}>
            CHECK OUT

          </Button>
        </Tooltip>
      </div> :
        <div className="card-footer action-btn">
          <Tooltip placement="top" title={"Request is rejected"}>
          <Button type="primary" danger disabled={true}>
            {data.status.toUpperCase()}
          </Button>
          </Tooltip>
        </div>
    }

  </Card>
)
}

export default Carrd;