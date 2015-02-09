'use strict';

var EqList = require('./EqList');

var DYFIList = function (container, feed, options) {
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
    return 'DYFIList';
  };

  _this._includeEvent = function (e) {
    return (e.properties.types.indexOf('dyfi') !== -1);
  };


  _this._getEventValue = function (e) {
    var romanCdi = _this._decToRoman(e.properties.cdi);

    return '<span class="roman mmi' + romanCdi + '">' + romanCdi + '</span>';
  };

  _this._getEventTitle = function (e) {
    return e.properties.title;
  };

  _this._getEventAside = function (e) {
    return (e.properties.felt||0) + ' responses';
  };

  _initialize();
  return _this;
};

module.exports = DYFIList;
