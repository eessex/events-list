import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import moment from 'moment'
import s from 'underscore.string'

const EventEdit = React.createClass({
  getInitialState() {
    return {
      successVisible: false,
      event: {
        start_date: '',
        end_date: '',
        all_day: false,
        title: '',
        description: '',
        venue: '',
        organizer: '',
        images: [],
        slugs: [],
        urls: [],
        published: false,
      },
      url: '',
      image: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: ''
    };
  },
  componentDidMount() {
    this.loadEvent()
  },
  componentDidUpdate(prevProps) {
    if (this.props.params.id != prevProps.params.id) {
      this.loadEvent()
    }
  },
  loadEvent() {
    $.ajax('/api/events/' + this.props.params.id).done(function(event) {
      var date = this.loadFormattedDates(event)
      this.setState({
        event: event,
        start_date: date.start_date,
        start_time: date.start_time,
        end_date: date.end_date,
        end_time: date.end_time
      })
    }.bind(this))
  },
  loadFormattedDates(event) {
    var start_date = ''
    var start_time = ''
    var end_date = ''
    var end_time = ''
    if (event.start_date) {
      start_date = moment(event.start_date).format('YYYY-MM-DD')
      start_time = moment(event.start_date).format('HH:mm')
    }
    if (event.end_date) {
      end_date = moment(event.end_date).format('YYYY-MM-DD')
      end_time = moment(event.end_date).format('HH:mm')
    }
    if (event.all_day) {
      $('input[type=time]').toggle('display')
    }
    return {start_date, start_time, end_date, end_time}
  },
  onInputChange(e) {
    const changed = e.target.name
    const state = this.state
    if (changed == 'all_day') {
      state.event.all_day = e.target.checked
      $('input[type=time]').toggle('display')
    } else if (
      changed != 'start_date' &&
      changed != 'start_time' &&
      changed != 'end_time' &&
      changed != 'url' &&
      changed != 'image') {
      state.event[changed] = e.target.value
    } else {
      state[changed] = e.target.value
    }
    this.setState({state})
  },

  getSlug(event) {
    const slug = s.slugify(event.title)
    const match = _.where(this.props.events, {slug: slug})
    if (match.length != 0) {
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

  showSuccess() {
    this.setState({successVisible: true})
  },
  dismissSuccess() {
    this.setState({successVisible: false})
  },
  formatDateInput() {
    const form = document.forms.EventEdit
    var all_day = false
    if (form.all_day.checked) {
      all_day = true
    }
    const start_date = moment(form.start_date.value + ' ' + form.start_time.value)
    const date = {start_date: start_date, all_day: all_day}
    if (form.end_date.value) {
      if (form.end_time.value) {
        date.end_date = moment(form.end_date.value + ' ' + form.end_time.value)
      } else {
        date.end_date = moment(form.end_date.value)
      }
    }
    return date
  },
  onImageChange() {
    // update the images array
  },
  onUrlChange() {
    // update the url array
  },
  submit(e) {
    e.preventDefault()
    const date = this.formatDateInput()
    debugger
    const event = {
      title: this.state.event.title,
      start_date: moment(date.start_date).toISOString(),
      all_day: date.all_day,
      venue: this.state.event.venue,
      organizer: this.state.event.organizer,
      description: this.state.event.description,
      updated_at: moment(new Date()).toISOString(),
      published: this.state.event.published
    }
    // if (e.target.name == 'title') {
    //   const slug = this.getSlug(event)
    //   newState.event.slugs.push(slug)
    //   newState.event.slug = slug
    // }
    if (date.end_date) {
      event.end_date = moment(date.end_date).toISOString()
    }
    $.ajax({
      url: '/api/events/' + this.props.params.id,
      type: 'PATCH',
      contentType:'application/json',
      data: JSON.stringify(event),
      dataType: 'json',
      success: function(event) {
        this.setState({event: event});
        this.showSuccess();
      }.bind(this),
    });
  },

  deleteEvent(e) {
    e.preventDefault();
    const url = '/api/events/' + this.props.params.id
    console.log('Delete event:', this.props.params.id);
    $.ajax({
      type: 'DELETE',
      url: url,
      contentType: 'application/json',
      success: function(data) {
        console.log('Deleted event:', data);
        //here install working forward to all events
      }.bind(this),
      error: function(xhr, status, err) {
        console.log('Error adding event:', err);
      }
    });
  },
  printDateInput(date) {
    var format_date = ''
    var format_time = ''
    var time
    if (date == 'start') {
      if (this.state.start_date) {
        format_date = moment(this.state.start_date).format('YYYY-MM-DD')
      }
      format_time = this.state.start_time
    } else {
      if (this.state.end_date) {
        format_date = moment(this.state.end_date).format('YYYY-MM-DD')
      }
      format_time = this.state.end_time
    }
    var print_date = <div className='form-group start-date'>
            <label>{date} Date:</label>
            <input type='date'
              name={date + '_date'}
              value={format_date}
              onChange={this.onInputChange} />
            <input type='time'
              name={date + '_time'}
              value={format_time}
              onChange={this.onInputChange} />
          </div>
    return print_date
  },
  deleteUrl(e) {
    const event = this.state.event
    event.urls.splice(e.target.id)
    this.setState({event})
  },
  printFormattedUrls(event) {
    var urls = event.urls.map(function(url, i) {
      return <span key={i} id={i} onClick={this.deleteUrl}>url</span>
    }.bind(this));
    return urls
  },
  render() {
    const success = (
      <div className='modal alert--success' onClick={this.dismissSuccess}>
        <h1>Changes saved.</h1>
      </div>
    );
    let images = []
    if (this.state.event.images) {
      images = this.state.event.images
    }
    if (this.state.event.all_day) {
      var all_day = 'checked'
    } else {
      var all_day = false
    }
    return (
      <div className='event--edit'>
        <h2>Edit event: {this.state.event.title}</h2>
        <form onSubmit={this.submit} name='EventEdit' className='event--edit__form'>
          <div className='form-group published'>
            <label>Status:</label>
            <select value={this.state.event.published} onChange={this.onInputChange}>
              <option value={false}>Draft</option>
              <option value={true}>Published</option>
            </select>
          </div>
          <div className='form-group title'>
            <label>Title:</label>
            <input type='text'
              name='title'
              value={this.state.event.title}
              onChange={this.onInputChange} />
          </div>
          {this.printDateInput('start')}
          {this.printDateInput('end')}
          <div className='form-group all-day'>
            <input type='checkbox'
              name='all_day'
              checked={all_day}
              onChange={this.onInputChange} />
              <label>All Day Event</label>
          </div>
          <div className='form-group venue'>
            <label>Venue:</label>
            <input type='text'
              name='venue'
              value={this.state.event.venue}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group organizer'>
            <label>Organizer:</label>
            <input type='text'
              name='organizer'
              value={this.state.event.organizer}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group'>
            <label>Description:</label>
            <textarea
              name='description'
              placeholder='Description'
              value={this.state.event.description}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group'>
            <label>External Link:</label>
            <input type='text'
              name='url'
              placeholder='External Link'
              value={this.state.url}
              onChange={this.onInputChange} />
              {this.printFormattedUrls(this.state.event)}
          </div>
          <div className='form-group'>
            <label>External Link:</label>
            <input type='text'
              name='image'
              placeholder='Image'
              value={this.state.image}
              onChange={this.onInputChange} />
          </div>
          <button type='submit'>Submit</button>
          <button onClick={this.deleteEvent}>Delete</button>
        </form>
        {this.state.successVisible ? success : null}
      </div>
    );
  }
});

module.exports = EventEdit;