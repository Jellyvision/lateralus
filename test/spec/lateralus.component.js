'use strict';
import chai from 'chai';
import _ from 'lodash-compat';
import Lateralus from '../../src/lateralus';
import { getLateralusApp } from '../utils';

const assert = chai.assert;

describe('Lateralus.Component', function () {
  describe('Prototype', function () {
    describe('dispose()', function () {
      const App = getLateralusApp();
      const app = new App();
      const component = app.addComponent(Lateralus.Component);

      let beforeDisposeWasHeard = false;
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
          const App = getLateralusApp();
          const app = new App();
          let testWasCalled = false;

          const BaseComponent = Lateralus.Component.extend({
            name: 'base',
            lateralusEvents: {
              test: function () {
                testWasCalled = true;
              }
            }
          });

          const ChildComponent = BaseComponent.extend({
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
          const App = getLateralusApp();
          const app = new App();
          let testWasCalled = false;

          const BaseComponent = Lateralus.Component.extend({
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

          const ChildComponent = BaseComponent.extend({
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
