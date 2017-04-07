/* global mocha */
require.config({
  baseUrl: './'
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
    ,underscore:      '../bower_components/lodash/lodash'
    ,mustache:        '../bower_components/mustache/mustache'
    ,text:            '../bower_components/requirejs-text/text'
    ,chai:            '../bower_components/chai/chai'
    ,mocha:           '../bower_components/mocha/mocha'
  }
  ,packages: [{
    name: 'lateralus'
    ,location: '../scripts'
    ,main: 'lateralus'
  }]
});

mocha.setup({
  ui: 'bdd'
});

require([

  'spec/lateralus'
  ,'spec/lateralus.model'
  ,'spec/lateralus.component'
  ,'spec/lateralus.component.model'
  ,'spec/lateralus.component.collection'

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
