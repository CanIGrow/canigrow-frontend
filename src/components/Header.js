import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import '../styles/App.css';

export default class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <div className="container align-middle header-navbar">
          <div className="row">
            <div className="col text-center"><Link to="/">Home</Link></div>
            <div className="col text-center">Plant</div>
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
                  Plant
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
