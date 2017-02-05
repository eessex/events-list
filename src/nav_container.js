import React from 'react'
import { render } from 'react-dom'
import { Link, IndexLink } from 'react-router'

const NavContainer = React.createClass({
  render() {
  	const nav = {
  		display: 'flex',
  		justifyContent: 'space-between'
  	}
  	const navItems = {
  		display: 'flex',
  		listStyle: 'none'
  	}
    return (
    	<div className='react-container'>
	      <nav className='nav nav--main' style={nav}>
	        <h1 className='nav--main__logo'>
	        	<IndexLink to="/" activeClassName="active">Site</IndexLink>
	        </h1>
	        <ul className='nav--main__items' style={navItems}>
	          <li><Link to="/events">Events</Link></li>
	          <li><Link to="/info">Info</Link></li>
	        </ul>
	      </nav>
        {this.props.children}
      </div>
    )
  }
})

module.exports = NavContainer;