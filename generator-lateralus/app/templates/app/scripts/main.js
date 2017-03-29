/*global require*/
'use strict';

require.config({
  baseUrl: '/'
  ,map: {
    '*': {
      underscore: 'lodash'
    }
  }
  ,shim: {
    bootstrap: {
      deps: ['jquery']
      ,exports: 'jquery'
    }
  }
  ,paths: {
    text: 'bower_components/requirejs-text/text'
    ,jquery: 'bower_components/jquery/dist/jquery'
    ,backbone: 'bower_components/backbone/backbone'
    ,lodash: 'bower_components/lodash/lodash'
    ,mustache: 'bower_components/mustache/mustache'
  }
  ,packages: [{
    name: 'lateralus'
    ,location: 'bower_components/lateralus/scripts'
    ,main: 'lateralus'
  }, {
    name: '{{appName}}'
    ,location: 'scripts'
    ,main: '{{appName}}'
  }, {
    name: '{{appName}}.component.container'
    ,location: 'scripts/components/container'
  }]
});

require([

  '{{appName}}'

], function (

  {{appCtor}}

) {
  window.{{appInstance}} = new {{appCtor}}(document.getElementById('{{appName}}'));
});
