'use strict';

var config = require('./config');

var connect = {
  options: {
    hostname: '*'
  },
  dev: {
    options: {
      base: [
        config.build + '/' + config.src,
        config.example
      ],
      livereload: true,
      open: 'http://localhost:8030/example.html',
      port: 8030
    }
  },
  test: {
    options: {
      base: [
        config.build + '/' + config.src,
        config.build + '/' + config.test,
        'node_modules'
      ],
      open: 'http://localhost:8031/test.html',
      port: 8031
    }
  },
  dist: {
    options: {
      base: [
        config.dist,
        config.example
      ],
      keepalive: true,
      open: 'http://localhost:8032/example.html',
      port: 8032
    }
  },
};

module.exports = connect;
