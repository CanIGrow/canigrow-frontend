import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from 'react-router-dom';
import request from 'superagent';
import {setToken,setUsername,setEmail,redirectAction} from '../actions/actions.js';
// import cookie from 'react-cookies';
import '../styles/App.css';

class PasswordReset extends Component {
  constructor(props) {
      super(props)
      this.state = {
        fireredirect: false,
        message: false,
        username: '',
        password: '',
        token: this.props.token,
        error: '',
        testing: "",
      };
  }

  componentWillMount() {
    if (this.props.redirection && this.props.redirection[0] !== undefined){
      this.setState({message:this.props.redirection[1]}, ()=>{
        this.props.redirectAction([false, false]);
      });
    }
  }
  componentDidUpdate(){
    if (this.props.redirection[0] !== undefined && this.props.redirection[0]){
      this.setState({fireredirect:true});
    }
  }
  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  resetPasswordEmail(event) {
    //  This lets the user 'bypass' CORs via proxy.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
     event.preventDefault();
     request
      .post(`${proxyurl}https://canigrow.herokuapp.com/password_resets`)
      .send({email: this.state.username})
       .end((err, res) => {
         if (err) {
            this.setState({error: res.body.error});
         } else {
           if (res !== undefined){
            console.log(res.body);
            this.setState({error: res.body.message});
           }
         }
       })
  }

  render() {
    // This render's contents are determined by whether the user is logged in.
    let passwordResetContents = null;
    if (this.props.token) {
      passwordResetContents =
      <div className="centerHomeButton">
        <NavLink className="btn btn-primary btn-lg" type="submit" activeClassName="selected" to="/">
          <div>Login Successful!</div>
          <div>You are now logged in as: {this.props.username}</div>
          <span>Homepage</span>
        </NavLink>
      </div>
    } else {
      passwordResetContents =
         <div className="container-fluid">
            <div className="card margin-top-108px">
              {this.state.error && <div className="alert">{this.state.error}</div>}
              <div className="card-block">
                <div>{this.state.token}</div>
                <h3>Password Reset Form:</h3>
                <form className="enterForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <h6>Email:</h6>
                    <input type="username" onChange={this.updateFromField('username')} value={this.state.username} placeholder="user@gmail.org"/>
                  </div>
                  {this.state.message ? this.state.message : ""}<br/>
                  <div className="form-group pull-right">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.resetPasswordEmail(event)}>Get Emailed Authorization Link</button>
                  </div>
                </form>
              </div>
            </div>
         </div>
    }
    return (
      <div>
        {passwordResetContents}


        {/* // This redirects when the user is logged in (has a token). */}
        {/* {this.props.token && (
           <Redirect to={`/`}/>
         )}
        {this.state.fireredirect && (
            <Redirect to={this.props.redirection[0]}/>
          )} */}


      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username,
      redirection: state.redirection,
      email: state.email
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setEmail:setEmail, setUsername:setUsername, setToken:setToken, redirectAction: redirectAction}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(PasswordReset);
