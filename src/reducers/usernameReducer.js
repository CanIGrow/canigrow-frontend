import update from 'immutability-helper';

const initialState = {
    token: null,
    username: null,
}

const usernameReducer = function (state = null, action) {
  console.log("usernameReducer");
  console.log(action.payload);
    switch (action.type) {
        case 'USER_NAME':
            return action.payload;
            break;
    }
    // default:
    return state;
}

export default usernameReducer;
