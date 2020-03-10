const initialState = {
  client: {
    apiRequestPending: false,
    user: {}
  }
}

function rootReducer(state = initialState, action) {
    switch(action.type) {
      case "SET_API_REQUEST_PENDING":
        state.apiRequestPending = action.value;

      case "SET_CLIENT_DATA":

      default:
        return state;
    }
}

export default rootReducer;
