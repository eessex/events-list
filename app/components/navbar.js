import React from 'react'
import { Link, IndexLink } from 'react-router'

const Navbar = React.createClass({
	render() {
  	const styles={
  		nav: {
	  		display: 'flex',
	  		justifyContent: 'space-between'
	  	},
	  	navItems: {
	  		display: 'flex',
	  		listStyle: 'none'
	  	},
	    link: {
	      marginLeft: 5
	    }
	  }

    return (
    	<nav className='nav nav--main responsive-container' style={styles.nav}>
	        <h1 className='nav--main__logo'>
	        	<IndexLink to="/" activeClassName="active">Events List</IndexLink>
	        </h1>
	        <ul className='nav--main__items' style={styles.navItems}>
	          <li><Link to="/events">Events</Link></li>
            <li style={styles.link}><Link to="/new/event">New Event</Link></li>
	          <li style={styles.link}><Link to="/info">Info</Link></li>
	        </ul>
	      </nav>
	  )
	}
})

module.exports = Navbar
