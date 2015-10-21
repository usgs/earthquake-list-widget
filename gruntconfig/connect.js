'use strict';

var config = require('./config');

var addMiddleware = function (connect, options, middlewares) {
  var bases,
      gateway;

  gateway = require('gateway');

  // push in reverse order
  bases = options.base.slice(0);
  bases.reverse();
  bases.forEach(function (base) {
    middlewares.unshift(gateway(base, {
      '.php': 'php-cgi',
      'env': {
        'PHPRC': 'node_modules/hazdev-template/dist/conf/php.ini'
      }
    }));
  });

  middlewares.unshift(
    require('compression')({
      filter: function (req, res) {
        var type = res.getHeader('Content-Type');
        return (type+'').match(/(css|javascript)/);
      }
    }),
    require('grunt-connect-proxy/lib/utils').proxyRequest
  );

  return middlewares;
};


var connect = {
  options: {
    hostname: '*'
  },

  proxies: [
    {
      context: '/theme/',
      host: 'localhost',
      port: 8033,
      rewrite: {
        '^/theme': ''
      }
    }
  ],

  dev: {
    options: {
      base: [
        config.example,
        config.build + '/' + config.src
      ],
      livereload: true,
      middleware: addMiddleware,
      open: 'http://localhost:8030/example.php',
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

  template: {
    options: {
      base: ['node_modules/hazdev-template/dist/htdocs'],
      port: 8033
    }
  }
};

module.exports = connect;
