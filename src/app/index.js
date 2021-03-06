import React from 'react';
import ReactDOM from 'react-dom';
import './css/index.css';
import * as serviceWorker from './serviceWorker';
import Provider from "react-redux/es/components/Provider";
import AppContainer from "./components/App";
import RootReducer from "./redux/rootreducer";
import {createStore,applyMiddleware, combineReducers} from "redux";
import thunk from 'redux-thunk';
import ApiClient from "./apiclient";
import { createBrowserHistory } from 'history';
import { composeWithDevTools } from 'redux-devtools-extension';
import io from 'socket.io-client';
import GameClientSocket from "./gameclientsocket";

const apiClient = new ApiClient();
const rootReducer = new RootReducer(combineReducers);
const history = createBrowserHistory();
const socket = io();
const store = createStore(
	rootReducer.getCombinedReducers(),
	composeWithDevTools(
		applyMiddleware(thunk.withExtraArgument({ apiClient, history, socket}))
	)
);

const gameSocket = new GameClientSocket(socket, store);
gameSocket.initialize();

const app = (
	<Provider store={store}>
		<AppContainer history={history}/>
	</Provider>
);

ReactDOM.render(app, document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
