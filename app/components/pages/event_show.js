import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { deleteEvent, createEvent, resetActiveEvent } from '../../actions/events';
import EventContainer from '../../containers/event_container.js';

class EventShow extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {
    resetActiveEvent();
  }

  onDeleteClick() {
    this.props.deleteEvent(this.props.params.id)
      .then(() => { this.context.router.push('/'); });
  }

  render() {
    return (
      <div className='container'>
        <EventContainer id={this.props.params._id} createEvent={createEvent}/>
      </div>
    );
  }
}

export default EventShow;