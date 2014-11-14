// jshint maxlen:100
'use strict';

module.exports = function (grunt) {
  // load all grunt tasks
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    watch: {
      yuidoc: {
        files: ['scripts/*.js'],
        tasks: ['clean', 'yuidoc']
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
    }
  });

  grunt.registerTask('default', ['clean', 'yuidoc']);
};
