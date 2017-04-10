// jshint maxlen:120
'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  var pkg = grunt.file.readJSON('package.json');

  grunt.initConfig({
    pkg: pkg,
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
    exec: {
      test: 'npm test'
    }
  });

  grunt.registerTask('test', [
    'exec:test',
  ]);

  grunt.registerTask('build', [
    'clean',
    'yuidoc',
    'requirejs',
    'usebanner'
  ]);

  grunt.registerTask('default', [
    'test',
    'build'
  ]);
};
