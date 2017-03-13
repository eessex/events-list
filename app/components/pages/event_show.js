import React, { Component, PropTypes } from 'react';
import { connect } from 'react-redux';
import { deleteEvent } from '../../actions/events';
import EventContainer from '../../containers/event_container.js';

class EventShow extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  onDeleteClick() {
    this.props.deleteEvent(this.props.params.id)
      .then(() => { this.context.router.push('/'); });
  }

  render() {
    return (
      <div className='container'>
        <EventContainer id={this.props.params._id}/>
      </div>
    );
  }
}

export default EventShow;