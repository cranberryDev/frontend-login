import  './style.css'
//import logo from './Union.png'
import { Nav } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
const Navbar = () => {
    const navigate = useNavigate();
    return ( 
    <div data-testid="navbar-component" className="navbar">
        <Nav className="me-auto">
            <div className='logo'>
                {/* <img src={logo} data-testid="on-click" className="nav-logo" onClick={()=>navigate("/")} alt='logo'/> */}
                </div> 
            <ul>
                {/* <li><Nav.Link href="/meeting" style={{color: "white"}}>Meeting</Nav.Link></li> */}
                <li><Nav.Link href="/security" style={{color: "white"}}>Security</Nav.Link></li>
                <li><Nav.Link href="/visitor" style={{color: "white"}}>Request</Nav.Link></li>
            </ul>
          </Nav>
    </div> );
}
 
export default Navbar;