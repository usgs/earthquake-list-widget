'use strict';

var EqList = require('listwidget/EqList'),
    Util = require('listwidget/Util');


var ShakeMapList = function (params) {
  var _this;


  _this = EqList(params);


  /**
   * @APIMethod
   *
   * @Overrides EqList#getClassName
   */
   _this.getClassName = function () {
    return 'eqlist shakemaplist';
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#getEventAside
   */
   _this.getEventAside = function (e) {
    return e.id;
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#getEventTitle
   */
  _this.getEventTitle = function (e) {
    var status = e.properties.status,
        title = e.properties.title;

    if (status === 'deleted') {
      title = '(Deleted) ' + title;
    }

    return title;
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#getEventValue
   */
   _this.getEventValue = function (e) {
    var romanMmi = Util.decToRoman(e.properties.mmi);

    return '<span class="roman mmi' + romanMmi + '">' + romanMmi + '</span>';
  };

  /**
   * @APIMethod
   *
   * @Overrides EqList#includeEvent
   */
   _this.includeEvent = function (e) {
    return (e.properties.types.indexOf('shakemap') !== -1);
  };


  params = null;
  return _this;
};

module.exports = ShakeMapList;
