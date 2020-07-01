import React from 'react';
import ReactDOM from 'react-dom';
import { Router, browserHistory} from 'react-router';
//import browserHistory from 'history/createBrowserHistory';
import routes from './routes';
//import App from './App';
import * as serviceWorker from './serviceWorker';

// Importing the Bootstrap CSS
//import 'jquery/dist/jquery.min.js';
import 'bootstrap/dist/css/bootstrap.min.css';
//import 'bootstrap/dist/css/bootstrap-theme.css';
import './components/css/app.css';

import config from 'react-global-configuration';
import configuration from './config';
config.set(configuration);
config.setEnvironment('production');



ReactDOM.render(
  <Router history={browserHistory} routes={routes} />,
  document.querySelector('#root')
);

//ReactDOM.render(
//  <React.StrictMode>
//    <App />
//  </React.StrictMode>,
//  document.getElementById('root')
//);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
