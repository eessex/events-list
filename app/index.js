import React from 'react';
import {render} from 'react-dom';
import {Router, browserHistory} from 'react-router';
import routes from './routes';
import { createBrowserHistory } from 'history';

import './styles/global.scss';

require("css-loader!../public/build/style.css")

console.log('App is loaded...');

render(<Router
					history={browserHistory}
					routes={routes} />, document.body);