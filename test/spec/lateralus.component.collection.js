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
    describe('Lateralus.Component.Collection', function () {
      describe('constructor', function () {
        var App = getLateralusApp();
        var app = new App();
        var component = app.addComponent(Lateralus.Component);
        var collection =
          component.initCollection(Lateralus.Component.Collection);

        it('Is an instance of Backbone.Collection', function () {
          assert.instanceOf(collection, Backbone.Collection);
        });

        it('Is an instance of Lateralus.Component.Collection', function () {
          assert.instanceOf(collection, Lateralus.Component.Collection);
        });
      });

      describe('Prototype (inherited)', function () {
        describe('add()', function () {
          var App = getLateralusApp();
          var app = new App();
          var component = app.addComponent(Lateralus.Component);
          var model = component.initModel(Lateralus.Component.Model);
          var collection =
            component.initCollection(Lateralus.Component.Collection);
          collection.add(model);

          it('Adds a Lateralus.Component.Model instance', function () {
            assert.equal(1, collection.length);
          });
        });
      });
    });
  };
});
