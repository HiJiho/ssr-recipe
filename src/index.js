import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { configureStore } from '@reduxjs/toolkit';
import { Provider } from 'react-redux';
import { BrowserRouter } from 'react-router-dom';
import createSagaMiddleware from 'redux-saga';
import { thunk } from 'redux-thunk';
import App from './App';
import rootReducer, { rootSaga } from './modules';
import reportWebVitals from './reportWebVitals';

const sagaMiddleware = createSagaMiddleware(); // saga 미들웨어 생성

const preloadedState = window.__PRELOADED_STATE__; // 서버에서 렌더링한 리덕스 초기 상태

const store = configureStore({
	reducer: rootReducer,
	rootSaga,
	middleware: (getDefaultMiddleware) =>
		getDefaultMiddleware().concat(thunk, sagaMiddleware),
	preloadedState,
	devTools: process.env.NODE_ENV !== 'production',
});

sagaMiddleware.run(rootSaga); // saga 미들웨어 실행

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
	<Provider store={store}>
		<BrowserRouter>
			<App />
		</BrowserRouter>
	</Provider>,
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
