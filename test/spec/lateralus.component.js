import chai from 'chai';
import _ from 'lodash-compat';
import Backbone from 'backbone';
import Lateralus from '../../src/lateralus';
import { getLateralusApp } from '../utils';

var assert = chai.assert;

describe('Lateralus.Component', function () {
  describe('Prototype', function () {
    describe('dispose()', function () {
      var App = getLateralusApp();
      var app = new App();
      var component = app.addComponent(Lateralus.Component);

      var beforeDisposeWasHeard = false;
      component.on('beforeDispose', function () {
        beforeDisposeWasHeard = true;
      });

      component.dispose();

      it('Emitted beforeDispose event', function () {
        assert.isTrue(beforeDisposeWasHeard);
      });
    });
  });

  describe('mixins', function () {
    describe('delegateLateralusEvents', function () {
      describe('Inheritance', function () {
        it('Inherits the parent component\'s lateralusEvents map',
            function () {
          var App = getLateralusApp();
          var app = new App();
          var testWasCalled = false;

          var BaseComponent = Lateralus.Component.extend({
            name: 'base',
            lateralusEvents: {
              test: function () {
                testWasCalled = true;
              }
            }
          });

          var ChildComponent = BaseComponent.extend({
            name: 'child',
            lateralusEvents: {
              foo: _.noop
            }
          });

          app.addComponent(ChildComponent);
          app.emit('test');

          assert.isTrue(testWasCalled);
        });

        it('Inherits lateralusEvents from a parent component that also provides values',
            function () {
          var App = getLateralusApp();
          var app = new App();
          var testWasCalled = false;

          var BaseComponent = Lateralus.Component.extend({
            name: 'base',
            lateralusEvents: {
              test: function () {
                testWasCalled = true;
              }
            },

            provide: {
              bar: function () {
                return true;
              }
            }
          });

          var ChildComponent = BaseComponent.extend({
            name: 'child',
            lateralusEvents: {
              foo: _.noop
            }
          });

          app.addComponent(ChildComponent);
          app.emit('test');

          assert.isTrue(testWasCalled);
        });
        });
      });
    });
  });
