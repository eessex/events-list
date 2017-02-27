import EventDetails from '../components/event/event_details.js';
import { fetchEvent, fetchEventSuccess, fetchEventFailure, resetActiveEvent, resetDeletedEvent } from '../actions/events';
import { connect } from 'react-redux';



function mapStateToProps(globalState, ownProps) {
  return {
    activeEvent: globalState.events.activeEvent,
    eventId: ownProps.id
  };
}

const mapDispatchToProps = (dispatch) => {
  return {
    fetchEvent: (id) => {
      dispatch(fetchEvent(id))
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
    }
  }
}


export default connect(mapStateToProps, mapDispatchToProps)(EventDetails);