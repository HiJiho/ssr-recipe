import ReactDOMServer from 'react-dom/server';
import express from 'express';
import { StaticRouter } from 'react-router-dom/server';

import App from './App';
import path from 'path';
import fs from 'fs';

// asset-manivest.json에서 파일 경로들을 조회
const manifest = JSON.parse(
	fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8')
);

function createPage(root) {
	return `
	<!DOCTYPE html>
	<html lang="en">
		<head>
			<meta charset="utf-8" />
			<meta name="viewport" content="width=device-width, initial-scale=1" />
			<meta name="theme-color" content="#000000" />
			<link rel="stylesheet" href="${manifest.files['main.css']}" />
			<title>React App</title>
		</head>
		<body>
			<noscript>You need to enable JavaScript to run this app.</noscript>
			<div id="root">${root}</div>
			<script src="${manifest.files['main.js']}"></script>
		</body>
	</html>
	`;
}

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
	res.send(createPage(root)); // 클라이언트에게 결과물을 응답
};

const serve = express.static(path.resolve('./build'), {
	index: false, // "/" 경로에서 index.html을 보여 주지 않도록 설정
});

app.use(serve); // 순서가 중요, serverRender 전에 위치해야 함
app.use(serverRender);

// 5555 포트로 서버를 가동
app.listen(5555, () => {
	console.log('Running on http://localhost:5555');
});
