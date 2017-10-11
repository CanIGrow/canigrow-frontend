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
      usernameinputerror: false,
      email: '',
      password: '',
      passworderror: false,
      password2: '',
      bio: '',
      location: '',
      forumerrors: '',
      fireredirect: false,
    };
  }

  componentWillMount() {
      console.log(this.props);
      this.props.redirectAction([false, false]);
  }

  // from: https://github.com/tiycnd/library-frontend/blob/master/src/components/LoginRegister.js
  // updateFromField(stateKey) {
  //   return (event) => {
  //     this.setState({[stateKey]: event.target.value});
  //   }
  // }
  handleTextChange = (event) => {
    event.preventDefault();
    let target = event.target.id;
    if (this.state[target] !== undefined){
      this.setState({[target]: event.target.value, fireRedirect: false}, ()=>{
        this.validate(target);
      });
    }
  }
  validate = (target) => {
    let usererr = false;
    let passerr = false;
    if (this.state.usernameinput.length > 0 && this.state.usernameinput.length < 4){
      usererr = "Username must be at least 4 characters";
    }
    if (this.state.password.length > 0 && this.state.password.length < 5){
      passerr = "Password must be at least 5 characters";
    } else if (this.state.password2.length > 0 && this.state.password.length >= 5 && (this.state.password !== this.state.password2)){
      passerr = "Passwords do not match";
    }
    this.setState({passworderror:passerr, usernameinputerror:usererr});
  }
  register(event) {
     event.preventDefault();
     if (this.state.usernameinput.length > 4 && this.state.password.length > 4 && this.state.password2.length > 4 && (!this.state.passworderror) && (!this.state.usernameinputerror)){
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
            //  console.log(err);
            //  console.log(res.body.errors);
             this.setState({error: ["Email "+res.body.errors.username]});
            } else {
            this.props.redirectAction(["/login", "Registration successful, please log in!"]);
            }
          })
     } else {
       this.setState({error: "Please complete the form and correct errors"});
     }
    }
   componentDidUpdate(){
       if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
         this.setState({fireredirect:true});
       }
     }
  render() {
    let fourmready = false;
    if (this.state.usernameinput.length < 4 && this.state.password.length < 5 && this.state.password2.length < 5 && !this.state.passworderror && !this.state.usernameinputerror){
      fourmready = true;
    }
    let registerContents = null;
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
              {this.state.error && <div className="alert">{this.state.error}</div>}
              <div className="card-block">
                <h3>Registration Form:</h3>
                <form className="enterForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <h6>User Name:</h6>
                    <input type="text" onChange={this.handleTextChange} value={this.state.usernameinput} id="usernameinput" placeholder="Username"/>
                  </div>
                  {this.state.usernameinputerror ? this.state.usernameinputerror : ""}
                  <div className="form-group">
                    <h6>Email:</h6>
                    <input type="email" onChange={this.handleTextChange} value={this.state.email} id="email" placeholder="example@email.org"/>
                  </div>
                  <div className="form-group">
                    <h6>Password:</h6>
                    <input type="password" onChange={this.handleTextChange} value={this.state.password} id="password" placeholder="********"/>
                  </div>
                  <div className="form-group">
                    <h6>Retype Password:</h6>
                    <input type="password" onChange={this.handleTextChange} value={this.state.password2} id="password2" placeholder="********"/>
                  </div>
                  {this.state.passworderror ? this.state.passworderror : ""}
                  <div className="form-group">
                    <h6>Personal Bio:</h6>
                    <textarea type="text" onChange={this.handleTextChange} value={this.state.bio} id='bio' className='wmd-input processed' name='post-text' cols='50' rows='5' tabIndex='101' data-min-length placeholder='Tell Us About Yourself'></textarea>
                  </div>
                  <div className="form-group">
                    <h6>Location:</h6>
                    <input type="text" onChange={this.handleTextChange} value={this.state.location} id="location" placeholder="Hometown, Region"/>
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

export default connect(mapStateToProps, matchDispatchToProps)(Register);
