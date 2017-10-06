// from: https://www.youtube.com/watch?v=_x3gitcwtAc
// https://github.com/buckyroberts/React-Redux-Boilerplate/blob/master/dev/js/actions/index.js
// https://medium.com/@MattiaManzati/tips-to-handle-authentication-in-redux-2-introducing-redux-saga-130d6872fbe7
// Action Creator - the entire function, returns action object.

// Triggered whenever the user clicks the login submit button
export const LOGIN_SUBMIT = 'core_auth/LOGIN_SUBMIT';
export function loginSubmit(data){
    return {
        // Action - contains a type and a payload. type is an identifier.
        type: LOGIN_SUBMIT,
        // payload is information given to the app to be conveyed to state.
        payload: data
    };
}

// Triggered whenever a login request is dispatched from whenever point in the code
export const LOGIN_REQUEST = 'core_auth/LOGIN_REQUEST';
export function loginRequest(data){
    return {
        type: LOGIN_REQUEST,
        payload: data
    };
}

// triggered when the login has succeded
export const LOGIN_SUCCESS = 'core_auth/LOGIN_SUCCESS';
export function loginSuccess(data){
    return {
        type: LOGIN_SUCCESS,
        payload: data
    };
}

// triggered when the login failed
export const LOGIN_ERROR = 'core_auth/LOGIN_ERROR';
export function loginError(errors){
    return {
        type: LOGIN_ERROR,
        error: true,
        payload: errors
    };
}

// triggered to logout the user
export const LOGOUT = 'core_auth/LOGOUT';
export function logout(){
    return {
        type: LOGOUT
    };
}
