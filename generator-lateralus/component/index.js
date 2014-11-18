'use strict';

var yeoman = require('yeoman-generator');
var Mustache = require('mustache');
var _s = require('underscore.string');

var LateralusGenerator = yeoman.generators.Base.extend({
  initializing: function () {
    this.pkg = require('../package.json');
    this.isLateralus = this.appname === 'lateralus';

    this.componentName = this.arguments[0];
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

      var mainTemplate = Mustache.render(this.src.read('main.js'), renderData);
      this.dest.write('main.js', mainTemplate);

      var viewTemplate = Mustache.render(this.src.read('view.js'), renderData);
      this.dest.write('view.js', viewTemplate);

      this.src.copy('template.mustache', 'template.mustache');
      this.src.copy('styles/main.sass', 'styles/main.sass');
    }
  }
});

module.exports = LateralusGenerator;
