'use strict';

var config = require('./config');

var sass = {
  dev: {
    src: config.src + '/earthquake-list-widget.scss',
    dest: config.build  + '/src/earthquake-list-widget.css'
  }
};

module.exports = sass;