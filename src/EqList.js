/* global define, RegExp */
define([
], function (
) {
  'use strict';

  var BASE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/';
  var SIG_URL_MONTH = BASE_URL + 'significant_month.geojsonp';
  var SIG_URL_WEEK  = BASE_URL + 'significant_week.geojsonp';
  var SIG_URL_DAY   = BASE_URL + 'significant_day.geojsonp';
  var SIG_URL_HOUR   = BASE_URL + 'significant_hour.geojsonp';

  var ALL_URL_MONTH = BASE_URL + 'all_month.geojsonp';
  var ALL_URL_WEEK  = BASE_URL + 'all_week.geojsonp';
  var ALL_URL_DAY   = BASE_URL + 'all_day.geojsonp';
  var ALL_URL_HOUR   = BASE_URL + 'all_hour.geojsonp';

  var M45_URL_MONTH = BASE_URL + '4.5_month.geojsonp';
  var M45_URL_WEEK = BASE_URL + '4.5_week.geojsonp';
  var M45_URL_DAY = BASE_URL + '4.5_day.geojsonp';
  var M45_URL_HOUR = BASE_URL + '4.5_hour.geojsonp';

  var M25_URL_MONTH = BASE_URL + '2.5_month.geojsonp';
  var M25_URL_WEEK = BASE_URL + '2.5_week.geojsonp';
  var M25_URL_DAY = BASE_URL + '2.5_day.geojsonp';
  var M25_URL_HOUR = BASE_URL + '2.5_hour.geojsonp';

  var M1_URL_MONTH = BASE_URL + '1.0_month.geojsonp';
  var M1_URL_WEEK = BASE_URL + '1.0_week.geojsonp';
  var M1_URL_DAY = BASE_URL + '1.0_day.geojsonp';
  var M1_URL_HOUR = BASE_URL + '1.0_hour.geojsonp';

  var ROMANS = ['I', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
      'X'];

  var REGISTERED_PARSERS = {};
  var LOADED_CSS = {};
  var VALIDATE_URL = true;

  var EqList = function (container, feed, options) {
    this._container = container || document.createElement('div');
    this._feed = feed || SIG_URL_MONTH;

    this._list = this._container.appendChild(document.createElement('ol'));
    this._list.className = 'eqlist ' + this._getClassName().toLowerCase();

    if (options && options.hasOwnProperty('includeEvent') &&
        typeof options.includeEvent === 'function') {
      this._includeEvent = options.includeEvent.bind(this);
    }
    if (options && options.hasOwnProperty('compareEvents') &&
        typeof options.compareEvents === 'function') {
      this._compareEvents = options.compareEvents.bind(this);
    }
    if (options && options.hasOwnProperty('css')) {
      this._loadCss(options.css);
    } else {
      this._loadCss(this._findCss(this._getClassName()));
    }

    this._generateLoading();
    this._fetchList();
  };

  EqList.prototype._getClassName = function () {
    return 'EqList';
  };

  EqList.prototype._findCss = function (key) {
    var p = document.querySelector('head'),
        regex = new RegExp(key + '\\.js$'),
        src = null,
        scripts = document.querySelectorAll('script[src]');

    if (p) {
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

  EqList.prototype._loadCss = function (url) {
    var p = document.querySelector('head');

    if (p && url !== null && !LOADED_CSS.hasOwnProperty(url)) {
      var style = document.createElement('link');
      style.setAttribute('rel', 'stylesheet');
      style.setAttribute('href', url);
      p.appendChild(style);
      LOADED_CSS[url] = true;
    }
  };

  EqList.prototype._generateLoading = function () {
    var loading = this._container.appendChild(document.createElement('p'));
    loading.className = 'eqlist-loading';

    loading.innerHTML = [
      'Fetching list of earthquakes. If this takes longer ',
      'than is reasonable, you can <a href="', this._feed, '">view the ',
      'source data</a>.'
    ].join('');
  };

  EqList.prototype._fetchList = function () {
    var s = document.createElement('script');
    s.src = this._feed;

    __register_parser(this._feed, (function (eqlist) {
      return function (data) {
        eqlist._render(data);
        s.parentNode.removeChild(s);
      };
    })(this));

    document.querySelector('script').parentNode.appendChild(s);
  };

  EqList.prototype._emptyContainer = function () {
    this._container.innerHTML = '';
  };

  EqList.prototype._createError = function (message) {
    var p = document.createElement('p');

    p.className = 'error';
    p.innerHTML = message;

    return p;
  };

  EqList.prototype._render = function (data) {
    var events = this._filterEvents(data.features),
        i = 0,
        len = events.length,
        markup = [];

    if (len === 0) {
      this._emptyContainer();
      this._container.appendChild(this._createError('No Events Found.'));
      return;
    }

    events.sort(this._compareEvents);

    for (i = 0; i < len; i++) {
      markup.push(this._getEventMarkup(events[i]));
    }

    // Append to the DOM
    this._emptyContainer();
    this._list.innerHTML = markup.join('');
    this._container.appendChild(this._list);
  };

  /**
   * Filters the given array of events based on the result of the _includeEvent
   * method.
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
  EqList.prototype._filterEvents = function (events) {
    var filtered = events.slice(0),
        i = events.length - 1;

    for (; i >= 0; i--) {
      if (!this._includeEvent(events[i])) {
        filtered.splice(i, 1);
      }
    }

    return filtered;
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
  EqList.prototype._includeEvent = function (/*event*/) {
    return true;
  };

  /**
   * Compares the given events for sorting purposes. This implementation sorts
   * by time, newest first.
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
  EqList.prototype._compareEvents = function (e1, e2) {
    return (e2.properties.time - e1.properties.time);
  };

  /**
   * Gets the markup for one event.
   *
   * @param e {Object}
   *      A single event feature from the raw GeoJSON response.
   *
   * @return {String}
   *      A string representing the markup for a single event feature.
   */
  EqList.prototype._getEventMarkup = function (e) {
    var p = e.properties;

    return [
      '<li class="eqitem">',
        '<span class="value">', this._getEventValue(e), '</span>',
        '<a class="title" href="', p.url, '">',
          this._getEventTitle(e),
        '</a>',
        '<span class="subtitle">', this._getEventSubtitle(e), '</span>',
        '<span class="aside">',
          this._getEventAside(e),
        '</span>',
      '</li>'
    ].join('');
  };

  EqList.prototype._getEventValue = function (e) {
    return this._formatMagnitude(e.properties.mag);
  };

  EqList.prototype._getEventTitle = function (e) {
    return e.properties.place;
  };

  EqList.prototype._getEventSubtitle = function (e) {
    return this._formatDate(e.properties.time);
  };

  EqList.prototype._getEventAside = function (e) {
    return this._formatDepth(e.geometry.coordinates[2]) + ' km deep';
  };


  EqList.prototype._formatMagnitude = function (magnitude) {
    return magnitude.toFixed(1);
  };

  EqList.prototype._formatDepth = function (depth) {
    return depth.toFixed(1);
  };

  EqList.prototype._formatDate = function (stamp) {
    var t = new Date(stamp),
        y = t.getUTCFullYear(),
        m = t.getUTCMonth()+1,
        d = t.getUTCDate(),
        h = t.getUTCHours(),
        i = t.getUTCMinutes(),
        s = t.getUTCSeconds();

    if (m < 10) { m = '0' + m; }
    if (d < 10) { d = '0' + d; }
    if (h < 10) { h = '0' + h; }
    if (i < 10) { i = '0' + i; }
    if (s < 10) { s = '0' + s; }

    return ''+y+'-'+m+'-'+d+' '+h+':'+i+':'+s+' UTC';
  };

  EqList.prototype._decToRoman = function (dec) {
    var intval = parseInt(dec||0, 10);

    if (intval < 0) {
      intval = 0;
    }

    if (intval > (ROMANS.length - 1)) {
      intval = ROMANS.length - 1;
    }

    return ROMANS[intval];
  };

  /**
   *
   */
  EqList.setValidateUrl = function (validateUrl) {
    VALIDATE_URL = validateUrl;
  };

  EqList.unregisterListener = function (key) {
    REGISTERED_PARSERS[key] = null;
    delete REGISTERED_PARSERS[key];
  };


  window.eqfeed_callback = function (data) {
    var url = data.metadata.url,
        key = null;

    for (key in REGISTERED_PARSERS) {
      if (url.indexOf(key) !== -1 || VALIDATE_URL === false) {
        // Found it; notify.
        __notify_parser(REGISTERED_PARSERS[key], data);

        // Unregister for this feed
        if (VALIDATE_URL === true) {
          EqList.unregisterListener(key);
        }
      }
    }
  };


  var __register_parser = function (feed, callback) {
    var parsers = REGISTERED_PARSERS[feed];

    if (typeof parsers === 'undefined' || parsers === null) {
      parsers = [];
    }

    parsers.push(callback);
    REGISTERED_PARSERS[feed] = parsers;
  };

  var __notify_parser = function (parsers, data) {
    var i = 0, len = parsers.length;

    for (; i < len; i++) {
      parsers[i].call(null, data);
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
  EqList.M45_URL_DAY = M45_URL_HOUR;

  EqList.M25_URL_MONTH = M25_URL_MONTH;
  EqList.M25_URL_WEEK = M25_URL_WEEK;
  EqList.M25_URL_DAY = M25_URL_DAY;
  EqList.M25_URL_DAY = M25_URL_HOUR;

  EqList.M1_URL_MONTH = M1_URL_MONTH;
  EqList.M1_URL_WEEK = M1_URL_WEEK;
  EqList.M1_URL_DAY = M1_URL_DAY;
  EqList.M1_URL_DAY = M1_URL_HOUR;

  return EqList;
});
