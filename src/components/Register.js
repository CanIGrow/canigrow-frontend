import React, { Component } from 'react';
import '../styles/App.css';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
import {redirectAction} from '../actions/actions.js';
import '../styles/App.css';

class Register extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
      message: false,
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
    };
  }

  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
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

                  username: this.state.usernameinput,
                  email: this.state.email,
                  password: this.state.password,
                  bio: this.state.bio,
                  location: this.state.location

               }
              )
          .end((err, res) => {
           if (err) {
             let propertyname = Object.getOwnPropertyNames(res.body.errors)[0];
             this.setState({error: [propertyname+" "+res.body.errors[propertyname]]});
            } else {
            this.props.redirectAction(["/canigrow-frontend/login", "Registration successful, please check your email for a confirmation message!"]);
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
    if (this.state.usernameinput.length > 4 && this.state.password.length > 4 && this.state.password2.length > 4 && !this.state.passworderror && !this.state.usernameinputerror){
      fourmready = true;
    }
    let registerContents = null;
    if (this.props.token) {
      registerContents =
      <div className="centerHomeButton">
        <NavLink className="btn btn-primary btn-lg" type="submit" activeClassName="selected" to="/canigrow-frontend/">
          <div>Registration Successful!</div>
          <div>You are now logged in as: {this.props.username}</div>
          <span>Go to the Homepage</span>
        </NavLink>
      </div>
    } else {
      registerContents =
        <div className="container-fluid flex-box-center down-55pt">
          <div className="card pagination-centered width-800px text-center">
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
                  <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.register(event)} disabled={!fourmready}>Register</button>
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
         <Redirect to={`/canigrow-frontend/`}/>
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
      redirection: state.redirection,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Register);
