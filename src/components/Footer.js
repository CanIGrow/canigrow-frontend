import React, { Component } from 'react';
import '../styles/App.css';

export default class Footer extends Component {
  render() {
    return (
      <div className="footer-sub-container">
        {/* <footer id="footer"> */}
          <div id="footer-content">
                <p className="margin-left-20pt">CanIGrow - for all your plant needs</p>
                <p className="margin-left-20pt">© 2017 CanIGrow, Inc.</p>
                {/* <p className="margin-left-20pt">Terms of Use Privacy</p> */}
          </div>
        {/* </footer> */}
      </div>
    );
  }
}
