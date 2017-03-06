// import React from 'react'
// import ReactDOM from 'react-dom'
// import $ from 'jquery'
// import moment from 'moment'
// import s from 'underscore.string'

// import './event_edit.scss';

// const EventEdit = React.createClass({
//   getInitialState() {
//     return {
//       successVisible: false,
//       event: {
//         start_date: '',
//         end_date: '',
//         all_day: false,
//         title: '',
//         description: '',
//         venue: '',
//         organizer: '',
//         images: [],
//         slugs: [],
//         urls: [],
//         images: [],
//         published: false,
//       },
//       url: '',
//       image: '',
//       start_date: '',
//       start_time: '',
//       end_date: '',
//       end_time: ''
//     };
//   },
//   componentDidMount() {
//     this.loadEvent()
//   },
//   componentDidUpdate(prevProps) {
//     if (this.props.params.id && this.props.params.id != prevProps.params.id) {
//       this.loadEvent()
//     }
//   },
//   loadEvent() {
//     var date = this.loadFormattedDates(this.props.event)
//     this.setState({
//       event: this.props.event,
//       start_date: date.start_date,
//       start_time: date.start_time,
//       end_date: date.end_date,
//       end_time: date.end_time
//     })
//   },
//   loadFormattedDates(event) {
//     var start_date = ''
//     var start_time = ''
//     var end_date = ''
//     var end_time = ''
//     if (event.start_date) {
//       start_date = moment(event.start_date).format('YYYY-MM-DD')
//       start_time = moment(event.start_date).format('HH:mm')
//     }
//     if (event.end_date) {
//       end_date = moment(event.end_date).format('YYYY-MM-DD')
//       end_time = moment(event.end_date).format('HH:mm')
//     }
//     if (event.all_day) {
//       $('input[type=time]').toggle('display')
//     }
//     return {start_date, start_time, end_date, end_time}
//   },
//   onInputChange(e) {
//     const changed = e.target.name
//     const state = this.state
//     if (changed == 'all_day') {
//       state.event.all_day = e.target.checked
//       $('input[type=time]').toggle('display')
//     } else if (changed == 'published') {
//       if (e.target.value == 'true') {
//         state.event[changed] = true
//       } else {
//         state.event[changed] = false
//       }
//     } else if (
//       changed != 'start_date' &&
//       changed != 'start_time' &&
//       changed != 'end_time' &&
//       changed != 'url' &&
//       changed != 'image') {
//       state.event[changed] = e.target.value
//     } else {
//       state[changed] = e.target.value
//     }
//     this.setState({state})
//   },
//   addUrl() {
//     const event = this.state.event
//     event.urls.push(document.forms.EventEdit.url.value)
//     document.forms.EventEdit.url.value = ''
//     const url = ''
//     this.setState({event, url})
//   },
//   deleteUrl(e) {
//     const event = this.state.event
//     event.urls.splice(e.target.id)
//     this.setState({event})
//     this.submit(e)
//   },
//   addImage() {
//     const event = this.state.event
//     event.images.push({url: document.forms.EventEdit.image.value})
//     const image = ''
//     document.forms.EventEdit.image.value = ''
//     this.setState({event, image})
//   },
//   deleteImage(e) {
//     const event = this.state.event
//     event.images.splice(e.target.id)
//     this.setState({event})
//     this.submit(e)
//   },
//   getSlug(event) {
//     const slug = s.slugify(event.title)
//     const match = _.where(this.props.events, {slug: slug})
//     if (match.length != 0) {
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

//   showSuccess() {
//     this.setState({successVisible: true})
//   },
//   dismissSuccess() {
//     this.setState({successVisible: false})
//   },
//   formatDateInput() {
//     const form = document.forms.EventEdit
//     var all_day = false
//     if (form.all_day.checked) {
//       all_day = true
//     }
//     const start_date = moment(form.start_date.value + ' ' + form.start_time.value)
//     const date = {start_date: start_date, all_day: all_day}
//     if (form.end_date.value) {
//       if (form.end_time.value) {
//         date.end_date = moment(form.end_date.value + ' ' + form.end_time.value)
//       } else {
//         date.end_date = moment(form.end_date.value)
//       }
//     }
//     return date
//   },
//   submit(e) {
//     e.preventDefault()
//     const date = this.formatDateInput()
//     const event = {
//       title: this.state.event.title,
//       start_date: moment(date.start_date).toISOString(),
//       all_day: date.all_day,
//       venue: this.state.event.venue,
//       organizer: this.state.event.organizer,
//       description: this.state.event.description,
//       updated_at: moment(new Date()).toISOString(),
//       published: this.state.event.published,
//       urls: this.state.event.urls,
//       images: this.state.event.images
//     }
// // update slug if title has changed
//     if (date.end_date) {
//       event.end_date = moment(date.end_date).toISOString()
//     }
//     $.ajax({
//       url: '/api/events/' + this.props.params.id,
//       type: 'PATCH',
//       contentType:'application/json',
//       data: JSON.stringify(event),
//       dataType: 'json',
//       success: function(event) {
//         this.setState({event: event});
//         this.showSuccess();
//       }.bind(this),
//     });
//   },

//   deleteEvent(e) {
//     e.preventDefault();
//     const url = '/api/events/' + this.props.params.id
//     console.log('Delete event:', this.props.params.id);
//     $.ajax({
//       type: 'DELETE',
//       url: url,
//       contentType: 'application/json',
//       success: function(data) {
//         console.log('Deleted event:', data);
//         //here install working forward to all events
//       }.bind(this),
//       error: function(xhr, status, err) {
//         console.log('Error adding event:', err);
//       }
//     });
//   },
//   printDateInput(date) {
//     var format_date = ''
//     var format_time = ''
//     var time
//     if (date == 'start') {
//       if (this.state.start_date) {
//         format_date = moment(this.state.start_date).format('YYYY-MM-DD')
//       }
//       format_time = this.state.start_time
//     } else {
//       if (this.state.end_date) {
//         format_date = moment(this.state.end_date).format('YYYY-MM-DD')
//       }
//       format_time = this.state.end_time
//     }
//     var print_date = <div className='form-group start-date'>
//             <label>{date} Date:</label>
//             <input type='date'
//               name={date + '_date'}
//               value={format_date}
//               onChange={this.onInputChange} />
//             <input type='time'
//               name={date + '_time'}
//               value={format_time}
//               onChange={this.onInputChange} />
//           </div>
//     return print_date
//   },
//   printFormattedUrls(event) {
//     if (event.urls && event.urls.length > 0) {
//       var urls = event.urls.map(function(url, i) {
//         return <span key={i} id={i} onClick={this.deleteUrl}>{url} <span id={i} className='delete'>x</span></span>
//       }.bind(this));
//       return urls
//     }
//   },
//   printFormattedImages(event) {
//     if (event.images && event.images.length > 0) {
//       var images = event.images.map(function(image, i) {
//         return <span key={i} id={i} onClick={this.deleteImage}>{image.url} <span id={i} className='delete'>x</span></span>
//       }.bind(this));
//       return images
//     }
//   },
//   render() {
//     const success = (
//       <div className='modal alert--success' onClick={this.dismissSuccess}>
//         <h1>Changes saved.</h1>
//       </div>
//     );
//     if (this.state.event.all_day) {
//       var all_day = 'checked'
//     } else {
//       var all_day = false
//     }
//     return (
//       <div className='event--edit'>
//         <h2>Edit event: {this.state.event.title}</h2>
//         <form onSubmit={this.submit} name='EventEdit' className='event--edit__form'>
//           <div className='form-group published'>
//             <label>Status:</label>
//             <select name='published' value={this.state.event.published} onChange={this.onInputChange}>
//               <option value={false}>Draft</option>
//               <option value={true}>Published</option>
//             </select>
//           </div>
//           <div className='form-group title'>
//             <label>Title:</label>
//             <input type='text'
//               name='title'
//               required={true}
//               value={this.state.event.title}
//               onChange={this.onInputChange} />
//           </div>
//           <div className='field-group dates'>
//             {this.printDateInput('start')}
//             {this.printDateInput('end')}
//             <div className='form-group all-day'>
//               <input type='checkbox'
//                 name='all_day'
//                 checked={all_day}
//                 onChange={this.onInputChange} />
//                 <label>All Day Event</label>
//             </div>
//           </div>
//           <div className='form-group venue'>
//             <label>Venue:</label>
//             <input type='text'
//               name='venue'
//               value={this.state.event.venue}
//               onChange={this.onInputChange} />
//           </div>
//           <div className='form-group organizer'>
//             <label>Organizer:</label>
//             <input type='text'
//               name='organizer'
//               value={this.state.event.organizer}
//               onChange={this.onInputChange} />
//           </div>
//           <div className='form-group description'>
//             <label>Description:</label>
//             <textarea
//               name='description'
//               placeholder='Description'
//               value={this.state.event.description}
//               onChange={this.onInputChange} />
//           </div>
//           <div className='field-group urls'>
//             <div className='form-group url'>
//               <label>External Links:</label>
//               <input type='text'
//                 name='url'
//                 placeholder='External Link'
//                 value={this.state.url}
//                 onChange={this.onInputChange} />
//               <button type='url' className='add' onClick={this.addUrl}>New</button>
//               {this.printFormattedUrls(this.state.event)}
//             </div>
//           </div>
//           <div className='field-group images'>
//             <div className='form-group'>
//               <label>Images:</label>
//               <input type='text'
//                 name='image'
//                 placeholder='Image'
//                 value={this.state.image}
//                 onChange={this.onInputChange} />
//               <button type='image' className='add' onClick={this.addImage}>New</button>
//               {this.printFormattedImages(this.state.event)}
//             </div>
//           </div>
//           <div className='actions'>
//             <button type='submit'>Submit</button>
//             <button onClick={this.deleteEvent}>Delete</button>
//           </div>
//         </form>
//         {this.state.successVisible ? success : null}
//       </div>
//     );
//   }
// });

// module.exports = EventEdit;