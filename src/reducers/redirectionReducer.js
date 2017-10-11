// This reducer handles changes to the template state within the store.
const redirectionReducer = function (state = null, action) {
    switch (action.type) {
        case 'REDIRECT_DATA':
            return action.payload;
        default:
            return state;
    }
}

export default redirectionReducer;
