'use strict';

var config = require('./config');

var cssmin = {
  example: {
    expand: true,
    cwd: config.build + '/example',
    src: '**/*.css',
    dest: config.dist
  },
  build: {
    expand: true,
    cwd: config.build + '/src',
    src: '**/*.css',
    dest: config.dist
  }
};

module.exports = cssmin;