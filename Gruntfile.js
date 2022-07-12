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
    /* jshint camelcase:false */
    mocha_require_phantom: {
      options: {
        base: '.',
        main: 'test/main',
        requireLib: 'bower_components/requirejs/require.js'
      },
      debug: {
        options: {
          keepAlive: true
        }
      },
      auto: {
        options: {
          keepAlive: false
        }
      }
    },
  });

  grunt.registerTask('test', [
    'mocha_require_phantom:auto',
  ]);

  grunt.registerTask('debug', [
    'open:debug',
    'connect:livereload',
    'watch:livereload'
  ]);

  grunt.registerTask('default', [
    'test',
    'clean',
    'yuidoc',
    'requirejs',
    'usebanner'
  ]);
};
