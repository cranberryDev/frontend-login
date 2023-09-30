
import { Avatar } from 'antd';

const TabularBox = ({ avatarName, title, name, className, backgroundColor = '#E8F0FB', color = '#141522' }) => {
    // console.log(avatarName,typeof(avatarName));

    if(avatarName!=null || avatarName!=undefined)
    {
        avatarName=avatarName.split(" ").map((word,key) => word[0]).join("")
    }

    return (
        <div className={`tabular-box ${className}`}>
            <div className='tabular-box-content'>
                {avatarName && <Avatar size={48} style={{ backgroundColor: backgroundColor, color: color }}>{avatarName}</Avatar>}
                {
                    (title || name) && <div className='tabular-box-text'>
                        {title && <div className="feild-title">{title}</div>}
                        {name && <div className="name">{name}</div>}
                    </div>

                }
            </div>
        </div>
    );
}

export default TabularBox;