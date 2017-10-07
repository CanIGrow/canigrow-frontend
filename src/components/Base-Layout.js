import React, { Component } from 'react';
import '../styles/App.css';
import Header from './Header.js';
import Footer from './Footer.js';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reloadContents} from '../actions/reloadToken.js';

export default class BaseLayout extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        token: this.props.token,
      };
  }

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
