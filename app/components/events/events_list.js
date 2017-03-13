import React, { Component } from 'react';
import { Link } from 'react-router';
import EventsTable from './events_table/events_table'

class EventsList extends Component {
  componentWillMount() {
    this.props.fetchEvents();
  }

  renderEvents(events) {
    return events.map((event) => {
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
					events={events} loading={loading} />
      </div>
    );
  }
}


export default EventsList;