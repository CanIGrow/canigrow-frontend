import {combineReducers} from 'redux';
import tokenReducer from './tokenReducer';
import usernameReducer from './usernameReducer';
import redirectionReducer from './redirectionReducer';
import zipcodeReducer from './zipcodeReducer';
import emailReducer from './emailReducer';

/*
tokenReducer
 * This combines all reducers into a single object before updated data is dispatched (sent) to store.
 * The entire application's state (store) is just whatever gets returned from all the reducers.
 * */

const allReducers = combineReducers({
    token: tokenReducer,
    username: usernameReducer,
    redirection: redirectionReducer,
    zipcode: zipcodeReducer,
    email: emailReducer
});

export default allReducers
// template code: https://github.com/buckyroberts/React-Redux-Boilerplate/blob/master/dev/js/reducers/index.js
