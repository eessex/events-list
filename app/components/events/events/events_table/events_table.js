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
    const headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      textAlign: 'left',
      borderBottom: '1px solid',
      padding: '.25em 1em'
    }
		return (
			<div className='events--table'>
        <div className='event-table__header' style={headerStyle}>
          <div className='th'>Slug</div>
          <div className='th'>Title</div>
          <div className='th'>Venue</div>
          <div className='th'>Organizer</div>
          <div className='th'>Description</div>
        </div>
        <div className='event-table__body'>
          {this.getEventRows()}
        </div>
			</div>
		)
	}
})

module.exports = EventsTable;