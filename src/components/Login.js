import React, { Component } from 'react';
import {connect} from 'react-redux';
import { NavLink } from 'react-router-dom';
import { BrowserRouter, Route, Switch, Router, withRouter, Redirect } from 'react-router-dom';
import request from 'superagent';
import '../styles/App.css';

class Login extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        password: '',
        token: this.props.token,
        error: '',
        comments: []
      };
  }

  componentWillMount() {
      console.log(this.props);
  }

  updateFromField(stateKey) {
      return (event) => {
        this.setState({[stateKey]: event.target.value});
      }
  }

  login(event) {
     let setToken = this.props.setToken;
     event.preventDefault();
     request
       .post("https://pure-spire-67730.herokuapp.com/users/login")
       .send({username: this.state.username, password: this.state.password})
       .end((err, res) => {
         if (err) {
           this.setState({error: res.body.error});
           console.log("error");
         } else {
          //  setToken(res.body.token, this.state.username, res.body.user_id);
           console.log("token returned");
           console.log(res.body);
           console.log(res.body.token);
           console.log(res.body.user_id);
           console.log(this.state.username);
          //  console.log(this.props.Router);
            // return (
            //   <Redirect to='/'/>
            // )
         }
       })
  }


  render() {

    let loginContents = null;
    if (this.props.token) {
      loginContents =
      <div className="centerHomeButton">
        <NavLink className="btn btn-primary btn-lg" type="submit" activeClassName="selected" to="/">
          <div>Login Successful!</div>
          <div>You are now logged in as: {this.props.username}</div>
          <span>Homepage</span>
        </NavLink>
      </div>
    } else {
      loginContents =
         <div className="container-fluid">
            <div className="card">
              {this.state.error && <div className="alert">{this.state.error}</div>}
              <div className="card-block">
                <div>{this.state.token}</div>
                <h3>Login Form:</h3>
                <form className="enterForm" onSubmit={this.handleFormSubmit}>
                  <div className="form-group">
                    <h6>User Name:</h6>
                    <input type="username" onChange={this.updateFromField('username')} value={this.state.username} placeholder="User Name"/>
                  </div>
                  <div className="form-group">
                    <h6>Password:</h6>
                    <input type="password" onChange={this.updateFromField('password')} value={this.state.password} placeholder="********"/>
                  </div>
                  <div className="form-group pull-right">
                    <button className="btn btn-primary btn-lg" type="submit" onClick={event => this.login(event)}>Login</button>
                  </div>
                </form>
              </div>
            </div>
         </div>
    }
    return (
      <div>
        {loginContents}
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
        user: state.activeUser
    };
}

export default connect(mapStateToProps)(Login);
