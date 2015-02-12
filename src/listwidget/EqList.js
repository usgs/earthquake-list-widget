'use strict';

var _BASE_URL = 'http://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/',
    _LOADED_CSS = {},
    _REGISTERED_PARSERS = {},
    _ROMANS = null,
    _VALIDATE_URL = true;

_ROMANS = ['I', 'I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX',
        'X'];


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


  _createError = function (message) {
    var p = document.createElement('p');

    p.className = 'error';
    p.innerHTML = message;

    return p;
  };

  _emptyContainer = function () {
    _container.innerHTML = '';
  };

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
  _filterEvents = function (events) {
    var filtered = events.slice(0),
        i = events.length - 1,
        includeEvent;

    includeEvent = _includeEvent || _this._includeEvent;

    for (; i >= 0; i--) {
      if (!includeEvent(events[i])) {
        filtered.splice(i, 1);
      }
    }

    return filtered;
  };

  _generateLoading = function () {
    var loading = _container.appendChild(document.createElement('p'));
    loading.className = 'eqlist-loading';

    loading.innerHTML =
      'Fetching list of earthquakes. If this takes longer ' +
      'than is reasonable, you can <a href="' + _feed + '">view the ' +
      'source data</a>.';
  };

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
      markup.push(_this._getEventMarkup(events[i]));
    }

    // Append to the DOM
    _emptyContainer();
    list = document.createElement('ol');
    list.className = 'eqlist ' + _this._getClassName().toLowerCase();
    list.innerHTML = markup.join('');
    _container.appendChild(list);
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
  _this._compareEvents = function (e1, e2) {
    return (e2.properties.time - e1.properties.time);
  };

  _this._decToRoman = function (dec) {
    var intval = parseInt(dec||0, 10);

    if (intval < 0) {
      intval = 0;
    }

    if (intval > (_ROMANS.length - 1)) {
      intval = _ROMANS.length - 1;
    }

    return _ROMANS[intval];
  };

  _this._formatDate = function (stamp) {
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

  _this._formatDepth = function (depth) {
    return depth.toFixed(1);
  };

  _this._formatMagnitude = function (magnitude) {
    return magnitude.toFixed(1);
  };

  _this._getClassName = function () {
    return 'EqList';
  };

  _this._getEventAside = function (e) {
    return _this._formatDepth(e.geometry.coordinates[2]) + ' km deep';
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
  _this._getEventMarkup = function (e) {
    var p = e.properties;

    return [
      '<li class="eqitem">',
        '<span class="value">', _this._getEventValue(e), '</span>',
        '<a class="title" href="', p.url, '">',
          _this._getEventTitle(e),
        '</a>',
        '<span class="subtitle">', _this._getEventSubtitle(e), '</span>',
        '<span class="aside">',
          _this._getEventAside(e),
        '</span>',
      '</li>'
    ].join('');
  };

  _this._getEventSubtitle = function (e) {
    return _this._formatDate(e.properties.time);
  };

  _this._getEventTitle = function (e) {
    return e.properties.place;
  };

  _this._getEventValue = function (e) {
    return _this._formatMagnitude(e.properties.mag);
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
  _this._includeEvent = function (/*event*/) {
    return true;
  };


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
 *
 */
EqList.setValidateUrl = function (validateUrl) {
  _VALIDATE_URL = validateUrl;
};

EqList.unregisterListener = function (key) {
  _REGISTERED_PARSERS[key] = null;
  delete _REGISTERED_PARSERS[key];
};


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
