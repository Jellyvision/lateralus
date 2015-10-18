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

      describe('Static methods', function () {
        describe('beget()', function () {
          describe('Config: Custom model', function () {
            var ExtendedModel = Lateralus.Model.extend({});

            var App = Lateralus.beget(function () {
              Lateralus.apply(this, arguments);
            }, {
              Model: ExtendedModel
            });

            var app = new App();

            it('Uses the specified Lateralus.Model', function () {
              assert.instanceOf(app.model, ExtendedModel);
            });
          });
        });
      });

      describe('Instance properties', function () {
        describe('el', function () {
          var App = getLateralusApp();
          var el = document.createElement('div');
          var app = new App(el);

          it('Is root element', function () {
            assert.equal(app.el, el);
          });
        });

        describe('$el', function () {
          var App = getLateralusApp();
          var el = document.createElement('div');
          var app = new App(el);

          it('Is jQuery reference to root element', function () {
            assert.equal(app.$el[0], el);
          });
        });
      });

      describe('Prototype', function () {
        describe('initRouter()', function () {
          var App = getLateralusApp();
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
          var App = getLateralusApp();
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
          var App = getLateralusApp();
          var app = new App();

          it('Returns internal name', function () {
            assert.equal(app.toString(), 'lateralus');
          });
        });

        describe('shareWith()', function () {
          it('Relays the providers from another Lateralus app', function () {
            var App1 = getLateralusApp();
            var App2 = getLateralusApp();

            _.extend(App1.prototype, {
              provide: {
                test: function () {
                  return true;
                }
              }
            });

            var app1 = new App1();
            var app2 = new App2();

            app1.shareWith(app2, 'test');

            var expected = true;
            var actual = app2.collectOne('test');

            assert.equal(expected, actual);
          });
        });
      });

      describe('Mixins', function () {
        describe('lateralusEvents', function () {
          var App = getLateralusApp();
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
          var App = getLateralusApp();
          var app = new App(document.createElement('div'));

          // Need to capture the original value here because it() calls are
          // lazily evaluated.
          var originalComponentCounter = app.componentCounters;
          it('Does not start out with this.componentCounters', function () {
            assert.isUndefined(originalComponentCounter);
          });

          var component = app.addComponent(Lateralus.Component);

          it('Initializes the proper key on this.componentCounters'
              ,function () {
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
          describe('Basic amplify functionality', function () {
            var App = getLateralusApp();
            var testWasAmplified = false;
            _.extend(App.prototype, {
              lateralusEvents: {
                test: function () {
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

        describe('listenFor()', function () {
          var App = getLateralusApp();
          var app = new App();
          var testWasCalled = false;

          app.listenFor('test', function () {
            testWasCalled = true;
          });

          app.emit('test');

          it('Responds to top-level events', function () {
            assert.isTrue(testWasCalled);
          });
        });

        describe('collect()', function () {
          describe('Single providers', function () {
            var App = getLateralusApp();

            _.extend(App.prototype, {
              provide: {
                test: function () {
                  return 1;
                }
              }
            });

            var app = new App();
            var collectedTest = app.collect('test');

            it('Collects an array', function () {
              assert.isArray(collectedTest);
            });

            it('Collects an Array with correct values', function () {
              assert.deepEqual(collectedTest, [1]);
            });
          });

          describe('Multiple providers', function () {
            var App = getLateralusApp();

            _.extend(App.prototype, {
              provide: {
                test: function () {
                  return 1;
                }
              }
            });

            var app = new App();
            var ComponentSubclass = Lateralus.Component.extend({
              name: 'provider'
              ,provide: {
                test: function () {
                  return 2;
                }
              }
            });

            app.addComponent(ComponentSubclass);
            var collectedTest = app.collect('test');

            it('Collects an Array with correct values', function () {
              assert.deepEqual(collectedTest, [1, 2]);
            });
          });

          describe('Argument passing', function () {
            var App = getLateralusApp();

            _.extend(App.prototype, {
              provide: {
                test: function (arg) {
                  return arg;
                }
              }
            });

            var app = new App();
            var collectedTest = app.collect('test', 5);

            it('Returns values based on provided arguments', function () {
              assert.deepEqual(collectedTest, [5]);
            });
          });

          describe('Returned array contains no undefined values', function () {
            var App = getLateralusApp();

            _.extend(App.prototype, {
              provide: {
                test: function () {
                  return;
                }
              }
            });

            it('Only returns defined values', function () {
              var ExtendedComponent = Lateralus.Component.extend({
                name: 'extended'
                ,provide: {
                  test: function () {
                    return 1;
                  }
                }
              });

              var app = new App();
              app.addComponent(ExtendedComponent);

              var collectedTest = app.collect('test');
              assert.deepEqual(collectedTest, [1]);
            });

            it('Returns falsy values except for undefined', function () {
              var ExtendedComponent1 = Lateralus.Component.extend({
                name: 'extended-1'
                ,provide: {
                  test: function () {
                    return false;
                  }
                }
              });

              var ExtendedComponent2 = Lateralus.Component.extend({
                name: 'extended-2'
                ,provide: {
                  test: function () {
                    return 0;
                  }
                }
              });

              var app = new App();
              app.addComponent(ExtendedComponent1);
              app.addComponent(ExtendedComponent2);

              var collectedTest = app.collect('test');
              assert.deepEqual(collectedTest, [false, 0]);
            });
          });
        });

        describe('collectOne()', function () {
          describe('Basic usage', function () {
            var App = getLateralusApp();

            _.extend(App.prototype, {
              provide: {
                test: function () {
                  return 1;
                }
              }
            });

            var app = new App();
            var collectedTest = app.collectOne('test');

            it('Collects an Array with correct values', function () {
              assert.equal(collectedTest, 1);
            });
          });
        });
      });

      describe('delegateLateralusEvents()', function () {
        describe('Lateralus.prototype is not modified', function () {
          var App = getLateralusApp();
          _.extend(App.prototype, {
            lateralusEvents: {}
          });

          it('Lateralus.prototype.lateralusEvents starts off undefined',
              function () {
            assert.isUndefined(Lateralus.prototype.lateralusEvents);
          });

          // jshint maxlen: 120
          it('Lateralus.prototype.lateralusEvents remains undefined after delegateLateralusEvents is called',
              function () {
            assert.isUndefined(Lateralus.prototype.lateralusEvents);
          });
        });

        describe('Lateralus events are delegated', function () {
          var App = getLateralusApp();
          var lateralusEventsTestWasCalled = false;
          var modelEventsTestWasCalled = false;

          _.extend(App.prototype, {
            lateralusEvents: {
              lateralusTest: function () {
                lateralusEventsTestWasCalled = true;
              }
            }

            ,modelEvents: {
              modelTest: function () {
                modelEventsTestWasCalled = true;
              }
            }
          });

          var app = new App();
          app.emit('lateralusTest');

          it('Wires up lateralusEvents', function () {
            assert.isTrue(lateralusEventsTestWasCalled);
          });

          app.model.emit('modelTest');

          it('Wires up modelEvents', function () {
            assert.isTrue(modelEventsTestWasCalled);
          });
        });
      });

      describe('initModel()', function () {
        var App = getLateralusApp();
        var app = new App();

        var recievedOptions;
        var ExtendedModel = Lateralus.Model.extend({
          initialize: function (attributes, options) {
            recievedOptions = options;
          }
        });

        var model = app.initModel(ExtendedModel, { foo: true }, { bar: true });

        it('Inherits from base class', function () {
          assert.instanceOf(model, Lateralus.Model);
        });

        it('Recieves a passed-in attribute', function () {
          assert.isTrue(model.get('foo'));
        });

        it('Recieves passed-in options', function () {
          assert.isTrue(recievedOptions.bar);
        });

        it('Has a reference to central Lateralus Object', function () {
          assert.equal(app, model.lateralus);
        });
      });
    });
  };
});
