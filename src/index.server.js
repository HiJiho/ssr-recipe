import fs from 'fs';
import path from 'path';
import { configureStore } from '@reduxjs/toolkit';
import express from 'express';
import ReactDOMServer from 'react-dom/server';
import { Provider } from 'react-redux';
import { StaticRouter } from 'react-router-dom/server';
import createSagaMiddleware, { END } from 'redux-saga';
import { thunk } from 'redux-thunk';
import App from './App';
import PreloadContext from './lib/PreloadContext';
import rootReducer, { rootSaga } from './modules';

// asset-manivest.json에서 파일 경로들을 조회
const manifest = JSON.parse(
	fs.readFileSync(path.resolve('./build/asset-manifest.json'), 'utf8'),
);

function createPage(root, stateScript) {
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
			${stateScript}
			<script src="${manifest.files['main.js']}"></script>
		</body>
	</html>
	`;
}

const app = express();

// SSR을 처리할 핸들러 함수
const serverRender = async (req, res, next) => {
	// 이 함수는 404가 떠야 하는 상황에 404를 띄우지 않고 SSR을 함

	const context = [];
	const sagaMiddleware = createSagaMiddleware();

	const store = configureStore({
		// 서버에서는 요청이 들어올 때마다 새로운 스토어를 만듬
		reducer: rootReducer,
		middleware: (getDefaultMiddleware) =>
			getDefaultMiddleware().concat(thunk, sagaMiddleware),
		devTools: process.env.NODE_ENV !== 'production',
	});

	const sagaPromise = sagaMiddleware.run(rootSaga).toPromise(); // 루트 사가에서 액션을 끊임없이 모니터링 중 -> 별도의 작업이 없으면 이 Promise는 끝나지 않음

	const preloadContext = {
		done: false,
		promises: [],
	};

	const jsx = (
		<PreloadContext.Provider value={preloadContext}>
			<Provider store={store}>
				<StaticRouter location={req.url} context={context}>
					<App />
				</StaticRouter>
			</Provider>
		</PreloadContext.Provider>
	);

	ReactDOMServer.renderToStaticMarkup(jsx); // renderToStaticMarkup으로 한 번 렌더링
	store.dispatch(END); // redux-saga의 END 액션을 발생시키면 액션을 모니터링 하는 사가들이 모두 종료됨, 이 시점에 리덕스 스토어에 요청한 데이터가 채워짐

	try {
		await sagaPromise; // 기존에 진행 중이던 사가들이 모두 끝날 때까지 기다림
		await Promise.all(preloadContext.promises); // 모든 프로미스를 기다림
	} catch (e) {
		return res.status(500);
	}
	preloadContext.done = true;

	const root = ReactDOMServer.renderToString(jsx); // 렌더링 후,

	// 서버의 리덕스 초기 상태를 스크립트로 주입
	const stateString = JSON.stringify(store.getState()).replace(/</g, '\\u003c');
	const stateScript = `<script>__PRELOADED_STATE__ = ${stateString}</script>`;

	res.send(createPage(root, stateScript)); // 클라이언트에게 결과물을 응답
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
