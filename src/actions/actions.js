// This action handles a token returned from the server upon successful login.

// Action Creator - the entire function, returns action object.
export const setToken = (token) => {
    // Action - contains a type and a payload. type is an identifier.
    return {
        // This type is read in tokenReducer.js
        type: 'TOKEN_ADD',
        // payload is information given to the app to be conveyed to state.
        payload: token
    }
};

// Action Creator - the entire function, returns action object.
export const setUsername = (username) => {
    // Action - contains a type and a payload. type is an identifier.
    return {
        // This type is read in tokenReducer.js
        type: 'USERNAME_ADD',
        // payload is information given to the app to be conveyed to state.
        payload: username
    }
};

// Action Creator - the entire function, returns action object.
export const setEmail = (email) => {
    // Action - contains a type and a payload. type is an identifier.
    return {
        // This type is read in tokenReducer.js
        type: 'EMAIL_ADD',
        // payload is information given to the app to be conveyed to state.
        payload: email
    }
};

// Action Creator - the entire function, returns action object.
export const redirectAction = (redirection) => {
    // Action - contains a type and a payload. type is an identifier.
    return {
        // This type is read in tokenReducer.js
        type: 'REDIRECT_DATA',
        // payload is information given to the app to be conveyed to state.
        payload: redirection
    }
};


export const logout = () => {
    let payload = null;
    return {
        type: 'USER_LOGOUT',
        payload: payload
    }
};

export const changeTemplate = (template) => {
    console.log("Template ID: ", template);
    return {
        type: 'USER_TEMPLATE',
        payload: template
    }
};
