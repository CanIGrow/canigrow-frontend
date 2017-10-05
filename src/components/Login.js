import React, { Component } from 'react';
import '../styles/App.css';

export default class Login extends Component {
  render() {
    console.log('login page render');
    console.log(this.props);
    console.log(this.props.username);
    return (
      <div className="login-container">
        {/* <UserList /> */}
      </div>
    );
  }
}
