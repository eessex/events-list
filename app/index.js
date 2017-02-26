import React from 'react';
import {render} from 'react-dom';
import { Provider } from 'react-redux';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import { createBrowserHistory } from 'history';
import configureStore from './store/configure_store.js';

import './styles/global.scss';

const store = configureStore();

console.log('App loaded.');

render(<Provider store={store}>
				<Router history={browserHistory} routes={routes} />
			</Provider>
			, document.body);