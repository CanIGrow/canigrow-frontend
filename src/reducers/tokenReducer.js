// This reducer binds the loginAction.js to the reducer network that is then combined and sent to App.js
// import update from 'immutability-helper';
//
// const initialState = {
//     token: null,
//     username: null,
// }

// This handles all changes to the token state within the store.
const tokenReducer = function (state = null, action) {
    switch (action.type) {
        // This adds the token to the store upon login.
        case 'TOKEN_ADD':
            return action.payload;
            // break;
        // This removes the token from the store upon logout.
        case 'USER_LOGOUT':
            return action.payload;
            // update(state, { })
            // break;
        default:
            return state;
    }
    // default:
    // return state;
}

export default tokenReducer;
