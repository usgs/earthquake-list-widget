'use strict';

var EqList = require('listwidget/EqList'),
    Util = require('listwidget/Util');


var PAGERList = function (params) {
  var _this;


  _this = EqList(params);


  /**
   * @APIMethod
   *
   * @Overrides EqList#getClassName
   */
   _this.getClassName = function () {
    return 'eqlist pagerlist';
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#getEventAside
   */
   _this.getEventAside = function (e) {
    var romanMmi = Util.decToRoman(e.properties.mmi);

    return '<span class="roman mmi' + romanMmi + '">' + romanMmi + '</span>';
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#getEventTitle
   */
   _this.getEventTitle = function (e) {
    return e.properties.title;
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#getEventValue
   */
   _this.getEventValue = function (e) {
    return '<span class="pager-alertlevel pager-alertlevel-' +
        e.properties.alert + '">' + e.properties.alert[0].toUpperCase() +
        e.properties.alert.slice(1) + '</span>';
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#includeEvent
   */
   _this.includeEvent = function (e) {
    return (e.properties.types.indexOf('losspager') !== -1);
  };


  params = null;
  return _this;
};

module.exports = PAGERList;
