'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  grunt.registerTask('build', [
    'clean',
    'browserify',
    'sass',
    'copy',
    'jshint'
  ]);

  grunt.registerTask('test', [
    'build',
    'connect:test',
    'mocha_phantomjs'
  ]);

  grunt.registerTask('default', [
    'test',
    'configureProxies:dev',
    'connect:dev',
    'connect:template',
    'watch'
  ]);

  grunt.registerTask('dist', [
    'build',
    'cssmin',
    'uglify',
    'connect:dist'
  ]);
};
