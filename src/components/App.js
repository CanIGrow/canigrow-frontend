import React, { Component } from 'react';
import '../styles/App.css';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import cookie from 'react-cookies';
import Homepage from './Homepage.js';
import Login from './Login.js';
import Plantpage from './Plantpage.js';
import Register from './Register.js';
import Userpage from './Userpage.js';
import BaseLayout from './Base-Layout.js';
// These are for redux.
import {Provider} from 'react-redux';
import {createStore} from 'redux';
// import {applyMiddleware} from 'redux';
import allReducers from '../reducers/indexReducer.js';


// This creates a store to hold app state data for redux.
const store = createStore(
    // This pulls data from the combined reducer into the store.
    allReducers,
    // applyMiddleware(thunk, promise, logger)
);

// store.getState();

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password:"",
      user_id: null,
      bio:"",
      template: 0,
      token: null
    };
  }

  componentWillMount() {
      this.setState({
        token: cookie.load('token'),
        username: cookie.load('username'),
        template: cookie.load('template')
      });
  }

  changeTemplate(new_style){
    console.log("Style changed in app.",new_style)
    new_style = parseInt(new_style, 10);
    this.setState({template: new_style});
    cookie.save('template', new_style);
  }


  render() {
    console.log(store.getState(this.state.template));
    return (
      // Provides store data to all subcomponents
      <Provider store={store}>
        <div className="AppInsideProvider">
          <BrowserRouter>
            <BaseLayout template={this.state.template}>
              <Switch>
                <Route exact path="/" component={Homepage} />
                <Route path="/plants/:plant" render={(props) => ( <Plantpage username={this.state.username}/> )}/>
                {/* <Route path="/plants/:plant" component={Plantpage} /> */}
                <Route path="/user/:user" render={(props) => ( <Userpage newTemplate={this.changeTemplate.bind(this)}/> )}/>
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
