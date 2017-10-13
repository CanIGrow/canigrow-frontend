// This reducer handles changes to the template state within the store.
const zipcodeReducer = function (state = null, action) {
  console.log(action.payload);
    switch (action.type) {
        case 'USER_ZIPCODE':
            return action.payload;
        default:
            return state;
    }
}

export default zipcodeReducer;
