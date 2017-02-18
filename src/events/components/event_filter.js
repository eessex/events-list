import React from 'react'
import ReactDOM from 'react-dom'

const EventFilter = React.createClass({

	getInitialState() {
		const initFilter = this.props.initFilter;
    return {
    	published: initFilter.published,
    	priority: initFilter.priority
    };
  },
  componentWillReceiveProps(newProps) {
    if (newProps.initFilter.published === this.state.published
        && newProps.initFilter.priority === this.state.priority) {
      return;
    }
    this.setState({published: newProps.initFilter.published, priority: newProps.initFilter.priority});
  },
  onChangePublished(e) {
    this.setState({published: e.target.value});
  },
  onChangePriority(e) {
    this.setState({priority: e.target.value});
  },

  submit(e) {
    const newFilter = {};
    if (this.state.priority) newFilter.priority = this.state.priority;
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
        <div className="event-filter--group" style={filter}>
          <label>Priority:</label>
          <select value={this.state.priority} onChange={this.onChangePriority}>
            <option value="">All</option>
            <option value="P1">P1</option>
            <option value="P2">P2</option>
            <option value="P3">P3</option>
          </select>
        </div>
        <button onClick={this.submit}>Filter</button>
      </div>
    )
	}
});

module.exports = EventFilter;