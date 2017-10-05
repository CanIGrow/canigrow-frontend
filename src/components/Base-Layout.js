import React, { Component } from 'react';
import '../styles/App.css';
import Header from './Header.js';
import Footer from './Footer.js';

export default class BaseLayout extends Component {
  render() {
    return (
      <div className="body">
        <Header />
        {this.props.children}
        <Footer />
      </div>
    );
  }
}
