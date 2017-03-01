import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, Link, browserHistory, IndexLink } from 'react-router'

import Main from './components/main.js';

import EventsList from './components/events/events_list.js';
import EventsNew from './components/event/add/event_add.js';
import EventEdit from './components/event/edit/event_edit.js';
// import EventContainer from './components/events/event/event_container.js';

import Info from './components/pages/info.js';
import NotFound from './components/pages/error_404.js';
import TestEditor from './components/pages/test_editor.js';

import EventsIndex from './components/pages/events_index.js';
import EventShow from './components/pages/event_show.js';

export default (
    <Route path="/" component={Main}>
      <IndexRoute component={EventsIndex} />
      <Route path="info" component={Info}/>
      <Route path="/events/:id" component={EventShow}/>
      <Route path="/events/new" component={EventsNew}/>
      <Route path="*" component={NotFound}/>
    </Route>
);