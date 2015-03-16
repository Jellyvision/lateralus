/* global describe, it */
define([

  'chai'
  ,'underscore'
  ,'backbone'
  ,'lateralus'

], function (

  chai
  ,_
  ,Backbone
  ,Lateralus

) {
  'use strict';

  var assert = chai.assert;

  /**
   * @param {Function} [extraConstructorCode]
   */
  function getLateraralusApp (extraConstructorCode) {
    return Lateralus.beget(function () {
      Lateralus.apply(this, arguments);

      if (extraConstructorCode) {
        extraConstructorCode.call(this);
      }
    });
  }

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
    var App = getLateraralusApp();
    var el = document.createElement('div');
    var app = new App(el);

    it('App has root element', function () {
      assert.equal(app.el, el);
    });

    it('App has jQuery reference to root element', function () {
      assert.equal(app.$el[0], el);
    });
  });

  describe('Lateralus teardown', function () {
    var App = getLateraralusApp();
    var app = new App(document.createElement('div'));
    var model = new Backbone.Model();
    app.listenTo(model, 'test', _.noop);
    var component = app.addComponent(Lateralus.Component);
    app.dispose();

    it('Stopped listening to other objects', function () {
      assert.typeOf(model._events.test, 'undefined');
    });

    it('Component is disposed', function () {
      assert.equal(_.keys(component).length, 0);
    });

    it('Has all properties removed', function () {
      assert.equal(_.keys(app).length, 0);
    });

    it('Has fun alias', function () {
      assert.equal(app.dispose, app.spiralOut);
    });
  });

  describe('lateralusEvents', function () {
    var App = getLateraralusApp();
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

  describe('mixin.amplify', function () {
    var App = getLateraralusApp();
    var testWasAmplified = false;
    _.extend(App.prototype, {
      lateralusEvents: {
        'test': function () {
          testWasAmplified = true;
        }
      }
    });

    var app = new App(document.createElement('div'));

    it('Broadcasts a Backbone.Model\'s events globally', function () {
      var model = new Backbone.Model();
      app.amplify(model, 'test');
      model.trigger('test');
      assert.isTrue(testWasAmplified);
    });
  });

  describe('Preventing redundant global model change events', function () {
    var count = 0;
    var App = getLateraralusApp(function () {
      this.model.set('prop1', 'foo');
    });

    _.extend(App.prototype, {
      lateralusEvents: {
        'change:prop1': function () {
          count++;
          this.model.set('prop2', 'bar');
        }
      }
    });

    new App(document.createElement('div'));

    it('Only called the global handler once', function () {
      assert.equal(count, 1);
    });
  });

});
