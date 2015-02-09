'use strict';

var EqList = require('./EqList');

var PAGERList = function (container, feed, options) {
  var _this,
      _initialize,

      _autoload;

  options = options || {};
  _autoload = (options.load !== false);
  options.load = false;

  _this = EqList(container, feed, options);

  _initialize = function () {
    if (_autoload) {
      _this.load();
    }
  };

  _this._getClassName = function () {
    return 'PAGERList';
  };

  _this._includeEvent = function (e) {
    return (e.properties.types.indexOf('losspager') !== -1);
  };

  _this._getEventValue = function (e) {
    return '<span class="pager-alertlevel pager-alertlevel-' + e.properties.alert + '">' +
      e.properties.alert[0].toUpperCase() + e.properties.alert.slice(1) +
      '</span>';
  };

  _this._getEventTitle = function (e) {
    return e.properties.title;
  };

  // Not sure why the MMI works without this but it does.
  // _this._getEventAside = function (e) {
  //   var romanMMI = _this._decToRoman(e.properties.mmi);
  // };

  _initialize();
  return _this;
  };

module.exports = PAGERList;
