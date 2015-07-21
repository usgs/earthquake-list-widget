'use strict';

var EqList = require('listwidget/EqList');

var PolygonList = function (params) {
  var _this,
      _initialize,

      _polygons;


  _this = EqList(params);

  _initialize = function (params) {
    params = params || {};
    _polygons = params.polygons;
  };


  _this.contains = function (points, x, y) {
    // Taken from: https://github.com/substack/point-in-polygon
    // Which is originally based on: http://www.ecse.rpi.edu/Homepages/wrf/Research/Short_Notes/pnpoly.html
    var i,
        inside,
        intersect,
        j,
        xi,
        xj,
        yi,
        yj;

    inside = false;

    for (i = 0, j = points.length - 1; i < points.length; j = i++) {
        xi = points[i][0];
        yi = points[i][1];

        xj = points[j][0];
        yj = points[j][1];

        intersect = ((yi >= y) !== (yj > y)) &&
            (x <= (xj - xi) * (y - yi) / (yj - yi) + xi);

        if (intersect) {
          inside = !inside;
        }
    }

    return inside;
  };


  _this.includeEvent = function (e) {
    var i,
        included,
        latitude,
        len,
        longitude;

    included = true;

    if (_polygons) {
      included = false;

      longitude = e.geometry.coordinates[0];
      latitude = e.geometry.coordinates[1];

      for (i = 0, len = _polygons.length; !included && i < len; i++) {
        included = included || _this.contains(_polygons[i],
            longitude, latitude);
      }
    }

    return included;
  };


  _initialize(params);
  params = null;
  return _this;
};

module.exports = PolygonList;
