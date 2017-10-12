import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {changeTemplate} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';
import request from 'superagent';
import { Redirect } from 'react-router-dom';

class Userlisiting extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
      message: false,
      data: false,
    };
  }

  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
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
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }
  render() {
    return (
      <div className="userpage-container main-component-container">
      {this.state.fireredirect && (
          <Redirect to={this.props.redirection[0]}/>
        )}
      </div>
    );
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username,
      template: state.template,
      redirection: state.redirection,
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({changeTemplate: changeTemplate, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Userlisiting);
