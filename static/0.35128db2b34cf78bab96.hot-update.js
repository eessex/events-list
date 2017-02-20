webpackHotUpdate(0,{

/***/ 541:
/***/ (function(module, exports, __webpack_require__) {

/* WEBPACK VAR INJECTION */(function(module) {/* REACT HOT LOADER */ if (true) { (function () { var ReactHotAPI = __webpack_require__(22), RootInstanceProvider = __webpack_require__(23), ReactMount = __webpack_require__(18), React = __webpack_require__(2); module.makeHot = module.hot.data ? module.hot.data.makeHot : ReactHotAPI(function () { return RootInstanceProvider.getRootInstances(ReactMount); }, React); })(); } try { (function () {

'use strict';

var _react = __webpack_require__(2);

var _react2 = _interopRequireDefault(_react);

var _reactDom = __webpack_require__(15);

var _reactDom2 = _interopRequireDefault(_reactDom);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var EventRow = __webpack_require__(540);

var EventsTable = _react2.default.createClass({
  displayName: 'EventsTable',
  getEventRows: function getEventRows() {
    var eventRows = this.props.events.map(function (event, i) {
      return _react2.default.createElement(EventRow, { key: event._id, event: event });
    });
    return eventRows;
  },
  render: function render() {
    var headerStyle = {
      display: 'flex',
      justifyContent: 'space-between',
      textAlign: 'left',
      borderBottom: '1px solid',
      padding: '.25em 1em'
    };
    return _react2.default.createElement(
      'div',
      { className: 'event-table' },
      _react2.default.createElement(
        'div',
        { className: 'event-table__header', style: headerStyle },
        _react2.default.createElement(
          'div',
          { className: 'th' },
          'Slug'
        ),
        _react2.default.createElement(
          'div',
          { className: 'th' },
          'Title'
        ),
        _react2.default.createElement(
          'div',
          { className: 'th' },
          'Venue'
        ),
        _react2.default.createElement(
          'div',
          { className: 'th' },
          'Organizer'
        ),
        _react2.default.createElement(
          'div',
          { className: 'th' },
          'Description'
        )
      ),
      _react2.default.createElement(
        'div',
        { className: 'event-table__body' },
        this.getEventRows()
      )
    );
  }
});

module.exports = EventsTable;

/* REACT HOT LOADER */ }).call(this); } finally { if (true) { (function () { var foundReactClasses = module.hot.data && module.hot.data.foundReactClasses || false; if (module.exports && module.makeHot) { var makeExportsHot = __webpack_require__(24); if (makeExportsHot(module, __webpack_require__(2))) { foundReactClasses = true; } var shouldAcceptModule = true && foundReactClasses; if (shouldAcceptModule) { module.hot.accept(function (err) { if (err) { console.error("Cannot apply hot update to " + "events_table.js" + ": " + err.message); } }); } } module.hot.dispose(function (data) { data.makeHot = module.makeHot; data.foundReactClasses = foundReactClasses; }); })(); } }
/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(16)(module)))

/***/ })

})