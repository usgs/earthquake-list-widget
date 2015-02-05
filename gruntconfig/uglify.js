'use strict';

var config = require('./config');

var uglify = {
  options: {
  },
  dist: {
    src: config.build + '/' + config.src + '/earthquake-list-widget.js',
    dest: config.dist + '/earthquake-list-widget.js'
  }
};

module.exports = uglify;