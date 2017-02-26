import React, { Component } from 'react';
import { Link } from 'react-router';
import EventsTable from './events/events/events_table/events_table'

class EventsList2 extends Component {
  componentWillMount() {
    this.props.fetchEvents();
  }

  renderEvents(events) {
  	debugger
    return events.map((event) => {
    	debugger
      return (
        <li className="list-group-item" key={event._id}>
          <Link to={"events/" + event._id}>
            <h3 className="list-group-item-heading">{event.title}</h3>
          </Link>
        </li>
      );
    });
  }

  render() {
    const { events, loading, error } = this.props.eventsList;

    if(loading) {
      return <div className="container"><h1>Events</h1><h3>Loading...</h3></div>      
    } else if(error) {
      return <div className="alert alert-danger">Error: {error.message}</div>
    }

    return (
      <div className="container">
				<EventsTable
					events={events} />
      </div>
    );
  }
}


export default EventsList2;