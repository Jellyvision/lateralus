'use strict';

var path = require('path');
var yeoman = require('yeoman-generator');
var Mustache = require('mustache');
var _s = require('underscore.string');

var LateralusGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    var done = this.async();

    this.prompt({
      type: 'input',
      name: 'appName',
      // jshint maxlen:120
      message: 'What is the name of this Lateralus app?',
      default: process.cwd().split('/').pop()
    }, function (answers) {
      this.appName = answers.appName;
      done();
    }.bind(this));
  },

  writing: {
    app: function () {
      var appCtor = _s.classify(this.appName);

      var renderData = {
        appName: this.appName
        ,appCtor: appCtor
        ,appInstance: appCtor[0].toLowerCase() + appCtor.slice(1)
      };

      var templateProcessor = function (file) {
        return Mustache.render(file, renderData);
      };

      var originalCwd = process.cwd();

      this.directory('./', './', templateProcessor);

      this.sourceRoot(path.join(__dirname, '_templates'));
      this.copy('app/scripts/app.js',
          'app/scripts/' + this.appName + '.js', templateProcessor);

      this.composeWith('lateralus:component', {
        options: {
          componentName: 'container'
        }
      }).on('end', function () {
        process.chdir(originalCwd);
        this.installDependencies();
      }.bind(this));

    }
  }
});

module.exports = LateralusGenerator;
