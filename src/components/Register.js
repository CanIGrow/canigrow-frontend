import React, { Component } from 'react';
import '../styles/App.css';
import { Link, NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { BrowserRouter, Route, Switch, Router, withRouter, Redirect } from 'react-router-dom';
import request from 'superagent';
import {setLogin} from '../actions/loginAction.js';
import {reloadUsername} from '../actions/reloadToken.js';
import cookie from 'react-cookies';
import '../styles/App.css';


class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      userName: '',
      password: '',
      token: this.props.token,
      bio: '',
      comments: []
    };
  }

  componentWillMount() {
      console.log(this.props);
  }

  // from: https://github.com/tiycnd/library-frontend/blob/master/src/components/LoginRegister.js
  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
    }

  register(event) {
     let setToken = this.props.setToken;
     event.preventDefault();
     request
        .post("https://pure-spire-67730.herokuapp.com/users")
        .send(
         {
          user: {
                username: this.state.username,
                password: this.state.password,
                bio: this.state.bio
                }
             }
            )
        .end((err, res) => {
         if (err) {
           this.setState({error: res.body.errors.username});
           console.log("error");
           console.log(res.body.errors.password);
           console.log(res.body.errors.username);
          } else {
          console.log("registered");
          // This logs the user in if registration was successful.
          request
          .post("https://pure-spire-67730.herokuapp.com/users/login")
          .send({username: this.state.username, password: this.state.password})
          .end((err, res) => {
            if (err) {
              this.setState({error: res.body.error});
              console.log("error");
            } else {
              let setLogin = this.props.setLogin;
              setLogin(res.body.token, this.state.username);
              this.props.reloadUsername(this.state.username);
              // These save the username and token to cookies.
              cookie.save('token', res.body.token);
              cookie.save('username', this.state.username);
              // setToken(res.body.token, this.state.username, res.body.user_id);
              console.log("token returned");
              console.log(res.body);
              console.log(res.body.token);
              console.log(res.body.user_id);
              console.log(this.state.username);
            }
          })
          }
        })
   }

  render() {
    let registerContents = null;
    console.log(this.props.token);
    if (this.props.token) {
      registerContents =
      <div className="centerHomeButton">
        <NavLink className="btn btn-primary btn-lg" type="submit" activeClassName="selected" to="/">
          <div>Registration Successful!</div>
          <div>You are now logged in as: {this.props.username}</div>
          <span>Go to the Homepage</span>
        </NavLink>
      </div>
    } else {
      registerContents =
        <div className="container-fluid">
            <div className="card">
              {this.state.error && <div className="alert">Username {this.state.error}</div>}
              <div className="card-block">
                <h3>Registration Form:</h3>
                <form className="enterForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <h6>User Name:</h6>
                    <input type="username" onChange={this.updateFromField('username')} value={this.state.username} placeholder="User Name"/>
                  </div>
                  <div className="form-group">
                    <h6>Password:</h6>
                    <input type="password" onChange={this.updateFromField('password')} value={this.state.password} placeholder="********"/>
                  </div>
                  <div className="form-group">
                    <h6>Personal Bio:</h6>
                    <textarea type="text" onChange={this.updateFromField('bio')} value={this.state.bio} id='wmd-input' className='wmd-input processed' name='post-text' cols='50' rows='5' tabIndex='101' data-min-length placeholder='Tell Us About Yourself'></textarea>
                  </div>
                  <div className="form-group pull-right">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.register(event)}>Register</button>
                  </div>
                </form>
              </div>
            </div>
        </div>
    }


    return (
      <div>
      {registerContents}
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setLogin: setLogin, reloadUsername: reloadUsername}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Register);
