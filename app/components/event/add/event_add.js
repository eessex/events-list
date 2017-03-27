import React, { Component, PropTypes } from 'react';
import $ from 'jquery'
import moment from 'moment'

class EventAdd extends React.Component {
  constructor(props) {
    super(props);

    this.componentDidMount = () => this._componentDidMount()

    this.state = {
    	event: {}
    }
  }

  _componentDidMount() {
  	debugger
  }

  render() {
  	return (
  		<h1>hello</h1>
  	)
  }

}
export default EventAdd;