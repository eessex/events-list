import React from 'react'
import { render } from 'react-dom'
import { Router,
         Route,
         Redirect,
         IndexRoute,
         Link,
         browserHistory,
         IndexLink } from 'react-router'
import { createBrowserHistory } from 'history'

import Main from './main.js';

import EventsList from './events/events/events_list.js';
import EventEdit from './events/event/event_edit.js';
import EventContainer from './events/event/event_container.js';

import Info from './pages/info.js';
import NotFound from './pages/error_404.js';

import CaptionEditor from './draft_experiments/caption_editor.js';
import TestEditor from './draft_experiments/test_editor.js';
import LinkEditorExample from './draft_experiments/examples/link_example.js';
import EntityEditorExample from './draft_experiments/examples/convert_example.js';
import MediaEditorExample from './draft_experiments/examples/media_example.js';
import FreshCaption from './draft_experiments/fresh_caption.js';

render(
  ( <Router history={browserHistory}>
      <Route path="/" component={Main}>
        <IndexRoute component={FreshCaption} />
        <Route path="info" component={EntityEditorExample}/>
        <Route path="events" component={EventContainer}>
          <IndexRoute component={EventsList} />
          <Route path="/events/:id" component={EventEdit}/>
        </Route>
        <Route path="*" component={NotFound}/>
      </Route>
    </Router>
  ), document.getElementById('main')
)

