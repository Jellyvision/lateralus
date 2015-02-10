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

      var prefix = this.config.get('namespaceFiles') ?
        this.componentName + '-' :
        '';

      var renderData = {
        componentName: this.componentName
        ,componentClassName: _s.classify(this.componentName)
        ,prefix: prefix
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

        var targetFileName;
        if (fileName === 'main.js') {
          targetFileName = this.componentName + '.js';
        } else if (fileName === 'styles/main.sass') {
          targetFileName =
            '../../../styles/components/' + this.componentName + '.sass';
        } else {
          targetFileName = prefix + fileName;
        }

        this.dest.write(targetFileName, renderedTemplate);
      }.bind(this));
    }
  }
});

module.exports = LateralusComponentGenerator;
