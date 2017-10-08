// This reducer handles changes to the template state within the store.
const templateReducer = function (state = 0, action) {
  // console.log(action.payload);
    switch (action.type) {
        case 'USER_TEMPLATE':
            return action.payload;
        default:
            return state;
    }
}

export default templateReducer;
