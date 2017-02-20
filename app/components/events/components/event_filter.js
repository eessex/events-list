import React from 'react'
import ReactDOM from 'react-dom'

const EventFilter = React.createClass({

	getInitialState() {
		const initFilter = this.props.initFilter;
    return {
    	published: initFilter.published
    };
  },
  componentWillReceiveProps(newProps) {
    if (newProps.initFilter.published === this.state.published) {
      return;
    }
    this.setState({published: newProps.initFilter.published});
  },
  onChangePublished(e) {
    this.setState({published: e.target.value});
  },

  submit(e) {
    const newFilter = {};
    if (this.state.published) newFilter.published = this.state.published;
    this.props.submitHandler(newFilter);
  },

	render() {
    const filter = {
      display: 'flex'
    }
    return (
      <div className="event-filter" style={filter}>
        <div className="event-filter--group" style={filter}>
          <label>Status:</label>
          <select value={this.state.published} onChange={this.onChangePublished}>
            <option value="">All</option>
            <option value={true}>Published</option>
            <option value={false}>Drafts</option>
          </select>
        </div>
        <button onClick={this.submit}>Filter</button>
      </div>
    )
	}
});

module.exports = EventFilter;