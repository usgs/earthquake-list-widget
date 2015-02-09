'use strict';

var config = require('./connect').test.options;

var mocha_phantomjs = {
  all: {
    options: {
      verbose: true,
      urls: [
        'http://localhost:' + config.port + '/test.html'
      ]
    }
  }
};

module.exports = mocha_phantomjs;