// This reducer binds the loginAction.js to the reducer network that is then combined and sent to App.js
import update from 'immutability-helper';
import {CREATE_TODO} from "../src/actions/loginAction.js";

export default function (state = null, action) {
    switch (action.type) {
        case 'USER_LOGIN':
            return action.payload;
            break;
    }
    return state;
}
