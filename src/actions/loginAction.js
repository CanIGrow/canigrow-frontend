// This action handles a token returned from the server upon successful login.

// Action Creator - the entire function, returns action object.
export const setLogin = (token) => {
    console.log("You have the token: ", token);
    // Action - contains a type and a payload. type is an identifier.
    return {
        // This type is read in loginReducer.js
        type: 'USER_TOKEN',
        // payload is information given to the app to be conveyed to state.
        payload: token
    }
};
