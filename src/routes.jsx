import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Home from './components/views/home';
import Login from './components/views/login';
import Contact from './components/views/contact';
import Dashboard from './components/views/dashboard';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Login} />
    <Route path='home' component={Home} />
    <Route path='contact' component={Contact} />
    <Route path='dashboard' component={Dashboard} />
    <Route path='*' component={Login} />
  </Route>
);