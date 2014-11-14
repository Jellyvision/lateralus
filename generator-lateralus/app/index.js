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
      message: 'What is the name of this Lateralus app?  Apps should be named like:',
      default: 'my-app'
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

      var process = function (file) {
        return Mustache.render(file, renderData);
      };

      this.directory('./', './', process);

      this.sourceRoot(path.join(__dirname, '_templates'));
      this.copy('app/scripts/app.js',
          'app/scripts/' + this.appName + '.js', process);

      this.installDependencies();
    }
  }
});

module.exports = LateralusGenerator;
