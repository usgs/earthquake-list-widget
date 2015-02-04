'use strict';

var config = require('./config');

var uglify = {
  build: {
    files: {
    }
  }
};

// uglify.build.files[config.dist + '/index.js'] =
//     config.build + '/example/index.js';
uglify.build.files[config.dist + '/*.js'] =
    config.build + '/src/*.js';

module.exports = uglify;