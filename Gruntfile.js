'use strict';

module.exports = function (grunt) {

  var gruntConfig = require('./gruntconfig');

  gruntConfig.tasks.forEach(grunt.loadNpmTasks);
  grunt.initConfig(gruntConfig);

  grunt.registerTask('build', [
    'clean',
    'browserify',
    'compass',
    'copy',
    'jshint'
  ]);

  grunt.registerTask('default', [
    'build',
    'connect:dev',
    'connect:test',
    'mocha_phantomjs',
    'watch'
  ]);

  grunt.registerTask('dist', [
    'build',
    'cssmin',
    'uglify',
    'connect:dist'
  ]);
};
