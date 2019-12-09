import React, { Component,  } from 'react';
import '../../components/dayTime.scss'
import Header from '../../components/Header/Header'
import BuContainer from '../../components/BuContainer/BuContainer'
import ThemeContext from '../../context/ThemeContext'
import './homePage.scss'

import fashionShow from '../../assets/fashionShow.jpg'

const jwt = require('jsonwebtoken');

class HomePage extends Component {
  constructor(props){
    super(props);
    this.state={
        appName:'Home Page',
        windowHeigth:window.innerHeight,
        userName:'',
        thumbNail:''
    } 
  }
  async componentDidMount(){
    const belAppsToken=await localStorage.getItem('belAppsToken');
    if(!belAppsToken){
      this.props.history.push('/')
    }
    else{
      const decoded = jwt.decode(belAppsToken, {complete: true});
      
      this.setState({userName:decoded.payload.userName,appName:"Welcome "+decoded.payload.userName.substr(0,decoded.payload.userName.length)})
    }
  }

  onEbbuClick=()=>{
    this.props.history.push('/belapps/ebbu');
  }
  onUbbuClick=()=>{
    this.props.history.push('/belapps/ubbu');
  }

  static contextType = ThemeContext;
  render() {
    return(
      <div className={this.context.dayTimeClass} style={{overflow:"hidden",height:`${this.state.windowHeigth}px`,
      backgroundImage:`linear-gradient(to right top , rgba(0, 0, 0, 0),rgba(0, 0, 0, 1)),url(${fashionShow})`,backgroundSize:'cover',backgroundPosition:'center',backgroundRepeat:'no-repeat'}} >

        <Header dayTimeClass={this.context.dayTimeClass} thumbNail={this.state.thumbNail} appName={this.state.appName} timeOfDay={this.context.timeOfDay} />
        <div className="homeFlexContainer" style={{marginLeft:'10vw',marginRight:'10vw',marginTop:'6vw',paddingLeft:'5vw',}}> 
          <BuContainer buTitle='UBBU' onBUClick={this.onUbbuClick}/>
          <BuContainer buTitle='EBBU' onBUClick={this.onEbbuClick}/>
          <BuContainer buTitle='LBBU' />
          <BuContainer buTitle='Data Cell' />
        </div>
      </div>
      //  
    ) 
  }
};

export default HomePage;
   