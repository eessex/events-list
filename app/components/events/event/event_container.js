import React from 'react'
import ReactDOM from 'react-dom'

const EventContainer = React.createClass({
  render() {
    return (
      <div className="event-container">
	      {this.props.children}
      </div>
    );
  }
});

module.exports = EventContainer;