import React from 'react';
import './header.styles.scss';
import { Link } from "react-router-dom";
// import brandixLogo from '../../assets/brandixlogo.jpg'
const Header = (props) => (
  <div className={`header ${props.dayTimeClass}BGColor`} style={{borderBottom:"0.5px solid  #D3D3D3",
  background:'linear-gradient(to right  , rgba(0, 0, 0, 1),#b71c1c'}}>
    <Link style={{fontFamily:"century gothic",color:"white",fontSize:'2.2vw',
      padding:"1vw",marginLeft:"2vw",textDecoration:'none'}} className='logo-container' 
      to="/belapps" 
    >
        BEL APPS
        {/* {props.thumbNail} */}
        {/* <img src={props.thumbNail.src} alt="Delay Report" className="img-responsive" height='55vw' /> */}
    </Link>
    <div className='options'>
     
      <h5 className='option'style={{fontSize:'1.3vw', fontFamily:"century gothic",color:"white"}} >
        {props.appName}
      </h5>
    </div>
  </div>
);

export default Header;