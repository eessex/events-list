import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'

import EventAdd from '../components/event_add.js'
import EventFilter from '../components/event_filter.js'
import EventsTable from './events_table/events_table.js'

const EventsList = React.createClass({
	getInitialState() {
		return {
			events: []
		}
	},
	componentDidMount() {
		this.loadEvents()
	},

  componentDidUpdate(prevProps) {
    const oldQuery = prevProps.location.query;
    const newQuery = this.props.location.query;
    if (oldQuery.priority === newQuery.priority &&
        oldQuery.published === newQuery.published) {
      return;
    } else {
      this.loadEvents();
    }
  },

	loadEvents() {
	  const query = this.props.location.query || {};
    const filter = {priority: query.priority, published: query.published};

	  $.ajax('/api/events', {data: filter}).done(function(data) {
      this.setState({events: data});
  	}.bind(this));
	},

  changeFilter(newFilter) {
    this.props.router.push({search: '?' + $.param(newFilter)});
  },

	addEvent(event) {
    console.log("Adding event:", event);
    $.ajax({
      type: 'POST',
      url: '/api/events',
      contentType: 'application/json',
      data: JSON.stringify(event),
      success: function(data) {
        const event = data;
        const eventsModified = this.state.events.concat(event);
        this.setState({events: eventsModified});
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error adding event:", err);
      }
    });
	},

	render() {
		return (
			<div className='event--list'>
        <EventFilter
          submitHandler={this.changeFilter}
          initFilter={this.props.location.query} />
				<EventsTable
					events={this.state.events} />
        <EventAdd
          events={this.state.events}
          addEvent={this.addEvent} />
			</div>
		)
	}
})

module.exports = EventsList;