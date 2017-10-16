const zipcodeReducer = function (state = null, action) {
    switch (action.type) {
        case 'USER_ZIPCODE':
            return action.payload;
        default:
            return state;
    }
}
export default zipcodeReducer;
