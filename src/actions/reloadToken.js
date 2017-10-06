// Action Creator - the entire function, returns action object.
export const reloadContents = (token, username) => {
    console.log("You have the token: ", token);
    console.log("Username: ", username);
    // Action - contains a type and a payload. type is an identifier.
    return {
        type: 'USER_RELOAD',
        // payload is information given to the app to be conveyed to state.
        payload: token, username
    }
};
