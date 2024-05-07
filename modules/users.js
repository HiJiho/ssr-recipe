import axios from 'axios';
import { act } from 'react';

// 액션 타입
const GET_USERS_PENDING = 'users/GET_USERS_PENDING';
const GET_USERS_SUCCESS = 'users/GET_USERS_SUCCESS';
const GET_USERS_FAILURE = 'users/GET_USERS_FAILURE';

// 액션 생성 함수
const getUserPending = () => ({ type: GET_USERS_PENDING });
const getUserSuccess = (payload) => ({ type: GET_USERS_SUCCESS, payload });
const getUserFailure = (payload) => ({
	type: GET_USERS_FAILURE,
	error: true,
	payload,
});

// API 요청 함수 - thunk 함수
export const getUsers = () => async (dispatch) => {
	try {
		dispatch(getUserPending());
		const response = await axios.get(
			'https://jsonplaceholder.typicode.com/users'
		);
		dispatch(getUserSuccess(response));
	} catch (e) {
		dispatch(getUserFailure(e));
		throw e;
	}
};

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
