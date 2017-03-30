import React, { Component, PropTypes } from 'react';

class EventShow extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  constructor(props) {
    super(props);
  }

  getImages(event) {
  	if (event.images && event.images.length > 0) {
  	var images = event.images.map(function(image, i) {
  		return <div key={i} id={i}><img src={image.url} width='400'/></div>
  		}.bind(this))
	  	return images
  	}
  }

  getLinks(event) {
  	if (event.urls && event.urls.length > 0) {
  	var urls = event.urls.map(function(url, i) {
  		return <a href={url} key={i} id={i}>{url}</a>
  		}.bind(this))
	  	return urls
  	}
  }

  render() {
    const { loading, event } = this.props;
    if (loading) {
    	return <p>loading</p>
    } else {
	    return (
	      <div className="event--show">
	        <h1>{event.title}</h1>
	        <h3>{event.start_date} {event.end_date}</h3>
	        <h3>{event.venue}</h3>
	        <h3>{event.organizer}</h3>
	        <p>{event.description}</p>
	        {this.getImages(event)}
	        {this.getLinks(event)}
	      </div>
	    );
  	}
  }
}

export default EventShow;

	        // <p>{event.images[0]}</p>
	        // <h5>{event.urls ? event.urls[0] : ''}</h5>

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