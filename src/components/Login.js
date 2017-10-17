import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink, Redirect } from 'react-router-dom';
import request from 'superagent';
import {setToken,setUsername,setEmail,redirectAction} from '../actions/actions.js';
import cookie from 'react-cookies';
import '../styles/App.css';

class Login extends Component {
  constructor(props) {
      super(props)
      this.state = {
        fireredirect: false,
        message: false,
        username: '',
        password: '',
        token: this.props.token,
        error: '',
        testing: "",
      };
  }

  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }
  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  login(event) {
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     event.preventDefault();
     request
      .post(`${proxyurl}https://canigrow.herokuapp.com/api/users/login`)
      .send({email: this.state.username, password: this.state.password})
       .end((err, res) => {
         if (err) {
            this.setState({error: res.body.error});
         } else {
           if (res !== undefined && res.body.token !== undefined){
           // These save the token to a cookie.
           cookie.save('token', res.body.token);
           cookie.save('username', res.body.username);
           cookie.save('email', this.state.username);
           // This call functions from actions to send the token to the reducer then the store.
           this.props.setToken(res.body.token);
           this.props.setUsername(res.body.username);
           this.props.setEmail(this.state.username);
         } else if (res !== undefined && res.body.token === undefined){
           this.setState({error: res.body.message});
         }
         }
       })
  }

  render() {
    // This render's contents are determined by whether the user is logged in.
    let loginContents = null;
    if (this.props.token) {
      loginContents =
      <div className="centerHomeButton">
        <NavLink className="btn btn-primary btn-lg" type="submit" activeClassName="selected" to="/">
          <div>Login Successful!</div>
          <div>You are now logged in as: {this.props.username}</div>
          <span>Homepage</span>
        </NavLink>
      </div>
    } else {
      loginContents =
         <div className="container-fluid">
            <div className="card margin-top-108px">
              {this.state.error && <div className="alert">{this.state.error}</div>}
              <div className="card-block">
                <div>{this.state.token}</div>
                <h3>Login Form:</h3>
                <form className="enterForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <h6>Email:</h6>
                    <input type="username" onChange={this.updateFromField('username')} value={this.state.username} placeholder="user@gmail.org"/>
                  </div>
                  <div className="form-group">
                    <h6>Password:</h6>
                    <input type="password" onChange={this.updateFromField('password')} value={this.state.password} placeholder="********"/>
                  </div>
                  {this.state.message ? this.state.message : ""}<br/>
                  <div className="form-group pull-right">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.login(event)}>Login</button>
                  </div>
                </form>
                <div className="card">
                  <div>
                    <p>Forgot your password?</p>
                    <NavLink className="btn btn-primary btn-sm" type="submit" to="/login/password_reset">
                      <span>Password Reset</span>
                    </NavLink>
                  </div>
                </div>
                <div className="card">
                  <div>
                    <p>Need a new authentication email?</p>
                    <NavLink className="btn btn-primary btn-sm" type="submit" to="/login/authentication_request">
                      <span>Get Email Activation Form</span>
                    </NavLink>
                  </div>
                </div>
              </div>
            </div>
         </div>
    }
    return (
      <div>
        {loginContents}
        {/* // This redirects when the user is logged in (has a token). */}
        {this.props.token && (
           <Redirect to={`/`}/>
         )}
        {this.state.fireredirect && (
            <Redirect to={this.props.redirection[0]}/>
          )}
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username,
      redirection: state.redirection,
      email: state.email
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setEmail:setEmail, setUsername:setUsername, setToken:setToken, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
