import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import EventEdit from './edit/event_edit'

class EventDetails extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
    this.state = {
      isEditing: true
    };
    this.toggleEdit = this._toggleEdit.bind(this)
  }

  componentWillUnmount() {
    //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    //always reset that global state back to null when you REMOUNT
     this.props.resetMe();
  }

  componentDidMount() {
    this.props.fetchEvent(this.props.eventId);
  }

  _toggleEdit() {
    debugger
    this.setState({isEditing: !this.state.isEditing})
  }

  render() {
    const { event, loading, error } = this.props.activeEvent;
    if (loading) {
      return <div className="container">Loading...</div>;
    } else if(error) {
      return  <div className="alert alert-danger">{error.message}</div>
    } else if(!event) {
      return <span />
    }

    if (this.state && this.state.isEditing) {
    return (
      <div className="container">
        <EventEdit event={event} />
        <button onClick={this.toggleEdit}>Preview</button>
      </div>
      )
    } else {
      return (
        <div className="container">
          <h3>{event.title}</h3>
          <p>{event.description}</p>
          <button onClick={this.toggleEdit}>Edit</button>
        </div>
      );
    }
  }
}

export default EventDetails;