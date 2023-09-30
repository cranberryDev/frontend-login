import './style.css';
const Card = ({ title, value, icon, color }) => {
    return (<div className="card">
        <h3>{title}</h3>
        <div className="card-content" style={{ color: color }}>
            {value}
            <span className="icon">{icon}</span>
        </div>
    </div>);
}

export default Card;