// These are parts used in alternative ways to transfer data to the store.
// import update from 'immutability-helper';
// const initialState = {
//     token: null,
//     username: null,
// }

// This reducer handles changes to the username state within the store.
const usernameReducer = function (state = null, action) {
  // console.log("usernameReducer");
  // console.log(action.payload);
    switch (action.type) {
        // This adds the username to the store on successful login.
        case 'USER_NAME':
            return action.payload;
            // break;
        // This removes the username from the store on logout.
        case 'USER_LOGOUT':
            return action.payload;
            // break;
        default:
            return state;
    }
    // default:
    // return state;
}

export default usernameReducer;
