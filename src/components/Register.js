import React, { Component } from 'react';
import '../styles/App.css';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
import {setLogin} from '../actions/loginAction.js';
import {reloadUsername} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';
import cookie from 'react-cookies';
import '../styles/App.css';

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      token: this.props.token,
      usernameinput: '',
      email: '',
      password: '',
      password2: '',
      bio: '',
      location: '',
      fireredirect: false,
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
     event.preventDefault();
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     request
        .post(`${proxyurl}https://canigrow.herokuapp.com/api/users`)
        .send(
         {
          user: {
                username: this.state.usernameinput,
                email: this.state.email,
                password: this.state.password,
                bio: this.state.bio,
                location: this.state.location
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
          // request
          // .post(`${proxyurl}https://canigrow.herokuapp.com/api/users/login`)
          // .send({email: this.state.email, password: this.state.password})
          // .end((err, res) => {
          //   if (err) {
          //     this.setState({error: res.body.error});
          //     console.log("error");
          //   } else {
          //     console.log(res);
          //     let setLogin = this.props.setLogin;
          //     setLogin(res.body.token, this.state.username);
          //     this.props.reloadUsername(this.state.username);
          //     // These save the username and token to cookies.
          //     cookie.save('token', res.body.token);
          //     cookie.save('username', this.state.username);
          //   }
          // })
          }
        })
   }
   registertest(event) {
      event.preventDefault();
      this.props.redirectAction(["/login", "registrationSuccessful"]);
      // this.setState({fireredirect:true});
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
                    <input type="text" onChange={this.updateFromField('usernameinput')} value={this.state.usernameinput} id="username" placeholder="username"/>
                  </div>
                  <div className="form-group">
                    <h6>Email:</h6>
                    <input type="email" onChange={this.updateFromField('email')} value={this.state.email} id="email" placeholder="example@email.org"/>
                  </div>
                  <div className="form-group">
                    <h6>Password:</h6>
                    <input type="password" onChange={this.updateFromField('password')} value={this.state.password} id="password" placeholder="********"/>
                  </div>
                  <div className="form-group">
                    <h6>Retype Password:</h6>
                    <input type="password" onChange={this.updateFromField('password2')} value={this.state.password2} id="password" placeholder="********"/>
                  </div>
                  <div className="form-group">
                    <h6>Personal Bio:</h6>
                    <textarea type="text" onChange={this.updateFromField('bio')} value={this.state.bio} id='bio' className='wmd-input processed' name='post-text' cols='50' rows='5' tabIndex='101' data-min-length placeholder='Tell Us About Yourself'></textarea>
                  </div>
                  <div className="form-group">
                    <h6>Location:</h6>
                    <input type="text" onChange={this.updateFromField('location')} value={this.state.location} id="location" placeholder="Hometown, Region"/>
                  </div>
                  <div className="form-group pull-right">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.register(event)}>Register</button>
                  </div>
                </form>
                <form className="enterForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group pull-right">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.registertest(event)}>Register</button>
                  </div>
                </form>
              </div>
            </div>
        </div>
    }


    return (
      <div>
      {registerContents}
      {/* // This redirects when the user is logged in (has a token). */}
      {this.props.token && (
         <Redirect to={`/`}/>
       )}
       {this.state.fireredirect && (
          <Redirect to={`/login=registrationSuccessful`}/>
        )}
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setLogin: setLogin, reloadUsername: reloadUsername, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Register);
