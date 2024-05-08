import axios from 'axios';
import { call, put, takeEvery } from 'redux-saga/effects';

// 액션 타입
const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
const GET_USERS_FAILURE = 'users/GET_USERS_FAILURE';
// redux-saga를 위한 액션 타입
const GET_USER = 'users/GET_USER';
const GET_USER_SUCCESS = 'users/GET_USER_SUCCESS';
const GET_USER_FAILURE = 'users/GET_USER_FAILURE';

// 액션 생성 함수
const getUsersPending = () => ({ type: GET_USERS_PENDING });
const getUsersSuccess = (payload) => ({ type: GET_USERS_SUCCESS, payload });
const getUsersFailure = (payload) => ({
	type: GET_USERS_FAILURE,
	error: true,
	payload,
});
// redux-saga를 위한 액션 생성 함수
export const getUser = (id) => ({ type: GET_USER, payload: id });
const getUserSuccess = (data) => ({ type: GET_USER_SUCCESS, payload: data });
const getUserFailure = (error) => ({
	type: GET_USER_FAILURE,
	payload: error,
	error: true,
});

// API 요청 함수 - thunk 함수
export const getUsers = () => async (dispatch) => {
	try {
		dispatch(getUsersPending());
		const response = await axios.get(
			'https://jsonplaceholder.typicode.com/users'
		);
		dispatch(getUsersSuccess(response));
	} catch (e) {
		dispatch(getUsersFailure(e));
		throw e;
	}
};

// API 요청 함수 - redux-saga
const getUserById = (id) =>
	axios.get(`https://jsonplaceholder.typicode.com/users/${id}`);

// redux-saga를 위한 saga 함수
function* getUserSaga(action) {
	try {
		const response = yield call(getUserById, action.payload);
		yield put(getUserSuccess(response.data));
	} catch (e) {
		yield put(getUserFailure(e));
	}
}

export function* usersSaga() {
	yield takeEvery(GET_USER, getUserSaga);
}

// 초기 스토어 state 정의
const initialState = {
	users: null,
	user: null,
	loading: {
		users: false,
		user: false,
	},
	error: {
		users: null,
		user: null,
	},
};

// 리듀서
function users(state = initialState, action) {
	switch (action.type) {
		case GET_USERS_PENDING:
			return {
				...state,
				loading: {
					...state.loading,
					users: true,
				},
			};
		case GET_USERS_SUCCESS:
			return {
				...state,
				users: action.payload.data,
				loading: {
					...state.loading,
					users: false,
				},
			};
		case GET_USERS_FAILURE:
			return {
				...state,
				loading: {
					...state.loading,
					users: false,
				},
				error: {
					...state.error,
					users: action.payload,
				},
			};

		default:
			return state;
	}
}

export default users;
