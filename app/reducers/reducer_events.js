import {
  FETCH_EVENTS, FETCH_EVENTS_SUCCESS, FETCH_EVENTS_FAILURE, RESET_EVENTS,
  FETCH_EVENT, FETCH_EVENT_SUCCESS,  FETCH_EVENT_FAILURE, RESET_ACTIVE_EVENT,
  CREATE_EVENT, CREATE_EVENT_SUCCESS, CREATE_EVENT_FAILURE,
  DELETE_EVENT, DELETE_EVENT_SUCCESS, DELETE_EVENT_FAILURE, RESET_DELETED_EVENT,
  UPDATE_EVENT, UPDATE_EVENT_SUCCESS,
  VALIDATE_EVENT_FIELDS,VALIDATE_EVENT_FIELDS_SUCCESS, VALIDATE_EVENT_FIELDS_FAILURE, RESET_EVENT_FIELDS
} from '../actions/events';


  const INITIAL_STATE = {
          eventsList: {events: [], error:null, loading: false},
          activeEvent:{event:{}, error:null, loading: false},
          deletedEvent: {event: null, error:null, loading: false},
        };

export default function(state = INITIAL_STATE, action) {
  let error;
  switch(action.type) {

  case FETCH_EVENTS:
    return { ...state, eventsList: {events:[], error: null, loading: true} };
  case FETCH_EVENTS_SUCCESS:
    return { ...state, eventsList: {events: action.payload, error:null, loading: false} };
  case FETCH_EVENTS_FAILURE:
    error = action.payload || {message: action.payload.message};
    return { ...state, eventsList: {events: [], error: error, loading: false} };
  case RESET_EVENTS:
    return { ...state, eventsList: {events: [], error:null, loading: false} };

  case FETCH_EVENT:
    return { ...state, activeEvent:{...state.activeEvent, loading: true}};
  case FETCH_EVENT_SUCCESS:
    return { ...state, activeEvent: {event: action.payload, error:null, loading: false}};
  case FETCH_EVENT_FAILURE:
    error = action.payload || {message: action.payload.message};
    return { ...state, activeEvent: {event: null, error:error, loading:false}};
  case RESET_ACTIVE_EVENT:
    return { ...state, activeEvent: {event: null, error:null, loading: false}};

  case CREATE_EVENT:
    return {...state, activeEvent: {...state.activeEvent, loading: true}}
  case CREATE_EVENT_SUCCESS:
    return {...state, activeEvent: {event:action.payload, error:null, loading: false}}
  case CREATE_EVENT_FAILURE:
    error = action.payload || {message: action.payload.message};
    return {...state, activeEvent: {event:null, error:error, loading: false}}

  case UPDATE_EVENT:
    return { ...state, activeEvent:{...state.activeEvent, loading: true}};
  case UPDATE_EVENT_SUCCESS:
    return { ...state, activeEvent: {event: action.payload, error:null, loading: false}};


  case DELETE_EVENT:
    return {...state, deletedEvent: {...state.deletedEvent, loading: true}}
  case DELETE_EVENT_SUCCESS:
    return {...state, deletedEvent: {event:action.payload, error:null, loading: false}}
  case DELETE_EVENT_FAILURE:
    error = action.payload || {message: action.payload.message};
    return {...state, deletedEvent: {event:null, error:error, loading: false}}
  case RESET_DELETED_EVENT:
    return {...state,  deletedEvent:{event:null, error:null, loading: false}}

  case VALIDATE_EVENT_FIELDS:
    return {...state, activeEvent:{...state.activeEvent, error: null, loading: true}}
  case VALIDATE_EVENT_FIELDS_SUCCESS:
    return {...state, activeEvent:{...state.activeEvent, error: null, loading: false}}
  case VALIDATE_EVENT_FIELDS_FAILURE:
    let result = action.payload;
    if(!result) {
      error = {message: action.payload.message};
    } else {
      error = {title: result.title, categories: result.start_date, description: result.description};
    }
    return {...state, activeEvent:{...state.activeEvent, error: error, loading: false}}
  case RESET_EVENT_FIELDS:
    return {...state, activeEvent:{...state.activeEvent, error: null, loading: null}}
  default:
    return state;
  }
}