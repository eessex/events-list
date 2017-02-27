import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'

const EventRow = React.createClass({
  formatDate() {
    //has end date
    let date = ''
    if (this.props.event.end_date) {
      // has end date and years match
      if (moment(this.props.event.start_date).format('Y') == moment(this.props.event.end_date).format('Y')) {
        if (this.props.event.all_day) {
          date = moment(this.props.event.start_date).format('ddd M/D') + ' - ' + moment(this.props.event.end_date).format('ddd M/D/Y')
        } else {
          date = moment(this.props.event.start_date).format('ddd M/D') + ' - ' + moment(this.props.event.end_date).format('ddd M/D/Y h:mma')
        }
      // has end date and different years
      } else {
        if (this.props.event.all_day) {
          date = moment(this.props.event.start_date).format('ddd M/D/Y') + ' - ' + moment(this.props.event.end_date).format('ddd M/D/Y')
        } else {
          date = moment(this.props.event.start_date).format('ddd M/D/Y') + ' - ' + moment(this.props.event.end_date).format('ddd M/D/Y h:mma')
        }
      }
    // just start date
    } else {
      if (this.props.event.all_day) {
        date = moment(this.props.event.start_date).format('ddd M/D/Y')
      } else {
        date = moment(this.props.event.start_date).format('ddd M/D/Y h:mma')
      }
    }
    return date
  },

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
        <div className='td slug'>{this.props.event.slug}</div>
        <div className='td date'>{this.formatDate()}</div>
        <div className='td title'>{this.props.event.title}</div>
        <div className='td venue'>{this.props.event.venue}</div>
        <div className='td organizer'>{this.props.event.organizer}</div>
        <div className='td description'>{this.props.event.description}</div>
			</a>
		)
	}
})

module.exports = EventRow;