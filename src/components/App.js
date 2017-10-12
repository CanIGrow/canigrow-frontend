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
      template: 0,
      email:"",
      token: null,
      allplantdata: false,
    };
  }

  componentWillMount() {
    // console.log();
    const proxyurl = "https://boiling-castle-73930.herokuapp.com/";
    this.setState({
      token: cookie.load('token'),
      username: cookie.load('username'),
      template: cookie.load('template'),
      email: cookie.load('email'),
    }, ()=>{
      if (cookie.load("template") !== undefined){
        this.changeTemplate(cookie.load('template'));
      }
    });
    request
      .get(`${proxyurl}https://canigrow.herokuapp.com/api/plants/`)
      .end((err,res)=>{
        if (res !== undefined){
          let plantsarray = [];
          res.body.plants.map((x, i) =>{
            if (x.common_name !== null){
              plantsarray.push(x);
            }
            return null
          });
          this.setState({ allplantdata:plantsarray });
        }
      })
    }

  changeTemplate(new_style){
    new_style = parseInt(new_style, 10);
    this.setState({template: new_style});
    cookie.save('template', new_style);
  }


  render() {
    console.log(store.getState());
    return (
      // Provides store data to all subcomponents
      <Provider store={store}>
        <div className="AppInsideProvider">
          <BrowserRouter>
            <BaseLayout template={this.state.template}>
              <Switch>
                <Route exact path="/" render={(props) => ( <Homepage allplantdata={this.state.allplantdata}/> )}/>
                <Route path="/plants/:plant" render={(props) => ( <Plantpage username={this.state.username}/> )}/>
                {/* <Route path="/plants/:plant" component={Plantpage} /> */}
                <Route path="/user/:user" render={(props) => ( <Userpage newTemplate={this.changeTemplate.bind(this)}/> )}/>
                <Route path="/users"  component={Userlisting} />
                <Route path="/login" render={(props) => ( <Login username={this.state.username}/> )}/>
                <Route path="/logout" render={(props) => ( <Logout/> )}/>
                {/* <Route path="/login" component={Login} /> */}
                <Route path="/register" component={Register} />
              </Switch>
            </BaseLayout>
          </BrowserRouter>
        </div>
      </Provider>
    );
  }
}

export default App;
