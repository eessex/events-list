webpackHotUpdate(0,{

/***/ 539:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(22), RootInstanceProvider = __webpack_require__(23), ReactMount = __webpack_require__(18), React = __webpack_require__(2); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

'use strict';

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(15);

var _reactDom2 = _interopRequireDefault(_reactDom);

var _jquery = __webpack_require__(102);

var _jquery2 = _interopRequireDefault(_jquery);

var _underscore = __webpack_require__(345);

var _underscore2 = _interopRequireDefault(_underscore);

var _event_add = __webpack_require__(301);

var _event_add2 = _interopRequireDefault(_event_add);

var _event_filter = __webpack_require__(536);

var _event_filter2 = _interopRequireDefault(_event_filter);

var _events_table = __webpack_require__(541);

var _events_table2 = _interopRequireDefault(_events_table);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventsList = _react2.default.createClass({
  displayName: 'EventsList',
  getInitialState: function getInitialState() {
    return {
      events: []
    };
  },
  componentDidMount: function componentDidMount() {
    this.loadEvents(null, null);
  },
  loadEvents: function loadEvents(cb, filter) {
    _jquery2.default.ajax('/api/events').done(function (data) {
      this.setState({ events: data });
      if (cb) {
        cb(filter);
      }
    }.bind(this));
  },
  changeFilter: function changeFilter(newFilter) {
    // this.props.router.push({search: '?' + $.param(newFilter)});
    if (newFilter.published == 'true') {
      newFilter.published = true;
    } else if (newFilter.published == 'false') {
      newFilter.published = false;
    }
    this.loadEvents(this.filterList, newFilter);
  },
  filterList: function filterList(filter) {
    var events = _underscore2.default.where(this.state.events, filter);
    this.setState({ events: events });
  },
  addEvent: function addEvent(event) {
    console.log("Adding event:", event);
    _jquery2.default.ajax({
      type: 'POST',
      url: '/api/events',
      contentType: 'application/json',
      data: JSON.stringify(event),
      success: function (data) {
        var event = data;
        var eventsModified = this.state.events.concat(event);
        this.setState({ events: eventsModified });
      }.bind(this),
      error: function error(xhr, status, err) {
        console.log("Error adding event:", err);
      }
    });
  },
  render: function render() {
    return _react2.default.createElement(
      'div',
      { className: 'events--list' },
      _react2.default.createElement(
        'div',
        { className: 'responsive-container' },
        _react2.default.createElement(_event_filter2.default, {
          submitHandler: this.changeFilter,
          initFilter: this.props.location.query })
      ),
      _react2.default.createElement(_events_table2.default, {
        events: this.state.events }),
      _react2.default.createElement(_event_add2.default, {
        events: this.state.events,
        addEvent: this.addEvent })
    );
  }
});

module.exports = EventsList;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(24); if (makeExportsHot(module, __webpack_require__(2))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "events_list.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module)))

/***/ })

})