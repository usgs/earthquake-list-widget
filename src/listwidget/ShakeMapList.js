'use strict';

var EqList = require('./EqList');

var ShakeMapList = function (container, feed, options) {
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
    return 'ShakeMapList';
  };

  _this._includeEvent = function (e) {
    return (e.properties.types.indexOf('shakemap') !== -1);
  };

  _this._getEventValue = function (e) {
    var romanMmi = this._decToRoman(e.properties.mmi);

    return '<span class="roman mmi' + romanMmi + '">' + romanMmi + '</span>';
  };

  _this._getEventTitle = function (e) {
    return e.properties.title;
  };

  _this._getEventAside = function (e) {
    return e.id;
  };

  _initialize();
  return _this;
};

module.exports = ShakeMapList;
