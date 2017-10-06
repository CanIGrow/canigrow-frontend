import React, { Component } from 'react';
import {connect} from 'react-redux';
import '../styles/App.css';

class Login extends Component {
  render() {
    console.log('login page render');
    console.log(this.props);
    console.log(this.props.user);
    console.log(this.props.username);
    return (
      <div className="login-container main-component-container">
        <h1>This is the Login page</h1>
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
        user: state.activeUser
    };
}

export default connect(mapStateToProps)(Login);
