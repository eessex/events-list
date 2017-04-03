import React, { Component, PropTypes } from 'react';
import $ from 'jquery'
import moment from 'moment'

class EventsForm extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = () => this._componentDidMount()
    this.onChange = (e) => this._onInputChange(e)
    this.deleteUrl = (e) => this._deleteUrl(e)
    this.deleteImage = (e) => this._deleteImage(e)
    this.addImage = (e) => this._addImage(e)
    this.addUrl = (e) => this._addUrl(e)
    this.onSubmit = (e) => this._onSubmit(e)
    this.addEndDate = (e) => this._addEndDate(e)

    this.state = {
      successVisible: false,
      event: this.props.event,
      url: '',
      image: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: '',
      hasEndDate: false
    };
  }

  _componentDidMount() {
    this.loadEvent()
  }

  loadEvent() {
    var date = this.loadFormattedDates(this.props.event)
    var hasEndDate = false
    if (date.end_date) {
      hasEndDate = true
    }
    this.setState({
      start_date: date.start_date,
      start_time: date.start_time,
      end_date: date.end_date,
      end_time: date.end_time,
      hasEndDate: hasEndDate
    })
  }

  loadFormattedDates(event) {
    var start_date = ''
    var start_time = ''
    var end_date = ''
    var end_time = ''
    var hasEndDate = false
    if (event.start_date) {
      start_date = moment(event.start_date).format('YYYY-MM-DD')
      start_time = moment(event.start_date).format('HH:mm')
    }
    if (event.end_date) {
      end_date = moment(event.end_date).format('YYYY-MM-DD')
      end_time = moment(event.end_date).format('HH:mm')
      hasEndDate = true
    }
    return {start_date, start_time, end_date, end_time, hasEndDate}
  }

  formatDateInput() {
    const form = document.forms.EventEdit
    var all_day = false
    var start_time
    var end_time
    if (form.all_day.checked) {
      all_day = true
      start_time = '20:00'
      end_time = '20:00'
    } else {
      start_time = form.start_time.value
      end_time = ''
      if (form.end_time) {
        end_time = form.end_time.value
      }
    }
    const start_date = moment(form.start_date.value + ' ' + start_time)
    const date = {start_date: start_date, all_day: all_day}
    if (form.end_date && form.end_date.value) {
      if (form.end_time && form.end_time.value) {
        date.end_date = moment(form.end_date.value + ' ' + end_time)
      } else {
        date.end_date = moment(form.end_date.value)
      }
    }
    return date
  }

  _onInputChange(e) {
    const changed = e.target.name
    const newState = this.state
    if (changed == 'all_day') {
      newState.event.all_day = e.target.checked
      $('input[type=time]').toggle('display')
    } else if (changed == 'published') {
      if (e.target.value == 'true') {
        newState.event[changed] = true
      } else {
        newState.event[changed] = false
      }
    } else if (
      changed != 'start_date' &&
      changed != 'start_time' &&
      changed != 'end_date' &&
      changed != 'end_time') {
      newState.event[changed] = e.target.value
    } else {
      newState[changed] = e.target.value
    }
    this.setState({
      event: newState.event,
      start_date: newState.start_date,
      start_time: newState.start_time,
      end_date: newState.end_date,
      end_time: newState.end_time})
  }

  _onSubmit(e) {
    e.preventDefault()
    const date = this.formatDateInput()
    const event = {
      title: this.state.event.title,
      start_date: moment(date.start_date).toISOString(),
      all_day: date.all_day,
      venue: this.state.event.venue,
      organizer: this.state.event.organizer,
      description: this.state.event.description,
      updated_at: moment(new Date()).toISOString(),
      published: this.state.event.published,
      urls: this.state.event.urls || [],
      images: this.state.event.images || [],
      slugs: this.state.event.slugs  || []
    }
  // create a slug for a new event
  // update slug if title has changed
    if (date.end_date) {
      event.end_date = moment(date.end_date).toISOString()
      this.setState({hasEndDate: true})
    }
    if (!this.props.new) {
      event._id = this.state.event._id
    }
    this.props.updateEvent(event)
    this.showSuccess()
  }

  _addUrl(e) {
    const event = this.state.event
    event.urls.push(document.forms.EventEdit.url.value)
    document.forms.EventEdit.url.value = ''
    const url = ''
    this.setState({event, url})
  }

  _deleteUrl(e) {
    const event = this.state.event
    event.urls.splice(e.target.id)
    this.setState({event})
    this.onSubmit(e)
  }

  _addImage(e) {
    const event = this.state.event
    event.images.push({url: document.forms.EventEdit.image.value})
    const image = ''
    document.forms.EventEdit.image.value = ''
    this.setState({event, image})
  }

  _deleteImage(e) {
    const event = this.state.event
    event.images.splice(e.target.id)
    this.setState({event})
    this.onSubmit(e)
  }

  getSlug(event) {
    const slug = s.slugify(event.title)
    const match = _.where(this.props.events, {slug: slug})
    if (match.length != 0) {
      return this.incrementUniqueSlug(slug)
    } else {
      return s.slugify(event.title)
    }
  }

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
  }

  showSuccess() {
    this.setState({successVisible: true})
  }

  dismissSuccess() {
    this.setState({successVisible: false})
  }

  printFormattedUrls(event) {
    if (event.urls && event.urls.length > 0) {
      var urls = event.urls.map(function(url, i) {
        return <span key={i} id={i} onClick={this.deleteUrl}>{url} <span id={i} className='delete'>x</span></span>
      }.bind(this));
      return urls
    }
  }

  printFormattedImages(event) {
    if (event.images && event.images.length > 0) {
      var images = event.images.map(function(image, i) {
        return (
          <div key={i} id={i}>
            <img src={image.url} width='400' />
            <span id={i} onClick={this.deleteImage} className='delete'>x</span>
          </div>
          )
      }.bind(this));
      return images
    }
  }

  printDateInput(date) {
    var format_date = ''
    var format_time = ''
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

    var time = <input type='time'
                  name={date + '_time'}
                  value={format_time}
                  onChange={this.onInputChange} />

    var print_date = <div className='form-group start-date'>
            <label>{date} Date:</label>
            <input type='date'
              name={date + '_date'}
              value={format_date}
              onChange={this.onInputChange} />
              {!this.state.event.all_day ? time : null}
          </div>
    return print_date
  }

  printEndDate() {
    if (this.state.hasEndDate) {
      return this.printDateInput('end')
    } else {
      return <button onClick={this.addEndDate}>+ End Date</button>
    }
  }

  _addEndDate(e) {
    this.setState({hasEndDate: true})
  }

  render() {
    const { loading, event } = this.props;

    const success = (
      <div className='modal alert--success' onClick={this.dismissSuccess}>
        <h1>Changes saved.</h1>
      </div>
    );

    if (this.state.event.all_day) {
      var all_day = 'checked'
    } else {
      var all_day = false
    }

    if (!this.props.new) {
      var title = event.title
    } else {
      var title = 'New Event'
    }

    if (loading) {
      return <p>loading</p>
    } else {
      return (
        <div className="event--edit">
          <h1>{title}</h1>
          <form onChange={this.onChange} onSubmit={this.onSubmit} name='EventEdit' className='event--edit__form'>
          <div className='form-group published'>
            <label>Status:</label>
            <select name='published'
              defaultValue={this.state.event.published}>
              <option value={false}>Draft</option>
              <option value={true}>Published</option>
            </select>
          </div>
          <div className='form-group title'>
            <input type='text'
              name='title'
              required={true}
              placeholder='Title'
              defaultValue={this.state.event.title}
              onChange={this.onInputChange} />
          </div>
          <div className='field-group dates'>
            {this.printDateInput('start')}
            {this.printEndDate()}
            <div className='form-group all-day'>
              <input type='checkbox'
                name='all_day'
                defaultChecked={all_day}
                onChange={this.onInputChange} />
                <label>All Day Event</label>
            </div>
          </div>
          <div className='form-group venue'>
            <label>Venue:</label>
            <input type='text'
              name='venue'
              placeholder='Venue'
              defaultValue={this.state.event.venue}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group organizer'>
            <label>Organizer:</label>
            <input type='text'
              name='organizer'
              placeholder='Organizer'
              defaultValue={this.state.event.organizer}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group description'>
            <label>Description:</label>
            <textarea
              name='description'
              placeholder='Description'
              defaultValue={this.state.event.description}
              onChange={this.onInputChange} />
          </div>
          <div className='field-group urls'>
            <div className='form-group url'>
              <label>External Links:</label>
              <input type='text'
                name='url'
                placeholder='External Link' />
              <button type='url' className='add' onClick={this.addUrl}>New</button>
              {this.printFormattedUrls(this.state.event)}
            </div>
          </div>
          <div className='field-group images'>
            <div className='form-group'>
              <label>Images:</label>
              <input type='text'
                name='image'
                placeholder='Image' />
              <button type='image' className='add' onClick={this.addImage}>New</button>
              {this.printFormattedImages(this.state.event)}
            </div>
          </div>
          <div className='actions'>
            <button type='submit'>Submit</button>
            <button onClick={this.deleteEvent}>Delete</button>
          </div>
        </form>
        {this.state.successVisible ? success : null}
        </div>
      );
    }
  }
}

export default EventsForm;