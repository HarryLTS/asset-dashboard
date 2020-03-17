import { ACTION_TYPES } from './../common/constants';

const authToken = localStorage.getItem('reduxStateToken');
const initialState = {
  client: {
    authToken: authToken ? authToken : null,
    stockData: null,
    cashFlows: null,
    editLogs: null,
    estateData: null,
    cashAmount: 0,
  }
}

function rootReducer(state = initialState, action) {
    switch(action.type) {
      case ACTION_TYPES.SET_AUTH_TOKEN:
        state.client.authToken = action.value;
        return state;

      case ACTION_TYPES.SET_CLIENT_STOCK_DATA:
        state.client.stockData = action.value;
        return state;

      case ACTION_TYPES.SET_CLIENT_CASH_FLOWS:
        state.client.cashFlows = action.value;
        return state;

      case ACTION_TYPES.SET_CLIENT_EDIT_LOGS:
        state.client.editLogs = action.value;
        return state;

      case ACTION_TYPES.SET_CLIENT_CASH_AMOUNT:
        state.client.cashAmount = action.value;
        return state;

      case ACTION_TYPES.SET_CLIENT_ESTATE_DATA:
        state.client.estateData = action.value;
        return state;

      default:
        return state;
    }
}

export default rootReducer;
