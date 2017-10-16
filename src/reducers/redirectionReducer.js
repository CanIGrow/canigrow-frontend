const redirectionReducer = function (state = null, action) {
    switch (action.type) {
        case 'REDIRECT_DATA':
            return action.payload;
        default:
            return state;
    }
}
export default redirectionReducer;
