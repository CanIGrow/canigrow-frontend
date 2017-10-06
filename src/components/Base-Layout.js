import React, { Component } from 'react';
import '../styles/App.css';
import Header from './Header.js';
import Footer from './Footer.js';
import cookie from 'react-cookies';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {reloadContents} from '../actions/reloadToken.js';

class BaseLayout extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        token: this.props.token,
      };
  }

  // componentWillMount(){
  //   console.log("BaseLayout Mounted")
  //   this.checklogin();
  // }
  // checklogin(){
  //   console.log(cookie.load('token'));
  //   if(cookie.load('token') !== null){
  //     this.props.reloadContents(cookie.load('token'), cookie.load('username'));
  //   }
  // }

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
//
// function mapStateToProps(state) {
//     return {
//       token: state.token,
//       username: state.username
//     };
// }
//
// function matchDispatchToProps(dispatch){
//     // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
//     return bindActionCreators({reloadContents: reloadContents}, dispatch);
// }
//
// export default connect(mapStateToProps, matchDispatchToProps)(BaseLayout);

export default BaseLayout;
