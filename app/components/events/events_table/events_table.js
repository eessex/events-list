import React from 'react'
import ReactDOM from 'react-dom'
import './events_table.scss';

const EventRow = require('./event_row.js')

const EventsTable = React.createClass({
  getEventRows() {
		const eventRows = this.props.events.map(function(event, i) {
      return <EventRow key={event._id} event={event} />
    });
    return eventRows
	},

	render() {
		return (
			<div className='events--table'>
        <div className='events--table__header h5'>
          <div className='th'>Slug</div>
          <div className='th'>Date</div>
          <div className='th'>Title</div>
          <div className='th'>Venue</div>
          <div className='th'>Organizer</div>
          <div className='th'>Description</div>
        </div>
        <div className='events--table__body'>
          {this.getEventRows()}
        </div>
			</div>
		)
	}
})

module.exports = EventsTable;