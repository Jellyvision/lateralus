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

      var mainTemplate = Mustache.render(
        this.src.read('main.js'), renderData);
      this.dest.write('main.js', mainTemplate);

      var modelTemplate = Mustache.render(
        this.src.read('model.js'), renderData);
      this.dest.write('model.js', modelTemplate);

      var viewTemplate = Mustache.render(
        this.src.read('view.js'), renderData);
      this.dest.write('view.js', viewTemplate);

      var templateTemplate = Mustache.render(
        this.src.read('template.mustache'), renderData);
      this.dest.write('template.mustache', templateTemplate);

      var sassTemplate = Mustache.render(
        this.src.read('styles/main.sass'), renderData);
      this.dest.write('styles/main.sass', sassTemplate);
    }
  }
});

module.exports = LateralusComponentGenerator;
