import { takeLatest, put, call } from 'redux-saga/effects';
import { ACTION_TYPES } from './../common/constants';

const delay = (ms) => new Promise(res => setTimeout(res, ms))

function* login(action) {
  yield call(action.setApiRequestPending, true);
  yield delay(4000);
  yield call(action.setError, true);
  yield call(action.setApiRequestPending, false);
}


export function* watchLogin() {
  yield takeLatest(ACTION_TYPES.LOGIN, login);
}
