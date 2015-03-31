/* global mocha */
require.config({
  baseUrl: '../'
  ,shim: {
    underscore: {
      exports: '_'
    }
    ,backbone: {
      deps: [
        'underscore'
        ,'jquery'
      ]
      ,exports: 'Backbone'
    }
    ,'mocha': {
      exports: 'mocha'
    }
  }
  ,paths: {
    jquery:           '../bower_components/jquery/dist/jquery'
    ,backbone:        '../bower_components/backbone/backbone'
    ,underscore:      '../bower_components/underscore/underscore'
    ,mustache:        '../bower_components/mustache/mustache'
    ,text:            '../bower_components/requirejs-text/text'
    ,chai:            '../../test/bower_components/chai/chai'
    ,mocha:           '../../test/bower_components/mocha/mocha'
  }
  ,packages: [{
    name: 'lateralus'
    ,location: 'scripts'
    ,main: 'lateralus'
  }]
});

mocha.setup({
  ui: 'bdd'
});

require([

  '../../test/spec/lateralus'
  ,'../../test/spec/lateralus.model'
  ,'../../test/spec/lateralus.component'
  ,'../../test/spec/lateralus.component.model'

], function (

) {
  'use strict';

  Array.prototype.slice.apply(arguments).forEach(function (fn) {
    fn();
  });

  if (window.mochaPhantomJS) {
    window.mochaPhantomJS.run();
  } else {
    mocha.run();
  }

});
