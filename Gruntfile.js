// jshint maxlen:120
'use strict';

var LIVERELOAD_PORT = 35730;
var SERVER_PORT = 9010;
var lrSnippet = require('connect-livereload')({port: LIVERELOAD_PORT});
var mountFolder = function (connect, dir) {
  return connect.static(require('path').resolve(dir));
};

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
    watch: {
      options: {
        nospawn: true,
        livereload: LIVERELOAD_PORT
      },
      yuidoc: {
        files: ['scripts/*.js'],
        tasks: ['clean', 'yuidoc']
      },
      livereload: {
        files: [
          'scripts/*.js',
          'test/spec/*.js'
        ]
      }
    },
    clean: {
      dist: ['dist']
    },
    yuidoc: {
      compile: {
        name: 'Lateralus',
        version: '<%= pkg.version %>',
        logo: 'http://cdn.jellyvision.com/wp-content/themes/jellyvision/img/header-logo.png',
        options: {
          paths: ['scripts'],
          outdir: 'dist/doc'
        }
      }
    },
    bump: {
      options: {
        files: ['package.json', 'bower.json', 'generator-lateralus/package.json'],
        commit: false,
        createTag: false,
        tagName: '%VERSION%',
        tagMessage: 'Version %VERSION%',
        push: false
      }
    },
    requirejs: {
      options: {
        include: 'lateralus',
        packages: [{
          name: 'lateralus',
          location: 'scripts',
          main: 'lateralus'
        }],
        paths: {
          'jquery': 'empty:',
          'underscore': 'empty:',
          'backbone': 'empty:',
          'mustache': 'empty:'
        },
      },
      unminified: {
        options: {
          optimize: 'none',
          out: 'dist/lateralus.js'
        }
      },
      minified: {
        options: {
          optimize: 'uglify',
          out: 'dist/lateralus.min.js'
        }
      }
    },
    usebanner: {
      dist: {
        options: {
          banner: '/* Lateralus v.' + pkg.version + ' | https://github.com/Jellyvision/lateralus */'
        },
        files: {
          src: ['dist/lateralus.js', 'dist/lateralus.min.js']
        }
      }
    },
    open: {
      debug: {
        path: 'http://localhost:' + SERVER_PORT + '/test'
      }
    },
    connect: {
      options: {
        port: SERVER_PORT,
        // change this to '0.0.0.0' to access the server from outside
        hostname: 'localhost'
      },
      livereload: {
        options: {
          middleware: function (connect) {
            return [
              lrSnippet,
              mountFolder(connect, './')
            ];
          }
        }
      }
    },
    exec: {
      test: 'npm test'
    }
  });

  grunt.registerTask('test', [
    'exec:test',
  ]);

  grunt.registerTask('debug', [
    'open:debug',
    'connect:livereload',
    'watch:livereload'
  ]);

  grunt.registerTask('buildForPublish', [
    'clean',
    'yuidoc',
    'requirejs',
    'usebanner'
  ]);

  grunt.registerTask('default', [
    'test',
    'buildForPublish'
  ]);
};
