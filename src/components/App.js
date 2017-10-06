import React, { Component } from 'react';
import '../styles/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import Homepage from './Homepage.js';
import Login from './Login.js';
import Plantpage from './Plantpage.js';
import Register from './Register.js';
import Userpage from './Userpage.js';
import BaseLayout from './Base-Layout.js';
// These are for redux.
import {Provider} from 'react-redux';
import {createStore, applyMiddleware} from 'redux';
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
      username: ''
    }
  }


  render() {
    return (
      // Provides store data to all subcomponents
      <Provider store={store}>
        <div className="AppInsideProvider">
          <BrowserRouter>
            <BaseLayout>
              <Switch>
                <Route exact path="/" component={Homepage} />
                <Route path="/plants/:plant" render={(props) => ( <Plantpage username={this.state.username}/> )}/>
                {/* <Route path="/plants/:plant" component={Plantpage} /> */}
                <Route path="/user/:user" component={Userpage} />
                <Route path="/login" render={(props) => ( <Login username={this.state.username}/> )}/>
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
