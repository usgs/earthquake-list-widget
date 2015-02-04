'use strict';

var config = require('./config');

var uglify = {
  options: {
  },
  dist: {
    src: config.build + '/' + config.src + '/hazdev-list-widget.js',
    dest: config.dist + '/hazdev-listw-idget.js'
  }
};

module.exports = uglify;