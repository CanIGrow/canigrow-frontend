import React, { Component } from 'react';
import '../styles/App.css';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom';
import cookie from 'react-cookies';
import {logout,redirectAction} from '../actions/actions.js';
import '../styles/App.css';

class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
    };
  }
  componentWillMount(){
    this.props.logout();
    if (cookie.load("token") !== undefined || cookie.load('username') !== undefined || cookie.load('username', {path: '/user'}) !== undefined || cookie.load('token', {path: '/user'}) !== undefined || cookie.load('email') !== undefined || cookie.load('load', {path: '/user'}) !== undefined){
      cookie.remove('token');
      cookie.remove('token', {path: '/user'});
      cookie.remove('email');
      cookie.remove('email', {path: '/user'});
      cookie.remove('username');
      cookie.remove('username', {path: '/user'});
      window.location.reload();
    } else {
      this.props.redirectAction(["/canigrow-frontend/", "You Have Been Logged Out"]);
    }
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0] && this.props.redirection[0] !== "/logout"){
      this.setState({fireredirect:true});
    }
  }
  render() {
    let message = false;
    if (this.props.redirection[1] !== undefined){
      message = this.props.redirection[1];
    } else {
      message = "Redirecting...";
    }
    return (
      <div>
      <h1 className="pagination-centered text-center">
        {message ? message : ""}
      </h1>
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
      email: state.username,
      redirection: state.redirection,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({logout: logout, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Logout);
