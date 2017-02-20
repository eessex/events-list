import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import _ from 'underscore'

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
		this.loadEvents(null, null)
	},

	loadEvents(cb, filter) {
	  $.ajax('/api/events').done(function(data) {
      this.setState({events: data});
      if (cb) {
        cb(filter)
      }
  	}.bind(this));
	},

  changeFilter(newFilter) {
    // this.props.router.push({search: '?' + $.param(newFilter)});
    if (newFilter.published == 'true') {
      newFilter.published = true
    } else if (newFilter.published == 'false') {
      newFilter.published = false
    }
    this.loadEvents(this.filterList, newFilter)
  },

  filterList(filter) {
    var events = _.where(this.state.events, filter)
    this.setState({events})
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
			<div className='events--list'>
        <div className='responsive-container'>
          <EventFilter
            submitHandler={this.changeFilter}
            initFilter={this.props.location.query} />
        </div>
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