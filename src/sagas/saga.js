import { takeLatest, put, call } from 'redux-saga/effects';
import { ACTION_TYPES } from './../common/constants';

//const delay = (ms) => new Promise(res => setTimeout(res, ms));


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
    yield put({ type: 'SET_AUTH_TOKEN', value: responseData.auth_token });
    yield call(action.redirectToHome);

  } else {
    yield call(action.setError, true);
    yield call(action.setApiRequestPending, false);
  }
}


export function* watchLogin() {
  yield takeLatest(ACTION_TYPES.LOGIN, login);
}
