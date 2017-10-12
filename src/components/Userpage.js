import React, { Component } from 'react';
// import { NavLink } from 'react-router-dom';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import '../styles/App.css';
import {changeTemplate} from '../actions/reloadToken.js';
import {redirectAction} from '../actions/redirectionAction.js';
import cookie from 'react-cookies';
import { Redirect } from 'react-router-dom';

class Userpage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      fireredirect: false,
      message: false,
      username: this.props.username,
      user: null,
      template: this.props.template,
      bio: ''
    };
  }

  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
      console.log(this.props);
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value},()=>{
          this.updateTemplate();
        });
      }
    }

  updateTemplate() {
    console.log(this.props.template);
    let changeTemplate = this.props.changeTemplate;
    changeTemplate(this.state.template);
    this.props.newTemplate(this.state.template);
    console.log(this.props.template);
    console.log(this.props);
  }

  render() {
    let askQuestion = {
        "marginTop": "30pt",
    }
    return (
      <div className="userpage-container main-component-container">
        <h1>This is a Userpage</h1>

        <div style={askQuestion}>
                    <div>Change the Background</div>
                    <form >
                      {/* onSubmit={this.handleSubmit} */}
                    <select name="templates" onChange={this.updateFromField('template')} value={cookie.load('template')}>
                      <option value="0">Classic</option>
                      <option value="1">Blue</option>
                      <option value="2">Shooting Stars</option>
                      <option value="3">Twinkle Stars</option>
                      <option value="4">Mountains</option>
                      <option value="5">Reef</option>
                      <option value="6">Rain Drops</option>
                      <option value="7">Cherry Blossom</option>
                    </select>
                    <br/>
                    {/* onClick={event => this.updateTemplate(event)} */}
                    </form>
                  </div>
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

export default connect(mapStateToProps, matchDispatchToProps)(Userpage);
