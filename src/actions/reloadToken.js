// Action Creator - the entire function, returns action object.
export const reloadContents = (token, username, email) => {
    // console.log("You have the token: ", token);
    // console.log("Username: ", username);
    return {
        type: 'TOKEN_RELOAD',
        payload: token
    }
};


export const reloadUsername = (username) => {
    return {
        type: 'USER_NAME',
        payload: username
    }
};

export const reloadEmail = (email) => {
    return {
        type: 'EMAIL_RELOAD',
        payload: email
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
