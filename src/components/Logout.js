import React, { Component } from 'react';
import '../styles/App.css';
import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
import cookie from 'react-cookies';
import {setLogin} from '../actions/loginAction.js';
import {reloadUsername} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';
import '../styles/App.css';

class Logout extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
      message: false,
    };
  }
  componentWillMount(){
    cookie.remove('token');
    cookie.remove('username');
    cookie.remove('template');
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      console.log("LOGOUT DETECTED");
      this.props.redirectAction(["/logout"]);
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction(["/", "You Have Been Logged Out"]);
      });
    } else {

    }
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }
  render() {
    return (
      <div>
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

export default connect(mapStateToProps, matchDispatchToProps)(Logout);
