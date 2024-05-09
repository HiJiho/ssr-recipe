import UserContainer from "../containers/UserContainer";
import { useParams } from "react-router-dom";

const UserPage = () => {
	const { id } = useParams(); // URL 파라미터 조회

	return <UserContainer id={id} />;
};

export default UserPage;
