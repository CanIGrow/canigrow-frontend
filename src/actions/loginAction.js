// export const CREATE_TODO = 'CREATE_TODO';
//
// const makeActionCreator = function (actionType) {
//   console.log("action.js on");
//   return function (payload) {
//     return {
//       type: actionType,
//       payload: payload
//     }
//   }
// }
//
// export const createTodo = makeActionCreator(CREATE_TODO);


// Action Creator - the entire function, returns action object.
export const setLogin = (token) => {
    console.log("You have the token: ", token);
    // Action - contains a type and a payload. type is an identifier.
    return {
        type: 'USER_TOKEN',
        // payload is information given to the app to be conveyed to state.
        payload: token
    }
};
