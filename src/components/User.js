// 특정 사용자의 정보를 보여 줄 User 컴포넌트

const User = ({ user }) => {
	const { email, name, username } = user;

	return (
		<div>
			<h1>
				{username} ({name})
			</h1>
			<p>
				<b>e-mail:</b> {email}
			</p>
		</div>
	);
};

export default User;
