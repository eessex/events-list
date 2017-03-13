import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import EventEdit from './edit/event_editz'
import EventShow from './event_show'

class EventDetails extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
    // console.log(props)
    this.state = {
      isEditing: false
    };
    this.toggleEdit = this._toggleEdit.bind(this)
  }

  componentWillUnmount() {
     this.props.resetMe();
  }

  componentDidMount() {
    this.props.fetchEvent(this.props.eventId);
  }
  componentDidReceiveProps() {
  }

  _toggleEdit() {
    this.setState({isEditing: !this.state.isEditing})
  }

  render() {
    const { event, loading, error } = this.props.activeEvent;
    if (loading) {
      return <div className="container">Loading...</div>;
    } else if (error) {
      return  <div className="alert alert-danger">{error.message}</div>
    } else {
      if (this.state && this.state.isEditing) {
        return (
          <div className="event responsive-container">
            <EventEdit event={event} loading={loading} />
            <button onClick={this.toggleEdit}>Preview</button>
          </div>
        )
       } else {
        return (
          <div className="event responsive-container">
            <EventShow event={event} loading={loading} />
            <button onClick={this.toggleEdit}>Edit</button>
          </div>
        )
      }
    }
  }
}

export default EventDetails;