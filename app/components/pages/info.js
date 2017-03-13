import React from 'react'
import { render } from 'react-dom'

const Info = React.createClass({
  render() {
    return (
      <div>
	      <h2>Info</h2>
	      {this.props.children}
      </div>
    );
  }
});

module.exports = Info;