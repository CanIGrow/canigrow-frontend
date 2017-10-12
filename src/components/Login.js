import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
import {setLogin} from '../actions/loginAction.js';
import {reloadUsername} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';
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
      };
  }

  componentWillMount() {
    console.log(this.props);
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  login(event) {
     let setLogin = this.props.setLogin;
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     let username = null;
     event.preventDefault();
     request
      .post(`${proxyurl}https://canigrow.herokuapp.com/api/users/login`)
      .send({email: this.state.username, password: this.state.password})
       .end((err, res) => {
         console.log(res);
         if (err) {
           if (res !== undefined){
             this.setState({error: res.body.error});
           }
           console.log("error");
         } else {
           // This call functions from actions to send the token to the reducer then the store.
           setLogin(res.body.token);
           // These save the token to a cookie.
           cookie.save('token', res.body.token);
          //  This request is to get the user's username.
           request
             .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/${res.body.user_id}`)
             .end((err, res)=>{
               if (res !== undefined){
                 console.log(res);
                username = res.body.user.username;
                // This call functions from actions to send the username to the reducer then the store.
                this.props.reloadUsername(username);
                // These save the username to a cookie.
                cookie.save('username', username);
               }
             })
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
            <div className="card">
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
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setLogin: setLogin, reloadUsername: reloadUsername, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
