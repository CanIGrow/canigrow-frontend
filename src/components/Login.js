import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from 'react-router-dom';
import { BrowserRouter, Route, Switch, Router, withRouter, Redirect } from 'react-router-dom';
import request from 'superagent';
import {setLogin} from '../actions/loginAction.js';
import cookie from 'react-cookies';


import '../styles/App.css';

class Login extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        password: '',
        token: this.props.token,
        error: '',
        comments: []
      };
  }

  componentWillMount() {
      console.log(this.props);
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  login(event) {
     let setLogin = this.props.setLogin;
     event.preventDefault();
     request
       .post("https://pure-spire-67730.herokuapp.com/users/login")
       .send({username: this.state.username, password: this.state.password})
       .end((err, res) => {
         if (err) {
           this.setState({error: res.body.error});
           console.log("error");
         } else {
           this.props.setLogin(res.body.token, this.state.username);
          //  setToken(res.body.token, this.state.username, res.body.user_id);
          //  this.setState({token: res.body.token});
          //  assignToken(res.body.token);
            cookie.save('token', res.body.token);
            cookie.save('username', this.state.username);
           console.log("login props");
           console.log(this.props);
           console.log("token returned");
           console.log(res.body);
           console.log(res.body.token);
           console.log(res.body.user_id);
           console.log(this.state.username);
           console.log(this.state.token);
          //  console.log(this.props.Router);
            // return (
            //   <Redirect to='/'/>
            // )
         }
       })
  }


  render() {

    let loginContents = null;
    console.log(this.props);
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
                    <h6>User Name:</h6>
                    <input type="username" onChange={this.updateFromField('username')} value={this.state.username} placeholder="User Name"/>
                  </div>
                  <div className="form-group">
                    <h6>Password:</h6>
                    <input type="password" onChange={this.updateFromField('password')} value={this.state.password} placeholder="********"/>
                  </div>
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
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      token: state.token
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setLogin: setLogin}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
