'use strict';

var Util = require('listwidget/Util');


var _BASE_URL = 'https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/',
    SIG_URL_MONTH = _BASE_URL + 'significant_month.geojson',
    SIG_URL_WEEK  = _BASE_URL + 'significant_week.geojson',
    SIG_URL_DAY   = _BASE_URL + 'significant_day.geojson',
    SIG_URL_HOUR   = _BASE_URL + 'significant_hour.geojson',
    ALL_URL_MONTH = _BASE_URL + 'all_month.geojson',
    ALL_URL_WEEK  = _BASE_URL + 'all_week.geojson',
    ALL_URL_DAY   = _BASE_URL + 'all_day.geojson',
    ALL_URL_HOUR   = _BASE_URL + 'all_hour.geojson',
    M45_URL_MONTH = _BASE_URL + '4.5_month.geojson',
    M45_URL_WEEK = _BASE_URL + '4.5_week.geojson',
    M45_URL_DAY = _BASE_URL + '4.5_day.geojson',
    M45_URL_HOUR = _BASE_URL + '4.5_hour.geojson',
    M25_URL_MONTH = _BASE_URL + '2.5_month.geojson',
    M25_URL_WEEK = _BASE_URL + '2.5_week.geojson',
    M25_URL_DAY = _BASE_URL + '2.5_day.geojson',
    M25_URL_HOUR = _BASE_URL + '2.5_hour.geojson',
    M1_URL_MONTH = _BASE_URL + '1.0_month.geojson',
    M1_URL_WEEK = _BASE_URL + '1.0_week.geojson',
    M1_URL_DAY = _BASE_URL + '1.0_day.geojson',
    M1_URL_HOUR = _BASE_URL + '1.0_hour.geojson';


/**
 * A simplified API for embedding a list of earthquakes on a web page.
 *
 * @param container {DOMElement}
 *      A container into which the list should be embedded.
 * @param feed {String}
 *      The URL to the GeoJSON feed containing earthquake data.
 *
 * @param compareEvents {Function} Optional
 *      A comparator function suitable for sorting event objects as defined in
 *      the GeoJSON feed. This method should conform to the Array.sort
 *      compareFunction specification. If not specified, events are sorted by
 *      event time, most recent first.
 * @param includeEvent {Function} Optional
 *      A function that should accept an event object as defined in the GeoJSON
 *      feed and returns true if the event should be listed, false otherwise.
 *      If not specified, all events in the feed are listed.
 * @param load {Boolean} Optional
 *      Whether or not to auto-load the list of earthquakes upon instantiation.
 *      If not specified, the list is automatically loaded. If specified as
 *      false, events can be manually loaded by calling the ```load``` method.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Array/sort
 *
 */
var EqList = function (params) {
  var _this,
      _initialize,

      _container,
      _css,
      _feed,
      _includeEvent,

      _compareEvents,
      _createError,
      _emptyContainer,
      _fetchList,
      _filterEvents,
      _generateLoading,
      _render;


  _this = {};

  /**
   * @constructor
   *
   */
  _initialize = function (params) {
    _container = params.container || document.createElement('div');
    _feed = params.feed || SIG_URL_MONTH;

    _includeEvent = params.includeEvent || null;
    _compareEvents = params.compareEvents || null;
    _css = params.css || null;

    if (params.load !== false) {
      _this.load();
    }
  };

  /**
   * @PrivateMethod
   *
   * @param message {String}
   *      The message to display in the error.
   *
   * @return {DOMElement}
   *      An error DOM element containing the message to display.
   */
  _createError = function (message) {
    var p = document.createElement('p');

    p.className = 'error';
    p.innerHTML = message;

    return p;
  };

  /**
   * @PrivateMethod
   *
   */
  _emptyContainer = function () {
    _container.innerHTML = '';
  };

  /**
   * @PrivateMethod
   *
   * Executes an asynchronous JSONP request for the configured feed. Called
   * internally by the ```load``` method.
   *
   * @see EqList#load
   */
  _fetchList = function () {
    var xhr = new XMLHttpRequest();

    xhr.open('GET', _feed, true);
    xhr.addEventListener('load', function () {
      _render(JSON.parse(xhr.responseText));
    });
    xhr.send();
  };

  /**
   * @PrivateMethod
   *
   * Filters the given array of events based on the result of the
   * ```includeEvent``` method.
   *
   * Note: We filter separate from rendering such that:
   *   (a) if no events pass the filter, we can still show the no events
   *       message to the user
   *   (b) we can sort the events
   *
   * @param events {Array}
   *      The array of event data to filter.
   *
   * @return {Array}
   *      A new array containing event data for events that passed filtering.
   */
  _filterEvents = function (events) {
    var filtered = events.slice(0),
        i = events.length - 1,
        includeEvent;

    includeEvent = _includeEvent || _this.includeEvent;

    for (; i >= 0; i--) {
      if (!includeEvent(events[i])) {
        filtered.splice(i, 1);
      }
    }

    return filtered;
  };

  /**
   * @PrivateMethod
   *
   * Puts a loading message into the configured container for this list
   * instance.
   *
   */
  _generateLoading = function () {
    var loading = _container.appendChild(document.createElement('p'));
    loading.className = 'eqlist-loading';

    loading.innerHTML =
      'Fetching list of earthquakes. If this takes longer ' +
      'than is reasonable, you can <a href="' + _feed + '">view the ' +
      'source data</a>.';
  };

  /**
   * @PrivateMethod
   *
   * Accepts input data (a GeoJSON feed), filters and sorts the contained
   * events, and renders them in a list format into the configured container.
   *
   * If no events remain to be rendered after filtering, a message indiciating
   * no events found is displayed instead.
   *
   * @param data {GeoJSON}
   *      The data containing events to render.
   */
  _render = _this.render = function (data) {
    var events = _filterEvents(data.features),
        i = 0,
        len = events.length,
        list,
        markup = [];

    if (len === 0) {
      _emptyContainer();
      _container.appendChild(_createError('No Events Found.'));
      return;
    }

    events.sort(_compareEvents || _this.compareEvents);

    for (i = 0; i < len; i++) {
      markup.push(_this.getEventMarkup(events[i]));
    }

    // Append to the DOM
    _emptyContainer();
    list = document.createElement('ol');
    list.className = _this.getClassName().toLowerCase();
    list.innerHTML = markup.join('');
    _container.appendChild(list);
  };


  /**
   * @APIMethod - May be overriden by sub-class, or by constructor parameter.
   *
   * Compares the given events for sorting purposes. This implementation sorts
   * by time, newest first.
   *
   * Note: This method can be overriden at run time if the caller specifies
   * a custom compareEvents method in the constructor parameters.
   *
   * @param e1 {Object}
   *      A single event feature object for the first event to compare.
   * @param e2 {Object}
   *      A single event feature object for the second event to compare.
   *
   * @return {Number}
   *      Less than zero if e1 > e2
   *      Zero if e1 == e2
   *      Greater than zero if e1 < e2
   */
  _this.compareEvents = function (e1, e2) {
    return (e2.properties.time - e1.properties.time);
  };

  /**
   * @APIMethod - May be overriden by sub-class.
   *
   * @return {String}
   *      A space-separated string of CSS class names to add to the list
   *      embedded list.
   */
  _this.getClassName = function () {
    return 'EqList';
  };

  /**
   * @APIMethod - May be overriden by sub-class.
   *
   * @param e {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {String}
   *      The content to render as "aside" text.
   */
  _this.getEventAside = function (e) {
    return Util.formatDepth(e.geometry.coordinates[2]) + ' km';
  };

  /**
   * @APIMethod - May be overriden by sub-class.
   *
   * Gets the markup for one event. Default implementation creates a list item
   * and uses the ```getEventValue```, ```getEventTitle```,
   * ```getEventSubtitle```, and ```getEventAside```.
   *
   * @param e {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {String}
   *      A string representing the markup for a single event feature.
   */
  _this.getEventMarkup = function (e) {
    var p = e.properties;

    return [
      '<li class="eqitem">',
        '<span class="value">', _this.getEventValue(e), '</span>',
        '<a class="title" href="', p.url, '">',
          _this.getEventTitle(e),
        '</a>',
        '<div class="row">',
          '<span class="subtitle column mobile-three-of-four">',
              _this.getEventSubtitle(e), '</span>',
          '<span class="aside column mobile-one-of-four">',
              _this.getEventAside(e),
          '</span>',
        '</div>',
      '</li>'
    ].join('');
  };

  /**
   * @APIMethod - May be overriden by sub-class.
   *
   * @param e {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {String}
   *      The content to render as "subtitle" text.
   */
  _this.getEventSubtitle = function (e) {
    return Util.formatDate(e.properties.time);
  };

  /**
   * @APIMethod - May be overriden by sub-class.
   *
   * @param e {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {String}
   *      The content to render as "title" text.
   */
  _this.getEventTitle = function (e) {
    return e.properties.place;
  };

  /**
   * @APIMethod - May be overriden by sub-class.
   *
   * @param e {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {String}
   *      The content to render as "value" text.
   */
  _this.getEventValue = function (e) {
    return Util.formatMagnitude(e.properties.mag);
  };

  /**
   * This implementation includes all events and statically returns true.
   *
   * @param event {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {Boolean}
   *      True if the event should be rendered in the list. False otherwise.
   */
  _this.includeEvent = function (/*event*/) {
    return true;
  };

  /**
   * Loads (or re-loads) the configured feed. Once the feed is loaded, the
   * returned data is automatically rendered in the configured container.
   * Called during construction unless params.load is set to false.
   *
   */
  _this.load = function () {
    _generateLoading();
    _fetchList();
  };


  _initialize(params||{});
  params = null;
  return _this;
};


// Expose these as statics for external usage
EqList.SIG_URL_MONTH = SIG_URL_MONTH;
EqList.SIG_URL_WEEK = SIG_URL_WEEK;
EqList.SIG_URL_DAY = SIG_URL_DAY;
EqList.SIG_URL_HOUR = SIG_URL_HOUR;

EqList.ALL_URL_MONTH = ALL_URL_MONTH;
EqList.ALL_URL_WEEK = ALL_URL_WEEK;
EqList.ALL_URL_DAY = ALL_URL_DAY;
EqList.ALL_URL_HOUR = ALL_URL_HOUR;

EqList.M45_URL_MONTH = M45_URL_MONTH;
EqList.M45_URL_WEEK = M45_URL_WEEK;
EqList.M45_URL_DAY = M45_URL_DAY;
EqList.M45_URL_HOUR = M45_URL_HOUR;

EqList.M25_URL_MONTH = M25_URL_MONTH;
EqList.M25_URL_WEEK = M25_URL_WEEK;
EqList.M25_URL_DAY = M25_URL_DAY;
EqList.M25_URL_HOUR = M25_URL_HOUR;

EqList.M1_URL_MONTH = M1_URL_MONTH;
EqList.M1_URL_WEEK = M1_URL_WEEK;
EqList.M1_URL_DAY = M1_URL_DAY;
EqList.M1_URL_HOUR = M1_URL_HOUR;

module.exports = EqList;
