import React, { Component,  } from 'react';
import '../../components/dayTime.scss'
import Header from '../../components/Header/Header'
import ThemeContext from '../../context/ThemeContext'
import Grid from '@material-ui/core/Grid';
import usBrandsImage from '../../assets/usbrands.jpg';
import ProjectCard from '../../components/ProjectCardComponent/ProjectCardComponent'

class UBBUPage extends Component {
  constructor(props){
    super(props);
    this.state={
        appName:'UBBU Page',
        windowHeigth:window.innerHeight,
        userName:''
    }
    
  }
  async componentDidMount(){
    const belAppsToken=await localStorage.getItem('belAppsToken');
    if(!belAppsToken){
      this.props.history.push('/')
    }
  }

  onVMSClick=()=>{
    this.props.history.push('/belapps/ubbu/VMS');
  }

  static contextType = ThemeContext;
  render() {
    return(
      <div  style={{overflow:"hidden",height:`${this.state.windowHeigth}px`}} >
        <Header dayTimeClass={this.context.dayTimeClass} appName={this.state.appName} timeOfDay={this.context.timeOfDay} />
        <div className="container" style={{marginLeft:'10vw',marginRight:'',marginTop:'6vw',paddingLeft:'5vw'}}>
            <Grid container spacing={4}>
               <Grid item xs={3}>
                <ProjectCard image={usBrandsImage} projectTitle="VMS" onCardClick={this.onVMSClick}
                     projectDescription=""/>
                </Grid>
            </Grid>
        </div>
      </div>
    ) 
  }
};

export default UBBUPage;
   