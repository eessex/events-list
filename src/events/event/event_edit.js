import React from 'react'
import ReactDOM from 'react-dom'
import $ from 'jquery'
import moment from 'moment'
import s from 'underscore.string'

const EventEdit = React.createClass({
  getInitialState() {
    return {
      successVisible: false
    };
  },
  componentDidMount() {
    this.loadEvent();
  },
  componentDidUpdate(prevProps) {
    if (this.props.params.id != prevProps.params.id) {
      this.loadEvent();
    }
  },
  loadEvent() {
    $.ajax('/api/events/' + this.props.params.id).done(function(event) {
      this.setState(event);
    }.bind(this));
  },

  onInputChange(e) {
    const changed = e.target.name
    const newState = this.state
    newState[changed] = e.target.value
    this.setState({newState});
  },

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

  showSuccess() {
    this.setState({successVisible: true});
  },
  dismissSuccess() {
    this.setState({successVisible: false});
  },

  submit(e) {
    e.preventDefault();
    const event = {
      published: this.state.published,
      priority: this.state.priority,
      title: this.state.title,
      venue: this.state.venue,
      organizer: this.state.organizer,
      description: this.state.description,
      updated_at: moment(new Date()).toISOString()
    }
    if (changed == 'title') {
      const slug = this.getSlug(event)
      newState.slugs.push(slug)
      newState.slug = slug
    }

    $.ajax({
      url: '/api/events/' + this.props.params.id,
      type: 'PUT',
      contentType:'application/json',
      data: JSON.stringify(event),
      dataType: 'json',
      success: function(event) {
        this.setState(event);
        this.showSuccess();
      }.bind(this),
    });
  },

  deleteEvent(e) {
    e.preventDefault();
    var url = '/api/events/' + this.props.params.id
    console.log("Delete event:", this.props.params.id);
    $.ajax({
      type: 'DELETE',
      url: url,
      contentType: 'application/json',
      success: function(data) {
        console.log("Deleted event:", data);
        //here install working forward to all events
      }.bind(this),
      error: function(xhr, status, err) {
        console.log("Error adding event:", err);
      }
    });
  },
  render() {
    const success = (
      <div className="modal alert--success" onClick={this.dismissSuccess}>
        <h1>Changes saved.</h1>
      </div>
    );
    return (
      <div className='event--edit'>
        <h2>Edit event: {this.props.params.id}</h2>
        <form onSubmit={this.submit}>
          <div className='form-group published'>
            <label>Status:</label>
            <select value={this.state.published} onChange={this.onInputChange}>
              <option value={false}>Draft</option>
              <option value={true}>Published</option>
            </select>
          </div>
          <div className='form-group title'>
            <label>Title:</label>
            <input type="text"
              name="title"
              value={this.state.title}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group venue'>
            <label>Venue:</label>
            <input type="text"
              name="venue"
              value={this.state.venue}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group organizer'>
            <label>Organizer:</label>
            <input type="text"
              name="organizer"
              value={this.state.organizer}
              onChange={this.onInputChange} />
          </div>
          <div className='form-group'>
            <label>Description:</label>
            <textarea
              name="description"
              placeholder="Description"
              value={this.state.description}
              onChange={this.onInputChange} />
          </div>
          <button type="submit">Submit</button>
          <button onClick={this.deleteEvent}>Delete</button>
        </form>
        {this.state.successVisible ? success : null}
      </div>
    );
  }
});

module.exports = EventEdit;