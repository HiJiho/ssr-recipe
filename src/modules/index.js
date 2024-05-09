// 루트 리듀서
import { combineReducers } from 'redux';
import { all } from 'redux-saga/effects';
import users, { usersSaga } from './users';

export function* rootSaga() {
	yield all([usersSaga()]);
}

const rootReducer = combineReducers({ users });
export default rootReducer;
