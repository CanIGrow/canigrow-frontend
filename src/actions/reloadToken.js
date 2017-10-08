// Action Creator - the entire function, returns action object.
export const reloadContents = (token, username) => {
    // console.log("You have the token: ", token);
    // console.log("Username: ", username);
    return {
        type: 'USER_RELOAD',
        payload: token, username
    }
};

export const logout = () => {
    console.log("logout");
    let payload = null;
    return {
        type: 'USER_LOGOUT',
        payload: payload
    }
};

export const reloadUsername = (username) => {
    // console.log("Username: ", username);
    return {
        type: 'USER_NAME',
        payload: username
    }
};

export const changeTemplate = (template) => {
    console.log("Template ID: ", template);
    return {
        type: 'USER_TEMPLATE',
        payload: template
    }
};
