/* global describe, it */
define([

  'chai'
  ,'underscore'
  ,'lateralus'

], function (

  chai
  ,_
  ,Lateralus

) {
  'use strict';

  var assert = chai.assert;

  describe('Bootup', function () {
    it('Framework defines Lateralus constructor', function () {
      assert.isFunction(Lateralus);
    });

    it('Framework defines Lateralus.Component', function () {
      assert.isFunction(Lateralus.Component);
    });

    it('Framework defines Lateralus.Model', function () {
      assert.isFunction(Lateralus.Model);
    });

    it('Framework defines Lateralus.Router', function () {
      assert.isFunction(Lateralus.Router);
    });
  });

  describe('Initialization', function () {
    var App = Lateralus.beget(function () {
      Lateralus.apply(this, arguments);
    });

    var el = document.createElement('div');
    var app = new App(el);

    it('App has root element', function () {
      assert.equal(app.el, el);
    });

    it('App has jQuery reference to root element', function () {
      assert.equal(app.$el[0], el);
    });
  });

  describe('lateralusEvents', function () {
    var App = Lateralus.beget(function () {
      Lateralus.apply(this, arguments);
    });

    var testWasCalled = false;

    _.extend(App.prototype, {
      lateralusEvents: {
        test: function () {
          testWasCalled = true;
        }
      }
    });

    var app = new App(document.createElement('div'));

    it('Captures top-level events', function () {
      app.emit('test');
      assert.isTrue(testWasCalled);
    });

    testWasCalled = false;

    it('Captures Lateralus.Model-level events', function () {
      app.model.emit('test');
      assert.isTrue(testWasCalled);
    });

    testWasCalled = false;

    it('Captures Component-level events', function () {
      var component = app.addComponent(Lateralus.Component);
      component.emit('test');
      assert.isTrue(testWasCalled);
      component.dispose();
    });

    testWasCalled = false;

    it('Captures Component.View-level events', function () {
      var ExtendedComponent = Lateralus.Component.extend({
        name: 'extended'
        ,View: Lateralus.Component.View
      });

      var component = app.addComponent(ExtendedComponent);
      component.view.emit('test');
      assert.isTrue(testWasCalled);
      component.dispose();
    });

    testWasCalled = false;

    it('Captures Component.Model-level events', function () {
      var ExtendedComponent = Lateralus.Component.extend({
        name: 'extended'
        ,View: Lateralus.Component.View
        ,Model: Lateralus.Component.Model
      });

      var component = app.addComponent(ExtendedComponent);
      component.view.model.emit('test');
      assert.isTrue(testWasCalled);
      component.dispose();
    });
  });

});
