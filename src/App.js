import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import LoginPage from './pages/LoginPage/loginPage'
import HomePage from './pages/HomePage/homePage'
import EBBUPage from './pages/EBBUPage/EbbuPage'
import UBBUPage from './pages/UBBUPage/Ubbupage'
import DelayReportContainer from './components/DelayReport/DelayReportContainer'
import VmsContainer from './components/VMS/VmsContainer'

import  ThemeContext from './context/ThemeContext'

const loading = () => <div className="animated fadeIn pt-3 text-center">Loading...</div>;

class App extends Component {
  state  ={timeOfDay:'Morning',dayTimeClass:'Morning'}
  async componentDidMount (){
      const hourOfday=new Date().getHours();
      if(hourOfday>=6&&hourOfday<12){
        this.setState({timeOfDay:'Morning',dayTimeClass:'Morning'})
      }
      else if(hourOfday>=12&&hourOfday<15){
        this.setState({timeOfDay:'Afternoon',dayTimeClass:'Afternoon'})
      }
      else if(hourOfday>=15&&hourOfday<18){
        this.setState({timeOfDay:'Evening',dayTimeClass:'Evening'})
      }
      else{
        this.setState({timeOfDay:'Night',dayTimeClass:'Night'})
      }
  };
  render() {
    return (
     
      <HashRouter>
          <React.Suspense fallback={loading()}>
          <ThemeContext.Provider value={{timeOfDay:this.state.timeOfDay,dayTimeClass:this.state.dayTimeClass}}>
            <Switch>
              <Route path="/" exact={true} name="Login" render={props => <LoginPage {...props}/>} />
              <Route path="/belapps" exact={true} name="Bel Apps" render={props => <HomePage {...props}/>} />
              <Route path="/belapps/ebbu" exact={true} name="EBBU" render={props => <EBBUPage {...props}/>} />
              <Route path="/belapps/ubbu" exact={true} name="UBBU" render={props => <UBBUPage {...props}/>} />
              <Route path="/belapps/ubbu/VMS" exact={true} name="VMS" render={props => <VmsContainer {...props}/>} />
              <Route path="/belapps/ebbu/delayReport" exact={true} name="Delay Report" render={props => <DelayReportContainer {...props}/>} />
            </Switch>
          </ThemeContext.Provider>
          </React.Suspense>
      </HashRouter>
    );
  }
}

export default App;