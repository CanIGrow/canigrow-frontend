import React, { Component } from 'react';
import '../styles/App.css';

export default class Header extends Component {
  render() {
    return (
      <div className="header-container">
        <button type="button"
          className="header-hamburger"
          data-toggle="modal"
          data-target="#myModal">
          &#9776;
        </button>
      </div>
    );
  }
}
