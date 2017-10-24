import React, { Component } from 'react';
import '../styles/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import cookie from 'react-cookies';
import Homepage from './Homepage.js';
import Login from './Login.js';
import Logout from './Logout.js';
import Plantpage from './Plantpage.js';
import Register from './Register.js';
import Userpage from './Userpage.js';
import BaseLayout from './Base-Layout.js';
import Userlisting from './Userlisting.js';
import PasswordReset from './PasswordReset.js';
import AuthenticationRequest from './AuthenticationRequest.js';
import PlantCalendar from './PlantCalendar.jsx';

import EditProfile from './EditProfile.js';

// These are for redux.
import {Provider} from 'react-redux';
import {createStore} from 'redux';
import request from 'superagent';
// import {applyMiddleware} from 'redux';
import allReducers from '../reducers/indexReducer.js';

/*
https://stackoverflow.com/questions/391979/how-to-get-clients-ip-address-using-javascript-only?page=1&tab=votes#tab-top
ACCURATE:
https://ipinfo.io/json
10k requests per hour for testing:
https://freegeoip.net/json/
IP only:
https://jsonip.com/
*/

// This creates a store to hold app state data for redux.
const store = createStore(
    allReducers,
    // applyMiddleware(thunk, promise, logger)
);

// store.getState();

class App extends Component {
  constructor(){
    super()
    this.state = {
      password:"",
      user_id: null,
      bio:"",
      email:"",
      template: 0,
      token: null,
      allplantdata: false,
    };
  }

  componentWillMount() {
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    this.setState({
      token: cookie.load('token'),
      username: cookie.load('username'),
      email: cookie.load('email'),
    });
    request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/`)
      .end((err,res)=>{
        if (res !== undefined){
          let status_code_string = res.statusCode;
          status_code_string = status_code_string.toString();
          if( status_code_string.charAt(0) === '2' ){
            let plantsarray = [];
            res.body.plants.map((x, i) =>{
              if (x.common_name !== null){
                plantsarray.push(x);
              }
              return null
            });
            this.setState({ allplantdata:plantsarray });
          } else {
            // console.log(res.statusCode);
          }
        }
      })
    }
  render() {
    return (
      // Provides store data to all subcomponents
      <Provider store={store}>
        <div className="AppInsideProvider">
          <BrowserRouter>
            <BaseLayout template={this.state.template}>
              <Switch>
                <Route exact path="/canigrow-frontend/" render={(props) => ( <Homepage allplantdata={this.state.allplantdata}/> )}/>
                <Route path="/canigrow-frontend/calendar/:plant" render={(props) => ( <PlantCalendar username={this.state.username}/> )}/>
                <Route path="/canigrow-frontend/plants/:plant" render={(props) => ( <Plantpage username={this.state.username}/> )}/>
                {/* <Route path="/plants/:plant" component={Plantpage} /> */}
                <Route path="/canigrow-frontend/login/password_reset" component={PasswordReset} />
                <Route path="/canigrow-frontend/login/authentication_request" component={AuthenticationRequest} />
                <Route path="/canigrow-frontend/user/:user" render={(props) => ( <Userpage /> )}/>
                <Route path="/canigrow-frontend/users"  component={Userlisting} />
                <Route path="/canigrow-frontend/login" render={(props) => ( <Login username={this.state.username}/> )}/>
                <Route path="/canigrow-frontend/logout" render={(props) => ( <Logout/> )}/>
                <Route path="/canigrow-frontend/edit/:user" render={(props) => ( <EditProfile/> )}/>
                {/* <Route path="/login" component={Login} /> */}
                <Route path="/canigrow-frontend/register" component={Register} />
                {/* This redirects certain paths used on deployment. */}
                {["/home", "/canigrow-frontend/"].map((path,i) =>
                  <Route path={path} key={i} render={(props) => ( <Homepage allplantdata={this.state.allplantdata}/> )}/>
                )}
              </Switch>
            </BaseLayout>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
