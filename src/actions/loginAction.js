export const CREATE_TODO = 'CREATE_TODO';

const makeActionCreator = function (actionType) {
  console.log("action.js on");
  return function (payload) {
    return {
      type: actionType,
      payload: payload
    }
  }
}

export const createTodo = makeActionCreator(CREATE_TODO);
