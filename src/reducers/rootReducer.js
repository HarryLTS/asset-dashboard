const initialState = {
  authToken: null,
}
const persistedState = localStorage.getItem('reduxState')
                       ? JSON.parse(localStorage.getItem('reduxState'))
                       : initialState;


function rootReducer(state = persistedState, action) {
    switch(action.type) {
      case "SET_AUTH_TOKEN":
        state.authToken = action.value;
        return state;
        
      default:
        return state;
    }
}

export default rootReducer;
