import React, { Component, PropTypes } from 'react';
import $ from 'jquery'
import moment from 'moment'

class EventAdd extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = () => this._componentDidMount()
    this.onChange = (e) => this._onInputChange(e)
    this.deleteUrl = (e) => this._deleteUrl(e)
    this.deleteImage = (e) => this._deleteImage(e)
    this.addImage = (e) => this._addImage(e)
    this.addUrl = (e) => this._addUrl(e)
    this.onSubmit = (e) => this._onSubmit(e)

    this.state = {
      successVisible: false,
      event: this.props.event,
      url: '',
      image: '',
      start_date: '',
      start_time: '',
      end_date: '',
      end_time: ''
    };
  }

  _componentDidMount() {
    this.loadEvent()
  }

  loadEvent() {
    var date = this.loadFormattedDates(this.props.event)
    this.setState({
      start_date: date.start_date,
      start_time: date.start_time,
      end_date: date.end_date,
      end_time: date.end_time
    })
  }

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
    return {start_date, start_time, end_date, end_time}
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
      end_time = form.end_time.value
    }
    const start_date = moment(form.start_date.value + ' ' + start_time)
    const date = {start_date: start_date, all_day: all_day}
    if (form.end_date.value) {
      if (form.end_time.value) {
        date.end_date = moment(form.end_date.value + ' ' + end_time)
      } else {
        date.end_date = moment(form.end_date.value)
      }
    }
    return date
  }

  _onInputChange(e) {
    const changed = e.target.name
    const state = this.state
    if (changed == 'all_day') {
      state.event.all_day = e.target.checked
      $('input[type=time]').toggle('display')
    } else if (changed == 'published') {
      if (e.target.value == 'true') {
        state.event[changed] = true
      } else {
        state.event[changed] = false
      }
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
  }

  _onSubmit(e) {
  //   e.preventDefault()
  //   const date = this.formatDateInput()
  //   const event = {
  //     title: this.state.event.title,
  //     start_date: moment(date.start_date).toISOString(),
  //     all_day: date.all_day,
  //     venue: this.state.event.venue,
  //     organizer: this.state.event.organizer,
  //     description: this.state.event.description,
  //     updated_at: moment(new Date()).toISOString(),
  //     published: this.state.event.published,
  //     urls: this.state.event.urls,
  //     images: this.state.event.images
  //   }
  // // update slug if title has changed
  //   if (date.end_date) {
  //     event.end_date = moment(date.end_date).toISOString()
  //   }
  //   this.props.updateEvent(this.props.event)
  //   this.showSuccess()


        debugger
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
    debugger
    if (this.props.createEvent) {
      debugger
      this.props.createEvent(event);
    }
    form.title.value = ''; form.venue.value = ''; form.organizer.value = '';
    form.start_date.value = ''; form.start_time.value = '';
    form.end_date.value = ''; form.end_time.value = ''; form.all_day.value = !form.all_day.value;
    form.description.value = ''; form.url.value = ''; form.image.value = '';
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

  // printFormattedUrls(event) {
  //   if (event.urls && event.urls.length > 0) {
  //     var urls = event.urls.map(function(url, i) {
  //       return <span key={i} id={i} onClick={this.deleteUrl}>{url} <span id={i} className='delete'>x</span></span>
  //     }.bind(this));
  //     return urls
  //   }
  // }

  // printFormattedImages(event) {
  //   if (event.images && event.images.length > 0) {
  //     var images = event.images.map(function(image, i) {
  //       return <span key={i} id={i} onClick={this.deleteImage}>{image.url} <span id={i} className='delete'>x</span></span>
  //     }.bind(this));
  //     return images
  //   }
  // }

  // printDateInput(date) {
  //   var format_date = ''
  //   var format_time = ''
  //   if (date == 'start') {
  //     if (this.state.start_date) {
  //       format_date = moment(this.state.start_date).format('YYYY-MM-DD')
  //     }
  //     format_time = this.state.start_time
  //   } else {
  //     if (this.state.end_date) {
  //       format_date = moment(this.state.end_date).format('YYYY-MM-DD')
  //     }
  //     format_time = this.state.end_time
  //   }

  //   var time = <input type='time'
  //                 name={date + '_time'}
  //                 value={format_time}
  //                 onChange={this.onInputChange} />

  //   var print_date = <div className='form-group start-date'>
  //           <label>{date} Date:</label>
  //           <input type='date'
  //             name={date + '_date'}
  //             value={format_date}
  //             onChange={this.onInputChange} />
  //             {!this.state.event.all_day ? time : null}
  //         </div>
  //   return print_date
  // }
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
  }

  hideTime(e) {
    $('input[type=time]').toggle('display')
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

    if (loading) {
      return <p>loading</p>
    } else {
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
          <button onClick={this.onSubmit}>Add Event</button>
        </form>
      </div>
    )
  }
}

export default EventAdd;


// import React from 'react'
// import ReactDOM from 'react-dom'
// import moment from 'moment'
// import _ from 'underscore'
// import s from 'underscore.string'
// import $ from 'jquery'

// import './event_add.scss';

// const EventAdd = React.createClass({

//   getSlug(event) {
//     const slug = s.slugify(event.title)
//     const match = _.where(this.props.events, {slug: slug})
//     if (match.length) {
//       return this.incrementUniqueSlug(slug)
//     } else {
//       return s.slugify(event.title)
//     }
//   },
//   incrementUniqueSlug(slug) {
//     const unique = []
//     let index = 0
//     while (unique.length == 0) {
//       if (_.where(this.props.events, {slug: slug + '-' + index}).length) {
//         index = index + 1
//       } else {
//         unique.push(slug + '-' + index)
//       }
//     }
//     return unique[0]
//   },
//   formatDateInput(form) {
//     let all_day = false
//     if (form.all_day.value == 'on') {
//       all_day = true
//     }
//     const start_date = moment(form.start_date.value + ' ' + form.start_time.value)
//     const date = {start_date: start_date, all_day: all_day}
//     if (form.end_date.value) {
//       date.end_date = moment(form.end_date.value + ' ' + form.end_time.value)
//     }
//     return date
//   },
//   handleSubmit(e) {
//     debugger
//     e.preventDefault();
//     const form = document.forms.EventAdd;
//     const date = this.formatDateInput(form);
//     const event = {
//       title: form.title.value,
//       start_date: moment(date.start_date).toISOString(),
//       all_day: date.all_day,
//       venue: form.venue.value,
//       organizer: form.organizer.value,
//       description: form.description.value,
//       urls: [form.url.value],
//       images: [{url: form.image.value}],
//       created_at: moment(new Date()).toISOString(),
//       published: false
//     }
//     if (date.end_date) {
//       event.end_date = moment(date.end_date).toISOString()
//     }
//     const slug = this.getSlug(event);
//     event.slug = slug
//     event.slugs = [slug]
//     debugger
//     if (this.props.createEvent) {
//       debugger
//       this.props.createEvent(event);
//     }
//     form.title.value = ''; form.venue.value = ''; form.organizer.value = '';
//     form.start_date.value = ''; form.start_time.value = '';
//     form.end_date.value = ''; form.end_time.value = ''; form.all_day.value = !form.all_day.value;
//     form.description.value = ''; form.url.value = ''; form.image.value = '';
//    },

//   hideTime(e) {
//     $('input[type=time]').toggle('display')
//   },
//   render() {
//     return (
//       <div className='event--add'>
//         <h3>New Event</h3>
//         <form name='EventAdd' className='event--add__form'>
//           <input type='text' name='title' placeholder='Title' />
//           <div className='event--add__time'>
//             <input type='date' name='start_date' required='required' />
//             <input type='time' name='start_time' />
//             <input type='date' name='end_date' />
//             <input type='time' name='end_time' />
//             <span className='all-day'>
//               <input type='checkbox' name='all_day' onClick={this.hideTime} />
//             </span>
//           </div>
//           <input type='text' name='venue' placeholder='Venue' />
//           <input type='text' name='organizer' placeholder='Organizer' />
//           <textarea name='description' placeholder='Description' />
//           <input type='text' name='url' placeholder='External link' />
//           <input type='text' name='image' placeholder='Image' />
//           <button onClick={this.handleSubmit}>Add Event</button>
//         </form>
//       </div>
//     )
//   }
// });

// module.exports = EventAdd;