import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {changeTemplate} from '../actions/reloadToken.js';
import request from 'superagent';

class Userlisiting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      data: false,
    };
  }

  componentWillMount() {
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/users/`)
      .end((err,res)=>{
        console.log(res);
        // if (res !== undefined){
        //   this.setState({data: });
        // }
      })
  }

  render() {
    return (
      <div className="userpage-container main-component-container">
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username,
      template: state.template
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({changeTemplate: changeTemplate}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Userlisiting);
