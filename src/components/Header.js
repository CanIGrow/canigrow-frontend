import React, { Component } from 'react';
import '../styles/App.css';

export default class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <h1 className="header-hamburger">&#9776;</h1>
      </div>
    );
  }
}
