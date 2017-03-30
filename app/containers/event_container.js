import EventDetails from '../components/event/event_details.js';
import { updateEvent, updateEventSuccess, updateEventFailure, createEvent, createEventSuccess, createEventFailure, fetchEvent, fetchEventSuccess, fetchEventFailure, resetActiveEvent, resetDeletedEvent, resetNewEvent } from '../actions/events';
import { connect } from 'react-redux';



function mapStateToProps(globalState, ownProps) {
  return {
    activeEvent: globalState.events.activeEvent,
    newEvent: {
        all_day: false,
        description: '',
        end_date: null,
        images: [],
        organizer: '',
        published: false,
        slug: '',
        slugs: [],
        start_date: null,
        title: '',
        urls: [],
        venue: ''
      },
    eventId: ownProps.id
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    updateEvent: (event) => {
      dispatch(updateEvent(event))
        .then((result) => {
          console.log(result.payload)
          if (result.payload.response && result.payload.response.status !== 200) {
            dispatch(updateEventFailure(result.payload.response.data));
          } else {
            dispatch(updateEventSuccess(result.payload.data))
          }
        })
    },
    createEvent: (event) => {
      dispatch(createEvent(event))
        .then((result) => {
          console.log(result.payload)
          debugger
          if (result.payload.response && result.payload.response.status !== 200) {
            dispatch(createEventFailure(result.payload.response.data));
          } else {
            dispatch(createEventSuccess(result.payload.data))
          }
        })
    },
    fetchEvent: (_id) => {
      dispatch(fetchEvent(_id))
        .then((result) => {
          // Note: Error's "data" is in result.payload.response.data (inside "response")
          // success's "data" is in result.payload.data
          if (result.payload.response && result.payload.response.status !== 200) {
            dispatch(fetchEventFailure(result.payload.response.data));
          } else {
            dispatch(fetchEventSuccess(result.payload.data))
          }
        })
    },
    resetMe: () => {
      //clean up both activeEvent(currrently open) and deletedEvent(open and being deleted) states
      dispatch(resetActiveEvent());
      dispatch(resetDeletedEvent());
      dispatch(resetNewEvent());
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);