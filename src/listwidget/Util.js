'use strict';

var _ROMANS = [
  'I',
  'I',
  'II',
  'III',
  '`IV',
  'V',
  'VI',
  'VII',
  'VIII',
  'IX',
  'X'
];

var Util = {
  decToRoman: function (dec) {
    var intval = parseInt(dec||0, 10);

    if (intval < 0) {
      intval = 0;
    }

    if (intval > (_ROMANS.length - 1)) {
      intval = _ROMANS.length - 1;
    }

    return _ROMANS[intval];
  },

  formatDate: function (stamp) {
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
  },

  formatDepth: function (depth) {
    return depth.toFixed(1);
  },

  formatMagnitude: function (magnitude) {
    return magnitude.toFixed(1);
  }
};

module.exports = Util;