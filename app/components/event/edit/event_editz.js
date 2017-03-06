import React, { Component, PropTypes } from 'react';
import { Link } from 'react-router';
import { reduxForm, Field, SubmissionError } from 'redux-form';
import renderField from './render_field';
import renderTextArea from './render_textarea';
import { validateEventFields, validateEventFieldsSuccess, validateEventFieldsFailure } from '../../../actions/events';
import { createEvent, createEventSuccess, createEventFailure, resetNewEvent } from '../../../actions/events';

//Client side validation
function validate(values) {
  const errors = {};
  if (!values.title || values.title.trim() === '') {
    errors.title = 'Enter a Title';
  }
  if (!values.start_date || values.start_date.trim() === '') {
    errors.start_date = 'Enter Event Date';
  }
  if (!values.description || values.description.trim() === '') {
    errors.description = 'A description is required';
  }

  return errors;
}

//For instant async server validation
const asyncValidate = (values, dispatch) => {
  return dispatch(validateEventFields(values))
    .then((result) => {
      //Note: Error's "data" is in result.payload.response.data
      // success's "data" is in result.payload.data
      if (!result.payload.response) { //1st onblur
        return;
      }

      let {data, status} = result.payload.response;
      //if status is not 200 or any one of the fields exist, then there is a field error
      if (response.payload.status != 200 || data.title || data.start_date || data.description) {
        //let other components know of error by updating the redux` state
        dispatch(validateEventFieldsFailure(data));
        throw data; //throw error
      } else {
        //let other components know that everything is fine by updating the redux` state
        dispatch(validateEventFieldsSuccess(data)); //ps: this is same as dispatching RESET_USER_FIELDS
      }
    });
};

//For any field errors upon submission (i.e. not instant check)
const validateAndCreateEvent = (values, dispatch) => {
  return dispatch(createEvent(values))
  // return dispatch(createEvent(values, sessionStorage.getItem('jwtToken')))
    .then(result => {
      // Note: Error's "data" is in result.payload.response.data (inside "response")
      // success's "data" is in result.payload.data
      if (result.payload.response && result.payload.response.status !== 200) {
        dispatch(createEventFailure(result.payload.response.data));
        throw new SubmissionError(result.payload.response.data);
      }
      //let other components know that everything is fine by updating the redux` state
      dispatch(createEventSuccess(result.payload.data)); //ps: this is same as dispatching RESET_USER_FIELDS
    });
}



class EventsForm extends Component {
  static contextTypes = {
    router: PropTypes.object
  };

  componentWillMount() {
    //Important! If your component is navigating based on some global state(from say componentWillReceiveProps)
    //always reset that global state back to null when you REMOUNT
    // this.props.resetMe();
  }

  componentWillReceiveProps(nextProps) {
    // if (nextProps.newEvent.event && !nextProps.newEvent.error) {
    //   this.context.router.push('/');
    // }
  }

  renderError(newEvent) {
    if (newEvent && newEvent.error && newEvent.error.message) {
      return (
        <div className="alert alert-danger">
          { newEvent ? newEvent.error.message : '' }
        </div>
        );
    } else {
      return <span></span>
    }
  }
  render() {
    const {handleSubmit, submitting, newEvent} = this.props;
    return (
      <div className='container'>
        { this.renderError(newEvent) }
        <form onSubmit={ handleSubmit(validateAndCreateEvent) }>
          <Field
                 name="title"
                 type="text"
                 component={ renderField }
                 label="Title *" />
          <Field
                 name="start_date"
                 type="text"
                 component={ renderField }
                 label="Event Date *" />
          <Field
                 name="description"
                 component={ renderTextArea }
                 label="Description *" />
          <div>
            <button
                type="submit"
                className="btn btn-primary"
                disabled={ submitting }>
              Submit
            </button>
            <Link
                  to="/"
                  className="btn btn-error"> Cancel
            </Link>
          </div>
        </form>
      </div>
    )
  }
}


export default reduxForm({
  form: 'EventsForm', // a unique identifier for this form
  validate, // <--- validation function given to redux-form
  asyncValidate
})(EventsForm)