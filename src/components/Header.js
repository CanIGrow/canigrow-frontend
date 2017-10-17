import React, { Component } from 'react';
import { NavLink, Link, Redirect } from 'react-router-dom';
import '../styles/App.css';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {setToken,setUsername,setEmail,logout,redirectAction} from '../actions/actions.js';

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
      this.props.setToken(cookie.load('token'));
      this.props.setUsername(cookie.load('username'));
      this.props.setEmail(cookie.load('email'));
      // if(cookie.load('username') !== undefined){
      //   this.props.reloadUsername(cookie.load('username'));
      // }
    }
  }
  handleLogoutClick() {
    this.props.redirectAction(["/logout", "Logging out..."]);
  }

  render() {
      let popoverbuttons = false
      // This determines which buttons will render based on whether or not the user is logged in.
      let rightButtons = null;
      let userButton = `${this.props.username}'s garden`;
      // If the user is logged in show:
      if (this.props.token && this.props.username) {
        popoverbuttons =
        <div>
          <Link to="/">Home</Link><br/>
          <span className="btn-link manual-link-style" onClick={this.handleLogoutClick} value='LogOut'>Logout</span><br/>
          <Link className="btn-link" to={`/user/${ this.props.username }`}>{this.props.username}</Link><br/>
        </div>
        rightButtons =
        <div className="changeButtons">
          <li>
            {/* <NavLink activeClassName="selected" onClick={this.removeToken} to="/login"> */}
              <input className='btn btn-link font-size-16px' onClick={this.handleLogoutClick} type='submit' value='LogOut'/>
          </li>
          <li>
            <NavLink activeClassName="selected" to={`/user/${ this.props.username }`}>
              <input className='btn btn-link font-size-16px' type='submit' value={userButton}/>
            </NavLink>
          </li>
        </div>;
      } else {
        // If the user is logged out show.
        popoverbuttons =
        <div>
          <Link to="/">Home</Link><br/>
          <Link to="/register">Register</Link><br/>
          <Link to="/login">Login</Link><br/>
        </div>
        rightButtons =
        <div className="changeButtons">
          <li>
            <NavLink activeClassName="selected" to="/login">
              <input className='btn btn-link font-size-16px' type='submit' value='Login'/>
            </NavLink>
          </li>
          <li>
            <NavLink activeClassName="selected" to="/register">
              <input className='btn btn-link font-size-16px' type='submit' value='Register'/>
            </NavLink>
          </li>
        </div>;
      }
    return (
      <div className="header-container">
        <div className="container align-middle header-navbar">
          <li>
            <NavLink activeClassName="selected" to="/">
              {/*<input className='canigrowlogo btn btn-outline-primary' type='submit' value='Homepage'/>*/}
              <img src={require('./canigrowlogo.png')} className='canigrowlogo' alt="canigrow logo" value='Homepage'/>
            </NavLink>
          </li>
          {rightButtons}
        </div>
        <button className="header-hamburger"
        data-toggle="modal" data-target="#hamburger-menu">
          &#9776;
        </button>
        <img src={require('./canigrowlogo.png')} className='canigrowlogo-mobile' value='Homepage' alt="canigrow logo"/>
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
                {popoverbuttons ? popoverbuttons : ""}
                  <Link to="/users">Users</Link>
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
    return bindActionCreators({setEmail:setEmail,setUsername:setUsername,setToken: setToken, logout: logout, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);
