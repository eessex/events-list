import axios from 'axios';

//Event list
export const FETCH_EVENTS = 'FETCH_EVENTS';
export const FETCH_EVENTS_SUCCESS = 'FETCH_EVENTS_SUCCESS';
export const FETCH_EVENTS_FAILURE = 'FETCH_EVENTS_FAILURE';
export const RESET_EVENTS = 'RESET_EVENTS';

//Create new event
export const CREATE_EVENT = 'CREATE_EVENT';
export const CREATE_EVENT_SUCCESS = 'CREATE_EVENT_SUCCESS';
export const CREATE_EVENT_FAILURE = 'CREATE_EVENT_FAILURE';
export const RESET_NEW_EVENT = 'RESET_NEW_EVENT';

//Validate event fields like Title, Categries on the server
export const VALIDATE_EVENT_FIELDS = 'VALIDATE_EVENT_FIELDS';
export const VALIDATE_EVENT_FIELDS_SUCCESS = 'VALIDATE_EVENT_FIELDS_SUCCESS';
export const VALIDATE_EVENT_FIELDS_FAILURE = 'VALIDATE_EVENT_FIELDS_FAILURE';
export const RESET_EVENT_FIELDS = 'RESET_EVENT_FIELDS';

//Fetch event
export const FETCH_EVENT = 'FETCH_EVENT';
export const FETCH_EVENT_SUCCESS = 'FETCH_EVENT_SUCCESS';
export const FETCH_EVENT_FAILURE = 'FETCH_EVENT_FAILURE';
export const RESET_ACTIVE_EVENT = 'RESET_ACTIVE_EVENT';

//Delete event
export const DELETE_EVENT = 'DELETE_EVENT';
export const DELETE_EVENT_SUCCESS = 'DELETE_EVENT_SUCCESS';
export const DELETE_EVENT_FAILURE = 'DELETE_EVENT_FAILURE';
export const RESET_DELETED_EVENT = 'RESET_DELETED_EVENT';



const ROOT_URL = location.href.indexOf('localhost') > 0 ? 'http://localhost:3000/api' : '/api';
export function fetchEvents() {
  const request = axios({
    method: 'get',
    url: `${ROOT_URL}/events`,
    headers: []
  });

  return {
    type: FETCH_EVENTS,
    payload: request
  };
}

export function fetchEventsSuccess(events) {
  return {
    type: FETCH_EVENTS_SUCCESS,
    payload: events
  };
}

export function fetchEventsFailure(error) {
  return {
    type: FETCH_EVENTS_FAILURE,
    payload: error
  };
}

export function validateEventFields(props) {
  //note: we cant have /events/validateFields because it'll match /events/:id path!
  const request = axios.event(`${ROOT_URL}/events/validate/fields`, props);

  return {
    type: VALIDATE_EVENT_FIELDS,
    payload: request
  };
}

export function validateEventFieldsSuccess() {
  return {
    type: VALIDATE_EVENT_FIELDS_SUCCESS
  };
}

export function validateEventFieldsFailure(error) {
  return {
    type: VALIDATE_EVENT_FIELDS_FAILURE,
    payload: error
  };
}

export function resetEventFields() {
  return {
    type: RESET_EVENT_FIELDS
  };
}


export function createEvent(props, tokenFromStorage) {
  const request = axios({
    method: 'event',
    data: props,
    url: `${ROOT_URL}/events`,
    // headers: {
    //   'Authorization': `Bearer ${tokenFromStorage}`
    // }
  });

  return {
    type: CREATE_EVENT,
    payload: request
  };
}

export function createEventSuccess(newEvent) {
  return {
    type: CREATE_EVENT_SUCCESS,
    payload: newEvent
  };
}

export function createEventFailure(error) {
  return {
    type: CREATE_EVENT_FAILURE,
    payload: error
  };
}

export function resetNewEvent() {
  return {
    type: RESET_NEW_EVENT
  }
}
;

export function resetDeletedEvent() {
  return {
    type: RESET_DELETED_EVENT
  }
}
;

export function fetchEvent(id) {
  const request = axios.get(`${ROOT_URL}/events/${id}`);

  return {
    type: FETCH_EVENT,
    payload: request
  };
}


export function fetchEventSuccess(activeEvent) {
  return {
    type: FETCH_EVENT_SUCCESS,
    payload: activeEvent
  };
}

export function fetchEventFailure(error) {
  return {
    type: FETCH_EVENT_FAILURE,
    payload: error
  };
}

export function resetActiveEvent() {
  return {
    type: RESET_ACTIVE_EVENT
  }
}


export function deleteEvent(id, tokenFromStorage) {
  const request = axios({
    method: 'delete',
    url: `${ROOT_URL}/events/${id}`,
    // headers: {
    //   'Authorization': `Bearer ${tokenFromStorage}`
    // }
  });
  return {
    type: DELETE_EVENT,
    payload: request
  };
}

export function deleteEventSuccess(deletedEvent) {
  return {
    type: DELETE_EVENT_SUCCESS,
    payload: deletedEvent
  };
}

export function deleteEventFailure(response) {
  return {
    type: DELETE_EVENT_FAILURE,
    payload: response
  };
}