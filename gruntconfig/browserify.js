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
    dest: config.build + '/' + config.src + '/earthquake-list-widget.js',
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
  },
  example: {
    src: config.example + '/example.js',
    dest: config.build + '/' + config.example + '/example.js',
    options: {
      external: ['earthquake-list-widget']
    }
  }
};

module.exports = browserify;