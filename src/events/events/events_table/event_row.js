import React from 'react'
import ReactDOM from 'react-dom'

const EventRow = React.createClass({

	render() {
    const rowStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      textAlign: 'left',
      borderBottom: '1px solid',
      textDecoration: 'none',
      padding: '1em'
    }
		return (
			<a className='event-table__row'
				href={'/events/' + this.props.event._id}
				style={rowStyle}>
        <div>{this.props.event.slug}</div>
        <div>{this.props.event.published}</div>
        <div>{this.props.event.priority}</div>
        <div>{this.props.event.title}</div>
        <div>{this.props.event.venue}</div>
        <div>{this.props.event.organizer}</div>
        <div>{this.props.event.description}</div>
			</a>
		)
	}
})

module.exports = EventRow;