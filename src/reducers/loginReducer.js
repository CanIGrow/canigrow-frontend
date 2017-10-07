// This reducer binds the loginAction.js to the reducer network that is then combined and sent to App.js
import update from 'immutability-helper';

const initialState = {
    token: null,
    username: null,
}

const loginReducer = function (state = null, action) {
  console.log("loginReducer");
  console.log(action.payload);
    switch (action.type) {
        case 'USER_TOKEN':
            return action.payload;
            break;
        case 'USER_RELOAD':
            return action.payload;
            // update(state, { })
            break;
        case 'USER_LOGOUT':
            return action.payload;
            // update(state, { })
            break;
    }
    // default:
    return state;
}

export default loginReducer;
