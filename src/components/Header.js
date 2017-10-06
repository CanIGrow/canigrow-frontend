import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reloadContents} from '../actions/reloadToken.js';

class Header extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        token: this.props.token,
      };
  }

  componentWillMount(){
    console.log("BaseLayout Mounted")
    this.checklogin();
  }
  checklogin(){
    console.log(cookie.load('token'));
    if(cookie.load('token') !== null){
      this.props.reloadContents(cookie.load('token'), cookie.load('username'));
    }
  }










  render() {
    return (
      <div className="header-container">
        <div className="container align-middle header-navbar">
          <div className="row">
            <div className="col text-center"><Link to="/">Home</Link></div>
            <div className="col text-center"><Link to="/plants/:id">Plants</Link></div>
            <div className="col text-center"><Link to="/register">Register</Link></div>
            <div className="col text-center"><Link to="/login">Login</Link></div>
          </div>
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
                  <Link to="/plants/id">Plants</Link>
                  <Link to="/register">Register</Link>
                  <Link to="/login">Login</Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
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
    return bindActionCreators({reloadContents: reloadContents}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Header);
