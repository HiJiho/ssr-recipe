import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom/server';
import App from './App';

const app = express();

// SSR을 처리할 핸들러 함수
const serverRender = (req, res, next) => {
	// 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 SSR을 함

	const context = [];
	const jsx = (
		<StaticRouter location={req.url} context={context}>
			<App />
		</StaticRouter>
	);
	const root = ReactDOMServer.renderToString(jsx); // 렌더링 후,
	res.send(root); // 클라이언트에게 결과물을 응답
};

app.use(serverRender);

// 5555 포트로 서버를 가동
app.listen(5555, () => {
	console.log('Running on http://localhost:5555');
});
