import { useDispatch, useSelector } from 'react-redux';

import { Preloader } from '../lib/PreloadContext';
import Users from '../components/Users';
import { getUsers } from '../modules/users';
import { useEffect } from 'react';

const UsersContainer = () => {
	const users = useSelector((state) => state.users.users);
	const dispatch = useDispatch();

	// 컴포넌트가 마운트되고 나서 호출
	useEffect(() => {
		if (users) return; // users가 이미 유효하다면 요청하지 않음
		dispatch(getUsers());
	}, [dispatch, users]);

	// Preloader는 서버 환경에서만 실행됨
	return (
		<>
			<Users users={users} />
			<Preloader resolve={() => dispatch(getUsers)} />
		</>
	);
};

export default UsersContainer;
