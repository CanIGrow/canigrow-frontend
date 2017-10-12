// This action handles a zipcode returned from the server upon access of the homepage.

// Action Creator - the entire function, returns action object.
export const setZip = (zipcode) => {
    console.log("You are located at zipcode: ", zipcode);
    // Action - contains a type and a payload. type is an identifier.
    return {
        // This type is read in zipcodeReducer.js
        type: 'USER_ZIPCODE',
        // payload is information given to the app to be conveyed to state.
        payload: zipcode
    }
};
