import React, { Component } from 'react';
import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import { NavLink } from 'react-router-dom';
import { Redirect } from 'react-router-dom';
import request from 'superagent';
import {setLogin} from '../actions/loginAction.js';
import {reloadUsername} from '../actions/reloadToken.js';
import cookie from 'react-cookies';
import '../styles/App.css';

class Login extends Component {
  constructor(props) {
      super(props)
      this.state = {
        username: '',
        password: '',
        token: this.props.token,
        error: '',
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
     let setLogin = this.props.setLogin;
    //  This les the user 'bypass' cors.
     const proxyurl = "https://boiling-castle-73930.herokuapp.com/";

     event.preventDefault();
     console.log(this.state.username);
     console.log(this.state.password);
     request


      //  .post("https://pure-spire-67730.herokuapp.com/users/login")
      //  .send({username: this.state.username, password: this.state.password})

      .post(`${proxyurl}https://canigrow.herokuapp.com/api/users/login`)
      .send({email: this.state.username, password: this.state.password})
       .end((err, res) => {
         if (err) {
           if (res !== undefined){
             this.setState({error: res.body.error});
           }
           console.log("error");
         } else {
          // These call functions from actions to send the token and username to the reducers then the store.
          setLogin(res.body.token, this.state.username);
          this.props.reloadUsername(this.state.username);
          // These save the username and token to cookies.
          cookie.save('token', res.body.token);
          cookie.save('username', this.state.username);
          console.log("login props");
          console.log(this.props);
          console.log("token returned");
          console.log(res.body);
          console.log(this.state.username);
          console.log(this.state.token);
         }
       })
  }

  render() {
    // This render's contents are determined by whether the user is logged in.
    let loginContents = null;
    console.log(this.props.token);
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
        {/* // This redirects when the user is logged in (has a token). */}
        {this.props.token && (
           <Redirect to={`/`}/>
         )}
      </div>
    )
  }
}

function mapStateToProps(state) {
    return {
      token: state.token,
      username: state.username
    };
}

function matchDispatchToProps(dispatch){
    // binds the action creation of prop to action. selectUser is a function imported above. Dispatch calls the function.
    return bindActionCreators({setLogin: setLogin, reloadUsername: reloadUsername}, dispatch);
}

export default connect(mapStateToProps, matchDispatchToProps)(Login);
