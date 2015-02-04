'use strict';

var config = require('./config');

var EXPORTS = [
  'listwidget/DYFIList',
  'listwidget/EqList',
  'listwidget/PAGERList',
  'listwidget/ShakeMapList'
];

var browserify = {
  options: {
    browserifyOptions: {
      debug: true,
      paths: [
        process.cwd() + '/' + config.src
      ]
    }
  },
  source: {
    src: [],
    dest: config.build + '/' + config.src + '/DYFIList.js',
    options: {
      alias: EXPORTS.map (function ( path) {
        return './' + config.src + '/' + path + '.js:' + path
      })
    }
  },
  test: {
    src: config.test + '/test.js',
    dest: config.build + '/' + config.test + '/test.js',
    options: {
      exclude: EXPORTS
    }
  }
};

module.exports = browserify;