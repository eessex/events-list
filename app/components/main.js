import React from 'react'
import Navbar from './navbar.js'

const Main = React.createClass({
  render() {
    return (
    	<div className='react-container'>
	      <Navbar />
        {this.props.children}
      </div>
    )
  }
})

module.exports = Main;