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
    'htmlmin',
    'uglify',
    'connect:dist'
  ]);
};


// var mountFolder = function (connect, dir) {
//   return connect.static(require('path').resolve(dir));
// };

// module.exports = function (grunt) {

//   // Load grunt tasks
//   require('matchdep').filterDev('grunt-*').forEach(grunt.loadNpmTasks);

//   // App configuration, used throughout
//   var appConfig = {
//     src: 'src',
//     test: 'test',
//   };

//   // TODO :: Read this from .bowerrc

//   grunt.initConfig({
//     app: appConfig,
//     watch: {
//       scripts: {
//         files: ['<%= app.src %>/**/*.js'],
//         tasks: ['concurrent:scripts']
//       },
//       tests: {
//         files: ['<%= app.test %>/*.html', '<%= app.test %>/**/*.js'],
//         tasks: ['concurrent:tests']
//       },
//       gruntfile: {
//         files: ['Gruntfile.js'],
//         tasks: ['jshint:gruntfile']
//       }
//     },
//     concurrent: {
//       scripts: ['jshint:scripts', 'mocha_phantomjs'],
//       tests: ['jshint:tests', 'mocha_phantomjs']
//     },
//     connect: {
//       options: {
//         hostname: 'localhost'
//       },
//       dev: {
//         options: {
//           base: '<%= app.test %>',
//           port: 8000,
//           middleware: function (connect, options) {
//             return [
//               mountFolder(connect, '.tmp'),
//               mountFolder(connect, 'node_modules'),
//               mountFolder(connect, options.base),
//               mountFolder(connect, appConfig.src)
//             ];
//           }
//         }
//       }
//     },
//     jshint: {
//       options: {
//         jshintrc: '.jshintrc'
//       },
//       gruntfile: ['Gruntfile.js'],
//       scripts: ['<%= app.src %>/**/*.js'],
//       tests: ['<%= app.test %>/**/*.js']
//     },
//     mocha_phantomjs: {
//       all: {
//         options: {
//           urls: [
//             'http://localhost:<%= connect.dev.options.port %>/index.html'
//           ]
//         }
//       }
//     }
//   });

//   grunt.event.on('watch', function (action, filepath) {
//     // Only lint the file that actually changed
//     grunt.config(['jshint', 'scripts'], filepath);
//   });

//   grunt.registerTask('test', [
//     'connect:dev',
//     'mocha_phantomjs'
//   ]);

//   grunt.registerTask('default', [
//     'connect:dev',
//     'mocha_phantomjs',
//     'watch'
//   ]);
// };
