import React, { Component,  } from 'react';
import '../../components/dayTime.scss'
import Header from '../../components/Header/Header'
import ThemeContext from '../../context/ThemeContext'
import Grid from '@material-ui/core/Grid';
import uniqloImage from '../../assets/uniqlo-12.jpg'

import ProjectCard from '../../components/ProjectCardComponent/ProjectCardComponent'
const jwt = require('jsonwebtoken');

class EBBUPage extends Component {
  constructor(props){
    super(props);
    this.state={
        appName:'EBBU Page',
        windowHeigth:window.innerHeight,
        userName:''
    }
    
  }
  async componentDidMount(){
    const belAppsToken=await localStorage.getItem('belAppsToken');
    if(!belAppsToken){
      this.props.history.push('/')
    }
    else{
      const decoded = jwt.decode(belAppsToken, {complete: true});
      this.setState({userName:decoded.payload.userName})
    }
  }

  onDelayReportClick=()=>{
    this.props.history.push('/belapps/ebbu/delayReport');
  }

  static contextType = ThemeContext;
  render() {
    return(
      <div  style={{overflow:"hidden",height:`${this.state.windowHeigth}px`,backgroundColor:"#fafafa"}} >
        <Header dayTimeClass={this.context.dayTimeClass} appName={this.state.appName} timeOfDay={this.context.timeOfDay} />
        <div className="container" style={{marginLeft:'10vw',marginRight:'',marginTop:'6vw',paddingLeft:'5vw'}}>
            <Grid container spacing={4}>
                <Grid item xs={3}>
                    <ProjectCard image={uniqloImage} projectTitle="Delay Report" onCardClick={this.onDelayReportClick}
                     projectDescription="“Delay Report” generate two output sheets which includes details of delayed DOs."/>
                </Grid>
            </Grid>
        </div>
      </div>
    ) 
  }
};

export default EBBUPage;
   