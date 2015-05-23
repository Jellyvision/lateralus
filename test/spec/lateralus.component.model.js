/* global describe, it */
define([

  'chai'
  ,'underscore'
  ,'backbone'
  ,'lateralus'
  ,'../utils'

], function (

  chai
  ,_
  ,Backbone
  ,Lateralus
  ,utils

) {
  'use strict';

  var assert = chai.assert;
  var getLateralusApp = utils.getLateralusApp;

  return function () {
    describe('Lateralus.Component.Model', function () {
      describe('constructor', function () {
        var App = getLateralusApp();
        var app = new App();
        var component = app.addComponent(Lateralus.Component);
        var model = component.initModel(Lateralus.Component.Model);

        it('Is an instance of Backbone.Model', function () {
          assert.instanceOf(model, Backbone.Model);
        });

        it('Is an instance of Lateralus.Component.Model', function () {
          assert.instanceOf(model, Lateralus.Component.Model);
        });
      });
    });
  };
});
