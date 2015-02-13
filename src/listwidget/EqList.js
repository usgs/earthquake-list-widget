'use strict';

var Util = require('listwidget/Util');


var _BASE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/',
    _LOADED_CSS = {},
    _REGISTERED_PARSERS = {},
    _VALIDATE_URL = true;


var SIG_URL_MONTH = _BASE_URL + 'significant_month.geojsonp',
    SIG_URL_WEEK  = _BASE_URL + 'significant_week.geojsonp',
    SIG_URL_DAY   = _BASE_URL + 'significant_day.geojsonp',
    SIG_URL_HOUR   = _BASE_URL + 'significant_hour.geojsonp',
    ALL_URL_MONTH = _BASE_URL + 'all_month.geojsonp',
    ALL_URL_WEEK  = _BASE_URL + 'all_week.geojsonp',
    ALL_URL_DAY   = _BASE_URL + 'all_day.geojsonp',
    ALL_URL_HOUR   = _BASE_URL + 'all_hour.geojsonp',
    M45_URL_MONTH = _BASE_URL + '4.5_month.geojsonp',
    M45_URL_WEEK = _BASE_URL + '4.5_week.geojsonp',
    M45_URL_DAY = _BASE_URL + '4.5_day.geojsonp',
    M45_URL_HOUR = _BASE_URL + '4.5_hour.geojsonp',
    M25_URL_MONTH = _BASE_URL + '2.5_month.geojsonp',
    M25_URL_WEEK = _BASE_URL + '2.5_week.geojsonp',
    M25_URL_DAY = _BASE_URL + '2.5_day.geojsonp',
    M25_URL_HOUR = _BASE_URL + '2.5_hour.geojsonp',
    M1_URL_MONTH = _BASE_URL + '1.0_month.geojsonp',
    M1_URL_WEEK = _BASE_URL + '1.0_week.geojsonp',
    M1_URL_DAY = _BASE_URL + '1.0_day.geojsonp',
    M1_URL_HOUR = _BASE_URL + '1.0_hour.geojsonp';


var __register_parser = function (feed, callback) {
  var parsers = _REGISTERED_PARSERS[feed];

  if (typeof parsers === 'undefined' || parsers === null) {
    parsers = [];
  }

  parsers.push(callback);
  _REGISTERED_PARSERS[feed] = parsers;
};

var __notify_parser = function (parsers, data) {
  var i = 0, len = parsers.length;

  for (; i < len; i++) {
    parsers[i].call(null, data);
  }
};

var __findCss = function (params) {
  var _name = params.name || null,
      p = document.querySelector('head'),
      regex = new RegExp(_name + '\\.js$'),
      src = null,
      scripts = document.querySelectorAll('script[src]');

  if (p && _name) {
    // Got a head element. Cool.

    // Try to guess where the CSS is...
    for (var i = 0; (typeof url==='undefined') && i < scripts.length; i++) {
      src = scripts[i].src;
      if (src.match(regex)) {
        return src.replace(/\.js$/, '.css');
      }
    }

    return null;
  } else {
    // No head element. Sucky.
    // TODO
    try {
      console.log('EqList::No head element.');
    } catch (e) {/*Ignore*/}
  }
};

var __loadCss = function (params) {
  var _url = params.url,

      p = document.querySelector('head');


  if (p && _url !== null && !_LOADED_CSS.hasOwnProperty(_url)) {
    var style = document.createElement('link');
    style.setAttribute('rel', 'stylesheet');
    style.setAttribute('href', _url);
    p.appendChild(style);
    _LOADED_CSS[_url] = true;
  }
};


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
    var s = document.createElement('script');
        s.src = _feed;

    __register_parser(_feed, function (data) {
        _render(data);
        s.parentNode.removeChild(s);
    });
    document.querySelector('script').parentNode.appendChild(s);
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
  _render = function (data) {
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

    events.sort(_compareEvents || _this._compareEvents);

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
    return Util.formatDepth(e.geometry.coordinates[2]) + ' km deep';
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
        '<span class="subtitle">', _this.getEventSubtitle(e), '</span>',
        '<span class="aside">',
          _this.getEventAside(e),
        '</span>',
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
    __loadCss({url: _css || __findCss({name: 'earthquake-list-widget'})});
    _generateLoading();
    _fetchList();
  };


  _initialize(params||{});
  params = null;
  return _this;
};


/**
 * @PublicStaticMethod
 *
 * Determines whether or not to validate the URL of the returned data when
 * before notifying registered parsers. If validation is disabled, all currently
 * parsers are notified of returned data regardless of whether or not that
 * parser was interested in the returne data. If set to true, only parsers that
 * are registered with the URL of the returned data will be notified.
 *
 * Note: Each registered parser is unregistered after the first time it is
 * notified of returned data. Thus, setting this to false is potentially
 * dangerous if multiple EqList instances are put on a single page.
 *
 * If this method is never called, default behavior is to validate URLs.
 *
 * @param validateUrl {Boolean}
 *      True if URLs should be validated, false otherwise.
 */
EqList.setValidateUrl = function (validateUrl) {
  _VALIDATE_URL = validateUrl;
};

/**
 * @PublicStaticMethod
 *
 * Unregisters a registered listener.
 *
 * @param key {String}
 *      The identifier for the listener to unregister.
 */
EqList.unregisterListener = function (key) {
  _REGISTERED_PARSERS[key] = null;
  delete _REGISTERED_PARSERS[key];
};


/**
 * @GlobalMethod
 *
 * This method is the default JSONP method used on realtime data feeds.
 *
 * @param data {GeoJSON}
 *      The data returned by the JSONP request.
 */
window.eqfeed_callback = function (data) {
  var url = data.metadata.url,
      key = null;

  for (key in _REGISTERED_PARSERS) {
    if (url.indexOf(key) !== -1 || _VALIDATE_URL === false) {
      // Found it; notify.
      __notify_parser(_REGISTERED_PARSERS[key], data);

      // Unregister for this feed
      if (_VALIDATE_URL === true) {
        EqList.unregisterListener(key);
      }
    }
  }
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
