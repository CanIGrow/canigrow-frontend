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
// This is a container to test with.
import UserList from '../containers/user-list.js';
import UserDetail from '../containers/user-detail.js';


// This creates a store to hold app state data for redux.
const store = createStore(
    // This pulls data from the combined reducer into the store.
    allReducers,
    // applyMiddleware(thunk, promise, logger)
);

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoggedIn: false,
      username: "testing username",
      password:"",
      user_id: null,
      bio:"",
      style_number: 0,
      token: null
    };
  }

  render() {
    return (
      // Provides store data to all subcomponents
      <Provider store={store}>
        <div className="AppInsideProvider">
          <BrowserRouter>
            <BaseLayout>
              {/* The following is just to test redux. */}
              {/* <UserList />
              <UserDetail /> */}
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
