// This reducer binds the loginAction.js to the reducer network that is then combined and sent to App.js
import update from 'immutability-helper';
// import {CREATE_TODO} from "../src/actions/loginAction.js";

const loginReducer = function (state = null, action) {
  console.log("loginReducer");
  console.log(action.payload);
    switch (action.type) {
        case 'USER_TOKEN':
            return action.payload;
            break;
    }
    return state;
}

export default loginReducer;
