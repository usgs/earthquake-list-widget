/* global define */
define([
  './EqList'
], function (
  EqList
) {
  'use strict';

  var ShakeMapList = function () {
    EqList.apply(this, arguments);
  };
  ShakeMapList.prototype = Object.create(EqList.prototype);

  ShakeMapList.prototype._getClassName = function () {
    return 'ShakeMapList';
  };

  ShakeMapList.prototype._includeEvent = function (e) {
    return (e.properties.types.indexOf('shakemap') !== -1);
  };


  ShakeMapList.prototype._getEventValue = function (e) {
    var romanMmi = this._decToRoman(e.properties.mmi);

    return '<span class="roman mmi' + romanMmi + '">' + romanMmi + '</span>';
  };

  ShakeMapList.prototype._getEventTitle = function (e) {
    return e.properties.title;
  };

  ShakeMapList.prototype._getEventAside = function (e) {
    return e.id;
  };

  return ShakeMapList;
});