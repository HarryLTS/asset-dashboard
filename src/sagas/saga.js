import { takeLatest, put, call, all, fork } from 'redux-saga/effects';
import { ACTION_TYPES } from './../common/constants';

function* login(action) {
  yield call(action.setApiRequestPending, true);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", action.email);
  urlencoded.append("password", action.password);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/token/login", requestOptions);
  const result = yield response.text();
  const responseData = JSON.parse(result);

  if (responseData.hasOwnProperty('auth_token')) {
    yield put({ type: ACTION_TYPES.SET_AUTH_TOKEN, value: responseData.auth_token });
    yield call(action.redirectToHome);

  } else {
    yield call(action.setError, true);
    yield call(action.setApiRequestPending, false);
  }
}

function* watchLogin() {
  yield takeLatest(ACTION_TYPES.LOGIN, login);
}

function* logout(action) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/token/logout", requestOptions);
  yield response.text();

  yield put({ type: ACTION_TYPES.SET_AUTH_TOKEN, value: null });
  action.redirectToLogin();
}

function* watchLogout() {
  yield takeLatest(ACTION_TYPES.LOGOUT, logout);
}

function* loadClientStockData(action) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/stock-view", requestOptions);
  const result = yield response.text();

  const responseData = JSON.parse(result);

  if (responseData.hasOwnProperty('stock_data')) {
    yield put({type: ACTION_TYPES.SET_CLIENT_STOCK_DATA, value: responseData.stock_data});
  } else {
    yield put({ type: ACTION_TYPES.SET_AUTH_TOKEN, value: null });
  }
}

function* watchLoadClientStockData() {
  yield takeLatest(ACTION_TYPES.LOAD_CLIENT_STOCK_DATA, loadClientStockData);
}

function* register(action) {
  yield call(action.setApiRequestPending, true);

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");

  var urlencoded = new URLSearchParams();
  urlencoded.append("email", action.email);
  urlencoded.append("password", action.password);
  urlencoded.append("username", action.username);

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: urlencoded,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/users/", requestOptions);
  const result = yield response.text();
  const responseData = JSON.parse(result);

  if (responseData.hasOwnProperty('id')) {
    yield call(action.redirectToLogin);
  } else {
    yield call(action.handleError, responseData);
    yield call(action.setApiRequestPending, false);
  }
}

function* watchRegister() {
  yield takeLatest(ACTION_TYPES.REGISTER, register);
}

function* updateClientStockData(action) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);
  myHeaders.append("stockcommand", action.command);
  myHeaders.append("stocksymbol", action.symbol);
  if (action.command === "add" || action.command === "edit") {
    myHeaders.append("stockquantity", action.quantity);
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/stock-view", requestOptions);
  yield response.text();

  yield call(loadClientStockData, {'type': ACTION_TYPES.LOAD_CLIENT_STOCK_DATA, 'authToken': action.authToken});
}



function* watchUpdateClientStockData() {
  yield takeLatest(ACTION_TYPES.UPDATE_CLIENT_STOCK_DATA, updateClientStockData);
}

function *getClientCashFlows(action) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/cash-view", requestOptions);
  const result = yield response.text();

  const responseData = JSON.parse(result);

  if (responseData.hasOwnProperty('cash_flows') && responseData.hasOwnProperty('cash_amount')) {
    yield put({type: ACTION_TYPES.SET_CLIENT_CASH_FLOWS, value: responseData.cash_flows});
    yield put({type: ACTION_TYPES.SET_CLIENT_CASH_AMOUNT, value: responseData.cash_amount});
  } else {
    yield put({ type: ACTION_TYPES.SET_AUTH_TOKEN, value: null });
  }
}

function *watchGetClientCashFlows() {
  yield takeLatest(ACTION_TYPES.GET_CLIENT_CASH_FLOWS, getClientCashFlows);
}

function* updateClientCashFlows(action) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);
  myHeaders.append("cashflowcommand", action.command);

  if (action.command == 'add' || action.command == 'edit') {
    myHeaders.append("cashflowtitle", action.title);
    myHeaders.append("cashflowvalue", action.value);
    myHeaders.append("cashflowfrequency", action.frequency);
  }

  if (action.command === "edit" || action.command == 'remove') {
    myHeaders.append("cashflowid", action.id);
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/cash-view", requestOptions);
  yield response.text();
  yield call(getClientCashFlows, {'type': ACTION_TYPES.GET_CLIENT_CASH_FLOWS, 'authToken': action.authToken});

}

function* watchUpdateClientCashFlows() {
  yield takeLatest(ACTION_TYPES.UPDATE_CLIENT_CASH_FLOWS, updateClientCashFlows);
}

function* updateClientEditLogs(action) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);
  myHeaders.append("editlogcommand", action.command);

  if (action.command == 'add') {
    myHeaders.append("editlogvalue", action.value);
    myHeaders.append("editlogdescription", action.description);
  }

  if (action.command == 'remove') {
    myHeaders.append("editlogid", action.id);
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/edit-log-view", requestOptions);
  yield response.text();


  yield call(getClientEditLogs, {'type': ACTION_TYPES.GET_CLIENT_EDIT_LOGS, 'authToken': action.authToken});
  yield call(getClientCashFlows, {'type': ACTION_TYPES.GET_CLIENT_CASH_FLOWS, 'authToken': action.authToken});
}

function* watchUpdateClientEditLogs() {
  yield takeLatest(ACTION_TYPES.UPDATE_CLIENT_EDIT_LOGS, updateClientEditLogs);
}

function* getClientEditLogs(action) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/edit-log-view", requestOptions);
  const result = yield response.text();

  const responseData = JSON.parse(result);

  if (responseData.hasOwnProperty('edit_logs')) {
    yield put({type: ACTION_TYPES.SET_CLIENT_EDIT_LOGS, value: responseData.edit_logs});
  } else {
    yield put({ type: ACTION_TYPES.SET_AUTH_TOKEN, value: null });
  }
}

function* watchGetClientEditLogs() {
  yield takeLatest(ACTION_TYPES.GET_CLIENT_EDIT_LOGS, getClientEditLogs);
}

function* loadClientEstateData(action) {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);

  var requestOptions = {
    method: 'GET',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/estate-view", requestOptions);
  const result = yield response.text();

  const responseData = JSON.parse(result);

  if (responseData.hasOwnProperty('estate_data')) {
    yield put({type: ACTION_TYPES.SET_CLIENT_ESTATE_DATA, value: responseData.estate_data});
  } else {
    yield put({ type: ACTION_TYPES.SET_AUTH_TOKEN, value: null });
  }
}

function* watchLoadClientEstateData() {
  yield takeLatest(ACTION_TYPES.LOAD_CLIENT_ESTATE_DATA, loadClientEstateData);
}

function* updateClientEstateData(action) {

  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/x-www-form-urlencoded");
  myHeaders.append("Authorization", "Token " + action.authToken);
  myHeaders.append("estatecommand", action.command);

  if (action.command === 'add' || action.command === 'edit') {
    myHeaders.append('estateaddress', action.address)
    myHeaders.append("estatevalue", action.value);
    myHeaders.append("estateipr", action.isPrimaryResidence);
  }

  if (action.command === 'remove' || action.command === 'edit') {
    myHeaders.append("estateid", action.id);
  }

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    redirect: 'follow'
  };

  const response = yield call(fetch, "http://localhost:8000/auth/estate-view", requestOptions);
  yield response.text();


  yield call(loadClientEstateData, {'type': ACTION_TYPES.LOAD_CLIENT_ESTATE_DATA, 'authToken': action.authToken});
}

function* watchUpdateClientEstateData() {
  yield takeLatest(ACTION_TYPES.UPDATE_CLIENT_ESTATE_DATA, updateClientEstateData);
}

export default function* rootSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLoadClientStockData),
    fork(watchRegister),
    fork(watchUpdateClientStockData),
    fork(watchLogout),
    fork(watchUpdateClientCashFlows),
    fork(watchGetClientCashFlows),
    fork(watchUpdateClientEditLogs),
    fork(watchGetClientEditLogs),
    fork(watchLoadClientEstateData),
    fork(watchUpdateClientEstateData)
  ]);
}
