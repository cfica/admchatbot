import React from 'react';
import { Route, IndexRoute } from 'react-router';
import App from './components/App';
import Login from './components/views/login';
import Chat from './components/views/chat';
import Contact from './components/views/contact';
import Dashboard from './components/views/dashboard';
import RealTime from './components/views/real-time';
import BaseWords from './components/views/base-words';
import AuthCallback from './components/views/auth-callback';
import Clients from './components/views/clients';

export default (
  <Route path='/' component={App}>
    <IndexRoute component={Login} />
    <Route path='real-time' component={RealTime} />
    <Route path='auth/callback' component={AuthCallback} />
    <Route path='widget/belisa' component={Chat} />
    <Route path='clients' component={Clients} />
    <Route path='base-words' component={BaseWords} />
    <Route path='contact' component={Contact} />
    <Route path='dashboard' component={Dashboard} />
    <Route path='*' component={Login} />
  </Route>
);