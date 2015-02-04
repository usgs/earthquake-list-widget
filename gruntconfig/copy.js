'use strict';

var config = require('./config');

var copy = {
  test: {
    expand: true,
    cwd: config.test,
    src: '*.html',
    dest: config.build + '/test'
  },
  example: {
    expand: true,
    cwd: config.example,
    src: '*.html',
    dest: config.build + '/example'
  },
  mocha: {
    expand: true,
    cwd: 'node_modules',
    src: ['mocha/mocha.js', 'mocha/mocha.css'],
    dest: config.build + '/' + config.test
  }
};

module.exports = copy;