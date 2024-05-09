import { useParams } from 'react-router-dom';
import UserContainer from '../containers/UserContainer';

const UserPage = () => {
	const { id } = useParams(); // URL 파라미터 조회

	return <UserContainer id={id} />;
};

export default UserPage;
