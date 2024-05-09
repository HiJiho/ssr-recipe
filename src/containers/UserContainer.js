import { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import User from '../components/User';
import { Preloader } from '../lib/PreloadContext';
import { getUser } from '../modules/users';

const UserContainer = ({ id }) => {
	// id: URL 파라미터, 문자열
	const user = useSelector((state) => state.users.user);
	const dispatch = useDispatch();

	useEffect(() => {
		if (user && user.id === parseInt(id, 10)) return; // 사용자가 존재하고, id가 일치한다면 요청하지 않음
		dispatch(getUser(id));
	}, [dispatch, id, user]); // id가 바뀔 때 새로 요청해야 되기에

	// 서버 환경에서는 useEffect가 동작하지 않기 때문에 필요한 로직
	// 컨테이너 유효성 검사 후 return null을 해야 하는 경우(user 데이터가 없는 경우),
	// null 대신 Preloader 반환해서 SSR에 필요한 데이터를 요청
	if (!user) {
		return <Preloader resolove={() => dispatch(getUser(id))} />;
	}

	return <User user={user} />;
};

export default UserContainer;
