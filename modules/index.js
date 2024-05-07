// 루트 리듀서
import { combineReducers } from 'redux';
import users from './users';

const rootReducer = combineReducers({ users });

export default rootReducer;
