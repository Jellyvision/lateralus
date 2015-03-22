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

  describe('Lateralus', function () {
    describe('Static properties', function () {
      it('Has Lateralus constructor', function () {
        assert.isFunction(Lateralus);
      });

      it('Has Lateralus.Component', function () {
        assert.isFunction(Lateralus.Component);
      });

      it('Has Lateralus.Model', function () {
        assert.isFunction(Lateralus.Model);
      });

      it('Has Lateralus.Router', function () {
        assert.isFunction(Lateralus.Router);
      });

      describe('inherit()', function () {
        function Parent () {}
        function Child () {}
        Parent.prototype.foo = function () {};
        Lateralus.inherit(Child, Parent);
        var child = new Child();

        it('Sets up prototype chain between Parent and Child', function () {
          assert.instanceOf(child, Parent);
        });

        it('Passes Parent methods to child', function () {
          assert.equal(child.foo, Parent.prototype.foo);
        });
      });
    });

    describe('Instance properties', function () {
      describe('el', function () {
        var App = getLateraralusApp();
        var el = document.createElement('div');
        var app = new App(el);

        it('Is root element', function () {
          assert.equal(app.el, el);
        });
      });

      describe('$el', function () {
        var App = getLateraralusApp();
        var el = document.createElement('div');
        var app = new App(el);

        it('Is jQuery reference to root element', function () {
          assert.equal(app.$el[0], el);
        });
      });
    });

    describe('Prototype', function () {
      describe('initRouter()', function () {
        var App = getLateraralusApp();
        var app = new App();

        var ExtendedRouter = Lateralus.Router.extend({
          initialize: function (options) {
            this.gotOptions = !!options;
          }
        });

        var router = app.initRouter(ExtendedRouter, {});

        it('Instantiates a Lateralus.Router', function () {
          assert.instanceOf(router, Lateralus.Router);
        });

        it('Passes options to instantiated Lateralus.Router', function () {
          assert.isTrue(router.gotOptions);
        });
      });

      describe('dispose()', function () {
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

      describe('toString()', function () {
        var App = getLateraralusApp();
        var app = new App();

        it('Returns "lateralus"', function () {
          assert.equal(app.toString(), 'lateralus');
        });
      });
    });

    describe('Mixins', function () {
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

      describe('addComponent()', function () {
        var App = getLateraralusApp();
        var app = new App(document.createElement('div'));

        // Need to capture the original value here because it() calls are
        // lazily evaluated.
        var originalComponentCounter = app.componentCounters;
        it('Does not start out with this.componentCounters', function () {
          assert.isUndefined(originalComponentCounter);
        });

        var component = app.addComponent(Lateralus.Component);

        it('Initializes the proper key on this.componentCounters', function () {
          assert.equal(app.componentCounters.component, 0);
        });

        it('Installs a component', function () {
          assert.instanceOf(app.components.component0, Lateralus.Component);
        });

        it('Installs the returned component', function () {
          assert.equal(app.components.component0, component);
        });
      });

      describe('amplify()', function () {
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
    });
  });

  describe('Lateralus.Model', function () {
    describe('Prototype', function () {
      describe('onChange()', function () {
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

        // NOTE: This test was originally written because of a bug wherein
        // global change: handlers were called redundantly.  It is important
        // that count is 1 and not 2:
        // https://github.com/Jellyvision/lateralus/commit/8975b1d3ce52eaad994a7136789d469f181688a6
        it('Calls the global change: handler once', function () {
          assert.equal(count, 1);
        });
      });
    });
  });

});
