'use strict';

var yeoman = require('yeoman-generator');
var Mustache = require('mustache');
var _s = require('underscore.string');

var LateralusComponentGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.isLateralus = this.appname === 'lateralus';

    var options = this.options || {};

    this.componentName = options.componentName || this.arguments[0];
  },

  writing: {
    app: function () {
      if (!this.componentName) {
        return;
      }

      var renderData = {
        componentName: this.componentName
        ,componentClassName: _s.classify(this.componentName)
      };

      var destRoot = this.isLateralus ?
          'scripts/components/' :
          'app/scripts/components/';
      this.destinationRoot(destRoot + this.componentName);

      [
        'main.js'
        ,'model.js'
        ,'view.js'
        ,'template.mustache'
        ,'styles/main.sass'
      ].forEach(function (fileName) {
        var renderedTemplate = Mustache.render(
          this.src.read(fileName), renderData);
        this.dest.write(fileName, renderedTemplate);
      }.bind(this));
    }
  }
});

module.exports = LateralusComponentGenerator;
