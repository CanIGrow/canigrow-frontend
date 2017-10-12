import React, { Component } from 'react';
import { NavLink, Link, Redirect } from 'react-router-dom';
import '../styles/App.css';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reloadContents, logout,reloadUsername,reloadEmail} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';

class Header extends Component {
  constructor(props) {
      super(props)
      this.state = {
        fireredirect: false,
        message: false,
        username: '',
        token: this.props.token,
      };
      this.handleLogoutClick = this.handleLogoutClick.bind(this);
  }

  componentWillMount(){
    this.checklogin();
    this.props.redirectAction([false, false]);
  }

  checklogin(){
    if(cookie.load('token') !== undefined && cookie.load('username') !== undefined && cookie.load('email') !== undefined){
      this.props.reloadContents(cookie.load('token'));
      this.props.reloadUsername(cookie.load('username'));
      this.props.reloadEmail(cookie.load('email'));
      // if(cookie.load('username') !== undefined){
      //   this.props.reloadUsername(cookie.load('username'));
      // }
    }
  }
  handleLogoutClick() {
    this.props.redirectAction(["/logout", "Logging out..."]);
  }

  render() {
      // This determines which buttons will render based on whether or not the user is logged in.
      let rightButtons = null;
      // If the user is logged in show:
      if (this.props.token) {
        rightButtons =
        <div className="changeButtons">
          <li>
            {/* <NavLink activeClassName="selected" onClick={this.removeToken} to="/login"> */}
              <input className='btn btn-outline-primary' onClick={this.handleLogoutClick} type='submit' value='LogOut'/>
          </li>
          <li>
            <NavLink activeClassName="selected" to={`/user/${ this.props.username }`}>
              <input className='btn btn-outline-primary' type='submit' value={this.props.username}/>
            </NavLink>
          </li>
        </div>;
      }
      // If the user is logged out show.
      else {
        rightButtons =
        <div className="changeButtons">
          <li>
            <NavLink activeClassName="selected" to="/login">
              <input className='btn btn-outline-primary' type='submit' value='Login'/>
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="selected" to="/register">
              <input className='btn btn-outline-primary' type='submit' value='Register'/>
            </NavLink>
          </li>
        </div>;
      }
    return (
      <div className="header-container">
        <div className="container align-middle header-navbar">
          <li>
            <NavLink activeClassName="selected" to="/">
              <input className='btn btn-outline-primary' type='submit' value='Homepage'/>
            </NavLink>
          </li>
          {rightButtons}
        </div>
        <button className="header-hamburger"
        data-toggle="modal" data-target="#hamburger-menu">
          &#9776;
        </button>
        <div className="container">
          <div className="modal left fade in" id="hamburger-menu" tabIndex="-1" >
            <div className="modal-dialog">
              <div className="modal-content text-center">
              <button type="button"
                className="close"
								data-dismiss="modal"
                aria-label="Close">
  							<span aria-hidden="true">
                  &times;
                </span>
						  </button>
                  <Link to="/">Home</Link>
                  <Link to="/users">Users</Link>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
        {this.state.fireredirect && (
            <Redirect to={this.props.redirection[0]}/>
          )}
      </div>
    );
    // <div className="header-container">
    //   <div className="container align-middle header-navbar">
    //     <div className="row">
    //       <div className="col text-center"><Link to="/">Home</Link></div>
    //       <div className="col text-center"><Link to="/plants/:id">Plants</Link></div>
    //       <div className="col text-center"><Link to="/register">Register</Link></div>
    //       <div className="col text-center"><Link to="/login">Login</Link></div>
    //     </div>
    //   </div>
    // </div>
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username,
      redirection: state.redirection,
      email: state.email,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({reloadEmail:reloadEmail,reloadUsername:reloadUsername,reloadContents: reloadContents, logout: logout, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);
