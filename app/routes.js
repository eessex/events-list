import React from 'react'
import { render } from 'react-dom'
import { Router, Route, Redirect, IndexRoute, Link, browserHistory, IndexLink } from 'react-router'

import Main from './components/main.js';

import EventsList from './components/events/events/events_list.js';
import EventsNew from './components/events/components/event_add.js';
import EventEdit from './components/events/event/event_edit.js';
import EventContainer from './components/events/event/event_container.js';

import Info from './components/pages/info.js';
import NotFound from './components/pages/error_404.js';
import TestEditor from './components/pages/test_editor.js';

export default (
    <Route path="/" component={Main}>
      <IndexRoute component={EventsList} />
      <Route path="info" component={Info}/>
      <Route path="events" component={EventContainer}>
        <IndexRoute component={EventsList} />
        <Route path="/events/new" component={EventsNew}/>
        <Route path="/events/:id" component={EventEdit}/>
      </Route>
      <Route path="*" component={NotFound}/>
    </Route>
);
