import {combineReducers} from 'redux';
import loginReducer from './loginReducer';
import usernameReducer from './usernameReducer';
/*
 * We combine all reducers into a single object before updated data is dispatched (sent) to store
 * Your entire applications state (store) is just whatever gets returned from all your reducers
 * */

const allReducers = combineReducers({
    token: loginReducer,
    username: usernameReducer
});

export default allReducers
// template code: https://github.com/buckyroberts/React-Redux-Boilerplate/blob/master/dev/js/reducers/index.js
