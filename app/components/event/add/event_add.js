import React from 'react'
import ReactDOM from 'react-dom'
import moment from 'moment'
import _ from 'underscore'
import s from 'underscore.string'
import $ from 'jquery'

import './event_add.scss';

const EventAdd = React.createClass({

  getSlug(event) {
    const slug = s.slugify(event.title)
    const match = _.where(this.props.events, {slug: slug})
    if (match.length) {
      return this.incrementUniqueSlug(slug)
    } else {
      return s.slugify(event.title)
    }
  },
  incrementUniqueSlug(slug) {
    const unique = []
    let index = 0
    while (unique.length == 0) {
      if (_.where(this.props.events, {slug: slug + '-' + index}).length) {
        index = index + 1
      } else {
        unique.push(slug + '-' + index)
      }
    }
    return unique[0]
  },
  formatDateInput(form) {
    let all_day = false
    if (form.all_day.value == 'on') {
      all_day = true
    }
    const start_date = moment(form.start_date.value + ' ' + form.start_time.value)
    const date = {start_date: start_date, all_day: all_day}
    if (form.end_date.value) {
      date.end_date = moment(form.end_date.value + ' ' + form.end_time.value)
    }
    return date
  },
  handleSubmit(e) {
    e.preventDefault();
    const form = document.forms.EventAdd;
    const date = this.formatDateInput(form);
    const event = {
      title: form.title.value,
      start_date: moment(date.start_date).toISOString(),
      all_day: date.all_day,
      venue: form.venue.value,
      organizer: form.organizer.value,
      description: form.description.value,
      urls: [form.url.value],
      images: [{url: form.image.value}],
      created_at: moment(new Date()).toISOString(),
      published: false
    }
    if (date.end_date) {
      event.end_date = moment(date.end_date).toISOString()
    }
    const slug = this.getSlug(event);
    event.slug = slug
    event.slugs = [slug]
    if (this.props.addEvent) {
      this.props.addEvent(event);
    } else {
      this.addEvent(event);
    }
    form.title.value = ''; form.venue.value = ''; form.organizer.value = '';
    form.start_date.value = ''; form.start_time.value = '';
    form.end_date.value = ''; form.end_time.value = ''; form.all_day.value = !form.all_day.value;
    form.description.value = ''; form.url.value = ''; form.image.value = '';
   },
  hideTime(e) {
    $('input[type=time]').toggle('display')
  },
  render() {
    return (
      <div className='event--add'>
        <h3>New Event</h3>
        <form name='EventAdd' className='event--add__form'>
          <input type='text' name='title' placeholder='Title' />
          <div className='event--add__time'>
            <input type='date' name='start_date' required='required' />
            <input type='time' name='start_time' />
            <input type='date' name='end_date' />
            <input type='time' name='end_time' />
            <span className='all-day'>
              <input type='checkbox' name='all_day' onClick={this.hideTime} />
            </span>
          </div>
          <input type='text' name='venue' placeholder='Venue' />
          <input type='text' name='organizer' placeholder='Organizer' />
          <textarea name='description' placeholder='Description' />
          <input type='text' name='url' placeholder='External link' />
          <input type='text' name='image' placeholder='Image' />
          <button onClick={this.handleSubmit}>Add Event</button>
        </form>
      </div>
    )
  }
});

module.exports = EventAdd;