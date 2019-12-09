import React, { Component,  } from 'react';
import './loginPage.styles.scss'
import AuthServices from '../../_services/auth'


class LoginPage extends Component {
  constructor(props){
    super(props);
    this.state={
        userName:'',
        password:''
    }
  }
  handleChange=(event)=>{
    const { value, name } = event.target;
    this.setState({[name]: value});
  }
  onSubmit=async(event)=>{
    event.preventDefault();
    let userData={
        userName:this.state.userName,
        password:this.state.password
    }
    const loginResponse=await AuthServices.login(userData)

    if(loginResponse.status==200){
      const loginData=await loginResponse.json();
      const token=loginData.token
      localStorage.setItem('belAppsToken',token );
      this.props.history.push('/belapps');
    }
    else{
      alert("Login Failed")
    }
  }
  render() {
    return (
    <div id="login" >
        {/* <h3 className="text-center text-white pt-5">Login form</h3> */}
        <div className="container">
            <div id="login-row" className="row justify-content-center align-items-center">
                <div id="login-column" className="col-md-6">
                    <div id="login-box" className="col-md-12">
                        
                            <h3 className="text-center text-info">BEL Applications Login</h3>
                            <div className="form-group">
                                <label  className="text-info">Username:</label>
                                <input 
                                type="text"
                                name="userName" 
                                id="username" 
                                onChange={this.handleChange}
                                value={this.state.userName}
                                className="form-control" />
                            </div>
                            <div className="form-group">
                                <label  className="text-info">Password:</label>
                                <input
                                type='password' 
                                onChange={this.handleChange}
                                value={this.state.password}
                                name="password" 
                                id="password" 
                                className="form-control" />
                            </div>
                        <button onClick={this.onSubmit} className="btn btn-primary">Login</button>
                    </div>
                </div>
            </div>
        </div>
    </div>
    );
  }
}
;
export default LoginPage;
