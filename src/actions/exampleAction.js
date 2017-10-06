// from: https://www.youtube.com/watch?v=_x3gitcwtAc
// https://github.com/buckyroberts/React-Redux-Boilerplate/blob/master/dev/js/actions/index.js

// Action Creator - the entire function, returns action object.
export const selectUser = (user) => {
    console.log("You clicked on user: ", user.first);
    // Action - contains a type and a payload. type is an identifier.
    return {
        type: 'USER_SELECTED',
        // payload is information given to the app to be conveyed to state.
        payload: user
    }
};
